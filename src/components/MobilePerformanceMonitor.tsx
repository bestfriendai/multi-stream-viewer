'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { PerformanceMonitor, UserJourneyTracker } from '@/lib/sentry-insights'
import { trackMobileError, setCustomMetrics } from '@/lib/sentry-wrapper'
import * as Sentry from "@sentry/nextjs"

interface MobilePerformanceMonitorProps {
  children: React.ReactNode
  trackScrollPerformance?: boolean
  trackTouchPerformance?: boolean
  trackRenderPerformance?: boolean
  trackMemoryUsage?: boolean
}

const MobilePerformanceMonitor: React.FC<MobilePerformanceMonitorProps> = ({
  children,
  trackScrollPerformance = true,
  trackTouchPerformance = true,
  trackRenderPerformance = true,
  trackMemoryUsage = true
}) => {
  const mobile = useMobileDetection()
  const metricsRef = useRef({
    scrollStartTime: 0,
    touchStartTime: 0,
    renderCount: 0,
    lastMemoryCheck: 0
  })
  const performanceObserverRef = useRef<PerformanceObserver | null>(null)

  // Track scroll performance on mobile
  useEffect(() => {
    if (!mobile.isMobile || !trackScrollPerformance) return

    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const handleScrollStart = () => {
      if (!isScrolling) {
        isScrolling = true
        metricsRef.current.scrollStartTime = performance.now()
      }
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
        const scrollDuration = performance.now() - metricsRef.current.scrollStartTime
        
        setCustomMetrics({
          'mobile.scroll_duration': scrollDuration,
          'mobile.scroll_count': 1
        })

        // Track janky scrolling
        if (scrollDuration > 100) {
          Sentry.addBreadcrumb({
            message: 'Slow scroll performance detected',
            category: 'mobile.performance',
            level: 'warning',
            data: {
              duration: scrollDuration,
              viewport: `${mobile.screenWidth}x${mobile.screenHeight}`,
              orientation: mobile.orientation
            }
          })
        }
      }, 150)
    }

    document.addEventListener('scroll', handleScrollStart, { passive: true })
    document.addEventListener('touchmove', handleScrollStart, { passive: true })

    return () => {
      document.removeEventListener('scroll', handleScrollStart)
      document.removeEventListener('touchmove', handleScrollStart)
      clearTimeout(scrollTimeout)
    }
  }, [mobile.isMobile, mobile.screenWidth, mobile.screenHeight, mobile.orientation, trackScrollPerformance])

  // Track touch performance
  useEffect(() => {
    if (!mobile.isMobile || !trackTouchPerformance) return

    const handleTouchStart = (e: TouchEvent) => {
      metricsRef.current.touchStartTime = performance.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchDuration = performance.now() - metricsRef.current.touchStartTime
      
      setCustomMetrics({
        'mobile.touch_response_time': touchDuration,
        'mobile.touch_count': 1
      })

      // Track slow touch responses
      if (touchDuration > 100) {
        Sentry.addBreadcrumb({
          message: 'Slow touch response detected',
          category: 'mobile.performance',
          level: 'warning',
          data: {
            duration: touchDuration,
            touchType: e.touches.length > 0 ? 'multi' : 'single',
            viewport: `${mobile.screenWidth}x${mobile.screenHeight}`
          }
        })
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [mobile.isMobile, mobile.screenWidth, mobile.screenHeight, trackTouchPerformance])

  // Track render performance
  useEffect(() => {
    if (!mobile.isMobile || !trackRenderPerformance) return

    metricsRef.current.renderCount++
    
    const renderStartTime = performance.now()
    
    // Use requestAnimationFrame to measure render time
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStartTime
      
      setCustomMetrics({
        'mobile.render_time': renderTime,
        'mobile.render_count': metricsRef.current.renderCount
      })

      // Track slow renders
      if (renderTime > 16.67) { // 60fps threshold
        Sentry.addBreadcrumb({
          message: 'Slow render detected',
          category: 'mobile.performance',
          level: 'warning',
          data: {
            renderTime,
            renderCount: metricsRef.current.renderCount,
            viewport: `${mobile.screenWidth}x${mobile.screenHeight}`
          }
        })
      }
    })
  }, [mobile.isMobile, mobile.screenWidth, mobile.screenHeight, trackRenderPerformance])

  // Monitor memory usage
  useEffect(() => {
    if (!mobile.isMobile || !trackMemoryUsage) return

    const checkMemory = () => {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory
        const now = Date.now()
        
        // Only check memory every 10 seconds to avoid spam
        if (now - metricsRef.current.lastMemoryCheck > 10000) {
          metricsRef.current.lastMemoryCheck = now
          
          const memoryUsage = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
          
          const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100
          
          setCustomMetrics({
            'mobile.memory_used_mb': Math.round(memoryUsage.used / 1024 / 1024),
            'mobile.memory_total_mb': Math.round(memoryUsage.total / 1024 / 1024),
            'mobile.memory_usage_percentage': Math.round(usagePercentage)
          })

          // Alert on high memory usage
          if (usagePercentage > 80) {
            Sentry.addBreadcrumb({
              message: 'High memory usage detected',
              category: 'mobile.performance',
              level: 'warning',
              data: {
                usagePercentage: Math.round(usagePercentage),
                usedMB: Math.round(memoryUsage.used / 1024 / 1024),
                totalMB: Math.round(memoryUsage.total / 1024 / 1024),
                viewport: `${mobile.screenWidth}x${mobile.screenHeight}`
              }
            })
          }
        }
      }
    }

    // Check memory immediately and then periodically
    checkMemory()
    const memoryInterval = setInterval(checkMemory, 30000) // Every 30 seconds

    return () => {
      clearInterval(memoryInterval)
    }
  }, [mobile.isMobile, mobile.screenWidth, mobile.screenHeight, trackMemoryUsage])

  // Set up Performance Observer for detailed metrics
  useEffect(() => {
    if (!mobile.isMobile) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            setCustomMetrics({
              [`mobile.${entry.name.replace('-', '_')}`]: entry.startTime
            })
          } else if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            setCustomMetrics({
              'mobile.dom_content_loaded': navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              'mobile.load_complete': navEntry.loadEventEnd - navEntry.loadEventStart
            })
          } else if (entry.entryType === 'layout-shift') {
            const layoutShift = entry as any
            if (layoutShift.value > 0.1) {
              Sentry.addBreadcrumb({
                message: 'Layout shift detected',
                category: 'mobile.performance',
                level: 'warning',
                data: {
                  value: layoutShift.value,
                  sources: layoutShift.sources?.length || 0
                }
              })
            }
          }
        })
      })

      observer.observe({ 
        entryTypes: ['paint', 'navigation', 'layout-shift', 'first-input']
      })
      
      performanceObserverRef.current = observer

    } catch (error) {
      console.warn('PerformanceObserver not supported:', error)
    }

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect()
      }
    }
  }, [mobile.isMobile])

  // Track device orientation changes
  useEffect(() => {
    if (!mobile.isMobile) return

    const journey = UserJourneyTracker.getInstance()
    
    journey.trackAction('mobile_orientation_change', {
      orientation: mobile.orientation,
      viewport: `${mobile.screenWidth}x${mobile.screenHeight}`
    })

    setCustomMetrics({
      'mobile.orientation_portrait': mobile.orientation === 'portrait' ? 1 : 0,
      'mobile.viewport_aspect_ratio': mobile.screenWidth / (mobile.screenHeight || 1)
    })

  }, [mobile.orientation, mobile.screenWidth, mobile.screenHeight, mobile.isMobile])

  // Monitor frame rate
  useEffect(() => {
    if (!mobile.isMobile) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = frameCount * 1000 / (currentTime - lastTime)
        
        setCustomMetrics({
          'mobile.fps': Math.round(fps)
        })

        // Alert on low FPS
        if (fps < 30) {
          Sentry.addBreadcrumb({
            message: 'Low FPS detected',
            category: 'mobile.performance',
            level: 'warning',
            data: {
              fps: Math.round(fps),
              viewport: `${mobile.screenWidth}x${mobile.screenHeight}`
            }
          })
        }

        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [mobile.isMobile, mobile.screenWidth, mobile.screenHeight])

  // Error boundary for mobile-specific errors
  const handleError = useCallback((error: Error) => {
    if (mobile.isMobile) {
      trackMobileError(error, {
        viewport: `${mobile.screenWidth}x${mobile.screenHeight}`,
        orientation: mobile.orientation,
        touchDevice: mobile.isTouchDevice,
        component: 'MobilePerformanceMonitor'
      })
    }
  }, [mobile])

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      handleError(new Error(event.message))
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(String(event.reason)))
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [handleError])

  return <>{children}</>
}

export default MobilePerformanceMonitor