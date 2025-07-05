'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserSubscription, getSubscriptionLimits, canAccessFeature, getStreamLimit } from '@/lib/subscription';
import type { Subscription } from '@/lib/subscription';

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user, isLoaded]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const sub = await getUserSubscription(user.id);
      setSubscription(sub);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSubscription();
  };

  // Helper functions
  const isSubscribed = subscription?.status === 'active';
  const isPro = subscription?.product_name?.toLowerCase() === 'pro';
  const isPremium = subscription?.product_name?.toLowerCase() === 'premium';
  const limits = getSubscriptionLimits(subscription);
  const streamLimit = getStreamLimit(subscription);

  const hasFeature = (feature: string) => canAccessFeature(subscription, feature);

  return {
    subscription,
    loading,
    error,
    refetch,
    isSubscribed,
    isPro,
    isPremium,
    limits,
    streamLimit,
    hasFeature,
  };
}