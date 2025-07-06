import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }
  
  // Additional security: Check for debug key in headers
  const debugKey = request.headers.get('x-debug-key');
  const expectedKey = process.env.DEBUG_KEY;
  
  if (expectedKey && debugKey !== expectedKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    message: 'Environment check',
    hasVars: {
      // Twitch
      TWITCH_CLIENT_ID: !!process.env.TWITCH_CLIENT_ID,
      TWITCH_CLIENT_SECRET: !!process.env.TWITCH_CLIENT_SECRET,
      TWITCH_REDIRECT_URI: !!process.env.TWITCH_REDIRECT_URI,
      // App
      APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      // Supabase
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      // Stripe
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      // Clerk
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
      CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    lengths: {
      TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID?.length || 0,
      TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET?.length || 0,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY?.length || 0,
      STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
      APP_URL: process.env.NEXT_PUBLIC_APP_URL?.length || 0,
    },
    // Check for common issues
    issues: {
      stripeSecretKeyFormat: process.env.STRIPE_SECRET_KEY?.startsWith('sk_') || false,
      stripePublishableKeyFormat: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_') || false,
      supabaseUrlFormat: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false,
      appUrlFormat: process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') || false,
    }
  });
}