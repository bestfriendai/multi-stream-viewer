import { createClient } from '@/lib/supabase/client';

export interface Subscription {
  id: string;
  product_name: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  features: {
    max_streams?: number;
    custom_layouts?: boolean;
    advanced_controls?: boolean;
    priority_support?: boolean;
    analytics?: boolean;
    custom_branding?: boolean;
  };
  price_monthly: number;
  price_yearly: number;
  stripe_price_monthly_id: string;
  stripe_price_yearly_id: string;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = createClient();

    // Get user profile first
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Get active subscription using the stored function
    const { data, error } = await supabase
      .rpc('get_active_subscription', { user_uuid: profile.id });

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

export function getSubscriptionLimits(subscription: Subscription | null): {
  maxStreams: number;
  hasCustomLayouts: boolean;
  hasAdvancedControls: boolean;
  hasPrioritySupport: boolean;
  hasAnalytics: boolean;
  hasCustomBranding: boolean;
} {
  // Default free plan limits
  const defaultLimits = {
    maxStreams: 4,
    hasCustomLayouts: false,
    hasAdvancedControls: false,
    hasPrioritySupport: false,
    hasAnalytics: false,
    hasCustomBranding: false,
  };

  if (!subscription || subscription.status !== 'active') {
    return defaultLimits;
  }

  // These would be fetched from the product features in a real implementation
  // For now, we'll use the plan name to determine limits
  switch (subscription.product_name.toLowerCase()) {
    case 'pro':
      return {
        maxStreams: 8,
        hasCustomLayouts: true,
        hasAdvancedControls: true,
        hasPrioritySupport: true,
        hasAnalytics: false,
        hasCustomBranding: false,
      };
    case 'premium':
      return {
        maxStreams: 20,
        hasCustomLayouts: true,
        hasAdvancedControls: true,
        hasPrioritySupport: true,
        hasAnalytics: true,
        hasCustomBranding: true,
      };
    default:
      return defaultLimits;
  }
}

export function canAccessFeature(subscription: Subscription | null, feature: string): boolean {
  const limits = getSubscriptionLimits(subscription);
  
  switch (feature) {
    case 'custom_layouts':
      return limits.hasCustomLayouts;
    case 'advanced_controls':
      return limits.hasAdvancedControls;
    case 'priority_support':
      return limits.hasPrioritySupport;
    case 'analytics':
      return limits.hasAnalytics;
    case 'custom_branding':
      return limits.hasCustomBranding;
    default:
      return false;
  }
}

export function getStreamLimit(subscription: Subscription | null): number {
  const limits = getSubscriptionLimits(subscription);
  return limits.maxStreams;
}