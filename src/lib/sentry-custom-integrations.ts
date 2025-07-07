import * as Sentry from '@sentry/nextjs'
import { Integration, Event, EventHint } from '@sentry/types'

/**
 * Custom Sentry Integrations and Filters
 * Advanced filtering, sampling, and custom data collection
 */

// Custom Stream Monitoring Integration
export class StreamMonitoringIntegration implements Integration {
  public static id = 'StreamMonitoring'
  public name = StreamMonitoringIntegration.id

  private streamMetrics: Map<string, {
    startTime: number
    errors: number
    bufferingEvents: number
    qualityChanges: number
    totalViewTime: number
  }> = new Map()

  setupOnce(addGlobalEventProcessor: (callback: (event: Event, hint?: EventHint) => Event | null) => void) {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      // Add stream context to all events
      if (this.streamMetrics.size > 0) {
        event.contexts = event.contexts || {}
        event.contexts.stream_metrics = {
          active_streams: this.streamMetrics.size,
          total_errors: Array.from(this.streamMetrics.values()).reduce((sum, metric) => sum + metric.errors, 0),
          total_buffering_events: Array.from(this.streamMetrics.values()).reduce((sum, metric) => sum + metric.bufferingEvents, 0),
          average_view_time: this.getAverageViewTime()
        }
      }

      return event
    })
  }

  public trackStreamStart(streamId: string) {
    this.streamMetrics.set(streamId, {
      startTime: Date.now(),
      errors: 0,
      bufferingEvents: 0,
      qualityChanges: 0,
      totalViewTime: 0
    })

    Sentry.addBreadcrumb({
      message: `Stream started: ${streamId}`,
      category: 'stream.lifecycle',
      level: 'info',
      data: { streamId, timestamp: new Date().toISOString() }
    })
  }

  public trackStreamError(streamId: string, error: string) {
    const metrics = this.streamMetrics.get(streamId)
    if (metrics) {
      metrics.errors += 1
      this.streamMetrics.set(streamId, metrics)
    }

    Sentry.addBreadcrumb({
      message: `Stream error: ${streamId}`,
      category: 'stream.error',
      level: 'error',
      data: { streamId, error, timestamp: new Date().toISOString() }
    })
  }

  public trackStreamBuffering(streamId: string) {
    const metrics = this.streamMetrics.get(streamId)
    if (metrics) {
      metrics.bufferingEvents += 1
      this.streamMetrics.set(streamId, metrics)
    }
  }

  public trackStreamEnd(streamId: string) {
    const metrics = this.streamMetrics.get(streamId)
    if (metrics) {
      const viewTime = Date.now() - metrics.startTime
      metrics.totalViewTime = viewTime

      Sentry.addBreadcrumb({
        message: `Stream ended: ${streamId}`,
        category: 'stream.lifecycle',
        level: 'info',
        data: {
          streamId,
          viewTime,
          errors: metrics.errors,
          bufferingEvents: metrics.bufferingEvents,
          qualityChanges: metrics.qualityChanges,
          timestamp: new Date().toISOString()
        }
      })

      this.streamMetrics.delete(streamId)
    }
  }

  private getAverageViewTime(): number {
    const metrics = Array.from(this.streamMetrics.values())
    if (metrics.length === 0) return 0

    const totalViewTime = metrics.reduce((sum, metric) => {
      const currentViewTime = Date.now() - metric.startTime
      return sum + currentViewTime
    }, 0)

    return Math.round(totalViewTime / metrics.length)
  }
}

// Custom API Performance Integration
export class APIPerformanceIntegration implements Integration {
  public static id = 'APIPerformance'
  public name = APIPerformanceIntegration.id

  private apiMetrics: Map<string, {
    totalCalls: number
    totalDuration: number
    errorCount: number
    lastCall: number
  }> = new Map()

  setupOnce(addGlobalEventProcessor: (callback: (event: Event, hint?: EventHint) => Event | null) => void) {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      // Add API performance context
      if (this.apiMetrics.size > 0) {
        event.contexts = event.contexts || {}
        event.contexts.api_performance = {
          tracked_apis: this.apiMetrics.size,
          total_api_calls: Array.from(this.apiMetrics.values()).reduce((sum, metric) => sum + metric.totalCalls, 0),
          total_api_errors: Array.from(this.apiMetrics.values()).reduce((sum, metric) => sum + metric.errorCount, 0),
          average_response_time: this.getAverageResponseTime()
        }
      }

      return event
    })
  }

  public trackAPICall(endpoint: string, duration: number, success: boolean) {
    const metrics = this.apiMetrics.get(endpoint) || {
      totalCalls: 0,
      totalDuration: 0,
      errorCount: 0,
      lastCall: 0
    }

    metrics.totalCalls += 1
    metrics.totalDuration += duration
    metrics.lastCall = Date.now()

    if (!success) {
      metrics.errorCount += 1
    }

    this.apiMetrics.set(endpoint, metrics)

    // Alert on slow API calls
    if (duration > 5000) {
      Sentry.addBreadcrumb({
        message: `Slow API call detected: ${endpoint}`,
        category: 'api.performance',
        level: 'warning',
        data: {
          endpoint,
          duration: Math.round(duration),
          success,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  private getAverageResponseTime(): number {
    const metrics = Array.from(this.apiMetrics.values())
    if (metrics.length === 0) return 0

    const totalDuration = metrics.reduce((sum, metric) => sum + metric.totalDuration, 0)
    const totalCalls = metrics.reduce((sum, metric) => sum + metric.totalCalls, 0)

    return totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0
  }

  public getMetricsSummary() {
    const summary: Record<string, any> = {}
    
    for (const [endpoint, metrics] of this.apiMetrics.entries()) {
      summary[endpoint] = {
        totalCalls: metrics.totalCalls,
        averageDuration: Math.round(metrics.totalDuration / metrics.totalCalls),
        errorRate: Math.round((metrics.errorCount / metrics.totalCalls) * 100),
        lastCall: new Date(metrics.lastCall).toISOString()
      }
    }
    
    return summary
  }
}

// User Journey Tracking Integration
export class UserJourneyIntegration implements Integration {
  public static id = 'UserJourney'
  public name = UserJourneyIntegration.id

  private journeySteps: Array<{
    step: string
    timestamp: number
    data?: any
  }> = []

  private sessionStart: number = Date.now()

  setupOnce(addGlobalEventProcessor: (callback: (event: Event, hint?: EventHint) => Event | null) => void) {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      // Add user journey context to all events
      event.contexts = event.contexts || {}
      event.contexts.user_journey = {
        session_duration: Date.now() - this.sessionStart,
        journey_steps: this.journeySteps.length,
        current_step: this.journeySteps[this.journeySteps.length - 1]?.step || 'unknown',
        last_actions: this.journeySteps.slice(-5).map(step => step.step)
      }

      return event
    })
  }

  public trackStep(step: string, data?: any) {
    this.journeySteps.push({
      step,
      timestamp: Date.now(),
      data
    })

    // Keep only last 50 steps to prevent memory issues
    if (this.journeySteps.length > 50) {
      this.journeySteps = this.journeySteps.slice(-50)
    }

    Sentry.addBreadcrumb({
      message: `User journey step: ${step}`,
      category: 'user.journey',
      level: 'info',
      data: {
        step,
        data,
        sessionDuration: Date.now() - this.sessionStart,
        totalSteps: this.journeySteps.length,
        timestamp: new Date().toISOString()
      }
    })
  }

  public getJourneySummary() {
    return {
      sessionDuration: Date.now() - this.sessionStart,
      totalSteps: this.journeySteps.length,
      steps: this.journeySteps.map(({ step, timestamp, data }) => ({
        step,
        timestamp: new Date(timestamp).toISOString(),
        data
      }))
    }
  }
}

// Advanced Error Filtering
export class ErrorFilteringIntegration implements Integration {
  public static id = 'ErrorFiltering'
  public name = ErrorFilteringIntegration.id

  private errorCounts: Map<string, number> = new Map()
  private readonly maxErrorsPerType = 10 // Max same errors per session

  setupOnce(addGlobalEventProcessor: (callback: (event: Event, hint?: EventHint) => Event | null) => void) {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      // Filter out known spam errors
      if (this.shouldFilterError(event)) {
        return null
      }

      // Add error frequency context
      const errorKey = this.getErrorKey(event)
      const count = this.errorCounts.get(errorKey) || 0
      this.errorCounts.set(errorKey, count + 1)

      event.extra = event.extra || {}
      event.extra.error_frequency = {
        count: count + 1,
        error_key: errorKey
      }

      return event
    })
  }

  private shouldFilterError(event: Event): boolean {
    const message = event.message || event.exception?.values?.[0]?.value || ''
    
    // Filter common non-actionable errors
    const spamPatterns = [
      /Non-Error promise rejection captured/,
      /ResizeObserver loop limit exceeded/,
      /Loading CSS chunk \d+ failed/,
      /ChunkLoadError/,
      /Script error/,
      /Network request failed/,
      /Unexpected token < in JSON/
    ]

    for (const pattern of spamPatterns) {
      if (pattern.test(message)) {
        return true
      }
    }

    // Limit duplicate errors
    const errorKey = this.getErrorKey(event)
    const count = this.errorCounts.get(errorKey) || 0
    
    if (count >= this.maxErrorsPerType) {
      return true
    }

    return false
  }

  private getErrorKey(event: Event): string {
    return event.message || 
           event.exception?.values?.[0]?.value || 
           'unknown_error'
  }
}

// Performance Sampling Integration
export class PerformanceSamplingIntegration implements Integration {
  public static id = 'PerformanceSampling'
  public name = PerformanceSamplingIntegration.id

  setupOnce() {
    // Dynamic sampling based on performance impact
    Sentry.configureScope((scope) => {
      // Sample more frequently for slow devices
      const isSlowDevice = this.detectSlowDevice()
      const sampleRate = isSlowDevice ? 0.3 : 0.1

      scope.setTag('device.performance', isSlowDevice ? 'slow' : 'fast')
      scope.setTag('sampling.rate', sampleRate.toString())
    })
  }

  private detectSlowDevice(): boolean {
    if (typeof navigator === 'undefined') return false

    // Check device memory
    const deviceMemory = (navigator as any).deviceMemory
    if (deviceMemory && deviceMemory < 4) return true

    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true

    // Check connection speed
    const connection = (navigator as any).connection
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true
    }

    return false
  }
}

// Custom Data Enrichment Integration
export class DataEnrichmentIntegration implements Integration {
  public static id = 'DataEnrichment'
  public name = DataEnrichmentIntegration.id

  setupOnce(addGlobalEventProcessor: (callback: (event: Event, hint?: EventHint) => Event | null) => void) {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      // Enrich all events with additional context
      event.contexts = event.contexts || {}
      
      // Add browser capabilities
      if (typeof window !== 'undefined') {
        event.contexts.browser_capabilities = {
          local_storage: typeof Storage !== 'undefined',
          session_storage: typeof sessionStorage !== 'undefined',
          indexed_db: typeof indexedDB !== 'undefined',
          web_workers: typeof Worker !== 'undefined',
          service_workers: 'serviceWorker' in navigator,
          push_notifications: 'PushManager' in window,
          web_rtc: typeof RTCPeerConnection !== 'undefined',
          geolocation: 'geolocation' in navigator,
          device_orientation: 'DeviceOrientationEvent' in window,
          touch_support: 'ontouchstart' in window
        }

        // Add performance timing
        if (performance && performance.timing) {
          const timing = performance.timing
          event.contexts.performance_timing = {
            dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcp_connect: timing.connectEnd - timing.connectStart,
            request_response: timing.responseEnd - timing.requestStart,
            dom_loading: timing.loadEventEnd - timing.navigationStart,
            page_load: timing.loadEventEnd - timing.navigationStart
          }
        }

        // Add viewport information
        event.contexts.viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          device_pixel_ratio: window.devicePixelRatio,
          color_depth: screen.colorDepth,
          orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        }
      }

      return event
    })
  }
}

// Export all integrations
export const customSentryIntegrations = [
  new StreamMonitoringIntegration(),
  new APIPerformanceIntegration(),
  new UserJourneyIntegration(),
  new ErrorFilteringIntegration(),
  new PerformanceSamplingIntegration(),
  new DataEnrichmentIntegration()
]

// Utility functions for easier integration usage
export const streamMonitor = customSentryIntegrations[0] as StreamMonitoringIntegration
export const apiPerformanceMonitor = customSentryIntegrations[1] as APIPerformanceIntegration
export const userJourneyTracker = customSentryIntegrations[2] as UserJourneyIntegration

// Advanced event filtering functions
export const beforeSend = (event: Event, hint: EventHint): Event | null => {
  // Additional custom filtering logic
  
  // Don't send events in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
    return null
  }

  // Filter events based on user consent
  if (typeof window !== 'undefined') {
    const hasConsent = localStorage.getItem('sentry_consent')
    if (!hasConsent || hasConsent !== 'true') {
      return null
    }
  }

  // Scrub sensitive data
  if (event.request) {
    event.request.cookies = '[Filtered]'
    
    // Remove sensitive headers
    if (event.request.headers) {
      delete event.request.headers.Authorization
      delete event.request.headers.Cookie
      delete event.request.headers['X-API-Key']
    }
  }

  // Scrub sensitive form data
  if (event.extra && typeof event.extra === 'object') {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credit_card', 'ssn']
    
    const scrubSensitiveData = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj
      
      const scrubbed = { ...obj }
      for (const key in scrubbed) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          scrubbed[key] = '[Filtered]'
        } else if (typeof scrubbed[key] === 'object') {
          scrubbed[key] = scrubSensitiveData(scrubbed[key])
        }
      }
      return scrubbed
    }

    event.extra = scrubSensitiveData(event.extra)
  }

  return event
}

export const beforeSendTransaction = (event: Event): Event | null => {
  // Filter out overly frequent transactions
  const transactionName = event.transaction
  
  if (transactionName) {
    // Skip frequent polling transactions
    if (transactionName.includes('heartbeat') || 
        transactionName.includes('polling') ||
        transactionName.includes('ping')) {
      return null
    }
  }

  return event
}