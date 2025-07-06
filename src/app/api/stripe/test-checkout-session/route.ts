import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use the real live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  timeout: 30000,
  maxNetworkRetries: 3
});

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Creating checkout session with live Stripe');
    
    // Live data for testing
    const testData = {
      priceId: 'price_live_test', // Will use price_data instead
      productId: 'prod_live_test',
      customerId: 'cus_live_test'
    };

    // Create checkout session with test data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Subscription',
              description: 'Test subscription for development',
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/test-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/test-cancel`,
      metadata: {
        live_test_mode: 'true',
        product_id: testData.productId,
      },
    });

    console.log('✅ TEST: Checkout session created successfully');
    console.log('Session ID:', session.id);
    console.log('Session URL:', session.url);

    return NextResponse.json({ 
      success: true,
      url: session.url,
      sessionId: session.id,
      liveMode: true,
      message: 'Live checkout session created successfully for testing'
    });
  } catch (error) {
    console.error('❌ TEST ERROR creating checkout session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create test checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        liveMode: true
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe Live Checkout Session API',
    status: 'Ready for live testing',
    liveMode: true,
    note: 'This endpoint uses live Stripe keys for testing'
  });
}