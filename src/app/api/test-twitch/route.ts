import { NextRequest, NextResponse } from 'next/server';
import { tokenManager } from '@/lib/twitch/tokenManager';
import { twitchAPI } from '@/lib/twitch/api';

export async function GET(request: NextRequest) {
  try {
    const tests = {
      environment: {
        clientId: !!process.env.TWITCH_CLIENT_ID,
        clientSecret: !!process.env.TWITCH_CLIENT_SECRET,
        redirectUri: process.env.TWITCH_REDIRECT_URI
      },
      token: null as any,
      apiCalls: {
        topStreams: null as any,
        specificStreams: null as any,
        searchChannels: null as any
      },
      errors: [] as string[]
    };

    // Test 1: Environment Variables
    if (!tests.environment.clientId || !tests.environment.clientSecret) {
      tests.errors.push('Missing Twitch credentials in environment variables');
      tests.summary = {
        totalErrors: 1,
        recommendation: 'Please add TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET environment variables in Vercel dashboard'
      };
      return NextResponse.json(tests, { status: 200 }); // Return 200 to show results
    }

    // Test 2: Token Generation
    try {
      const token = await tokenManager.getValidToken();
      tests.token = {
        success: true,
        tokenLength: token.length,
        isValid: await tokenManager.validateToken()
      };
    } catch (error: any) {
      tests.token = {
        success: false,
        error: error.message
      };
      tests.errors.push(`Token generation failed: ${error.message}`);
    }

    // Test 3: API Calls
    if (tests.token?.success) {
      // Test getting top streams
      try {
        const topStreams = await twitchAPI.getTopGames(5);
        tests.apiCalls.topStreams = {
          success: true,
          count: topStreams.length,
          games: topStreams.map(g => g.name)
        };
      } catch (error: any) {
        tests.apiCalls.topStreams = {
          success: false,
          error: error.message
        };
        tests.errors.push(`Top streams API failed: ${error.message}`);
      }

      // Test getting specific streams
      try {
        const streams = await twitchAPI.getStreams(['ninja', 'shroud', 'pokimane']);
        tests.apiCalls.specificStreams = {
          success: true,
          totalRequested: 3,
          liveStreams: streams.length,
          data: streams.map(s => ({
            channel: s.user_login,
            isLive: true,
            viewers: s.viewer_count,
            game: s.game_name
          }))
        };
      } catch (error: any) {
        tests.apiCalls.specificStreams = {
          success: false,
          error: error.message
        };
        tests.errors.push(`Specific streams API failed: ${error.message}`);
      }

      // Test search functionality
      try {
        const searchResults = await twitchAPI.searchChannels('gaming', 3);
        tests.apiCalls.searchChannels = {
          success: true,
          resultsCount: searchResults.length,
          channels: searchResults.map(c => c.display_name)
        };
      } catch (error: any) {
        tests.apiCalls.searchChannels = {
          success: false,
          error: error.message
        };
        tests.errors.push(`Search API failed: ${error.message}`);
      }
    }

    // Overall status
    const allTestsPassed = tests.errors.length === 0 && 
                          tests.token?.success && 
                          tests.apiCalls.topStreams?.success &&
                          tests.apiCalls.specificStreams?.success &&
                          tests.apiCalls.searchChannels?.success;

    return NextResponse.json({
      status: allTestsPassed ? 'success' : 'partial_failure',
      timestamp: new Date().toISOString(),
      tests,
      summary: {
        totalErrors: tests.errors.length,
        recommendation: allTestsPassed 
          ? 'All Twitch API integrations are working correctly!' 
          : 'Some tests failed. Check the errors array for details.'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}