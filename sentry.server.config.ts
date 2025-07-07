// This file configures the initialization of Sentry on the server side
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9b0201ee70b67c58b7e2fb38595e773f@o4509628501262336.ingest.us.sentry.io/4509628501983232",
  
  // Enable experimental logging features
  _experiments: {
    enableLogs: true,
  },
  
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
  
  // Server-side integrations
  integrations: [
    // Console integration for server logs
    Sentry.consoleIntegration({
      levels: ['error', 'warn'],
    }),
    
    // Spotlight disabled to avoid connection issues
  ],
  
  // Enhanced server-side error filtering with comprehensive insights
  beforeSend(event, hint) {
    console.log('🔍 Sentry capturing server error:', event.exception?.values?.[0]?.value);
    
    // Add comprehensive server-side error categorization
    if (event.exception) {
      const error = event.exception.values?.[0];
      const errorMessage = error?.value || '';
      
      // API endpoint categorization
      if (event.request?.url) {
        const url = event.request.url;
        event.tags = {
          ...event.tags,
          'api.endpoint': url.split('?')[0],
          'api.hasQuery': url.includes('?').toString(),
        };
        
        // Specific API categorization
        if (url.includes('/twitch/')) {
          event.tags = {
            ...event.tags,
            'api.service': 'twitch',
            'api.category': 'streaming',
          };
        } else if (url.includes('/stripe/')) {
          event.tags = {
            ...event.tags,
            'api.service': 'stripe',
            'api.category': 'payment',
          };
        } else if (url.includes('/supabase/') || url.includes('/auth/')) {
          event.tags = {
            ...event.tags,
            'api.service': 'supabase',
            'api.category': 'database',
          };
        }
      }
      
      // Error type categorization
      if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        event.tags = {
          ...event.tags,
          'error.category': 'timeout',
          'error.network': 'true',
        };
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        event.tags = {
          ...event.tags,
          'error.category': 'rate_limit',
          'error.external': 'true',
        };
      } else if (errorMessage.includes('database') || errorMessage.includes('SQL')) {
        event.tags = {
          ...event.tags,
          'error.category': 'database',
          'error.data': 'true',
        };
      } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        event.tags = {
          ...event.tags,
          'error.category': 'validation',
          'error.input': 'true',
        };
      }
      
      // Minimal filtering for maximum insights
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