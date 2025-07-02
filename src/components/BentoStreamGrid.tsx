'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import { useGesture } from '@use-gesture/react'
import { 
  Maximize2, 
  Minimize2, 
  Move, 
  RotateCcw, 
  Save, 
  Grid3X3,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Import CSS for react-grid-layout
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface BentoStreamGridProps {
  className?: string
  enableDragAndDrop?: boolean
  enableResize?: boolean
  onLayoutChange?: (layout: Layout[]) => void
}

interface GridItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
}

const BentoStreamGrid: React.FC<BentoStreamGridProps> = ({
  className,
  enableDragAndDrop = true,
  enableResize = true,
  onLayoutChange
}) => {
  const { streams } = useStreamStore()
  const { trackFeatureUsage } = useAnalytics()
  
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [isEditing, setIsEditing] = useState(false)
  const [focusedStream, setFocusedStream] = useState<string | null>(null)
  const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: Layout[] }>({})

  // Breakpoints for responsive design
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

  // Generate optimized layouts based on stream count
  const generateLayouts = useCallback((streamCount: number) => {
    const layouts: { [key: string]: Layout[] } = {}
    
    // Define layout configurations for different stream counts
    const layoutConfigs = {
      1: { lg: [{ i: '0', x: 2, y: 0, w: 8, h: 6 }] },
      2: { lg: [
        { i: '0', x: 0, y: 0, w: 6, h: 6 },
        { i: '1', x: 6, y: 0, w: 6, h: 6 }
      ]},
      3: { lg: [
        { i: '0', x: 0, y: 0, w: 8, h: 4 },
        { i: '1', x: 8, y: 0, w: 4, h: 4 },
        { i: '2', x: 0, y: 4, w: 12, h: 4 }
      ]},
      4: { lg: [
        { i: '0', x: 0, y: 0, w: 6, h: 4 },
        { i: '1', x: 6, y: 0, w: 6, h: 4 },
        { i: '2', x: 0, y: 4, w: 6, h: 4 },
        { i: '3', x: 6, y: 4, w: 6, h: 4 }
      ]},
      6: { lg: [
        { i: '0', x: 0, y: 0, w: 4, h: 4 },
        { i: '1', x: 4, y: 0, w: 4, h: 4 },
        { i: '2', x: 8, y: 0, w: 4, h: 4 },
        { i: '3', x: 0, y: 4, w: 4, h: 4 },
        { i: '4', x: 4, y: 4, w: 4, h: 4 },
        { i: '5', x: 8, y: 4, w: 4, h: 4 }
      ]}
    }

    // Get layout config or generate default
    const config = layoutConfigs[streamCount as keyof typeof layoutConfigs] || {
      lg: streams.map((_, index) => ({
        i: index.toString(),
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 4,
        w: 4,
        h: 4
      }))
    }

    // Generate responsive layouts
    Object.keys(breakpoints).forEach(breakpoint => {
      const multiplier = breakpoint === 'lg' ? 1 : breakpoint === 'md' ? 0.8 : 0.6
      layouts[breakpoint] = config.lg.map(item => ({
        ...item,
        w: Math.max(1, Math.round(item.w * multiplier)),
        h: Math.max(1, Math.round(item.h * multiplier))
      }))
    })

    return layouts
  }, [streams])

  // Initialize layouts when streams change
  useEffect(() => {
    if (streams.length > 0) {
      const newLayouts = generateLayouts(streams.length)
      setLayouts(newLayouts)
    }
  }, [streams.length, generateLayouts])

  // Handle layout changes
  const handleLayoutChange = useCallback((layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts)
    onLayoutChange?.(layout)
    
    if (isEditing) {
      trackFeatureUsage('bento_grid_layout_changed')
    }
  }, [isEditing, onLayoutChange, trackFeatureUsage])

  // Focus mode handler
  const handleFocusStream = useCallback((streamId: string) => {
    setFocusedStream(prev => prev === streamId ? null : streamId)
    trackFeatureUsage('bento_grid_focus_stream')
  }, [trackFeatureUsage])

  // Save current layout
  const handleSaveLayout = useCallback(() => {
    const layoutName = `Custom Layout ${Date.now()}`
    setSavedLayouts(prev => ({
      ...prev,
      [layoutName]: layouts.lg || []
    }))
    toast.success('Layout saved successfully!')
    trackFeatureUsage('bento_grid_save_layout')
  }, [layouts, trackFeatureUsage])

  // Reset to auto layout
  const handleResetLayout = useCallback(() => {
    const newLayouts = generateLayouts(streams.length)
    setLayouts(newLayouts)
    setFocusedStream(null)
    toast.success('Layout reset to auto!')
    trackFeatureUsage('bento_grid_reset_layout')
  }, [streams.length, generateLayouts, trackFeatureUsage])

  // Grid item component with enhanced features
  const GridItem = React.memo(({ stream, index }: { stream: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isFocused = focusedStream === stream.id

    return (
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl bg-card border border-border/50",
          "transition-all duration-300 ease-out",
          isHovered && "shadow-lg border-primary/30",
          isFocused && "ring-2 ring-primary shadow-xl z-10",
          isEditing && "cursor-move"
        )}
        style={{
          boxShadow: isFocused 
            ? "var(--elevation-4)" 
            : isHovered 
              ? "var(--elevation-3)" 
              : "var(--elevation-1)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: isFocused ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
        layoutId={`stream-${stream.id}`}
      >
        {/* Stream Content */}
        <div className="relative w-full h-full">
          <div className="w-full h-full">
            <StreamEmbedOptimized stream={stream} />
          </div>
          
          {/* Overlay Controls */}
          <AnimatePresence>
            {(isHovered || isEditing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              >
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90"
                    onClick={() => handleFocusStream(stream.id)}
                  >
                    {isFocused ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90 cursor-move"
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Stream Info Overlay */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-sm font-medium truncate">{stream.channelName}</div>
                    <div className="text-xs text-muted-foreground">
                      {stream.platform} • {stream.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  })

  // Control bar component
  const ControlBar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div 
        className="flex items-center gap-2 bg-background/90 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 shadow-lg"
        style={{ boxShadow: "var(--elevation-3)" }}
      >
        <Button
          size="sm"
          variant={isEditing ? "default" : "outline"}
          onClick={() => {
            setIsEditing(!isEditing)
            trackFeatureUsage('bento_grid_toggle_edit')
          }}
          className="h-8 gap-2"
        >
          <Grid3X3 className="h-4 w-4" />
          {isEditing ? 'Done' : 'Edit'}
        </Button>

        {isEditing && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetLayout}
              className="h-8 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveLayout}
              className="h-8 gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )

  if (!streams.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No streams added yet</h3>
          <p className="text-muted-foreground">Add some streams to start building your layout</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative flex-1 p-4", className)}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        isDraggable={enableDragAndDrop && isEditing}
        isResizable={enableResize && isEditing}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        preventCollision={false}
        compactType="vertical"
        resizeHandles={['se']}
      >
        {streams.map((stream, index) => (
          <div key={stream.id} data-grid={layouts.lg?.[index]}>
            <GridItem stream={stream} index={index} />
          </div>
        ))}
      </ResponsiveGridLayout>

      {/* Control Bar */}
      <AnimatePresence>
        {streams.length > 0 && <ControlBar />}
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusedStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setFocusedStream(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default BentoStreamGrid