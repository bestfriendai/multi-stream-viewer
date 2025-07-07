'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { cn } from '@/lib/utils'
import { RefreshCw, Grid3x3, MoreVertical, Share2, Bookmark } from 'lucide-react'
import StreamEmbed from './StreamEmbed'
import SponsoredStreamEmbed from './SponsoredStreamEmbed'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface AppLikeMobileLayoutProps {
  className?: string
}

const AppLikeMobileLayout: React.FC<AppLikeMobileLayoutProps> = ({ className }) => {
  const { streams, gridLayout, setGridLayout } = useStreamStore()
  const { trackMobileGesture, trackLayoutChange } = useAnalytics()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [showLayoutSelector, setShowLayoutSelector] = useState(false)
  const [visibleStreams, setVisibleStreams] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: containerRef })

  // Mobile layout options
  const mobileLayouts = [
    { id: 'stack', name: 'Stack', cols: 1, icon: '📱' },
    { id: 'grid-2x1', name: '2×1', cols: 2, icon: '📐' },
    { id: 'grid-2x2', name: '2×2', cols: 2, icon: '🔲' },
    { id: 'grid-1x3', name: '1×3', cols: 1, icon: '📋' },
  ]

  // Track scroll for header transparency
  const [headerOpacity, setHeaderOpacity] = useState(0.95)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const opacity = Math.max(0.85, Math.min(0.95, (latest / 100) * 0.1 + 0.85))
    setHeaderOpacity(opacity)
  })

  // Pull-to-refresh functionality
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const startY = e.touches[0]?.clientY || 0
      
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0]?.clientY || 0
        const distance = Math.max(0, currentY - startY)
        
        if (distance > 0 && containerRef.current?.scrollTop === 0) {
          moveEvent.preventDefault()
          setPullDistance(Math.min(distance, 120))
        }
      }

      const handleTouchEnd = () => {
        if (pullDistance > 60) {
          handleRefresh()
        }
        setPullDistance(0)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    trackMobileGesture('pull', 'refresh_streams')
    
    // Simulate refresh (you can implement actual stream refresh logic here)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsRefreshing(false)
  }

  const changeLayout = (layoutId: string) => {
    setGridLayout(layoutId as any)
    trackLayoutChange(layoutId, 'mobile')
    setShowLayoutSelector(false)
  }

  // Intersection observer for stream visibility
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id)
        setVisibleStreams(visible)
      },
      { 
        root: containerRef.current,
        threshold: 0.3,
        rootMargin: '-50px 0px'
      }
    )

    const streamElements = containerRef.current.querySelectorAll('[data-stream-id]')
    streamElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [streams.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
    }
  }, [handleTouchStart])

  const gridConfig = {
    'stack': 'grid-cols-1 gap-4',
    'grid-2x1': 'grid-cols-2 gap-2',
    'grid-2x2': 'grid-cols-2 gap-2',
    'grid-1x3': 'grid-cols-1 gap-3',
  }

  const getStreamCardHeight = () => {
    switch (gridLayout) {
      case 'grid-2x1':
      case 'grid-2x2':
        return 'h-[45vw] max-h-[200px]'
      case 'grid-1x3':
        return 'h-[30vh] max-h-[250px]'
      default: // stack
        return 'h-[56vw] max-h-[320px]'
    }
  }

  if (streams.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl mx-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Grid3x3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Streams Added</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Add your first stream to get started with the multi-stream experience
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={cn("relative h-full bg-background", className)}>
      {/* Floating Header */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-xl border-b border-border/20"
        style={{
          background: `rgba(var(--background), ${headerOpacity})`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Grid3x3 className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg">Streams</h1>
              <p className="text-xs text-muted-foreground">
                {streams.length} active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayoutSelector(!showLayoutSelector)}
              className="h-10 w-10 p-0 rounded-2xl"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Layout Selector */}
        <AnimatePresence>
          {showLayoutSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex gap-2 p-3 bg-muted/30 rounded-2xl">
                {mobileLayouts.map((layout) => (
                  <Button
                    key={layout.id}
                    variant={gridLayout === layout.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => changeLayout(layout.id)}
                    className="flex-1 h-12 flex-col gap-1 rounded-xl"
                  >
                    <span className="text-base">{layout.icon}</span>
                    <span className="text-xs">{layout.name}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pull-to-Refresh Indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            className="fixed top-20 left-1/2 z-40 w-12 h-12 bg-card rounded-full border border-border shadow-lg flex items-center justify-center"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: pullDistance > 60 ? 1.2 : 1,
              rotate: pullDistance * 3
            }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <RefreshCw className={cn(
              "w-5 h-5 transition-colors",
              pullDistance > 60 ? "text-primary" : "text-muted-foreground",
              isRefreshing && "animate-spin"
            )} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto pt-20 pb-6 px-4"
        style={{
          transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance / 2, 60)}px)` : undefined,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        <motion.div
          className={cn(
            "grid w-full",
            gridConfig[gridLayout as keyof typeof gridConfig] || gridConfig.stack
          )}
          layout
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <AnimatePresence mode="popLayout">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  type: "spring",
                  damping: 20
                }}
                data-stream-id={stream.id}
                id={stream.id}
                className={cn(
                  "relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg",
                  getStreamCardHeight(),
                  "will-change-transform"
                )}
                whileTap={{ scale: 0.98 }}
              >
                {/* Stream Content */}
                <div className="absolute inset-0">
                  {stream.isSponsored ? (
                    <SponsoredStreamEmbed stream={stream} />
                  ) : (
                    <StreamEmbed stream={stream} />
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Stream Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-base truncate">
                        {stream.channelName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className="bg-black/40 text-white border-white/20 text-xs px-2 py-0.5"
                        >
                          {stream.platform}
                        </Badge>
                        {stream.isSponsored && (
                          <Badge 
                            variant="default" 
                            className="bg-yellow-600/80 text-white text-xs px-2 py-0.5"
                          >
                            Sponsored
                          </Badge>
                        )}
                        {visibleStreams.includes(stream.id) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-card/95 backdrop-blur-xl border-border/50"
                      >
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Stream
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bookmark className="mr-2 h-4 w-4" />
                          Save Stream
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Spacing for Safe Area */}
        <div className="h-6" />
      </div>
    </div>
  )
}

export default AppLikeMobileLayout