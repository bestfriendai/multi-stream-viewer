-- Migration to add subscription tracking to profiles table
-- Run this in Supabase SQL Editor

-- Add subscription columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_name TEXT,
  price_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Create function to update subscription status in profiles when subscription changes
CREATE OR REPLACE FUNCTION update_profile_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile with the subscription status
  UPDATE profiles 
  SET 
    subscription_status = CASE 
      WHEN NEW.status = 'active' THEN 'active'
      WHEN NEW.status = 'canceled' THEN 'canceled'
      WHEN NEW.status = 'past_due' THEN 'past_due'
      ELSE 'none'
    END,
    subscription_tier = CASE 
      WHEN NEW.status = 'active' AND NEW.plan_name ILIKE '%pro%' THEN 'pro'
      WHEN NEW.status = 'active' AND NEW.plan_name ILIKE '%premium%' THEN 'premium'
      WHEN NEW.status = 'active' THEN 'basic'
      ELSE 'free'
    END,
    subscription_expires_at = NEW.current_period_end,
    stripe_subscription_id = NEW.stripe_subscription_id
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile when subscription changes
DROP TRIGGER IF EXISTS trigger_update_profile_subscription ON subscriptions;
CREATE TRIGGER trigger_update_profile_subscription
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_subscription_status();

-- Insert some test data to verify the structure
-- (This will only work if you have existing profiles)
-- UPDATE profiles SET subscription_status = 'none', subscription_tier = 'free' WHERE subscription_status IS NULL;

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;