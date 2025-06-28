'use client'

import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import StreamEmbed from './StreamEmbed'

export default function StreamGrid() {
  const { streams, gridLayout, primaryStreamId } = useStreamStore()
  
  const getGridClass = () => {
    const streamCount = streams.length
    
    if (gridLayout === 'custom' && primaryStreamId) {
      return 'stream-grid-focus'
    }
    
    switch (streamCount) {
      case 0:
        return 'grid-cols-1'
      case 1:
        return 'grid-cols-1'
      case 2:
        return gridLayout === '2x1' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-1'
      case 3:
      case 4:
        return 'grid-cols-2 grid-rows-2'
      case 5:
      case 6:
        return 'grid-cols-3 grid-rows-2'
      case 7:
      case 8:
      case 9:
        return 'grid-cols-3 grid-rows-3'
      case 10:
      case 11:
      case 12:
        return 'grid-cols-4 grid-rows-3'
      case 13:
      case 14:
      case 15:
      case 16:
        return 'grid-cols-4 grid-rows-4'
      default:
        return 'grid-cols-4 grid-rows-4'
    }
  }
  
  return (
    <div 
      className={cn(
        'stream-grid grid gap-1 sm:gap-2 h-full w-full p-1 sm:p-2 md:p-4',
        getGridClass()
      )}
      data-count={streams.length}
    >
      {streams.map((stream) => (
        <div
          key={stream.id}
          className={cn(
            'relative bg-black rounded-lg overflow-hidden',
            primaryStreamId === stream.id && gridLayout === 'custom' && 'primary-stream'
          )}
        >
          <StreamEmbed
            stream={stream}
          />
        </div>
      ))}
      
      {streams.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">No streams added</h2>
            <p className="text-muted-foreground">Add a Twitch channel to start watching</p>
          </div>
        </div>
      )}
    </div>
  )
}