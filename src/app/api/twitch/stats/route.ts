import { NextRequest, NextResponse } from 'next/server';
import { twitchAPI } from '@/lib/twitch/api';
import { twitchCache } from '@/lib/twitch/cache';
import * as Sentry from '@sentry/nextjs';

// Enhanced stats interface
export interface EnhancedTwitchStats {
  channel: string;
  isLive: boolean;
  streamData: {
    viewer_count: number;
    title: string;
    game_name: string;
    language: string;
    tags: string[];
    is_mature: boolean;
    started_at: string;
    uptime?: string;
    thumbnail_url: string;
  } | null;
  channelData: {
    display_name: string;
    description: string;
    profile_image_url: string;
    view_count: number;
    follower_count?: number;
    created_at: string;
    broadcaster_type: string;
    account_age?: string;
  } | null;
  recentClips: {
    id: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    url: string;
    duration: number;
  }[];
  recentVideos: {
    id: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    url: string;
    duration: string;
    type: string;
  }[];
  gameData: {
    name: string;
    box_art_url: string;
  } | null;
  metrics: {
    averageViewers?: number;
    peakViewers?: number;
    streamFrequency?: string;
    contentRating: 'family' | 'mature';
    primaryLanguage: string;
  };
}

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

function calculateUptime(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function calculateAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
  const diffMonths = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  
  if (diffYears > 0) {
    return `${diffYears}y ${diffMonths}m`;
  } else {
    return `${diffMonths}m`;
  }
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

    // Validate environment variables
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      console.error('Missing Twitch API credentials');
      return NextResponse.json(
        { error: 'Twitch API not configured' },
        { status: 500 }
      );
    }

    const { channels }: { channels: string[] } = await request.json();

    if (!Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json(
        { error: 'Channels array is required' },
        { status: 400 }
      );
    }

    if (channels.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 channels allowed per request' },
        { status: 400 }
      );
    }

    const results: EnhancedTwitchStats[] = await Promise.all(
      channels.map(async (channel) => {
        const channelLower = channel.toLowerCase();
        
        try {
          // Check cache first
          const cacheKey = `enhanced_stats_${channelLower}`;
          const cached = twitchCache.get(cacheKey);
          if (cached) {
            return cached;
          }

          // Get basic stream and user data
          const [streamData, userData] = await Promise.all([
            twitchAPI.getStreams([channelLower]),
            twitchAPI.getUsers([channelLower])
          ]);

          const stream = streamData[0] || null;
          const user = userData[0] || null;

          if (!user) {
            // Channel doesn't exist
            const errorResult: EnhancedTwitchStats = {
              channel: channelLower,
              isLive: false,
              streamData: null,
              channelData: null,
              recentClips: [],
              recentVideos: [],
              gameData: null,
              metrics: {
                contentRating: 'family',
                primaryLanguage: 'en'
              }
            };

            // Cache for 5 minutes
            twitchCache.set(cacheKey, errorResult, 5 * 60 * 1000);
            return errorResult;
          }

          // Get additional data if channel exists
          const [clips, videos, gameData, followerData] = await Promise.all([
            // Get recent clips (last 7 days)
            twitchAPI.getClips({
              broadcaster_id: user.id,
              first: 5,
              started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }).catch(() => []),
            
            // Get recent videos
            twitchAPI.getVideos({
              user_id: user.id,
              first: 3,
              type: 'archive'
            }).catch(() => []),
            
            // Get game data if streaming
            stream?.game_id ? twitchAPI.getGames([stream.game_id]).catch(() => []) : Promise.resolve([]),
            
            // Get follower count (this might fail due to permissions)
            twitchAPI.getUserFollows({
              to_id: user.id,
              first: 1
            }).catch(() => [])
          ]);

          const game = gameData[0] || null;

          const result: EnhancedTwitchStats = {
            channel: channelLower,
            isLive: !!stream,
            streamData: stream ? {
              viewer_count: stream.viewer_count,
              title: stream.title,
              game_name: stream.game_name,
              language: stream.language,
              tags: stream.tags || [],
              is_mature: stream.is_mature,
              started_at: stream.started_at,
              uptime: calculateUptime(stream.started_at),
              thumbnail_url: stream.thumbnail_url
            } : null,
            channelData: {
              display_name: user.display_name,
              description: user.description,
              profile_image_url: user.profile_image_url,
              view_count: user.view_count,
              follower_count: followerData.length > 0 ? undefined : undefined, // Follower count requires special permissions
              created_at: user.created_at,
              broadcaster_type: user.broadcaster_type,
              account_age: calculateAccountAge(user.created_at)
            },
            recentClips: clips.slice(0, 5).map(clip => ({
              id: clip.id,
              title: clip.title,
              view_count: clip.view_count,
              created_at: clip.created_at,
              thumbnail_url: clip.thumbnail_url,
              url: clip.url,
              duration: clip.duration
            })),
            recentVideos: videos.slice(0, 3).map(video => ({
              id: video.id,
              title: video.title,
              view_count: video.view_count,
              created_at: video.created_at,
              thumbnail_url: video.thumbnail_url,
              url: video.url,
              duration: video.duration,
              type: video.type
            })),
            gameData: game ? {
              name: game.name,
              box_art_url: game.box_art_url
            } : null,
            metrics: {
              contentRating: stream?.is_mature ? 'mature' : 'family',
              primaryLanguage: stream?.language || user.description.includes('português') ? 'pt' : 'en',
              streamFrequency: videos.length > 10 ? 'daily' : videos.length > 3 ? 'regular' : 'occasional'
            }
          };

          // Cache for 2 minutes if live, 10 minutes if offline
          const cacheTime = stream ? 2 * 60 * 1000 : 10 * 60 * 1000;
          twitchCache.set(cacheKey, result, cacheTime);

          return result;

        } catch (error) {
          console.error(`Error fetching enhanced stats for ${channelLower}:`, error);
          
          // Capture error in Sentry
          Sentry.captureException(error, {
            tags: {
              api: 'twitch.stats',
              channel: channelLower
            }
          });

          // Return basic error result
          const errorResult: EnhancedTwitchStats = {
            channel: channelLower,
            isLive: false,
            streamData: null,
            channelData: null,
            recentClips: [],
            recentVideos: [],
            gameData: null,
            metrics: {
              contentRating: 'family',
              primaryLanguage: 'en'
            }
          };

          return errorResult;
        }
      })
    );

    return NextResponse.json({
      results,
      timestamp: new Date().toISOString(),
      cache_info: {
        live_streams_cache: '2 minutes',
        offline_channels_cache: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Enhanced Twitch stats API error:', error);
    
    Sentry.captureException(error, {
      tags: { api: 'twitch.stats' }
    });

    return NextResponse.json(
      { error: 'Failed to fetch enhanced Twitch stats' },
      { status: 500 }
    );
  }
}