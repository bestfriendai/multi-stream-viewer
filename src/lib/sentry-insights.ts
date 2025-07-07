import * as Sentry from "@sentry/nextjs";

/**
 * Advanced Sentry Insights and Debugging Utilities
 * Provides comprehensive monitoring, debugging, and analytics capabilities
 */

// User Journey Tracking
export class UserJourneyTracker {
  private static instance: UserJourneyTracker;
  private sessionId: string;
  private journeyStartTime: number;
  private actions: Array<{
    action: string;
    timestamp: number;
    context: any;
  }> = [];

  constructor() {
    this.sessionId = Math.random().toString(36).substring(7);
    this.journeyStartTime = Date.now();
    
    // Set session context in Sentry
    Sentry.setTag('session.id', this.sessionId);
    Sentry.setContext('user_journey', {
      sessionId: this.sessionId,
      startTime: new Date(this.journeyStartTime).toISOString(),
    });
  }

  static getInstance(): UserJourneyTracker {
    if (!UserJourneyTracker.instance) {
      UserJourneyTracker.instance = new UserJourneyTracker();
    }
    return UserJourneyTracker.instance;
  }

  trackAction(action: string, context?: any) {
    const timestamp = Date.now();
    const actionData = {
      action,
      timestamp,
      context: context || {},
      sessionDuration: timestamp - this.journeyStartTime,
    };

    this.actions.push(actionData);

    // Send to Sentry
    Sentry.addBreadcrumb({
      message: `User Action: ${action}`,
      category: 'user.journey',
      level: 'info',
      data: actionData,
    });

    // Update context
    Sentry.setContext('user_journey', {
      sessionId: this.sessionId,
      startTime: new Date(this.journeyStartTime).toISOString(),
      actionCount: this.actions.length,
      lastAction: action,
      sessionDuration: timestamp - this.journeyStartTime,
    });
  }

  getJourneyData() {
    return {
      sessionId: this.sessionId,
      startTime: this.journeyStartTime,
      actions: this.actions,
      duration: Date.now() - this.journeyStartTime,
    };
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();
  private static observers: Map<string, PerformanceObserver> = new Map();

  static startMeasurement(name: string): () => void {
    const startTime = performance.now();
    this.measurements.set(name, startTime);

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Send to Sentry
      Sentry.setMeasurement(`custom.${name}`, duration, 'millisecond');
      
      // Add breadcrumb for context
      Sentry.addBreadcrumb({
        message: `Performance: ${name} completed in ${duration.toFixed(2)}ms`,
        category: 'performance',
        level: 'info',
        data: { duration, name },
      });

      this.measurements.delete(name);
    };
  }

  static trackWebVital(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    Sentry.setMeasurement(`web_vital.${name}`, value, 'millisecond');
    Sentry.setTag(`web_vital.${name}.rating`, rating);
    
    if (rating === 'poor') {
      Sentry.captureMessage(`Poor Web Vital: ${name}`, {
        level: 'warning',
        tags: {
          'performance.web_vital': name,
          'performance.rating': rating,
        },
        extra: { value, name, rating },
      });
    }
  }

  static observeResources() {
    if (typeof window === 'undefined') return;

    // Resource timing observer
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources
          if (resource.duration > 1000) {
            Sentry.addBreadcrumb({
              message: `Slow Resource: ${resource.name}`,
              category: 'performance.resource',
              level: 'warning',
              data: {
                url: resource.name,
                duration: resource.duration,
                size: resource.transferSize,
              },
            });
          }
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }
}

// Stream Monitoring
export class StreamMonitor {
  static trackStreamLoad(streamId: string, platform: string, startTime: number) {
    const duration = Date.now() - startTime;
    
    Sentry.setMeasurement(`stream.load.${platform}`, duration, 'millisecond');
    
    Sentry.addBreadcrumb({
      message: `Stream loaded: ${platform}/${streamId}`,
      category: 'stream.lifecycle',
      level: 'info',
      data: {
        streamId,
        platform,
        loadTime: duration,
      },
    });

    // Track slow loads
    if (duration > 3000) {
      Sentry.captureMessage('Slow Stream Load', {
        level: 'warning',
        tags: {
          'stream.platform': platform,
          'stream.performance': 'slow',
        },
        extra: { streamId, platform, loadTime: duration },
      });
    }
  }

  static trackStreamError(streamId: string, platform: string, error: Error) {
    Sentry.captureException(error, {
      tags: {
        'stream.id': streamId,
        'stream.platform': platform,
        'error.type': 'stream_error',
      },
      extra: {
        streamId,
        platform,
        timestamp: new Date().toISOString(),
      },
      fingerprint: ['stream-error', platform, error.name],
    });
  }

  static trackStreamInteraction(streamId: string, platform: string, action: string) {
    const journey = UserJourneyTracker.getInstance();
    journey.trackAction(`stream.${action}`, { streamId, platform });
    
    Sentry.setTag('stream.last_interaction', action);
    Sentry.setTag('stream.last_platform', platform);
  }
}

// Error Context Manager
export class ErrorContextManager {
  private static context: Map<string, any> = new Map();

  static setGlobalContext(key: string, value: any) {
    this.context.set(key, value);
    Sentry.setContext(key, value);
  }

  static addFeatureFlag(flagName: string, value: boolean | string) {
    Sentry.setTag(`feature.${flagName}`, value.toString());
    
    const flags = this.context.get('feature_flags') || {};
    flags[flagName] = value;
    this.setGlobalContext('feature_flags', flags);
  }

  static addExperiment(experimentName: string, variant: string) {
    Sentry.setTag(`experiment.${experimentName}`, variant);
    
    const experiments = this.context.get('experiments') || {};
    experiments[experimentName] = variant;
    this.setGlobalContext('experiments', experiments);
  }

  static setUserSubscription(subscription: {
    tier: string;
    status: string;
    streamLimit: number;
    features: string[];
  }) {
    Sentry.setTag('user.subscription.tier', subscription.tier);
    Sentry.setTag('user.subscription.status', subscription.status);
    Sentry.setTag('user.stream_limit', subscription.streamLimit.toString());
    
    this.setGlobalContext('subscription', subscription);
  }
}

// Real-time Debugging
export class RealtimeDebugger {
  private static isEnabled = process.env.NODE_ENV === 'development';
  private static logs: Array<{ timestamp: number; level: string; message: string; data?: any }> = [];

  static enable() {
    this.isEnabled = true;
  }

  static disable() {
    this.isEnabled = false;
  }

  static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    if (!this.isEnabled) return;

    const logEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Send to Sentry based on level
    if (level === 'error') {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: data,
      });
    } else if (level === 'warn') {
      Sentry.addBreadcrumb({
        message,
        category: 'debug',
        level: 'warning',
        data,
      });
    } else {
      Sentry.addBreadcrumb({
        message,
        category: 'debug',
        level: 'info',
        data,
      });
    }

    console.log(`[Sentry Debug] ${level.toUpperCase()}: ${message}`, data);
  }

  static getLogs() {
    return this.logs;
  }

  static exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      logs: this.logs,
      context: Array.from(ErrorContextManager['context'].entries()),
    };
  }
}

// Initialize monitoring
export function initializeSentryInsights() {
  if (typeof window !== 'undefined') {
    // Initialize performance monitoring
    PerformanceMonitor.observeResources();
    
    // Initialize user journey tracking
    UserJourneyTracker.getInstance();
    
    // Set initial context
    ErrorContextManager.setGlobalContext('app_info', {
      name: 'multi-stream-viewer',
      version: process.env.npm_package_version || 'unknown',
      buildTime: new Date().toISOString(),
    });

    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      const isVisible = !document.hidden;
      Sentry.addBreadcrumb({
        message: `Page ${isVisible ? 'visible' : 'hidden'}`,
        category: 'navigation',
        level: 'info',
        data: { visible: isVisible },
      });
    });

    // Monitor network status
    window.addEventListener('online', () => {
      Sentry.addBreadcrumb({
        message: 'Network online',
        category: 'network',
        level: 'info',
      });
    });

    window.addEventListener('offline', () => {
      Sentry.addBreadcrumb({
        message: 'Network offline',
        category: 'network',
        level: 'warning',
      });
    });

    console.log('🔍 Sentry Insights initialized with comprehensive monitoring');
  }
}

// All utilities are already exported above, no need for duplicate exports