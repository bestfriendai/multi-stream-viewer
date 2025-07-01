import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';

// Define which routes need rate limiting and their limits
const rateLimitConfig = {
  // Search endpoints - more restrictive
  '/api/twitch/search': rateLimiters.search,
  '/api/twitch/categories': rateLimiters.search,
  
  // Normal API endpoints
  '/api/twitch/streams': rateLimiters.normal,
  '/api/twitch/top-streams': rateLimiters.normal,
  '/api/twitch/streams-by-category': rateLimiters.normal,
  '/api/twitch/trending': rateLimiters.normal,
  '/api/twitch/clips': rateLimiters.normal,
  
  // Relaxed rate limits
  '/api/twitch/stats': rateLimiters.relaxed,
  '/api/health': rateLimiters.relaxed,
};

// Routes that should bypass rate limiting
const bypassRoutes = [
  '/api/debug-env', // Already has its own protection
  '/api/test-twitch', // Already has its own protection
  '/api/twitch/verify', // Internal use
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if route should bypass rate limiting
  if (bypassRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Find matching rate limiter
  for (const [route, limiter] of Object.entries(rateLimitConfig)) {
    if (pathname.startsWith(route)) {
      const rateLimitResponse = await limiter(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      break;
    }
  }
  
  // Add security headers to all API responses
  const response = NextResponse.next();
  
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};