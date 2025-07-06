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
      
      // First, trigger auto-sync to ensure data is up to date
      try {
        await fetch('/api/stripe/auto-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ force: false }) // Auto-sync only if needed
        });
      } catch (syncError) {
        console.warn('Auto-sync failed, continuing with existing data:', syncError);
      }
      
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

  const forceSync = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Force sync with Stripe
      const syncResponse = await fetch('/api/stripe/auto-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true })
      });
      
      if (!syncResponse.ok) {
        throw new Error('Failed to sync subscription data');
      }
      
      // Refetch subscription after sync
      await fetchSubscription();
      
    } catch (err) {
      console.error('Error forcing sync:', err);
      setError('Failed to sync subscription data');
      setLoading(false);
    }
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
    forceSync,
    isSubscribed,
    isPro,
    isPremium,
    limits,
    streamLimit,
    hasFeature,
  };
}