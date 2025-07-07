import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { parseStreamInput } from '@/lib/streamParser'
import { filterSponsoredStreams, isSponsoredStream } from '@/lib/sponsoredStreams'
import { muteManager } from '@/lib/muteManager'
import { getStreamLimit } from '@/lib/subscription'
import type { 
  Stream, 
  StreamStore, 
  StreamInput, 
  GridLayout, 
  Quality,
  StreamEvent 
} from '@/types/stream'
import type { Subscription } from '@/lib/subscription'
import { createStreamError, ERROR_CODES } from '@/types/errors'

// Performance optimization: Calculate next position (exclude sponsored streams)
const calculateNextPosition = (streams: readonly Stream[]): number => {
  return filterSponsoredStreams([...streams]).length
}

// Generate unique stream ID
const generateStreamId = (): string => {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validate stream input
const validateStreamInput = (input: StreamInput): boolean => {
  if (!input.channelName?.trim()) return false
  if (!input.platform) return false
  if (input.volume !== undefined && (input.volume < 0 || input.volume > 100)) return false
  return true
}

// Create stream from input
const createStream = (input: StreamInput): Stream => {
  const now = new Date()
  return {
    id: generateStreamId(),
    channelName: input.channelName.trim(),
    platform: input.platform,
    ...(input.channelId && { channelId: input.channelId }),
    quality: input.quality || 'auto',
    volume: input.volume || 50,
    position: 0, // Will be set by the store
    isActive: true,
    createdAt: now,
    lastUpdated: now,
  }
}

// Analytics helper
const trackEvent = (event: StreamEvent): void => {
  // In a real app, this would send to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Stream Event:', event)
  }
}

// Legacy support for string input (backward compatibility)
const convertLegacyInput = (input: string): StreamInput | null => {
  const parsed = parseStreamInput(input)
  if (!parsed) return null
  
  return {
    channelName: parsed.channelName,
    platform: parsed.platform,
    ...(parsed.channelId && { channelId: parsed.channelId }),
  }
}

// Modern Zustand store with middleware for 2025
export const useStreamStore = create<StreamStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          streams: [],
          activeStreamId: null,
          gridLayout: 'grid-2x2' as GridLayout,
          primaryStreamId: null,
          isLoading: false,
          error: null,
          
          // Actions with proper error handling and validation
          addStream: async (input: StreamInput | string, subscription?: Subscription | null): Promise<boolean> => {
            try {
              set((state) => {
                state.isLoading = true
                state.error = null
              })
              
              // Handle legacy string input
              const streamInput = typeof input === 'string' ? convertLegacyInput(input) : input
              
              if (!streamInput || !validateStreamInput(streamInput)) {
                const error = createStreamError(
                  ERROR_CODES.VALIDATION_FORMAT,
                  'Invalid stream input provided',
                  { channelName: typeof input === 'string' ? input : input.channelName }
                )
                set((state) => {
                  state.error = error.message
                  state.isLoading = false
                })
                return false
              }
              
              // Check for duplicates (exclude sponsored streams from duplicate check)
              const { streams } = get()
              const userStreams = filterSponsoredStreams([...streams])
              const isDuplicate = userStreams.some(
                (stream) => 
                  stream.channelName.toLowerCase() === streamInput.channelName.toLowerCase() &&
                  stream.platform === streamInput.platform
              )
              
              if (isDuplicate) {
                const error = createStreamError(
                  ERROR_CODES.STREAM_INVALID_URL,
                  'Stream already exists',
                  { channelName: streamInput.channelName, platform: streamInput.platform }
                )
                set((state) => {
                  state.error = error.message
                  state.isLoading = false
                })
                return false
              }

              // Check subscription-based stream limits
              const streamLimit = getStreamLimit(subscription || null)
              if (userStreams.length >= streamLimit) {
                const error = createStreamError(
                  ERROR_CODES.STREAM_LIMIT_EXCEEDED,
                  `Stream limit reached. ${subscription ? `Your ${subscription.product_name} plan allows up to ${streamLimit} streams.` : `Free users can add up to ${streamLimit} streams. Upgrade for more.`}`,
                  { limit: streamLimit, current: userStreams.length }
                )
                set((state) => {
                  state.error = error.message
                  state.isLoading = false
                })
                return false
              }
              
              const newStream = createStream(streamInput)
              
              set((state) => {
                newStream.position = calculateNextPosition(state.streams)
                state.streams.push(newStream)
                state.isLoading = false
                
                // Auto-set as active if it's the first stream
                if (state.streams.length === 1) {
                  state.activeStreamId = newStream.id
                  state.primaryStreamId = newStream.id
                }
              })
              
              // After adding the stream, check if we need to unmute based on viewer count
              // This is done outside the immer update to avoid issues with async operations
              setTimeout(() => {
                const { streams } = get()
                const userStreams = filterSponsoredStreams([...streams])

                // Only proceed if this is the first stream or all streams are muted
                const allMuted = userStreams.every(s => muteManager.getMuteState(s.id))
                if (userStreams.length === 1 && allMuted) {
                  // Only auto-unmute if this is the very first stream
                  muteManager.setOnlyUnmuted(userStreams[0]!.id)
                } else if (userStreams.length > 1) {
                  // Ensure only one stream is unmuted when multiple streams exist
                  muteManager.enforceOnlyOneUnmuted()
                }
              }, 200) // Increased delay to ensure player registration
              
              // Track analytics
              trackEvent({
                type: 'stream_added',
                streamId: newStream.id,
                metadata: { platform: streamInput.platform, channelName: streamInput.channelName },
                timestamp: new Date(),
              })
              
              return true
            } catch (error) {
              const streamError = createStreamError(
                ERROR_CODES.STREAM_LOAD_FAILED,
                error instanceof Error ? error.message : 'Failed to add stream',
                { channelName: typeof input === 'string' ? input : input.channelName }
              )
              set((state) => {
                state.error = streamError.message
                state.isLoading = false
              })
              return false
            }
          },
          
          removeStream: (streamId: string) => {
            // Prevent removal of sponsored streams
            if (isSponsoredStream(streamId)) {
              console.warn('Cannot remove sponsored stream:', streamId)
              return
            }
            
            set((state) => {
              state.streams = state.streams.filter(s => s.id !== streamId)
              
              // Update active stream if removed (prefer user streams over sponsored)
              if (state.activeStreamId === streamId) {
                const userStreams = filterSponsoredStreams([...state.streams])
                state.activeStreamId = userStreams.length > 0 ? userStreams[0]!.id : (state.streams.length > 0 ? state.streams[0]!.id : null)
              }
              
              // Update primary stream if removed (prefer user streams over sponsored)
              if (state.primaryStreamId === streamId) {
                const userStreams = filterSponsoredStreams([...state.streams])
                state.primaryStreamId = userStreams.length > 0 ? userStreams[0]!.id : (state.streams.length > 0 ? state.streams[0]!.id : null)
              }
            })
            
            // Clean up mute manager
            muteManager.unregisterPlayer(streamId)
            
            // Track analytics
            trackEvent({
              type: 'stream_removed',
              streamId,
              timestamp: new Date(),
            })
          },
          
          setStreamQuality: (streamId: string, quality: Quality) => {
            set((state) => {
              const stream = state.streams.find(s => s.id === streamId)
              if (stream) {
                stream.quality = quality
                stream.lastUpdated = new Date()
              }
            })
            
            trackEvent({
              type: 'quality_changed',
              streamId,
              metadata: { quality },
              timestamp: new Date(),
            })
          },
          
          setStreamVolume: (streamId: string, volume: number) => {
            if (volume < 0 || volume > 100) return
            
            set((state) => {
              const stream = state.streams.find(s => s.id === streamId)
              if (stream) {
                stream.volume = volume
                stream.lastUpdated = new Date()
              }
            })
          },
          
          toggleStreamMute: (streamId: string) => {
            // Delegate to muteManager
            muteManager.toggleMute(streamId)
          },
          
          setActiveStream: (streamId: string) => {
            set((state) => {
              state.activeStreamId = streamId
            })
          },
          
          setPrimaryStream: (streamId: string) => {
            set((state) => {
              state.primaryStreamId = streamId
            })
          },
          
          setGridLayout: (layout: GridLayout) => {
            set((state) => {
              state.gridLayout = layout
            })
            
            trackEvent({
              type: 'layout_changed',
              metadata: { layout },
              timestamp: new Date(),
            })
          },
          
          reorderStreams: (streams: readonly Stream[]) => {
            set((state) => {
              state.streams = streams.map((stream, index) => ({
                ...stream,
                position: index,
                // Don't update lastUpdated for position changes to prevent re-renders
              })) as Stream[]
            })
          },
          
          clearAllStreams: () => {
            set((state) => {
              // Only clear user streams, keep sponsored streams
              state.streams = state.streams.filter(s => s.isSponsored)
              
              // Reset active and primary stream IDs only if no streams remain
              if (state.streams.length === 0) {
                state.activeStreamId = null
                state.primaryStreamId = null
              } else {
                // If only sponsored streams remain, set them as active/primary
                state.activeStreamId = state.streams[0]?.id || null
                state.primaryStreamId = state.streams[0]?.id || null
              }
              
              state.error = null
            })
          },
          
          setLoading: (loading: boolean) => {
            set((state) => {
              state.isLoading = loading
            })
          },
          
          setError: (error: string | null) => {
            set((state) => {
              state.error = error
            })
          },
        }))
      ),
      {
        name: 'stream-store',
        version: 1,
        partialize: (state) => ({
          streams: state.streams,
          gridLayout: state.gridLayout,
          primaryStreamId: state.primaryStreamId,
        }),
      }
    ),
    {
      name: 'StreamStore',
    }
  )
)

// Export types for external use
export type { Stream, StreamStore, StreamInput, GridLayout, Platform, Quality } from '@/types/stream'