import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

// Enhanced API route wrapper with Sentry monitoring
export function withSentry<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  options?: {
    name?: string;
    tags?: Record<string, string>;
    timeout?: number;
  }
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    // Extract request info if available
    const request = args.find(arg => arg instanceof NextRequest) as NextRequest | undefined;
    const url = request?.url;
    const method = request?.method;
    const pathname = url ? new URL(url).pathname : 'unknown';
    
    // Start transaction
    const transaction = Sentry.startTransaction({
      name: options?.name || `API ${method} ${pathname}`,
      op: 'http.server',
      tags: {
        'http.method': method || 'unknown',
        'http.url': pathname,
        'request.id': requestId,
        ...options?.tags,
      },
    });
    
    // Set user context if available
    const userAgent = request?.headers.get('user-agent');
    const ip = request?.headers.get('x-forwarded-for') || 
              request?.headers.get('x-real-ip') ||
              'unknown';
    
    Sentry.setUser({
      ip_address: ip,
    });
    
    // Add request context
    Sentry.setContext('request', {
      url: url,
      method: method,
      headers: Object.fromEntries(request?.headers.entries() || []),
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
    });
    
    // Add breadcrumb
    Sentry.addBreadcrumb({
      message: `API Request: ${method} ${pathname}`,
      category: 'http',
      level: 'info',
      data: {
        method,
        url: pathname,
        requestId,
      },
    });
    
    try {
      // Execute handler with timeout if specified
      let result: NextResponse;
      
      if (options?.timeout) {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Request timeout after ${options.timeout}ms`)), options.timeout);
        });
        
        result = await Promise.race([
          handler(...args),
          timeoutPromise
        ]);
      } else {
        result = await handler(...args);
      }
      
      // Capture successful response metrics
      const duration = Date.now() - startTime;
      const status = result.status;
      
      transaction.setTag('http.status_code', status.toString());
      transaction.setTag('response.time', `${duration}ms`);
      
      // Add response breadcrumb
      Sentry.addBreadcrumb({
        message: `API Response: ${status} in ${duration}ms`,
        category: 'http',
        level: status >= 400 ? 'error' : 'info',
        data: {
          status,
          duration,
          requestId,
        },
      });
      
      // Capture metrics for analysis
      Sentry.setMeasurement('response_time', duration, 'millisecond');
      Sentry.setMeasurement('response_size', 
        parseInt(result.headers.get('content-length') || '0'), 
        'byte'
      );
      
      return result;
      
    } catch (error) {
      // Capture error with enhanced context
      Sentry.captureException(error, {
        tags: {
          'api.route': pathname,
          'api.method': method || 'unknown',
          'request.id': requestId,
          'error.boundary': 'api_wrapper',
        },
        extra: {
          duration: Date.now() - startTime,
          url: url,
          userAgent: userAgent,
          requestHeaders: Object.fromEntries(request?.headers.entries() || []),
        },
        level: 'error',
      });
      
      transaction.setTag('error', 'true');
      transaction.setStatus('internal_error');
      
      // Return appropriate error response
      return NextResponse.json(
        { 
          error: 'Internal Server Error',
          requestId,
          ...(process.env.NODE_ENV === 'development' && { 
            details: error instanceof Error ? error.message : 'Unknown error' 
          })
        },
        { status: 500 }
      );
      
    } finally {
      transaction.finish();
    }
  };
}

// Stream-specific error tracking
export function trackStreamError(
  error: Error,
  context: {
    streamId?: string;
    platform?: string;
    channelName?: string;
    operation?: string;
  }
) {
  Sentry.captureException(error, {
    tags: {
      'stream.platform': context.platform || 'unknown',
      'stream.operation': context.operation || 'unknown',
      'error.type': 'stream_error',
    },
    extra: {
      streamId: context.streamId,
      channelName: context.channelName,
      timestamp: new Date().toISOString(),
    },
    fingerprint: [
      'stream-error',
      context.platform || 'unknown',
      context.operation || 'unknown',
    ],
  });
}

// Performance monitoring for stream operations
export function trackStreamPerformance(
  operation: string,
  duration: number,
  context: {
    streamCount?: number;
    platform?: string;
    success?: boolean;
  }
) {
  const transaction = Sentry.startTransaction({
    name: `Stream ${operation}`,
    op: 'stream.operation',
    tags: {
      'stream.platform': context.platform || 'unknown',
      'stream.operation': operation,
      'stream.success': context.success ? 'true' : 'false',
    },
  });
  
  if (context.streamCount) {
    transaction.setTag('stream.count', context.streamCount.toString());
    Sentry.setMeasurement('stream_count', context.streamCount, 'none');
  }
  
  Sentry.setMeasurement(`${operation}_duration`, duration, 'millisecond');
  
  transaction.finish();
}

// User interaction tracking
export function trackUserAction(
  action: string,
  properties?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message: `User Action: ${action}`,
    category: 'user',
    level: 'info',
    data: {
      action,
      timestamp: new Date().toISOString(),
      ...properties,
    },
  });
  
  // Also capture as custom event
  Sentry.captureMessage(`User performed: ${action}`, {
    level: 'info',
    tags: {
      'user.action': action,
      'event.type': 'user_interaction',
    },
    extra: properties,
  });
}

// Mobile-specific error tracking
export function trackMobileError(
  error: Error,
  context: {
    viewport?: string;
    orientation?: string;
    touchDevice?: boolean;
    component?: string;
  }
) {
  Sentry.captureException(error, {
    tags: {
      'mobile.viewport': context.viewport || 'unknown',
      'mobile.orientation': context.orientation || 'unknown',
      'mobile.touch': context.touchDevice ? 'true' : 'false',
      'error.component': context.component || 'unknown',
      'error.type': 'mobile_error',
    },
    fingerprint: [
      'mobile-error',
      context.component || 'unknown',
      error.name,
    ],
  });
}

// Custom metric tracking
export function setCustomMetrics(metrics: Record<string, number>) {
  Object.entries(metrics).forEach(([name, value]) => {
    Sentry.setMeasurement(name, value, 'none');
  });
}

// Enhanced user context setting
export function setUserContext(user: {
  id?: string;
  email?: string;
  username?: string;
  subscription?: string;
  streamCount?: number;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  
  Sentry.setTag('user.subscription', user.subscription || 'free');
  
  if (user.streamCount !== undefined) {
    Sentry.setTag('user.stream_count', user.streamCount.toString());
  }
}

// Feature flag context
export function setFeatureFlags(flags: Record<string, boolean>) {
  Sentry.setContext('feature_flags', flags);
}

// A/B test context
export function setExperimentContext(experiments: Record<string, string>) {
  Sentry.setContext('experiments', experiments);
}

// Device performance context
export function setPerformanceContext() {
  if (typeof window !== 'undefined') {
    const memory = (performance as any).memory;
    const connection = (navigator as any).connection;
    
    Sentry.setContext('performance', {
      memory: memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      } : undefined,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      } : undefined,
      timing: {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      },
    });
  }
}