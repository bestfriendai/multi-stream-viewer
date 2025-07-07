'use client'

import { useEffect, useRef, useState } from 'react'
import { useStreamStore } from '@/store/streamStore'

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

interface UseMobileGesturesOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPullToRefresh?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onPinch?: (scale: number) => void
  onEdgeSwipe?: (edge: 'left' | 'right') => void
  swipeThreshold?: number
  velocityThreshold?: number
  pullThreshold?: number
  longPressDelay?: number
  enableHaptics?: boolean
  edgeSwipeWidth?: number
}

export const useMobileGestures = (options: UseMobileGesturesOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPullToRefresh,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    velocityThreshold = 0.3,
    pullThreshold = 100,
    longPressDelay = 500
  } = options

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [lastTap, setLastTap] = useState<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const { streams, setActiveStream } = useStreamStore()

  const calculateSwipe = (): SwipeDirection => {
    if (!touchStart || !touchEnd) return { direction: null, distance: 0, velocity: 0 }

    const distanceX = touchEnd.x - touchStart.x
    const distanceY = touchEnd.y - touchStart.y
    const timeDistance = touchEnd.time - touchStart.time
    const velocity = Math.sqrt(distanceX * distanceX + distanceY * distanceY) / timeDistance

    // Determine primary direction
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (Math.abs(distanceX) > swipeThreshold && velocity > velocityThreshold) {
        return {
          direction: distanceX > 0 ? 'right' : 'left',
          distance: Math.abs(distanceX),
          velocity
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(distanceY) > swipeThreshold && velocity > velocityThreshold) {
        return {
          direction: distanceY > 0 ? 'down' : 'up',
          distance: Math.abs(distanceY),
          velocity
        }
      }
    }

    return { direction: null, distance: 0, velocity: 0 }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    })

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress()
        longPressTimer.current = null
      }, longPressDelay)
    }

    // Check for pull to refresh (only if at top of page)
    if (window.scrollY <= 0 && onPullToRefresh) {
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch || !touchStart) return

    // Cancel long press if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    const currentY = touch.clientY
    const distanceY = currentY - touchStart.y

    // Handle pull to refresh - only if explicitly enabled and at top of page
    if (isPulling && distanceY > 0 && window.scrollY <= 0 && onPullToRefresh) {
      // Only prevent default if we're actually handling pull-to-refresh
      if (distanceY > 50) {
        e.preventDefault()
      }
      const distance = Math.min(distanceY, pullThreshold * 1.5)
      setPullDistance(distance)

      // Add resistance effect
      const resistance = distance / pullThreshold
      const adjustedDistance = distance - (resistance * 20)

      // Visual feedback (you can use this in your component)
      document.documentElement.style.setProperty('--pull-distance', `${adjustedDistance}px`)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (!touch) return

    // Cancel long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    })

    // Handle pull to refresh
    if (isPulling) {
      if (pullDistance >= pullThreshold && onPullToRefresh) {
        onPullToRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
      document.documentElement.style.setProperty('--pull-distance', '0px')
    }

    // Handle double tap
    const now = Date.now()
    if (onDoubleTap && now - lastTap < 300) {
      onDoubleTap()
      setLastTap(0)
    } else {
      setLastTap(now)
    }
  }

  useEffect(() => {
    if (!touchStart || !touchEnd) return

    const swipe = calculateSwipe()

    switch (swipe.direction) {
      case 'left':
        onSwipeLeft?.()
        break
      case 'right':
        onSwipeRight?.()
        break
      case 'up':
        onSwipeUp?.()
        break
      case 'down':
        onSwipeDown?.()
        break
    }

    // Reset touch state
    setTouchStart(null)
    setTouchEnd(null)
  }, [touchEnd]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stream navigation gestures
  const navigateStreams = {
    nextStream: () => {
      if (streams.length <= 1) return
      const currentIndex = streams.findIndex(s => s.id === streams[0]?.id) // Current active
      const nextIndex = (currentIndex + 1) % streams.length
      setActiveStream(streams[nextIndex]?.id || '')
    },
    previousStream: () => {
      if (streams.length <= 1) return
      const currentIndex = streams.findIndex(s => s.id === streams[0]?.id) // Current active
      const prevIndex = currentIndex === 0 ? streams.length - 1 : currentIndex - 1
      setActiveStream(streams[prevIndex]?.id || '')
    }
  }

  // Return gesture handlers and state
  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    state: {
      isPulling,
      pullDistance,
      isLongPressing: !!longPressTimer.current
    },
    actions: {
      navigateStreams
    }
  }
}

// Utility hook for common mobile stream gestures
export const useStreamGestures = () => {
  const { streams, toggleStreamMute, setActiveStream } = useStreamStore()
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)

  const gestures = useMobileGestures({
    onSwipeLeft: () => {
      // Next stream
      if (streams.length > 0) {
        const nextIndex = (currentStreamIndex + 1) % streams.length
        setCurrentStreamIndex(nextIndex)
        setActiveStream(streams[nextIndex]?.id || '')
      }
    },
    onSwipeRight: () => {
      // Previous stream
      if (streams.length > 0) {
        const prevIndex = currentStreamIndex === 0 ? streams.length - 1 : currentStreamIndex - 1
        setCurrentStreamIndex(prevIndex)
        setActiveStream(streams[prevIndex]?.id || '')
      }
    },
    onDoubleTap: () => {
      // Toggle mute on current stream
      if (streams[currentStreamIndex]) {
        toggleStreamMute(streams[currentStreamIndex].id)
      }
    },
    // onPullToRefresh disabled to prevent unwanted page refreshes
    // onPullToRefresh: () => {
    //   // Refresh streams without full page reload
    //   console.log('Pull to refresh triggered - implement stream refresh here')
    //   // TODO: Implement proper stream refresh logic
    // }
  })

  return {
    ...gestures,
    currentStreamIndex,
    currentStream: streams[currentStreamIndex]
  }
}

// Hook for keyboard shortcuts on mobile (when bluetooth keyboard connected)
export const useMobileKeyboard = () => {
  const { streams, toggleStreamMute, setActiveStream, clearAllStreams } = useStreamStore()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
          e.preventDefault()
          // Previous stream
          break
        case 'arrowright':
          e.preventDefault()
          // Next stream
          break
        case ' ':
        case 'm':
          e.preventDefault()
          // Toggle mute
          if (streams[0]) {
            toggleStreamMute(streams[0].id)
          }
          break
        case 'f':
          e.preventDefault()
          // Toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            document.documentElement.requestFullscreen()
          }
          break
        case 'escape':
          e.preventDefault()
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [streams, toggleStreamMute, setActiveStream, clearAllStreams])
}