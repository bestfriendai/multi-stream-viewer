'use client'

import { useEffect, useCallback, useRef } from 'react';
import * as Sentry from "@sentry/nextjs";
import { useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from 'next/navigation';

interface SentryHookOptions {
  enablePerformanceTracking?: boolean;
  enableUserTracking?: boolean;
  enableNavigationTracking?: boolean;
}

export function useSentry(options: SentryHookOptions = {}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const navigationStartTime = useRef<number>(Date.now());

  const {
    enablePerformanceTracking = true,
    enableUserTracking = true,
    enableNavigationTracking = true,
  } = options;

  // Set user context when user data is available
  useEffect(() => {
    if (enableUserTracking && isLoaded && user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username || user.firstName || 'anonymous',
      });

      // Set additional user context
      Sentry.setTag('user.signed_in', 'true');
      Sentry.setTag('user.email_verified', user.primaryEmailAddress?.verification?.status === 'verified' ? 'true' : 'false');
      
      Sentry.setContext('user_details', {
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        emailAddresses: user.emailAddresses.map(email => ({
          email: email.emailAddress,
          verified: email.verification?.status === 'verified',
        })),
      });
    } else if (enableUserTracking && isLoaded && !user) {
      Sentry.setUser(null);
      Sentry.setTag('user.signed_in', 'false');
    }
  }, [user, isLoaded, enableUserTracking]);

  // Track navigation changes
  useEffect(() => {
    if (!enableNavigationTracking) return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // Add navigation breadcrumb
    Sentry.addBreadcrumb({
      message: `Navigation to ${url}`,
      category: 'navigation',
      level: 'info',
      data: {
        pathname,
        search: searchParams.toString(),
        timestamp: new Date().toISOString(),
      },
    });

    // Track page view
    Sentry.setTag('page.current', pathname);
    
    // Reset navigation timer
    navigationStartTime.current = Date.now();

  }, [pathname, searchParams, enableNavigationTracking]);

  // Set up performance monitoring
  useEffect(() => {
    if (!enablePerformanceTracking || typeof window === 'undefined') return;

    // Web Vitals tracking
    const observeWebVitals = () => {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const name = entry.name;
          const value = entry.value || (entry as any).processingStart || entry.startTime;
          
          // Send to Sentry as measurement
          Sentry.setMeasurement(name, value, 'millisecond');
          
          // Add as breadcrumb for context
          Sentry.addBreadcrumb({
            message: `Web Vital: ${name}`,
            category: 'performance',
            level: 'info',
            data: {
              name,
              value,
              rating: getWebVitalRating(name, value),
            },
          });
        });
      });

      // Observe different performance entry types
      try {
        observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
        
        // Also observe layout shifts and input delays if supported
        if ('observe' in observer) {
          observer.observe({ entryTypes: ['layout-shift', 'first-input'] });
        }
        
        performanceObserverRef.current = observer;
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    };

    // Set up memory monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        Sentry.setMeasurement('memory_used', memory.usedJSHeapSize, 'byte');
        Sentry.setMeasurement('memory_total', memory.totalJSHeapSize, 'byte');
        Sentry.setMeasurement('memory_limit', memory.jsHeapSizeLimit, 'byte');
      }
    };

    // Set up connection monitoring
    const monitorConnection = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        Sentry.setTag('connection.type', connection.effectiveType);
        Sentry.setTag('connection.downlink', connection.downlink?.toString());
        Sentry.setTag('connection.rtt', connection.rtt?.toString());
        Sentry.setTag('connection.save_data', connection.saveData ? 'true' : 'false');
      }
    };

    // Initialize monitoring
    observeWebVitals();
    monitorMemory();
    monitorConnection();

    // Monitor memory usage periodically
    const memoryInterval = setInterval(monitorMemory, 30000); // Every 30 seconds

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      clearInterval(memoryInterval);
    };
  }, [enablePerformanceTracking]);

  // Enhanced error tracking function
  const captureError = useCallback((error: Error, context?: {
    component?: string;
    action?: string;
    extra?: Record<string, any>;
    tags?: Record<string, string>;
    level?: 'error' | 'warning' | 'info';
  }) => {
    Sentry.captureException(error, {
      tags: {
        'error.component': context?.component || 'unknown',
        'error.action': context?.action || 'unknown',
        'page.pathname': pathname,
        ...context?.tags,
      },
      extra: {
        pathname,
        searchParams: searchParams.toString(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...context?.extra,
      },
      level: context?.level || 'error',
    });
  }, [pathname, searchParams]);

  // Stream-specific error tracking
  const captureStreamError = useCallback((error: Error, streamContext: {
    streamId?: string;
    platform?: string;
    channelName?: string;
    operation?: string;
  }) => {
    Sentry.captureException(error, {
      tags: {
        'stream.platform': streamContext.platform || 'unknown',
        'stream.operation': streamContext.operation || 'unknown',
        'error.type': 'stream_error',
        'page.pathname': pathname,
      },
      extra: {
        streamId: streamContext.streamId,
        channelName: streamContext.channelName,
        pathname,
        timestamp: new Date().toISOString(),
      },
      fingerprint: [
        'stream-error',
        streamContext.platform || 'unknown',
        streamContext.operation || 'unknown',
      ],
    });
  }, [pathname]);

  // User action tracking
  const trackUserAction = useCallback((action: string, properties?: Record<string, any>) => {
    Sentry.addBreadcrumb({
      message: `User Action: ${action}`,
      category: 'user',
      level: 'info',
      data: {
        action,
        pathname,
        timestamp: new Date().toISOString(),
        ...properties,
      },
    });

    // Also capture as event for analytics
    Sentry.captureMessage(`User: ${action}`, {
      level: 'info',
      tags: {
        'user.action': action,
        'event.type': 'user_interaction',
        'page.pathname': pathname,
      },
      extra: properties,
    });
  }, [pathname]);

  // Performance tracking for specific operations
  const trackPerformance = useCallback((name: string, startTime: number, context?: {
    success?: boolean;
    itemCount?: number;
    tags?: Record<string, string>;
  }) => {
    const duration = Date.now() - startTime;
    
    Sentry.setMeasurement(`${name}_duration`, duration, 'millisecond');
    
    if (context?.itemCount) {
      Sentry.setMeasurement(`${name}_items`, context.itemCount, 'none');
    }

    const transaction = Sentry.startTransaction({
      name: `Performance: ${name}`,
      op: 'custom.performance',
      tags: {
        'performance.operation': name,
        'performance.success': context?.success ? 'true' : 'false',
        'page.pathname': pathname,
        ...context?.tags,
      },
    });

    transaction.setMeasurement('duration', duration, 'millisecond');
    transaction.finish();
  }, [pathname]);

  // Custom message tracking
  const captureMessage = useCallback((message: string, context?: {
    level?: 'error' | 'warning' | 'info' | 'debug';
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }) => {
    Sentry.captureMessage(message, {
      level: context?.level || 'info',
      tags: {
        'page.pathname': pathname,
        ...context?.tags,
      },
      extra: {
        pathname,
        searchParams: searchParams.toString(),
        timestamp: new Date().toISOString(),
        ...context?.extra,
      },
    });
  }, [pathname, searchParams]);

  // Feature flag tracking
  const setFeatureFlag = useCallback((flagName: string, value: boolean | string) => {
    Sentry.setTag(`feature.${flagName}`, value.toString());
  }, []);

  // A/B test tracking
  const setExperiment = useCallback((experimentName: string, variant: string) => {
    Sentry.setTag(`experiment.${experimentName}`, variant);
  }, []);

  return {
    captureError,
    captureStreamError,
    trackUserAction,
    trackPerformance,
    captureMessage,
    setFeatureFlag,
    setExperiment,
  };
}

// Helper function to rate Web Vitals
function getWebVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    'first-contentful-paint': [1800, 3000],
    'largest-contentful-paint': [2500, 4000],
    'first-input-delay': [100, 300],
    'cumulative-layout-shift': [0.1, 0.25],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}