import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Attachments Implementation
 * Enhanced file attachment support for detailed debugging
 */

export interface AttachmentConfig {
  filename: string
  data: string | Uint8Array | ArrayBuffer
  contentType?: string
  description?: string
  metadata?: Record<string, any>
}

export interface DebugSnapshot {
  timestamp: string
  sessionId: string
  url: string
  viewport: string
  userAgent: string
  performance: any
  errors: any[]
  breadcrumbs: any[]
  customData: Record<string, any>
}

export class SentryAttachments {
  private static instance: SentryAttachments
  private attachmentQueue: AttachmentConfig[] = []
  private maxAttachmentSize = 20 * 1024 * 1024 // 20MB limit
  private maxQueueSize = 10

  private constructor() {}

  public static getInstance(): SentryAttachments {
    if (!SentryAttachments.instance) {
      SentryAttachments.instance = new SentryAttachments()
    }
    return SentryAttachments.instance
  }

  /**
   * Add attachment to current Sentry scope
   */
  public addAttachment(config: AttachmentConfig): void {
    try {
      // Validate attachment size
      const size = this.getDataSize(config.data)
      if (size > this.maxAttachmentSize) {
        console.warn(`Attachment '${config.filename}' too large (${Math.round(size / 1024 / 1024)}MB), skipping`)
        return
      }

      // Add to current scope
      Sentry.getCurrentScope().addAttachment({
        filename: config.filename,
        data: config.data,
        contentType: config.contentType || this.inferContentType(config.filename),
        attachmentType: 'event.attachment'
      })

      // Add to queue for tracking
      this.attachmentQueue.push(config)
      if (this.attachmentQueue.length > this.maxQueueSize) {
        this.attachmentQueue.shift() // Remove oldest
      }

      Sentry.addBreadcrumb({
        message: `Added attachment: ${config.filename}`,
        category: 'attachment.add',
        level: 'info',
        data: {
          filename: config.filename,
          size: size,
          contentType: config.contentType,
          description: config.description
        }
      })

    } catch (error) {
      console.error('Failed to add attachment:', error)
      Sentry.captureException(error)
    }
  }

  /**
   * Create and attach debug snapshot
   */
  public async attachDebugSnapshot(description: string = 'Debug snapshot'): Promise<void> {
    try {
      const snapshot = await this.createDebugSnapshot()
      const filename = `debug-snapshot-${Date.now()}.json`
      
      this.addAttachment({
        filename,
        data: JSON.stringify(snapshot, null, 2),
        contentType: 'application/json',
        description,
        metadata: {
          type: 'debug_snapshot',
          timestamp: snapshot.timestamp
        }
      })
    } catch (error) {
      console.error('Failed to create debug snapshot:', error)
    }
  }

  /**
   * Attach console logs
   */
  public attachConsoleLogs(logs: string[]): void {
    if (!logs.length) return

    const logContent = logs.join('\n')
    const filename = `console-logs-${Date.now()}.txt`
    
    this.addAttachment({
      filename,
      data: logContent,
      contentType: 'text/plain',
      description: 'Console logs captured during error',
      metadata: {
        type: 'console_logs',
        count: logs.length
      }
    })
  }

  /**
   * Attach performance data
   */
  public attachPerformanceData(): void {
    if (typeof window === 'undefined') return

    try {
      const performanceData = this.gatherPerformanceData()
      const filename = `performance-data-${Date.now()}.json`
      
      this.addAttachment({
        filename,
        data: JSON.stringify(performanceData, null, 2),
        contentType: 'application/json',
        description: 'Performance metrics and timing data',
        metadata: {
          type: 'performance_data',
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Failed to attach performance data:', error)
    }
  }

  /**
   * Attach network requests log
   */
  public attachNetworkLog(requests: any[]): void {
    if (!requests.length) return

    const filename = `network-requests-${Date.now()}.json`
    
    this.addAttachment({
      filename,
      data: JSON.stringify(requests, null, 2),
      contentType: 'application/json',
      description: 'Network requests made during session',
      metadata: {
        type: 'network_log',
        count: requests.length
      }
    })
  }

  /**
   * Attach error context data
   */
  public attachErrorContext(error: Error, context: any): void {
    try {
      const errorContext = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
      }

      const filename = `error-context-${Date.now()}.json`
      
      this.addAttachment({
        filename,
        data: JSON.stringify(errorContext, null, 2),
        contentType: 'application/json',
        description: `Error context for: ${error.message}`,
        metadata: {
          type: 'error_context',
          errorName: error.name
        }
      })
    } catch (attachError) {
      console.error('Failed to attach error context:', attachError)
    }
  }

  /**
   * Attach DOM snapshot (simplified)
   */
  public attachDOMSnapshot(): void {
    if (typeof window === 'undefined') return

    try {
      const domData = {
        title: document.title,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        activeElement: document.activeElement?.tagName || 'unknown',
        forms: Array.from(document.forms).map(form => ({
          id: form.id,
          name: form.name,
          action: form.action,
          method: form.method
        })),
        scripts: Array.from(document.scripts).map(script => ({
          src: script.src,
          type: script.type
        })),
        stylesheets: Array.from(document.styleSheets).map(sheet => ({
          href: sheet.href,
          media: sheet.media?.mediaText
        })),
        meta: Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content')
        }))
      }

      const filename = `dom-snapshot-${Date.now()}.json`
      
      this.addAttachment({
        filename,
        data: JSON.stringify(domData, null, 2),
        contentType: 'application/json',
        description: 'DOM structure snapshot',
        metadata: {
          type: 'dom_snapshot',
          elementCount: document.querySelectorAll('*').length
        }
      })
    } catch (error) {
      console.error('Failed to attach DOM snapshot:', error)
    }
  }

  /**
   * Attach stream state (app-specific)
   */
  public attachStreamState(): void {
    if (typeof window === 'undefined') return

    try {
      const streamElements = document.querySelectorAll('[data-stream-id]')
      const streamState = Array.from(streamElements).map(element => {
        const streamId = element.getAttribute('data-stream-id')
        const iframe = element.querySelector('iframe')
        
        return {
          streamId,
          visible: this.isElementVisible(element),
          dimensions: {
            width: element.clientWidth,
            height: element.clientHeight
          },
          iframe: iframe ? {
            src: iframe.src,
            loaded: iframe.complete
          } : null,
          position: element.getBoundingClientRect()
        }
      })

      if (streamState.length > 0) {
        const filename = `stream-state-${Date.now()}.json`
        
        this.addAttachment({
          filename,
          data: JSON.stringify(streamState, null, 2),
          contentType: 'application/json',
          description: 'Current stream state and layout',
          metadata: {
            type: 'stream_state',
            streamCount: streamState.length
          }
        })
      }
    } catch (error) {
      console.error('Failed to attach stream state:', error)
    }
  }

  /**
   * Attach user interaction log
   */
  public attachUserInteractionLog(interactions: any[]): void {
    if (!interactions.length) return

    const filename = `user-interactions-${Date.now()}.json`
    
    this.addAttachment({
      filename,
      data: JSON.stringify(interactions, null, 2),
      contentType: 'application/json',
      description: 'User interaction events leading to error',
      metadata: {
        type: 'user_interactions',
        count: interactions.length
      }
    })
  }

  /**
   * Create comprehensive debug snapshot
   */
  private async createDebugSnapshot(): Promise<DebugSnapshot> {
    const snapshot: DebugSnapshot = {
      timestamp: new Date().toISOString(),
      sessionId: Sentry.getCurrentHub().getScope()?.getContext('session')?.sessionId || 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      performance: this.gatherPerformanceData(),
      errors: this.getRecentErrors(),
      breadcrumbs: this.getBreadcrumbs(),
      customData: {}
    }

    // Add app-specific data
    if (typeof window !== 'undefined') {
      snapshot.customData.streams = document.querySelectorAll('[data-stream-id]').length
      snapshot.customData.modals = document.querySelectorAll('[role="dialog"]').length
      snapshot.customData.forms = document.forms.length
    }

    return snapshot
  }

  /**
   * Gather performance data
   */
  private gatherPerformanceData(): any {
    if (typeof window === 'undefined') return null

    const data: any = {}

    // Memory
    if ('memory' in performance) {
      const memory = (performance as any).memory
      data.memory = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }

    // Timing
    if (performance.timing) {
      const timing = performance.timing
      data.timing = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connect: timing.connectEnd - timing.connectStart,
        request: timing.responseEnd - timing.requestStart,
        domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart
      }
    }

    // Navigation
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      data.navigation = {
        type: navigation.type,
        redirectCount: navigation.redirectCount,
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize,
        decodedBodySize: navigation.decodedBodySize
      }
    }

    // Resources
    const resources = performance.getEntriesByType('resource')
    data.resources = {
      count: resources.length,
      totalSize: resources.reduce((sum: number, r: any) => sum + (r.transferSize || 0), 0),
      byType: resources.reduce((acc: any, r: any) => {
        acc[r.initiatorType] = (acc[r.initiatorType] || 0) + 1
        return acc
      }, {})
    }

    return data
  }

  /**
   * Get recent errors from Sentry scope
   */
  private getRecentErrors(): any[] {
    try {
      const scope = Sentry.getCurrentHub().getScope()
      return scope?.getBreadcrumbs?.()?.filter(b => b.level === 'error') || []
    } catch {
      return []
    }
  }

  /**
   * Get breadcrumbs from Sentry scope
   */
  private getBreadcrumbs(): any[] {
    try {
      const scope = Sentry.getCurrentHub().getScope()
      return scope?.getBreadcrumbs?.() || []
    } catch {
      return []
    }
  }

  /**
   * Check if element is visible
   */
  private isElementVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  }

  /**
   * Get data size in bytes
   */
  private getDataSize(data: string | Uint8Array | ArrayBuffer): number {
    if (typeof data === 'string') {
      return new Blob([data]).size
    } else if (data instanceof Uint8Array) {
      return data.byteLength
    } else if (data instanceof ArrayBuffer) {
      return data.byteLength
    }
    return 0
  }

  /**
   * Infer content type from filename
   */
  private inferContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    const types: Record<string, string> = {
      'json': 'application/json',
      'txt': 'text/plain',
      'log': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'xml': 'application/xml',
      'csv': 'text/csv',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'pdf': 'application/pdf'
    }

    return types[ext || ''] || 'application/octet-stream'
  }

  /**
   * Get attachment queue status
   */
  public getAttachmentStatus() {
    return {
      queueSize: this.attachmentQueue.length,
      maxQueueSize: this.maxQueueSize,
      maxAttachmentSize: this.maxAttachmentSize,
      recentAttachments: this.attachmentQueue.slice(-5)
    }
  }

  /**
   * Clear attachment queue
   */
  public clearAttachmentQueue(): void {
    this.attachmentQueue = []
  }
}

// Export singleton instance
export const sentryAttachments = SentryAttachments.getInstance()

// Utility functions for common attachment patterns
export const attachmentUtils = {
  /**
   * Auto-attach comprehensive debug data on error
   */
  attachFullDebugContext: async (error: Error, context?: any) => {
    await sentryAttachments.attachDebugSnapshot('Full debug context')
    sentryAttachments.attachErrorContext(error, context)
    sentryAttachments.attachPerformanceData()
    sentryAttachments.attachDOMSnapshot()
    sentryAttachments.attachStreamState()
  },

  /**
   * Attach minimal debug info for performance-sensitive scenarios
   */
  attachMinimalDebugInfo: (error: Error, context?: any) => {
    sentryAttachments.attachErrorContext(error, context)
  },

  /**
   * Attach stream-specific debug info
   */
  attachStreamDebugInfo: () => {
    sentryAttachments.attachStreamState()
    sentryAttachments.attachPerformanceData()
  },

  /**
   * Attach API debug info
   */
  attachAPIDebugInfo: (requests: any[]) => {
    sentryAttachments.attachNetworkLog(requests)
    sentryAttachments.attachPerformanceData()
  }
}