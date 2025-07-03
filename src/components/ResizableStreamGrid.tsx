'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import { GripVertical, GripHorizontal } from 'lucide-react'

interface LayoutConfig {
  streams: Array<{
    id: string
    size: number
    minSize?: number
    maxSize?: number
  }>
  direction: 'horizontal' | 'vertical'
  nested?: LayoutConfig[]
}

const generateLayoutConfig = (streamCount: number): LayoutConfig => {
  if (streamCount === 0) {
    return { direction: 'horizontal', streams: [] }
  }
  
  if (streamCount === 1) {
    return {
      direction: 'horizontal',
      streams: [{ id: '0', size: 100 }]
    }
  }
  
  if (streamCount === 2) {
    return {
      direction: 'horizontal',
      streams: [
        { id: '0', size: 50, minSize: 20, maxSize: 80 },
        { id: '1', size: 50, minSize: 20, maxSize: 80 }
      ]
    }
  }
  
  if (streamCount === 3) {
    return {
      direction: 'horizontal',
      streams: [
        { id: '0', size: 50, minSize: 30, maxSize: 70 }
      ],
      nested: [
        {
          direction: 'vertical',
          streams: [
            { id: '1', size: 50, minSize: 20, maxSize: 80 },
            { id: '2', size: 50, minSize: 20, maxSize: 80 }
          ]
        }
      ]
    }
  }
  
  if (streamCount === 4) {
    return {
      direction: 'vertical',
      streams: [],
      nested: [
        {
          direction: 'horizontal',
          streams: [
            { id: '0', size: 50, minSize: 20, maxSize: 80 },
            { id: '1', size: 50, minSize: 20, maxSize: 80 }
          ]
        },
        {
          direction: 'horizontal', 
          streams: [
            { id: '2', size: 50, minSize: 20, maxSize: 80 },
            { id: '3', size: 50, minSize: 20, maxSize: 80 }
          ]
        }
      ]
    }
  }
  
  // For more than 4 streams, create a dynamic grid
  const cols = Math.ceil(Math.sqrt(streamCount))
  const rows = Math.ceil(streamCount / cols)
  const sizePerStream = 100 / Math.max(cols, rows)
  
  const streams = Array.from({ length: streamCount }, (_, i) => ({
    id: i.toString(),
    size: sizePerStream,
    minSize: 10,
    maxSize: 80
  }))
  
  if (rows === 1) {
    return { direction: 'horizontal', streams }
  }
  
  // Create nested layout for grid
  const nested = Array.from({ length: rows }, (_, rowIndex) => {
    const startIndex = rowIndex * cols
    const endIndex = Math.min(startIndex + cols, streamCount)
    const rowStreams = streams.slice(startIndex, endIndex)
    
    return {
      direction: 'horizontal' as const,
      streams: rowStreams.map((stream, colIndex) => ({
        id: (startIndex + colIndex).toString(),
        size: 100 / rowStreams.length,
        minSize: 10,
        maxSize: 90
      }))
    }
  })
  
  return {
    direction: 'vertical',
    streams: [],
    nested
  }
}

const defaultLayoutConfigs: Record<string, LayoutConfig> = {
  'custom': {
    direction: 'horizontal',
    streams: []
  }
}

const streamCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
}

interface ResizableStreamGridProps {
  layoutType?: string
}

export default function ResizableStreamGrid({ layoutType = 'custom' }: ResizableStreamGridProps) {
  const { streams, gridLayout } = useStreamStore()
  const [panelSizes, setPanelSizes] = useState<Record<string, number>>({})

  console.log('⚙️ ResizableStreamGrid rendering:', { layoutType, gridLayout, streamCount: streams.length })

  const layoutConfig = useMemo(() => {
    if (layoutType === 'custom' && streams.length > 0) {
      const config = generateLayoutConfig(streams.length)
      console.log('⚙️ Generated custom layout config:', config)
      return config
    }
    const fallback = defaultLayoutConfigs[layoutType || 'custom'] || generateLayoutConfig(streams.length)
    console.log('⚙️ Using fallback layout config:', fallback)
    return fallback
  }, [layoutType, streams.length])

  const renderResizableLayout = (config: LayoutConfig, streamsToRender: any[], level = 0) => {
    if (config.nested) {
      return (
        <PanelGroup 
          direction={config.direction}
          className="h-full w-full"
        >
          {config.nested.map((nestedConfig, index) => (
            <React.Fragment key={index}>
              <Panel 
                defaultSize={50}
                minSize={20}
                className="relative"
              >
                {renderResizableLayout(nestedConfig, streamsToRender, level + 1)}
              </Panel>
              {index < (config.nested?.length ?? 0) - 1 && (
                <PanelResizeHandle className="bg-border hover:bg-border/80 transition-colors relative group">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {config.direction === 'horizontal' ? (
                      <GripVertical size={16} className="text-muted-foreground" />
                    ) : (
                      <GripHorizontal size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </PanelResizeHandle>
              )}
            </React.Fragment>
          ))}
        </PanelGroup>
      )
    }

    return (
      <PanelGroup 
        direction={config.direction}
        className="h-full w-full"
      >
        {config.streams.map((streamConfig, index) => {
          const stream = streamsToRender[index]
          console.log('⚙️ Rendering stream panel:', { streamConfig, stream: stream?.channelName, index })
          if (!stream) {
            console.log('⚙️ No stream found for index', index, 'in', streamsToRender.length, 'streams')
            return null
          }

          return (
            <React.Fragment key={streamConfig.id}>
              <Panel
                defaultSize={streamConfig.size}
                minSize={streamConfig.minSize || 10}
                maxSize={streamConfig.maxSize || 90}
                className="relative"
                onResize={(size) => {
                  setPanelSizes(prev => ({
                    ...prev,
                    [`${level}-${index}`]: size
                  }))
                }}
              >
                <motion.div
                  layoutId={`stream-${stream.id}`}
                  variants={streamCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full w-full relative bg-black rounded-lg overflow-hidden border border-border/20"
                >
                  <StreamEmbedOptimized stream={stream} />
                  
                  {/* Stream Info Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-2 left-2 z-10"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
                      <span className="text-xs text-white font-medium">
                        {stream.channelName || `Stream ${index + 1}`}
                      </span>
                    </div>
                  </motion.div>

                  {/* Resize indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: panelSizes[`${level}-${index}`] ? 1 : 0 }}
                    className="absolute bottom-2 right-2 z-10"
                  >
                    <div className="bg-primary/80 backdrop-blur-sm rounded-md px-2 py-1">
                      <span className="text-xs text-primary-foreground font-medium">
                        {Math.round(panelSizes[`${level}-${index}`] || streamConfig.size)}%
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </Panel>
              
              {index < config.streams.length - 1 && (
                <PanelResizeHandle className="bg-border hover:bg-border/80 transition-colors relative group">
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    {config.direction === 'horizontal' ? (
                      <GripVertical size={16} className="text-muted-foreground" />
                    ) : (
                      <GripHorizontal size={16} className="text-muted-foreground" />
                    )}
                  </motion.div>
                </PanelResizeHandle>
              )}
            </React.Fragment>
          )
        })}
      </PanelGroup>
    )
  }

  // Show empty state if no streams
  if (streams.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-full"
      >
        <motion.div
          className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h2 
            className="text-2xl font-semibold mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Custom Layout Ready
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Add streams to start using resizable panels
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <LayoutGroup>
      <motion.div
        className="h-full w-full p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {layoutConfig && renderResizableLayout(layoutConfig, [...streams])}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}