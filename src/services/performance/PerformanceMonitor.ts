import { useEffect, useCallback } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  tags?: Record<string, string>
}

interface CustomMetric {
  name: string
  startTime: number
  endTime?: number
  tags?: Record<string, string>
}

interface PerformanceBudget {
  FCP: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  INP: number // Interaction to Next Paint
  CLS: number // Cumulative Layout Shift
  TTFB: number // Time to First Byte
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private customMetrics = new Map<string, CustomMetric>()
  private observers: PerformanceObserver[] = []
  private isEnabled = false

  // Performance budgets (in milliseconds, except CLS which is unitless)
  private budget: PerformanceBudget = {
    FCP: 1800,
    LCP: 2500,
    INP: 200,
    CLS: 0.1,
    TTFB: 800
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  init(budget?: Partial<PerformanceBudget>): void {
    if (typeof window === 'undefined' || this.isEnabled) return

    if (budget) {
      this.budget = { ...this.budget, ...budget }
    }

    this.isEnabled = true
    this.startWebVitalsCollection()
    this.startResourceMonitoring()
    this.startLongTaskMonitoring()
    this.startMemoryMonitoring()
  }

  // Web Vitals Collection
  private startWebVitalsCollection(): void {
    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ onCLS, onLCP, onTTFB, onINP }) => {
      onCLS(this.handleWebVital.bind(this))
      onLCP(this.handleWebVital.bind(this))
      onTTFB(this.handleWebVital.bind(this))
      onINP(this.handleWebVital.bind(this))
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error)
    })
  }

  private handleWebVital = (metric: any): void => {
    const rating = this.getRating(metric.name, metric.value)
    
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      tags: {
        id: metric.id,
        navigationType: metric.navigationType || 'unknown'
      }
    }

    this.metrics.push(performanceMetric)
    this.reportMetric(performanceMetric)

    // Check budget violations
    if (rating === 'poor') {
      this.handleBudgetViolation(performanceMetric)
    }
  }

  // Resource Monitoring
  private startResourceMonitoring(): void {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.handleResourceTiming(entry as PerformanceResourceTiming)
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
    this.observers.push(observer)
  }

  private handleResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.startTime
    const size = entry.transferSize || 0

    // Track slow resources
    if (duration > 1000) { // Resources taking more than 1 second
      const metric: PerformanceMetric = {
        name: 'slow-resource',
        value: duration,
        rating: duration > 3000 ? 'poor' : 'needs-improvement',
        timestamp: Date.now(),
        tags: {
          url: entry.name,
          type: this.getResourceType(entry.name),
          size: size.toString()
        }
      }

      this.metrics.push(metric)
      this.reportMetric(metric)
    }

    // Track large resources
    if (size > 500000) { // Resources larger than 500KB
      const metric: PerformanceMetric = {
        name: 'large-resource',
        value: size,
        rating: size > 1000000 ? 'poor' : 'needs-improvement',
        timestamp: Date.now(),
        tags: {
          url: entry.name,
          type: this.getResourceType(entry.name),
          duration: duration.toString()
        }
      }

      this.metrics.push(metric)
      this.reportMetric(metric)
    }
  }

  // Long Task Monitoring
  private startLongTaskMonitoring(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const metric: PerformanceMetric = {
            name: 'long-task',
            value: entry.duration,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
            timestamp: Date.now(),
            tags: {
              startTime: entry.startTime.toString(),
              attribution: (entry as any).attribution?.[0]?.name || 'unknown'
            }
          }

          this.metrics.push(metric)
          this.reportMetric(metric)
        })
      })

      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Long task monitoring not supported:', error)
    }
  }

  // Memory Monitoring
  private startMemoryMonitoring(): void {
    if (!('memory' in performance)) return

    const checkMemory = () => {
      const memory = (performance as any).memory
      const heapUsed = memory.usedJSHeapSize
      const heapLimit = memory.totalJSHeapSize

      const usageRatio = heapUsed / heapLimit

      if (usageRatio > 0.8) { // High memory usage
        const metric: PerformanceMetric = {
          name: 'high-memory-usage',
          value: usageRatio * 100,
          rating: usageRatio > 0.9 ? 'poor' : 'needs-improvement',
          timestamp: Date.now(),
          tags: {
            heapUsed: heapUsed.toString(),
            heapLimit: heapLimit.toString()
          }
        }

        this.metrics.push(metric)
        this.reportMetric(metric)
      }
    }

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000)
  }

  // Custom Metrics
  startTiming(name: string, tags?: Record<string, string>): void {
    const metric: CustomMetric = {
      name,
      startTime: performance.now(),
      ...(tags && { tags })
    }

    this.customMetrics.set(name, metric)
  }

  endTiming(name: string): number | null {
    const metric = this.customMetrics.get(name)
    if (!metric) return null

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime

    const performanceMetric: PerformanceMetric = {
      name: `custom-${name}`,
      value: duration,
      rating: this.getCustomMetricRating(name, duration),
      timestamp: Date.now(),
      ...(metric.tags && { tags: metric.tags })
    }

    this.metrics.push(performanceMetric)
    this.reportMetric(performanceMetric)
    this.customMetrics.delete(name)

    return duration
  }

  // Stream-specific metrics
  measureStreamLoad(streamId: string): () => void {
    const startMark = `stream-load-start-${streamId}`
    const endMark = `stream-load-end-${streamId}`
    const measureName = `stream-load-${streamId}`

    performance.mark(startMark)

    return () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)

      const measure = performance.getEntriesByName(measureName)[0]
      if (measure) {
        const metric: PerformanceMetric = {
          name: 'stream-load-time',
          value: measure.duration,
          rating: measure.duration > 5000 ? 'poor' : measure.duration > 2000 ? 'needs-improvement' : 'good',
          timestamp: Date.now(),
          tags: {
            streamId,
            type: 'load'
          }
        }

        this.metrics.push(metric)
        this.reportMetric(metric)
      }
    }
  }

  measureLayoutSwitch(): () => void {
    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      const metric: PerformanceMetric = {
        name: 'layout-switch-time',
        value: duration,
        rating: duration > 500 ? 'poor' : duration > 200 ? 'needs-improvement' : 'good',
        timestamp: Date.now(),
        tags: {
          type: 'layout-switch'
        }
      }

      this.metrics.push(metric)
      this.reportMetric(metric)
    }
  }

  // Utility methods
  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      INP: [200, 500],
      CLS: [0.1, 0.25],
      TTFB: [800, 1800]
    }

    const [good, poor] = thresholds[name] || [0, Infinity]
    
    if (value <= good) return 'good'
    if (value <= poor) return 'needs-improvement'
    return 'poor'
  }

  private getCustomMetricRating(name: string, duration: number): 'good' | 'needs-improvement' | 'poor' {
    // Default thresholds for custom metrics
    if (duration <= 100) return 'good'
    if (duration <= 500) return 'needs-improvement'
    return 'poor'
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    
    if (['js', 'mjs', 'ts'].includes(extension || '')) return 'script'
    if (['css', 'scss', 'less'].includes(extension || '')) return 'stylesheet'
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '')) return 'image'
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) return 'font'
    if (url.includes('api/') || url.includes('/api')) return 'xhr'
    
    return 'other'
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        metric_rating: metric.rating,
        ...metric.tags
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric)
    }
  }

  private handleBudgetViolation(metric: PerformanceMetric): void {
    console.warn(`Performance budget violation: ${metric.name} = ${metric.value}`)
    
    // Could send alerts or notifications here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_budget_violation', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        budget_limit: this.budget[metric.name as keyof PerformanceBudget]
      })
    }
  }

  // Public API
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name)
  }

  clearMetrics(): void {
    this.metrics = []
  }

  setBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget }
  }

  getBudget(): PerformanceBudget {
    return { ...this.budget }
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics = []
    this.customMetrics.clear()
    this.isEnabled = false
  }
}

// Singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// React hook for performance monitoring
export function usePerformanceMonitor() {
  useEffect(() => {
    performanceMonitor.init()
  }, [])

  const startTiming = useCallback((name: string, tags?: Record<string, string>) => {
    performanceMonitor.startTiming(name, tags)
  }, [])

  const endTiming = useCallback((name: string) => {
    return performanceMonitor.endTiming(name)
  }, [])

  const measureStreamLoad = useCallback((streamId: string) => {
    return performanceMonitor.measureStreamLoad(streamId)
  }, [])

  const measureLayoutSwitch = useCallback(() => {
    return performanceMonitor.measureLayoutSwitch()
  }, [])

  return {
    startTiming,
    endTiming,
    measureStreamLoad,
    measureLayoutSwitch,
    getMetrics: () => performanceMonitor.getMetrics(),
    clearMetrics: () => performanceMonitor.clearMetrics()
  }
}

// Decorator for automatic performance measurement
export function measurePerformance(metricName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function (...args: any[]) {
      performanceMonitor.startTiming(metricName)
      
      try {
        const result = method.apply(this, args)
        
        if (result instanceof Promise) {
          return result.finally(() => {
            performanceMonitor.endTiming(metricName)
          })
        } else {
          performanceMonitor.endTiming(metricName)
          return result
        }
      } catch (error) {
        performanceMonitor.endTiming(metricName)
        throw error
      }
    }

    return descriptor
  }
}