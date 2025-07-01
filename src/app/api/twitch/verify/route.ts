import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check environment variables
  const hasClientId = !!process.env.TWITCH_CLIENT_ID;
  const hasClientSecret = !!process.env.TWITCH_CLIENT_SECRET;
  const clientIdLength = process.env.TWITCH_CLIENT_ID?.length || 0;
  const clientSecretLength = process.env.TWITCH_CLIENT_SECRET?.length || 0;

  // Basic verification response
  return NextResponse.json({
    status: 'checking',
    environment: {
      hasClientId,
      hasClientSecret,
      clientIdLength,
      clientSecretLength,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    },
    timestamp: new Date().toISOString(),
    recommendation: (!hasClientId || !hasClientSecret) 
      ? 'Environment variables are missing. Please add TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in Vercel dashboard.'
      : 'Environment variables are present.'
  });
}