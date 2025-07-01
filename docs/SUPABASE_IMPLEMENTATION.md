# Supabase Implementation Guide for Streamyyy

## Table of Contents
1. [Overview](#overview)
2. [Authentication Setup](#authentication-setup)
3. [Database Schema](#database-schema)
4. [Stripe Integration](#stripe-integration)
5. [Implementation Steps](#implementation-steps)
6. [Security Considerations](#security-considerations)

## Overview

This guide covers implementing Supabase authentication with social login providers (Google, Twitter, Facebook, Twitch) and Stripe subscription payments for Streamyyy.

## Authentication Setup

### 1. Supabase Project Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Install Supabase client
npm install @supabase/supabase-js
```

### 2. Environment Variables

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
```

### 3. Social Provider Configuration

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `https://streamyyy.com`
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

#### Twitter OAuth Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Enable OAuth 2.0
4. Set callback URL: `https://your-project.supabase.co/auth/v1/callback`
5. Request email permissions

#### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app
3. Add Facebook Login product
4. Set OAuth redirect URI
5. Request email and public_profile permissions

#### Twitch OAuth Setup

1. Enable 2FA on your Twitch account
2. Go to [Twitch Developers](https://dev.twitch.tv/console)
3. Register new application
4. Set OAuth redirect URL
5. Select appropriate category

### 4. Supabase Configuration

Update `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "YOUR_GOOGLE_CLIENT_ID"
secret = "YOUR_GOOGLE_SECRET"

[auth.external.twitter]
enabled = true
client_id = "YOUR_TWITTER_CLIENT_ID"
secret = "YOUR_TWITTER_SECRET"

[auth.external.facebook]
enabled = true
client_id = "YOUR_FACEBOOK_CLIENT_ID"
secret = "YOUR_FACEBOOK_SECRET"

[auth.external.twitch]
enabled = true
client_id = "YOUR_TWITCH_CLIENT_ID"
secret = "YOUR_TWITCH_SECRET"
```

## Database Schema

### 1. Users Table Extension

```sql
-- Extend auth.users with profile data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Subscriptions Table

```sql
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. Plans Table

```sql
CREATE TABLE public.plans (
  id TEXT PRIMARY KEY, -- Stripe Price ID
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL, -- in cents
  price_yearly INTEGER, -- in cents
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert subscription plans
INSERT INTO public.plans (id, name, description, price_monthly, price_yearly, features, limits) VALUES
('price_free', 'Free', 'Basic multi-stream viewing', 0, 0, 
  '["Up to 4 streams", "Basic layouts", "720p quality"]'::jsonb,
  '{"max_streams": 4, "max_quality": "720p", "custom_layouts": false}'::jsonb),
('price_pro_monthly', 'Pro', 'Advanced features for power users', 999, 9990,
  '["Up to 9 streams", "Custom layouts", "1080p quality", "No ads", "Priority support"]'::jsonb,
  '{"max_streams": 9, "max_quality": "1080p", "custom_layouts": true}'::jsonb),
('price_premium_monthly', 'Premium', 'Ultimate streaming experience', 1999, 19990,
  '["Up to 16 streams", "All layouts", "4K quality", "No ads", "API access", "White-label option"]'::jsonb,
  '{"max_streams": 16, "max_quality": "4k", "custom_layouts": true, "api_access": true}'::jsonb);
```

### 4. User Preferences Table

```sql
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  default_layout TEXT DEFAULT 'grid-2x2',
  saved_layouts JSONB DEFAULT '[]'::jsonb,
  favorite_channels JSONB DEFAULT '[]'::jsonb,
  notification_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

## Stripe Integration

### 1. Stripe Products Setup

Create products in Stripe Dashboard:
- **Free Tier**: $0/month
- **Pro Tier**: $9.99/month or $99.90/year
- **Premium Tier**: $19.99/month or $199.90/year

### 2. Webhook Handler

Create `/src/app/api/webhooks/stripe/route.ts`:

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!
  
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
        
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer)
    .single()
    
  if (!profile) return
  
  await supabase.from('subscriptions').upsert({
    user_id: profile.id,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  })
  
  // Update user's subscription tier
  const tier = getTierFromPriceId(subscription.items.data[0].price.id)
  await supabase
    .from('profiles')
    .update({ 
      subscription_tier: tier,
      subscription_status: subscription.status 
    })
    .eq('id', profile.id)
}
```

### 3. Checkout Flow

```typescript
// Create checkout session
export async function createCheckoutSession(priceId: string, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', userId)
    .single()
    
  const session = await stripe.checkout.sessions.create({
    customer: profile?.stripe_customer_id || undefined,
    customer_email: profile?.email || undefined,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
    metadata: { userId }
  })
  
  return session
}
```

## Implementation Steps

### 1. Auth Context Provider

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { User, Session } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthContextType {
  user: User | null
  session: Session | null
  signInWithOAuth: (provider: 'google' | 'twitter' | 'facebook' | 'twitch') => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithOAuth = async (provider: 'google' | 'twitter' | 'facebook' | 'twitch') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, signInWithOAuth, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 2. Login Component

```typescript
// src/components/LoginModal.tsx
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { FaGoogle, FaTwitter, FaFacebook, FaTwitch } from 'react-icons/fa'

export function LoginModal() {
  const { signInWithOAuth } = useAuth()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign in to Streamyyy</h2>
      <p className="text-center text-muted-foreground">
        Choose your preferred sign-in method
      </p>
      
      <div className="space-y-3">
        <Button
          onClick={() => signInWithOAuth('google')}
          variant="outline"
          className="w-full"
        >
          <FaGoogle className="mr-2" />
          Continue with Google
        </Button>
        
        <Button
          onClick={() => signInWithOAuth('twitter')}
          variant="outline"
          className="w-full"
        >
          <FaTwitter className="mr-2" />
          Continue with Twitter
        </Button>
        
        <Button
          onClick={() => signInWithOAuth('facebook')}
          variant="outline"
          className="w-full"
        >
          <FaFacebook className="mr-2" />
          Continue with Facebook
        </Button>
        
        <Button
          onClick={() => signInWithOAuth('twitch')}
          variant="outline"
          className="w-full"
        >
          <FaTwitch className="mr-2" />
          Continue with Twitch
        </Button>
      </div>
    </div>
  )
}
```

### 3. Subscription Management

```typescript
// src/hooks/useSubscription.ts
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
        
      setSubscription(data)
      setLoading(false)
    }

    fetchSubscription()

    // Subscribe to changes
    const subscription = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        fetchSubscription
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return { subscription, loading }
}
```

## Security Considerations

### 1. Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

```sql
-- Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions table policies  
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Plans table policies
CREATE POLICY "Anyone can view plans" ON public.plans
  FOR SELECT USING (true);
```

### 2. API Security

- Always validate webhook signatures from Stripe
- Use service role key only on server-side
- Implement rate limiting on API routes
- Validate user permissions before granting access to features

### 3. Environment Variables

- Never commit `.env` files
- Use Vercel/Netlify environment variables for production
- Rotate keys regularly
- Use different keys for development and production

### 4. Data Validation

```typescript
// Validate subscription access
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single()
    
  const { data: plan } = await supabase
    .from('plans')
    .select('limits')
    .eq('name', profile?.subscription_tier || 'free')
    .single()
    
  return plan?.limits?.[feature] || false
}
```

## Next Steps

1. Set up Stripe webhook endpoint in production
2. Configure OAuth providers in Supabase dashboard
3. Create UI components for subscription management
4. Implement feature gating based on subscription tier
5. Add analytics to track conversion rates
6. Set up email notifications for subscription events