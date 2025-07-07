'use client'

import * as Sentry from '@sentry/nextjs'

export class SentryPerformanceTracker {
  private static instance: SentryPerformanceTracker
  private transactions: Map<string, any> = new Map()

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
    
    const transaction = Sentry.startTransaction({
      name: `API ${method.toUpperCase()} ${apiName}`,
      op: 'http.client',
      data: {
        url,
        method: method.toUpperCase(),
        apiName
      },
      tags: {
        component: 'api-client',
        endpoint: apiName,
        method: method.toUpperCase()
      }
    })

    this.transactions.set(transactionId, {
      transaction,
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
    const { transaction, apiName, method, url } = tracking

    // Set transaction status
    transaction.setStatus(options.success ? 'ok' : 'internal_error')
    
    // Add performance tags
    transaction.setTag('success', options.success.toString())
    transaction.setTag('cache_hit', options.cacheHit?.toString() || 'false')
    
    if (options.statusCode) {
      transaction.setTag('status_code', options.statusCode.toString())
    }

    // Add performance data
    transaction.setData('duration_ms', Math.round(duration))
    transaction.setData('response_size', options.responseSize || 0)
    transaction.setData('retry_count', options.retryCount || 0)

    // Set performance metrics
    Sentry.setMeasurement(`api.${apiName}.duration`, duration, 'millisecond')
    
    if (options.responseSize) {
      Sentry.setMeasurement(`api.${apiName}.response_size`, options.responseSize, 'byte')
    }

    // Track slow API calls
    if (duration > 1000) {
      Sentry.addBreadcrumb({
        message: `Slow API call detected: ${apiName}`,
        category: 'performance',
        level: 'warning',
        data: {
          apiName,
          method,
          url,
          duration: Math.round(duration),
          statusCode: options.statusCode,
          cacheHit: options.cacheHit
        }
      })

      // Create custom metric for slow API calls
      Sentry.setMeasurement(`api.slow_calls.${apiName}`, 1, 'none')
    }

    // Track errors
    if (!options.success && options.errorMessage) {
      Sentry.addBreadcrumb({
        message: `API call failed: ${apiName}`,
        category: 'api.error',
        level: 'error',
        data: {
          apiName,
          method,
          url,
          errorMessage: options.errorMessage,
          statusCode: options.statusCode,
          duration: Math.round(duration)
        }
      })
    }

    // Finish transaction
    transaction.finish()
    this.transactions.delete(transactionId)
  }

  /**
   * Track database operation performance
   */
  public trackDatabaseOperation<T>(
    operation: string,
    table: string,
    callback: () => Promise<T>
  ): Promise<T> {
    return Sentry.withScope(async (scope) => {
      scope.setTag('operation_type', 'database')
      scope.setTag('db_operation', operation)
      scope.setTag('db_table', table)

      const startTime = performance.now()
      
      try {
        const result = await callback()
        const duration = performance.now() - startTime
        
        Sentry.setMeasurement(`db.${operation}.${table}`, duration, 'millisecond')
        
        if (duration > 500) {
          Sentry.addBreadcrumb({
            message: `Slow database operation: ${operation} on ${table}`,
            category: 'performance',
            level: 'warning',
            data: { operation, table, duration: Math.round(duration) }
          })
        }

        return result
      } catch (error) {
        const duration = performance.now() - startTime
        
        Sentry.addBreadcrumb({
          message: `Database operation failed: ${operation} on ${table}`,
          category: 'database.error',
          level: 'error',
          data: { 
            operation, 
            table, 
            duration: Math.round(duration),
            error: error instanceof Error ? error.message : String(error)
          }
        })
        
        throw error
      }
    })
  }

  /**
   * Track component render performance
   */
  public trackComponentRender(componentName: string, renderTime: number, props?: any) {
    Sentry.setMeasurement(`component.${componentName}.render`, renderTime, 'millisecond')
    
    if (renderTime > 100) {
      Sentry.addBreadcrumb({
        message: `Slow component render: ${componentName}`,
        category: 'performance',
        level: 'warning',
        data: {
          componentName,
          renderTime: Math.round(renderTime),
          propsCount: props ? Object.keys(props).length : 0
        }
      })
    }
  }

  /**
   * Track user interaction performance
   */
  public trackUserInteraction(action: string, element: string, duration?: number) {
    Sentry.addBreadcrumb({
      message: `User interaction: ${action} on ${element}`,
      category: 'user.interaction',
      level: 'info',
      data: {
        action,
        element,
        duration: duration ? Math.round(duration) : undefined,
        timestamp: new Date().toISOString()
      }
    })

    if (duration) {
      Sentry.setMeasurement(`interaction.${action}.${element}`, duration, 'millisecond')
      
      if (duration > 300) {
        Sentry.addBreadcrumb({
          message: `Slow user interaction: ${action} on ${element}`,
          category: 'performance',
          level: 'warning',
          data: { action, element, duration: Math.round(duration) }
        })
      }
    }
  }

  /**
   * Track cache performance
   */
  public trackCacheOperation(operation: 'hit' | 'miss' | 'set' | 'clear', key: string, duration?: number) {
    Sentry.addBreadcrumb({
      message: `Cache ${operation}: ${key}`,
      category: 'cache',
      level: 'info',
      data: {
        operation,
        key,
        duration: duration ? Math.round(duration) : undefined
      }
    })

    if (duration) {
      Sentry.setMeasurement(`cache.${operation}`, duration, 'millisecond')
    }

    // Track cache hit rate
    if (operation === 'hit' || operation === 'miss') {
      Sentry.setMeasurement(`cache.${operation}_count`, 1, 'none')
    }
  }

  /**
   * Track memory usage
   */
  public trackMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      
      Sentry.setMeasurement('memory.used', memory.usedJSHeapSize, 'byte')
      Sentry.setMeasurement('memory.total', memory.totalJSHeapSize, 'byte')
      Sentry.setMeasurement('memory.limit', memory.jsHeapSizeLimit, 'byte')
      
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      
      if (usagePercentage > 80) {
        Sentry.addBreadcrumb({
          message: 'High memory usage detected',
          category: 'performance',
          level: 'warning',
          data: {
            usagePercentage: Math.round(usagePercentage),
            usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024)
          }
        })
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

    Sentry.addBreadcrumb({
      message: `Performance snapshot: ${context}`,
      category: 'performance.snapshot',
      level: 'info',
      data: snapshot
    })

    return snapshot
  }
}

export const sentryPerformance = SentryPerformanceTracker.getInstance()