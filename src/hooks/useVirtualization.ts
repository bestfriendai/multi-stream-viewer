'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface VirtualizationOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
  enabled?: boolean
}

interface VirtualizedRange {
  startIndex: number
  endIndex: number
  offsetY: number
}

export const useVirtualization = <T>(
  items: T[],
  options: VirtualizationOptions
): {
  virtualizedItems: Array<{ item: T; index: number; offsetY: number }>
  totalHeight: number
  range: VirtualizedRange
  scrollToIndex: (index: number) => void
} => {
  const {
    itemHeight,
    containerHeight,
    overscan = 2,
    enabled = true
  } = options

  const [scrollTop, setScrollTop] = useState(0)

  // Calculate visible range
  const range = useMemo((): VirtualizedRange => {
    if (!enabled || items.length === 0) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
        offsetY: 0
      }
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)
    const offsetY = startIndex * itemHeight

    return {
      startIndex,
      endIndex,
      offsetY
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, enabled, items.length])

  // Create virtualized items
  const virtualizedItems = useMemo(() => {
    if (!enabled) {
      return items.map((item, index) => ({
        item,
        index,
        offsetY: index * itemHeight
      }))
    }

    const result = []
    for (let i = range.startIndex; i <= range.endIndex; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
          offsetY: i * itemHeight
        })
      }
    }
    return result
  }, [items, range, itemHeight, enabled])

  // Total height for scrollbar
  const totalHeight = items.length * itemHeight

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = Math.max(0, Math.min(index * itemHeight, totalHeight - containerHeight))
    setScrollTop(targetScrollTop)
    
    // Trigger actual scroll if element exists
    const container = document.querySelector('[data-virtualized-container]')
    if (container) {
      container.scrollTop = targetScrollTop
    }
  }, [itemHeight, totalHeight, containerHeight])

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement
    if (target) {
      setScrollTop(target.scrollTop)
    }
  }, [])

  // Set up scroll listener
  useEffect(() => {
    const container = document.querySelector('[data-virtualized-container]')
    if (container && enabled) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, enabled])

  return {
    virtualizedItems,
    totalHeight,
    range,
    scrollToIndex
  }
}

// Hook specifically for mobile stream lists
export const useMobileStreamVirtualization = <T>(
  streams: T[],
  enabled: boolean = false // Disabled by default for mobile due to complexity
) => {
  const MOBILE_STREAM_HEIGHT = 200 // Approximate height of mobile stream card
  const CONTAINER_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800

  return useVirtualization(streams, {
    itemHeight: MOBILE_STREAM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 1, // Smaller overscan for mobile to save memory
    enabled: enabled && streams.length > 10 // Only enable for large lists
  })
}