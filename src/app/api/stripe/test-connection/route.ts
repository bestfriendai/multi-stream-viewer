import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    console.log('🔍 Testing basic Stripe connection...');
    
    // Check environment
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY not configured'
      }, { status: 500 });
    }

    // Initialize Stripe with minimal configuration
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      timeout: 10000, // Shorter timeout for testing
      maxNetworkRetries: 1 // Fewer retries for faster response
    });

    console.log('Testing Stripe API connectivity...');
    
    // Try the simplest possible Stripe API call
    const balance = await stripe.balance.retrieve();
    
    console.log('✅ Stripe connection successful');

    return NextResponse.json({
      success: true,
      message: 'Stripe connection working',
      available: balance.available,
      api_version: '2025-06-30.basil',
      key_prefix: process.env.STRIPE_SECRET_KEY.substring(0, 8)
    });

  } catch (error) {
    console.error('❌ Stripe connection test failed:', error);
    
    let errorDetails = 'Unknown error';
    let errorType = 'unknown';
    
    if (error instanceof Stripe.errors.StripeError) {
      errorDetails = error.message;
      errorType = error.type;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({
      success: false,
      error: 'Stripe connection failed',
      details: errorDetails,
      type: errorType,
      key_configured: !!process.env.STRIPE_SECRET_KEY,
      key_prefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 8) : 'missing',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}