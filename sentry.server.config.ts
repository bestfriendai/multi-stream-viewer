// This file configures the initialization of Sentry on the server side
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
  
  // Server-side integrations
  integrations: [
    // Console integration for server logs
    Sentry.consoleIntegration({
      levels: ['error', 'warn'],
    }),
    
    // Spotlight disabled to avoid connection issues
  ],
  
  // Enhanced server-side error filtering - temporarily disabled for debugging
  beforeSend(event, hint) {
    // Allow all errors for debugging purposes
    console.log('🔍 Sentry capturing error:', event.exception?.values?.[0]?.value);
    
    // Only filter out these specific noisy errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      const errorMessage = error?.value || '';
      
      // Minimal filtering for debugging
      const criticalIgnored = [
        'ECONNRESET',
        'socket hang up',
      ];
      
      if (criticalIgnored.some(ignored => errorMessage.includes(ignored))) {
        return null;
      }
    }
    
    // Add server context
    event.tags = {
      ...event.tags,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      uptime: `${Math.round(process.uptime())}s`,
    };
    
    // Add environment context
    event.extra = {
      ...event.extra,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        vercelRegion: process.env.VERCEL_REGION,
        vercelUrl: process.env.VERCEL_URL,
      },
      process: {
        pid: process.pid,
        ppid: process.ppid,
        execPath: process.execPath,
        argv: process.argv,
      },
    };
    
    return event;
  },
  
  // Server-specific options
  sampleRate: 1.0,
  maxBreadcrumbs: 100,
  maxValueLength: 8192,
  
  // Transport options
  transportOptions: {
    keepAlive: true,
    timeout: 10000,
  },
  
  // Enhanced server scope
  initialScope: {
    tags: {
      component: "multi-stream-viewer",
      platform: "server",
      runtime: "nodejs",
      framework: "nextjs",
      version: process.env.npm_package_version || 'unknown',
      deployment: process.env.VERCEL_ENV || 'local',
    },
    level: 'info',
    extra: {
      buildTime: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      serverStartTime: new Date().toISOString(),
    },
  },
  
  // Debug configuration
  debug: process.env.NODE_ENV === 'development',
  
  // Normalize transaction names
  normalizeDepth: 6,
  
  // Server-specific features
  autoSessionTracking: true,
  sendDefaultPii: false,
  attachStacktrace: true,
  
  // Request data options
  sendDefaultPii: false,
  maxRequestBodySize: 'medium',
  
  // Configure allowed URLs for security
  allowUrls: [
    /streamyyy\.com/,
    /vercel\.app/,
    /localhost/,
  ],
});