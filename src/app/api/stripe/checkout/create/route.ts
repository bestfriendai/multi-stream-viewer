import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getStripeService } from '@/lib/stripe-service';
import { createClient } from '@/lib/supabase/server';

// Modern Stripe checkout session creation endpoint (2025)
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Creating checkout session v2...');
    
    // Validate authentication
    const user = await currentUser();
    if (!user) {
      console.log('❌ Authentication required');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { priceId, productId, metadata = {} } = body;

    if (!priceId || !productId) {
      console.log('❌ Missing required parameters');
      return NextResponse.json(
        { error: 'priceId and productId are required' },
        { status: 400 }
      );
    }

    console.log('📋 Request data:', { 
      priceId, 
      productId, 
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress 
    });

    // Initialize services
    const stripeService = getStripeService();
    const supabase = await createClient();

    // Validate product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, active')
      .eq('id', productId)
      .eq('active', true)
      .single();

    if (productError || !product) {
      console.log('❌ Product not found or inactive:', productError);
      return NextResponse.json(
        { error: 'Product not found or not available' },
        { status: 404 }
      );
    }

    // Ensure customer exists in Stripe
    const { customer, isNew } = await stripeService.ensureCustomer({
      clerkUserId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.fullName || '',
    });

    console.log(`👤 Customer ${isNew ? 'created' : 'retrieved'}:`, customer.id);

    // Create checkout session with modern parameters
    const session = await stripeService.createCheckoutSession({
      priceId,
      customerId: customer.id,
      metadata: {
        clerk_user_id: user.id,
        product_id: productId,
        product_name: product.name,
        customer_email: user.emailAddresses[0]?.emailAddress || '',
        ...metadata,
      },
      allowPromotionCodes: true,
      automaticTax: true, // Enable automatic tax calculation
      customerUpdate: {
        address: 'auto',
        name: 'auto',
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      customerId: customer.id,
      url: session.url,
    });

    // Return session details
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      customerId: customer.id,
      isNewCustomer: isNew,
    });

  } catch (error) {
    console.error('❌ Checkout session creation failed:', error);

    // Handle different error types
    let errorMessage = 'Failed to create checkout session';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('No such price')) {
        errorMessage = 'Invalid price configuration';
        statusCode = 400;
      } else if (error.message.includes('No such product')) {
        errorMessage = 'Product not found';
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
  try {
    const stripeService = getStripeService();
    const { success, error } = await stripeService.testConnection();

    return NextResponse.json({
      service: 'Stripe Checkout v2',
      status: success ? 'healthy' : 'unhealthy',
      error: error || undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: 'Stripe Checkout v2',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}