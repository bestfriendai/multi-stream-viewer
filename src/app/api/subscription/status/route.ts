import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with subscription data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        subscription_status,
        subscription_tier,
        subscription_expires_at,
        stripe_subscription_id
      `)
      .eq('clerk_user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { 
          hasActiveSubscription: false,
          tier: 'free',
          status: 'none',
          expiresAt: null,
          error: 'Profile not found'
        },
        { status: 404 }
      );
    }

    // Check if subscription is active and not expired
    const now = new Date();
    const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
    const isExpired = expiresAt ? expiresAt < now : false;
    
    const hasActiveSubscription = 
      profile.subscription_status === 'active' && 
      !isExpired &&
      profile.subscription_tier !== 'free';

    return NextResponse.json({
      hasActiveSubscription,
      tier: profile.subscription_tier || 'free',
      status: profile.subscription_status || 'none',
      expiresAt: profile.subscription_expires_at,
      stripeSubscriptionId: profile.stripe_subscription_id,
      isExpired,
      profile: {
        id: profile.id,
        clerkUserId: userId
      }
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { 
        hasActiveSubscription: false,
        tier: 'free',
        status: 'none',
        expiresAt: null,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}