'use client'

import { haptic } from '@/lib/haptics'

export interface EventHandlerOptions {
  preventDefault?: boolean
  stopPropagation?: boolean
  hapticFeedback?: 'light' | 'medium' | 'heavy' | false
  analytics?: {
    event: string
    properties?: Record<string, any>
  }
}

export const createEventHandler = <T extends Event = Event>(
  handler: (event: T) => void | Promise<void>,
  options: EventHandlerOptions = {}
) => {
  const {
    preventDefault = false,
    stopPropagation = false,
    hapticFeedback = false,
    analytics
  } = options

  return async (event: T) => {
    try {
      // Prevent default behavior if requested
      if (preventDefault) {
        event.preventDefault()
      }

      // Stop event propagation if requested
      if (stopPropagation) {
        event.stopPropagation()
      }

      // Provide haptic feedback if requested
      if (hapticFeedback) {
        haptic[hapticFeedback]()
      }

      // Track analytics if provided
      if (analytics && typeof window !== 'undefined') {
        // Log analytics event (implement with your analytics service)
        console.log('Analytics:', analytics.event, analytics.properties)
      }

      // Execute the main handler
      await handler(event)
    } catch (error) {
      console.error('Event handler error:', error)
      // Could add error reporting here
    }
  }
}

// Specialized handlers for common mobile patterns
export const createMobileButtonHandler = <T extends Event = Event>(
  handler: (event: T) => void | Promise<void>,
  options: Omit<EventHandlerOptions, 'preventDefault' | 'stopPropagation' | 'hapticFeedback'> & {
    hapticFeedback?: 'light' | 'medium' | 'heavy'
  } = {}
) => {
  return createEventHandler(handler, {
    preventDefault: true,
    stopPropagation: true,
    hapticFeedback: options.hapticFeedback || 'light',
    ...options
  })
}

export const createMuteButtonHandler = (
  handler: () => void | Promise<void>,
  analytics?: EventHandlerOptions['analytics']
) => {
  return createMobileButtonHandler(handler, {
    hapticFeedback: 'light',
    analytics: analytics || {
      event: 'mute_toggle',
      properties: { source: 'mobile_button' }
    }
  })
}

export const createNavigationHandler = (
  handler: () => void | Promise<void>,
  direction: 'next' | 'previous' | 'home',
  analytics?: EventHandlerOptions['analytics']
) => {
  return createMobileButtonHandler(handler, {
    hapticFeedback: 'medium',
    analytics: analytics || {
      event: 'navigation',
      properties: { direction, source: 'mobile_button' }
    }
  })
}

export const createTouchHandler = (
  handler: (event: TouchEvent) => void | Promise<void>,
  options: EventHandlerOptions = {}
) => {
  return createEventHandler(handler, {
    ...options,
    hapticFeedback: options.hapticFeedback || 'light'
  })
}

// Safe event handler that catches and logs errors
export const safeMobileHandler = <T extends Event = Event>(
  handler: (event: T) => void | Promise<void>,
  fallback?: (error: Error) => void
) => {
  return async (event: T) => {
    try {
      event.preventDefault()
      event.stopPropagation()
      await handler(event)
    } catch (error) {
      console.error('Mobile handler error:', error)
      if (fallback) {
        fallback(error as Error)
      }
    }
  }
}

// Debounced event handler for preventing rapid taps
export const createDebouncedHandler = <T extends Event = Event>(
  handler: (event: T) => void | Promise<void>,
  delay: number = 300,
  options: EventHandlerOptions = {}
) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastEvent: T | null = null

  return (event: T) => {
    lastEvent = event

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (lastEvent) {
        createEventHandler(handler, options)(lastEvent)
      }
    }, delay)
  }
}

// Throttled event handler for scroll/resize events
export const createThrottledHandler = <T extends Event = Event>(
  handler: (event: T) => void | Promise<void>,
  delay: number = 100
) => {
  let isThrottled = false

  return (event: T) => {
    if (isThrottled) return

    isThrottled = true
    handler(event)

    setTimeout(() => {
      isThrottled = false
    }, delay)
  }
}