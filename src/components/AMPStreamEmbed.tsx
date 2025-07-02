'use client'

import React, { useEffect, useRef } from 'react'
import { useStreamStore } from '@/store/streamStore'
import type { Stream } from '@/types/stream'
import { Volume2, VolumeX } from 'lucide-react'

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
  const { toggleStreamMute } = useStreamStore()
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
          muted: stream.muted,
          layout: 'video',
          theme: 'dark',
          allowfullscreen: true,
          controls: true // Enable controls for user interaction
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
      if (embedRef.current) {
        embedRef.current.innerHTML = ''
      }
    }
  }, [stream.channelName, stream.platform])
  
  useEffect(() => {
    if (playerRef.current && stream.platform === 'twitch') {
      playerRef.current.setMuted(stream.muted)
    } else if (stream.platform === 'youtube' && embedRef.current) {
      const iframe = embedRef.current.querySelector('iframe')
      if (iframe) {
        const currentSrc = iframe.src
        const urlObj = new URL(currentSrc)
        urlObj.searchParams.set('mute', stream.muted ? '1' : '0')
        iframe.src = urlObj.toString()
      }
    }
  }, [stream.muted, stream.platform])
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleStreamMute(stream.id)
  }
  
  if (stream.platform === 'twitch') {
    return (
      <div className="stream-embed-container relative w-full h-full bg-black group">
        <div ref={embedRef} className="absolute inset-0 w-full h-full" />
        
        {/* Mute/Unmute Control Overlay - Always visible for AMP */}
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/80 text-white transition-all duration-150 border border-white/20 shadow-lg"
            title={stream.muted ? 'Unmute' : 'Mute'}
          >
            {stream.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
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
            src={`https://www.youtube.com/embed/${stream.channelName}?autoplay=1&mute=${stream.muted ? 1 : 0}&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${stream.channelName} stream`}
          />
        </div>
        
        {/* Mute/Unmute Control Overlay - Always visible for AMP */}
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/80 text-white transition-all duration-150 border border-white/20 shadow-lg"
            title={stream.muted ? 'Unmute' : 'Mute'}
          >
            {stream.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
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