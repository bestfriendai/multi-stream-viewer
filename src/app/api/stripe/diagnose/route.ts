import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Diagnosing Stripe configuration...');
    
    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_SECRET_KEY_PREFIX: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'missing',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    };

    console.log('Environment check:', envCheck);

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY not configured',
        environment: envCheck
      }, { status: 500 });
    }

    // Test Stripe connection
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      timeout: 30000,
      maxNetworkRetries: 3
    });

    console.log('Testing Stripe connection...');
    
    // Try to list a few customers to test connection
    const customers = await stripe.customers.list({ limit: 1 });
    
    console.log('Stripe connection successful');

    // Test creating a simple checkout session with minimal data
    try {
      console.log('Testing checkout session creation...');
      
      const testSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Diagnostic Test',
              },
              unit_amount: 100, // $1.00
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cancel`,
        metadata: {
          diagnostic: 'true',
        },
      });

      console.log('Test checkout session created successfully:', testSession.id);

      return NextResponse.json({
        success: true,
        environment: envCheck,
        stripe_connection: 'working',
        test_session_created: true,
        test_session_id: testSession.id,
        customers_count: customers.data.length,
        api_version: '2024-12-18.acacia',
        message: 'All Stripe functionality working correctly'
      });

    } catch (sessionError) {
      console.error('Checkout session test failed:', sessionError);
      
      return NextResponse.json({
        success: false,
        environment: envCheck,
        stripe_connection: 'working',
        test_session_created: false,
        session_error: sessionError instanceof Error ? sessionError.message : 'Unknown session error',
        customers_count: customers.data.length,
        message: 'Stripe connected but checkout session creation failed'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Stripe diagnostic failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorType = error instanceof Stripe.errors.StripeError ? error.type : 'unknown';
    
    return NextResponse.json({
      success: false,
      error: 'Stripe diagnostic failed',
      error_message: errorMessage,
      error_type: errorType,
      environment: {
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_SECRET_KEY_PREFIX: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'missing',
        NODE_ENV: process.env.NODE_ENV || 'unknown'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}