import { NextRequest, NextResponse } from 'next/server';
import { getStripeService } from '@/lib/stripe-service';
import { createClient } from '@/lib/supabase/server';

// Simple test endpoint to verify checkout session creation without auth
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing checkout session creation (no auth)...');
    
    // Parse request body
    const body = await request.json();
    const { priceId, productId } = body;

    if (!priceId || !productId) {
      return NextResponse.json(
        { error: 'priceId and productId are required' },
        { status: 400 }
      );
    }

    console.log('📋 Request data:', { priceId, productId });

    // Initialize services
    const stripeService = getStripeService();
    const supabase = await createClient();

    // Validate product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, active')
      .eq('id', productId)
      .eq('active', true)
      .single();

    if (productError || !product) {
      console.log('❌ Product not found:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create a test customer
    const testCustomer = await stripeService.getStripeInstance().customers.create({
      email: 'test@example.com',
      name: 'Test User',
      metadata: {
        test: 'true',
        created_at: new Date().toISOString(),
      },
    });

    console.log('👤 Test customer created:', testCustomer.id);

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      priceId,
      customerId: testCustomer.id,
      metadata: {
        product_id: productId,
        product_name: product.name,
        test: 'true',
      },
    });

    console.log('✅ Test checkout session created:', {
      sessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      customerId: testCustomer.id,
      message: 'Test checkout session created successfully',
    });

  } catch (error) {
    console.error('❌ Test checkout failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Test checkout session creation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Test Checkout',
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
}