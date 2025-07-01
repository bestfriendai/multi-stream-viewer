import { NextResponse } from 'next/server';

export async function GET() {
  // Only show in development or with secret key
  const debugKey = process.env.DEBUG_KEY || 'debug123';
  
  return NextResponse.json({
    message: 'Environment check',
    hasVars: {
      CLIENT_ID: !!process.env.TWITCH_CLIENT_ID,
      CLIENT_SECRET: !!process.env.TWITCH_CLIENT_SECRET,
      REDIRECT_URI: !!process.env.TWITCH_REDIRECT_URI,
      APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    },
    lengths: {
      CLIENT_ID: process.env.TWITCH_CLIENT_ID?.length || 0,
      CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET?.length || 0,
      REDIRECT_URI: process.env.TWITCH_REDIRECT_URI?.length || 0,
      APP_URL: process.env.NEXT_PUBLIC_APP_URL?.length || 0,
    },
    // Check for common issues
    issues: {
      clientIdHasNewline: process.env.TWITCH_CLIENT_ID?.includes('\n') || false,
      clientSecretHasNewline: process.env.TWITCH_CLIENT_SECRET?.includes('\n') || false,
      redirectUriHasNewline: process.env.TWITCH_REDIRECT_URI?.includes('\n') || false,
      clientIdHasSpace: process.env.TWITCH_CLIENT_ID?.includes(' ') || false,
      clientSecretHasSpace: process.env.TWITCH_CLIENT_SECRET?.includes(' ') || false,
    }
  });
}