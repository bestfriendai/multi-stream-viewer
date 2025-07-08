import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { User } from '@sentry/types'

/**
 * Advanced Sentry Debugging System
 * Implements comprehensive debugging capabilities from Sentry.io API
 */

// Advanced profiling and performance monitoring
export class SentryAdvancedDebugger {
  private static instance: SentryAdvancedDebugger
  private debugEnabled: boolean = process.env.NODE_ENV === 'development'
  private sessionId: string
  private performanceObserver?: PerformanceObserver

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeAdvancedFeatures()
  }

  public static getInstance(): SentryAdvancedDebugger {
    if (!SentryAdvancedDebugger.instance) {
      SentryAdvancedDebugger.instance = new SentryAdvancedDebugger()
    }
    return SentryAdvancedDebugger.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeAdvancedFeatures() {
    // Initialize session replay if available
    this.initializeSessionReplay()
    
    // Initialize performance observer
    this.initializePerformanceObserver()
    
    // Initialize user feedback
    this.initializeUserFeedback()
    
    // Set up advanced error boundaries
    this.setupAdvancedErrorBoundaries()
    
    // Initialize custom integrations
    this.initializeCustomIntegrations()
  }

  /**
   * Session Replay Integration
   */
  private initializeSessionReplay() {
    if (typeof window !== 'undefined') {
      Sentry.addIntegration({
        name: 'SessionReplay',
        setupOnce: () => {
          // Session replay configuration
          Sentry.setTag('session.replay_enabled', true)
          Sentry.setTag('session.id', this.sessionId)
          
          // Track session start
          Sentry.addBreadcrumb({
            message: 'Session replay initialized',
            category: 'session.replay',
            level: 'info',
            data: {
              sessionId: this.sessionId,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              viewport: `${window.innerWidth}x${window.innerHeight}`
            }
          })
        }
      })
    }
  }

  /**
   * Performance Observer for detailed performance monitoring
   */
  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            Sentry.setMeasurement(`paint.${entry.name.replace('-', '_')}`, entry.startTime, 'millisecond')
            
            if (entry.startTime > 2000) {
              Sentry.addBreadcrumb({
                message: `Slow paint detected: ${entry.name}`,
                category: 'performance.paint',
                level: 'warning',
                data: {
                  paintType: entry.name,
                  duration: Math.round(entry.startTime),
                  sessionId: this.sessionId
                }
              })
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })

        // Observe layout shifts
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })

          if (clsValue > 0.1) {
            Sentry.setMeasurement('web_vitals.cls', clsValue, 'none')
            Sentry.addBreadcrumb({
              message: 'High Cumulative Layout Shift detected',
              category: 'performance.cls',
              level: 'warning',
              data: {
                clsValue: Math.round(clsValue * 1000) / 1000,
                sessionId: this.sessionId
              }
            })
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          if (lastEntry) {
            Sentry.setMeasurement('web_vitals.lcp', lastEntry.startTime, 'millisecond')
            
            if (lastEntry.startTime > 2500) {
              Sentry.addBreadcrumb({
                message: 'Slow Largest Contentful Paint',
                category: 'performance.lcp',
                level: 'warning',
                data: {
                  lcpTime: Math.round(lastEntry.startTime),
                  element: (lastEntry as any).element?.tagName || 'unknown',
                  sessionId: this.sessionId
                }
              })
            }
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime
            Sentry.setMeasurement('web_vitals.fid', fid, 'millisecond')
            
            if (fid > 100) {
              Sentry.addBreadcrumb({
                message: 'High First Input Delay detected',
                category: 'performance.fid',
                level: 'warning',
                data: {
                  fidValue: Math.round(fid),
                  sessionId: this.sessionId
                }
              })
            }
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        this.performanceObserver = paintObserver

      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }
  }

  /**
   * User Feedback System
   */
  private initializeUserFeedback() {
    if (typeof window !== 'undefined') {
      // Add user feedback widget
      window.addEventListener('error', (event) => {
        this.showUserFeedbackDialog(event.error)
      })

      // Add custom feedback trigger
      this.addFeedbackTrigger()
    }
  }

  public showUserFeedbackDialog(error?: Error) {
    if (typeof window === 'undefined') return

    const eventId = Sentry.captureException(error || new Error('User feedback requested'))
    
    Sentry.showReportDialog({
      eventId,
      title: 'It looks like we\'re having issues.',
      subtitle: 'Our team has been notified. If you\'d like to help, tell us what happened below.',
      subtitle2: 'Thanks for helping make our app better!',
      labelName: 'Name',
      labelEmail: 'Email',
      labelComments: 'What happened?',
      labelClose: 'Close',
      labelSubmit: 'Submit',
      errorGeneric: 'An unknown error occurred while submitting your report.',
      errorFormEntry: 'Some fields were invalid. Please correct the errors and try again.',
      successMessage: 'Your feedback has been sent. Thank you!'
    })
  }

  private addFeedbackTrigger() {
    // Add keyboard shortcut for feedback (Ctrl+Shift+F)
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        event.preventDefault()
        this.showUserFeedbackDialog()
      }
    })
  }

  /**
   * Advanced Error Boundaries and Context
   */
  private setupAdvancedErrorBoundaries() {
    // Global error handler with enhanced context
    window.addEventListener('error', (event) => {
      Sentry.withScope((scope) => {
        scope.setTag('error.type', 'javascript')
        scope.setTag('error.source', event.filename || 'unknown')
        scope.setTag('session.id', this.sessionId)
        scope.setContext('error_details', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date().toISOString()
        })
        scope.setLevel('error')
        Sentry.captureException(event.error)
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      Sentry.withScope((scope) => {
        scope.setTag('error.type', 'unhandled_promise')
        scope.setTag('session.id', this.sessionId)
        scope.setContext('promise_rejection', {
          reason: event.reason,
          timestamp: new Date().toISOString()
        })
        scope.setLevel('error')
        Sentry.captureException(event.reason)
      })
    })
  }

  /**
   * Custom Integrations
   */
  private initializeCustomIntegrations() {
    // Network monitoring integration
    this.initializeNetworkMonitoring()
    
    // Memory leak detection
    this.initializeMemoryLeakDetection()
    
    // Console monitoring
    this.initializeConsoleMonitoring()
  }

  private initializeNetworkMonitoring() {
    if (typeof window !== 'undefined' && 'fetch' in window) {
      const originalFetch = window.fetch
      
      window.fetch = async (...args) => {
        const startTime = performance.now()
        const url = args[0]?.toString() || 'unknown'
        
        try {
          const response = await originalFetch(...args)
          const duration = performance.now() - startTime
          
          // Track fetch performance
          Sentry.addBreadcrumb({
            message: `Fetch request to ${url}`,
            category: 'http',
            level: 'info',
            data: {
              url,
              method: args[1]?.method || 'GET',
              status: response.status,
              duration: Math.round(duration),
              sessionId: this.sessionId
            }
          })

          // Alert on slow requests
          if (duration > 5000) {
            Sentry.addBreadcrumb({
              message: `Slow network request detected`,
              category: 'performance.network',
              level: 'warning',
              data: {
                url,
                duration: Math.round(duration),
                status: response.status
              }
            })
          }

          return response
        } catch (error) {
          const duration = performance.now() - startTime
          
          Sentry.addBreadcrumb({
            message: `Fetch request failed to ${url}`,
            category: 'http',
            level: 'error',
            data: {
              url,
              duration: Math.round(duration),
              error: error instanceof Error ? error.message : 'Unknown error',
              sessionId: this.sessionId
            }
          })
          
          throw error
        }
      }
    }
  }

  private initializeMemoryLeakDetection() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        
        Sentry.setMeasurement('memory.used_mb', usedMB, 'megabyte')
        Sentry.setMeasurement('memory.total_mb', totalMB, 'megabyte')
        Sentry.setMeasurement('memory.limit_mb', limitMB, 'megabyte')
        
        const usagePercentage = (usedMB / limitMB) * 100
        
        if (usagePercentage > 80) {
          Sentry.addBreadcrumb({
            message: 'High memory usage detected',
            category: 'performance.memory',
            level: 'warning',
            data: {
              usedMB,
              totalMB,
              limitMB,
              usagePercentage: Math.round(usagePercentage),
              sessionId: this.sessionId
            }
          })
        }
      }, 30000) // Check every 30 seconds
    }
  }

  private initializeConsoleMonitoring() {
    if (typeof window !== 'undefined') {
      const originalConsoleError = console.error
      const originalConsoleWarn = console.warn
      
      console.error = (...args) => {
        Sentry.addBreadcrumb({
          message: 'Console error',
          category: 'console',
          level: 'error',
          data: {
            arguments: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)),
            sessionId: this.sessionId
          }
        })
        originalConsoleError(...args)
      }
      
      console.warn = (...args) => {
        Sentry.addBreadcrumb({
          message: 'Console warning',
          category: 'console',
          level: 'warning',
          data: {
            arguments: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)),
            sessionId: this.sessionId
          }
        })
        originalConsoleWarn(...args)
      }
    }
  }

  /**
   * Advanced User Context and Identification
   */
  public setAdvancedUserContext(user: Partial<User> & {
    subscription?: string
    deviceInfo?: any
    preferences?: any
    sessionMetadata?: any
  }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      ip_address: '{{auto}}',
      ...user
    })

    // Set additional user context
    Sentry.setContext('user_metadata', {
      subscription: user.subscription,
      deviceInfo: user.deviceInfo,
      preferences: user.preferences,
      sessionMetadata: user.sessionMetadata,
      sessionId: this.sessionId
    })

    Sentry.addBreadcrumb({
      message: 'User context updated',
      category: 'user.context',
      level: 'info',
      data: {
        userId: user.id,
        email: user.email,
        subscription: user.subscription,
        sessionId: this.sessionId
      }
    })
  }

  /**
   * Advanced Transaction and Span Management
   */
  public startAdvancedTransaction(name: string, operation: string, context?: any) {
    const span = Sentry.startInactiveSpan({
      name,
      op: operation,
      attributes: {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...context
      }
    })

    return span
  }

  public createAdvancedSpan(transaction: any, operation: string, description: string, data?: any) {
    const span = transaction.startChild({
      op: operation,
      description,
      data: {
        ...data,
        sessionId: this.sessionId
      }
    })

    return span
  }

  /**
   * Custom Error Reporting with Enhanced Context
   */
  public captureAdvancedError(error: Error, context: {
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
    tags?: Record<string, string>
    extra?: Record<string, any>
    user?: Partial<User>
    component?: string
    action?: string
  } = {}) {
    return Sentry.withScope((scope) => {
      // Set level
      scope.setLevel(context.level || 'error')
      
      // Set tags
      scope.setTag('session.id', this.sessionId)
      scope.setTag('error.component', context.component || 'unknown')
      scope.setTag('error.action', context.action || 'unknown')
      
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value)
        })
      }
      
      // Set extra context
      scope.setContext('error_context', {
        ...context.extra,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server'
      })
      
      // Set user context if provided
      if (context.user) {
        scope.setUser(context.user)
      }
      
      return Sentry.captureException(error)
    })
  }

  /**
   * Performance Monitoring Utilities
   */
  public trackPageLoad(pageName: string) {
    if (typeof window !== 'undefined') {
      Sentry.startSpan({
        name: `pageload.${pageName}`,
        op: 'pageload',
        attributes: {
          page: pageName,
          sessionId: this.sessionId
        }
      }, (span) => {
        // Track navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          Sentry.setMeasurement('navigation.dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart, 'millisecond')
          Sentry.setMeasurement('navigation.tcp_connect', navigation.connectEnd - navigation.connectStart, 'millisecond')
          Sentry.setMeasurement('navigation.request', navigation.responseStart - navigation.requestStart, 'millisecond')
          Sentry.setMeasurement('navigation.response', navigation.responseEnd - navigation.responseStart, 'millisecond')
          Sentry.setMeasurement('navigation.dom_load', navigation.domContentLoadedEventEnd - navigation.navigationStart, 'millisecond')
        }
        
        // Track page load performance
        Sentry.addBreadcrumb({
          message: `Page loaded: ${pageName}`,
          category: 'performance.pageload',
          level: 'info',
          data: {
            page: pageName,
            sessionId: this.sessionId
          }
        })
      })
    }
  }

  /**
   * Custom Metrics and Measurements
   */
  public setCustomMetric(name: string, value: number, unit: string = 'none') {
    Sentry.setMeasurement(name, value, unit)
    
    Sentry.addBreadcrumb({
      message: `Custom metric recorded: ${name}`,
      category: 'metric',
      level: 'info',
      data: {
        metricName: name,
        value,
        unit,
        sessionId: this.sessionId
      }
    })
  }

  /**
   * Feature Flag Integration
   */
  public setFeatureFlag(flag: string, enabled: boolean, variant?: string) {
    Sentry.setTag(`feature.${flag}`, enabled.toString())
    
    if (variant) {
      Sentry.setTag(`feature.${flag}.variant`, variant)
    }
    
    Sentry.addBreadcrumb({
      message: `Feature flag evaluated: ${flag}`,
      category: 'feature_flag',
      level: 'info',
      data: {
        flag,
        enabled,
        variant,
        sessionId: this.sessionId
      }
    })
  }

  /**
   * Debug Utilities
   */
  public enableDebugMode() {
    this.debugEnabled = true
    console.log('Sentry debug mode enabled')
    
    Sentry.addBreadcrumb({
      message: 'Debug mode enabled',
      category: 'debug',
      level: 'info',
      data: {
        sessionId: this.sessionId
      }
    })
  }

  public disableDebugMode() {
    this.debugEnabled = false
    console.log('Sentry debug mode disabled')
  }

  public getSessionId(): string {
    return this.sessionId
  }

  /**
   * Cleanup
   */
  public cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
  }
}

// Export singleton instance
export const sentryAdvancedDebugger = SentryAdvancedDebugger.getInstance()

// Advanced error boundary for React components
export const withSentryErrorBoundary = (Component: React.ComponentType<any>, errorBoundaryOptions?: any) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-red-600 mb-4">{error?.message}</p>
        <button 
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
        <button 
          onClick={() => sentryAdvancedDebugger.showUserFeedbackDialog(error)}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Report Issue
        </button>
      </div>
    ),
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('error.boundary', true)
      scope.setContext('react_error_boundary', errorInfo)
      scope.setContext('component_stack', {
        componentStack: errorInfo.componentStack
      })
    },
    ...errorBoundaryOptions
  })
}

// Performance monitoring decorator
export const withSentryPerformance = (name: string) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const transaction = sentryAdvancedDebugger.startAdvancedTransaction(
        `${target.constructor.name}.${propertyKey}`,
        'function',
        { className: target.constructor.name, methodName: propertyKey }
      )

      try {
        const result = await originalMethod.apply(this, args)
        transaction.setStatus('ok')
        return result
      } catch (error) {
        transaction.setStatus('internal_error')
        sentryAdvancedDebugger.captureAdvancedError(error as Error, {
          component: target.constructor.name,
          action: propertyKey,
          level: 'error'
        })
        throw error
      } finally {
        transaction.finish()
      }
    }

    return descriptor
  }
}