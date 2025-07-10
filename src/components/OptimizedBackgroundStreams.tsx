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

  // Immediate thumbnail loading with staggered stream transitions
  useEffect(() => {
    if (channels.length === 0) return

    // Load all thumbnails immediately - no delays, no gray screens
    setLoadedStreams([0, 1, 2, 3])

    // Only transition to actual streams on desktop after thumbnails are visible
    if (!isMobileDevice() && isVisible) {
      const transitionToStream = (index: number, delay: number) => {
        setTimeout(() => {
          setStreamTransitions(prev => new Set([...prev, index]))
        }, delay)
      }

      // Staggered stream transitions (only on desktop)
      transitionToStream(0, 2000)  // 2s delay for first stream
      transitionToStream(1, 3000)  // 3s delay for second stream
      transitionToStream(2, 4000)  // 4s delay for third stream
      transitionToStream(3, 5000)  // 5s delay for fourth stream
    }

    return () => {
      // Cleanup on unmount
      setStreamTransitions(new Set())
    }
  }, [channels.length, isVisible])

  if (channels.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none optimized-background-streams z-0">
      {/* Background container - thumbnails load immediately */}
      
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 scale-105">
        {[...Array(4)].map((_, index) => {
          const channel = channels[index % channels.length]
          if (!channel) return null
          
          const shouldLoad = loadedStreams.includes(index)
          const shouldTransition = streamTransitions.has(index)
          const thumbnailUrl = channel.thumbnailUrl || 
            `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.channelName}-1920x1080.jpg`

          return (
            <div 
              key={`bg-${channel.channelName}-${index}`} 
              className="relative overflow-hidden rounded-lg"
            >
              <div className="aspect-video relative">
                {/* Show thumbnail immediately (no gray screen, no play button) */}
                {shouldLoad && (
                  <div 
                    className="absolute inset-0"
                    style={{ opacity: shouldTransition && !isMobileDevice() ? 0 : 1, transition: 'opacity 0.8s ease-in-out' }}
                  >
                    <img 
                      src={thumbnailUrl}
                      alt={channel.channelName}
                      className="w-full h-full object-cover opacity-80"
                      loading="eager"
                      decoding="async"
                      onError={() => {
                        console.log(`Thumbnail failed to load for ${channel.channelName}`)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
                
                {/* Actual stream embed - transitions in smoothly on desktop */}
                {shouldTransition && !isMobileDevice() && (
                  <iframe
                    src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false`}
                    className="absolute inset-0 w-full h-full background-stream-iframe"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${channel.channelName} stream`}
                    style={{ opacity: 1, transition: 'opacity 0.8s ease-in-out' }}
                    onLoad={() => {
                      console.log(`Stream ${channel.channelName} loaded and transitioned`)
                    }}
                    onError={() => {
                      console.log(`Stream ${channel.channelName} failed to load, keeping thumbnail`)
                    }}
                  />
                )}
                
                {/* No loading state needed - thumbnails load immediately */}
              </div>
            </div>
          )
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/40" />
    </div>
  )
}
