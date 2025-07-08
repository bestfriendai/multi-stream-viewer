'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useMobileLayoutManager } from '@/hooks/useMobileLayoutManager'
import { cn } from '@/lib/utils'

// Import existing mobile components
import EnhancedMobileStreamViewer from './EnhancedMobileStreamViewer'
import MobileSwipeControls from './MobileSwipeControls'
import { StreamData } from '@/types/stream'

export type ViewMode = 'stack' | 'grid' | 'single' | 'pip'

interface UnifiedMobileLayoutProps {
  streams: StreamData[]
  children?: React.ReactNode
  className?: string
  enableGestures?: boolean
  enablePullToRefresh?: boolean
  enableAutoLayout?: boolean
}

export default function UnifiedMobileLayout({
  streams,
  children,
  className,
  enableGestures = true,
  enablePullToRefresh = true,
  enableAutoLayout = true
}: UnifiedMobileLayoutProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('stack')
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [showLayoutSelector, setShowLayoutSelector] = useState(false)
  const [visibleStreams, setVisibleStreams] = useState<string[]>([])

  const { isMobile, isTablet, orientation, screenWidth, screenHeight } = useMobileDetection()
  const {
    mobile,
    currentLayout,
    recommendedLayout,
    isOptimalLayout,
    refreshLayout,
    handleMobileLayoutError
  } = useMobileLayoutManager()

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-select optimal view mode based on device and stream count
  const optimalViewMode = useMemo(() => {
    if (!isMobile) return 'grid'
    
    if (streams.length === 0) return 'stack'
    if (streams.length === 1) return 'single'
    if (streams.length <= 2) return 'stack'
    if (streams.length <= 4 && isTablet) return 'grid'
    
    return 'stack'
  }, [isMobile, isTablet, streams.length])

  // Auto-update view mode when streams change (if auto-layout is enabled)
  useEffect(() => {
    if (enableAutoLayout) {
      setViewMode(optimalViewMode)
    }
  }, [optimalViewMode, enableAutoLayout])

  // Handle pull-to-refresh
  const handlePullToRefresh = useCallback(async () => {
    if (!enablePullToRefresh) return
    
    setIsRefreshing(true)
    try {
      // Refresh streams data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate refresh
      // You can add actual refresh logic here
    } catch (error) {
      console.error('Refresh failed:', error)
      handleMobileLayoutError(error as Error, { action: 'pull_to_refresh' })
    } finally {
      setIsRefreshing(false)
      setPullDistance(0)
    }
  }, [enablePullToRefresh, handleMobileLayoutError])

  // Handle view mode changes
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    setCurrentStreamIndex(0) // Reset to first stream when changing modes
  }, [])

  // Handle stream navigation
  const handleStreamNavigation = useCallback((direction: 'next' | 'prev') => {
    if (streams.length === 0) return
    
    if (direction === 'next') {
      setCurrentStreamIndex(prev => (prev + 1) % streams.length)
    } else {
      setCurrentStreamIndex(prev => (prev - 1 + streams.length) % streams.length)
    }
  }, [streams.length])

  // Render based on view mode
  const renderContent = () => {
    if (streams.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">No streams added yet</div>
            <div className="text-sm text-muted-foreground">
              Add streams to start watching
            </div>
          </div>
        </div>
      )
    }

    switch (viewMode) {
      case 'single':
        return (
          <div className="flex-1 relative">
            <EnhancedMobileStreamViewer
              streams={streams}
              currentIndex={currentStreamIndex}
              onIndexChange={setCurrentStreamIndex}
              showControls={true}
            />
          </div>
        )

      case 'stack':
        return (
          <div className="flex-1 space-y-2 p-2">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden"
                style={{ height: `${100 / Math.min(streams.length, 3)}%` }}
              >
                <EnhancedMobileStreamViewer
                  streams={[stream]}
                  currentIndex={0}
                  onIndexChange={() => {}}
                  showControls={false}
                />
              </motion.div>
            ))}
          </div>
        )

      case 'grid':
        const gridCols = streams.length <= 2 ? 1 : 2
        const gridRows = Math.ceil(streams.length / gridCols)
        
        return (
          <div className={cn(
            "flex-1 grid gap-2 p-2",
            gridCols === 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden"
                onClick={() => {
                  setCurrentStreamIndex(index)
                  setViewMode('single')
                }}
              >
                <EnhancedMobileStreamViewer
                  streams={[stream]}
                  currentIndex={0}
                  onIndexChange={() => {}}
                  showControls={false}
                />
              </motion.div>
            ))}
          </div>
        )

      case 'pip':
        return (
          <div className="flex-1 relative">
            {/* Main stream */}
            <EnhancedMobileStreamViewer
              streams={[streams[currentStreamIndex]]}
              currentIndex={0}
              onIndexChange={() => {}}
              showControls={true}
            />
            
            {/* PiP streams */}
            <div className="absolute top-4 right-4 space-y-2">
              {streams
                .filter((_, index) => index !== currentStreamIndex)
                .slice(0, 3)
                .map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-24 h-16 bg-background/80 backdrop-blur-sm rounded border-2 border-border/50 overflow-hidden cursor-pointer"
                    onClick={() => {
                      const actualIndex = streams.findIndex(s => s.id === stream.id)
                      setCurrentStreamIndex(actualIndex)
                    }}
                  >
                    <EnhancedMobileStreamViewer
                      streams={[stream]}
                      currentIndex={0}
                      onIndexChange={() => {}}
                      showControls={false}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-background overflow-hidden",
        "mobile-container safari-mobile-scroll",
        className
      )}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 z-50 flex justify-center py-2"
            >
              <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Refreshing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main content */}
      {renderContent()}

      {/* Controls overlay */}
      {enableGestures && streams.length > 0 && (
        <MobileSwipeControls
          streams={streams}
          currentIndex={currentStreamIndex}
          onIndexChange={setCurrentStreamIndex}
          onViewModeChange={handleViewModeChange}
          viewMode={viewMode}
        />
      )}

      {/* Layout optimization notification */}
      {enableAutoLayout && !isOptimalLayout && streams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-4 right-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Layout can be optimized
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                Switch to {recommendedLayout} for better mobile experience
              </div>
            </div>
            <button
              onClick={refreshLayout}
              className="px-3 py-1 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 rounded border border-yellow-500/30 text-yellow-700 dark:text-yellow-300"
            >
              Optimize
            </button>
          </div>
        </motion.div>
      )}

      {children}
    </div>
  )
}