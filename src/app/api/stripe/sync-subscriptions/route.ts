import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  timeout: 30000,
  maxNetworkRetries: 3
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    console.log('🔄 Starting automatic Stripe to Supabase sync...');
    
    // Get all customers from Stripe
    const customers = await stripe.customers.list({ limit: 100 });
    
    let syncedCount = 0;
    let errorCount = 0;
    
    for (const customer of customers.data) {
      try {
        // Find the corresponding profile in Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('stripe_customer_id', customer.id)
          .single();
        
        if (profileError || !profile) {
          console.log(`⚠️  No profile found for customer ${customer.id}`);
          continue;
        }
        
        // Get subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 10
        });
        
        for (const subscription of subscriptions.data) {
          // Get product info
          const priceId = subscription.items.data[0]?.price?.id;
          
          if (!priceId) {
            console.error(`Price ID not found for subscription ${subscription.id}`);
            continue;
          }
          
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('id, name, tier')
            .or(`stripe_price_monthly_id.eq.${priceId},stripe_price_yearly_id.eq.${priceId}`)
            .single();
          
          if (productError || !product) {
            console.error(`Product not found for price ${priceId}`);
            continue;
          }
          
          // Prepare subscription data
          const subscriptionData = {
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customer.id,
            status: subscription.status,
            product_id: product.id,
            price_id: priceId,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: (subscription as any).cancel_at_period_end,
            canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
            trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
            trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString()
          };
          
          // Upsert subscription
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert(subscriptionData, {
              onConflict: 'stripe_subscription_id'
            });
          
          if (subscriptionError) {
            console.error(`Error upserting subscription ${subscription.id}:`, subscriptionError);
            errorCount++;
            continue;
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
            profileUpdateData.subscription_tier = product.tier || 'pro';
          } else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
            profileUpdateData.subscription_status = 'canceled';
            profileUpdateData.subscription_tier = 'free';
            profileUpdateData.subscription_expires_at = null;
          } else if (subscription.status === 'past_due') {
            profileUpdateData.subscription_status = 'past_due';
            // Keep existing tier
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
            console.error(`Error updating profile for user ${profile.id}:`, profileUpdateError);
            errorCount++;
          } else {
            console.log(`✅ Synced subscription for ${profile.email}: ${subscription.status}`);
            syncedCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing customer ${customer.id}:`, error);
        errorCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscription sync completed',
      synced: syncedCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error during subscription sync:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Sync failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get subscription statistics
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('status, created_at')
      .order('created_at', { ascending: false });
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_tier')
      .not('stripe_customer_id', 'is', null);
    
    if (subsError || profilesError) {
      throw new Error('Failed to fetch sync status');
    }
    
    const stats = {
      total_subscriptions: subscriptions?.length || 0,
      active_subscriptions: subscriptions?.filter(s => s.status === 'active').length || 0,
      profiles_with_stripe: profiles?.length || 0,
      active_profiles: profiles?.filter(p => p.subscription_status === 'active').length || 0,
      last_sync: subscriptions?.[0]?.created_at || null
    };
    
    return NextResponse.json({
      success: true,
      stats,
      message: 'Sync status retrieved successfully'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}