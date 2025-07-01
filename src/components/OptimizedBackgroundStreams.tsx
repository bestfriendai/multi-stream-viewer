'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'

interface StreamChannel {
  channelName: string
  viewerCount: number
  gameName: string
  title: string
  isLive: boolean
  thumbnailUrl?: string
}

interface OptimizedBackgroundStreamsProps {
  channels: StreamChannel[]
}

export default function OptimizedBackgroundStreams({ channels }: OptimizedBackgroundStreamsProps) {
  const [loadedStreams, setLoadedStreams] = useState<number[]>([])
  const [shouldLoadStreams, setShouldLoadStreams] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile and delay loading streams until after initial page render
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Only load streams on desktop
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        setShouldLoadStreams(true)
      }, 500) // Start loading after 500ms
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', checkMobile)
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load streams one by one with delay
  useEffect(() => {
    if (!shouldLoadStreams || channels.length === 0) return

    const loadStream = (index: number) => {
      if (index < 4 && index < channels.length) {
        setTimeout(() => {
          setLoadedStreams(prev => [...prev, index])
          loadStream(index + 1)
        }, 300) // 300ms delay between each stream
      }
    }

    loadStream(0)
  }, [shouldLoadStreams, channels.length])

  if (channels.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-8 scale-105">
        {[...Array(4)].map((_, index) => {
          const channel = channels[index % channels.length]
          if (!channel) return null
          
          const shouldLoad = loadedStreams.includes(index)
          const thumbnailUrl = channel.thumbnailUrl || 
            `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.channelName}-1920x1080.jpg`

          return (
            <motion.div 
              key={`bg-${channel.channelName}-${index}`} 
              className="relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="aspect-video relative bg-black">
                {/* Thumbnail placeholder - always show on mobile, show on desktop until loaded */}
                {(isMobile || !shouldLoad) && (
                  <div className="absolute inset-0">
                    <img 
                      src={thumbnailUrl}
                      alt={channel.channelName}
                      className="w-full h-full object-cover opacity-50"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/70 animate-pulse" />
                    </div>
                  </div>
                )}
                
                {/* Actual stream embed - only on desktop */}
                {shouldLoad && !isMobile && (
                  <iframe
                    src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={false}
                    title={`${channel.channelName} stream`}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/85" />
    </div>
  )
}