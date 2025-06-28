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
          const embed = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost'],
            autoplay: true,
            muted: stream.muted,
            layout: 'video'
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
      iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=${stream.muted ? 1 : 0}&enablejsapi=1&modestbranding=1&rel=0`
      iframe.setAttribute('frameborder', '0')
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.setAttribute('allowfullscreen', 'true')
      
      embedRef.current.appendChild(iframe)
    } else if (stream.platform === 'rumble') {
      // Rumble embed
      const iframe = document.createElement('iframe')
      iframe.width = '100%'
      iframe.height = '100%'
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
        // Update YouTube mute state
        const src = iframe.src
        const newSrc = src.replace(/mute=\d/, `mute=${stream.muted ? 1 : 0}`)
        if (src !== newSrc) {
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
    <div className="relative w-full h-full group">
      <div ref={embedRef} className="w-full h-full" />
      
      {/* Stream Controls */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-0.5">
              {getPlatformIcon()}
              <span className="text-white text-sm font-medium">{stream.channelName}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {stream.platform === 'twitch' && (
              <button
                onClick={handleMuteToggle}
                className="p-1.5 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
                title={stream.muted ? 'Unmute' : 'Mute'}
              >
                {stream.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
            
            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize size={16} />
            </button>
            
            {primaryStreamId !== stream.id && (
              <button
                onClick={handleMaximize}
                className="p-1.5 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
                title="Set as primary"
              >
                <Maximize2 size={16} />
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="p-1.5 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
              title="Remove stream"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}