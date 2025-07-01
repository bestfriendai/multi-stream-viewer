import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/rate-limiter';

// Mock NextRequest
const createMockRequest = (ip?: string, apiKey?: string): NextRequest => {
  const headers = new Headers();
  if (ip) headers.set('x-forwarded-for', ip);
  if (apiKey) headers.set('x-api-key', apiKey);
  
  return {
    headers,
    nextUrl: new URL('http://localhost:3000/api/test'),
  } as NextRequest;
};

describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests within rate limit', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000, // 1 minute
      max: 5,
    });

    const request = createMockRequest('192.168.1.1');
    
    // Make 5 requests (within limit)
    for (let i = 0; i < 5; i++) {
      const response = await limiter(request);
      expect(response).toBeNull();
    }
  });

  it('blocks requests exceeding rate limit', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000, // 1 minute
      max: 5,
      message: 'Custom rate limit message',
    });

    const request = createMockRequest('192.168.1.1');
    
    // Make 5 requests (within limit)
    for (let i = 0; i < 5; i++) {
      const response = await limiter(request);
      expect(response).toBeNull();
    }
    
    // 6th request should be blocked
    const blockedResponse = await limiter(request);
    expect(blockedResponse).toBeInstanceOf(NextResponse);
    
    if (blockedResponse) {
      const data = await blockedResponse.json();
      expect(data.error).toBe('Custom rate limit message');
      expect(blockedResponse.status).toBe(429);
      expect(blockedResponse.headers.get('Retry-After')).toBeTruthy();
    }
  });

  it('resets rate limit after window expires', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000, // 1 minute
      max: 5,
    });

    const request = createMockRequest('192.168.1.1');
    
    // Max out the rate limit
    for (let i = 0; i < 6; i++) {
      await limiter(request);
    }
    
    // Fast forward past the window
    jest.advanceTimersByTime(61000);
    
    // Should be allowed again
    const response = await limiter(request);
    expect(response).toBeNull();
  });

  it('tracks rate limits per IP', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      max: 2,
    });

    const request1 = createMockRequest('192.168.1.1');
    const request2 = createMockRequest('192.168.1.2');
    
    // Max out first IP
    await limiter(request1);
    await limiter(request1);
    
    // Third request from first IP should be blocked
    const blocked1 = await limiter(request1);
    expect(blocked1).toBeInstanceOf(NextResponse);
    
    // But second IP should still work
    const allowed2 = await limiter(request2);
    expect(allowed2).toBeNull();
  });

  it('prioritizes API key over IP for identification', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      max: 2,
    });

    const request1 = createMockRequest('192.168.1.1', 'api-key-123');
    const request2 = createMockRequest('192.168.1.2', 'api-key-123');
    
    // Both requests use same API key, different IPs
    await limiter(request1);
    await limiter(request2);
    
    // Third request with same API key should be blocked
    const blocked = await limiter(request2);
    expect(blocked).toBeInstanceOf(NextResponse);
  });

  it('sets proper rate limit headers', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      max: 5,
    });

    const request = createMockRequest('192.168.1.1');
    
    // First request
    await limiter(request);
    
    // Check headers were set on request
    expect(request.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(request.headers.get('X-RateLimit-Remaining')).toBe('4');
    expect(request.headers.get('X-RateLimit-Reset')).toBeTruthy();
  });
});