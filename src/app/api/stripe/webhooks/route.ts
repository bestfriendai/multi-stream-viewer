import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeService } from '@/lib/stripe-service';
import { createClient } from '@/lib/supabase/server';

// Modern Stripe webhook handler (2025)
export async function POST(request: NextRequest) {
  try {
    console.log('🪝 Processing Stripe webhook...');

    // Get request body and signature
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ Missing webhook secret');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Verify webhook signature
    const stripe = getStripeService().getStripeInstance();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook verified:', event.type);

    // Process webhook event
    const result = await processWebhookEvent(event);

    if (!result.success) {
      console.error('❌ Webhook processing failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true, processed: true });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Process different webhook event types
 */
async function processWebhookEvent(event: any): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    switch (event.type) {
      // Customer events
      case 'customer.created':
      case 'customer.updated':
        await handleCustomerEvent(event.data.object, supabase);
        break;

      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object, supabase);
        break;

      // Checkout events
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabase);
        break;

      // Invoice events
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, supabase);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, supabase);
        break;

      // Payment method events
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object, supabase);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return { success: true };

  } catch (error) {
    console.error('Error processing webhook event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handle customer creation/updates
 */
async function handleCustomerEvent(customer: any, supabase: any) {
  console.log('👤 Processing customer event:', customer.id);

  // Find profile by Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, clerk_user_id')
    .eq('stripe_customer_id', customer.id)
    .single();

  if (profile) {
    // Update existing profile
    await supabase
      .from('profiles')
      .update({
        email: customer.email,
        stripe_created: new Date(customer.created * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customer.id);
  }
}

/**
 * Handle subscription lifecycle events
 */
async function handleSubscriptionEvent(subscription: any, supabase: any) {
  console.log('💳 Processing subscription event:', subscription.id);

  // Get customer profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (!profile) {
    console.warn('Profile not found for customer:', subscription.customer);
    return;
  }

  // Get product information
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) {
    console.warn('No price ID found in subscription');
    return;
  }

  const { data: product } = await supabase
    .from('products')
    .select('id, name')
    .or(`stripe_price_monthly_id.eq.${priceId},stripe_price_yearly_id.eq.${priceId}`)
    .single();

  // Prepare subscription data
  const subscriptionData = {
    user_id: profile.id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    status: subscription.status,
    product_id: product?.id,
    product_name: product?.name,
    price_id: priceId,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  // Upsert subscription
  await supabase
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id'
    });
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: any, supabase: any) {
  console.log('🎉 Processing checkout completion:', session.id);

  // Additional logic for checkout completion
  // e.g., send welcome email, activate features, etc.
  
  if (session.metadata?.clerk_user_id) {
    // Log successful checkout
    console.log('User completed checkout:', {
      userId: session.metadata.clerk_user_id,
      sessionId: session.id,
      customerId: session.customer,
    });
  }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  console.log('💰 Processing successful payment:', invoice.id);

  // Update subscription status if needed
  if (invoice.subscription) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription);
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: any, supabase: any) {
  console.log('⚠️ Processing failed payment:', invoice.id);

  // Update subscription status
  if (invoice.subscription) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription);
  }
}

/**
 * Handle payment method attachment
 */
async function handlePaymentMethodAttached(paymentMethod: any, supabase: any) {
  console.log('💳 Processing payment method attachment:', paymentMethod.id);

  // Optional: Store payment method information
  // This is useful for displaying saved payment methods
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Webhooks v2',
    status: 'ready',
    supportedEvents: [
      'customer.created',
      'customer.updated',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'checkout.session.completed',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
      'payment_method.attached',
    ],
    timestamp: new Date().toISOString(),
  });
}