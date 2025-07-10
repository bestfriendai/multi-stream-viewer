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
  const [isVisible, setIsVisible] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())
  const [streamTransitions, setStreamTransitions] = useState<Set<number>>(new Set())

  // Stable mobile detection function
  const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }

  // Check visibility
  useEffect(() => {
    
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
    }
  }, [])

  // Staggered loading for better performance with thumbnail-to-stream transition
  useEffect(() => {
    if (!shouldLoadStreams || channels.length === 0 || !isVisible) return

    // First, load thumbnails immediately
    const loadThumbnail = (index: number, delay: number) => {
      setTimeout(() => {
        setLoadedStreams(prev => [...prev, index])
      }, delay)
    }

    // Then, transition to actual streams after thumbnails are loaded
    const transitionToStream = (index: number, delay: number) => {
      setTimeout(() => {
        setStreamTransitions(prev => new Set([...prev, index]))
      }, delay)
    }

    // Load thumbnails first (fast)
    loadThumbnail(0, 0)
    loadThumbnail(1, 100)
    loadThumbnail(2, 200)
    loadThumbnail(3, 300)

    // Transition to streams after thumbnails are visible (slower, staggered)
    if (!isMobileDevice()) {
      transitionToStream(0, 1500)  // 1.5s delay for first stream
      transitionToStream(1, 2500)  // 2.5s delay for second stream
      transitionToStream(2, 3500)  // 3.5s delay for third stream
      transitionToStream(3, 4500)  // 4.5s delay for fourth stream
    }

    return () => {
      // Cleanup timeouts if component unmounts
      setLoadedStreams([])
      setStreamTransitions(new Set())
    }
  }, [shouldLoadStreams, channels.length, isVisible])

  if (channels.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none optimized-background-streams">
      {/* Black background shown until streams are loaded */}
      <div className="absolute inset-0 bg-black" />
      
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 scale-105">
        {[...Array(4)].map((_, index) => {
          const channel = channels[index % channels.length]
          if (!channel) return null
          
          const shouldLoad = loadedStreams.includes(index)
          const shouldTransition = streamTransitions.has(index)
          const thumbnailUrl = channel.thumbnailUrl || 
            `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.channelName}-1920x1080.jpg`

          return (
            <motion.div 
              key={`bg-${channel.channelName}-${index}`} 
              className="relative overflow-hidden rounded-lg bg-black"
              initial={{ opacity: 0.9, scale: 1 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0 }}
            >
              <div className="aspect-video relative bg-black">
                {/* Show thumbnail immediately when loaded (no gray screen) */}
                {shouldLoad && (
                  <motion.div 
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: shouldTransition && !isMobileDevice() ? 0 : 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <img 
                      src={thumbnailUrl}
                      alt={channel.channelName}
                      className="w-full h-full object-cover opacity-70"
                      loading="lazy"
                      decoding="async"
                      onError={() => {
                        console.log(`Thumbnail failed to load for ${channel.channelName}`)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/70 animate-pulse" />
                    </div>
                  </motion.div>
                )}
                
                {/* Actual stream embed - transitions in smoothly on desktop */}
                {shouldTransition && !isMobileDevice() && (
                  <motion.iframe
                    src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false`}
                    className="absolute inset-0 w-full h-full background-stream-iframe"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${channel.channelName} stream`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onLoad={() => {
                      console.log(`Stream ${channel.channelName} loaded and transitioned`)
                    }}
                    onError={() => {
                      console.log(`Stream ${channel.channelName} failed to load, keeping thumbnail`)
                    }}
                  />
                )}
                
                {/* Loading state - only show if nothing is loaded yet */}
                {!shouldLoad && (
                  <div className="absolute inset-0 bg-black">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <PlayCircle className="w-12 h-12 text-white/50" />
                    </div>
                  </div>
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
