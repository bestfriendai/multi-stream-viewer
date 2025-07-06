import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Subscription sync service for automatic Stripe to Supabase synchronization
class SubscriptionSyncService {
  private stripe: Stripe;
  private lastSyncTime: Date | null = null;
  private syncInProgress = false;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      timeout: 30000,
      maxNetworkRetries: 3,
      telemetry: false
    });
  }

  /**
   * Check if a sync is needed (runs every 6 hours)
   */
  private shouldSync(): boolean {
    if (this.syncInProgress) return false;
    if (!this.lastSyncTime) return true;
    
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    return this.lastSyncTime < sixHoursAgo;
  }

  /**
   * Sync a single subscription to Supabase
   */
  private async syncSubscription(
    subscription: Stripe.Subscription,
    profileId: string,
    customerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createClient();
      
      // Get product info
      const priceId = subscription.items.data[0]?.price?.id;
      
      if (!priceId) {
        return { success: false, error: 'Price ID not found' };
      }
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, tier')
        .or(`stripe_price_monthly_id.eq.${priceId},stripe_price_yearly_id.eq.${priceId}`)
        .single();
      
      if (productError || !product) {
        // Check if this price exists in Stripe (might be live mode vs test mode issue)
        try {
          await this.stripe.prices.retrieve(priceId);
          console.warn(`⚠️ Price ${priceId} exists in Stripe but no matching product found in Supabase. Skipping sync.`);
        } catch (stripeError) {
          console.warn(`⚠️ Price ${priceId} not found in current Stripe environment. This might be a live/test mode mismatch. Skipping sync.`);
        }
        return { success: false, error: `Product not found for price ${priceId} (skipped)` };
      }
      
      // Prepare subscription data
      const subscriptionData = {
        user_id: profileId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
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
        return { success: false, error: `Subscription upsert failed: ${subscriptionError.message}` };
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
      
      // Update profile with subscription info (handle missing columns gracefully)
      try {
        const updateData: any = {};
        
        // Only add fields that exist in the schema
        const { data: columns } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', 'profiles')
          .eq('table_schema', 'public');
        
        const columnNames = columns?.map(col => col.column_name) || [];
        
        // Check each field before adding to update data
        Object.keys(profileUpdateData).forEach(key => {
          if (columnNames.includes(key)) {
            updateData[key] = profileUpdateData[key];
          }
        });
        
        if (Object.keys(updateData).length > 0) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', profileId);

          if (profileUpdateError) {
            return { success: false, error: `Profile update failed: ${profileUpdateError.message}` };
          }
        } else {
          console.warn('No subscription columns found in profiles table. Please run the migration.');
        }
      } catch (columnError) {
        console.warn('Could not check profile columns, attempting direct update:', columnError);
        
        // Fallback: try direct update
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('id', profileId);

        if (profileUpdateError) {
          console.error('Error updating profile (fallback):', profileUpdateError);
          return { success: false, error: `Profile update failed: ${profileUpdateError.message}` };
        }
      }
      
      return { success: true };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Perform full sync of all Stripe subscriptions to Supabase
   */
  async performFullSync(): Promise<{ success: boolean; synced: number; errors: number; message: string }> {
    if (this.syncInProgress) {
      return {
        success: false,
        synced: 0,
        errors: 0,
        message: 'Sync already in progress'
      };
    }

    this.syncInProgress = true;
    let syncedCount = 0;
    let errorCount = 0;

    try {
      const supabase = await createClient();
      
      console.log('🔄 Starting automatic subscription sync...');
      
      // Get all customers from Stripe
      const customers = await this.stripe.customers.list({ limit: 100 });
      
      for (const customer of customers.data) {
        try {
          // Find the corresponding profile in Supabase
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('stripe_customer_id', customer.id)
            .single();
          
          if (profileError || !profile) {
            continue; // Skip customers without profiles
          }
          
          // Get subscriptions for this customer
          const subscriptions = await this.stripe.subscriptions.list({
            customer: customer.id,
            limit: 10
          });
          
          for (const subscription of subscriptions.data) {
            const result = await this.syncSubscription(subscription, profile.id, customer.id);
            
            if (result.success) {
              syncedCount++;
              console.log(`✅ Synced subscription for ${profile.email}`);
            } else {
              errorCount++;
              console.error(`❌ Failed to sync subscription for ${profile.email}: ${result.error}`);
            }
          }
        } catch (error) {
          errorCount++;
          console.error(`Error processing customer ${customer.id}:`, error);
        }
      }
      
      this.lastSyncTime = new Date();
      
      return {
        success: true,
        synced: syncedCount,
        errors: errorCount,
        message: `Sync completed: ${syncedCount} synced, ${errorCount} errors`
      };
      
    } catch (error) {
      return {
        success: false,
        synced: syncedCount,
        errors: errorCount + 1,
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Auto-sync if needed (called periodically)
   */
  async autoSync(): Promise<void> {
    if (this.shouldSync()) {
      const result = await this.performFullSync();
      console.log(`Auto-sync result: ${result.message}`);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { lastSync: Date | null; inProgress: boolean } {
    return {
      lastSync: this.lastSyncTime,
      inProgress: this.syncInProgress
    };
  }

  /**
   * Check if user has active subscription
   */
  async checkUserSubscription(clerkUserId: string): Promise<{
    hasActiveSubscription: boolean;
    tier: string;
    expiresAt: string | null;
    status: string;
  }> {
    try {
      const supabase = await createClient();
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, subscription_expires_at')
        .eq('clerk_user_id', clerkUserId)
        .single();
      
      if (error || !profile) {
        return {
          hasActiveSubscription: false,
          tier: 'free',
          expiresAt: null,
          status: 'none'
        };
      }
      
      return {
        hasActiveSubscription: profile.subscription_status === 'active',
        tier: profile.subscription_tier || 'free',
        expiresAt: profile.subscription_expires_at,
        status: profile.subscription_status || 'none'
      };
      
    } catch (error) {
      console.error('Error checking user subscription:', error);
      return {
        hasActiveSubscription: false,
        tier: 'free',
        expiresAt: null,
        status: 'error'
      };
    }
  }
}

// Singleton instance
let subscriptionSyncService: SubscriptionSyncService | null = null;

export function getSubscriptionSyncService(): SubscriptionSyncService {
  if (!subscriptionSyncService) {
    subscriptionSyncService = new SubscriptionSyncService();
  }
  return subscriptionSyncService;
}

export default SubscriptionSyncService;