import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_WINDOW;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  requestCounts.set(ip, record);
  
  // Clean up old entries
  if (requestCounts.size > 100) {
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
  try {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { limit = 20, game_id, language } = body;

    // Validate limit
    if (limit > 100 || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `top-streams:${limit}:${game_id || 'all'}:${language || 'all'}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(
        cachedData,
        {
          headers: {
            'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
            'X-Cache': 'HIT'
          },
        }
      );
    }

    // Get top streams from Twitch API
    let streams;
    try {
      streams = await twitchAPI.getTopStreams({
        first: limit,
        game_id,
        language
      });
    } catch (error: any) {
      console.error('Twitch API error:', error);
      
      // Return empty results on API failure
      return NextResponse.json(
        { 
          streams: [],
          error: 'Twitch API temporarily unavailable'
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30',
          },
        }
      );
    }

    // Cache the response
    const responseData = { streams };
    twitchCache.set(cacheKey, responseData, 180000); // 3 minute cache for top streams

    // Add cache headers for better performance
    return NextResponse.json(
      responseData,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
          'X-Cache': 'MISS'
        },
      }
    );
  } catch (error: any) {
    console.error('Top streams endpoint error:', error);
    
    return NextResponse.json(
      { 
        streams: [],
        error: 'Service error'
      },
      { status: 200 } // Return 200 to prevent UI errors
    );
  }
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