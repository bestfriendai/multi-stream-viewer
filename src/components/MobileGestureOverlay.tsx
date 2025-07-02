'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX, Maximize, Hand } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileGestureOverlayProps {
  showHints?: boolean
  onDismissHints?: () => void
}

export default function MobileGestureOverlay({ showHints = false, onDismissHints }: MobileGestureOverlayProps) {
  const [activeGesture, setActiveGesture] = useState<string | null>(null)
  const [pullDistance, setPullDistance] = useState(0)

  // Listen for custom gesture events
  useEffect(() => {
    const handleGestureStart = (e: CustomEvent) => {
      setActiveGesture(e.detail.type)
      setTimeout(() => setActiveGesture(null), 1000)
    }

    const handlePullDistance = () => {
      const distance = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pull-distance') || '0')
      setPullDistance(distance)
    }

    window.addEventListener('gesturestart', handleGestureStart as EventListener)
    window.addEventListener('touchmove', handlePullDistance)
    
    return () => {
      window.removeEventListener('gesturestart', handleGestureStart as EventListener)
      window.removeEventListener('touchmove', handlePullDistance)
    }
  }, [])

  return (
    <>
      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: pullDistance > 50 ? 1 : pullDistance / 50,
              scale: pullDistance > 50 ? 1 : 0.8 + (pullDistance / 50) * 0.2,
              y: Math.min(pullDistance * 0.5, 40)
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <RotateCcw 
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                pullDistance > 80 && "animate-spin"
              )} 
            />
            <span className="text-sm font-medium">
              {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Feedback */}
      <AnimatePresence>
        {activeGesture && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/80 text-white px-6 py-4 rounded-2xl backdrop-blur-sm flex items-center gap-3">
              {activeGesture === 'swipe-left' && (
                <>
                  <ChevronRight className="w-6 h-6" />
                  <span className="font-medium">Next Stream</span>
                </>
              )}
              {activeGesture === 'swipe-right' && (
                <>
                  <ChevronLeft className="w-6 h-6" />
                  <span className="font-medium">Previous Stream</span>
                </>
              )}
              {activeGesture === 'double-tap' && (
                <>
                  <Volume2 className="w-6 h-6" />
                  <span className="font-medium">Toggle Mute</span>
                </>
              )}
              {activeGesture === 'long-press' && (
                <>
                  <Maximize className="w-6 h-6" />
                  <span className="font-medium">Fullscreen</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hints Overlay */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={onDismissHints}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Hand className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-bold mb-2">Mobile Gestures</h3>
                <p className="text-muted-foreground text-sm">
                  Use these gestures to control your streams
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Swipe Left/Right</div>
                    <div className="text-xs text-muted-foreground">Navigate streams</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Double Tap</div>
                    <div className="text-xs text-muted-foreground">Toggle mute</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Long Press</div>
                    <div className="text-xs text-muted-foreground">Fullscreen mode</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Pull Down</div>
                    <div className="text-xs text-muted-foreground">Refresh streams</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onDismissHints}
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Indicators */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
        <motion.div
          animate={{ 
            x: activeGesture === 'swipe-right' ? [0, 10, 0] : 0,
            opacity: activeGesture === 'swipe-right' ? [0.5, 1, 0.5] : 0
          }}
          transition={{ duration: 0.5 }}
          className="w-1 h-16 bg-primary rounded-full"
        />
      </div>
      
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
        <motion.div
          animate={{ 
            x: activeGesture === 'swipe-left' ? [0, -10, 0] : 0,
            opacity: activeGesture === 'swipe-left' ? [0.5, 1, 0.5] : 0
          }}
          transition={{ duration: 0.5 }}
          className="w-1 h-16 bg-primary rounded-full"
        />
      </div>

      {/* Touch Feedback Dots */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: activeGesture === 'double-tap' && index === 1 ? [1, 1.5, 1] : 1,
                opacity: activeGesture === 'double-tap' ? 1 : 0.3
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Utility function to trigger gesture feedback
export const triggerGestureEvent = (type: string) => {
  window.dispatchEvent(new CustomEvent('gesturestart', { 
    detail: { type } 
  }))
}