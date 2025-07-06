import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Using test keys for safe testing - this will use the test key from your environment
const testKey = process.env.STRIPE_SECRET_KEY?.replace('sk_live_', 'sk_test_') || 'sk_test_placeholder';
const stripe = new Stripe(testKey, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 TEST MODE: Creating checkout session with test data');
    
    // Test data - safe to use
    const testData = {
      priceId: 'price_test_123', // Test price ID
      productId: 'prod_test_123', // Test product ID
      customerId: 'cus_test_123' // Test customer ID
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
        test_mode: 'true',
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
      testMode: true,
      message: 'Test checkout session created successfully'
    });
  } catch (error) {
    console.error('❌ TEST ERROR creating checkout session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create test checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        testMode: true
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe Test Checkout Session API',
    status: 'Ready for testing',
    testMode: true,
    note: 'This endpoint is for testing only'
  });
}