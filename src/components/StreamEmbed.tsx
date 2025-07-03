'use client'

import { useEffect, useRef, useState } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize, Users } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { haptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'

interface StreamEmbedProps {
  stream: Stream
}

declare global {
  interface Window {
    Twitch: any
  }
}

export default function StreamEmbed({ stream }: StreamEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { 
    toggleStreamMute, 
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
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
          const isMobileDevice = window.innerWidth < 768
          const embed = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost', 'streamyyy.com', 'ampsummer.com'],
            autoplay: true,
            muted: stream.muted,
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            // Mobile-specific optimizations
            ...(isMobileDevice && {
              quality: 'auto',
              controls: true
            })
          })
          
          // Additional mobile iframe styling after embed creation
          setTimeout(() => {
            if (embedRef.current && isMobileDevice) {
              const iframe = embedRef.current.querySelector('iframe')
              if (iframe) {
                iframe.style.objectFit = 'cover'
                iframe.style.objectPosition = 'center'
              }
            }
          }, 100)
          
          embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
            playerRef.current = embed.getPlayer()
            if (stream.muted) {
              playerRef.current.setMuted(true)
            }
          })
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
      iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=${stream.muted ? 1 : 0}&enablejsapi=1&modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}`
      iframe.setAttribute('frameborder', '0')
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.setAttribute('allowfullscreen', 'true')
      
      embedRef.current.appendChild(iframe)
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
    }
  }, [stream.channelName, stream.channelId, stream.platform])
  
  useEffect(() => {
    if (playerRef.current && stream.platform === 'twitch') {
      playerRef.current.setMuted(stream.muted)
    }
    // Note: YouTube mute state changes via URL parameter changes cause stream reloads
    // For better UX, we rely on the initial mute state set during embed creation
    // Users can use YouTube's native controls for mute if needed
  }, [stream.muted, stream.platform])
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleStreamMute(stream.id)
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
        className={cn(
          "w-full h-full rounded-2xl overflow-hidden relative stream-embed-container",
          isMobile ? "aspect-video" : "" // Force 16:9 on mobile
        )}
      >
        <div 
          ref={embedRef} 
          className={cn(
            "w-full h-full",
            isMobile && "absolute inset-0"
          )} 
        />
      </div>
      
      {/* Stream Controls with improved mobile touch targets */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200">
        <div className="flex justify-between items-start">
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
          
          <div className="flex gap-0.5 sm:gap-1">
            <button
              onClick={(e) => {
                handleMuteToggle(e)
                haptic.light()
              }}
              className="p-2 sm:p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30 text-white transition-all duration-150 border border-white/20 transform active:scale-95 min-w-[40px] min-h-[40px]"
              title={stream.muted ? 'Unmute' : 'Mute'}
            >
              {stream.muted ? <VolumeX size={14} className="sm:w-4 sm:h-4" /> : <Volume2 size={14} className="sm:w-4 sm:h-4" />}
            </button>
            
            <button
              onClick={(e) => {
                handleFullscreen(e)
                haptic.light()
              }}
              className="p-2 sm:p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30 text-white transition-all duration-150 border border-white/20 transform active:scale-95 min-w-[40px] min-h-[40px]"
              title="Fullscreen"
            >
              <Maximize size={14} className="sm:w-4 sm:h-4" />
            </button>
            
            {primaryStreamId !== stream.id && (
              <button
                onClick={(e) => {
                  handleMaximize(e)
                  haptic.medium()
                }}
                className="p-2 sm:p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30 text-white transition-all duration-150 border border-white/20 transform active:scale-95 min-w-[40px] min-h-[40px]"
                title="Set as primary"
              >
                <Maximize2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            )}
            
            <button
              onClick={(e) => {
                handleClose(e)
                haptic.heavy()
              }}
              className="p-2 sm:p-2 rounded-full bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 active:bg-red-500/40 text-white transition-all duration-150 border border-red-500/30 transform active:scale-95 min-w-[40px] min-h-[40px]"
              title="Remove stream"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
      
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