'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Share2,
  Heart,
  MessageSquare,
  MoreHorizontal,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Drawer } from 'vaul'
import { muteManager } from '@/lib/muteManager'

interface GestureStreamViewerProps {
  className?: string
  enableGestures?: boolean
  enableSwipe?: boolean
  enablePinchZoom?: boolean
  onStreamChange?: (streamIndex: number) => void
}

const GestureStreamViewer: React.FC<GestureStreamViewerProps> = ({
  className,
  enableGestures = true,
  enableSwipe = true,
  enablePinchZoom = true,
  onStreamChange
}) => {
  const { streams, toggleStreamMute } = useStreamStore()
  const { trackFeatureUsage } = useAnalytics()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [rotation, setRotation] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Motion values for gestures
  const x = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  
  // Transform values
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const rotateX = useTransform(rotate, [0, 180], [0, 180])

  // Cleanup motion values on unmount
  useEffect(() => {
    return () => {
      x.destroy()
      scale.destroy()
      rotate.destroy()
      opacity.destroy()
      rotateX.destroy()
    }
  }, [])

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < streams.length - 1) {
      setCurrentIndex(currentIndex + 1)
      onStreamChange?.(currentIndex + 1)
      trackFeatureUsage('gesture_viewer_next')
    }
  }, [currentIndex, streams.length, onStreamChange, trackFeatureUsage])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      onStreamChange?.(currentIndex - 1)
      trackFeatureUsage('gesture_viewer_previous')
    }
  }, [currentIndex, onStreamChange, trackFeatureUsage])

  const goToStream = useCallback((index: number) => {
    if (index >= 0 && index < streams.length) {
      setCurrentIndex(index)
      onStreamChange?.(index)
      trackFeatureUsage('gesture_viewer_goto')
    }
  }, [streams.length, onStreamChange, trackFeatureUsage])

  // Gesture handlers
  const bind = useGesture({
    // Swipe gestures
    onDrag: ({ down, movement: [mx, my], direction: [dx], velocity: [vx], cancel }) => {
      if (!enableSwipe || !enableGestures) return
      
      // Vertical swipe to show/hide info - Re-enabled with better detection
      if (Math.abs(my) > Math.abs(mx) && Math.abs(my) > 80) {
        setShowInfo(my < 0)
        cancel()
        return
      }
      
      // Only handle horizontal swipe for navigation
      if (Math.abs(mx) > Math.abs(my)) {
        if (down) {
          x.set(mx)
        } else {
          if (Math.abs(mx) > 100 || Math.abs(vx) > 0.5) {
            if (dx > 0) {
              goToPrevious()
            } else {
              goToNext()
            }
          }
          x.set(0)
        }
      }
      
      resetControlsTimeout()
    },
    
    // Pinch gestures
    onPinch: ({ offset: [scale], origin: [ox, oy] }) => {
      if (!enablePinchZoom || !enableGestures) return
      
      const newScale = Math.max(1, Math.min(3, scale))
      setZoomLevel(newScale)
      setIsZoomed(newScale > 1)
      
      if (newScale > 1) {
        trackFeatureUsage('gesture_viewer_zoom_in')
      }
      
      resetControlsTimeout()
    },
    
    // Double tap to zoom and show info
    onDoubleClick: ({ event }) => {
      if (!enableGestures) return
      
      event.preventDefault()
      
      if (enablePinchZoom) {
        const newZoom = isZoomed ? 1 : 2
        setZoomLevel(newZoom)
        setIsZoomed(newZoom > 1)
        trackFeatureUsage('gesture_viewer_double_tap_zoom')
      }
      
      setShowInfo(true)
      
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      trackFeatureUsage('gesture_viewer_double_click')
      resetControlsTimeout()
    },
    
    // Touch to show controls
    onClick: () => {
      resetControlsTimeout()
    }
  }, {
    drag: {
      axis: 'x',
      bounds: { left: -300, right: 300 },
      rubberband: true
    },
    pinch: {
      scaleBounds: { min: 1, max: 3 },
      rubberband: true
    }
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case ' ':
          event.preventDefault()
          if (currentStream) {
            toggleStreamMute(currentStream.id)
          }
          break
        case 'f':
          toggleFullscreen()
          break
        case 'r':
          handleRotate()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false)
          }
          if (isZoomed) {
            setZoomLevel(1)
            setIsZoomed(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, streams.length, isFullscreen, isZoomed, toggleStreamMute])

  // Control functions
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
    trackFeatureUsage('gesture_viewer_fullscreen')
  }, [trackFeatureUsage])

  const handleRotate = useCallback(() => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    rotate.set(newRotation)
    trackFeatureUsage('gesture_viewer_rotate')
  }, [rotation, rotate, trackFeatureUsage])

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(3, zoomLevel + 0.5)
    setZoomLevel(newZoom)
    setIsZoomed(newZoom > 1)
  }, [zoomLevel])

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(1, zoomLevel - 0.5)
    setZoomLevel(newZoom)
    setIsZoomed(newZoom <= 1 ? false : true)
  }, [zoomLevel])

  const handleShare = useCallback(() => {
    const stream = streams[currentIndex]
    if (stream && 'share' in navigator) {
      navigator.share({
        title: stream.channelName,
        text: `Check out ${stream.channelName} on ${stream.platform}`,
        url: `https://${stream.platform}.tv/${stream.channelName}`
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(`https://${stream.platform}.tv/${stream.channelName}`)
        toast.success('Stream URL copied to clipboard!')
      })
    }
    trackFeatureUsage('gesture_viewer_share')
  }, [streams, currentIndex, trackFeatureUsage])

  const currentStream = streams[currentIndex]

  if (!streams.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold mb-2">No streams to view</h3>
          <p className="text-muted-foreground">Add some streams to start watching</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      {...bind()}
      className={cn("relative flex-1 overflow-hidden bg-black", className)}
    >
      {/* Main Stream Viewer */}
      <motion.div
        className="relative w-full h-full"
        style={{
          x,
          scale: zoomLevel,
          rotate: rotateX,
          opacity
        }}
        animate={{
          scale: zoomLevel,
          rotate: rotation
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {currentStream && (
          <div className="w-full h-full">
            <StreamEmbedOptimized stream={currentStream} />
          </div>
        )}
      </motion.div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {streams.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStream(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 touch-target-expand",
              index === currentIndex 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      {/* Gesture Helper */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            {/* Swipe indicators */}
            {currentIndex > 0 && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ x: [-10, 0, -10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1 text-white/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="text-sm">Swipe</span>
                </motion.div>
              </div>
            )}
            
            {currentIndex < streams.length - 1 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ x: [10, 0, 10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1 text-white/70"
                >
                  <span className="text-sm">Swipe</span>
                  <ChevronRight className="h-6 w-6" />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl rounded-full px-4 py-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (currentStream) {
                    toggleStreamMute(currentStream.id)
                  }
                }}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                {currentStream && muteManager.getMuteState(currentStream.id) ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleRotate}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <RotateCw className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoomIn}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoomOut}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <Share2 className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInfo(true)}
                className="h-10 w-10 p-0 text-white hover:bg-white/20"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream Info Drawer */}
      <Drawer.Root open={showInfo} onOpenChange={setShowInfo}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[60vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-background rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
              
              {currentStream && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentStream.channelName}</h2>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{currentStream.platform}</span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        currentStream.isActive 
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                      )}>
                        {currentStream.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="h-12 gap-2" style={{ minHeight: '56px' }}>
                      <Heart className="h-4 w-4" />
                      Follow
                    </Button>
                    <Button variant="outline" className="h-12 gap-2" style={{ minHeight: '56px' }}>
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </Button>
                    <Button variant="outline" className="h-12 gap-2" style={{ minHeight: '56px' }}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  {/* Gesture Help */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Gesture Controls</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• Swipe left/right to change streams</div>
                      <div>• Swipe up/down to show/hide info</div>
                      <div>• Pinch to zoom in/out</div>
                      <div>• Double tap to zoom</div>
                      <div>• Long press for options</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

export default GestureStreamViewer