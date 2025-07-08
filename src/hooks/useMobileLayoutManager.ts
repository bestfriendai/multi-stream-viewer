'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { useMobileDetection } from './useMobileDetection'
import { StreamMonitor, ErrorContextManager } from '@/lib/sentry-insights'
import { trackMobileError, setCustomMetrics } from '@/lib/sentry-wrapper'
import * as Sentry from "@sentry/nextjs"
import type { GridLayout } from '@/types/stream'

interface MobileLayoutManagerOptions {
  enableAutoSwitch?: boolean
  forceStackOnMobile?: boolean
  trackAnalytics?: boolean
}

export const useMobileLayoutManager = (options: MobileLayoutManagerOptions = {}) => {
  const { 
    enableAutoSwitch = true, 
    forceStackOnMobile = true, 
    trackAnalytics = true 
  } = options

  const { gridLayout, setGridLayout, streams } = useStreamStore()
  const mobile = useMobileDetection()
  const layoutChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track device changes and layout preferences
  useEffect(() => {
    if (!trackAnalytics) return

    // Set device context for debugging
    ErrorContextManager.setGlobalContext('mobile_device', {
      isMobile: mobile.isMobile,
      isTablet: mobile.isTablet,
      orientation: mobile.orientation,
      screenSize: `${mobile.screenWidth}x${mobile.screenHeight}`,
      touchDevice: mobile.isTouchDevice,
      platform: mobile.isIOS ? 'ios' : mobile.isAndroid ? 'android' : 'other'
    })

    // Set Sentry tags for filtering
    Sentry.setTag('device.type', mobile.isMobile ? 'mobile' : mobile.isTablet ? 'tablet' : 'desktop')
    Sentry.setTag('device.orientation', mobile.orientation)
    Sentry.setTag('device.platform', mobile.isIOS ? 'ios' : mobile.isAndroid ? 'android' : 'other')
    
    // Track viewport metrics
    setCustomMetrics({
      'device.viewport_width': mobile.screenWidth,
      'device.viewport_height': mobile.screenHeight,
      'device.aspect_ratio': mobile.screenWidth / (mobile.screenHeight || 1)
    })

  }, [mobile, trackAnalytics])

  // Auto-switch layout based on device changes (debounced to prevent infinite loops)
  useEffect(() => {
    if (!enableAutoSwitch) return

    // Clear any existing timeout
    if (layoutChangeTimeoutRef.current) {
      clearTimeout(layoutChangeTimeoutRef.current)
    }

    // Debounce layout changes to prevent infinite loops during rapid resize events
    layoutChangeTimeoutRef.current = setTimeout(() => {
      const shouldUseStackedLayout = mobile.isMobile && forceStackOnMobile
      const isCurrentlyStacked = gridLayout === 'stacked' || gridLayout === '1x1'

      if (shouldUseStackedLayout && !isCurrentlyStacked) {
        // Switch to stacked layout for mobile
        setGridLayout('stacked')
        
        if (trackAnalytics) {
          Sentry.addBreadcrumb({
            message: 'Auto-switched to stacked layout for mobile device',
            category: 'layout.auto_switch',
            level: 'info',
            data: {
              fromLayout: gridLayout,
              toLayout: 'stacked',
              trigger: 'mobile_detection',
              device: {
                width: mobile.screenWidth,
                height: mobile.screenHeight,
                orientation: mobile.orientation
              }
            }
          })
        }
      } else if (!mobile.isMobile && isCurrentlyStacked && streams.length > 1) {
        // Switch to appropriate grid layout for desktop/tablet
        const newLayout: GridLayout = mobile.isTablet ? 'grid-2x2' : 'grid-3x3'
        setGridLayout(newLayout)
        
        if (trackAnalytics) {
          Sentry.addBreadcrumb({
            message: `Auto-switched to ${newLayout} for ${mobile.isTablet ? 'tablet' : 'desktop'} device`,
            category: 'layout.auto_switch',
            level: 'info',
            data: {
              fromLayout: gridLayout,
              toLayout: newLayout,
              trigger: 'desktop_detection',
              streamCount: streams.length
            }
          })
        }
      }
    }, 250) // 250ms debounce delay

    // Cleanup function to clear timeout
    return () => {
      if (layoutChangeTimeoutRef.current) {
        clearTimeout(layoutChangeTimeoutRef.current)
      }
    }
  }, [mobile.isMobile, mobile.isTablet, enableAutoSwitch, forceStackOnMobile, gridLayout, setGridLayout, streams.length, trackAnalytics])

  // Track orientation changes with performance impact
  useEffect(() => {
    if (!trackAnalytics || !mobile.isMobile) return

    const startTime = performance.now()
    
    // Track orientation change performance
    const timeoutId = setTimeout(() => {
      const renderTime = performance.now() - startTime
      
      setCustomMetrics({
        'mobile.orientation_change_time': renderTime,
        'mobile.orientation_is_portrait': mobile.orientation === 'portrait' ? 1 : 0
      })
      
      StreamMonitor.trackStreamInteraction(
        `orientation-${Date.now()}`, 
        'mobile', 
        `orientation_change_${mobile.orientation}`
      )
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [mobile.orientation, trackAnalytics, mobile.isMobile])

  // Handle mobile layout errors
  const handleMobileLayoutError = useCallback((error: Error, context?: any) => {
    if (!mobile.isMobile) return

    trackMobileError(error, {
      viewport: `${mobile.screenWidth}x${mobile.screenHeight}`,
      orientation: mobile.orientation,
      touchDevice: mobile.isTouchDevice,
      component: 'MobileLayoutManager',
      context
    })

    // Add additional mobile debugging context
    ErrorContextManager.setGlobalContext('mobile_error_context', {
      currentLayout: gridLayout,
      streamCount: streams.length,
      deviceInfo: {
        width: mobile.screenWidth,
        height: mobile.screenHeight,
        orientation: mobile.orientation,
        isIOS: mobile.isIOS,
        isAndroid: mobile.isAndroid,
        isSafari: mobile.isSafari
      }
    })
  }, [mobile, gridLayout, streams.length])

  // Force refresh layout on device change
  const refreshLayout = useCallback(() => {
    if (mobile.isMobile && forceStackOnMobile) {
      setGridLayout('stacked')
    } else if (mobile.isTablet) {
      setGridLayout('grid-2x2')
    } else {
      setGridLayout('grid-3x3')
    }

    if (trackAnalytics) {
      Sentry.addBreadcrumb({
        message: 'Manual layout refresh triggered',
        category: 'layout.manual_refresh',
        level: 'info',
        data: {
          device: mobile.isMobile ? 'mobile' : mobile.isTablet ? 'tablet' : 'desktop',
          newLayout: mobile.isMobile ? 'stacked' : mobile.isTablet ? 'grid-2x2' : 'grid-3x3'
        }
      })
    }
  }, [mobile, forceStackOnMobile, setGridLayout, trackAnalytics])

  // Get recommended layout for current device
  const getRecommendedLayout = useCallback((): GridLayout => {
    if (mobile.isMobile) return 'stacked'
    if (mobile.isTablet) return 'grid-2x2'
    return 'grid-3x3'
  }, [mobile])

  // Check if current layout is optimal for device
  const isOptimalLayout = useCallback((): boolean => {
    const recommended = getRecommendedLayout()
    return gridLayout === recommended
  }, [gridLayout, getRecommendedLayout])

  return {
    mobile,
    currentLayout: gridLayout,
    recommendedLayout: getRecommendedLayout(),
    isOptimalLayout: isOptimalLayout(),
    refreshLayout,
    handleMobileLayoutError,
    
    // Layout state helpers
    isMobileOptimized: mobile.isMobile && (gridLayout === 'stacked' || gridLayout === '1x1'),
    shouldShowMobileControls: mobile.isMobile,
    shouldUseVerticalStack: mobile.isMobile && mobile.orientation === 'portrait',
    shouldUseLandscapeGrid: mobile.isMobile && mobile.orientation === 'landscape' && streams.length <= 2,
    
    // Performance metrics
    deviceMetrics: {
      viewportWidth: mobile.screenWidth,
      viewportHeight: mobile.screenHeight,
      aspectRatio: mobile.screenWidth / (mobile.screenHeight || 1),
      pixelDensity: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      orientation: mobile.orientation
    }
  }
}

export default useMobileLayoutManager