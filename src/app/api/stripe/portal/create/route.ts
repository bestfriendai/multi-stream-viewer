import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getStripeService } from '@/lib/stripe-service';
import { createClient } from '@/lib/supabase/server';

// Modern Stripe customer portal endpoint (2025)
export async function POST(request: NextRequest) {
  try {
    console.log('🏪 Creating customer portal session...');
    
    // Validate authentication
    const user = await currentUser();
    if (!user) {
      console.log('❌ Authentication required');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get return URL from request body (optional)
    const body = await request.json().catch(() => ({}));
    const { returnUrl } = body;

    console.log('📋 Portal request:', { 
      userId: user.id,
      returnUrl: returnUrl || 'default'
    });

    // Get user profile with Stripe customer ID
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      console.log('❌ No Stripe customer found for user');
      return NextResponse.json(
        { error: 'No subscription found. Please subscribe first.' },
        { status: 404 }
      );
    }

    // Create portal session
    const stripeService = getStripeService();
    const portalSession = await stripeService.createPortalSession(
      profile.stripe_customer_id,
      returnUrl
    );

    console.log('✅ Portal session created:', {
      sessionId: portalSession.id,
      customerId: profile.stripe_customer_id,
      url: portalSession.url,
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url,
      sessionId: portalSession.id,
      customerId: profile.stripe_customer_id,
    });

  } catch (error) {
    console.error('❌ Portal session creation failed:', error);

    let errorMessage = 'Failed to create portal session';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('No such customer')) {
        errorMessage = 'Customer not found';
        statusCode = 404;
      } else if (error.message.includes('connection')) {
        errorMessage = 'Service temporarily unavailable';
        statusCode = 503;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Portal v2',
    status: 'ready',
    endpoints: {
      create: 'POST /api/stripe/portal/create',
    },
    timestamp: new Date().toISOString(),
  });
}