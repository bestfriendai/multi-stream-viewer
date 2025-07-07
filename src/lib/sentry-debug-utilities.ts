import * as Sentry from '@sentry/nextjs'
import { sentryAdvancedDebugger } from './sentry-advanced-debugging'
import { sentryProfilingReplay } from './sentry-profiling-replay'
import { streamMonitor, apiPerformanceMonitor, userJourneyTracker } from './sentry-custom-integrations'

/**
 * Comprehensive Sentry Debug Utilities
 * Advanced debugging tools and diagnostics
 */

export interface DebugReport {
  timestamp: string
  sessionId: string
  environment: {
    userAgent: string
    viewport: string
    url: string
    platform: string
    language: string
    timezone: string
    online: boolean
    cookiesEnabled: boolean
  }
  performance: {
    memory: any
    timing: any
    fps: number
    resources: any[]
  }
  errors: any[]
  breadcrumbs: any[]
  integrations: {
    stream: any
    api: any
    journey: any
    profiling: any
  }
  customMetrics: Record<string, any>
}

export class SentryDebugUtilities {
  private static instance: SentryDebugUtilities
  private debugConsole: HTMLElement | null = null
  private debugEnabled: boolean = false
  private errorHistory: any[] = []
  private performanceMetrics: Record<string, any> = {}

  private constructor() {
    this.initializeDebugConsole()
    this.setupDebugEventListeners()
  }

  public static getInstance(): SentryDebugUtilities {
    if (!SentryDebugUtilities.instance) {
      SentryDebugUtilities.instance = new SentryDebugUtilities()
    }
    return SentryDebugUtilities.instance
  }

  /**
   * Initialize Debug Console
   */
  private initializeDebugConsole() {
    if (typeof window === 'undefined') return

    // Create debug console element
    this.debugConsole = document.createElement('div')
    this.debugConsole.id = 'sentry-debug-console'
    this.debugConsole.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      max-height: 500px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      overflow-y: auto;
      z-index: 10000;
      display: none;
      border: 1px solid #333;
    `

    // Add toggle button
    const toggleButton = document.createElement('button')
    toggleButton.textContent = '🐛'
    toggleButton.style.cssText = `
      position: fixed;
      top: 10px;
      right: 420px;
      width: 40px;
      height: 40px;
      background: #333;
      color: #00ff00;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10001;
      font-size: 18px;
    `

    toggleButton.addEventListener('click', () => {
      this.toggleDebugConsole()
    })

    document.body.appendChild(this.debugConsole)
    document.body.appendChild(toggleButton)
  }

  private setupDebugEventListeners() {
    if (typeof window === 'undefined') return

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+D: Toggle debug console
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault()
        this.toggleDebugConsole()
      }

      // Ctrl+Shift+R: Generate debug report
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault()
        this.generateDebugReport().then(report => {
          this.downloadDebugReport(report)
        })
      }

      // Ctrl+Shift+C: Clear debug console
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault()
        this.clearDebugConsole()
      }

      // Ctrl+Shift+E: Trigger test error
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault()
        this.triggerTestError()
      }

      // Ctrl+Shift+P: Start/stop profiling
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        this.toggleProfiling()
      }
    })

    // Hook into Sentry events
    Sentry.addGlobalEventProcessor((event) => {
      this.logToDebugConsole(`🔴 Sentry Event: ${event.level} - ${event.message || 'No message'}`)
      
      if (event.level === 'error') {
        this.errorHistory.push({
          timestamp: new Date().toISOString(),
          message: event.message,
          exception: event.exception,
          breadcrumbs: event.breadcrumbs
        })
      }

      return event
    })
  }

  /**
   * Debug Console Management
   */
  public toggleDebugConsole() {
    if (!this.debugConsole) return

    this.debugEnabled = !this.debugEnabled
    this.debugConsole.style.display = this.debugEnabled ? 'block' : 'none'

    if (this.debugEnabled) {
      this.logToDebugConsole('🟢 Sentry Debug Console Activated')
      this.logToDebugConsole(`📊 Session ID: ${sentryAdvancedDebugger.getSessionId()}`)
      this.logToDebugConsole('⌨️  Shortcuts: Ctrl+Shift+R (Report), Ctrl+Shift+C (Clear), Ctrl+Shift+E (Test Error), Ctrl+Shift+P (Profiling)')
      this.displaySystemInfo()
    }
  }

  private logToDebugConsole(message: string) {
    if (!this.debugConsole || !this.debugEnabled) return

    const timestamp = new Date().toLocaleTimeString()
    const logEntry = document.createElement('div')
    logEntry.innerHTML = `<span style="color: #666;">[${timestamp}]</span> ${message}`
    
    this.debugConsole.appendChild(logEntry)
    this.debugConsole.scrollTop = this.debugConsole.scrollHeight

    // Limit console entries
    const entries = this.debugConsole.children
    if (entries.length > 100) {
      this.debugConsole.removeChild(entries[0])
    }
  }

  private clearDebugConsole() {
    if (!this.debugConsole) return
    this.debugConsole.innerHTML = ''
    this.logToDebugConsole('🧹 Debug console cleared')
  }

  private displaySystemInfo() {
    if (typeof window === 'undefined') return

    this.logToDebugConsole(`🖥️  Platform: ${navigator.platform}`)
    this.logToDebugConsole(`🌐 User Agent: ${navigator.userAgent.substring(0, 50)}...`)
    this.logToDebugConsole(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`)
    this.logToDebugConsole(`🌍 Language: ${navigator.language}`)
    this.logToDebugConsole(`📡 Online: ${navigator.onLine}`)
    
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.logToDebugConsole(`💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB used`)
    }
  }

  /**
   * Test and Diagnostic Functions
   */
  public triggerTestError() {
    this.logToDebugConsole('🧪 Triggering test error...')
    
    try {
      throw new Error('This is a test error for Sentry debugging')
    } catch (error) {
      sentryAdvancedDebugger.captureAdvancedError(error as Error, {
        level: 'error',
        tags: { test: 'true', debug: 'true' },
        extra: { 
          testType: 'manual_trigger',
          timestamp: new Date().toISOString()
        },
        component: 'DebugUtilities',
        action: 'triggerTestError'
      })
    }
  }

  public async testAPIEndpoints() {
    this.logToDebugConsole('🔗 Testing API endpoints...')

    const endpoints = [
      '/api/health',
      '/api/twitch/streams',
      '/api/stripe/auto-sync'
    ]

    for (const endpoint of endpoints) {
      try {
        const startTime = performance.now()
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify({ test: true }) })
        const duration = performance.now() - startTime
        
        const status = response.ok ? '✅' : '❌'
        this.logToDebugConsole(`${status} ${endpoint}: ${response.status} (${Math.round(duration)}ms)`)
        
        apiPerformanceMonitor.trackAPICall(endpoint, duration, response.ok)
      } catch (error) {
        this.logToDebugConsole(`❌ ${endpoint}: Failed - ${error}`)
      }
    }
  }

  public testSentryIntegrations() {
    this.logToDebugConsole('🔧 Testing Sentry integrations...')

    // Test breadcrumb
    Sentry.addBreadcrumb({
      message: 'Test breadcrumb from debug utilities',
      category: 'debug.test',
      level: 'info'
    })
    this.logToDebugConsole('✅ Breadcrumb test complete')

    // Test user context
    sentryAdvancedDebugger.setAdvancedUserContext({
      id: 'debug-user',
      email: 'debug@test.com',
      subscription: 'debug'
    })
    this.logToDebugConsole('✅ User context test complete')

    // Test custom metric
    sentryAdvancedDebugger.setCustomMetric('debug.test_metric', 42, 'count')
    this.logToDebugConsole('✅ Custom metric test complete')

    // Test feature flag
    sentryAdvancedDebugger.setFeatureFlag('debug_mode', true, 'test')
    this.logToDebugConsole('✅ Feature flag test complete')

    // Test journey tracking
    userJourneyTracker.trackStep('debug_test_step', { test: true })
    this.logToDebugConsole('✅ Journey tracking test complete')
  }

  private profilingActive = false
  private currentProfiler: any = null

  public toggleProfiling() {
    if (this.profilingActive) {
      this.currentProfiler?.stop()
      this.profilingActive = false
      this.logToDebugConsole('⏹️ Profiling stopped')
    } else {
      this.currentProfiler = sentryProfilingReplay.startProfiling('debug_manual_profile')
      this.profilingActive = true
      this.logToDebugConsole('▶️ Profiling started')
    }
  }

  /**
   * Debug Report Generation
   */
  public async generateDebugReport(): Promise<DebugReport> {
    this.logToDebugConsole('📋 Generating debug report...')

    const report: DebugReport = {
      timestamp: new Date().toISOString(),
      sessionId: sentryAdvancedDebugger.getSessionId(),
      environment: await this.getEnvironmentInfo(),
      performance: await this.getPerformanceInfo(),
      errors: this.errorHistory.slice(-10), // Last 10 errors
      breadcrumbs: this.getBreadcrumbs(),
      integrations: {
        stream: streamMonitor,
        api: apiPerformanceMonitor.getMetricsSummary(),
        journey: userJourneyTracker.getJourneySummary(),
        profiling: sentryProfilingReplay.getProfilingStatus()
      },
      customMetrics: this.performanceMetrics
    }

    this.logToDebugConsole('✅ Debug report generated')
    return report
  }

  private async getEnvironmentInfo() {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        viewport: 'server',
        url: 'server',
        platform: 'server',
        language: 'unknown',
        timezone: 'unknown',
        online: true,
        cookiesEnabled: false
      }
    }

    return {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      url: window.location.href,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled
    }
  }

  private async getPerformanceInfo() {
    if (typeof window === 'undefined') return null

    const info: any = {
      fps: 0,
      resources: []
    }

    // Memory info
    if ('memory' in performance) {
      const memory = (performance as any).memory
      info.memory = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }

    // Timing info
    if (performance.timing) {
      const timing = performance.timing
      info.timing = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connect: timing.connectEnd - timing.connectStart,
        request: timing.responseEnd - timing.requestStart,
        domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart
      }
    }

    // Resource timing
    const resources = performance.getEntriesByType('resource')
    info.resources = resources.slice(-10).map((resource: any) => ({
      name: resource.name,
      duration: Math.round(resource.duration),
      size: resource.transferSize || 0,
      type: resource.initiatorType
    }))

    return info
  }

  private getBreadcrumbs() {
    // Get breadcrumbs from Sentry scope
    const scope = Sentry.getCurrentHub().getScope()
    return scope?.getBreadcrumbs?.() || []
  }

  public downloadDebugReport(report: DebugReport) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `sentry-debug-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.logToDebugConsole('💾 Debug report downloaded')
  }

  /**
   * Performance Monitoring
   */
  public startPerformanceMonitoring() {
    if (typeof window === 'undefined') return

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.logToDebugConsole(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`)
          
          Sentry.addBreadcrumb({
            message: 'Long task detected',
            category: 'performance.longtask',
            level: 'warning',
            data: {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime)
            }
          })
        })
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        console.warn('Long task observer not supported')
      }
    }

    // Monitor navigation
    window.addEventListener('beforeunload', () => {
      this.logToDebugConsole('🔄 Page unloading')
      
      Sentry.addBreadcrumb({
        message: 'Page unloading',
        category: 'navigation',
        level: 'info',
        data: {
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })
    })
  }

  /**
   * Real-time Monitoring
   */
  public enableRealTimeMonitoring() {
    setInterval(() => {
      if (!this.debugEnabled) return

      // Update performance metrics
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory
        const memoryMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        
        if (memoryMB > (this.performanceMetrics.lastMemoryMB || 0) + 10) {
          this.logToDebugConsole(`📈 Memory increased to ${memoryMB}MB`)
        }
        
        this.performanceMetrics.lastMemoryMB = memoryMB
      }

      // Check for errors
      if (this.errorHistory.length > (this.performanceMetrics.lastErrorCount || 0)) {
        const newErrors = this.errorHistory.length - (this.performanceMetrics.lastErrorCount || 0)
        this.logToDebugConsole(`🚨 ${newErrors} new error(s) detected`)
        this.performanceMetrics.lastErrorCount = this.errorHistory.length
      }

    }, 5000) // Every 5 seconds
  }

  /**
   * Cleanup
   */
  public cleanup() {
    if (this.debugConsole) {
      this.debugConsole.remove()
    }
  }

  /**
   * Export utilities for global access
   */
  public exposeGlobalDebugAPI() {
    if (typeof window === 'undefined') return

    ;(window as any).SentryDebug = {
      toggleConsole: () => this.toggleDebugConsole(),
      generateReport: () => this.generateDebugReport(),
      testError: () => this.triggerTestError(),
      testAPI: () => this.testAPIEndpoints(),
      testIntegrations: () => this.testSentryIntegrations(),
      toggleProfiling: () => this.toggleProfiling(),
      getStatus: () => ({
        debugEnabled: this.debugEnabled,
        profilingActive: this.profilingActive,
        errorCount: this.errorHistory.length,
        sessionId: sentryAdvancedDebugger.getSessionId()
      })
    }

    this.logToDebugConsole('🌍 Global debug API exposed: window.SentryDebug')
  }
}

// Export singleton instance
export const sentryDebugUtilities = SentryDebugUtilities.getInstance()

// Initialize debug utilities if in development
if (process.env.NODE_ENV === 'development') {
  sentryDebugUtilities.exposeGlobalDebugAPI()
  sentryDebugUtilities.startPerformanceMonitoring()
  sentryDebugUtilities.enableRealTimeMonitoring()
}

// Export utility functions
export const debugUtils = {
  log: (message: string) => sentryDebugUtilities,
  toggleConsole: () => sentryDebugUtilities.toggleDebugConsole(),
  generateReport: () => sentryDebugUtilities.generateDebugReport(),
  testError: () => sentryDebugUtilities.triggerTestError(),
  testAPI: () => sentryDebugUtilities.testAPIEndpoints(),
  testIntegrations: () => sentryDebugUtilities.testSentryIntegrations()
}