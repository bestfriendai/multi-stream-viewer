import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getStripeService } from '@/lib/stripe-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating checkout session (legacy endpoint redirect)...');
    
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, productId } = await request.json();
    if (!priceId || !productId) {
      return NextResponse.json({ error: 'Price ID and Product ID are required' }, { status: 400 });
    }

    // Use the new StripeService
    const stripeService = getStripeService();
    
    // Ensure customer exists
    const { customer } = await stripeService.ensureCustomer({
      clerkUserId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName || undefined,
    });

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      priceId,
      customerId: customer.id,
      metadata: {
        clerk_user_id: user.id,
        product_id: productId,
      },
    });

    console.log('✅ Checkout session created:', { sessionId: session.id, url: session.url });
    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}