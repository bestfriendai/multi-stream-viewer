'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import '@/styles/mobile-stream-grid.css'

// Enhanced mobile-first grid configuration
const calculateGridConfig = (count: number, gridLayout?: string, isMobile?: boolean) => {
  if (count === 0) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  if (count === 1) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  
  // Mobile-optimized layouts - Bigger boxes inspired by Twitch mobile
  if (isMobile) {
    if (count === 1) return { cols: 1, rows: 1, class: 'mobile-grid-single' }
    if (count === 2) return { cols: 1, rows: 2, class: 'mobile-grid-1x2' }
    if (count === 3) return { cols: 1, rows: 3, class: 'mobile-grid-scroll' }
    if (count === 4) return { cols: 2, rows: 2, class: 'mobile-grid-2x2' }
    // For more streams on mobile, use scrollable single column for better viewing
    return { cols: 1, rows: count, class: 'mobile-grid-scroll' }
  }
  
  // Desktop layouts
  if (count === 2) return {
    cols: 2,
    rows: 1,
    class: gridLayout === '2x1' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-1'
  }
  
  if (count === 3) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  if (count === 4) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  
  if (count <= 6) return { cols: 3, rows: 2, class: 'grid-cols-3 grid-rows-2' }
  if (count <= 9) return { cols: 3, rows: 3, class: 'grid-cols-3 grid-rows-3' }
  if (count <= 12) return { cols: 4, rows: 3, class: 'grid-cols-4 grid-rows-3' }
  if (count <= 16) return { cols: 4, rows: 4, class: 'grid-cols-4 grid-rows-4' }
  
  return { cols: 4, rows: Math.ceil(count / 4), class: 'grid-cols-4' }
}

// Responsive breakpoint classes for mobile support
const getResponsiveClasses = (baseClass: string) => {
  // On mobile, let CSS media queries handle the layout
  // This prevents conflicts between Tailwind responsive classes and CSS media queries
  const responsiveMap: Record<string, string> = {
    'grid-cols-1': 'grid-cols-1',
    'grid-cols-2 grid-rows-1': 'grid-cols-2 grid-rows-1',
    'grid-cols-2 grid-rows-2': 'grid-cols-2 grid-rows-2',
    'grid-cols-3 grid-rows-2': 'grid-cols-3 grid-rows-2',
    'grid-cols-3 grid-rows-3': 'grid-cols-3 grid-rows-3',
    'grid-cols-4 grid-rows-3': 'grid-cols-4 grid-rows-3',
    'grid-cols-4 grid-rows-4': 'grid-cols-4 grid-rows-4',
    'grid-cols-4': 'grid-cols-4',
    'stream-grid-focus': 'stream-grid-focus',
  }
  
  return responsiveMap[baseClass] || baseClass
}

// Enhanced animation variants for modern motion design
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
  const { streams, gridLayout, primaryStreamId, setActiveStream } = useStreamStore()
  const [isMobile, setIsMobile] = useState(false)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  
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
    if (gridLayout === 'custom' && primaryStreamId) {
      return { cols: 0, rows: 0, class: 'stream-grid-focus' }
    }
    return calculateGridConfig(streams.length, gridLayout, isMobile)
  }, [streams.length, gridLayout, primaryStreamId, isMobile])

  // Mobile swipe navigation
  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!isMobile || streams.length <= 2) return
    
    const threshold = 50
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentMobileIndex > 0) {
        setCurrentMobileIndex(currentMobileIndex - 1)
      } else if (info.offset.x < 0 && currentMobileIndex < streams.length - 1) {
        setCurrentMobileIndex(currentMobileIndex + 1)
      }
    }
  }

  const responsiveGridClass = useMemo(() =>
    getResponsiveClasses(gridConfig.class),
    [gridConfig.class]
  )
  
  return (
    <LayoutGroup>
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        onPanEnd={handlePanEnd}
        className={cn(
          'stream-grid w-full',
          isMobile && streams.length > 2 ? 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide' : `grid ${responsiveGridClass}`,
          'touch-pan-y',
          isMobile ? 'touch-pan-x' : '',
          'min-h-full',
          'relative',
          // Mobile-specific classes
          isMobile && 'mobile-stream-grid',
          // Custom CSS classes for mobile layouts
          isMobile && gridConfig.class.startsWith('mobile-') && gridConfig.class
        )}
        data-count={streams.length}
        data-mobile={isMobile}
        role="grid"
        aria-label={`Stream grid with ${streams.length} stream${streams.length === 1 ? '' : 's'}`}
      >
        <AnimatePresence mode="popLayout">
          {streams.map((stream, index) => (
            <motion.div
              key={stream.id}
              layout
              layoutId={`stream-${stream.id}`}
              variants={streamCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
{...(!isMobile && { whileHover: "hover" })}
              whileTap="tap"
              onTap={() => isMobile && setActiveStream(stream.id)}
              className={cn(
                'relative bg-black overflow-hidden shadow-lg',
                'border border-border/20',
                'will-change-transform',
                'isolate',
                // Mobile-specific styling - Bigger boxes like Twitch mobile
                isMobile ? [
                  'flex-shrink-0 snap-start',
                  streams.length > 2 ? 'w-[90vw] mr-4' : 'flex-1',
                  'rounded-xl',
                  'min-h-[70vh]', // Increased from 60vh to 70vh for bigger boxes
                  'shadow-xl' // Add more prominent shadow
                ] : [
                  'rounded-xl'
                ],
                // Desktop styling
                !isMobile && primaryStreamId === stream.id && gridLayout === 'custom' && 'primary-stream'
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
              
              {/* Mobile stream indicator */}
              {isMobile && streams.length > 2 && (
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {index + 1} / {streams.length}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {streams.length === 0 && (
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
        )}
      </motion.div>
    </LayoutGroup>
  )
})

StreamGrid.displayName = 'StreamGrid'

export default StreamGrid