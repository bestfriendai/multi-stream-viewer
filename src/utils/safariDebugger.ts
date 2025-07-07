'use client'

/**
 * Safari Mobile Debugging Utilities
 * Comprehensive debugging tools for Safari mobile reloading and crash issues
 */

// Memory monitoring utilities
export class SafariMemoryMonitor {
  private static instance: SafariMemoryMonitor
  private memoryCheckInterval: NodeJS.Timeout | null = null
  private performanceObserver: PerformanceObserver | null = null
  private memoryWarningThreshold = 50 * 1024 * 1024 // 50MB
  private isMonitoring = false

  static getInstance(): SafariMemoryMonitor {
    if (!SafariMemoryMonitor.instance) {
      SafariMemoryMonitor.instance = new SafariMemoryMonitor()
    }
    return SafariMemoryMonitor.instance
  }

  startMonitoring() {
    if (this.isMonitoring) return
    this.isMonitoring = true

    // Monitor memory usage every 5 seconds
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryUsage()
    }, 5000)

    // Monitor performance entries
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
            console.log(`[Safari Debug] Performance entry:`, entry)
          }
        })
      })
      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] })
    }

    console.log('[Safari Debug] Memory monitoring started')
  }

  stopMonitoring() {
    if (!this.isMonitoring) return
    this.isMonitoring = false

    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval)
      this.memoryCheckInterval = null
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
      this.performanceObserver = null
    }

    console.log('[Safari Debug] Memory monitoring stopped')
  }

  private checkMemoryUsage() {
    // Check if memory API is available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMemory = memory.usedJSHeapSize
      const totalMemory = memory.totalJSHeapSize
      const memoryLimit = memory.jsHeapSizeLimit

      console.log(`[Safari Debug] Memory usage: ${(usedMemory / 1024 / 1024).toFixed(2)}MB / ${(totalMemory / 1024 / 1024).toFixed(2)}MB (Limit: ${(memoryLimit / 1024 / 1024).toFixed(2)}MB)`)

      // Warn if memory usage is high
      if (usedMemory > this.memoryWarningThreshold) {
        console.warn(`[Safari Debug] High memory usage detected: ${(usedMemory / 1024 / 1024).toFixed(2)}MB`)
        this.triggerMemoryCleanup()
      }
    }

    // Check DOM node count
    const nodeCount = document.querySelectorAll('*').length
    if (nodeCount > 5000) {
      console.warn(`[Safari Debug] High DOM node count: ${nodeCount}`)
    }
  }

  private triggerMemoryCleanup() {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc()
    }

    // Clean up unused event listeners
    this.cleanupEventListeners()

    // Dispatch custom event for app-level cleanup
    window.dispatchEvent(new CustomEvent('safari-memory-warning', {
      detail: { timestamp: Date.now() }
    }))
  }

  private cleanupEventListeners() {
    // Remove any orphaned event listeners
    const elements = document.querySelectorAll('[data-cleanup-listeners]')
    elements.forEach(element => {
      const clone = element.cloneNode(true)
      element.parentNode?.replaceChild(clone, element)
    })
  }
}

// Safari-specific error tracking
export class SafariErrorTracker {
  private static instance: SafariErrorTracker
  private errors: Array<{ error: Error; timestamp: number; userAgent: string }> = []
  private maxErrors = 50

  static getInstance(): SafariErrorTracker {
    if (!SafariErrorTracker.instance) {
      SafariErrorTracker.instance = new SafariErrorTracker()
    }
    return SafariErrorTracker.instance
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), event.filename, event.lineno)
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`))
    })

    // Page visibility change handler (Safari often reloads on visibility change)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[Safari Debug] Page became visible - checking for reload')
        this.checkForReload()
      }
    })

    console.log('[Safari Debug] Error tracking initialized')
  }

  private trackError(error: Error, filename?: string, lineno?: number) {
    const errorInfo = {
      error,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      filename,
      lineno,
      url: window.location.href,
      memory: this.getMemoryInfo()
    }

    this.errors.push(errorInfo)

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    console.error('[Safari Debug] Error tracked:', errorInfo)

    // Check if this might cause a reload
    if (this.isReloadTriggeringError(error)) {
      console.warn('[Safari Debug] Error might trigger page reload!')
      this.preventReload()
    }
  }

  private isReloadTriggeringError(error: Error): boolean {
    const reloadTriggers = [
      'out of memory',
      'maximum call stack',
      'script error',
      'network error',
      'webgl context lost'
    ]

    return reloadTriggers.some(trigger => 
      error.message.toLowerCase().includes(trigger)
    )
  }

  private preventReload() {
    // Try to prevent automatic reload by cleaning up resources
    SafariMemoryMonitor.getInstance().triggerMemoryCleanup()
    
    // Clear any intervals that might be causing issues
    const highestId = setTimeout(() => {}, 0)
    for (let i = 0; i < highestId; i++) {
      clearTimeout(i)
      clearInterval(i)
    }
  }

  private checkForReload() {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0]
      if (entry.type === 'reload') {
        console.warn('[Safari Debug] Page was reloaded! Type:', entry.type)
        this.logReloadCause()
      }
    }
  }

  private logReloadCause() {
    console.log('[Safari Debug] Recent errors before reload:', this.errors.slice(-5))
    console.log('[Safari Debug] Memory info:', this.getMemoryInfo())
    console.log('[Safari Debug] DOM nodes:', document.querySelectorAll('*').length)
  }

  private getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  }

  getErrorReport() {
    return {
      errors: this.errors,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      memory: this.getMemoryInfo()
    }
  }
}

// Safari-specific performance optimizations
export class SafariOptimizer {
  static optimizeForSafari() {
    // Disable smooth scrolling on Safari mobile (can cause memory issues)
    if (this.isSafariMobile()) {
      document.documentElement.style.scrollBehavior = 'auto'
    }

    // Optimize touch events
    this.optimizeTouchEvents()

    // Optimize animations
    this.optimizeAnimations()

    // Set up memory cleanup
    this.setupMemoryCleanup()

    console.log('[Safari Debug] Safari optimizations applied')
  }

  private static isSafariMobile(): boolean {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && 
           /Safari/.test(navigator.userAgent) && 
           !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
  }

  private static optimizeTouchEvents() {
    // Use passive listeners for better performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel']
    
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true })
    })
  }

  private static optimizeAnimations() {
    // Reduce motion if user prefers it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0s')
      document.documentElement.style.setProperty('--transition-duration', '0s')
    }
  }

  private static setupMemoryCleanup() {
    // Clean up on page hide
    document.addEventListener('pagehide', () => {
      SafariMemoryMonitor.getInstance().triggerMemoryCleanup()
    })

    // Clean up on low memory warning
    window.addEventListener('safari-memory-warning', () => {
      // Remove non-essential DOM elements
      const nonEssential = document.querySelectorAll('[data-non-essential]')
      nonEssential.forEach(el => el.remove())

      // Clear caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('non-essential')) {
              caches.delete(name)
            }
          })
        })
      }
    })
  }
}

// Main debugging function
export function initSafariDebugger() {
  if (typeof window === 'undefined') return

  console.log('[Safari Debug] Initializing Safari debugger...')

  // Initialize components
  const memoryMonitor = SafariMemoryMonitor.getInstance()
  const errorTracker = SafariErrorTracker.getInstance()

  // Start monitoring
  memoryMonitor.startMonitoring()
  errorTracker.init()

  // Apply optimizations
  SafariOptimizer.optimizeForSafari()

  // Add debug info to window for manual inspection
  ;(window as any).safariDebug = {
    memoryMonitor,
    errorTracker,
    getReport: () => ({
      memory: memoryMonitor,
      errors: errorTracker.getErrorReport(),
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    })
  }

  console.log('[Safari Debug] Safari debugger initialized. Use window.safariDebug for manual inspection.')
}

// Cleanup function
export function cleanupSafariDebugger() {
  const memoryMonitor = SafariMemoryMonitor.getInstance()
  memoryMonitor.stopMonitoring()
  
  delete (window as any).safariDebug
  console.log('[Safari Debug] Safari debugger cleaned up')
}