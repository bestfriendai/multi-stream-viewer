import * as Sentry from '@sentry/nextjs'
import { sentryPerformance } from './sentry-performance'

export class SentryApiMonitor {
  private static instance: SentryApiMonitor
  private apiMetrics: Map<string, {
    totalCalls: number
    totalDuration: number
    errorCount: number
    lastCall: number
    slowCalls: number
  }> = new Map()

  public static getInstance(): SentryApiMonitor {
    if (!SentryApiMonitor.instance) {
      SentryApiMonitor.instance = new SentryApiMonitor()
    }
    return SentryApiMonitor.instance
  }

  /**
   * Monitor an API call with comprehensive tracking
   */
  public async monitorApiCall<T>(
    apiName: string,
    method: string,
    url: string,
    callback: () => Promise<T>,
    options: {
      timeout?: number
      retryCount?: number
      expectedDuration?: number
      critical?: boolean
    } = {}
  ): Promise<T> {
    let transactionId: string | null = null
    try {
      transactionId = sentryPerformance.startApiCall(apiName, method, url)
    } catch (error) {
      console.warn('Failed to start Sentry performance tracking:', error)
    }
    
    const startTime = performance.now()
    let retryAttempt = 0
    
    const updateMetrics = (duration: number, success: boolean) => {
      const metrics = this.apiMetrics.get(apiName) || {
        totalCalls: 0,
        totalDuration: 0,
        errorCount: 0,
        lastCall: 0,
        slowCalls: 0
      }
      
      metrics.totalCalls++
      metrics.totalDuration += duration
      metrics.lastCall = Date.now()
      
      if (!success) {
        metrics.errorCount++
      }
      
      if (duration > (options.expectedDuration || 1000)) {
        metrics.slowCalls++
      }
      
      this.apiMetrics.set(apiName, metrics)
      
      // Send metrics to Sentry
      Sentry.setMeasurement(`api.${apiName}.avg_duration`, metrics.totalDuration / metrics.totalCalls, 'millisecond')
      Sentry.setMeasurement(`api.${apiName}.error_rate`, (metrics.errorCount / metrics.totalCalls) * 100, 'percent')
      Sentry.setMeasurement(`api.${apiName}.slow_call_rate`, (metrics.slowCalls / metrics.totalCalls) * 100, 'percent')
    }

    try {
      const executeCall = async (): Promise<T> => {
        const callStartTime = performance.now()
        
        // Set timeout if specified
        const timeoutPromise = options.timeout 
          ? new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`API call timeout: ${apiName}`)), options.timeout)
            )
          : null

        const callPromise = callback()
        
        const result = timeoutPromise 
          ? await Promise.race([callPromise, timeoutPromise])
          : await callPromise

        const callDuration = performance.now() - callStartTime
        
        // Track successful call
        updateMetrics(callDuration, true)
        
        if (transactionId) {
          try {
            sentryPerformance.finishApiCall(transactionId, {
              success: true,
              statusCode: 200,
              responseSize: typeof result === 'string' ? result.length : JSON.stringify(result).length,
              cacheHit: false,
              retryCount: retryAttempt
            })
          } catch (error) {
            console.warn('Failed to finish Sentry performance tracking:', error)
          }
        }

        // Alert on critical API slowness
        if (options.critical && callDuration > (options.expectedDuration || 1000)) {
          Sentry.captureMessage(`Critical API ${apiName} is slow`, {
            level: 'warning',
            tags: {
              api_name: apiName,
              critical: 'true',
              performance_issue: 'true'
            },
            extra: {
              duration: Math.round(callDuration),
              expectedDuration: options.expectedDuration,
              retryAttempt,
              url,
              method
            }
          })
        }

        return result
      }

      // Execute with retry logic
      let lastError: Error | null = null
      
      for (retryAttempt = 0; retryAttempt <= (options.retryCount || 0); retryAttempt++) {
        try {
          return await executeCall()
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          
          if (retryAttempt < (options.retryCount || 0)) {
            // Wait before retry with exponential backoff
            const backoffDelay = Math.min(1000 * Math.pow(2, retryAttempt), 5000)
            await new Promise(resolve => setTimeout(resolve, backoffDelay))
            
            Sentry.addBreadcrumb({
              message: `API call retry attempt ${retryAttempt + 1} for ${apiName}`,
              category: 'api.retry',
              level: 'info',
              data: {
                apiName,
                retryAttempt: retryAttempt + 1,
                maxRetries: options.retryCount,
                error: lastError.message,
                backoffDelay
              }
            })
          }
        }
      }
      
      throw lastError

    } catch (error) {
      const duration = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // Track failed call
      updateMetrics(duration, false)
      
      if (transactionId) {
        try {
          sentryPerformance.finishApiCall(transactionId, {
            success: false,
            statusCode: 500,
            errorMessage,
            retryCount: retryAttempt
          })
        } catch (perfError) {
          console.warn('Failed to finish Sentry performance tracking on error:', perfError)
        }
      }

      // Capture API failure
      Sentry.captureException(error, {
        tags: {
          api_name: apiName,
          method: method.toUpperCase(),
          retry_count: retryAttempt.toString(),
          critical: options.critical?.toString() || 'false'
        },
        extra: {
          url,
          duration: Math.round(duration),
          expectedDuration: options.expectedDuration,
          timeout: options.timeout
        }
      })

      throw error
    }
  }

  /**
   * Monitor Stripe API calls specifically
   */
  public async monitorStripeCall<T>(
    operation: string,
    callback: () => Promise<T>
  ): Promise<T> {
    return this.monitorApiCall(
      `stripe.${operation}`,
      'POST',
      `/api/stripe/${operation}`,
      callback,
      {
        timeout: 5000,
        retryCount: 2,
        expectedDuration: 500,
        critical: true
      }
    )
  }

  /**
   * Monitor Twitch API calls specifically
   */
  public async monitorTwitchCall<T>(
    operation: string,
    callback: () => Promise<T>
  ): Promise<T> {
    return this.monitorApiCall(
      `twitch.${operation}`,
      'POST',
      `/api/twitch/${operation}`,
      callback,
      {
        timeout: 3000,
        retryCount: 1,
        expectedDuration: 800,
        critical: operation === 'streams' || operation === 'top-streams'
      }
    )
  }

  /**
   * Get API performance summary
   */
  public getPerformanceSummary(): Record<string, any> {
    const summary: Record<string, any> = {}
    
    for (const [apiName, metrics] of this.apiMetrics.entries()) {
      summary[apiName] = {
        totalCalls: metrics.totalCalls,
        averageDuration: Math.round(metrics.totalDuration / metrics.totalCalls),
        errorRate: Math.round((metrics.errorCount / metrics.totalCalls) * 100),
        slowCallRate: Math.round((metrics.slowCalls / metrics.totalCalls) * 100),
        lastCall: new Date(metrics.lastCall).toISOString()
      }
    }
    
    return summary
  }

  /**
   * Send performance summary to Sentry
   */
  public reportPerformanceSummary() {
    const summary = this.getPerformanceSummary()
    
    Sentry.addBreadcrumb({
      message: 'API Performance Summary',
      category: 'performance.summary',
      level: 'info',
      data: summary
    })

    // Find problematic APIs
    const problematicApis = Object.entries(summary).filter(([_, metrics]: [string, any]) => 
      metrics.errorRate > 5 || metrics.slowCallRate > 30 || metrics.averageDuration > 2000
    )

    if (problematicApis.length > 0) {
      Sentry.captureMessage('Performance issues detected in APIs', {
        level: 'warning',
        tags: {
          performance_issue: 'true',
          api_count: problematicApis.length.toString()
        },
        extra: {
          problematicApis: Object.fromEntries(problematicApis),
          fullSummary: summary
        }
      })
    }
  }

  /**
   * Clear old metrics to prevent memory leaks
   */
  public clearOldMetrics(maxAge: number = 24 * 60 * 60 * 1000) { // 24 hours
    const now = Date.now()
    
    for (const [apiName, metrics] of this.apiMetrics.entries()) {
      if (now - metrics.lastCall > maxAge) {
        this.apiMetrics.delete(apiName)
      }
    }
  }
}

export const sentryApiMonitor = SentryApiMonitor.getInstance()

// Auto-report performance summary every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    sentryApiMonitor.reportPerformanceSummary()
    sentryApiMonitor.clearOldMetrics()
  }, 5 * 60 * 1000)
}