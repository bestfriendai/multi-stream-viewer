import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';

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
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { limit = 50 } = body;

    // Get top games first
    const topGames = await twitchAPI.getTopGames(10);
    
    // Get top streams from various categories
    const streamPromises = [];
    
    // Get general top streams
    streamPromises.push(twitchAPI.getTopStreams({ first: 20 }));
    
    // Get top streams from top 3 games
    for (let i = 0; i < Math.min(3, topGames.length); i++) {
      const game = topGames[i];
      if (game) {
        streamPromises.push(
          twitchAPI.getTopStreams({ 
            first: 10, 
            game_id: game.id 
          })
        );
      }
    }

    // Wait for all requests
    const results = await Promise.all(streamPromises);
    
    // Combine and deduplicate streams
    const allStreams = results.flat();
    const uniqueStreams = new Map();
    
    allStreams.forEach(stream => {
      if (!uniqueStreams.has(stream.user_id)) {
        uniqueStreams.set(stream.user_id, stream);
      }
    });
    
    // Convert to array and sort by viewer count
    const streams = Array.from(uniqueStreams.values())
      .sort((a, b) => b.viewer_count - a.viewer_count)
      .slice(0, limit);

    // Add cache headers
    return NextResponse.json(
      { streams },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Trending streams endpoint error:', error);
    
    return NextResponse.json(
      { 
        streams: [],
        error: 'Service error'
      },
      { status: 200 }
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