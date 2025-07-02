'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'
import AMPStreamEmbed from './AMPStreamEmbed'
import type { Stream } from '@/types/stream'

interface AMPStreamGridProps {
  streams: readonly Stream[]
  liveStatusMap: Map<string, { isLive: boolean; viewerCount?: number }>
}

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
  }
}

const AMPStreamGrid: React.FC<AMPStreamGridProps> = React.memo(({ streams, liveStatusMap }) => {
  // Sort streams by live status and determine layout
  const { sortedStreams, liveCount, layoutClass } = useMemo(() => {
    const sorted = [...streams].sort((a, b) => {
      const aLive = liveStatusMap.get(a.channelName)?.isLive || false
      const bLive = liveStatusMap.get(b.channelName)?.isLive || false
      
      // Live streams first
      if (aLive && !bLive) return -1
      if (!aLive && bLive) return 1
      
      // Then by viewer count if both are live
      if (aLive && bLive) {
        const aViewers = liveStatusMap.get(a.channelName)?.viewerCount || 0
        const bViewers = liveStatusMap.get(b.channelName)?.viewerCount || 0
        return bViewers - aViewers
      }
      
      // Keep original order for offline streams
      return 0
    })
    
    const liveStreamCount = sorted.filter(s => liveStatusMap.get(s.channelName)?.isLive).length
    
    // Determine layout based on live count
    let layout = 'amp-mosaic-grid'
    if (liveStreamCount === 1) {
      layout = 'amp-single-live-grid'
    } else if (liveStreamCount === 2) {
      layout = 'amp-two-live-grid'
    } else if (liveStreamCount === 3) {
      layout = 'amp-three-live-grid'
    }
    
    return { 
      sortedStreams: sorted, 
      liveCount: liveStreamCount,
      layoutClass: layout
    }
  }, [streams, liveStatusMap])
  
  return (
    <LayoutGroup>
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'stream-grid grid w-full h-full gap-3 p-4',
          layoutClass, // Use dynamic layout based on live count
          'touch-pan-y touch-pan-x',
          'relative'
        )}
        data-count={sortedStreams.length}
        data-live-count={liveCount}
        role="grid"
        aria-label={`AMP stream grid with ${sortedStreams.length} stream${sortedStreams.length === 1 ? '' : 's'}`}
      >
        <AnimatePresence mode="popLayout">
          {sortedStreams.map((stream, index) => {
            const isLive = liveStatusMap.get(stream.channelName)?.isLive || false
            const viewerCount = liveStatusMap.get(stream.channelName)?.viewerCount
            
            return (
              <motion.div
                key={stream.id}
                layout
                layoutId={`amp-stream-${stream.id}`}
                variants={streamCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  'relative bg-black rounded-xl overflow-hidden shadow-lg',
                  'border border-border/20',
                  'will-change-transform',
                  'isolate',
                  isLive && 'ring-2 ring-red-500 ring-opacity-50 live-stream',
                  !isLive && 'opacity-90'
                )}
                style={{
                  contain: 'layout style paint',
                  minWidth: 0,
                  minHeight: 0
                }}
                role="gridcell"
                aria-label={`Stream ${index + 1}: ${stream.channelName || 'Unknown stream'}${isLive ? ' - LIVE' : ''}`}
              >
                <AMPStreamEmbed stream={stream} />
                
                {/* Live indicator overlay */}
                {isLive && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full shadow-lg backdrop-blur-sm">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-bold">LIVE</span>
                      {viewerCount && (
                        <span className="text-white text-sm font-medium">
                          • {viewerCount.toLocaleString()} viewers
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Offline overlay */}
                {!isLive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white/70 text-sm font-medium px-3 py-1.5 bg-black/50 rounded-lg backdrop-blur-sm">
                      OFFLINE
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {sortedStreams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-full col-span-2 row-span-2"
            role="status"
            aria-live="polite"
          >
            <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">
                Loading AMP Streams
              </h2>
              <p className="text-muted-foreground">
                Setting up Kai Cenat, Duke Dennis, Agent00, and Fanum...
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </LayoutGroup>
  )
})

AMPStreamGrid.displayName = 'AMPStreamGrid'

export default AMPStreamGrid