'use client'

import { useEffect, useRef, useCallback, memo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'

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

const StreamEmbedOptimized = memo(({ stream }: StreamEmbedProps) => {
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
            muted: stream.muted,
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
                if (stream.muted && playerRef.current?.setMuted) {
                  playerRef.current.setMuted(true)
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
        iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=${stream.muted ? 1 : 0}&enablejsapi=1&modestbranding=1&rel=0&playsinline=1`
        iframe.setAttribute('frameborder', '0')
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        iframe.setAttribute('allowfullscreen', 'true')
        
        embedRef.current.appendChild(iframe)
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
  }, [stream.channelName, stream.channelId, stream.platform, stream.muted, cleanup])
  
  // Handle mute state changes
  useEffect(() => {
    if (playerRef.current?.setMuted && stream.platform === 'twitch') {
      playerRef.current.setMuted(stream.muted)
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
  
  return (
    <div className="absolute inset-0 bg-black overflow-hidden group">
      {/* Stream Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
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
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleMuteToggle}
            className="p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label={stream.muted ? "Unmute" : "Mute"}
          >
            {stream.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleMaximize}
            className="p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="Toggle primary stream"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="Remove stream"
          >
            <X className="w-4 h-4" />
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
      <div ref={embedRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.muted === nextProps.stream.muted &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform
  )
})

StreamEmbedOptimized.displayName = 'StreamEmbedOptimized'

export default StreamEmbedOptimized