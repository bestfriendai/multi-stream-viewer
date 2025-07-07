import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';



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

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/saved-layouts(.*)',
]);

// Define public routes that should bypass auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
  '/amp(.*)',
  '/blog(.*)',
  '/multitwitch(.*)',
]);

// Custom middleware logic for rate limiting and i18n
async function customMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route should bypass rate limiting
  if (bypassRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next();

    // Handle language preference for future internationalization
    if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/') && !pathname.includes('.')) {
      const localeCookie = request.cookies.get('locale')?.value || 'en';
      response.headers.set('x-user-locale', localeCookie);
    }

    return response;
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
  
  // Create response with headers
  const response = NextResponse.next();

  // Handle language preference for future internationalization
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/') && !pathname.includes('.')) {
    const localeCookie = request.cookies.get('locale')?.value || 'en';
    response.headers.set('x-user-locale', localeCookie);
  }

  if (pathname.startsWith('/api/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  
  return response;
}

// Combine Clerk middleware with custom middleware
export default clerkMiddleware(async (auth, request) => {
  // Protect routes that require authentication
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
  
  // Run custom middleware logic
  return customMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

