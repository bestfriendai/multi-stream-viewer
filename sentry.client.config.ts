// This file configures the initialization of Sentry on the browser/client side
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://cb0c99be8431b823967fd7e441ae7924@o4509628501262336.ingest.us.sentry.io/4509628733390848",
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking with multiple fallbacks
  release: process.env.VERCEL_GIT_COMMIT_SHA || 
           process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
           process.env.npm_package_version ||
           'unknown',
  
  // Performance monitoring - adjust for production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay configuration
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Comprehensive integrations
  integrations: [
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
        window.location.origin,
        /^https:\/\/api\.twitch\.tv/,
        /^https:\/\/.*\.youtube\.com/,
        /^https:\/\/.*\.supabase\.co/,
      ],
      networkCaptureBodies: true,
      networkRequestHeaders: ['User-Agent', 'Accept', 'Content-Type'],
      networkResponseHeaders: ['Content-Type', 'Content-Length'],
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
      
      // Disable automatic route change tracking for Next.js (handled by Next.js integration)
      routingInstrumentation: undefined,
    }),
    
    // Browser Profiling
    Sentry.browserProfilingIntegration(),
    
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
    }),
    
    // Context Lines for better stack traces
    Sentry.contextLinesIntegration(),
    
    // HTTP Context for request details
    Sentry.httpContextIntegration(),
  ],
  
  // Advanced error filtering
  beforeSend(event, hint) {
    // Filter out common false positives
    if (event.exception) {
      const error = event.exception.values?.[0];
      const errorMessage = error?.value || '';
      
      // Common browser errors to ignore
      const ignoredErrors = [
        'Non-Error promise rejection',
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Script error',
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        'The operation was aborted',
        'AbortError',
        'ChunkLoadError',
        'Loading chunk',
        'Loading CSS chunk',
        'NetworkError',
        'The request timed out',
        'Timeout',
        // Stream-specific errors that are expected
        'Twitch embed failed to load',
        'YouTube embed failed to load',
        'Stream is offline',
        'Stream not found',
      ];
      
      if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
        return null;
      }
      
      // Filter out errors from browser extensions
      if (error?.stacktrace?.frames?.some((frame: any) => 
        frame.filename?.includes('extension://') ||
        frame.filename?.includes('moz-extension://') ||
        frame.filename?.includes('safari-extension://')
      )) {
        return null;
      }
    }
    
    // Add additional context
    event.tags = {
      ...event.tags,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${screen.width}x${screen.height}`,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
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