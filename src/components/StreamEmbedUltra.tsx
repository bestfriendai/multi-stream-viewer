'use client'

import { useEffect, useRef, useCallback, memo, useState } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users, Play } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { muteManager, useMuteState } from '@/lib/muteManager'

interface StreamEmbedProps {
  stream: Stream
  priority?: 'high' | 'low' | 'lazy'
  placeholder?: boolean
}

declare global {
  interface Window {
    Twitch: any
  }
}

// Enhanced Twitch script manager with preconnect
class TwitchScriptManager {
  private static instance: TwitchScriptManager
  private scriptLoaded = false
  private loadingPromise: Promise<void> | null = null
  private preconnected = false

  static getInstance() {
    if (!TwitchScriptManager.instance) {
      TwitchScriptManager.instance = new TwitchScriptManager()
    }
    return TwitchScriptManager.instance
  }

  preconnect() {
    if (this.preconnected) return
    
    // Preconnect to Twitch domains for faster loading
    const links = [
      'https://embed.twitch.tv',
      'https://player.twitch.tv',
      'https://static-cdn.jtvnw.net',
      'https://gql.twitch.tv'
    ]
    
    links.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
    
    this.preconnected = true
  }

  async loadScript(): Promise<void> {
    if (this.scriptLoaded) return
    
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.preconnect()

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
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        this.scriptLoaded = true
        resolve()
      }
      
      script.onerror = () => {
        this.loadingPromise = null
        reject(new Error('Failed to load Twitch script'))
      }
      
      document.head.appendChild(script)
    })

    return this.loadingPromise
  }
}

// Lazy loading hook using Intersection Observer
function useLazyLoad(ref: React.RefObject<HTMLElement>, enabled: boolean = true) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    if (!enabled || hasBeenVisible) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
          setHasBeenVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [enabled, hasBeenVisible, ref])

  return isVisible || hasBeenVisible
}

const StreamEmbedUltra = memo(({ stream, priority = 'low', placeholder = false }: StreamEmbedProps) => {
  const embedRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const embedInstanceRef = useRef<any>(null)
  const isMountedRef = useRef(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  const { 
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
  // Use reactive mute state hook
  const [streamMuted, toggleMute] = useMuteState(stream.id)
  
  // Enhanced lazy loading - high priority streams load immediately
  const shouldLazyLoad = priority !== 'high' && !placeholder
  const isVisible = useLazyLoad(containerRef, !shouldLazyLoad)
  
  // Get live status with optimized refresh based on priority
  const { status: twitchStatus } = useSingleChannelStatus(
    stream.platform === 'twitch' ? stream.channelName : '',
    { 
      enabled: stream.platform === 'twitch' && isVisible,
      refreshInterval: priority === 'high' ? 120000 : 300000 // 2min for high priority, 5min for others
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
      // Cleanup YouTube helper on unmount
      if (stream.platform === 'youtube') {
        muteManager.unregisterPlayer(stream.id)
      }
    }
  }, [cleanup, stream.platform, stream.id])
  
  // Setup embed only when visible
  useEffect(() => {
    if (!embedRef.current || !isVisible || placeholder) return
    
    let cancelled = false
    
    const setupEmbed = async () => {
      if (cancelled || !isMountedRef.current) return
      
      setIsLoading(true)
      setHasError(false)
      
      // Clear previous content
      cleanup()
      
      try {
        if (stream.platform === 'twitch') {
          await TwitchScriptManager.getInstance().loadScript()
          
          if (cancelled || !isMountedRef.current || !window.Twitch?.Embed || !embedRef.current) return
          
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
          
          // Enhanced embed options for better performance
          const embedOptions = {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [
              window.location.hostname, 
              'localhost', 
              'streamyyy.com', 
              'www.streamyyy.com',
              'vercel.app'
            ],
            autoplay: true,
            muted: streamMuted,
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            // Quality optimization based on priority and device
            quality: priority === 'high' 
              ? (isMobile ? '720p' : '1080p')
              : (isMobile ? '480p' : '720p'),
            controls: true,
            // Reduce initial loading overhead for non-primary streams
            time: priority === 'low' ? '0' : undefined
          }
          
          embedInstanceRef.current = new window.Twitch.Embed(embedRef.current, embedOptions)
          
          if (embedInstanceRef.current?.addEventListener) {
            embedInstanceRef.current.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
              if (!cancelled && isMountedRef.current) {
                playerRef.current = embedInstanceRef.current.getPlayer()
                if (streamMuted && playerRef.current?.setMuted) {
                  playerRef.current.setMuted(true)
                }
                setIsLoading(false)
              }
            })
            
            embedInstanceRef.current.addEventListener(window.Twitch.Embed.VIDEO_PLAY, () => {
              setIsLoading(false)
            })
          }
        } else if (stream.platform === 'youtube' && embedRef.current) {
          const iframe = document.createElement('iframe')
          iframe.width = '100%'
          iframe.height = '100%'
          iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%'
          iframe.loading = priority === 'high' ? 'eager' : 'lazy'
          iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=1&enablejsapi=1&modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}`
          iframe.setAttribute('frameborder', '0')
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          iframe.setAttribute('allowfullscreen', 'true')
          
          iframe.onload = () => {
            setIsLoading(false)
            // Register YouTube iframe with muteManager
            setTimeout(() => {
              if (iframe.contentWindow) {
                muteManager.registerPlayer(stream.id, iframe, 'youtube')
              }
            }, 1000)
          }
          iframe.onerror = () => {
            setHasError(true)
            setIsLoading(false)
          }
          
          embedRef.current.appendChild(iframe)
        } else if (stream.platform === 'rumble' && embedRef.current) {
          const iframe = document.createElement('iframe')
          iframe.width = '100%'
          iframe.height = '100%'
          iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%'
          iframe.loading = priority === 'high' ? 'eager' : 'lazy'
          iframe.src = `https://rumble.com/embed/${stream.channelId}/?pub=4`
          iframe.setAttribute('frameborder', '0')
          iframe.setAttribute('allowfullscreen', 'true')
          
          iframe.onload = () => {
            setIsLoading(false)
            // Register Rumble iframe with muteManager
            muteManager.registerPlayer(stream.id, iframe, 'rumble')
          }
          iframe.onerror = () => {
            setHasError(true)
            setIsLoading(false)
          }
          
          embedRef.current.appendChild(iframe)
        }
      } catch (error) {
        console.error('Error loading embed:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }
    
    // Delay loading for low priority streams to improve initial page performance
    const delay = priority === 'high' ? 0 : priority === 'low' ? 1000 : 500
    const timeoutId = setTimeout(setupEmbed, delay)
    
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [stream.channelName, stream.channelId, stream.platform, isVisible, placeholder, priority, cleanup])
  
  // Handle mute state changes
  useEffect(() => {
    if (stream.platform === 'twitch' && playerRef.current?.setMuted) {
      playerRef.current.setMuted(streamMuted)
    } else if (stream.platform === 'youtube' && embedRef.current) {
      const iframe = embedRef.current.querySelector('iframe') as HTMLIFrameElement
      if (iframe && iframe.contentWindow) {
        muteManager.registerPlayer(stream.id, iframe, 'youtube')
      }
    }
  }, [streamMuted, stream.platform, stream.id])
  
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
  
  const viewerCount = twitchStatus?.isLive ? twitchStatus.viewerCount : 0

  // Render placeholder for non-visible lazy streams
  if (!isVisible && shouldLazyLoad) {
    return (
      <div ref={containerRef} className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
            {stream.platform === 'youtube' && <Youtube className="w-6 h-6" />}
            {stream.platform === 'twitch' && <Twitch className="w-6 h-6" />}
            {stream.platform === 'rumble' && <span className="text-sm font-bold">R</span>}
          </div>
          <div className="text-sm font-medium">{stream.channelName}</div>
          <div className="text-xs text-gray-500 mt-1">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black overflow-hidden group">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm">Loading {stream.channelName}...</div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="text-red-400 mb-2">⚠</div>
            <div className="text-sm">Failed to load stream</div>
          </div>
        </div>
      )}

      {/* Stream Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-2 bg-gradient-to-b from-black/90 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium flex items-center gap-1.5">
            {stream.platform === 'youtube' && <Youtube className="w-4 h-4" />}
            {stream.platform === 'twitch' && <Twitch className="w-4 h-4" />}
            {stream.platform === 'rumble' && <span className="text-xs font-bold">R</span>}
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
      <div ref={embedRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders (exclude muted from stream)
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform &&
    prevProps.priority === nextProps.priority &&
    prevProps.placeholder === nextProps.placeholder
  )
})

StreamEmbedUltra.displayName = 'StreamEmbedUltra'

export default StreamEmbedUltra