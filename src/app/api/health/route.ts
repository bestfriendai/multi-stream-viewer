import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasRequiredEnvVars: {
        TWITCH_CLIENT_ID: !!process.env.TWITCH_CLIENT_ID,
        TWITCH_CLIENT_SECRET: !!process.env.TWITCH_CLIENT_SECRET,
        TWITCH_REDIRECT_URI: !!process.env.TWITCH_REDIRECT_URI,
        NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL
      }
    }
  });
}