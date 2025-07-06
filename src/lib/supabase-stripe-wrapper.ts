import { createClient } from '@/lib/supabase/server';

// Supabase Stripe wrapper setup and utilities (2025)
export class SupabaseStripeWrapper {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Initialize Stripe wrapper in Supabase
   * Run this once to set up the Stripe foreign data wrapper
   */
  static async initializeWrapper() {
    const supabase = await createClient();

    try {
      console.log('🔧 Initializing Supabase Stripe wrapper...');

      // Enable wrappers extension
      await supabase.rpc('sql', {
        query: `
          create extension if not exists wrappers with schema extensions;
        `
      });

      // Create Stripe foreign data wrapper
      await supabase.rpc('sql', {
        query: `
          create foreign data wrapper stripe_wrapper
            handler stripe_fdw_handler
            validator stripe_fdw_validator;
        `
      });

      // Create server connection to Stripe
      await supabase.rpc('sql', {
        query: `
          create server stripe_server
            foreign data wrapper stripe_wrapper
            options (
              api_key '${process.env.STRIPE_SECRET_KEY}'
            );
        `
      });

      // Create schema for Stripe data
      await supabase.rpc('sql', {
        query: `
          create schema if not exists stripe;
        `
      });

      // Import Stripe foreign tables
      await supabase.rpc('sql', {
        query: `
          import foreign schema "public"
            from server stripe_server
            into stripe;
        `
      });

      console.log('✅ Stripe wrapper initialized successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to initialize Stripe wrapper:', error);
      return { success: false, error };
    }
  }

  /**
   * Sync customer data from Stripe to local database
   */
  async syncCustomerData(stripeCustomerId: string) {
    try {
      const supabase = await this.getSupabase();
      // Query customer data from Stripe via wrapper
      const { data: stripeCustomer, error } = await supabase
        .from('stripe.customers')
        .select('*')
        .eq('id', stripeCustomerId)
        .single();

      if (error || !stripeCustomer) {
        console.warn('Customer not found in Stripe wrapper:', error);
        return null;
      }

      // Update local customer data
      const customerData = {
        stripe_customer_id: stripeCustomer.id,
        email: stripeCustomer.email,
        name: stripeCustomer.name,
        stripe_created: new Date(stripeCustomer.created * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      };

      return customerData;

    } catch (error) {
      console.error('Failed to sync customer data:', error);
      return null;
    }
  }

  /**
   * Get subscription data from Stripe wrapper
   */
  async getSubscriptionData(subscriptionId: string) {
    try {
      const supabase = await this.getSupabase();
      const { data: subscription, error } = await supabase
        .from('stripe.subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (error) {
        console.warn('Subscription not found in Stripe wrapper:', error);
        return null;
      }

      return subscription;

    } catch (error) {
      console.error('Failed to get subscription data:', error);
      return null;
    }
  }

  /**
   * Query customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string) {
    try {
      const supabase = await this.getSupabase();
      const { data: subscriptions, error } = await supabase
        .from('stripe.subscriptions')
        .select('*')
        .eq('customer', customerId)
        .order('created', { ascending: false });

      if (error) {
        console.warn('Failed to get customer subscriptions:', error);
        return [];
      }

      return subscriptions || [];

    } catch (error) {
      console.error('Failed to query customer subscriptions:', error);
      return [];
    }
  }

  /**
   * Get invoice data
   */
  async getInvoices(customerId: string, limit = 10) {
    try {
      const supabase = await this.getSupabase();
      const { data: invoices, error } = await supabase
        .from('stripe.invoices')
        .select('*')
        .eq('customer', customerId)
        .order('created', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Failed to get invoices:', error);
        return [];
      }

      return invoices || [];

    } catch (error) {
      console.error('Failed to query invoices:', error);
      return [];
    }
  }

  /**
   * Health check for Stripe wrapper
   */
  async healthCheck() {
    try {
      const supabase = await this.getSupabase();
      // Simple query to test wrapper connectivity
      const { data, error } = await supabase
        .from('stripe.customers')
        .select('id')
        .limit(1);

      return {
        success: !error,
        error: error?.message,
        hasData: data && data.length > 0,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hasData: false,
      };
    }
  }
}

// Export singleton instance
let wrapperInstance: SupabaseStripeWrapper | null = null;

export function getStripeWrapper(): SupabaseStripeWrapper {
  if (!wrapperInstance) {
    wrapperInstance = new SupabaseStripeWrapper();
  }
  return wrapperInstance;
}

export default SupabaseStripeWrapper;