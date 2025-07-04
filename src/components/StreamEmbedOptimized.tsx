'use client'

import { useEffect, useRef, useCallback, memo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { cn } from '@/lib/utils'

interface StreamEmbedProps {
  stream: Stream
}

declare global {
  interface Window {
    Twitch: any
  }
}

// Singleton to manage Twitch script loading
class TwitchScriptManager {
  private static instance: TwitchScriptManager
  private scriptLoaded = false
  private loadingPromise: Promise<void> | null = null

  static getInstance() {
    if (!TwitchScriptManager.instance) {
      TwitchScriptManager.instance = new TwitchScriptManager()
    }
    return TwitchScriptManager.instance
  }

  async loadScript(): Promise<void> {
    if (this.scriptLoaded) return
    
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="embed.twitch.tv"]')
      if (existingScript || window.Twitch?.Embed) {
        this.scriptLoaded = true
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://embed.twitch.tv/embed/v1.js'
      script.async = true
      
      script.onload = () => {
        this.scriptLoaded = true
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Twitch script'))
      }
      
      document.head.appendChild(script)
    })

    return this.loadingPromise
  }
}

function StreamEmbedOptimizedInner({ stream }: StreamEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const embedInstanceRef = useRef<any>(null)
  const isMountedRef = useRef(true)
  
  const { 
    toggleStreamMute, 
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
  // Get live status for Twitch streams with longer refresh interval
  const { status: twitchStatus } = useSingleChannelStatus(
    stream.platform === 'twitch' ? stream.channelName : '',
    { 
      enabled: stream.platform === 'twitch',
      refreshInterval: 300000 // 5 minutes
    }
  )

  // Cleanup function
  const cleanup = useCallback(() => {
    if (embedInstanceRef.current?.destroy) {
      try {
        embedInstanceRef.current.destroy()
      } catch (e) {
        console.error('Error destroying embed:', e)
      }
    }
    
    if (embedRef.current) {
      embedRef.current.innerHTML = ''
    }
    
    playerRef.current = null
    embedInstanceRef.current = null
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [cleanup])
  
  // Separate effect for initial setup - only runs when stream details change
  useEffect(() => {
    if (!embedRef.current) return
    
    let cancelled = false
    
    const setupEmbed = async () => {
      if (cancelled || !isMountedRef.current) return
      
      // Clear previous content
      cleanup()
      
      if (stream.platform === 'twitch') {
        try {
          await TwitchScriptManager.getInstance().loadScript()
          
          if (cancelled || !isMountedRef.current || !window.Twitch?.Embed || !embedRef.current) return
          
          const isMobile = window.innerWidth < 768
          
          embedInstanceRef.current = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost', 'streamyyy.com', 'www.streamyyy.com'],
            autoplay: true,
            muted: false, // Start unmuted, we'll control via API
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            // Performance optimizations
            quality: isMobile ? 'auto' : '720p',
            controls: true
          })
          
          if (embedInstanceRef.current?.addEventListener) {
            embedInstanceRef.current.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
              if (!cancelled && isMountedRef.current) {
                playerRef.current = embedInstanceRef.current.getPlayer()
                if (playerRef.current?.setMuted) {
                  playerRef.current.setMuted(stream.muted)
                }
              }
            })
          }
        } catch (error) {
          console.error('Error loading Twitch embed:', error)
        }
      } else if (stream.platform === 'youtube' && embedRef.current) {
        const iframe = document.createElement('iframe')
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%'
        iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=0&enablejsapi=1&modestbranding=1&rel=0&playsinline=1`
        iframe.setAttribute('frameborder', '0')
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        iframe.setAttribute('allowfullscreen', 'true')
        
        embedRef.current.appendChild(iframe)

        // Set initial mute state after iframe loads
        iframe.onload = () => {
          setTimeout(() => {
            if (iframe.contentWindow) {
              const command = stream.muted ? 'mute' : 'unMute'
              iframe.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command }),
                'https://www.youtube.com'
              )
            }
          }, 1000) // Wait for YouTube player to initialize
        }
      } else if (stream.platform === 'rumble' && embedRef.current) {
        const iframe = document.createElement('iframe')
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%'
        iframe.src = `https://rumble.com/embed/${stream.channelId}/?pub=4`
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('allowfullscreen', 'true')
        
        embedRef.current.appendChild(iframe)
      }
    }
    
    setupEmbed()
    
    return () => {
      cancelled = true
    }
  }, [stream.channelName, stream.channelId, stream.platform]) // Removed cleanup dependency to prevent unnecessary re-renders
  
  // Handle mute state changes
  useEffect(() => {
    if (stream.platform === 'twitch' && playerRef.current?.setMuted) {
      playerRef.current.setMuted(stream.muted)
    } else if (stream.platform === 'youtube' && embedRef.current) {
      // For YouTube, we need to use postMessage to control the player
      const iframe = embedRef.current.querySelector('iframe')
      if (iframe && iframe.contentWindow) {
        const command = stream.muted ? 'mute' : 'unMute'
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command }),
          'https://www.youtube.com'
        )
      }
    }
  }, [stream.muted, stream.platform])
  
  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleStreamMute(stream.id)
  }, [stream.id, toggleStreamMute])
  
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    removeStream(stream.id)
  }, [stream.id, removeStream])
  
  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (stream.id === primaryStreamId) {
      setPrimaryStream('')
    } else {
      setPrimaryStream(stream.id)
    }
  }, [stream.id, primaryStreamId, setPrimaryStream])
  
  // Show viewer count for live streams
  const viewerCount = twitchStatus?.isLive ? twitchStatus.viewerCount : 0
  
  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="absolute inset-0 bg-black overflow-hidden group">
      {/* Stream Controls - More prominent on mobile */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-2 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto" style={{ height: '60px' }}>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium flex items-center gap-1.5">
            {stream.platform === 'youtube' && <Youtube className="w-4 h-4" />}
            {stream.platform === 'twitch' && <Twitch className="w-4 h-4" />}
            {stream.channelName}
          </span>

          {stream.platform === 'twitch' && twitchStatus?.isLive && (
            <LiveIndicator
              isLive={true}
              viewerCount={viewerCount}
              size="sm"
            />
          )}
        </div>
        
        <div className="flex items-center gap-2 md:gap-1">
          <button
            onClick={handleMuteToggle}
            className="p-3 md:p-1.5 rounded-lg md:rounded-md bg-black/60 hover:bg-black/80 text-white transition-colors min-h-[48px] md:min-h-auto min-w-[48px] md:min-w-auto flex items-center justify-center active:scale-95"
            aria-label={stream.muted ? "Unmute" : "Mute"}
          >
            {stream.muted ? <VolumeX className="w-5 h-5 md:w-4 md:h-4" /> : <Volume2 className="w-5 h-5 md:w-4 md:h-4" />}
          </button>
          
          <button
            onClick={handleMaximize}
            className="p-3 md:p-1.5 rounded-lg md:rounded-md bg-black/60 hover:bg-black/80 text-white transition-colors min-h-[48px] md:min-h-auto min-w-[48px] md:min-w-auto flex items-center justify-center active:scale-95"
            aria-label="Toggle primary stream"
          >
            <Maximize2 className="w-5 h-5 md:w-4 md:h-4" />
          </button>
          
          <button
            onClick={handleRemove}
            className="p-3 md:p-1.5 rounded-lg md:rounded-md bg-black/60 hover:bg-black/80 text-white transition-colors min-h-[48px] md:min-h-auto min-w-[48px] md:min-w-auto flex items-center justify-center active:scale-95"
            aria-label="Remove stream"
          >
            <X className="w-5 h-5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
      
      {/* Mobile-optimized view count */}
      {stream.platform === 'twitch' && twitchStatus?.isLive && viewerCount > 0 && (
        <div className="absolute bottom-2 left-2 z-10 md:hidden">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-xs">
            <Users className="w-3 h-3" />
            {viewerCount.toLocaleString()}
          </div>
        </div>
      )}
      
      {/* Embed Container */}
      <div
        ref={embedRef}
        className={cn(
          "absolute inset-0 w-full h-full stream-embed-container",
          isMobile ? "mobile-stream-embed" : ""
        )}
      />
    </div>
  )
}

// Memoize to prevent re-renders on mute changes
const StreamEmbedOptimized = memo(StreamEmbedOptimizedInner, (prevProps, nextProps) => {
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform &&
    prevProps.stream.channelId === nextProps.stream.channelId
    // Don't include muted - we handle that via useEffect
  )
})

export default StreamEmbedOptimized