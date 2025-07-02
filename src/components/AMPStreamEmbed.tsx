'use client'

import React from 'react'
import type { Stream } from '@/types/stream'

interface AMPStreamEmbedProps {
  stream: Stream
}

const AMPStreamEmbed: React.FC<AMPStreamEmbedProps> = ({ stream }) => {
  if (stream.platform === 'twitch') {
    return (
      <div className="stream-embed-container relative w-full h-full bg-black">
        <iframe
          src={`https://player.twitch.tv/?channel=${stream.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=${stream.muted}&autoplay=true&controls=false`}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title={`${stream.channelName} stream`}
        />
      </div>
    )
  }

  if (stream.platform === 'youtube') {
    return (
      <div className="stream-embed-container relative w-full h-full bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${stream.channelName}?autoplay=1&mute=${stream.muted ? 1 : 0}&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1`}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${stream.channelName} stream`}
        />
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