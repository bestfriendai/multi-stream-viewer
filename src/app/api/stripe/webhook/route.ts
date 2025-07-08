import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  timeout: 30000,
  maxNetworkRetries: 3
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// In-memory cache for processed events (in production, use Redis or database)
const processedEvents = new Map<string, { timestamp: number; processed: boolean }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [eventId, data] of processedEvents.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      processedEvents.delete(eventId);
    }
  }
}, 60 * 60 * 1000); // Clean every hour

async function isEventProcessed(eventId: string): Promise<boolean> {
  // Check in-memory cache first
  const cached = processedEvents.get(eventId);
  if (cached) {
    return cached.processed;
  }

  // In production, you might want to check a database table
  // For now, we'll use the in-memory cache
  return false;
}

async function markEventAsProcessed(eventId: string): Promise<void> {
  processedEvents.set(eventId, {
    timestamp: Date.now(),
    processed: true
  });

  // In production, you might want to store this in a database
  // Example:
  // await supabase.from('processed_webhook_events').insert({
  //   event_id: eventId,
  //   processed_at: new Date().toISOString()
  // });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Check if event has already been processed (idempotency)
  if (await isEventProcessed(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`);
    return NextResponse.json({ received: true, message: 'Event already processed' }, { status: 200 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the user profile by stripe_customer_id
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single();

        if (profileError || !profile) {
          console.error('Profile not found for customer:', subscription.customer);
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Get product info
        const priceId = subscription.items.data[0]?.price?.id;
        
        if (!priceId) {
          console.error('Price ID not found in subscription:', subscription.id);
          return NextResponse.json({ error: 'Price ID not found' }, { status: 400 });
        }
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id')
          .or(`stripe_price_monthly_id.eq.${priceId},stripe_price_yearly_id.eq.${priceId}`)
          .single();

        if (productError || !product) {
          console.error('Product not found for price:', priceId);
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const subscriptionData = {
          user_id: profile.id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          product_id: product.id,
          price_id: priceId,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: (subscription as any).cancel_at_period_end,
          canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
          trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
          trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
        };

        // Update or insert subscription record
        if (event.type === 'customer.subscription.created') {
          await supabase.from('subscriptions').insert(subscriptionData);
        } else {
          await supabase
            .from('subscriptions')
            .update(subscriptionData)
            .eq('stripe_subscription_id', subscription.id);
        }

        // Update profile with subscription status
        const profileUpdateData: any = {
          stripe_subscription_id: subscription.id,
          updated_at: new Date().toISOString()
        };

        // Determine subscription status and tier
        if (subscription.status === 'active') {
          profileUpdateData.subscription_status = 'active';
          profileUpdateData.subscription_expires_at = new Date((subscription as any).current_period_end * 1000).toISOString();
          
          // Get product details to determine tier
          const { data: productDetails } = await supabase
            .from('products')
            .select('name, tier')
            .eq('id', product.id)
            .single();
          
          if (productDetails) {
            profileUpdateData.subscription_tier = productDetails.tier || 'pro';
          } else {
            // Fallback: determine tier from product name or price
            profileUpdateData.subscription_tier = 'pro';
          }
        } else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
          profileUpdateData.subscription_status = 'canceled';
          profileUpdateData.subscription_tier = 'free';
          profileUpdateData.subscription_expires_at = null;
        } else if (subscription.status === 'past_due') {
          profileUpdateData.subscription_status = 'past_due';
          // Keep current tier but mark as past due
        } else {
          profileUpdateData.subscription_status = 'inactive';
          profileUpdateData.subscription_tier = 'free';
          profileUpdateData.subscription_expires_at = null;
        }

        // Update the profile
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('id', profile.id);

        if (profileUpdateError) {
          console.error('Error updating profile subscription status:', profileUpdateError);
        } else {
          console.log(`Profile updated for user ${profile.id}: ${profileUpdateData.subscription_status}`);
        }

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // The subscription should already be handled by the subscription events above
        // This is just for logging successful checkouts
        console.log('Checkout session completed:', session.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed after successful processing
    await markEventAsProcessed(event.id);
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}