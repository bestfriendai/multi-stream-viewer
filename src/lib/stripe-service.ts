import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Centralized Stripe service following 2025 best practices
class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      timeout: 30000,
      maxNetworkRetries: 3,
      telemetry: false // Disable telemetry for better performance
    });
  }

  /**
   * Create or retrieve customer with proper error handling
   */
  async ensureCustomer(params: {
    clerkUserId: string;
    email?: string;
    name?: string;
  }): Promise<{ customer: Stripe.Customer; isNew: boolean }> {
    const supabase = await createClient();

    // Check if customer exists in our database
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('clerk_user_id', params.clerkUserId)
      .single();

    if (profile?.stripe_customer_id) {
      try {
        // Retrieve existing customer
        const customer = await this.stripe.customers.retrieve(profile.stripe_customer_id) as Stripe.Customer;
        return { customer, isNew: false };
      } catch (error) {
        console.warn('Existing customer not found in Stripe, creating new one:', error);
      }
    }

    // Create new customer
    const customerData: Stripe.CustomerCreateParams = {
      metadata: {
        clerk_user_id: params.clerkUserId,
        created_at: new Date().toISOString(),
      },
    };

    if (params.email) {
      customerData.email = params.email;
    }

    if (params.name) {
      customerData.name = params.name;
    }

    const customer = await this.stripe.customers.create(customerData);

    // Update profile with new customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('clerk_user_id', params.clerkUserId);

    return { customer, isNew: true };
  }

  /**
   * Create checkout session with modern best practices
   */
  async createCheckoutSession(params: {
    priceId: string;
    customerId: string;
    metadata?: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
    allowPromotionCodes?: boolean;
    automaticTax?: boolean;
    customerUpdate?: {
      address?: 'auto' | 'never';
      name?: 'auto' | 'never';
      shipping?: 'auto' | 'never';
    };
  }): Promise<Stripe.Checkout.Session> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: params.customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl || `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${baseUrl}/pricing`,
      
      // Modern features
      allow_promotion_codes: params.allowPromotionCodes ?? true,
      billing_address_collection: 'auto',
      
      // Enhanced metadata
      metadata: {
        created_at: new Date().toISOString(),
        source: 'checkout_v2',
        ...params.metadata,
      },

      // Subscription-specific settings
      subscription_data: {
        metadata: params.metadata || {},
      },
    };

    // Add automatic tax if enabled
    if (params.automaticTax) {
      sessionParams.automatic_tax = { enabled: true };
    }

    // Add customer update settings
    if (params.customerUpdate) {
      sessionParams.customer_update = params.customerUpdate;
    }

    return await this.stripe.checkout.sessions.create(sessionParams);
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(customerId: string, returnUrl?: string): Promise<Stripe.BillingPortal.Session> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${baseUrl}/dashboard`,
    });
  }

  /**
   * Retrieve subscription with enhanced data
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer', 'items.data.price.product'],
      });
    } catch (error) {
      console.error('Failed to retrieve subscription:', error);
      return null;
    }
  }

  /**
   * Test connection to Stripe API
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.stripe.balance.retrieve();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  /**
   * Get raw Stripe instance for advanced operations
   */
  getStripeInstance(): Stripe {
    return this.stripe;
  }
}

// Singleton instance
let stripeService: StripeService | null = null;

export function getStripeService(): StripeService {
  if (!stripeService) {
    stripeService = new StripeService();
  }
  return stripeService;
}

export default StripeService;