'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users, AlertCircle } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import MobileStreamControls from './MobileStreamControls'
import { haptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'
import { useStreamError, StreamErrorHandler } from '@/lib/streamErrorHandler'
import { useMuteState, muteManager } from '@/lib/muteManager'

interface StreamEmbedProps {
  stream: Stream
}

declare global {
  interface Window {
    Twitch: any
  }
}

function StreamEmbedInner({ stream }: StreamEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  
  // Use new mute system
  const [streamMuted, toggleMute] = useMuteState(stream.id)
  
  const { 
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
  const { error, hasError, registerError, clearError, userFriendlyMessage } = useStreamError(stream.id)
  
  // Stable mobile detection function - no state needed
  const isMobileDevice = () => window.innerWidth < 768
  
  // Get live status for Twitch streams
  const { status: twitchStatus } = useSingleChannelStatus(
    stream.platform === 'twitch' ? stream.channelName : '',
    { enabled: stream.platform === 'twitch' }
  )
  
  useEffect(() => {
    if (!embedRef.current) return
    
    // Clear previous content
    embedRef.current.innerHTML = ''
    
    if (stream.platform === 'twitch') {
      // Load Twitch embed script
      const script = document.createElement('script')
      script.src = 'https://embed.twitch.tv/embed/v1.js'
      script.async = true
      
      script.onload = () => {
        if (window.Twitch && embedRef.current) {
          const embed = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost', 'streamyyy.com', 'ampsummer.com'],
            autoplay: true,
            muted: true, // Always start muted, will be controlled separately
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            controls: false, // Disable native controls, use custom UI
            // Mobile-specific optimizations
            ...(isMobileDevice() && {
              quality: 'auto',
              controls: false // Disable native controls, use custom UI
            })
          })
          
          // Additional mobile iframe styling after embed creation
          setTimeout(() => {
            if (embedRef.current && isMobileDevice()) {
              const iframe = embedRef.current.querySelector('iframe')
              if (iframe) {
                iframe.style.objectFit = 'cover'
                iframe.style.objectPosition = 'center'
              }
            }
          }, 100)
          
          embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
            playerRef.current = embed.getPlayer()
            // Register with mute manager
            if (playerRef.current) {
              muteManager.registerPlayer(stream.id, playerRef.current, 'twitch')
            }
          })
          
          // Handle offline streams and errors
          embed.addEventListener(window.Twitch.Embed.OFFLINE, () => {
            registerError({
              type: 'offline',
              message: 'Stream is offline',
              channelName: stream.channelName,
              platform: stream.platform
            })
          })
          
          // Add error handling for player errors
          if (embed.getPlayer) {
            const player = embed.getPlayer()
            if (player && player.addEventListener) {
              player.addEventListener(window.Twitch.Player.OFFLINE, () => {
                registerError({
                  type: 'offline',
                  message: 'Player went offline',
                  channelName: stream.channelName,
                  platform: stream.platform
                })
              })
              
              player.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
                const errorType = StreamErrorHandler.parseAmazonIVSError(error?.message || 'Unknown error')
                registerError({
                  type: errorType,
                  message: error?.message || 'Player error occurred',
                  channelName: stream.channelName,
                  platform: stream.platform
                })
              })
            }
          }
        }
      }
      
      document.body.appendChild(script)
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    } else if (stream.platform === 'youtube') {
      // YouTube embed
      const iframe = document.createElement('iframe')
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.style.position = 'absolute'
      iframe.style.top = '0'
      iframe.style.left = '0'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=1&enablejsapi=1&modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}&widget_referrer=${window.location.href}`
      iframe.setAttribute('frameborder', '0')
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.setAttribute('allowfullscreen', 'true')
      iframe.id = `youtube-player-${stream.id}`
      
      embedRef.current.appendChild(iframe)
      
      // Store iframe reference for mute control
      playerRef.current = iframe
      
      // Register with mute manager after iframe loads
      iframe.onload = () => {
        // Wait for YouTube player to initialize
        setTimeout(() => {
          muteManager.registerPlayer(stream.id, iframe, 'youtube')
        }, 1000)
      }
    } else if (stream.platform === 'rumble') {
      // Rumble embed
      const iframe = document.createElement('iframe')
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.style.position = 'absolute'
      iframe.style.top = '0'
      iframe.style.left = '0'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.src = `https://rumble.com/embed/${stream.channelId}/?pub=4`
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allowfullscreen', 'true')
      
      embedRef.current.appendChild(iframe)
    }
    
    return () => {
      if (embedRef.current) {
        embedRef.current.innerHTML = ''
      }
      // Cleanup mute manager
      muteManager.unregisterPlayer(stream.id)
    }
  }, [stream.channelName, stream.channelId, stream.platform])
  
  // Clear errors when stream loads successfully
  useEffect(() => {
    if (playerRef.current && hasError) {
      clearError()
    }
  }, [playerRef.current, hasError, clearError])
  
  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])
  
  // No longer need a separate effect for mute state - it's handled by muteManager
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMute()
  }
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeStream(stream.id)
  }
  
  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPrimaryStream(stream.id)
  }
  
  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (embedRef.current) {
      if (embedRef.current.requestFullscreen) {
        embedRef.current.requestFullscreen()
      } else if ((embedRef.current as any).webkitRequestFullscreen) {
        (embedRef.current as any).webkitRequestFullscreen()
      } else if ((embedRef.current as any).mozRequestFullScreen) {
        (embedRef.current as any).mozRequestFullScreen()
      }
    }
  }
  
  const getPlatformIcon = () => {
    switch (stream.platform) {
      case 'twitch':
        return <Twitch size={14} />
      case 'youtube':
        return <Youtube size={14} />
      case 'rumble':
        return <span className="text-xs font-bold">R</span>
      default:
        return null
    }
  }
  
  return (
    <div className="relative w-full h-full group rounded-2xl overflow-hidden bg-black transform-gpu">
      {/* Properly sized embed container */}
      <div 
        className="w-full h-full rounded-2xl overflow-hidden relative stream-embed-container"
      >
        <div 
          ref={embedRef} 
          className={cn(
            "w-full h-full",
            isMobileDevice() && "absolute inset-0"
          )} 
        />
      </div>
      
      {/* Stream Header Info */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/20">
            <div className="text-white/90">{getPlatformIcon()}</div>
            <span className="text-white text-xs sm:text-sm font-medium tracking-tight truncate max-w-[100px] sm:max-w-none">{stream.channelName}</span>
          </div>
          {stream.platform === 'twitch' && twitchStatus?.isLive && (
            <LiveIndicator 
              isLive={true} 
              viewerCount={twitchStatus.viewerCount}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Mobile Controls - Show on mobile, Desktop Controls - Show on desktop */}
      {isMobileDevice() ? (
        <MobileStreamControls
          streamId={stream.id}
          channelName={stream.channelName}
          platform={stream.platform}
          muted={streamMuted}
          isPrimary={primaryStreamId === stream.id}
          onMuteToggle={toggleMute}
          onFullscreen={() => handleFullscreen({ stopPropagation: () => {} } as React.MouseEvent)}
          onSetPrimary={() => setPrimaryStream(stream.id)}
          onRemove={() => removeStream(stream.id)}
        />
      ) : (
        <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-100 group-hover:opacity-100 transition-all duration-200 z-20">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={(e) => {
                handleMuteToggle(e)
                haptic.light()
              }}
              className={cn(
                "p-2.5 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg border transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]",
                streamMuted 
                  ? "from-red-500/30 to-red-600/30 border-red-400/40 hover:from-red-500/40 hover:to-red-600/40 text-red-100"
                  : "from-blue-500/30 to-blue-600/30 border-blue-400/40 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-100"
              )}
              title={streamMuted ? 'Unmute' : 'Mute'}
            >
              {streamMuted ? <VolumeX size={16} className="sm:w-5 sm:h-5" /> : <Volume2 size={16} className="sm:w-5 sm:h-5" />}
            </button>
            
            <button
              onClick={(e) => {
                handleFullscreen(e)
                haptic.light()
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-400/40 hover:from-green-500/40 hover:to-green-600/40 text-green-100 shadow-lg transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]"
              title="Fullscreen"
            >
              <Maximize size={16} className="sm:w-5 sm:h-5" />
            </button>
            
            {primaryStreamId !== stream.id && (
              <button
                onClick={(e) => {
                  handleMaximize(e)
                  haptic.medium()
                }}
                className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-100 shadow-lg transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]"
                title="Set as primary"
              >
                <Maximize2 size={16} className="sm:w-5 sm:h-5" />
              </button>
            )}
            
            <button
              onClick={(e) => {
                handleClose(e)
                haptic.heavy()
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-red-500/40 to-red-600/40 border border-red-400/50 hover:from-red-500/50 hover:to-red-600/50 text-red-100 shadow-lg transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]"
              title="Remove stream"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6 max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Stream Unavailable</h3>
            <p className="text-white/80 text-sm mb-4">{userFriendlyMessage}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={clearError}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => removeStream(stream.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stream Info Overlay */}
      {stream.platform === 'twitch' && twitchStatus?.isLive && twitchStatus.gameName && (
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="space-y-1">
            <p className="text-white text-xs sm:text-sm font-medium truncate">
              {twitchStatus.title}
            </p>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="truncate">Playing {twitchStatus.gameName}</span>
              {twitchStatus.viewerCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {twitchStatus.viewerCount.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Memoize the component - mute state is now handled separately
const StreamEmbed = memo(StreamEmbedInner, (prevProps, nextProps) => {
  // Only re-render if these properties change
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform &&
    prevProps.stream.channelId === nextProps.stream.channelId &&
    prevProps.stream.volume === nextProps.stream.volume &&
    prevProps.stream.quality === nextProps.stream.quality
  )
})

export default StreamEmbed