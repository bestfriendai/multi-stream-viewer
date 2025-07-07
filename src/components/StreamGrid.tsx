'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbed from './StreamEmbed'
import SponsoredStreamEmbed from './SponsoredStreamEmbed'
import ResizableStreamGrid from './ResizableStreamGrid'
import { injectSponsoredStream, getUserStreamCount } from '@/lib/sponsoredStreams'
import StreamSkeleton, { StreamGridSkeleton } from './StreamSkeleton'
import { muteManager } from '@/lib/muteManager'
import { useTranslation } from '@/contexts/LanguageContext'
import type { GridLayout } from '@/types/stream'
import '@/styles/mobile-stream-grid.css'
import '@/styles/layout-modes.css'

// Enhanced mobile-first grid configuration
const calculateGridConfig = (count: number, gridLayout?: GridLayout, isMobile?: boolean) => {
  if (count === 0) return { cols: 1, rows: 1, class: 'grid-cols-1' }
  
  // Mobile-optimized layouts - Force single column stack for better mobile experience
  if (isMobile) {
    // Always use single column stack layout on mobile for better usability
    return { cols: 1, rows: count, class: 'mobile-stack-layout grid-cols-1' }
  }
  
  // Handle specific layout requests first
  switch (gridLayout) {
    case '1x1':
      return { cols: 1, rows: count, class: 'grid-cols-1' }
    
    case '2x1':
      return { cols: 2, rows: Math.ceil(count / 2), class: 'grid-cols-2' }
    
    case '1x2':
      return { cols: 1, rows: Math.min(count, 2), class: 'grid-cols-1' }
    
    case '2x2':
      return { cols: 2, rows: 2, class: 'grid-cols-2 grid-rows-2' }
    
    case '3x3':
      return { cols: 3, rows: 3, class: 'grid-cols-3 grid-rows-3' }
    
    case '4x4':
      return { cols: 4, rows: 4, class: 'grid-cols-4 grid-rows-4' }
    
    case 'mosaic':
      if (count === 1) return { cols: 1, rows: 1, class: 'mosaic-grid grid-cols-1' }
      if (count === 2) return { cols: 2, rows: 1, class: 'mosaic-grid grid-cols-2' }
      if (count === 3) return { cols: 2, rows: 2, class: 'mosaic-grid grid-cols-2 mosaic-3-streams' }
      if (count === 4) return { cols: 2, rows: 2, class: 'mosaic-grid grid-cols-2' }
      if (count === 5) return { cols: 3, rows: 2, class: 'mosaic-grid grid-cols-3 mosaic-5-streams' }
      if (count === 6) return { cols: 3, rows: 2, class: 'mosaic-grid grid-cols-3 mosaic-6-streams' }
      if (count <= 9) return { cols: 3, rows: 3, class: 'mosaic-grid grid-cols-3' }
      if (count <= 12) return { cols: 4, rows: 3, class: 'mosaic-grid grid-cols-4' }
      if (count <= 16) return { cols: 4, rows: 4, class: 'mosaic-grid grid-cols-4' }
      return { cols: 4, rows: Math.ceil(count / 4), class: 'mosaic-grid grid-cols-4' }
    
    case 'stacked':
      return { cols: 1, rows: count, class: 'stacked-layout' }

    case 'focus':
      return { cols: 0, rows: 0, class: 'focus-layout' }

    case 'pip':
      return { cols: 0, rows: 0, class: 'pip-layout' }

    case 'custom':
      return { cols: 0, rows: 0, class: 'custom-layout' }
    
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
  const { t } = useTranslation()
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const [pipPosition] = useState('top-right')
  
  // Stable mobile detection function
  const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }
  
  // Get streams with sponsored stream injected - memoize based on essential stream properties only
  const streamsWithSponsored = useMemo(() => {
    try {
      return injectSponsoredStream([...streams])
    } catch (error) {
      console.error('Error injecting sponsored stream:', error)
      return [...streams] // Fallback to original streams
    }
  }, [streams.length, streams.map(s => `${s.id}-${s.channelName}-${s.platform}`).join(',')])
  
  const gridConfig = useMemo(() => {
    const isMobile = isMobileDevice()
    const config = calculateGridConfig(streamsWithSponsored.length, gridLayout, isMobile)
    console.log('🔧 Grid config calculated:', {
      layout: gridLayout,
      streamCount: streamsWithSponsored.length,
      userStreamCount: getUserStreamCount(streamsWithSponsored),
      config,
      timestamp: new Date().toLocaleTimeString()
    })
    return config
  }, [streamsWithSponsored.length, gridLayout])

  // Mobile swipe navigation with improved gesture handling
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobileDevice() || streamsWithSponsored.length <= 1) return
    
    const threshold = 50
    const velocity = Math.abs(info.velocity.x)
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      if (info.offset.x > 0 && currentMobileIndex > 0) {
        setCurrentMobileIndex(currentMobileIndex - 1)
      } else if (info.offset.x < 0 && currentMobileIndex < streamsWithSponsored.length - 1) {
        setCurrentMobileIndex(currentMobileIndex + 1)
      }
    }
  }

  // Handle primary stream selection for focus mode
  const handleStreamClick = (streamId: string) => {
    if (gridLayout === 'focus' || gridLayout === 'pip') {
      setPrimaryStream(streamId)
    } else if (isMobileDevice()) {
      setActiveStream(streamId)
    }
  }

  // Render Focus Mode Layout
  const renderFocusLayout = () => {
    console.log('🎯 renderFocusLayout called with', { primaryStreamId, streamCount: streamsWithSponsored.length })
    
    // If no primaryStreamId is set, set the first stream as primary
    if (!primaryStreamId && streamsWithSponsored.length > 0) {
      console.log('🎯 No primaryStreamId set, setting first stream as primary')
      setPrimaryStream(streamsWithSponsored[0]!.id)
    }
    
    const primaryStream = streamsWithSponsored.find(s => s.id === primaryStreamId) || streamsWithSponsored[0]
    const secondaryStreams = streamsWithSponsored.filter(s => s.id !== primaryStream?.id)

    console.log('🎯 Focus layout streams:', { primaryStream: primaryStream?.channelName, secondaryCount: secondaryStreams.length })

    if (!primaryStream || streamsWithSponsored.length === 0) {
      console.log('🎯 No streams available, showing empty state')
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <h2 className="text-2xl font-semibold mb-2">{t('layouts.focusMode')}</h2>
            <p className="text-muted-foreground">{t('streams.addFirstStream')}</p>
          </div>
        </div>
      )
    }

    return (
      <div className={cn('focus-layout', isMobileDevice() && 'mobile-focus')}>
        {/* Primary Stream */}
        <motion.div
          layoutId={`stream-card-${primaryStream.id}`}
          className="primary-stream"
          variants={streamCardVariants}
          initial="hidden"
          animate="visible"
          {...(!isMobileDevice() && { whileHover: "hover" })}
        >
          {primaryStream.isSponsored ? (
            <SponsoredStreamEmbed 
              stream={primaryStream} 
            />
          ) : (
            <StreamEmbed 
              stream={primaryStream} 
            />
          )}
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
                    primaryStream?.id === stream.id && 'active'
                  )}
                  variants={streamCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  {...(!isMobileDevice() && { whileHover: "hover" })}
                  whileTap="tap"
                  onClick={() => handleStreamClick(stream.id)}
                >
                  {stream.isSponsored ? (
                    <SponsoredStreamEmbed 
                      stream={stream} 
                    />
                  ) : (
                    <StreamEmbed 
                      stream={stream} 
                    />
                  )}
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
    console.log('📺 renderPipLayout called with', { primaryStreamId, streamCount: streamsWithSponsored.length })
    
    // If no primaryStreamId is set, set the first stream as primary
    if (!primaryStreamId && streamsWithSponsored.length > 0) {
      console.log('📺 No primaryStreamId set, setting first stream as primary')
      setPrimaryStream(streamsWithSponsored[0]!.id)
    }
    
    const mainStream = streamsWithSponsored.find(s => s.id === primaryStreamId) || streamsWithSponsored[0]
    const pipStreams = streamsWithSponsored.filter(s => s.id !== mainStream?.id)

    console.log('📺 PiP layout streams:', { mainStream: mainStream?.channelName, pipCount: pipStreams.length })

    if (!mainStream || streamsWithSponsored.length === 0) {
      console.log('📺 No streams available, showing empty state')
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <h2 className="text-2xl font-semibold mb-2">{t('layouts.pip')}</h2>
            <p className="text-muted-foreground">{t('streams.addFirstStream')}</p>
          </div>
        </div>
      )
    }

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
          {mainStream.isSponsored ? (
            <SponsoredStreamEmbed 
              stream={mainStream} 
            />
          ) : (
            <StreamEmbed 
              stream={mainStream} 
            />
          )}
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
                  {...(!isMobileDevice() && { whileHover: "hover" })}
                  whileTap="tap"
                  onClick={() => handleStreamClick(stream.id)}
                  drag={!isMobileDevice()}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  style={{ zIndex: 20 + index }}
                >
                  {stream.isSponsored ? (
                    <SponsoredStreamEmbed 
                      stream={stream} 
                    />
                  ) : (
                    <StreamEmbed 
                      stream={stream} 
                    />
                  )}
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
    if (!isMobileDevice() || streamsWithSponsored.length <= 2) return null

    return (
      <div className="mobile-swipe-container">
        <motion.div 
          className="mobile-swipe-wrapper"
          style={{ 
            transform: `translateX(-${currentMobileIndex * 100}%)`,
            width: `${streamsWithSponsored.length * 100}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {streamsWithSponsored.map((stream, index) => (
            <div key={`mobile-${stream.id}`} className="mobile-swipe-item">
              <motion.div
                className="w-full h-full rounded-xl overflow-hidden bg-black"
                variants={streamCardVariants}
                initial="hidden"
                animate="visible"
                whileTap="tap"
                onTap={() => setActiveStream(stream.id)}
              >
                {stream.isSponsored ? (
                  <SponsoredStreamEmbed 
                    stream={stream} 
                  />
                ) : (
                  <StreamEmbed 
                    stream={stream} 
                  />
                )}
                
                {/* Mobile stream indicator */}
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {index + 1} / {streamsWithSponsored.length}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Swipe indicators */}
        <div className="mobile-swipe-indicators">
          {streamsWithSponsored.map((_, index) => (
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

  // Get mosaic-specific classes based on stream count
  const getMosaicClasses = () => {
    const count = streamsWithSponsored.length
    const classes = ['mosaic-grid']
    
    if (count <= 4) {
      classes.push(`grid-cols-${count}`)
    } else {
      classes.push('grid-cols-4')
    }
    
    // Add special pattern classes
    if (count === 3) classes.push('mosaic-3-streams')
    if (count === 5) classes.push('mosaic-5-streams')
    if (count === 6) classes.push('mosaic-6-streams')
    
    return classes.join(' ')
  }

  // Render Standard Grid Layout
  const renderGridLayout = () => {
    const isMosaicLayout = gridLayout === 'mosaic'
    
    return (
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        onPanEnd={handlePanEnd}
        className={cn(
          'stream-grid w-full',
          isMosaicLayout ? getMosaicClasses() : isMobileDevice() ? 'mobile-stack-layout' : `grid ${gridConfig.class}`,
          'touch-pan-y',
          isMobileDevice() ? 'touch-pan-x mobile-stream-grid' : '',
          isMosaicLayout ? 'h-full' : !isMobileDevice() ? 'min-h-full relative gap-2 p-2' : '',
          'layout-transition'
        )}
        data-count={streamsWithSponsored.length}
        data-layout={gridLayout || 'auto'}
        data-mobile={isMobileDevice()}
        role="grid"
        aria-label={`Stream grid with ${getUserStreamCount(streamsWithSponsored)} stream${getUserStreamCount(streamsWithSponsored) === 1 ? '' : 's'}${streamsWithSponsored.some(s => s.isSponsored) ? ' plus sponsored content' : ''}`}
      >
        <AnimatePresence mode="popLayout">
          {streamsWithSponsored.map((stream, index) => (
            <motion.div
              key={`stream-${stream.id}`}
              layout="position"
              layoutId={`stream-card-${stream.id}`}
              variants={streamCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              {...(!isMobileDevice() && { whileHover: "hover" })}
              whileTap="tap"
              onTap={() => handleStreamClick(stream.id)}
              className={cn(
                'stream-card relative bg-black overflow-hidden shadow-lg',
                'border border-border/20 rounded-xl',
                'will-change-transform isolate cursor-pointer',
                !isMobileDevice() && 'min-h-[200px]', // Only apply min-height on desktop
                isMobileDevice() && 'mobile-stream-card', // Use mobile-specific classes
                stream.isSponsored && 'sponsored-stream-card' // Add sponsored styling class
              )}
              style={{
                contain: 'layout style paint',
                minWidth: 0,
                minHeight: 0
              }}
              role="gridcell"
              aria-label={`${stream.isSponsored ? 'Sponsored ' : ''}Stream ${index + 1}: ${stream.channelName || 'Unknown stream'}`}
            >
              {stream.isSponsored ? (
                <SponsoredStreamEmbed 
                  stream={stream} 
                />
              ) : (
                <StreamEmbed 
                  stream={stream} 
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Main render logic - Check original streams, not the ones with sponsored content
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
{t('header.noStreamsActive')}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
{t('streams.addFirstStream')}
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <LayoutGroup>
      {/* Render appropriate layout based mode */}
      {(() => {
        console.log('🎯 StreamGrid: Deciding render method for layout:', gridLayout)
        
        if (gridLayout === 'custom') {
          console.log('🎯 Rendering custom layout')
          return <ResizableStreamGrid layoutType={gridLayout} />
        }
        
        // Mobile swipe layout is handled by EnhancedMobileLayout component now
        // Removed carousel check as it's not a valid gridLayout value
        
        if (gridLayout === 'focus') {
          console.log('🎯 Rendering focus layout')
          return renderFocusLayout()
        }
        
        if (gridLayout === 'pip') {
          console.log('🎯 Rendering pip layout')
          return renderPipLayout()
        }

        if (gridLayout === 'stacked') {
          console.log('🎯 Rendering stacked layout')
          return renderGridLayout()
        }

        if (gridLayout === 'mosaic') {
          console.log('🎯 Rendering mosaic layout (special grid)')
          return renderGridLayout() // Mosaic uses special CSS classes in renderGridLayout
        }

        console.log('🎯 Rendering standard grid layout')
        return renderGridLayout()
      })()}
    </LayoutGroup>
  )
})

StreamGrid.displayName = 'StreamGrid'

export default StreamGrid
