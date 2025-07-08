/**
 * Comprehensive Sentry debugging for mobile-specific issues
 * This module provides detailed mobile error tracking, performance monitoring,
 * and user context for debugging mobile web UI problems.
 */

import * as Sentry from '@sentry/nextjs';

interface MobileContext {
  isMobile: boolean;
  isTablet: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  viewportWidth: number;
  viewportHeight: number;
  hasNotch: boolean;
  memoryInfo?: any;
}

interface TouchEventContext {
  type: 'tap' | 'swipe' | 'pinch' | 'long-press' | 'scroll';
  target: string;
  coordinates: { x: number; y: number };
  force?: number;
  touchCount: number;
  timestamp: number;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  touchLatency: number;
  scrollPerformance: 'smooth' | 'janky';
}

class MobileSentryDebugger {
  private performanceObserver?: PerformanceObserver;
  private touchLatencyStart: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = performance.now();
  private fpsHistory: number[] = [];

  constructor() {
    this.initializeMobileContext();
    this.setupPerformanceMonitoring();
    this.setupTouchEventTracking();
    this.setupViewportTracking();
    this.setupErrorBoundaryTracking();
  }

  /**
   * Initialize comprehensive mobile device context
   */
  private initializeMobileContext(): void {
    if (typeof window === 'undefined') return;

    try {
      const context = this.getMobileContext();
      
      Sentry.setContext('mobile_device', {
        ...context,
        initialized_at: new Date().toISOString(),
        browser_features: {
          touch_support: 'ontouchstart' in window,
          pointer_events: !!window.PointerEvent,
          orientation_api: !!window.screen?.orientation,
          visual_viewport: !!window.visualViewport,
          safe_area_support: CSS.supports('padding: env(safe-area-inset-top)'),
          css_grid_support: CSS.supports('display: grid'),
          css_flex_support: CSS.supports('display: flex'),
          modern_viewport_units: CSS.supports('height: 100dvh')
        }
      });

      // Set user context for mobile debugging
      Sentry.setUser({
        id: this.generateDeviceFingerprint(),
        device_type: context.isMobile ? 'mobile' : context.isTablet ? 'tablet' : 'desktop',
        browser: this.getBrowserName(),
        screen_resolution: `${context.screenWidth}x${context.screenHeight}`,
        viewport_size: `${context.viewportWidth}x${context.viewportHeight}`
      });

      // Track initial mobile metrics
      this.trackMobileMetric('mobile_session_start', {
        device_context: context,
        performance_baseline: this.getPerformanceBaseline()
      });

    } catch (error) {
      console.error('Failed to initialize mobile Sentry context:', error);
      Sentry.captureException(error, {
        tags: { 
          component: 'mobile_debugger',
          phase: 'initialization'
        }
      });
    }
  }

  /**
   * Get comprehensive mobile device context
   */
  private getMobileContext(): MobileContext {
    const screenWidth = window.screen?.width || window.innerWidth;
    const screenHeight = window.screen?.height || window.innerHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();

    return {
      isMobile: viewportWidth < 768,
      isTablet: viewportWidth >= 768 && viewportWidth < 1024,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      orientation: viewportWidth > viewportHeight ? 'landscape' : 'portrait',
      screenWidth,
      screenHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      userAgent: navigator.userAgent,
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
      isChrome: /chrome/.test(userAgent),
      viewportWidth,
      viewportHeight,
      hasNotch: this.detectNotch(),
      memoryInfo: (navigator as any).deviceMemory ? {
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency
      } : undefined
    };
  }

  /**
   * Detect if device has a notch/safe area
   */
  private detectNotch(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for safe area environment variables
    if (CSS.supports('padding: env(safe-area-inset-top)')) {
      const testElement = document.createElement('div');
      testElement.style.paddingTop = 'env(safe-area-inset-top)';
      document.body.appendChild(testElement);
      const hasNotch = window.getComputedStyle(testElement).paddingTop !== '0px';
      document.body.removeChild(testElement);
      return hasNotch;
    }
    
    return false;
  }

  /**
   * Setup performance monitoring for mobile-specific metrics
   */
  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor FPS
    this.monitorFPS();

    // Monitor paint metrics
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            this.trackMobileMetric('paint_timing', {
              type: entry.name,
              duration: entry.startTime,
              timestamp: Date.now()
            });
          } else if (entry.entryType === 'layout-shift') {
            this.trackMobileMetric('layout_shift', {
              value: (entry as any).value,
              sources: (entry as any).sources?.length || 0,
              timestamp: Date.now()
            });
          }
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance observer not fully supported:', error);
      }
    }

    // Monitor memory usage (if available)
    if ((performance as any).memory) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.trackMobileMetric('memory_usage', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
          timestamp: Date.now()
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Monitor FPS for mobile performance
   */
  private monitorFPS(): void {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      if (delta > 0) {
        const fps = 1000 / delta;
        this.fpsHistory.push(fps);
        
        // Keep only last 60 frames
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }
        
        // Report low FPS issues
        if (fps < 30 && this.fpsHistory.length > 10) {
          const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
          if (avgFPS < 30) {
            this.trackMobileMetric('low_fps_detected', {
              current_fps: fps,
              average_fps: avgFPS,
              mobile_context: this.getMobileContext(),
              timestamp: Date.now()
            });
          }
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  /**
   * Setup touch event tracking for debugging
   */
  private setupTouchEventTracking(): void {
    if (typeof window === 'undefined') return;

    // Track touch start for latency measurement
    document.addEventListener('touchstart', (event) => {
      this.touchLatencyStart = performance.now();
      
      this.trackTouchEvent({
        type: 'tap',
        target: this.getElementSelector(event.target as Element),
        coordinates: {
          x: event.touches[0]?.clientX || 0,
          y: event.touches[0]?.clientY || 0
        },
        force: (event.touches[0] as any)?.force,
        touchCount: event.touches.length,
        timestamp: Date.now()
      });
    }, { passive: true });

    // Track touch end for latency
    document.addEventListener('touchend', () => {
      const latency = performance.now() - this.touchLatencyStart;
      if (latency > 100) { // Report slow touch responses
        this.trackMobileMetric('slow_touch_response', {
          latency,
          mobile_context: this.getMobileContext(),
          timestamp: Date.now()
        });
      }
    }, { passive: true });

    // Track scroll performance
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    
    document.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        const scrollStart = performance.now();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollDuration = performance.now() - scrollStart;
          isScrolling = false;
          
          this.trackMobileMetric('scroll_performance', {
            duration: scrollDuration,
            mobile_context: this.getMobileContext(),
            timestamp: Date.now()
          });
        }, 150);
      }
    }, { passive: true });
  }

  /**
   * Setup viewport change tracking
   */
  private setupViewportTracking(): void {
    if (typeof window === 'undefined') return;

    let resizeTimeout: NodeJS.Timeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const context = this.getMobileContext();
        
        this.trackMobileMetric('viewport_change', {
          new_dimensions: {
            width: context.viewportWidth,
            height: context.viewportHeight
          },
          orientation: context.orientation,
          mobile_context: context,
          timestamp: Date.now()
        });

        // Update Sentry context
        Sentry.setContext('mobile_device', context);
      }, 250);
    });

    // Track orientation changes specifically
    window.addEventListener('orientationchange', () => {
      setTimeout(() => { // Wait for orientation to settle
        const context = this.getMobileContext();
        
        this.trackMobileMetric('orientation_change', {
          new_orientation: context.orientation,
          new_dimensions: {
            width: context.viewportWidth,
            height: context.viewportHeight
          },
          mobile_context: context,
          timestamp: Date.now()
        });
      }, 500);
    });
  }

  /**
   * Setup error boundary tracking for mobile-specific errors
   */
  private setupErrorBoundaryTracking(): void {
    // Track uncaught errors with mobile context
    window.addEventListener('error', (event) => {
      this.trackMobileError(event.error || new Error(event.message), {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        mobile_context: this.getMobileContext()
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackMobileError(event.reason, {
        type: 'unhandled_promise_rejection',
        mobile_context: this.getMobileContext()
      });
    });
  }

  /**
   * Track mobile-specific metrics
   */
  public trackMobileMetric(eventName: string, data: Record<string, any>): void {
    Sentry.addBreadcrumb({
      category: 'mobile.metric',
      message: eventName,
      level: 'info',
      data: {
        ...data,
        mobile_context: this.getMobileContext(),
        timestamp: Date.now()
      }
    });

    // For critical performance issues, create events
    if (eventName.includes('low_fps') || eventName.includes('slow_touch') || eventName.includes('memory_pressure')) {
      Sentry.captureMessage(`Mobile Performance Issue: ${eventName}`, {
        level: 'warning',
        tags: {
          category: 'mobile_performance',
          metric: eventName,
          device_type: this.getMobileContext().isMobile ? 'mobile' : 'tablet'
        },
        extra: data
      });
    }
  }

  /**
   * Track touch events for debugging interactions
   */
  public trackTouchEvent(touchContext: TouchEventContext): void {
    Sentry.addBreadcrumb({
      category: 'mobile.touch',
      message: `Touch ${touchContext.type} on ${touchContext.target}`,
      level: 'info',
      data: touchContext
    });
  }

  /**
   * Track mobile-specific errors with enhanced context
   */
  public trackMobileError(error: Error, context: Record<string, any> = {}): void {
    Sentry.captureException(error, {
      tags: {
        category: 'mobile_error',
        device_type: this.getMobileContext().isMobile ? 'mobile' : 'tablet',
        browser: this.getBrowserName()
      },
      contexts: {
        mobile_error_context: {
          ...context,
          mobile_device: this.getMobileContext(),
          performance_metrics: this.getPerformanceBaseline(),
          timestamp: Date.now()
        }
      }
    });
  }

  /**
   * Track mobile UI component errors
   */
  public trackComponentError(componentName: string, error: Error, props?: any): void {
    this.trackMobileError(error, {
      type: 'component_error',
      component: componentName,
      props: props ? JSON.stringify(props) : undefined,
      mobile_context: this.getMobileContext()
    });
  }

  /**
   * Track mobile gesture failures
   */
  public trackGestureFailure(gestureType: string, details: Record<string, any>): void {
    this.trackMobileMetric('gesture_failure', {
      gesture_type: gestureType,
      ...details,
      mobile_context: this.getMobileContext()
    });
  }

  /**
   * Get element selector for debugging
   */
  private getElementSelector(element: Element): string {
    if (!element) return 'unknown';
    
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const tagName = element.tagName.toLowerCase();
    
    return `${tagName}${id}${className}`.substring(0, 100); // Limit length
  }

  /**
   * Generate device fingerprint for tracking
   */
  private generateDeviceFingerprint(): string {
    const context = this.getMobileContext();
    const components = [
      context.userAgent,
      context.screenWidth.toString(),
      context.screenHeight.toString(),
      context.devicePixelRatio.toString(),
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ];
    
    return btoa(components.join('|')).substring(0, 16);
  }

  /**
   * Get browser name for debugging
   */
  private getBrowserName(): string {
    const context = this.getMobileContext();
    if (context.isSafari) return 'Safari';
    if (context.isChrome) return 'Chrome';
    if (context.userAgent.includes('firefox')) return 'Firefox';
    if (context.userAgent.includes('edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Get performance baseline metrics
   */
  private getPerformanceBaseline(): Record<string, any> {
    const timing = performance.timing;
    const navigation = performance.navigation;
    
    return {
      page_load_time: timing.loadEventEnd - timing.navigationStart,
      dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart,
      first_paint: performance.getEntriesByType('paint')[0]?.startTime,
      navigation_type: navigation.type,
      redirect_count: navigation.redirectCount,
      memory_info: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize
      } : undefined
    };
  }

  /**
   * Cleanup method
   */
  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// Create singleton instance
let mobileSentryDebugger: MobileSentryDebugger | null = null;

/**
 * Initialize mobile Sentry debugging
 */
export function initializeMobileSentryDebugger(): MobileSentryDebugger {
  if (!mobileSentryDebugger) {
    mobileSentryDebugger = new MobileSentryDebugger();
  }
  return mobileSentryDebugger;
}

/**
 * Get mobile debugger instance
 */
export function getMobileSentryDebugger(): MobileSentryDebugger | null {
  return mobileSentryDebugger;
}

/**
 * Cleanup mobile debugger
 */
export function cleanupMobileSentryDebugger(): void {
  if (mobileSentryDebugger) {
    mobileSentryDebugger.cleanup();
    mobileSentryDebugger = null;
  }
}

// Export the debugger class for direct use
export { MobileSentryDebugger };