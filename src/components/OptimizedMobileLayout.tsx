'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { cn } from '@/lib/utils'
import { RefreshCw, Grid3x3, MoreVertical, Grid2x2 } from 'lucide-react'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import { Button } from './ui/button'

interface OptimizedMobileLayoutProps {
  className?: string
}

type MobileLayoutMode = 'stack' | 'grid'

const OptimizedMobileLayout: React.FC<OptimizedMobileLayoutProps> = ({ className }) => {
  const { streams, setGridLayout } = useStreamStore()
  const { trackMobileGesture, trackLayoutChange } = useAnalytics()
  const { orientation } = useMobileDetection()
  
  const [layoutMode, setLayoutMode] = useState<MobileLayoutMode>('stack')
  const [showLayoutSelector, setShowLayoutSelector] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [headerOpacity, setHeaderOpacity] = useState(0.95)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)

  // Auto-switch layout based on orientation
  useEffect(() => {
    if (orientation === 'landscape' && layoutMode === 'stack') {
      setLayoutMode('grid')
    } else if (orientation === 'portrait' && layoutMode === 'grid' && streams.length > 2) {
      setLayoutMode('stack')
    }
  }, [orientation, layoutMode, streams.length])

  // Header opacity based on scroll (CSS-based for performance)
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const opacity = Math.max(0.85, Math.min(0.95, (scrollTop / 100) * 0.1 + 0.85))
    setHeaderOpacity(opacity)
  }, [])

  // Optimized pull-to-refresh with unified gesture handling
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0]?.clientY || 0
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop !== 0) return
    
    const currentY = e.touches[0]?.clientY || 0
    const distance = Math.max(0, currentY - startYRef.current)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, 120))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60) {
      handleRefresh()
    }
    setPullDistance(0)
  }, [pullDistance])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    trackMobileGesture('pull', 'refresh_streams')
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    // Simulate refresh - replace with actual refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const changeLayoutMode = (mode: MobileLayoutMode) => {
    setLayoutMode(mode)
    setGridLayout(mode === 'stack' ? 'stacked' : 'grid-2x2')
    trackLayoutChange(mode, streams.length)
    setShowLayoutSelector(false)
  }

  // Touch event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Memoized layout configurations for performance optimization
  const gridClasses = useMemo(() => {
    switch (layoutMode) {
      case 'grid':
        return orientation === 'landscape'
          ? 'grid-cols-2 gap-3' // Increased from gap-2 for consistency
          : 'grid-cols-1 gap-3' // Consistent gap across orientations
      default: // stack
        return 'grid-cols-1 gap-4' // Slightly more space in stack mode
    }
  }, [layoutMode, orientation])

  const streamCardHeight = useMemo(() => {
    if (layoutMode === 'grid') {
      return orientation === 'landscape'
        ? 'h-[38vh] min-h-[200px]' // Added min-height for small screens
        : 'h-[32vh] min-h-[180px] max-h-[280px]' // Adjusted for better consistency
    }
    return 'h-[56vw] min-h-[220px] max-h-[320px]' // Added min-height for stack mode
  }, [layoutMode, orientation])

  if (streams.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-background to-muted/30">
        <div className="text-center p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Grid3x3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Streams Added</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Add your first stream to get started with the multi-stream experience
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative h-full bg-background", className)}>
      {/* Optimized Header with CSS transforms */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-xl border-b border-border/20 transition-all duration-300"
        style={{
          background: `rgba(var(--background), ${headerOpacity})`,
          transform: `translateY(${pullDistance > 0 ? Math.min(pullDistance / 4, 15) : 0}px)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Streams</h1>
              <p className="text-xs text-muted-foreground">
                {streams.length} active • {layoutMode}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLayoutSelector(!showLayoutSelector)}
            className="h-11 w-11 p-0 rounded-2xl touch-manipulation"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Simplified Layout Selector */}
        {showLayoutSelector && (
          <div className="mt-3 p-3 bg-muted/30 rounded-2xl">
            <div className="flex gap-2">
              <Button
                variant={layoutMode === 'stack' ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLayoutMode('stack')}
                className="flex-1 h-12 min-w-[44px] flex-col gap-1 rounded-xl touch-manipulation"
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-xs">Stack</span>
              </Button>
              <Button
                variant={layoutMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLayoutMode('grid')}
                className="flex-1 h-12 min-w-[44px] flex-col gap-1 rounded-xl touch-manipulation"
              >
                <Grid2x2 className="w-4 h-4" />
                <span className="text-xs">Grid</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pull-to-Refresh Indicator */}
      {pullDistance > 0 && (
        <div
          className="fixed top-20 left-1/2 z-40 w-12 h-12 bg-card rounded-full border border-border shadow-lg flex items-center justify-center transition-all duration-200"
          style={{ 
            transform: `translateX(-50%) scale(${pullDistance > 60 ? 1.2 : 1}) rotate(${pullDistance * 3}deg)`,
            opacity: Math.min(pullDistance / 60, 1)
          }}
        >
          <RefreshCw className={cn(
            "w-5 h-5 transition-colors",
            pullDistance > 60 ? "text-primary" : "text-muted-foreground",
            isRefreshing && "animate-spin"
          )} />
        </div>
      )}

      {/* Main Content with CSS transforms for performance */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto pt-20 pb-6 px-4"
        style={{
          transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance / 2, 60)}px)` : undefined,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        <div className={cn("grid w-full", gridClasses)}>
          {streams.map((stream, index) => (
            <div
              key={stream.id}
              data-stream-id={stream.id}
              className={cn(
                "relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg",
                streamCardHeight,
                "transform transition-transform duration-200 active:scale-[0.98]"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <StreamEmbedOptimized stream={stream} />
              
              {/* Stream info overlay for stack mode */}
              {layoutMode === 'stack' && (
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm z-10">
                  <div className="font-medium">{stream.channelName}</div>
                  <div className="text-xs opacity-80 capitalize">{stream.platform}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OptimizedMobileLayout