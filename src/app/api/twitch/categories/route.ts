import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = parseInt(searchParams.get('first') || '100');
    const after = searchParams.get('after') || undefined;
    
    // Cache key includes pagination
    const cacheKey = `categories:${first}:${after || 'start'}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Get top categories/games from Twitch
    const games = await twitchAPI.getTopGames(first);
    
    const response = {
      data: games,
      pagination: {} // TODO: Add pagination support to getTopGames method
    };

    const categories = response.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      box_art_url: category.box_art_url,
      igdb_id: category.igdb_id
    }));

    const result = {
      categories,
      pagination: response.pagination
    };
    
    // Cache for 5 minutes
    twitchCache.set(cacheKey, result, 5 * 60 * 1000);
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }
    
    // Cache search results
    const cacheKey = `category-search:${query}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Search categories - using searchChannels as a proxy since there's no searchCategories method
    const channels = await twitchAPI.searchChannels(query, 50);
    
    // Transform channel data to category-like structure
    const response = {
      data: channels.map(channel => ({
        id: channel.game_id || channel.id,
        name: channel.game_name || channel.display_name,
        box_art_url: channel.thumbnail_url || ''
      }))
    };

    const categories = response.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      box_art_url: category.box_art_url
    }));

    const result = { categories };
    
    // Cache for 5 minutes
    twitchCache.set(cacheKey, result, 5 * 60 * 1000);
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error searching categories:', error);
    return NextResponse.json(
      { error: 'Failed to search categories' },
      { status: 500 }
    );
  }
}