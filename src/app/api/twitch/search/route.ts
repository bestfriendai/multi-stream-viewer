import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 20 } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `search:${query.toLowerCase()}:${limit}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      });
    }

    // Search channels
    const channels = await twitchAPI.searchChannels(query, limit);

    // Get live status for found channels
    const channelIds = channels.map(c => c.broadcaster_login);
    const liveStreams = channelIds.length > 0 ? await twitchAPI.getStreams(channelIds) : [];

    // Get user data for profile images
    const users = channelIds.length > 0 ? await twitchAPI.getUsers(channelIds) : [];

    // Combine data
    const results = channels.map(channel => {
      const stream = liveStreams.find(s => s.user_id === channel.id);
      const user = users.find(u => u.id === channel.id);
      
      return {
        id: channel.id,
        login: channel.broadcaster_login,
        display_name: channel.display_name,
        profile_image_url: user?.profile_image_url || null,
        is_live: channel.is_live,
        game_name: channel.game_name,
        title: channel.title,
        tags: channel.tags || [],
        // If live, add stream data
        ...(stream && {
          stream: {
            viewer_count: stream.viewer_count,
            started_at: stream.started_at,
            thumbnail_url: stream.thumbnail_url,
            language: stream.language
          }
        })
      };
    });

    // Sort by: live first, then by viewer count, then alphabetically
    results.sort((a, b) => {
      if (a.is_live && !b.is_live) return -1;
      if (!a.is_live && b.is_live) return 1;
      
      const aViewers = a.stream?.viewer_count || 0;
      const bViewers = b.stream?.viewer_count || 0;
      if (aViewers !== bViewers) return bViewers - aViewers;
      
      return a.display_name.localeCompare(b.display_name);
    });

    const responseData = {
      results,
      query,
      count: results.length
    };

    // Cache the response
    twitchCache.set(cacheKey, responseData, 180000); // 3 minute cache

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Search endpoint error:', error);
    return NextResponse.json(
      { 
        results: [],
        query: '',
        count: 0,
        error: 'Search failed'
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