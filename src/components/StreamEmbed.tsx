'use client'

import { useEffect, useRef } from 'react'
import { useStreamStore, Stream } from '@/store/streamStore'
import { Volume2, VolumeX, X, Maximize2, Youtube, Twitch, Maximize } from 'lucide-react'

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
  const { 
    toggleStreamMute, 
    removeStream, 
    setPrimaryStream,
    primaryStreamId 
  } = useStreamStore()
  
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
          const isMobile = window.innerWidth < 768
          const embed = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost'],
            autoplay: true,
            muted: stream.muted,
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            // Mobile-specific optimizations
            ...(isMobile && {
              quality: 'auto',
              controls: true
            })
          })
          
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
      iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=${stream.muted ? 1 : 0}&enablejsapi=1&modestbranding=1&rel=0&playsinline=1`
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
    } else if (stream.platform === 'youtube' && embedRef.current) {
      const iframe = embedRef.current.querySelector('iframe')
      if (iframe) {
        // Update YouTube mute state by recreating iframe with new mute parameter
        const currentSrc = iframe.src
        const urlObj = new URL(currentSrc)
        urlObj.searchParams.set('mute', stream.muted ? '1' : '0')
        const newSrc = urlObj.toString()

        if (currentSrc !== newSrc) {
          iframe.src = newSrc
        }
      }
    }
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
      <div ref={embedRef} className="absolute inset-0 w-full h-full rounded-2xl" />
      
      {/* Stream Controls with improved mobile touch targets */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/20">
              <div className="text-white/90">{getPlatformIcon()}</div>
              <span className="text-white text-xs sm:text-sm font-medium tracking-tight truncate max-w-[100px] sm:max-w-none">{stream.channelName}</span>
            </div>
          </div>
          
          <div className="flex gap-0.5 sm:gap-1">
            <button
              onClick={(e) => {
                handleMuteToggle(e)
                if ('vibrate' in navigator) navigator.vibrate(10)
              }}
              className="p-2 sm:p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30 text-white transition-all duration-150 border border-white/20 transform active:scale-95 min-w-[40px] min-h-[40px]"
              title={stream.muted ? 'Unmute' : 'Mute'}
            >
              {stream.muted ? <VolumeX size={14} className="sm:w-4 sm:h-4" /> : <Volume2 size={14} className="sm:w-4 sm:h-4" />}
            </button>
            
            <button
              onClick={(e) => {
                handleFullscreen(e)
                if ('vibrate' in navigator) navigator.vibrate(10)
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
                  if ('vibrate' in navigator) navigator.vibrate(10)
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
                if ('vibrate' in navigator) navigator.vibrate(20)
              }}
              className="p-2 sm:p-2 rounded-full bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 active:bg-red-500/40 text-white transition-all duration-150 border border-red-500/30 transform active:scale-95 min-w-[40px] min-h-[40px]"
              title="Remove stream"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}