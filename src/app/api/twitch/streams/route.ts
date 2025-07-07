import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';
import { sentryApiMonitor } from '@/lib/sentry-api-monitor';
import * as Sentry from '@sentry/nextjs';

// Rate limiting with more conservative limits
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute per IP (more conservative)
const RATE_WINDOW = 60000; // 1 minute

// Global rate limit for all requests
let globalRequestCount = 0;
let globalResetTime = Date.now() + RATE_WINDOW;
const GLOBAL_RATE_LIMIT = 50; // Total requests per minute across all users

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // Check global rate limit first
  if (now > globalResetTime) {
    globalRequestCount = 0;
    globalResetTime = now + RATE_WINDOW;
  }
  
  if (globalRequestCount >= GLOBAL_RATE_LIMIT) {
    return false;
  }
  
  // Check per-IP rate limit
  const record = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_WINDOW;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  globalRequestCount++;
  requestCounts.set(ip, record);
  
  // Clean up old entries to prevent memory leak
  if (requestCounts.size > 1000) {
    const oldestTime = now - RATE_WINDOW * 2;
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < oldestTime) {
        requestCounts.delete(key);
      }
    }
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  return await sentryApiMonitor.monitorApiCall(
    'twitch.streams',
    'POST',
    '/api/twitch/streams',
    async () => {
      // Check rate limit
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      // Add request context to Sentry
      Sentry.setTag('request.ip', ip);
      Sentry.setTag('request.user_agent', userAgent.substring(0, 100));
      
      if (!checkRateLimit(ip)) {
      const retryAfter = Math.ceil((globalResetTime - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter,
          message: 'Too many requests. Please wait before trying again.'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(globalResetTime).toISOString()
          }
        }
      );
    }

    // Validate environment variables
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      console.error('Missing Twitch API credentials in environment');
      console.error('TWITCH_CLIENT_ID exists:', !!process.env.TWITCH_CLIENT_ID);
      console.error('TWITCH_CLIENT_SECRET exists:', !!process.env.TWITCH_CLIENT_SECRET);
      
      // Return empty results instead of error to prevent UI breaks
      const { channels = [] } = await request.json();
      const emptyResults = channels.map((channel: string) => ({
        channel: channel.toLowerCase(),
        isLive: false,
        data: null
      }));
      
      return NextResponse.json(
        { 
          results: emptyResults,
          error: 'Twitch integration not configured'
        },
        { status: 200 } // Return 200 to prevent UI errors
      );
    }

    // Parse request body
    const body = await request.json();
    const { channels } = body;

    // Validate input
    if (!Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json(
        { error: 'Invalid channels parameter' },
        { status: 400 }
      );
    }

    if (channels.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 channels allowed per request' },
        { status: 400 }
      );
    }

    // Sanitize channel names
    const sanitizedChannels = channels.map(channel => 
      String(channel).toLowerCase().trim()
    ).filter(channel => 
      channel.length > 0 && channel.length <= 25 && /^[a-zA-Z0-9_]+$/.test(channel)
    );

    if (sanitizedChannels.length === 0) {
      return NextResponse.json(
        { error: 'No valid channel names provided' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `streams:${sanitizedChannels.sort().join(',')}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(
        cachedData,
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            'X-Cache': 'HIT'
          },
        }
      );
    }

    // Get stream data from Twitch API
    let streams;
    try {
      streams = await twitchAPI.getStreams(sanitizedChannels);
    } catch (error: any) {
      console.error('Twitch API call failed:', error);
      
      // Return offline status for all channels on API failure
      const offlineResults = sanitizedChannels.map(channel => ({
        channel: channel,
        isLive: false,
        data: null
      }));
      
      return NextResponse.json(
        { 
          results: offlineResults,
          error: 'Twitch API temporarily unavailable'
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30',
          },
        }
      );
    }
    
    // Create a map for easy lookup
    const streamMap = new Map(
      streams.map(stream => [stream.user_login.toLowerCase(), stream])
    );

    // Build response with live status for all requested channels
    const results = sanitizedChannels.map(channel => ({
      channel: channel,
      isLive: streamMap.has(channel),
      data: streamMap.get(channel) || null
    }));

    // Cache the response
    const responseData = { results };
    twitchCache.set(cacheKey, responseData, 120000); // 2 minute cache

    // Add cache headers
    return NextResponse.json(
      responseData,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'X-Cache': 'MISS'
        },
      }
    );
    },
    {
      timeout: 3000,
      retryCount: 1,
      expectedDuration: 800,
      critical: true
    }
  );
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}