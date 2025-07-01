'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'

// Memoized grid configuration function with improved case 3 handling
const calculateGridConfig = (count: number, gridLayout?: string) => {
  if (count === 0) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  if (count === 1) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  if (count === 2) return {
    cols: 2,
    rows: 1,
    class: gridLayout === '2x1' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-1'
  }
  
  // Fix case 3 handling - ensure proper 2x2 grid with 3 items
  if (count === 3) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  if (count === 4) return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
  
  if (count <= 6) return { cols: 3, rows: 2, class: 'grid-cols-3 grid-rows-2' }
  if (count <= 9) return { cols: 3, rows: 3, class: 'grid-cols-3 grid-rows-3' }
  if (count <= 12) return { cols: 4, rows: 3, class: 'grid-cols-4 grid-rows-3' }
  if (count <= 16) return { cols: 4, rows: 4, class: 'grid-cols-4 grid-rows-4' }
  
  // For more than 16 streams, use a 4-column layout with more rows
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
  const { streams, gridLayout, primaryStreamId } = useStreamStore()
  
  const gridConfig = useMemo(() => {
    if (gridLayout === 'custom' && primaryStreamId) {
      return { cols: 0, rows: 0, class: 'stream-grid-focus' }
    }
    return calculateGridConfig(streams.length, gridLayout)
  }, [streams.length, gridLayout, primaryStreamId])

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
        className={cn(
          'stream-grid grid w-full',
          responsiveGridClass,
          'touch-pan-y touch-pan-x',
          'min-h-full',
          'relative'
        )}
        data-count={streams.length}
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
              whileHover="hover"
              whileTap="tap"
              className={cn(
                'relative bg-black rounded-xl overflow-hidden shadow-lg',
                'border border-border/20',
                'will-change-transform',
                'isolate',
                primaryStreamId === stream.id && gridLayout === 'custom' && 'primary-stream'
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