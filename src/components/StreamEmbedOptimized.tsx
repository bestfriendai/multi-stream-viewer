'use client'

import { useEffect, useRef, useCallback, memo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { cn } from '@/lib/utils'
import { useMuteState, muteManager } from '@/lib/muteManager'

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
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
  // Use new mute system
  const [streamMuted, toggleMute] = useMuteState(stream.id)
  
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
      // Cleanup muteManager on unmount
      muteManager.unregisterPlayer(stream.id)
    }
  }, [cleanup, stream.platform, stream.id])
  
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
          
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
          
          embedInstanceRef.current = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost', 'streamyyy.com', 'www.streamyyy.com'],
            autoplay: true,
            muted: true, // Always start muted, we'll control via API
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
                if (playerRef.current) {
                  muteManager.registerPlayer(stream.id, playerRef.current, 'twitch')
                }
              }
            })
            
            // Handle offline streams and errors
            embedInstanceRef.current.addEventListener(window.Twitch.Embed.OFFLINE, () => {
              console.log(`Stream ${stream.channelName} is offline`)
            })
            
            // Add error handling for player errors
            setTimeout(() => {
              if (!cancelled && embedInstanceRef.current?.getPlayer) {
                const player = embedInstanceRef.current.getPlayer()
                if (player && player.addEventListener) {
                  player.addEventListener(window.Twitch.Player.OFFLINE, () => {
                    console.log(`Player for ${stream.channelName} went offline`)
                  })
                  
                  player.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
                    console.warn(`Player error for ${stream.channelName}:`, error)
                  })
                }
              }
            }, 1000) // Wait for player to be ready
          }
        } catch (error) {
          console.error('Error loading Twitch embed:', error)
        }
      } else if (stream.platform === 'youtube' && embedRef.current) {
        const iframe = document.createElement('iframe')
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%'
        iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=1&enablejsapi=1&modestbranding=1&rel=0&playsinline=1`
        iframe.setAttribute('frameborder', '0')
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        iframe.setAttribute('allowfullscreen', 'true')
        
        embedRef.current.appendChild(iframe)

        // Register YouTube iframe with muteManager after it loads
        iframe.onload = () => {
          setTimeout(() => {
            if (iframe.contentWindow) {
              muteManager.registerPlayer(stream.id, iframe, 'youtube')
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
  
  // mute state changes are now handled by muteManager internally
  
  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMute()
  }, [toggleMute])
  
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
  
  // Stable mobile detection function - no state needed to prevent re-renders
  const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }

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
            aria-label={streamMuted ? "Unmute" : "Mute"}
          >
            {streamMuted ? <VolumeX className="w-5 h-5 md:w-4 md:h-4" /> : <Volume2 className="w-5 h-5 md:w-4 md:h-4" />}
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
          isMobileDevice() ? "mobile-stream-embed" : ""
        )}
      />
    </div>
  )
}

// Memoize to prevent re-renders (exclude muted from stream to prevent unnecessary re-renders)
const StreamEmbedOptimized = memo(StreamEmbedOptimizedInner, (prevProps, nextProps) => {
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform &&
    prevProps.stream.channelId === nextProps.stream.channelId &&
    prevProps.stream.volume === nextProps.stream.volume &&
    prevProps.stream.quality === nextProps.stream.quality
  )
})

export default StreamEmbedOptimized