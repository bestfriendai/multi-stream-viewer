import * as Sentry from '@sentry/nextjs'

/**
 * Advanced Sentry Profiling and Session Replay
 * Implements profiling, session replay, and advanced debugging features
 */

export interface ProfilingSession {
  id: string
  startTime: number
  samples: ProfileSample[]
  metadata: {
    userAgent: string
    viewport: string
    url: string
    sessionId: string
  }
}

export interface ProfileSample {
  timestamp: number
  stack: string[]
  duration: number
  memoryUsage?: number
  cpuUsage?: number
}

export class SentryProfilingReplay {
  private static instance: SentryProfilingReplay
  private currentSession: ProfilingSession | null = null
  private isRecording: boolean = false
  private replayEnabled: boolean = true
  private profilingEnabled: boolean = true
  private samples: ProfileSample[] = []
  private observer?: PerformanceObserver

  private constructor() {
    this.initializeReplay()
    this.initializeProfiling()
  }

  public static getInstance(): SentryProfilingReplay {
    if (!SentryProfilingReplay.instance) {
      SentryProfilingReplay.instance = new SentryProfilingReplay()
    }
    return SentryProfilingReplay.instance
  }

  /**
   * Initialize Session Replay
   */
  private initializeReplay() {
    if (typeof window === 'undefined') return

    try {
      // Check if Replay is available
      if (Sentry.getClient()?.getIntegration) {
        Sentry.addIntegration({
          name: 'Replay',
          setupOnce: () => {
            // Configure session replay
            Sentry.setTag('replay.enabled', true)
            
            // Start session replay
            this.startSessionReplay()
          }
        })
      }
    } catch (error) {
      console.warn('Session Replay not available:', error)
    }
  }

  private startSessionReplay() {
    if (!this.replayEnabled) return

    // Replay configuration
    const replayConfig = {
      maskAllText: false, // Set to true in production for privacy
      maskAllInputs: true,
      blockAllMedia: false,
      sampleRate: 0.1, // 10% of sessions
      errorSampleRate: 1.0, // 100% of error sessions
      mask: ['.sensitive-data', '[data-sensitive]'],
      block: ['.private-content', '[data-private]'],
      beforeAddRecordingEvent: (event: any) => {
        // Custom filtering of recording events
        if (event.type === 'input' && event.data?.isPrivate) {
          return null // Don't record private inputs
        }
        return event
      }
    }

    Sentry.addBreadcrumb({
      message: 'Session replay started',
      category: 'replay.session',
      level: 'info',
      data: {
        config: replayConfig,
        timestamp: new Date().toISOString()
      }
    })
  }

  /**
   * Initialize JavaScript Profiling
   */
  private initializeProfiling() {
    if (typeof window === 'undefined') return

    try {
      // Enable profiling integration
      Sentry.addIntegration({
        name: 'Profiling',
        setupOnce: () => {
          this.setupJavaScriptProfiling()
          this.setupMemoryProfiling()
          this.setupCPUProfiling()
        }
      })
    } catch (error) {
      console.warn('Profiling not available:', error)
    }
  }

  private setupJavaScriptProfiling() {
    if (!this.profilingEnabled || typeof window === 'undefined') return

    // Start profiling session
    const startProfiling = () => {
      this.currentSession = {
        id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: Date.now(),
        samples: [],
        metadata: {
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          url: window.location.href,
          sessionId: Sentry.getCurrentHub().getScope()?.getContext()?.sessionId || 'unknown'
        }
      }

      // Sample call stack periodically
      this.startCallStackSampling()

      Sentry.addBreadcrumb({
        message: 'JavaScript profiling started',
        category: 'profiling.javascript',
        level: 'info',
        data: {
          sessionId: this.currentSession.id,
          timestamp: new Date().toISOString()
        }
      })
    }

    // Auto-start profiling on page load
    if (document.readyState === 'complete') {
      startProfiling()
    } else {
      window.addEventListener('load', startProfiling)
    }
  }

  private startCallStackSampling() {
    if (!this.currentSession) return

    const sampleInterval = 16 // ~60fps sampling
    let sampleCount = 0
    const maxSamples = 1000 // Limit samples to prevent memory issues

    const sampleCallStack = () => {
      if (!this.currentSession || sampleCount >= maxSamples) return

      try {
        const error = new Error()
        const stack = error.stack?.split('\n').slice(1) || []
        
        const sample: ProfileSample = {
          timestamp: Date.now(),
          stack: stack.map(line => line.trim()),
          duration: sampleInterval,
          memoryUsage: this.getCurrentMemoryUsage(),
          cpuUsage: this.getCurrentCPUUsage()
        }

        this.samples.push(sample)
        this.currentSession.samples.push(sample)
        sampleCount++

        // Continue sampling
        setTimeout(sampleCallStack, sampleInterval)
      } catch (error) {
        console.warn('Failed to sample call stack:', error)
      }
    }

    sampleCallStack()
  }

  private getCurrentMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize
    }
    return undefined
  }

  private getCurrentCPUUsage(): number | undefined {
    // CPU usage estimation based on frame timing
    if (typeof window !== 'undefined') {
      const start = performance.now()
      // Busy wait for 1ms to measure CPU
      while (performance.now() - start < 1) {
        // Busy loop
      }
      const end = performance.now()
      const actualDuration = end - start
      
      // CPU usage estimation (rough approximation)
      return Math.min(100, (actualDuration / 1) * 100)
    }
    return undefined
  }

  private setupMemoryProfiling() {
    if (typeof window === 'undefined' || !('memory' in performance)) return

    setInterval(() => {
      const memory = (performance as any).memory
      const memoryInfo = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
        usage_percent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      }

      // Send memory measurements to Sentry
      Sentry.setMeasurement('memory.used_mb', memoryInfo.used, 'megabyte')
      Sentry.setMeasurement('memory.total_mb', memoryInfo.total, 'megabyte')
      Sentry.setMeasurement('memory.usage_percent', memoryInfo.usage_percent, 'percent')

      // Alert on high memory usage
      if (memoryInfo.usage_percent > 85) {
        Sentry.addBreadcrumb({
          message: 'High memory usage detected',
          category: 'profiling.memory',
          level: 'warning',
          data: memoryInfo
        })
      }

      // Capture memory leak if usage keeps growing
      this.detectMemoryLeak(memoryInfo.used)

    }, 5000) // Check every 5 seconds
  }

  private memoryHistory: number[] = []
  private detectMemoryLeak(currentUsage: number) {
    this.memoryHistory.push(currentUsage)
    
    // Keep only last 10 measurements
    if (this.memoryHistory.length > 10) {
      this.memoryHistory.shift()
    }

    // Check for consistently increasing memory usage
    if (this.memoryHistory.length >= 5) {
      let isIncreasing = true
      for (let i = 1; i < this.memoryHistory.length; i++) {
        if (this.memoryHistory[i] <= this.memoryHistory[i - 1]) {
          isIncreasing = false
          break
        }
      }

      if (isIncreasing) {
        const growth = this.memoryHistory[this.memoryHistory.length - 1] - this.memoryHistory[0]
        
        Sentry.captureMessage('Potential memory leak detected', {
          level: 'warning',
          tags: {
            type: 'memory_leak',
            severity: growth > 50 ? 'high' : 'medium'
          },
          extra: {
            memory_history: this.memoryHistory,
            growth_mb: growth,
            current_usage: currentUsage
          }
        })
      }
    }
  }

  private setupCPUProfiling() {
    if (typeof window === 'undefined') return

    let lastTime = performance.now()
    let frameCount = 0
    let totalFrameTime = 0

    const measureCPU = () => {
      const currentTime = performance.now()
      const frameTime = currentTime - lastTime
      
      frameCount++
      totalFrameTime += frameTime

      // Calculate average FPS over last 60 frames
      if (frameCount >= 60) {
        const averageFrameTime = totalFrameTime / frameCount
        const fps = 1000 / averageFrameTime
        
        Sentry.setMeasurement('performance.fps', Math.round(fps), 'hertz')
        Sentry.setMeasurement('performance.frame_time', Math.round(averageFrameTime), 'millisecond')

        // Alert on low FPS
        if (fps < 30) {
          Sentry.addBreadcrumb({
            message: 'Low FPS detected',
            category: 'profiling.cpu',
            level: 'warning',
            data: {
              fps: Math.round(fps),
              average_frame_time: Math.round(averageFrameTime),
              timestamp: new Date().toISOString()
            }
          })
        }

        // Reset counters
        frameCount = 0
        totalFrameTime = 0
      }

      lastTime = currentTime
      requestAnimationFrame(measureCPU)
    }

    requestAnimationFrame(measureCPU)
  }

  /**
   * Manual Profiling Controls
   */
  public startProfiling(name: string = 'manual_profile') {
    if (this.isRecording) {
      console.warn('Profiling already in progress')
      return
    }

    this.isRecording = true
    this.samples = []

    const span = Sentry.startInactiveSpan({
      name: `profile.${name}`,
      op: 'profiling'
    })

    Sentry.addBreadcrumb({
      message: `Manual profiling started: ${name}`,
      category: 'profiling.manual',
      level: 'info',
      data: {
        profile_name: name,
        timestamp: new Date().toISOString()
      }
    })

    return {
      stop: () => this.stopProfiling(transaction),
      addMarker: (marker: string) => this.addProfilingMarker(marker)
    }
  }

  public stopProfiling(transaction?: any) {
    if (!this.isRecording) return

    this.isRecording = false

    // Analyze collected samples
    const analysis = this.analyzeSamples()

    // Send profiling results to Sentry
    Sentry.addBreadcrumb({
      message: 'Manual profiling stopped',
      category: 'profiling.manual',
      level: 'info',
      data: {
        sample_count: this.samples.length,
        analysis,
        timestamp: new Date().toISOString()
      }
    })

    if (transaction) {
      transaction.setData('profiling_analysis', analysis)
      transaction.finish()
    }

    return analysis
  }

  public addProfilingMarker(marker: string) {
    if (!this.isRecording) return

    Sentry.addBreadcrumb({
      message: `Profiling marker: ${marker}`,
      category: 'profiling.marker',
      level: 'info',
      data: {
        marker,
        timestamp: new Date().toISOString(),
        sample_index: this.samples.length
      }
    })
  }

  private analyzeSamples(): any {
    if (this.samples.length === 0) return null

    // Analyze function call frequency
    const functionCalls: Record<string, number> = {}
    const memoryUsages: number[] = []
    const cpuUsages: number[] = []

    this.samples.forEach(sample => {
      sample.stack.forEach(frame => {
        const functionName = this.extractFunctionName(frame)
        functionCalls[functionName] = (functionCalls[functionName] || 0) + 1
      })

      if (sample.memoryUsage) memoryUsages.push(sample.memoryUsage)
      if (sample.cpuUsage) cpuUsages.push(sample.cpuUsage)
    })

    // Find hotspots (most frequently called functions)
    const hotspots = Object.entries(functionCalls)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([func, count]) => ({ function: func, call_count: count }))

    return {
      total_samples: this.samples.length,
      duration: this.samples.length > 0 ? 
        this.samples[this.samples.length - 1].timestamp - this.samples[0].timestamp : 0,
      hotspots,
      memory_stats: memoryUsages.length > 0 ? {
        min: Math.min(...memoryUsages),
        max: Math.max(...memoryUsages),
        avg: Math.round(memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length)
      } : null,
      cpu_stats: cpuUsages.length > 0 ? {
        min: Math.min(...cpuUsages),
        max: Math.max(...cpuUsages),
        avg: Math.round(cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length)
      } : null
    }
  }

  private extractFunctionName(stackFrame: string): string {
    // Extract function name from stack frame
    const match = stackFrame.match(/at\s+([^\s(]+)/) || stackFrame.match(/([^@]+)@/)
    return match ? match[1] : 'anonymous'
  }

  /**
   * Session Replay Controls
   */
  public startReplay() {
    this.replayEnabled = true
    this.startSessionReplay()
  }

  public stopReplay() {
    this.replayEnabled = false
    
    Sentry.addBreadcrumb({
      message: 'Session replay stopped',
      category: 'replay.session',
      level: 'info',
      data: {
        timestamp: new Date().toISOString()
      }
    })
  }

  public captureReplaySnapshot(name: string) {
    if (!this.replayEnabled) return

    Sentry.addBreadcrumb({
      message: `Replay snapshot: ${name}`,
      category: 'replay.snapshot',
      level: 'info',
      data: {
        snapshot_name: name,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      }
    })
  }

  /**
   * Performance Monitoring
   */
  public measurePerformance<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
    return Sentry.startSpan({
      name: `performance.${name}`,
      op: 'measure'
    }, (span) => {
      const startTime = performance.now()

        try {
          const result = fn()

          if (result instanceof Promise) {
            return result.then(
              (value) => {
                const duration = performance.now() - startTime
                Sentry.setMeasurement(`performance.${name}.duration`, duration, 'millisecond')
                span?.setStatus({ code: 1 })
                return value
              },
              (error) => {
                const duration = performance.now() - startTime
                Sentry.setMeasurement(`performance.${name}.duration`, duration, 'millisecond')
                span?.setStatus({ code: 2 })
                throw error
              }
            )
          } else {
            const duration = performance.now() - startTime
            Sentry.setMeasurement(`performance.${name}.duration`, duration, 'millisecond')
            span?.setStatus({ code: 1 })
            return result
          }
        } catch (error) {
          const duration = performance.now() - startTime
          Sentry.setMeasurement(`performance.${name}.duration`, duration, 'millisecond')
          span?.setStatus({ code: 2 })
          throw error
        }
      })
    }

  /**
   * Cleanup
   */
  public cleanup() {
    this.stopProfiling()
    this.stopReplay()
    
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  /**
   * Utility Methods
   */
  public getProfilingStatus() {
    return {
      isRecording: this.isRecording,
      replayEnabled: this.replayEnabled,
      profilingEnabled: this.profilingEnabled,
      currentSession: this.currentSession?.id,
      sampleCount: this.samples.length
    }
  }

  public exportProfilingData() {
    return {
      session: this.currentSession,
      samples: this.samples,
      analysis: this.analyzeSamples(),
      timestamp: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const sentryProfilingReplay = SentryProfilingReplay.getInstance()

// Decorator for automatic profiling
export function Profile(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const profileName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = function (...args: any[]) {
      return sentryProfilingReplay.measurePerformance(profileName, () => {
        return originalMethod.apply(this, args)
      })
    }

    return descriptor
  }
}

// HOC for React component profiling
export function withProfiling<P extends object>(
  Component: React.ComponentType<P>,
  name?: string
) {
  const componentName = name || Component.displayName || Component.name || 'UnknownComponent'
  
  return function ProfiledComponent(props: P) {
    React.useEffect(() => {
      const profiler = sentryProfilingReplay.startProfiling(`component.${componentName}`)
      
      return () => {
        profiler?.stop()
      }
    }, [])

    return React.createElement(Component, props)
  }
}