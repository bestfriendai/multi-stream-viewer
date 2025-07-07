'use client'

import { useEffect, useRef, useCallback } from 'react'
import { sentryPerformance } from '@/lib/sentry-performance'
import * as Sentry from '@sentry/nextjs'

export const useSentryPerformance = (componentName: string) => {
  const renderStartRef = useRef<number>(0)
  const interactionStartRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    // Track component mount
    const mountTime = performance.now()
    
    Sentry.addBreadcrumb({
      message: `Component mounted: ${componentName}`,
      category: 'component.lifecycle',
      level: 'info',
      data: { componentName, mountTime }
    })

    return () => {
      // Track component unmount
      Sentry.addBreadcrumb({
        message: `Component unmounted: ${componentName}`,
        category: 'component.lifecycle',
        level: 'info',
        data: { componentName }
      })
    }
  }, [componentName])

  const trackRender = useCallback((props?: any) => {
    renderStartRef.current = performance.now()
    
    // Use requestAnimationFrame to measure actual render time
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStartRef.current
      sentryPerformance.trackComponentRender(componentName, renderTime, props)
    })
  }, [componentName])

  const trackInteraction = useCallback((action: string, element?: string) => {
    const key = `${action}-${element || 'unknown'}`
    const startTime = performance.now()
    interactionStartRef.current.set(key, startTime)

    return () => {
      const endTime = performance.now()
      const duration = endTime - (interactionStartRef.current.get(key) || startTime)
      interactionStartRef.current.delete(key)
      
      sentryPerformance.trackUserInteraction(action, element || 'unknown', duration)
    }
  }, [])

  const trackAsyncOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const duration = performance.now() - startTime
      
      Sentry.setMeasurement(`${componentName}.${operationName}`, duration, 'millisecond')
      
      if (duration > 1000) {
        Sentry.addBreadcrumb({
          message: `Slow async operation in ${componentName}: ${operationName}`,
          category: 'performance',
          level: 'warning',
          data: { componentName, operationName, duration: Math.round(duration) }
        })
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      Sentry.addBreadcrumb({
        message: `Failed async operation in ${componentName}: ${operationName}`,
        category: 'error',
        level: 'error',
        data: { 
          componentName, 
          operationName, 
          duration: Math.round(duration),
          error: error instanceof Error ? error.message : String(error)
        }
      })
      
      throw error
    }
  }, [componentName])

  return {
    trackRender,
    trackInteraction,
    trackAsyncOperation
  }
}

// Hook for tracking API calls from components
export const useSentryApiTracking = () => {
  const trackApiCall = useCallback(async <T>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const transactionId = sentryPerformance.startApiCall(apiName, 'POST', `/api/${apiName}`)
    
    try {
      const result = await apiCall()
      
      sentryPerformance.finishApiCall(transactionId, {
        success: true,
        statusCode: 200,
        responseSize: typeof result === 'string' ? result.length : JSON.stringify(result).length
      })
      
      return result
    } catch (error) {
      sentryPerformance.finishApiCall(transactionId, {
        success: false,
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error)
      })
      
      throw error
    }
  }, [])

  return { trackApiCall }
}

// Hook for tracking memory usage in components
export const useSentryMemoryTracking = (componentName: string, interval: number = 30000) => {
  useEffect(() => {
    const trackMemory = () => {
      sentryPerformance.trackMemoryUsage()
      
      // Component-specific memory tracking
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        
        Sentry.setMeasurement(`${componentName}.memory.usage_percent`, usagePercentage, 'percent')
        
        if (usagePercentage > 70) {
          Sentry.addBreadcrumb({
            message: `High memory usage in component: ${componentName}`,
            category: 'performance',
            level: 'warning',
            data: {
              componentName,
              usagePercentage: Math.round(usagePercentage),
              usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024)
            }
          })
        }
      }
    }

    // Track immediately and then periodically
    trackMemory()
    const memoryTimer = setInterval(trackMemory, interval)

    return () => {
      clearInterval(memoryTimer)
    }
  }, [componentName, interval])
}

// Hook for tracking route changes and page loads
export const useSentryPageTracking = (pageName: string) => {
  useEffect(() => {
    const startTime = performance.now()
    
    Sentry.addBreadcrumb({
      message: `Page loaded: ${pageName}`,
      category: 'navigation',
      level: 'info',
      data: { pageName, loadStartTime: startTime }
    })

    // Track page load performance
    if (typeof window !== 'undefined') {
      const handleLoad = () => {
        const loadTime = performance.now() - startTime
        Sentry.setMeasurement(`page.${pageName}.load_time`, loadTime, 'millisecond')
        
        if (loadTime > 3000) {
          Sentry.addBreadcrumb({
            message: `Slow page load: ${pageName}`,
            category: 'performance',
            level: 'warning',
            data: { pageName, loadTime: Math.round(loadTime) }
          })
        }
      }

      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
        return () => window.removeEventListener('load', handleLoad)
      }
    }
  }, [pageName])
}

// Hook for tracking form performance
export const useSentryFormTracking = (formName: string) => {
  const trackFormStart = useCallback(() => {
    Sentry.addBreadcrumb({
      message: `Form started: ${formName}`,
      category: 'form.interaction',
      level: 'info',
      data: { formName, startTime: performance.now() }
    })
  }, [formName])

  const trackFormSubmit = useCallback((success: boolean, duration?: number) => {
    Sentry.addBreadcrumb({
      message: `Form ${success ? 'submitted' : 'failed'}: ${formName}`,
      category: 'form.interaction',
      level: success ? 'info' : 'warning',
      data: { formName, success, duration }
    })

    if (duration) {
      Sentry.setMeasurement(`form.${formName}.submit_time`, duration, 'millisecond')
    }
  }, [formName])

  const trackFormError = useCallback((error: string, field?: string) => {
    Sentry.addBreadcrumb({
      message: `Form error in ${formName}`,
      category: 'form.error',
      level: 'error',
      data: { formName, error, field }
    })
  }, [formName])

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError
  }
}