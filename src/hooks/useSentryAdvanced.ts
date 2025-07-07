import { useEffect, useCallback, useRef } from 'react'
import * as Sentry from '@sentry/nextjs'
import { sentryAdvancedDebugger } from '@/lib/sentry-advanced-debugging'
import { sentryProfilingReplay } from '@/lib/sentry-profiling-replay'
import { streamMonitor, apiPerformanceMonitor, userJourneyTracker } from '@/lib/sentry-custom-integrations'
import { sentryDebugUtilities } from '@/lib/sentry-debug-utilities'
import { sentryCronMonitor } from '@/lib/sentry-cron-monitoring'
import { sentryAttachments, attachmentUtils } from '@/lib/sentry-attachments'

/**
 * Advanced Sentry React Hook
 * Provides comprehensive monitoring, debugging, and performance tracking
 */

export interface SentryAdvancedOptions {
  componentName: string
  enableProfiling?: boolean
  enableReplay?: boolean
  enableMemoryTracking?: boolean
  enableUserJourney?: boolean
  enableApiTracking?: boolean
  autoCaptureFeedback?: boolean
  memoryCheckInterval?: number
  customTags?: Record<string, string>
  customContext?: Record<string, any>
}

export interface SentryAdvancedHook {
  // Error handling
  captureError: (error: Error, context?: any) => string
  captureMessage: (message: string, level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal') => string
  captureException: (exception: any, context?: any) => string
  
  // Performance tracking
  startTransaction: (name: string, operation?: string) => any
  measurePerformance: <T>(name: string, fn: () => T | Promise<T>) => T | Promise<T>
  trackRender: (props?: any) => void
  trackInteraction: (action: string, element?: string) => () => void
  
  // API monitoring
  trackApiCall: <T>(name: string, apiCall: () => Promise<T>) => Promise<T>
  monitorFetch: (url: string, options?: RequestInit) => Promise<Response>
  
  // User context
  setUser: (user: any) => void
  setUserContext: (context: any) => void
  updateUserProfile: (profile: any) => void
  
  // Feature flags
  setFeatureFlag: (flag: string, enabled: boolean, variant?: string) => void
  
  // Custom metrics
  setMetric: (name: string, value: number, unit?: string) => void
  setMeasurement: (name: string, value: number, unit?: string) => void
  
  // Breadcrumbs and context
  addBreadcrumb: (breadcrumb: any) => void
  setContext: (key: string, context: any) => void
  setTag: (key: string, value: string) => void
  setLevel: (level: 'debug' | 'info' | 'warning' | 'error' | 'fatal') => void
  
  // Session and replay
  startReplay: () => void
  stopReplay: () => void
  captureReplaySnapshot: (name: string) => void
  
  // Profiling
  startProfiling: (name?: string) => any
  stopProfiling: () => any
  
  // User feedback
  showFeedbackDialog: (error?: Error) => void
  captureFeedback: (feedback: any) => void
  
  // Debug utilities
  enableDebugMode: () => void
  generateDebugReport: () => Promise<any>
  testSentryIntegration: () => void
  
  // Journey tracking
  trackJourneyStep: (step: string, data?: any) => void
  getJourneySummary: () => any
  
  // Stream monitoring (app-specific)
  trackStreamStart: (streamId: string) => void
  trackStreamEnd: (streamId: string) => void
  trackStreamError: (streamId: string, error: string) => void
  
  // Cron monitoring
  startCronJob: (slug: string, metadata?: any) => string
  finishCronJob: (slug: string, status: 'ok' | 'error' | 'timeout', error?: Error) => void
  withCronMonitoring: <T>(slug: string, fn: () => Promise<T> | T, metadata?: any) => Promise<T>
  
  // Attachments
  attachDebugSnapshot: (description?: string) => Promise<void>
  attachErrorContext: (error: Error, context?: any) => void
  attachStreamState: () => void
  attachPerformanceData: () => void
  
  // Component lifecycle
  onMount: () => void
  onUnmount: () => void
  onUpdate: (prevProps?: any) => void
  
  // Status and utilities
  getSessionId: () => string
  getStatus: () => any
  isDebugEnabled: () => boolean
}

export function useSentryAdvanced(options: SentryAdvancedOptions): SentryAdvancedHook {
  const {
    componentName,
    enableProfiling = false,
    enableReplay = true,
    enableMemoryTracking = true,
    enableUserJourney = true,
    enableApiTracking = true,
    autoCaptureFeedback = false,
    memoryCheckInterval = 30000,
    customTags = {},
    customContext = {}
  } = options

  const transactionRef = useRef<any>(null)
  const profilerRef = useRef<any>(null)
  const renderStartRef = useRef<number>(0)
  const mountTimeRef = useRef<number>(0)
  const interactionTimersRef = useRef<Map<string, number>>(new Map())

  // Initialize component monitoring
  useEffect(() => {
    mountTimeRef.current = performance.now()
    
    // Set component context
    Sentry.withScope((scope) => {
      scope.setTag('component.name', componentName)
      scope.setTag('component.mounted', 'true')
      scope.setContext('component', {
        name: componentName,
        mountTime: mountTimeRef.current,
        ...customContext
      })
      
      // Add custom tags
      Object.entries(customTags).forEach(([key, value]) => {
        scope.setTag(key, value)
      })
    })

    // Track component mount
    Sentry.addBreadcrumb({
      message: `Component mounted: ${componentName}`,
      category: 'component.lifecycle',
      level: 'info',
      data: {
        componentName,
        mountTime: mountTimeRef.current
      }
    })

    // Start profiling if enabled
    if (enableProfiling) {
      profilerRef.current = sentryProfilingReplay.startProfiling(`component.${componentName}`)
    }

    // Track user journey
    if (enableUserJourney) {
      userJourneyTracker.trackStep(`component.${componentName}.mounted`, {
        componentName,
        timestamp: new Date().toISOString()
      })
    }

    return () => {
      // Track component unmount
      const unmountTime = performance.now()
      const lifetimeDuration = unmountTime - mountTimeRef.current

      Sentry.addBreadcrumb({
        message: `Component unmounted: ${componentName}`,
        category: 'component.lifecycle',
        level: 'info',
        data: {
          componentName,
          lifetimeDuration: Math.round(lifetimeDuration)
        }
      })

      // Stop profiling
      if (profilerRef.current) {
        profilerRef.current.stop()
      }

      // Track user journey
      if (enableUserJourney) {
        userJourneyTracker.trackStep(`component.${componentName}.unmounted`, {
          componentName,
          lifetimeDuration: Math.round(lifetimeDuration)
        })
      }
    }
  }, [componentName, enableProfiling, enableUserJourney, customTags, customContext])

  // Memory tracking
  useEffect(() => {
    if (!enableMemoryTracking || typeof window === 'undefined') return

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        
        Sentry.setMeasurement(`${componentName}.memory.used_mb`, memoryMB, 'megabyte')
        
        if (memoryMB > 100) {
          Sentry.addBreadcrumb({
            message: `High memory usage in ${componentName}`,
            category: 'performance.memory',
            level: 'warning',
            data: {
              componentName,
              memoryMB
            }
          })
        }
      }
    }

    const interval = setInterval(checkMemory, memoryCheckInterval)
    return () => clearInterval(interval)
  }, [componentName, enableMemoryTracking, memoryCheckInterval])

  // Hook implementation
  const hook: SentryAdvancedHook = {
    // Error handling
    captureError: useCallback((error: Error, context?: any) => {
      return sentryAdvancedDebugger.captureAdvancedError(error, {
        level: 'error',
        component: componentName,
        extra: context,
        tags: { ...customTags, component: componentName }
      })
    }, [componentName, customTags]),

    captureMessage: useCallback((message: string, level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info') => {
      return Sentry.captureMessage(message, level)
    }, []),

    captureException: useCallback((exception: any, context?: any) => {
      return Sentry.captureException(exception, {
        tags: { ...customTags, component: componentName },
        extra: context
      })
    }, [componentName, customTags]),

    // Performance tracking
    startTransaction: useCallback((name: string, operation: string = 'component') => {
      const transaction = sentryAdvancedDebugger.startAdvancedTransaction(
        `${componentName}.${name}`,
        operation,
        { componentName }
      )
      transactionRef.current = transaction
      return transaction
    }, [componentName]),

    measurePerformance: useCallback(<T,>(name: string, fn: () => T | Promise<T>) => {
      return sentryProfilingReplay.measurePerformance(`${componentName}.${name}`, fn)
    }, [componentName]),

    trackRender: useCallback((props?: any) => {
      renderStartRef.current = performance.now()
      
      requestAnimationFrame(() => {
        const renderTime = performance.now() - renderStartRef.current
        
        Sentry.setMeasurement(`${componentName}.render_time`, renderTime, 'millisecond')
        
        if (renderTime > 16) { // Slower than 60fps
          Sentry.addBreadcrumb({
            message: `Slow render in ${componentName}`,
            category: 'performance.render',
            level: 'warning',
            data: {
              componentName,
              renderTime: Math.round(renderTime),
              props
            }
          })
        }
      })
    }, [componentName]),

    trackInteraction: useCallback((action: string, element: string = 'unknown') => {
      const key = `${action}-${element}`
      const startTime = performance.now()
      interactionTimersRef.current.set(key, startTime)

      return () => {
        const endTime = performance.now()
        const duration = endTime - (interactionTimersRef.current.get(key) || startTime)
        interactionTimersRef.current.delete(key)
        
        Sentry.setMeasurement(`${componentName}.interaction.${action}`, duration, 'millisecond')
        
        if (duration > 100) {
          Sentry.addBreadcrumb({
            message: `Slow interaction in ${componentName}`,
            category: 'performance.interaction',
            level: 'warning',
            data: {
              componentName,
              action,
              element,
              duration: Math.round(duration)
            }
          })
        }
      }
    }, [componentName]),

    // API monitoring
    trackApiCall: useCallback(async <T,>(name: string, apiCall: () => Promise<T>) => {
      if (!enableApiTracking) return await apiCall()

      const startTime = performance.now()
      
      try {
        const result = await apiCall()
        const duration = performance.now() - startTime
        
        apiPerformanceMonitor.trackAPICall(name, duration, true)
        
        return result
      } catch (error) {
        const duration = performance.now() - startTime
        apiPerformanceMonitor.trackAPICall(name, duration, false)
        throw error
      }
    }, [enableApiTracking]),

    monitorFetch: useCallback(async (url: string, options?: RequestInit) => {
      const startTime = performance.now()
      
      try {
        const response = await fetch(url, options)
        const duration = performance.now() - startTime
        
        apiPerformanceMonitor.trackAPICall(url, duration, response.ok)
        
        return response
      } catch (error) {
        const duration = performance.now() - startTime
        apiPerformanceMonitor.trackAPICall(url, duration, false)
        throw error
      }
    }, []),

    // User context
    setUser: useCallback((user: any) => {
      sentryAdvancedDebugger.setAdvancedUserContext(user)
    }, []),

    setUserContext: useCallback((context: any) => {
      Sentry.setContext('user_context', context)
    }, []),

    updateUserProfile: useCallback((profile: any) => {
      Sentry.setUser(profile)
      userJourneyTracker.trackStep('user.profile_updated', profile)
    }, []),

    // Feature flags
    setFeatureFlag: useCallback((flag: string, enabled: boolean, variant?: string) => {
      sentryAdvancedDebugger.setFeatureFlag(flag, enabled, variant)
    }, []),

    // Custom metrics
    setMetric: useCallback((name: string, value: number, unit: string = 'none') => {
      sentryAdvancedDebugger.setCustomMetric(`${componentName}.${name}`, value, unit)
    }, [componentName]),

    setMeasurement: useCallback((name: string, value: number, unit: string = 'none') => {
      Sentry.setMeasurement(`${componentName}.${name}`, value, unit)
    }, [componentName]),

    // Breadcrumbs and context
    addBreadcrumb: useCallback((breadcrumb: any) => {
      Sentry.addBreadcrumb({
        ...breadcrumb,
        data: {
          ...breadcrumb.data,
          componentName
        }
      })
    }, [componentName]),

    setContext: useCallback((key: string, context: any) => {
      Sentry.setContext(key, { ...context, componentName })
    }, [componentName]),

    setTag: useCallback((key: string, value: string) => {
      Sentry.setTag(key, value)
    }, []),

    setLevel: useCallback((level: 'debug' | 'info' | 'warning' | 'error' | 'fatal') => {
      Sentry.configureScope((scope) => {
        scope.setLevel(level)
      })
    }, []),

    // Session and replay
    startReplay: useCallback(() => {
      if (enableReplay) {
        sentryProfilingReplay.startReplay()
      }
    }, [enableReplay]),

    stopReplay: useCallback(() => {
      sentryProfilingReplay.stopReplay()
    }, []),

    captureReplaySnapshot: useCallback((name: string) => {
      sentryProfilingReplay.captureReplaySnapshot(`${componentName}.${name}`)
    }, [componentName]),

    // Profiling
    startProfiling: useCallback((name?: string) => {
      return sentryProfilingReplay.startProfiling(name || `${componentName}.manual`)
    }, [componentName]),

    stopProfiling: useCallback(() => {
      return sentryProfilingReplay.stopProfiling()
    }, []),

    // User feedback
    showFeedbackDialog: useCallback((error?: Error) => {
      sentryAdvancedDebugger.showUserFeedbackDialog(error)
    }, []),

    captureFeedback: useCallback((feedback: any) => {
      Sentry.captureFeedback({
        ...feedback,
        source: componentName
      })
    }, [componentName]),

    // Debug utilities
    enableDebugMode: useCallback(() => {
      sentryAdvancedDebugger.enableDebugMode()
    }, []),

    generateDebugReport: useCallback(() => {
      return sentryDebugUtilities.generateDebugReport()
    }, []),

    testSentryIntegration: useCallback(() => {
      sentryDebugUtilities.testSentryIntegrations()
    }, []),

    // Journey tracking
    trackJourneyStep: useCallback((step: string, data?: any) => {
      userJourneyTracker.trackStep(`${componentName}.${step}`, {
        componentName,
        ...data
      })
    }, [componentName]),

    getJourneySummary: useCallback(() => {
      return userJourneyTracker.getJourneySummary()
    }, []),

    // Stream monitoring (app-specific)
    trackStreamStart: useCallback((streamId: string) => {
      streamMonitor.trackStreamStart(streamId)
      userJourneyTracker.trackStep('stream.started', { streamId, componentName })
    }, [componentName]),

    trackStreamEnd: useCallback((streamId: string) => {
      streamMonitor.trackStreamEnd(streamId)
      userJourneyTracker.trackStep('stream.ended', { streamId, componentName })
    }, [componentName]),

    trackStreamError: useCallback((streamId: string, error: string) => {
      streamMonitor.trackStreamError(streamId, error)
      userJourneyTracker.trackStep('stream.error', { streamId, error, componentName })
    }, [componentName]),

    // Cron monitoring
    startCronJob: useCallback((slug: string, metadata?: any) => {
      return sentryCronMonitor.startCronJob(slug, { ...metadata, componentName })
    }, [componentName]),

    finishCronJob: useCallback((slug: string, status: 'ok' | 'error' | 'timeout', error?: Error) => {
      sentryCronMonitor.finishCronJob(slug, status, error)
    }, []),

    withCronMonitoring: useCallback(<T,>(slug: string, fn: () => Promise<T> | T, metadata?: any) => {
      return sentryCronMonitor.withCronMonitoring(slug, fn, { ...metadata, componentName })
    }, [componentName]),

    // Attachments
    attachDebugSnapshot: useCallback(async (description: string = `Debug snapshot from ${componentName}`) => {
      await sentryAttachments.attachDebugSnapshot(description)
    }, [componentName]),

    attachErrorContext: useCallback((error: Error, context?: any) => {
      sentryAttachments.attachErrorContext(error, { ...context, componentName })
    }, [componentName]),

    attachStreamState: useCallback(() => {
      sentryAttachments.attachStreamState()
    }, []),

    attachPerformanceData: useCallback(() => {
      sentryAttachments.attachPerformanceData()
    }, []),

    // Component lifecycle
    onMount: useCallback(() => {
      userJourneyTracker.trackStep(`${componentName}.lifecycle.mount`)
    }, [componentName]),

    onUnmount: useCallback(() => {
      userJourneyTracker.trackStep(`${componentName}.lifecycle.unmount`)
    }, [componentName]),

    onUpdate: useCallback((prevProps?: any) => {
      userJourneyTracker.trackStep(`${componentName}.lifecycle.update`, { prevProps })
    }, [componentName]),

    // Status and utilities
    getSessionId: useCallback(() => {
      return sentryAdvancedDebugger.getSessionId()
    }, []),

    getStatus: useCallback(() => {
      return {
        componentName,
        sessionId: sentryAdvancedDebugger.getSessionId(),
        profilingStatus: sentryProfilingReplay.getProfilingStatus(),
        enabledFeatures: {
          profiling: enableProfiling,
          replay: enableReplay,
          memoryTracking: enableMemoryTracking,
          userJourney: enableUserJourney,
          apiTracking: enableApiTracking
        }
      }
    }, [componentName, enableProfiling, enableReplay, enableMemoryTracking, enableUserJourney, enableApiTracking]),

    isDebugEnabled: useCallback(() => {
      return process.env.NODE_ENV === 'development'
    }, [])
  }

  return hook
}

// Higher-order component for automatic Sentry monitoring
export function withSentryAdvanced<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<SentryAdvancedOptions, 'componentName'>
) {
  const componentName = Component.displayName || Component.name || 'UnknownComponent'
  
  return function SentryMonitoredComponent(props: P) {
    const sentry = useSentryAdvanced({
      ...options,
      componentName
    })

    // Track render on every render
    React.useEffect(() => {
      sentry.trackRender(props)
    })

    // Auto-capture feedback on errors if enabled
    React.useEffect(() => {
      if (options.autoCaptureFeedback) {
        const handleError = (error: ErrorEvent) => {
          sentry.showFeedbackDialog(error.error)
        }
        
        window.addEventListener('error', handleError)
        return () => window.removeEventListener('error', handleError)
      }
    }, [sentry, options.autoCaptureFeedback])

    return React.createElement(Component, props)
  }
}

// Utility hook for simple error boundary
export function useSentryErrorBoundary(componentName: string) {
  const sentry = useSentryAdvanced({ componentName })
  
  return {
    captureError: sentry.captureError,
    showFeedback: sentry.showFeedbackDialog
  }
}