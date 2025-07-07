// This file configures the initialization of Sentry on the browser/client side
import * as Sentry from "@sentry/nextjs";
import { customSentryIntegrations, beforeSend, beforeSendTransaction } from './src/lib/sentry-custom-integrations';
import { sentryAdvancedDebugger } from './src/lib/sentry-advanced-debugging';
import { sentryProfilingReplay } from './src/lib/sentry-profiling-replay';
import { sentryDebugUtilities } from './src/lib/sentry-debug-utilities';
import { sentryUptimeMonitor } from './src/lib/sentry-uptime-monitoring';
import { sentryCronMonitor } from './src/lib/sentry-cron-monitoring';
import { sentryAttachments, attachmentUtils } from './src/lib/sentry-attachments';

Sentry.init({
  dsn: "https://9b0201ee70b67c58b7e2fb38595e773f@o4509628501262336.ingest.us.sentry.io/4509628501983232",
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking with multiple fallbacks
  release: process.env.VERCEL_GIT_COMMIT_SHA || 
           process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
           process.env.npm_package_version ||
           'unknown',
  
  // Performance monitoring - maximized for insights
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.3 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.3 : 1.0,
  
  // Session Replay configuration - maximized for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.3,
  replaysOnErrorSampleRate: 1.0,
  
  // Enable experimental logging features
  _experiments: {
    enableLogs: true,
  },
  
  // Comprehensive integrations
  integrations: [
    // Console logging integration for automatic log capture
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
    // Session Replay with privacy controls
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true,
      blockClass: 'sentry-block',
      maskClass: 'sentry-mask',
      ignoreClass: 'sentry-ignore',
      // Capture console logs in replays
      networkDetailAllowUrls: [
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        /^https:\/\/api\.twitch\.tv/,
        /^https:\/\/.*\.youtube\.com/,
        /^https:\/\/.*\.supabase\.co/,
      ],
      networkCaptureBodies: true,
      networkRequestHeaders: ['User-Agent', 'Accept', 'Content-Type'],
      networkResponseHeaders: ['Content-Type', 'Content-Length'],
      
      // Advanced replay configuration
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.5,
      errorSampleRate: 1.0,
      maskTextClass: 'sentry-mask-text',
      blockClass: 'sentry-block',
      ignoreClass: 'sentry-ignore',
      
      // Privacy controls
      maskTextSelector: '.password, .credit-card, .sensitive',
      blockSelector: '.private-content, .admin-panel',
    }),
    
    // Browser Tracing for performance monitoring
    Sentry.browserTracingIntegration({
      // Track specific interactions
      tracingOrigins: [
        'localhost',
        /^https:\/\/streamyyy\.com/,
        /^https:\/\/.*\.vercel\.app/,
        /^https:\/\/api\.twitch\.tv/,
        /^https:\/\/.*\.youtube\.com/,
        /^https:\/\/.*\.supabase\.co/,
      ],
      
      // Capture additional web vitals
      enableLongAnimationFrame: true,
      enableInp: true,
      
      // Track user interactions
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/streamyyy\.com/,
        /^https:\/\/.*\.vercel\.app/,
      ],
      
      // Disable automatic route change tracking for Next.js (handled by Next.js integration)
      routingInstrumentation: undefined,
      
      // Advanced performance monitoring
      markBackgroundTransactions: true,
      enableLongTask: true,
      enableUserTiming: true,
    }),
    
    // Browser Profiling with enhanced configuration
    Sentry.browserProfilingIntegration({
      // Sample rate for profiling
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Advanced profiling options
      captureNumFrames: 100,
      maxProfileDurationMs: 30000,
    }),
    
    // Feedback integration for user reports
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      showBranding: false,
      autoInject: false, // We'll manually control when to show
      themeDark: {
        background: '#1f2937',
        backgroundHover: '#374151',
        foreground: '#f9fafb',
        error: '#ef4444',
        success: '#10b981',
        border: '#4b5563',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      themeLight: {
        background: '#ffffff',
        backgroundHover: '#f9fafb',
        foreground: '#1f2937',
        error: '#dc2626',
        success: '#059669',
        border: '#d1d5db',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      
      // Enhanced feedback options
      isNameRequired: false,
      isEmailRequired: false,
      showName: true,
      showEmail: true,
      useSentryUser: {
        name: 'displayName',
        email: 'email',
      },
    }),
    
    // Context Lines for better stack traces
    Sentry.contextLinesIntegration({
      frameContextLines: 10,
    }),
    
    // HTTP Context for request details
    Sentry.httpContextIntegration({
      keys: ['url', 'method', 'headers', 'cookies', 'query_string'],
    }),
    
    // Metrics integration for custom metrics
    Sentry.metricsIntegration(),
    
    // Custom integrations for advanced monitoring
    ...customSentryIntegrations,
  ],
  
  // Advanced error filtering with comprehensive insights
  beforeSend: beforeSend,
  beforeSendTransaction: beforeSendTransaction,
  
  // Legacy beforeSend for additional processing
  _beforeSend(event, hint) {
    // Capture comprehensive debugging context
    const originalError = hint.originalException;
    
    // Add detailed error context
    if (event.exception) {
      const error = event.exception.values?.[0];
      const errorMessage = error?.value || '';
      
      // Stream-specific error categorization
      if (errorMessage.includes('Twitch') || errorMessage.includes('YouTube')) {
        event.tags = {
          ...event.tags,
          'error.category': 'stream_embed',
          'error.platform': errorMessage.includes('Twitch') ? 'twitch' : 'youtube',
        };
      }
      
      // API error categorization
      if (errorMessage.includes('API') || errorMessage.includes('fetch')) {
        event.tags = {
          ...event.tags,
          'error.category': 'api',
          'error.network': 'true',
        };
      }
      
      // UI/UX error categorization
      if (errorMessage.includes('render') || errorMessage.includes('component')) {
        event.tags = {
          ...event.tags,
          'error.category': 'ui',
          'error.component': 'true',
        };
      }
      
      // Performance error categorization
      if (errorMessage.includes('timeout') || errorMessage.includes('slow') || errorMessage.includes('memory')) {
        event.tags = {
          ...event.tags,
          'error.category': 'performance',
          'error.performance': 'true',
        };
      }
      
      // Only filter out these critical false positives
      const criticalIgnored = [
        'ResizeObserver loop limit exceeded',
        'Script error',
        'Non-Error promise rejection',
      ];
      
      // Filter out errors from browser extensions
      if (error?.stacktrace?.frames?.some((frame: any) => 
        frame.filename?.includes('extension://') ||
        frame.filename?.includes('moz-extension://') ||
        frame.filename?.includes('safari-extension://')
      )) {
        return null;
      }
      
      if (criticalIgnored.some(ignored => errorMessage.includes(ignored))) {
        return null;
      }
    }
    
    // Add comprehensive debugging context
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    event.tags = {
      ...event.tags,
      // Device & Browser Context
      userAgent: navigator.userAgent,
      viewport,
      screen: `${screen.width}x${screen.height}`,
      deviceType,
      isMobile: isMobile.toString(),
      isTablet: isTablet.toString(),
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled.toString(),
      onLine: navigator.onLine.toString(),
      
      // App-specific context
      page: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
      
      // Performance context
      loadTime: performance.timing ? 
        (performance.timing.loadEventEnd - performance.timing.navigationStart).toString() : 'unknown',
      
      // Stream-specific context
      streamsCount: document.querySelectorAll('[data-stream-id]').length.toString(),
      hasStreams: (document.querySelectorAll('[data-stream-id]').length > 0).toString(),
    };
    
    // Add performance context
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        event.extra = {
          ...event.extra,
          performance: {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          },
        };
      }
    }
    
    return event;
  },
  
  // Enhanced error sampling
  sampleRate: 1.0,
  maxBreadcrumbs: 100,
  maxValueLength: 8192,
  
  // Transport options for reliability
  transportOptions: {
    keepAlive: true,
  },
  
  // Initial scope with comprehensive context
  initialScope: {
    tags: {
      component: "multi-stream-viewer",
      platform: "web",
      runtime: "browser",
      framework: "nextjs",
      version: process.env.npm_package_version || 'unknown',
    },
    level: 'info',
    extra: {
      buildTime: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      deployment: process.env.VERCEL_ENV || 'local',
    },
  },
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Normalize transaction names
  normalizeDepth: 6,
  
  // Auto session tracking
  autoSessionTracking: true,
  
  // Send default PII (be careful with this in production)
  sendDefaultPii: false,
  
  // Attach stack traces to pure capture message calls
  attachStacktrace: true,
  
  // Configure allowed URLs for security
  allowUrls: [
    /^https:\/\/streamyyy\.com/,
    /^https:\/\/.*\.vercel\.app/,
    /^http:\/\/localhost/,
    /^http:\/\/127\.0\.0\.1/,
  ],
});

// Initialize advanced debugging features
if (typeof window !== 'undefined') {
  // Initialize advanced debugger
  sentryAdvancedDebugger.enableDebugMode();
  
  // Initialize profiling and replay
  sentryProfilingReplay.startReplay();
  
  // Initialize debug utilities in development
  if (process.env.NODE_ENV === 'development') {
    sentryDebugUtilities.exposeGlobalDebugAPI();
    sentryDebugUtilities.startPerformanceMonitoring();
    sentryDebugUtilities.enableRealTimeMonitoring();
  }
  
  // Initialize uptime monitoring (auto-configured in the uptime monitoring file)
  // The uptime monitor auto-initializes and sets up default checks
  
  // Set up error boundary for unhandled errors
  window.addEventListener('error', (event) => {
    // Attach comprehensive debug context for critical errors
    attachmentUtils.attachFullDebugContext(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      source: 'window.error'
    });
    
    sentryAdvancedDebugger.captureAdvancedError(event.error, {
      level: 'error',
      tags: { source: 'window.error' },
      extra: { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });
  
  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const error = new Error(`Unhandled Promise Rejection: ${event.reason}`)
    
    // Attach debug context for promise rejections
    attachmentUtils.attachMinimalDebugInfo(error, { 
      reason: event.reason,
      source: 'unhandled.promise'
    });
    
    sentryAdvancedDebugger.captureAdvancedError(error, {
      level: 'error',
      tags: { source: 'unhandled.promise' },
      extra: { reason: event.reason }
    });
  });
  
  // Track page load performance
  if (document.readyState === 'complete') {
    sentryAdvancedDebugger.trackPageLoad(window.location.pathname);
  } else {
    window.addEventListener('load', () => {
      sentryAdvancedDebugger.trackPageLoad(window.location.pathname);
    });
  }
}