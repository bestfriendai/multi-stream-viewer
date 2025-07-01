import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string; // Custom error message
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (consider using Redis in production)
const rateLimitStore = new Map<string, RateLimitStore>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = config;

  return async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
    // Get client identifier (IP address or API key)
    const identifier = getClientIdentifier(request);
    const now = Date.now();
    
    // Get or create rate limit record
    let record = rateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(identifier, record);
      return null; // Allow request
    }
    
    // Increment count
    record.count++;
    
    // Check if limit exceeded
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      );
    }
    
    // Update remaining count in headers
    const remaining = max - record.count;
    request.headers.set('X-RateLimit-Limit', max.toString());
    request.headers.set('X-RateLimit-Remaining', remaining.toString());
    request.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    
    return null; // Allow request
  };
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // Use the first available IP
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // You could also use API keys if implemented
  const apiKey = request.headers.get('x-api-key');
  if (apiKey) {
    return `api_key:${apiKey}`;
  }
  
  return `ip:${ip}`;
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Strict limit for expensive operations
  strict: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
  }),
  
  // Normal limit for regular API calls
  normal: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  }),
  
  // Relaxed limit for lightweight operations
  relaxed: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  }),
  
  // Search-specific rate limit
  search: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: 'Too many search requests. Please wait before searching again.'
  }),
};