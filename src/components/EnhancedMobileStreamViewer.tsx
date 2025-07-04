'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import { Button } from '@/components/ui/button'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,
  MoreVertical
} from 'lucide-react'

interface EnhancedMobileStreamViewerProps {
  show: boolean
  onClose: () => void
}

export default function EnhancedMobileStreamViewer({ show, onClose }: EnhancedMobileStreamViewerProps) {
  const { streams, toggleStreamMute } = useStreamStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentStream = streams[currentIndex]

  // Enhanced gesture handling
  const bind = useGesture(
    {
      onDrag: ({ active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
        // Swipe threshold
        const swipeThreshold = 100
        const velocityThreshold = 0.2

        if (active && Math.abs(mx) > swipeThreshold || Math.abs(vx) > velocityThreshold) {
          cancel()
          
          if (xDir > 0 && currentIndex > 0) {
            // Swipe right - previous stream
            setCurrentIndex(prev => Math.max(0, prev - 1))
          } else if (xDir < 0 && currentIndex < streams.length - 1) {
            // Swipe left - next stream
            setCurrentIndex(prev => Math.min(streams.length - 1, prev + 1))
          }
        }
      },
      onPinch: ({ offset: [scale], origin: [ox, oy], active }) => {
        if (active && scale > 1.2) {
          setIsFullscreen(true)
        } else if (active && scale < 0.8) {
          setIsFullscreen(false)
        }
      },
      onClick: ({ event }) => {
        // Single tap - toggle controls
        setShowControls(prev => !prev)
      }
    },
    {
      drag: {
        axis: 'x',
        filterTaps: true,
        rubberband: true
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 3 },
        rubberband: true
      }
    }
  )

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    })
  }

  const controlsVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  if (!show || streams.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Main Stream Container */}
        <div 
          ref={containerRef}
          className={cn(
            "relative h-full w-full flex items-center justify-center overflow-hidden",
            isFullscreen && "cursor-none"
          )}
          {...bind()}
        >
          {/* Stream Carousel */}
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait" custom={currentIndex}>
              <motion.div
                key={currentStream?.id}
                custom={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full h-full max-w-none">
                  {currentStream && (
                    <StreamEmbedOptimized 
                      stream={currentStream} 
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Touch Indicators */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
            {currentIndex > 0 && (
              <motion.div
                className="w-16 h-32 bg-gradient-to-r from-black/20 to-transparent flex items-center justify-start pl-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChevronLeft className="text-white/60" size={24} />
              </motion.div>
            )}
            
            {currentIndex < streams.length - 1 && (
              <motion.div
                className="w-16 h-32 bg-gradient-to-l from-black/20 to-transparent flex items-center justify-end pr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChevronRight className="text-white/60" size={24} />
              </motion.div>
            )}
          </div>

          {/* Stream Indicators */}
          <motion.div 
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20"
            variants={controlsVariants}
            animate={showControls ? "visible" : "hidden"}
          >
            {streams.map((_, index) => (
              <motion.button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/40 hover:bg-white/60"
                )}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>

          {/* Top Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4"
                variants={controlsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:bg-white/10 h-10 w-10 p-0"
                    >
                      <X size={20} />
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <h3 className="text-white font-medium">
                      {currentStream?.channelName || `Stream ${currentIndex + 1}`}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {currentIndex + 1} of {streams.length}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10 h-10 w-10 p-0"
                    >
                      <MoreVertical size={20} />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent p-4"
                variants={controlsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center justify-center gap-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (currentStream) {
                          toggleStreamMute(currentStream.id)
                        }
                      }}
                      className="text-white hover:bg-white/10 h-12 w-12 p-0"
                    >
                      {currentStream?.muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-white hover:bg-white/10 h-12 w-12 p-0"
                    >
                      {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gesture Hints */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-white/80 text-xs text-center">
                    Swipe ← → to navigate • Tap to toggle controls • Double tap for fullscreen
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}