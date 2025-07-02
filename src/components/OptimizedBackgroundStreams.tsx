'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import '@/styles/background-streams.css'

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
  const [isVisible, setIsVisible] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  // Check if mobile and visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Use Intersection Observer to detect when the component becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
          // Only load streams on desktop when visible
          if (window.innerWidth >= 768) {
            setShouldLoadStreams(true)
          }
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Start loading 100px before visible
    )

    // Create a dummy element to observe
    const element = document.createElement('div')
    element.style.position = 'fixed'
    element.style.top = '0'
    element.style.left = '0'
    element.style.width = '1px'
    element.style.height = '1px'
    element.style.opacity = '0'
    element.style.pointerEvents = 'none'
    document.body.appendChild(element)
    
    observer.observe(element)
    
    return () => {
      observer.disconnect()
      document.body.removeChild(element)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Staggered loading for better performance
  useEffect(() => {
    if (!shouldLoadStreams || channels.length === 0 || !isVisible) return

    // Load streams one by one with delays for better performance
    const loadStream = (index: number, delay: number) => {
      setTimeout(() => {
        setLoadedStreams(prev => [...prev, index])
      }, delay)
    }

    // Load first stream immediately, then stagger the rest
    loadStream(0, 0)
    loadStream(1, 300)
    loadStream(2, 600)
    loadStream(3, 900)

    return () => {
      // Cleanup timeouts if component unmounts
      setLoadedStreams([])
    }
  }, [shouldLoadStreams, channels.length, isVisible])

  if (channels.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none optimized-background-streams">
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
              initial={{ opacity: 0.9, scale: 1 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0 }}
            >
              <div className="aspect-video relative bg-black">
                {/* Thumbnail placeholder - always show on mobile, show on desktop until loaded */}
                {(isMobile || !shouldLoad) && (
                  <div className="absolute inset-0">
                    <img 
                      src={thumbnailUrl}
                      alt={channel.channelName}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imagesLoaded.has(index) ? 'opacity-70 thumbnail-fade-in' : 'opacity-30'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => {
                        setImagesLoaded(prev => new Set(prev).add(index))
                      }}
                      onError={(e) => {
                        // Fallback to a default image or gradient
                        console.log(`Thumbnail failed to load for ${channel.channelName}`)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/70 animate-pulse" />
                    </div>
                  </div>
                )}
                
                {/* Actual stream embed - only on desktop */}
                {shouldLoad && !isMobile && (
                  <iframe
                    src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false&time=${Date.now()}`}
                    className="absolute inset-0 w-full h-full transition-opacity duration-500 background-stream-iframe"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${channel.channelName} stream`}
                    onLoad={() => {
                      // Optional: Track when iframe loads for analytics
                      console.log(`Stream ${channel.channelName} loaded`)
                    }}
                    onError={() => {
                      // Fallback to thumbnail if iframe fails
                      console.log(`Stream ${channel.channelName} failed to load`)
                    }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/40" />
    </div>
  )
}