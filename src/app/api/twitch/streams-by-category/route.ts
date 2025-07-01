import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';

// Popular game categories with their Twitch IDs
const GAME_CATEGORIES = {
  'Just Chatting': '509658',
  'League of Legends': '21779',
  'VALORANT': '516575',
  'Fortnite': '33214',
  'Grand Theft Auto V': '32982',
  'Counter-Strike': '32399',
  'Minecraft': '27471',
  'Call of Duty: Warzone': '512710',
  'Apex Legends': '511224',
  'Overwatch 2': '515025',
  'World of Warcraft': '18122',
  'Dota 2': '29595',
  'FIFA 23': '1745202732',
  'Rocket League': '30921',
  'Fall Guys': '512980',
  'Among Us': '510218',
  'Dead by Daylight': '491487',
  'Rust': '263490',
  'Escape from Tarkov': '491931',
  'Path of Exile': '29307',
  'Hearthstone': '138585',
  'TeamFight Tactics': '513143',
  'Genshin Impact': '513181',
  'Lost Ark': '490100',
  'Music': '26936',
  'Art': '509660',
  'Sports': '518203',
  'Slots': '498566',
  'Chess': '743',
  'Poker': '488190'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories = Object.keys(GAME_CATEGORIES).slice(0, 10), limit = 5 } = body;

    // Check cache
    const cacheKey = `streams-by-category:${categories.join(',')}:${limit}`;
    const cachedData = twitchCache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch streams for each category
    const categoryPromises = categories.map(async (categoryName: string) => {
      const gameId = GAME_CATEGORIES[categoryName as keyof typeof GAME_CATEGORIES];
      
      if (!gameId) {
        return { category: categoryName, streams: [], gameId: null };
      }

      try {
        const streams = await twitchAPI.getTopStreams({
          game_id: gameId,
          first: limit
        });

        // Get user data for profile images
        const userIds = streams.map(s => s.user_id);
        const users = userIds.length > 0 ? await twitchAPI.getUsers(
          streams.map(s => s.user_login)
        ) : [];

        // Map profile images to streams
        const streamsWithProfiles = streams.map(stream => {
          const user = users.find(u => u.id === stream.user_id);
          return {
            ...stream,
            profile_image_url: user?.profile_image_url || null
          };
        });

        return {
          category: categoryName,
          gameId,
          streams: streamsWithProfiles
        };
      } catch (error) {
        console.error(`Error fetching streams for ${categoryName}:`, error);
        return { category: categoryName, streams: [], gameId };
      }
    });

    const results = await Promise.all(categoryPromises);

    // Get overall top streams across all categories
    const topStreamsPromise = twitchAPI.getTopStreams({ first: 20 });
    const topStreams = await topStreamsPromise;

    // Get user data for top streams
    const topUserIds = topStreams.map(s => s.user_id);
    const topUsers = topUserIds.length > 0 ? await twitchAPI.getUsers(
      topStreams.map(s => s.user_login)
    ) : [];

    const topStreamsWithProfiles = topStreams.map(stream => {
      const user = topUsers.find(u => u.id === stream.user_id);
      return {
        ...stream,
        profile_image_url: user?.profile_image_url || null
      };
    });

    const responseData = {
      categorizedStreams: results,
      topStreams: topStreamsWithProfiles,
      categories: Object.keys(GAME_CATEGORIES)
    };

    // Cache the response
    twitchCache.set(cacheKey, responseData, 300000); // 5 minute cache

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Streams by category error:', error);
    return NextResponse.json(
      { 
        categorizedStreams: [],
        topStreams: [],
        categories: Object.keys(GAME_CATEGORIES),
        error: 'Failed to fetch streams'
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