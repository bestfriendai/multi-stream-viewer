'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Maximize2,
  Share2,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Volume2,
  VolumeX
} from 'lucide-react'
import { muteManager } from '@/lib/muteManager'
import { Button } from '@/components/ui/button'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { cn } from '@/lib/utils'
import { Drawer } from 'vaul'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import GestureStreamViewer from './GestureStreamViewer'
import BentoStreamGrid from './BentoStreamGrid'

interface EnhancedMobileLayoutProps {
  className?: string
  children?: React.ReactNode
}

type ViewMode = 'stack' | 'carousel' | 'grid' | 'focus'
type Orientation = 'portrait' | 'landscape'

const EnhancedMobileLayout: React.FC<EnhancedMobileLayoutProps> = ({
  className,
  children
}) => {
  const { streams, toggleStreamMute } = useStreamStore()
  const { trackFeatureUsage } = useAnalytics()
  const { isMobile, orientation } = useMobileDetection()
  
  const [viewMode, setViewMode] = useState<ViewMode>('stack')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [showGestureTutorial, setShowGestureTutorial] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Simplified Safari mobile refresh prevention
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile) return

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (!isSafari) return

    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches?.[0]) {
        startY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches?.[0]) return

      const currentY = e.touches[0].clientY
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const deltaY = currentY - startY

      // Only prevent pull-to-refresh at top of page
      if (scrollTop <= 0 && deltaY > 10) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isMobile])

  // Auto-switch view modes based on orientation - memoized
  useEffect(() => {
    if (orientation === 'landscape' && viewMode === 'stack') {
      setViewMode('grid')
    } else if (orientation === 'portrait' && viewMode === 'grid' && streams.length > 2) {
      setViewMode('stack')
    }
  }, [orientation, viewMode, streams.length])

  // Simplified refresh handler
  const handleRefresh = useCallback(() => {
    trackFeatureUsage('mobile_pull_to_refresh')
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }, [trackFeatureUsage])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    trackFeatureUsage(`mobile_view_mode_${mode}`)
  }, [trackFeatureUsage])

  // Optimized Stack Layout Component - Responsive sizing
  const StackLayout = useMemo(() => (
    <div className={cn(
      "space-y-6 h-full overflow-y-auto",
      isMobile ? "space-y-0 p-0" : "p-6"
    )}>
      {streams.map((stream, index) => (
        <motion.div
          key={stream.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative bg-card overflow-hidden border-border/50",
            "stream-card w-full",
            isMobile ? "border-0" : "rounded-lg border"
          )}
          style={{
            aspectRatio: isMobile ? '16/9' : '1/1',
            width: '100%',
            height: 'auto',
            minHeight: isMobile ? '200px' : '70vh',
            maxHeight: isMobile ? '300px' : '90vh'
          }}
        >
          <div className="w-full h-full">
            <StreamEmbedOptimized stream={stream} />
          </div>

          {/* Stream info overlay - only on desktop */}
          {!isMobile && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm z-10">
              <div className="font-medium">{stream.channelName}</div>
              <div className="text-xs opacity-80 capitalize">{stream.platform}</div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  ), [streams, isMobile])

  // Optimized Grid Layout Component - Responsive grid
  const GridLayout = useMemo(() => (
    <div className={cn(
      "grid gap-3",
      isMobile ? "p-4" : "p-6",
      orientation === 'portrait' && isMobile
        ? "grid-cols-1"
        : streams.length <= 2
          ? "grid-cols-2"
          : isMobile
            ? "grid-cols-2"
            : "grid-cols-3"
    )}>
      {streams.map((stream, index) => (
        <motion.div
          key={stream.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative bg-card rounded-lg overflow-hidden border border-border/50 stream-card"
          style={{
            aspectRatio: '16/9',
            minHeight: orientation === 'portrait' && isMobile ? '160px' : '120px',
            maxHeight: orientation === 'portrait' && isMobile ? '200px' : '160px'
          }}
          onClick={() => {
            setCurrentStreamIndex(index)
            setViewMode('focus')
          }}
        >
          <div className="w-full h-full">
            <StreamEmbedOptimized stream={stream} />
          </div>
        </motion.div>
      ))}
    </div>
  ), [streams, isMobile, orientation, setCurrentStreamIndex, setViewMode])


  // View Mode Selector
  const ViewModeSelector = () => (
    <div className="flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-full border border-border/50">
      <Button
        size="sm"
        variant={viewMode === 'stack' ? 'default' : 'ghost'}
        onClick={() => handleViewModeChange('stack')}
        className="h-8 px-3 touch-target"
      >
        <ChevronDown className="h-4 w-4" />
        <span className="ml-1 text-xs">Stack</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        onClick={() => handleViewModeChange('grid')}
        className="h-8 px-3 touch-target"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="ml-1 text-xs">Grid</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'carousel' ? 'default' : 'ghost'}
        onClick={() => handleViewModeChange('carousel')}
        className="h-8 px-3 touch-target"
      >
        <Smartphone className="h-4 w-4" />
        <span className="ml-1 text-xs">Swipe</span>
      </Button>
    </div>
  )

  // Floating Action Button
  const FloatingActionButton = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        size="lg"
        onClick={() => setShowMobileMenu(true)}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        style={{ boxShadow: "var(--elevation-4)" }}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </motion.div>
  )

  // Mobile Menu Drawer
  const MobileMenuDrawer = () => (
    <Drawer.Root open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[80vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            
            <div className="space-y-6">
              {/* Current Device Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {orientation === 'portrait' ? (
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Tablet className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">Mobile View</div>
                  <div className="text-sm text-muted-foreground">
                    {orientation} • {streams.length} streams
                  </div>
                </div>
              </div>

              {/* View Mode Selection */}
              <div>
                <h3 className="font-medium mb-3">View Mode</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mode: 'stack' as ViewMode, icon: ChevronDown, label: 'Stack' },
                    { mode: 'grid' as ViewMode, icon: Grid3X3, label: 'Grid' },
                    { mode: 'carousel' as ViewMode, icon: Smartphone, label: 'Swipe' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'}
                      className="h-16 flex-col gap-1 touch-target"
                      onClick={() => {
                        handleViewModeChange(mode)
                        setShowMobileMenu(false)
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 touch-target"
                    onClick={() => {
                      setShowGestureTutorial(true)
                      setShowMobileMenu(false)
                    }}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Gesture Tutorial
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 touch-target"
                    onClick={() => {
                      setViewMode('focus')
                      setShowMobileMenu(false)
                    }}
                  >
                    <Maximize2 className="mr-3 h-5 w-5" />
                    Focus Mode
                  </Button>
                </div>
              </div>

              {/* Orientation Tips */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">💡 Tip</h4>
                <p className="text-sm text-muted-foreground">
                  {orientation === 'portrait' 
                    ? "Rotate your device to landscape for grid view"
                    : "Use landscape mode for better multi-stream viewing"
                  }
                </p>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )

  // Gesture Tutorial
  const GestureTutorial = () => (
    <Drawer.Root open={showGestureTutorial} onOpenChange={setShowGestureTutorial}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[70vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
            
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Gesture Controls</h2>
                <p className="text-muted-foreground">Master these gestures for the best experience</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    gesture: "Swipe Left/Right",
                    description: "Navigate between streams in carousel mode",
                    emoji: "👈👉"
                  },
                  {
                    gesture: "Swipe Up/Down",
                    description: "Show/hide stream information and controls",
                    emoji: "👆👇"
                  },
                  {
                    gesture: "Pinch to Zoom",
                    description: "Zoom in/out on any stream",
                    emoji: "🤏"
                  },
                  {
                    gesture: "Double Tap",
                    description: "Quick zoom or enter focus mode",
                    emoji: "✌️"
                  },
                  {
                    gesture: "Long Press",
                    description: "Open context menu and options",
                    emoji: "👆"
                  },
                  {
                    gesture: "Pull to Refresh",
                    description: "Refresh stream data",
                    emoji: "↻"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="text-2xl">{item.emoji}</div>
                    <div>
                      <div className="font-medium">{item.gesture}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )

  if (!streams.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Mobile Experience Ready</h3>
          <p className="text-muted-foreground">Add streams to see the enhanced mobile layout</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative bg-background", "min-h-screen overflow-hidden", className)}
    >
      {/* Content based on view mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'stack' && (
          <motion.div
            key="stack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {StackLayout}
          </motion.div>
        )}
        
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            {GridLayout}
          </motion.div>
        )}
        
        {viewMode === 'carousel' && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <GestureStreamViewer 
              onStreamChange={setCurrentStreamIndex}
            />
          </motion.div>
        )}
        
        {viewMode === 'focus' && (
          <motion.div
            key="focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <GestureStreamViewer 
              onStreamChange={setCurrentStreamIndex}
            />
            <Button
              className="absolute top-4 left-4 z-50 touch-target"
              variant="secondary"
              size="sm"
              onClick={() => setViewMode('stack')}
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Back
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Selector (only for stack/grid modes) */}
      {(viewMode === 'stack' || viewMode === 'grid') && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30"
        >
          <ViewModeSelector />
        </motion.div>
      )}

      {/* Floating Action Button */}
      {viewMode !== 'focus' && <FloatingActionButton />}

      {/* Mobile Menu */}
      <MobileMenuDrawer />
      
      {/* Gesture Tutorial */}
      <GestureTutorial />
    </div>
  )
}

export default EnhancedMobileLayout