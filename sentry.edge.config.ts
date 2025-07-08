// This file configures the initialization of Sentry for edge runtime
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Enable experimental logging features
  _experiments: {
    enableLogs: true,
  },
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  
  // Set sample rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version,
  
  // Edge runtime specific configuration
  debug: process.env.NODE_ENV === 'development',
  
  // Additional tags for better organization
  initialScope: {
    tags: {
      component: "multi-stream-viewer",
      platform: "edge"
    },
  },
});