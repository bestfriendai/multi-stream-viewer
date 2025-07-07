'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import * as Sentry from "@sentry/nextjs";
import { useSentry } from '@/hooks/useSentry';
import { setPerformanceContext } from '@/lib/sentry-wrapper';

interface SentryContextType {
  captureError: (error: Error, context?: any) => void;
  captureStreamError: (error: Error, streamContext: any) => void;
  trackUserAction: (action: string, properties?: any) => void;
  trackPerformance: (name: string, startTime: number, context?: any) => void;
  captureMessage: (message: string, context?: any) => void;
  setFeatureFlag: (flagName: string, value: boolean | string) => void;
  setExperiment: (experimentName: string, variant: string) => void;
}

const SentryContext = createContext<SentryContextType | null>(null);

interface SentryProviderProps {
  children: ReactNode;
  enableFeedback?: boolean;
  enableSpotlight?: boolean;
}

export function SentryProvider({ 
  children, 
  enableFeedback = true,
  enableSpotlight = process.env.NODE_ENV === 'development'
}: SentryProviderProps) {
  const sentryHook = useSentry({
    enablePerformanceTracking: true,
    enableUserTracking: true,
    enableNavigationTracking: true,
  });

  useEffect(() => {
    // Set up performance context
    setPerformanceContext();

    // Set application context
    Sentry.setContext('application', {
      name: 'multi-stream-viewer',
      version: process.env.npm_package_version || 'unknown',
      build: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
      environment: process.env.NODE_ENV,
      deployment: process.env.VERCEL_ENV || 'local',
      framework: 'Next.js',
      runtime: 'browser',
    });

    // Set device context
    if (typeof window !== 'undefined') {
      Sentry.setContext('device', {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    }

    // Set up error handlers
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      Sentry.captureException(event.reason, {
        tags: {
          'error.type': 'unhandled_promise_rejection',
          'error.source': 'window',
        },
        extra: {
          promise: event.promise,
          reason: event.reason,
        },
      });
    };

    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error || new Error(event.message), {
        tags: {
          'error.type': 'global_error',
          'error.source': 'window',
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message,
        },
      });
    };

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Set up visibility change tracking
    const handleVisibilityChange = () => {
      Sentry.addBreadcrumb({
        message: `Page ${document.hidden ? 'hidden' : 'visible'}`,
        category: 'navigation',
        level: 'info',
        data: {
          hidden: document.hidden,
          visibilityState: document.visibilityState,
        },
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up beforeunload tracking
    const handleBeforeUnload = () => {
      Sentry.addBreadcrumb({
        message: 'Page unload started',
        category: 'navigation',
        level: 'info',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Set up network monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const handleConnectionChange = () => {
      Sentry.setTag('connection.type', connection.effectiveType);
      Sentry.setTag('connection.downlink', connection.downlink?.toString());
      Sentry.setTag('connection.rtt', connection.rtt?.toString());
      
      Sentry.addBreadcrumb({
        message: 'Network connection changed',
        category: 'network',
        level: 'info',
        data: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        },
      });
    };

    connection.addEventListener('change', handleConnectionChange);

    return () => {
      connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  // Set up spotlight for development
  useEffect(() => {
    if (enableSpotlight && process.env.NODE_ENV === 'development') {
      // Spotlight is configured in the Sentry config
      console.log('🔍 Sentry Spotlight enabled for development');
    }
  }, [enableSpotlight]);

  return (
    <SentryContext.Provider value={sentryHook}>
      {children}
      {enableFeedback && <SentryFeedbackButton />}
    </SentryContext.Provider>
  );
}

// Feedback button component
function SentryFeedbackButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openFeedback = () => {
    const feedback = Sentry.getFeedback();
    if (feedback) {
      feedback.openDialog();
      setIsOpen(true);
    }
  };

  // Only show feedback button in production or when there are errors
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <button
      onClick={openFeedback}
      className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
      title="Report an issue"
      aria-label="Report an issue"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    </button>
  );
}

// Hook to use Sentry context
export function useSentryContext() {
  const context = useContext(SentryContext);
  if (!context) {
    throw new Error('useSentryContext must be used within a SentryProvider');
  }
  return context;
}

// Higher-order component for error boundaries
export function withSentryErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryOptions?: {
    fallback?: React.ComponentType<any>;
    showDialog?: boolean;
  }
) {
  return Sentry.withErrorBoundary(Component, {
    fallback: errorBoundaryOptions?.fallback || ErrorFallback,
    showDialog: errorBoundaryOptions?.showDialog ?? false,
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('error.boundary', 'sentry_hoc');
      scope.setContext('react_error_info', errorInfo);
    },
  });
}

// Default error fallback component
function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We've been notified about this error and will fix it soon.
        </p>
        <button
          onClick={resetError}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-mono">
              Error details (dev only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default SentryProvider;