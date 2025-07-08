'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { stripeService } from '@/services/stripe';
import { supabaseService } from '@/services/supabase';
import Header from '@/components/Header';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  features: any;
  price_monthly: number;
  price_yearly: number;
  stripe_price_monthly_id: string;
  stripe_price_yearly_id: string;
}

interface Subscription {
  id: string;
  product_name: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const products = await supabaseService.product.getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load pricing information');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const subscription = await supabaseService.subscription.getUserSubscription(user.id);
      setSubscription(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription information');
    }
  };

  const handleSubscribe = async (product: Product) => {
    if (!user) {
      window.location.href = '/sign-in?redirect_url=' + encodeURIComponent('/pricing');
      return;
    }

    setSubscribing(product.id);

    try {
      const priceId = billingCycle === 'monthly' 
        ? product.stripe_price_monthly_id 
        : product.stripe_price_yearly_id;

      const response = await fetch('/api/stripe/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          productId: product.id,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          // User not authenticated
          console.log('User not authenticated, redirecting to sign in');
          toast.error('Please sign in to continue');
          window.location.href = data.redirectUrl || '/sign-in?redirect_url=' + encodeURIComponent('/pricing');
          return;
        }
        
        throw new Error(data.message || data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Show more specific error message with toast
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Something went wrong. Please try again.';
        
      toast.error(`Checkout Error: ${errorMessage}`);
    } finally {
      setSubscribing(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal/create', {
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
      alert('Something went wrong. Please try again.');
    }
  };

  const getProductIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'pro':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'premium':
        return <Crown className="w-6 h-6 text-purple-500" />;
      default:
        return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };

  const getProductBadge = (name: string) => {
    switch (name.toLowerCase()) {
      case 'pro':
        return <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Best Value</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading pricing...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onToggleChat={() => {}} showChat={false} />
      <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Choose Your Plan
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Unlock powerful features to enhance your streaming experience
        </motion.p>
        
        {/* Billing Cycle Toggle */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}>
            Monthly
          </span>
          <motion.button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
              animate={{
                x: billingCycle === 'yearly' ? 20 : 4
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-500'}>
            Yearly
          </span>
          <AnimatePresence>
            {billingCycle === 'yearly' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Badge variant="secondary" className="ml-2">Save 17%</Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Free Plan */}
        <motion.div
          whileHover={{ scale: 1.02, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative h-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-gray-500" />
            </div>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Up to 4 simultaneous streams</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Basic layouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Standard controls</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Community support</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              disabled={subscription?.product_name === 'Free'}
            >
              {subscription?.product_name === 'Free' ? 'Current Plan' : 'Get Started'}
            </Button>
          </CardContent>
        </Card>
        </motion.div>

        {/* Dynamic Plans from Database */}
        {products.map((product, index) => {
          const isCurrentPlan = subscription?.product_name === product.name;
          const price = billingCycle === 'monthly' ? product.price_monthly : product.price_yearly;
          const features = product.features || {};
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <Card className="relative h-full">
              {getProductBadge(product.name) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {getProductBadge(product.name)}
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {getProductIcon(product.name)}
                </div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Up to {features.max_streams || 8} simultaneous streams</span>
                  </div>
                  {features.custom_layouts && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Custom layouts</span>
                    </div>
                  )}
                  {features.advanced_controls && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Advanced controls</span>
                    </div>
                  )}
                  {features.priority_support && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  )}
                  {features.analytics && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Analytics dashboard</span>
                    </div>
                  )}
                  {features.custom_branding && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Custom branding</span>
                    </div>
                  )}
                </div>
                
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" onClick={handleManageSubscription}>
                    Manage Subscription
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(product)}
                    disabled={subscribing === product.id || !isLoaded}
                  >
                    {subscribing === product.id ? 'Processing...' : `Subscribe to ${product.name}`}
                  </Button>
                )}
              </CardContent>
            </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Current Subscription Status */}
      {subscription && (
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Current Subscription</h3>
            <p className="text-blue-700">
              {subscription.product_name} plan - {subscription.status}
            </p>
            {subscription.cancel_at_period_end && (
              <p className="text-orange-600 mt-2">
                Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}