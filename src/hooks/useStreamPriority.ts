import { useMemo } from 'react'
import { useStreamStore } from '@/store/streamStore'

export function useStreamPriority() {
  const { streams, primaryStreamId } = useStreamStore()

  return useMemo(() => {
    // Priority system for optimal loading performance
    const streamPriorities = streams.map((stream, index) => {
      let priority: 'high' | 'low' | 'lazy' = 'low'
      
      // Primary stream gets highest priority
      if (stream.id === primaryStreamId) {
        priority = 'high'
      }
      // First 4 streams get high priority (visible in most viewports)
      else if (index < 4) {
        priority = 'high'
      }
      // Next 4 streams get low priority (might be visible)
      else if (index < 8) {
        priority = 'low' 
      }
      // Remaining streams get lazy loading
      else {
        priority = 'lazy'
      }

      return {
        ...stream,
        priority,
        loadOrder: stream.id === primaryStreamId ? 0 : index + 1
      }
    })

    // Sort by load order to ensure primary stream loads first
    return streamPriorities.sort((a, b) => a.loadOrder - b.loadOrder)
  }, [streams, primaryStreamId])
}