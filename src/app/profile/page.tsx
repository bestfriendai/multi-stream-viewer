'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

// Force dynamic rendering for this protected route
export const dynamic = 'force-dynamic';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Star, Settings, Calendar, CreditCard, User, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useUser();
  const { t } = useTranslation();
  const { subscription, loading, isSubscribed, isPro, isPremium, limits } = useSubscription();
  const [managingSubscription, setManagingSubscription] = useState(false);

  const handleManageSubscription = async () => {
    setManagingSubscription(true);
    
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert(t('profile.somethingWentWrong'));
    } finally {
      setManagingSubscription(false);
    }
  };

  const getSubscriptionIcon = () => {
    if (isPremium) return <Crown className="w-5 h-5 text-purple-500" />;
    if (isPro) return <Star className="w-5 h-5 text-blue-500" />;
    return <User className="w-5 h-5 text-gray-500" />;
  };

  const getSubscriptionBadge = () => {
    if (isPremium) return <Badge className="bg-purple-100 text-purple-800">{t('subscription.premium')}</Badge>;
    if (isPro) return <Badge className="bg-blue-100 text-blue-800">{t('subscription.pro')}</Badge>;
    return <Badge variant="outline">{t('subscription.free')}</Badge>;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('profile.pleaseSignIn')}</h1>
          <Link href="/sign-in">
            <Button>{t('auth.signIn')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('profile.title')}</h1>
        <p className="text-gray-600">{t('profile.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{user.fullName || 'Anonymous User'}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.emailAddresses[0]?.emailAddress}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Member since</p>
                  <p className="font-medium">{new Date(user.createdAt!).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last sign in</p>
                  <p className="font-medium">{new Date(user.lastSignInAt!).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Plan Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Simultaneous streams</span>
                    <Badge variant="secondary">{limits.maxStreams}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Custom layouts</span>
                    <Badge variant={limits.hasCustomLayouts ? "default" : "secondary"}>
                      {limits.hasCustomLayouts ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Advanced controls</span>
                    <Badge variant={limits.hasAdvancedControls ? "default" : "secondary"}>
                      {limits.hasAdvancedControls ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Priority support</span>
                    <Badge variant={limits.hasPrioritySupport ? "default" : "secondary"}>
                      {limits.hasPrioritySupport ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analytics</span>
                    <Badge variant={limits.hasAnalytics ? "default" : "secondary"}>
                      {limits.hasAnalytics ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Custom branding</span>
                    <Badge variant={limits.hasCustomBranding ? "default" : "secondary"}>
                      {limits.hasCustomBranding ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSubscriptionIcon()}
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {getSubscriptionBadge()}
                <p className="text-sm text-gray-600 mt-2">
                  {subscription?.product_name || 'Free'} Plan
                </p>
              </div>

              {loading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading subscription...</p>
                </div>
              )}

              {subscription && (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Renews</span>
                    <span className="font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>

                  {subscription.cancel_at_period_end && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-orange-800 text-sm">
                        Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {isSubscribed && (
                  <Button
                    onClick={handleManageSubscription}
                    disabled={managingSubscription}
                    className="w-full"
                    variant="outline"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {managingSubscription ? 'Loading...' : 'Manage Subscription'}
                  </Button>
                )}
                
                <Link href="/pricing">
                  <Button className="w-full" variant={isSubscribed ? "outline" : "default"}>
                    {isSubscribed ? 'View All Plans' : 'Upgrade Plan'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/saved-layouts">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Saved Layouts
                </Button>
              </Link>
              
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}