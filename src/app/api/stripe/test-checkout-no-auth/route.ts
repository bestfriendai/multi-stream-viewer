import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  timeout: 30000,
  maxNetworkRetries: 3
});

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Creating checkout session without authentication...');
    
    const { priceId, productId } = await request.json();
    console.log('📋 Request data:', { priceId, productId });

    if (!priceId || !productId) {
      console.log('❌ Missing required data');
      return NextResponse.json({ error: 'Price ID and Product ID are required' }, { status: 400 });
    }

    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('❌ NEXT_PUBLIC_APP_URL not configured');
      return NextResponse.json({ error: 'App URL not configured' }, { status: 500 });
    }

    // Create a test customer for this session
    const testCustomer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer',
      metadata: {
        test_mode: 'true',
        source: 'no_auth_test'
      },
    });

    console.log('🏪 Creating Stripe checkout session...', { priceId, customerId: testCustomer.id, productId });
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: testCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/test-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          test_customer: testCustomer.id,
          product_id: productId,
          test_mode: 'no_auth',
        },
      },
      metadata: {
        test_customer: testCustomer.id,
        product_id: productId,
        test_mode: 'no_auth',
      },
    });

    console.log('✅ Checkout session created:', { sessionId: session.id, url: session.url });
    return NextResponse.json({ 
      success: true,
      url: session.url,
      sessionId: session.id,
      customerId: testCustomer.id,
      testMode: true,
      message: 'Checkout session created without authentication'
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create checkout session',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe Checkout Session API - No Authentication Required',
    status: 'Ready for testing',
    note: 'This endpoint creates checkout sessions without requiring user authentication',
    usage: 'POST with { "priceId": "price_xxx", "productId": "product_xxx" }'
  });
}