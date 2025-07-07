'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  onDoubleTap?: () => void
  swipeThreshold?: number
  velocityThreshold?: number
  doubleTapDelay?: number
}

export const useMobileGestures = (options: UseMobileGesturesOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    swipeThreshold = 50,
    velocityThreshold = 0.3,
    doubleTapDelay = 300
  } = options

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTapRef = useRef<number>(0)

  const { streams, setActiveStream } = useStreamStore()

  const calculateSwipe = useCallback((touchStart: { x: number; y: number; time: number }, touchEnd: { x: number; y: number; time: number }): SwipeDirection => {
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
  }, [swipeThreshold, velocityThreshold])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Touch move handling is minimal to prevent performance issues
    // Only prevent default if needed for specific gestures
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (!touch || !touchStartRef.current) return

    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Handle swipe gestures
    const swipe = calculateSwipe(touchStartRef.current, touchEnd)
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

    // Handle double tap
    const now = Date.now()
    if (onDoubleTap && now - lastTapRef.current < doubleTapDelay) {
      onDoubleTap()
      lastTapRef.current = 0
    } else {
      lastTapRef.current = now
    }

    // Reset touch start
    touchStartRef.current = null
  }, [calculateSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, doubleTapDelay])

  // Remove useEffect dependency on touch state changes to prevent excessive re-renders

  // Stream navigation gestures - memoized
  const navigateStreams = useCallback({
    nextStream: () => {
      if (streams.length <= 1) return
      const currentIndex = streams.findIndex(s => s.id === streams[0]?.id)
      const nextIndex = (currentIndex + 1) % streams.length
      setActiveStream(streams[nextIndex]?.id || '')
    },
    previousStream: () => {
      if (streams.length <= 1) return
      const currentIndex = streams.findIndex(s => s.id === streams[0]?.id)
      const prevIndex = currentIndex === 0 ? streams.length - 1 : currentIndex - 1
      setActiveStream(streams[prevIndex]?.id || '')
    }
  }, [streams, setActiveStream])

  // Return gesture handlers and actions
  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    actions: {
      navigateStreams
    }
  }
}

// Simplified utility hook for common mobile stream gestures
export const useStreamGestures = () => {
  const { streams, toggleStreamMute, setActiveStream } = useStreamStore()
  const currentStreamIndexRef = useRef(0)

  const gestures = useMobileGestures({
    onSwipeLeft: useCallback(() => {
      if (streams.length > 0) {
        const nextIndex = (currentStreamIndexRef.current + 1) % streams.length
        currentStreamIndexRef.current = nextIndex
        setActiveStream(streams[nextIndex]?.id || '')
      }
    }, [streams, setActiveStream]),
    onSwipeRight: useCallback(() => {
      if (streams.length > 0) {
        const prevIndex = currentStreamIndexRef.current === 0 ? streams.length - 1 : currentStreamIndexRef.current - 1
        currentStreamIndexRef.current = prevIndex
        setActiveStream(streams[prevIndex]?.id || '')
      }
    }, [streams, setActiveStream]),
    onDoubleTap: useCallback(() => {
      if (streams[currentStreamIndexRef.current]) {
        toggleStreamMute(streams[currentStreamIndexRef.current].id)
      }
    }, [streams, toggleStreamMute])
  })

  return {
    ...gestures,
    currentStreamIndex: currentStreamIndexRef.current,
    currentStream: streams[currentStreamIndexRef.current]
  }
}

// Simplified hook for keyboard shortcuts on mobile (when bluetooth keyboard connected)
export const useMobileKeyboard = () => {
  const { streams, toggleStreamMute } = useStreamStore()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'm':
          e.preventDefault()
          if (streams[0]) {
            toggleStreamMute(streams[0].id)
          }
          break
        case 'f':
          e.preventDefault()
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
  }, [streams, toggleStreamMute])
}