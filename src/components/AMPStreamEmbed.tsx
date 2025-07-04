'use client'

import React, { useEffect, useRef } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX } from 'lucide-react'
import { useMuteState, muteManager } from '@/lib/muteManager'

interface AMPStreamEmbedProps {
  stream: Stream
}

declare global {
  interface Window {
    Twitch: any
  }
}

const AMPStreamEmbed: React.FC<AMPStreamEmbedProps> = ({ stream }) => {
  const embedRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  
  // Use new mute system
  const [streamMuted, toggleMute] = useMuteState(stream.id)
  useEffect(() => {
    if (!embedRef.current || stream.platform !== 'twitch') return
    
    // Clear previous content
    embedRef.current.innerHTML = ''
    
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
          muted: true, // Always start muted, control via API
          layout: 'video',
          theme: 'dark',
          allowfullscreen: true,
          controls: true // Enable controls for user interaction
        })
        
        embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
          playerRef.current = embed.getPlayer()
          // Register player with muteManager
          muteManager.registerPlayer(stream.id, playerRef.current, 'twitch')
        })
        
        // Handle offline streams and errors
        embed.addEventListener(window.Twitch.Embed.OFFLINE, () => {
          console.log(`Stream ${stream.channelName} is offline`)
        })
        
        // Add error handling for player errors
        setTimeout(() => {
          if (embed.getPlayer) {
            const player = embed.getPlayer()
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
    }
    
    document.body.appendChild(script)
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (embedRef.current) {
        embedRef.current.innerHTML = ''
      }
      // Cleanup muteManager on unmount
      muteManager.unregisterPlayer(stream.id)
    }
  }, [stream.channelName, stream.platform, stream.id])
  
  // mute state changes are now handled by muteManager internally
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMute()
  }
  
  if (stream.platform === 'twitch') {
    return (
      <div className="stream-embed-container relative w-full h-full bg-black group">
        <div ref={embedRef} className="absolute inset-0 w-full h-full" />
        
        {/* Mute/Unmute Control Overlay - Always visible for AMP */}
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/80 text-white transition-all duration-150 border border-white/20 shadow-lg"
            title={streamMuted ? 'Unmute' : 'Mute'}
          >
            {streamMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    )
  }

  if (stream.platform === 'youtube') {
    return (
      <div className="stream-embed-container relative w-full h-full bg-black group">
        <div ref={embedRef} className="absolute inset-0 w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${stream.channelName}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${stream.channelName} stream`}
            onLoad={() => {
              const iframe = embedRef.current?.querySelector('iframe') as HTMLIFrameElement
              if (iframe?.contentWindow) {
                muteManager.registerPlayer(stream.id, iframe, 'youtube')
              }
            }}
          />
        </div>
        
        {/* Mute/Unmute Control Overlay - Always visible for AMP */}
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/80 text-white transition-all duration-150 border border-white/20 shadow-lg"
            title={streamMuted ? 'Unmute' : 'Mute'}
          >
            {streamMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="stream-embed-container relative w-full h-full bg-black flex items-center justify-center">
      <p className="text-muted-foreground">Unsupported platform: {stream.platform}</p>
    </div>
  )
}

export default AMPStreamEmbed