'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import ResizableStreamGrid from './ResizableStreamGrid'
import '@/styles/mobile-stream-grid.css'
import '@/styles/layout-modes.css'

// Enhanced mobile-first grid configuration
const calculateGridConfig = (count: number, gridLayout?: string, isMobile?: boolean) => {
  if (count === 0) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  
  // Mobile-optimized layouts - Bigger boxes inspired by Twitch mobile
  if (isMobile) {
    if (count === 1) return { cols: 1, rows: 1, class: 'mobile-grid-single' }
    if (count === 2) return { cols: 1, rows: 2, class: 'mobile-grid-1x2' }
    if (count === 3) return { cols: 1, rows: 3, class: 'mobile-grid-scroll' }
    if (count === 4) return { cols: 2, rows: 2, class: 'mobile-grid-2x2' }
    // For more streams on mobile, use scrollable single column for better viewing
    return { cols: 1, rows: count, class: 'mobile-grid-scroll' }
  }
  
  // Handle specific layout requests first
  switch (gridLayout) {
    case '1x1':
      return { cols: 1, rows: count, class: 'grid-cols-1' }
    
    case '2x1':
      return { cols: 2, rows: Math.ceil(count / 2), class: 'grid-cols-2' }
    
    case '1x2':
      return { cols: 1, rows: Math.min(count, 2), class: 'grid-cols-1' }
    
    case 'grid-2x2':
    case '2x2':
      return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
    
    case 'grid-3x3':
    case '3x3':
      return { cols: 3, rows: 3, class: 'grid-cols-3 grid-rows-3' }
    
    case 'grid-4x4':
    case '4x4':
      return { cols: 4, rows: 4, class: 'grid-cols-4 grid-rows-4' }
    
    case 'mosaic':
      if (count === 1) return { cols: 1, rows: 1, class: 'mosaic-grid grid-cols-1 grid-rows-1' }
      if (count === 2) return { cols: 2, rows: 1, class: 'mosaic-grid grid-cols-2 grid-rows-1' }
      if (count === 3) return { cols: 3, rows: 1, class: 'mosaic-grid grid-cols-3 grid-rows-1' }
      if (count === 4) return { cols: 2, rows: 2, class: 'mosaic-grid grid-cols-2 grid-rows-2' }
      if (count <= 6) return { cols: 3, rows: 2, class: 'mosaic-grid grid-cols-3 grid-rows-2' }
      if (count <= 9) return { cols: 3, rows: 3, class: 'mosaic-grid grid-cols-3 grid-rows-3' }
      if (count <= 12) return { cols: 4, rows: 3, class: 'mosaic-grid grid-cols-4 grid-rows-3' }
      if (count <= 16) return { cols: 4, rows: 4, class: 'mosaic-grid grid-cols-4 grid-rows-4' }
      return { cols: 4, rows: Math.ceil(count / 4), class: 'mosaic-grid grid-cols-4' }
    
    case 'focus':
      return { cols: 0, rows: 0, class: 'focus-layout' }
    
    case 'pip':
      return { cols: 0, rows: 0, class: 'pip-layout' }
    
    case 'custom':
      return { cols: 0, rows: 0, class: 'focus-layout' }
  }
  
  // Default responsive layouts based on stream count
  if (count === 1) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  if (count === 2) return { cols: 2, rows: 1, class: 'grid-cols-2 grid-rows-1' }
  if (count === 3) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  if (count === 4) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  if (count <= 6) return { cols: 3, rows: 2, class: 'grid-cols-3 grid-rows-2' }
  if (count <= 9) return { cols: 3, rows: 3, class: 'grid-cols-3 grid-rows-3' }
  if (count <= 12) return { cols: 4, rows: 3, class: 'grid-cols-4 grid-rows-3' }
  if (count <= 16) return { cols: 4, rows: 4, class: 'grid-cols-4 grid-rows-4' }
  
  return { cols: 4, rows: Math.ceil(count / 4), class: 'grid-cols-4' }
}

// Enhanced animation variants
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const streamCardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

const emptyStateVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.2
    }
  }
}

const StreamGrid: React.FC = React.memo(() => {
  const { streams, gridLayout, primaryStreamId, setActiveStream, setPrimaryStream } = useStreamStore()
  const [isMobile, setIsMobile] = useState(false)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const [pipPosition] = useState('top-right')
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const gridConfig = useMemo(() => {
    const config = calculateGridConfig(streams.length, gridLayout, isMobile)
    console.log('Grid config:', { 
      streamsLength: streams.length, 
      gridLayout, 
      primaryStreamId, 
      isMobile,
      config 
    })
    return config
  }, [streams.length, gridLayout, primaryStreamId, isMobile])

  // Mobile swipe navigation with improved gesture handling
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile || streams.length <= 1) return
    
    const threshold = 50
    const velocity = Math.abs(info.velocity.x)
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      if (info.offset.x > 0 && currentMobileIndex > 0) {
        setCurrentMobileIndex(currentMobileIndex - 1)
      } else if (info.offset.x < 0 && currentMobileIndex < streams.length - 1) {
        setCurrentMobileIndex(currentMobileIndex + 1)
      }
    }
  }

  // Handle primary stream selection for focus mode
  const handleStreamClick = (streamId: string) => {
    if (gridLayout === 'focus' || gridLayout === 'custom') {
      setPrimaryStream(streamId)
    } else if (isMobile) {
      setActiveStream(streamId)
    }
  }

  // Render Focus Mode Layout
  const renderFocusLayout = () => {
    const primaryStream = streams.find(s => s.id === primaryStreamId) || streams[0]
    const secondaryStreams = streams.filter(s => s.id !== primaryStream?.id)

    if (!primaryStream) return null

    return (
      <div className={cn('focus-layout', isMobile && 'mobile-focus')}>
        {/* Primary Stream */}
        <motion.div
          layoutId={`stream-card-${primaryStream.id}`}
          className="primary-stream"
          variants={streamCardVariants}
          initial="hidden"
          animate="visible"
          {...(!isMobile && { whileHover: "hover" })}
        >
          <StreamEmbedOptimized stream={primaryStream} />
        </motion.div>

        {/* Secondary Streams */}
        {secondaryStreams.length > 0 && (
          <div className="secondary-streams">
            <AnimatePresence>
              {secondaryStreams.map((stream) => (
                <motion.div
                  key={`secondary-${stream.id}`}
                  layoutId={`stream-card-${stream.id}`}
                  className={cn(
                    'secondary-stream',
                    primaryStreamId === stream.id && 'active'
                  )}
                  variants={streamCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  {...(!isMobile && { whileHover: "hover" })}
                  whileTap="tap"
                  onClick={() => handleStreamClick(stream.id)}
                >
                  <StreamEmbedOptimized stream={stream} />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }

  // Render Picture-in-Picture Layout
  const renderPipLayout = () => {
    const mainStream = streams.find(s => s.id === primaryStreamId) || streams[0]
    const pipStreams = streams.filter(s => s.id !== mainStream?.id)

    if (!mainStream) return null

    return (
      <div className={cn('pip-layout', `pip-${pipPosition}`)}>
        {/* Main Stream */}
        <motion.div
          layoutId={`stream-card-${mainStream.id}`}
          className="main-stream"
          variants={streamCardVariants}
          initial="hidden"
          animate="visible"
        >
          <StreamEmbedOptimized stream={mainStream} />
        </motion.div>

        {/* PiP Streams */}
        {pipStreams.length > 0 && (
          <div className="pip-streams">
            <AnimatePresence>
              {pipStreams.map((stream, index) => (
                <motion.div
                  key={`pip-${stream.id}`}
                  layoutId={`stream-card-${stream.id}`}
                  className="pip-stream"
                  variants={streamCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  {...(!isMobile && { whileHover: "hover" })}
                  whileTap="tap"
                  onClick={() => handleStreamClick(stream.id)}
                  drag={!isMobile}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  style={{ zIndex: 20 + index }}
                >
                  <StreamEmbedOptimized stream={stream} />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }

  // Render Mobile Swipe Layout
  const renderMobileSwipeLayout = () => {
    if (!isMobile || streams.length <= 2) return null

    return (
      <div className="mobile-swipe-container">
        <motion.div 
          className="mobile-swipe-wrapper"
          style={{ 
            transform: `translateX(-${currentMobileIndex * 100}%)`,
            width: `${streams.length * 100}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {streams.map((stream, index) => (
            <div key={`mobile-${stream.id}`} className="mobile-swipe-item">
              <motion.div
                className="w-full h-full rounded-xl overflow-hidden bg-black"
                variants={streamCardVariants}
                initial="hidden"
                animate="visible"
                whileTap="tap"
                onTap={() => setActiveStream(stream.id)}
              >
                <StreamEmbedOptimized stream={stream} />
                
                {/* Mobile stream indicator */}
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {index + 1} / {streams.length}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Swipe indicators */}
        <div className="mobile-swipe-indicators">
          {streams.map((_, index) => (
            <button
              key={index}
              className={cn(
                'mobile-swipe-dot',
                index === currentMobileIndex && 'active'
              )}
              onClick={() => setCurrentMobileIndex(index)}
            />
          ))}
        </div>
      </div>
    )
  }

  // Render Standard Grid Layout
  const renderGridLayout = () => {
    return (
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        onPanEnd={handlePanEnd}
        className={cn(
          'stream-grid w-full grid',
          gridConfig.class,
          'touch-pan-y',
          isMobile ? 'touch-pan-x' : '',
          'min-h-full relative gap-2 p-2',
          isMobile && 'mobile-stream-grid',
          'layout-transition'
        )}
        data-count={streams.length}
        data-layout={gridLayout || 'auto'}
        data-mobile={isMobile}
        role="grid"
        aria-label={`Stream grid with ${streams.length} stream${streams.length === 1 ? '' : 's'}`}
      >
        <AnimatePresence mode="popLayout">
          {streams.map((stream, index) => (
            <motion.div
              key={`stream-${stream.id}`}
              layout="position"
              layoutId={`stream-card-${stream.id}`}
              variants={streamCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              {...(!isMobile && { whileHover: "hover" })}
              whileTap="tap"
              onTap={() => handleStreamClick(stream.id)}
              className={cn(
                'stream-card relative bg-black overflow-hidden shadow-lg',
                'border border-border/20 rounded-xl',
                'will-change-transform isolate',
                'min-h-[200px]',
                isMobile && 'min-h-[250px]'
              )}
              style={{
                contain: 'layout style paint',
                minWidth: 0,
                minHeight: 0
              }}
              role="gridcell"
              aria-label={`Stream ${index + 1}: ${stream.channelName || 'Unknown stream'}`}
            >
              <StreamEmbedOptimized stream={stream} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Main render logic
  if (streams.length === 0) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
      >
        <motion.div 
          className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2 
            className="text-2xl font-semibold mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            No streams added
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Add a stream to start watching
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <LayoutGroup>
      {/* Render appropriate layout based on mode */}
      {gridLayout === 'custom' ? (
        <ResizableStreamGrid layoutType={gridLayout} />
      ) : isMobile && streams.length > 2 ? (
        renderMobileSwipeLayout()
      ) : gridLayout === 'focus' ? (
        renderFocusLayout()
      ) : gridLayout === 'pip' ? (
        renderPipLayout()
      ) : (
        renderGridLayout()
      )}
    </LayoutGroup>
  )
})

StreamGrid.displayName = 'StreamGrid'

export default StreamGrid
