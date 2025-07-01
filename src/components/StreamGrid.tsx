'use client'

import React, { useMemo } from 'react'
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
    <div
      className={cn(
        'stream-grid grid w-full animate-fade-in',
        responsiveGridClass,
        'touch-pan-y touch-pan-x',
        'min-h-full'
      )}
      data-count={streams.length}
      role="grid"
      aria-label={`Stream grid with ${streams.length} stream${streams.length === 1 ? '' : 's'}`}
    >
      {streams.map((stream, index) => (
        <div
          key={stream.id}
          className={cn(
            'relative bg-black rounded-2xl overflow-hidden shadow-lg transition-all duration-300',
            'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
            'animate-scale-in transform-gpu',
            primaryStreamId === stream.id && gridLayout === 'custom' && 'primary-stream',
            'border border-border/20',
            'will-change-transform'
          )}
          style={{
            animationDelay: `${index * 30}ms`,
            contain: 'layout style paint'
          }}
          role="gridcell"
          aria-label={`Stream ${index + 1}: ${stream.channelName || 'Unknown stream'}`}
        >
          <StreamEmbedOptimized stream={stream} />
        </div>
      ))}
      
      {streams.length === 0 && (
        <div
          className="flex items-center justify-center h-full animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 animate-bounce-in transform-gpu">
            <h2 className="text-2xl font-semibold mb-2 tracking-tight">No streams added</h2>
            <p className="text-muted-foreground">Add a stream to start watching</p>
          </div>
        </div>
      )}
    </div>
  )
})

StreamGrid.displayName = 'StreamGrid'

export default StreamGrid