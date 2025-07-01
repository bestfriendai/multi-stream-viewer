import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      broadcaster_id, 
      game_id, 
      period = 'week', // day, week, month, all
      limit = 20 
    } = body;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'all':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Check cache
    const cacheKey = `clips:${broadcaster_id || 'all'}:${game_id || 'all'}:${period}:${limit}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch clips
    const clips = await twitchAPI.getClips({
      broadcaster_id,
      game_id,
      first: limit,
      started_at: startDate.toISOString(),
      ended_at: endDate.toISOString()
    });

    // Get broadcaster info for clips
    const broadcasterIds = [...new Set(clips.map(c => c.broadcaster_id))];
    const users = broadcasterIds.length > 0 ? await twitchAPI.getUsers(
      clips.map(c => c.broadcaster_name)
    ) : [];

    // Enhance clips with profile images
    const enhancedClips = clips.map(clip => {
      const user = users.find(u => u.id === clip.broadcaster_id);
      return {
        ...clip,
        broadcaster_profile_image: user?.profile_image_url || null,
        embed_parent: ['streamyyy.com', 'www.streamyyy.com', 'localhost']
      };
    });

    const responseData = {
      clips: enhancedClips,
      period,
      count: enhancedClips.length
    };

    // Cache the response
    twitchCache.set(cacheKey, responseData, 600000); // 10 minute cache

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Clips endpoint error:', error);
    return NextResponse.json(
      { 
        clips: [],
        period: 'week',
        count: 0,
        error: 'Failed to fetch clips'
      },
      { status: 200 }
    );
  }
}

// OPTIONS for CORS
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