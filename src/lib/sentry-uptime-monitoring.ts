import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Uptime Monitoring Implementation
 * Monitors critical endpoints and services for availability
 */

export interface UptimeCheckConfig {
  url: string
  method: 'GET' | 'POST' | 'HEAD'
  timeout: number
  interval: number
  retryCount: number
  expectedStatus: number[]
  headers?: Record<string, string>
  body?: string
  name: string
  critical: boolean
}

export interface UptimeCheckResult {
  url: string
  success: boolean
  status: number
  responseTime: number
  error?: string
  timestamp: number
  retryAttempt: number
}

export class SentryUptimeMonitor {
  private static instance: SentryUptimeMonitor
  private checks: Map<string, UptimeCheckConfig> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private lastResults: Map<string, UptimeCheckResult> = new Map()

  private constructor() {}

  public static getInstance(): SentryUptimeMonitor {
    if (!SentryUptimeMonitor.instance) {
      SentryUptimeMonitor.instance = new SentryUptimeMonitor()
    }
    return SentryUptimeMonitor.instance
  }

  /**
   * Add uptime check for an endpoint
   */
  public addUptimeCheck(config: UptimeCheckConfig) {
    this.checks.set(config.name, config)
    
    // Start monitoring immediately
    this.startMonitoring(config.name)
    
    Sentry.addBreadcrumb({
      message: `Added uptime check: ${config.name}`,
      category: 'uptime.config',
      level: 'info',
      data: {
        url: config.url,
        interval: config.interval,
        critical: config.critical
      }
    })
  }

  /**
   * Remove uptime check
   */
  public removeUptimeCheck(name: string) {
    this.stopMonitoring(name)
    this.checks.delete(name)
    this.lastResults.delete(name)
    
    Sentry.addBreadcrumb({
      message: `Removed uptime check: ${name}`,
      category: 'uptime.config',
      level: 'info'
    })
  }

  /**
   * Start monitoring a specific check
   */
  private startMonitoring(name: string) {
    const config = this.checks.get(name)
    if (!config) return

    // Clear existing interval
    this.stopMonitoring(name)

    // Set up new interval
    const interval = setInterval(() => {
      this.performUptimeCheck(config)
    }, config.interval)

    this.intervals.set(name, interval)

    // Perform initial check
    this.performUptimeCheck(config)
  }

  /**
   * Stop monitoring a specific check
   */
  private stopMonitoring(name: string) {
    const interval = this.intervals.get(name)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(name)
    }
  }

  /**
   * Perform uptime check with retries
   */
  private async performUptimeCheck(config: UptimeCheckConfig) {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= config.retryCount; attempt++) {
      try {
        const result = await this.executeUptimeCheck(config, attempt)
        
        // Store successful result
        this.lastResults.set(config.name, result)
        
        // Track successful uptime check
        this.trackUptimeSuccess(config, result)
        
        return result
      } catch (error) {
        lastError = error as Error
        
        // Wait before retry (exponential backoff)
        if (attempt < config.retryCount) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    // All retries failed
    const failureResult: UptimeCheckResult = {
      url: config.url,
      success: false,
      status: 0,
      responseTime: 0,
      error: lastError?.message || 'Unknown error',
      timestamp: Date.now(),
      retryAttempt: config.retryCount
    }

    this.lastResults.set(config.name, failureResult)
    this.trackUptimeFailure(config, failureResult, lastError)
    
    return failureResult
  }

  /**
   * Execute single uptime check
   */
  private async executeUptimeCheck(config: UptimeCheckConfig, attempt: number): Promise<UptimeCheckResult> {
    const startTime = performance.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeout)

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: {
          'User-Agent': 'Sentry-Uptime-Monitor/1.0',
          ...config.headers
        },
        body: config.body,
        signal: controller.signal
      })

      const responseTime = Math.round(performance.now() - startTime)
      
      const result: UptimeCheckResult = {
        url: config.url,
        success: config.expectedStatus.includes(response.status),
        status: response.status,
        responseTime,
        timestamp: Date.now(),
        retryAttempt: attempt
      }

      if (!result.success) {
        throw new Error(`Unexpected status code: ${response.status}`)
      }

      return result

    } catch (error) {
      const responseTime = Math.round(performance.now() - startTime)
      
      throw new Error(`Uptime check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Track successful uptime check
   */
  private trackUptimeSuccess(config: UptimeCheckConfig, result: UptimeCheckResult) {
    // Set measurements
    Sentry.setMeasurement(`uptime.${config.name}.response_time`, result.responseTime, 'millisecond')
    Sentry.setMeasurement(`uptime.${config.name}.success_rate`, 100, 'percent')

    // Add breadcrumb for slow responses
    if (result.responseTime > 5000) {
      Sentry.addBreadcrumb({
        message: `Slow uptime response: ${config.name}`,
        category: 'uptime.performance',
        level: 'warning',
        data: {
          url: config.url,
          responseTime: result.responseTime,
          status: result.status
        }
      })
    }

    // Track success metrics
    Sentry.addBreadcrumb({
      message: `Uptime check successful: ${config.name}`,
      category: 'uptime.success',
      level: 'info',
      data: {
        url: config.url,
        responseTime: result.responseTime,
        status: result.status,
        retryAttempt: result.retryAttempt
      }
    })
  }

  /**
   * Track failed uptime check
   */
  private trackUptimeFailure(config: UptimeCheckConfig, result: UptimeCheckResult, error: Error | null) {
    // Set failure measurements
    Sentry.setMeasurement(`uptime.${config.name}.success_rate`, 0, 'percent')

    // Capture uptime failure
    const uptimeError = new Error(`Uptime check failed: ${config.name}`)
    
    Sentry.withScope((scope) => {
      scope.setTag('uptime.check', config.name)
      scope.setTag('uptime.url', config.url)
      scope.setTag('uptime.critical', config.critical.toString())
      scope.setLevel(config.critical ? 'error' : 'warning')
      
      scope.setContext('uptime_check', {
        name: config.name,
        url: config.url,
        method: config.method,
        timeout: config.timeout,
        retryCount: config.retryCount,
        critical: config.critical
      })
      
      scope.setContext('uptime_result', {
        success: result.success,
        status: result.status,
        responseTime: result.responseTime,
        error: result.error,
        retryAttempt: result.retryAttempt,
        timestamp: new Date(result.timestamp).toISOString()
      })

      Sentry.captureException(uptimeError)
    })

    // Add breadcrumb
    Sentry.addBreadcrumb({
      message: `Uptime check failed: ${config.name}`,
      category: 'uptime.failure',
      level: config.critical ? 'error' : 'warning',
      data: {
        url: config.url,
        error: result.error,
        status: result.status,
        retryAttempt: result.retryAttempt
      }
    })
  }

  /**
   * Get current status of all checks
   */
  public getUptimeStatus(): Record<string, UptimeCheckResult | null> {
    const status: Record<string, UptimeCheckResult | null> = {}
    
    for (const [name] of this.checks) {
      status[name] = this.lastResults.get(name) || null
    }
    
    return status
  }

  /**
   * Get summary of uptime health
   */
  public getUptimeHealth() {
    const results = Array.from(this.lastResults.values())
    const totalChecks = results.length
    const successfulChecks = results.filter(r => r.success).length
    const failedChecks = totalChecks - successfulChecks
    const averageResponseTime = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
      : 0

    return {
      totalChecks,
      successfulChecks,
      failedChecks,
      successRate: totalChecks > 0 ? Math.round((successfulChecks / totalChecks) * 100) : 100,
      averageResponseTime,
      lastChecked: Math.max(...results.map(r => r.timestamp), 0)
    }
  }

  /**
   * Stop all monitoring
   */
  public stopAllMonitoring() {
    for (const [name] of this.intervals) {
      this.stopMonitoring(name)
    }
    
    Sentry.addBreadcrumb({
      message: 'All uptime monitoring stopped',
      category: 'uptime.config',
      level: 'info'
    })
  }

  /**
   * Start monitoring all configured checks
   */
  public startAllMonitoring() {
    for (const [name] of this.checks) {
      this.startMonitoring(name)
    }
    
    Sentry.addBreadcrumb({
      message: 'All uptime monitoring started',
      category: 'uptime.config',
      level: 'info',
      data: {
        checkCount: this.checks.size
      }
    })
  }
}

// Export singleton instance
export const sentryUptimeMonitor = SentryUptimeMonitor.getInstance()

// Default uptime checks for critical endpoints
export const defaultUptimeChecks: UptimeCheckConfig[] = [
  {
    name: 'api-health',
    url: '/api/health',
    method: 'GET',
    timeout: 5000,
    interval: 60000, // 1 minute
    retryCount: 3,
    expectedStatus: [200],
    critical: true
  },
  {
    name: 'twitch-streams-api',
    url: '/api/twitch/streams',
    method: 'POST',
    timeout: 10000,
    interval: 120000, // 2 minutes
    retryCount: 2,
    expectedStatus: [200],
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ channels: ['test'] }),
    critical: true
  },
  {
    name: 'stripe-sync-api',
    url: '/api/stripe/auto-sync',
    method: 'POST',
    timeout: 15000,
    interval: 300000, // 5 minutes
    retryCount: 2,
    expectedStatus: [200],
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
    critical: false
  },
  {
    name: 'main-page',
    url: '/',
    method: 'GET',
    timeout: 5000,
    interval: 120000, // 2 minutes
    retryCount: 2,
    expectedStatus: [200],
    critical: true
  }
]

// Auto-initialize uptime monitoring in browser
if (typeof window !== 'undefined') {
  // Only add uptime checks in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_UPTIME_MONITORING === 'true') {
    // Add default checks
    defaultUptimeChecks.forEach(config => {
      // Convert relative URLs to absolute URLs
      if (config.url.startsWith('/')) {
        config.url = `${window.location.origin}${config.url}`
      }
      
      sentryUptimeMonitor.addUptimeCheck(config)
    })

    // Report uptime health periodically
    setInterval(() => {
      const health = sentryUptimeMonitor.getUptimeHealth()
      
      Sentry.setMeasurement('uptime.overall.success_rate', health.successRate, 'percent')
      Sentry.setMeasurement('uptime.overall.response_time', health.averageResponseTime, 'millisecond')
      
      if (health.successRate < 95) {
        Sentry.addBreadcrumb({
          message: 'Poor uptime health detected',
          category: 'uptime.health',
          level: 'warning',
          data: health
        })
      }
    }, 300000) // Every 5 minutes
  }
}