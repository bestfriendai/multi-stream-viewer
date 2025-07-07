import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Cron Monitoring Implementation
 * Monitors scheduled tasks and background jobs
 */

export interface CronJobConfig {
  slug: string
  schedule: string
  checkinMargin: number
  maxRuntime: number
  timezone?: string
  description?: string
  tags?: Record<string, string>
}

export interface CronJobExecution {
  slug: string
  startTime: number
  endTime?: number
  status: 'in_progress' | 'ok' | 'error' | 'timeout'
  checkInId?: string
  error?: string
  duration?: number
  metadata?: Record<string, any>
}

export class SentryCronMonitor {
  private static instance: SentryCronMonitor
  private jobs: Map<string, CronJobConfig> = new Map()
  private executions: Map<string, CronJobExecution> = new Map()
  private timeouts: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {}

  public static getInstance(): SentryCronMonitor {
    if (!SentryCronMonitor.instance) {
      SentryCronMonitor.instance = new SentryCronMonitor()
    }
    return SentryCronMonitor.instance
  }

  /**
   * Register a cron job for monitoring
   */
  public registerCronJob(config: CronJobConfig) {
    this.jobs.set(config.slug, config)
    
    Sentry.addBreadcrumb({
      message: `Registered cron job: ${config.slug}`,
      category: 'cron.config',
      level: 'info',
      data: {
        slug: config.slug,
        schedule: config.schedule,
        maxRuntime: config.maxRuntime
      }
    })
  }

  /**
   * Start monitoring a cron job execution
   */
  public startCronJob(slug: string, metadata?: Record<string, any>): string {
    const config = this.jobs.get(slug)
    if (!config) {
      throw new Error(`Cron job '${slug}' not registered`)
    }

    const startTime = Date.now()
    const checkInId = Sentry.captureCheckIn(
      {
        monitorSlug: slug,
        status: 'in_progress',
      },
      {
        schedule: {
          type: 'crontab',
          value: config.schedule,
        },
        checkinMargin: config.checkinMargin,
        maxRuntime: config.maxRuntime,
        timezone: config.timezone || 'UTC',
      }
    )

    const execution: CronJobExecution = {
      slug,
      startTime,
      status: 'in_progress',
      checkInId,
      metadata
    }

    this.executions.set(slug, execution)

    // Set timeout to automatically mark as timeout if exceeds maxRuntime
    const timeoutId = setTimeout(() => {
      if (this.executions.get(slug)?.status === 'in_progress') {
        this.finishCronJob(slug, 'timeout', new Error(`Cron job '${slug}' exceeded max runtime of ${config.maxRuntime}ms`))
      }
    }, config.maxRuntime)

    this.timeouts.set(slug, timeoutId)

    Sentry.addBreadcrumb({
      message: `Started cron job: ${slug}`,
      category: 'cron.start',
      level: 'info',
      data: {
        slug,
        checkInId,
        startTime: new Date(startTime).toISOString(),
        metadata
      }
    })

    return checkInId
  }

  /**
   * Finish monitoring a cron job execution
   */
  public finishCronJob(slug: string, status: 'ok' | 'error' | 'timeout', error?: Error, result?: any): void {
    const execution = this.executions.get(slug)
    if (!execution) {
      console.warn(`No active execution found for cron job: ${slug}`)
      return
    }

    // Clear timeout
    const timeoutId = this.timeouts.get(slug)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.timeouts.delete(slug)
    }

    const endTime = Date.now()
    const duration = endTime - execution.startTime

    // Update execution
    execution.endTime = endTime
    execution.status = status
    execution.duration = duration
    if (error) {
      execution.error = error.message
    }

    // Send check-in to Sentry
    if (execution.checkInId) {
      Sentry.captureCheckIn({
        checkInId: execution.checkInId,
        monitorSlug: slug,
        status: status,
        duration: duration
      })
    }

    // Capture error if failed
    if (status === 'error' && error) {
      Sentry.withScope((scope) => {
        scope.setTag('cron.job', slug)
        scope.setTag('cron.status', status)
        scope.setContext('cron_execution', {
          slug,
          duration,
          startTime: new Date(execution.startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          metadata: execution.metadata
        })
        
        Sentry.captureException(error)
      })
    }

    // Add breadcrumb
    Sentry.addBreadcrumb({
      message: `Finished cron job: ${slug}`,
      category: 'cron.finish',
      level: status === 'ok' ? 'info' : 'error',
      data: {
        slug,
        status,
        duration: Math.round(duration),
        error: error?.message,
        result: typeof result === 'object' ? JSON.stringify(result) : result
      }
    })

    // Set performance measurement
    Sentry.setMeasurement(`cron.${slug}.duration`, duration, 'millisecond')
    Sentry.setMeasurement(`cron.${slug}.success_rate`, status === 'ok' ? 100 : 0, 'percent')

    // Clean up execution
    this.executions.delete(slug)
  }

  /**
   * Wrap a function with cron monitoring
   */
  public withCronMonitoring<T>(
    slug: string, 
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        this.startCronJob(slug, metadata)
        const result = await fn()
        this.finishCronJob(slug, 'ok', undefined, result)
        resolve(result)
      } catch (error) {
        this.finishCronJob(slug, 'error', error as Error)
        reject(error)
      }
    })
  }

  /**
   * Get execution status for a cron job
   */
  public getExecutionStatus(slug: string): CronJobExecution | null {
    return this.executions.get(slug) || null
  }

  /**
   * Get all registered jobs
   */
  public getRegisteredJobs(): Record<string, CronJobConfig> {
    const jobs: Record<string, CronJobConfig> = {}
    for (const [slug, config] of this.jobs) {
      jobs[slug] = config
    }
    return jobs
  }

  /**
   * Get summary of all cron job statuses
   */
  public getCronSummary() {
    const registered = this.jobs.size
    const active = this.executions.size
    const jobs = Array.from(this.jobs.keys())
    
    return {
      registered,
      active,
      jobs,
      activeExecutions: Array.from(this.executions.values())
    }
  }
}

// Export singleton instance
export const sentryCronMonitor = SentryCronMonitor.getInstance()

// Default cron jobs for the application
export const defaultCronJobs: CronJobConfig[] = [
  {
    slug: 'stripe-auto-sync',
    schedule: '*/5 * * * *', // Every 5 minutes
    checkinMargin: 120, // 2 minutes margin
    maxRuntime: 300000, // 5 minutes max runtime
    timezone: 'UTC',
    description: 'Automatic Stripe data synchronization',
    tags: {
      category: 'payment',
      critical: 'true'
    }
  },
  {
    slug: 'twitch-token-refresh',
    schedule: '0 */6 * * *', // Every 6 hours
    checkinMargin: 600, // 10 minutes margin
    maxRuntime: 60000, // 1 minute max runtime
    timezone: 'UTC',
    description: 'Refresh Twitch API tokens',
    tags: {
      category: 'authentication',
      critical: 'true'
    }
  },
  {
    slug: 'stream-health-check',
    schedule: '*/2 * * * *', // Every 2 minutes
    checkinMargin: 60, // 1 minute margin
    maxRuntime: 30000, // 30 seconds max runtime
    timezone: 'UTC',
    description: 'Check health of active streams',
    tags: {
      category: 'monitoring',
      critical: 'false'
    }
  },
  {
    slug: 'cleanup-old-data',
    schedule: '0 2 * * *', // Daily at 2 AM
    checkinMargin: 3600, // 1 hour margin
    maxRuntime: 1800000, // 30 minutes max runtime
    timezone: 'UTC',
    description: 'Clean up old logs and temporary data',
    tags: {
      category: 'maintenance',
      critical: 'false'
    }
  }
]

// Auto-register default cron jobs
if (typeof window !== 'undefined') {
  defaultCronJobs.forEach(config => {
    sentryCronMonitor.registerCronJob(config)
  })

  Sentry.addBreadcrumb({
    message: `Registered ${defaultCronJobs.length} default cron jobs`,
    category: 'cron.init',
    level: 'info',
    data: {
      jobs: defaultCronJobs.map(job => job.slug)
    }
  })
}

// Utility functions for common patterns
export const cronUtils = {
  /**
   * Monitor a Stripe sync operation
   */
  monitorStripeSync: async (syncFn: () => Promise<any>) => {
    return sentryCronMonitor.withCronMonitoring('stripe-auto-sync', syncFn, {
      operation: 'stripe_sync',
      timestamp: new Date().toISOString()
    })
  },

  /**
   * Monitor token refresh
   */
  monitorTokenRefresh: async (provider: string, refreshFn: () => Promise<any>) => {
    return sentryCronMonitor.withCronMonitoring(`${provider}-token-refresh`, refreshFn, {
      provider,
      operation: 'token_refresh',
      timestamp: new Date().toISOString()
    })
  },

  /**
   * Monitor stream health check
   */
  monitorStreamHealthCheck: async (checkFn: () => Promise<any>) => {
    return sentryCronMonitor.withCronMonitoring('stream-health-check', checkFn, {
      operation: 'health_check',
      timestamp: new Date().toISOString()
    })
  },

  /**
   * Monitor cleanup operations
   */
  monitorCleanup: async (cleanupFn: () => Promise<any>) => {
    return sentryCronMonitor.withCronMonitoring('cleanup-old-data', cleanupFn, {
      operation: 'cleanup',
      timestamp: new Date().toISOString()
    })
  }
}