'use client'

// import * as Sentry from '@sentry/nextjs'

export class SentryPerformanceTracker {
  private static instance: SentryPerformanceTracker
  private transactions: Map<string, {
    span: any
    startTime: number
    apiName: string
    method: string
    url: string
  }> = new Map()

  public static getInstance(): SentryPerformanceTracker {
    if (!SentryPerformanceTracker.instance) {
      SentryPerformanceTracker.instance = new SentryPerformanceTracker()
    }
    return SentryPerformanceTracker.instance
  }

  /**
   * Start tracking an API call performance
   */
  public startApiCall(apiName: string, method: string, url: string): string {
    const transactionId = `${apiName}-${Date.now()}-${Math.random()}`

    // Temporarily disabled for development
    // const span = Sentry.startInactiveSpan({
    //   name: `API ${method.toUpperCase()} ${apiName}`,
    //   op: 'http.client',
    //   data: {
    //     url,
    //     method: method.toUpperCase(),
    //     apiName
    //   },
    //   attributes: {
    //     component: 'api-client',
    //     endpoint: apiName,
    //     method: method.toUpperCase()
    //   }
    // })

    this.transactions.set(transactionId, {
      span: null,
      startTime: performance.now(),
      apiName,
      method,
      url
    })

    return transactionId
  }

  /**
   * Finish tracking an API call with results
   */
  public finishApiCall(transactionId: string, options: {
    success: boolean
    statusCode?: number
    errorMessage?: string
    responseSize?: number
    cacheHit?: boolean
    retryCount?: number
  }) {
    const tracking = this.transactions.get(transactionId)
    if (!tracking) return

    const duration = performance.now() - tracking.startTime
    const { span, apiName, method, url } = tracking

    // Set span status
    span?.setStatus(options.success ? { code: 1 } : { code: 2 })
    
    // Add performance attributes
    span?.setAttributes({
      'success': options.success,
      'cache_hit': options.cacheHit || false,
      'status_code': options.statusCode || 0,
      'duration_ms': Math.round(duration),
      'response_size': options.responseSize || 0,
      'retry_count': options.retryCount || 0
    })

    // Set performance metrics - temporarily disabled
    // Sentry.setMeasurement(`api.${apiName}.duration`, duration, 'millisecond')

    // if (options.responseSize) {
    //   Sentry.setMeasurement(`api.${apiName}.response_size`, options.responseSize, 'byte')
    // }

    // Track slow API calls - temporarily disabled
    // if (duration > 1000) {
    //   Sentry.addBreadcrumb({
    //     message: `Slow API call detected: ${apiName}`,
    //     category: 'performance',
    //     level: 'warning',
    //     data: {
    //       apiName,
    //       method,
    //       url,
    //       duration: Math.round(duration),
    //       statusCode: options.statusCode,
    //       cacheHit: options.cacheHit
    //     }
    //   })

    //   // Create custom metric for slow API calls
    //   Sentry.setMeasurement(`api.slow_calls.${apiName}`, 1, 'none')
    // }

    // Track errors - temporarily disabled
    // if (!options.success && options.errorMessage) {
    //   Sentry.addBreadcrumb({
    //     message: `API call failed: ${apiName}`,
    //     category: 'api.error',
    //     level: 'error',
    //     data: {
    //       apiName,
    //       method,
    //       url,
    //       errorMessage: options.errorMessage,
    //       statusCode: options.statusCode,
    //       duration: Math.round(duration)
    //     }
    //   })
    // }

    // Finish span
    span?.end()
    this.transactions.delete(transactionId)
  }

  /**
   * Track database operation performance
   */
  public async trackDatabaseOperation<T>(
    operation: string,
    table: string,
    callback: () => Promise<T>
  ): Promise<T> {
    // Temporarily disabled for development
    const startTime = performance.now()

    try {
      const result = await callback()
      const duration = performance.now() - startTime
      console.log(`DB ${operation} on ${table}: ${Math.round(duration)}ms`)
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(`DB ${operation} on ${table} failed: ${Math.round(duration)}ms`, error)
      throw error
    }
  }

  /**
   * Track component render performance
   */
  public trackComponentRender(componentName: string, renderTime: number, props?: any) {
    // Temporarily disabled for development
    if (renderTime > 100) {
      console.log(`Slow component render: ${componentName} (${Math.round(renderTime)}ms)`)
    }
  }

  /**
   * Track user interaction performance
   */
  public trackUserInteraction(action: string, element: string, duration?: number) {
    // Temporarily disabled for development
    if (duration && duration > 300) {
      console.log(`Slow user interaction: ${action} on ${element} (${Math.round(duration)}ms)`)
    }
  }

  /**
   * Track cache performance
   */
  public trackCacheOperation(operation: 'hit' | 'miss' | 'set' | 'clear', key: string, duration?: number) {
    // Temporarily disabled for development
    console.log(`Cache ${operation}: ${key}`)
  }

  /**
   * Track memory usage
   */
  public trackMemoryUsage() {
    // Temporarily disabled for development
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

      if (usagePercentage > 80) {
        console.warn(`High memory usage: ${Math.round(usagePercentage)}%`)
      }
    }
  }

  /**
   * Create a performance snapshot for debugging
   */
  public createPerformanceSnapshot(context: string) {
    const snapshot = {
      timestamp: new Date().toISOString(),
      context,
      performance: {
        now: performance.now(),
        timeOrigin: performance.timeOrigin
      },
      navigation: typeof window !== 'undefined' ? {
        type: (performance as any).navigation?.type,
        redirectCount: (performance as any).navigation?.redirectCount
      } : null,
      memory: typeof window !== 'undefined' && 'memory' in performance ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    }

    console.log(`Performance snapshot: ${context}`, snapshot)
    return snapshot
  }
}

export const sentryPerformance = SentryPerformanceTracker.getInstance()