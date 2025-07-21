'use client'

import { useEffect } from 'react'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
  sources?: Array<{
    node: Element
    currentRect: DOMRectReadOnly
    previousRect: DOMRectReadOnly
  }>
}

export default function CoreWebVitalsMonitor() {
  useEffect(() => {
    // Function to send metrics to analytics
    const sendToAnalytics = (metric: WebVitalMetric) => {
      // Send to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Core Web Vital:', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        })
      }

      // Send to custom analytics endpoint
      if (typeof window !== 'undefined') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }),
        }).catch(() => {
          // Silently fail for analytics
        })
      }
    }

    // Performance observer for Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            const rating = lastEntry.startTime <= 2500 ? 'good' : 
                          lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor'
            sendToAnalytics({
              name: 'LCP',
              value: lastEntry.startTime,
              rating,
              delta: lastEntry.startTime,
              id: `lcp-${Date.now()}`,
            })
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch {
        // LCP API not supported
      }

      // Monitor First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEventTiming
            if (fidEntry.processingStart && fidEntry.startTime) {
              const fid = fidEntry.processingStart - fidEntry.startTime
              const rating = fid <= 100 ? 'good' :
                            fid <= 300 ? 'needs-improvement' : 'poor'
              sendToAnalytics({
                name: 'FID',
                value: fid,
                rating,
                delta: fid,
                id: `fid-${Date.now()}`,
              })
            }
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch {
        // FID API not supported
      }

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsEntries: LayoutShiftEntry[] = []
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as LayoutShiftEntry
            if (!layoutShift.hadRecentInput) {
              clsEntries.push(layoutShift)
              clsValue += layoutShift.value
            }
          }
          
          // Report CLS periodically
          const rating = clsValue <= 0.1 ? 'good' : 
                        clsValue <= 0.25 ? 'needs-improvement' : 'poor'
          sendToAnalytics({
            name: 'CLS',
            value: clsValue,
            rating,
            delta: clsValue,
            id: `cls-${Date.now()}`,
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch {
        // CLS API not supported
      }

      // Monitor Long Tasks (for FID optimization)
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              })
            }
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch {
        // Long task API not supported
      }

      // Monitor Resource Loading (for LCP optimization)
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.duration > 1000) {
              console.warn('Slow resource detected:', {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize,
                type: resource.initiatorType,
              })
            }
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
      } catch {
        // Resource timing API not supported
      }

      // Monitor First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const rating = entry.startTime <= 1800 ? 'good' : 
                          entry.startTime <= 3000 ? 'needs-improvement' : 'poor'
            sendToAnalytics({
              name: 'FCP',
              value: entry.startTime,
              rating,
              delta: entry.startTime,
              id: `fcp-${Date.now()}`,
            })
          }
        })
        fcpObserver.observe({ entryTypes: ['paint'] })
      } catch {
        // FCP API not supported
      }
    }

    // Cleanup function
    return () => {
      // Observers are automatically cleaned up when component unmounts
    }
  }, [])

  return null // This component doesn't render anything
}