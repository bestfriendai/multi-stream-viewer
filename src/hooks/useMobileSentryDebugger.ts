/**
 * React hook for mobile Sentry debugging integration
 * Provides easy access to mobile debugging features in React components
 */

import { useEffect, useCallback, useRef } from 'react';
import { initializeMobileSentryDebugger, getMobileSentryDebugger, MobileSentryDebugger } from '@/lib/sentry-mobile-debug';
import { useMobileDetection } from './useMobileDetection';

interface UseMobileSentryDebuggerOptions {
  enabled?: boolean;
  trackComponentMounts?: boolean;
  trackGestures?: boolean;
  trackPerformance?: boolean;
}

interface MobileSentryDebuggerAPI {
  trackMobileMetric: (eventName: string, data: Record<string, any>) => void;
  trackTouchEvent: (type: string, target: string, coordinates?: { x: number; y: number }) => void;
  trackComponentError: (componentName: string, error: Error, props?: any) => void;
  trackGestureFailure: (gestureType: string, details: Record<string, any>) => void;
  trackComponentMount: (componentName: string, props?: any) => void;
  trackComponentUnmount: (componentName: string) => void;
  trackUIInteraction: (interaction: string, element: string, context?: Record<string, any>) => void;
  isEnabled: boolean;
}

/**
 * Hook for mobile Sentry debugging integration
 */
export function useMobileSentryDebugger(
  componentName?: string,
  options: UseMobileSentryDebuggerOptions = {}
): MobileSentryDebuggerAPI {
  const {
    enabled = true,
    trackComponentMounts = true,
    trackGestures = true,
    trackPerformance = true
  } = options;

  const { isMobile, isTablet } = useMobileDetection();
  const debuggerRef = useRef<MobileSentryDebugger | null>(null);
  const isActiveDevice = isMobile || isTablet;
  const isEnabled = enabled && isActiveDevice;

  // Initialize debugger on mobile devices
  useEffect(() => {
    if (isEnabled) {
      debuggerRef.current = initializeMobileSentryDebugger();
    }
  }, [isEnabled]);

  // Track component mount/unmount if enabled
  useEffect(() => {
    if (isEnabled && trackComponentMounts && componentName) {
      const mobileDebugger = getMobileSentryDebugger();
      if (mobileDebugger) {
        mobileDebugger.trackMobileMetric('component_mount', {
          component: componentName,
          timestamp: Date.now()
        });
      }

      return () => {
        const mobileDebugger = getMobileSentryDebugger();
        if (mobileDebugger) {
          mobileDebugger.trackMobileMetric('component_unmount', {
            component: componentName,
            timestamp: Date.now()
          });
        }
      };
    }
  }, [isEnabled, trackComponentMounts, componentName]);

  // Track mobile metric
  const trackMobileMetric = useCallback((eventName: string, data: Record<string, any>) => {
    if (!isEnabled) return;
    
    const mobileDebugger = getMobileSentryDebugger();
    if (mobileDebugger) {
      mobileDebugger.trackMobileMetric(eventName, {
        ...data,
        component: componentName,
        timestamp: Date.now()
      });
    }
  }, [isEnabled, componentName]);

  // Track touch event
  const trackTouchEvent = useCallback((
    type: string, 
    target: string, 
    coordinates?: { x: number; y: number }
  ) => {
    if (!isEnabled || !trackGestures) return;
    
    const mobileDebugger = getMobileSentryDebugger();
    if (mobileDebugger) {
      mobileDebugger.trackTouchEvent({
        type: type as any,
        target,
        coordinates: coordinates || { x: 0, y: 0 },
        touchCount: 1,
        timestamp: Date.now()
      });
    }
  }, [isEnabled, trackGestures]);

  // Track component error
  const trackComponentError = useCallback((
    componentName: string, 
    error: Error, 
    props?: any
  ) => {
    if (!isEnabled) return;
    
    const mobileDebugger = getMobileSentryDebugger();
    if (mobileDebugger) {
      mobileDebugger.trackComponentError(componentName, error, props);
    }
  }, [isEnabled]);

  // Track gesture failure
  const trackGestureFailure = useCallback((
    gestureType: string, 
    details: Record<string, any>
  ) => {
    if (!isEnabled || !trackGestures) return;
    
    const mobileDebugger = getMobileSentryDebugger();
    if (mobileDebugger) {
      mobileDebugger.trackGestureFailure(gestureType, details);
    }
  }, [isEnabled, trackGestures]);

  // Track component mount (manual)
  const trackComponentMount = useCallback((
    componentName: string, 
    props?: any
  ) => {
    if (!isEnabled) return;
    
    trackMobileMetric('component_mount_manual', {
      component: componentName,
      props: props ? JSON.stringify(props) : undefined
    });
  }, [isEnabled, trackMobileMetric]);

  // Track component unmount (manual)
  const trackComponentUnmount = useCallback((componentName: string) => {
    if (!isEnabled) return;
    
    trackMobileMetric('component_unmount_manual', {
      component: componentName
    });
  }, [isEnabled, trackMobileMetric]);

  // Track UI interaction
  const trackUIInteraction = useCallback((
    interaction: string,
    element: string,
    context?: Record<string, any>
  ) => {
    if (!isEnabled) return;
    
    trackMobileMetric('ui_interaction', {
      interaction,
      element,
      component: componentName,
      ...context
    });
  }, [isEnabled, trackMobileMetric, componentName]);

  return {
    trackMobileMetric,
    trackTouchEvent,
    trackComponentError,
    trackGestureFailure,
    trackComponentMount,
    trackComponentUnmount,
    trackUIInteraction,
    isEnabled
  };
}

/**
 * Hook for tracking mobile errors in error boundaries
 */
export function useMobileErrorBoundary(componentName: string) {
  const { trackComponentError, isEnabled } = useMobileSentryDebugger(componentName);

  const trackError = useCallback((error: Error, errorInfo?: any) => {
    if (isEnabled) {
      trackComponentError(componentName, error, errorInfo);
    }
  }, [isEnabled, trackComponentError, componentName]);

  return { trackError, isEnabled };
}

/**
 * Hook for tracking mobile performance in components
 */
export function useMobilePerformanceTracking(componentName: string) {
  const { trackMobileMetric, isEnabled } = useMobileSentryDebugger(componentName);
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    if (isEnabled) {
      renderStartTime.current = performance.now();
    }
  });

  useEffect(() => {
    if (isEnabled && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      trackMobileMetric('component_render_time', {
        component: componentName,
        render_time: renderTime
      });
    }
  });

  const trackCustomMetric = useCallback((metricName: string, value: number, unit: string = 'ms') => {
    if (isEnabled) {
      trackMobileMetric('custom_performance_metric', {
        component: componentName,
        metric_name: metricName,
        value,
        unit
      });
    }
  }, [isEnabled, trackMobileMetric, componentName]);

  return { trackCustomMetric, isEnabled };
}

/**
 * Hook for tracking mobile gestures in components
 */
export function useMobileGestureTracking(componentName: string) {
  const { trackTouchEvent, trackGestureFailure, isEnabled } = useMobileSentryDebugger(componentName);

  const trackGesture = useCallback((
    gestureType: string,
    target: string,
    success: boolean = true,
    details?: Record<string, any>
  ) => {
    if (!isEnabled) return;

    if (success) {
      trackTouchEvent(gestureType, target);
    } else {
      trackGestureFailure(gestureType, {
        target,
        component: componentName,
        ...details
      });
    }
  }, [isEnabled, trackTouchEvent, trackGestureFailure, componentName]);

  return { trackGesture, isEnabled };
}