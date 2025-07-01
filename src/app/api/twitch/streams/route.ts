import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute per IP
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
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Validate environment variables
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      console.error('Missing Twitch API credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
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

    // Get stream data from Twitch API
    const streams = await twitchAPI.getStreams(sanitizedChannels);
    
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

    // Add cache headers
    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Twitch API error:', error);
    
    // Don't expose internal error details
    return NextResponse.json(
      { error: 'Failed to fetch stream data' },
      { status: 500 }
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