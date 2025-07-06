-- Add subscription fields to profiles table to support webhook updates
-- This migration adds the missing fields that the webhook handler expects

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'; 
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

-- Update the get_profile_by_clerk_id function to include subscription fields
CREATE OR REPLACE FUNCTION get_profile_by_clerk_id(clerk_id TEXT)
RETURNS TABLE(
    id UUID,
    clerk_user_id TEXT,
    stripe_customer_id TEXT,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_status TEXT,
    subscription_tier TEXT,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, 
        p.clerk_user_id, 
        p.stripe_customer_id, 
        p.email, 
        p.full_name, 
        p.avatar_url,
        p.subscription_status,
        p.subscription_tier,
        p.subscription_expires_at,
        p.stripe_subscription_id,
        p.created_at, 
        p.updated_at
    FROM profiles p
    WHERE p.clerk_user_id = clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or update function to get user subscription status with all details
CREATE OR REPLACE FUNCTION get_user_subscription_status(clerk_id TEXT)
RETURNS TABLE(
    user_id UUID,
    subscription_status TEXT,
    subscription_tier TEXT,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    product_name TEXT,
    product_features JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as user_id,
        p.subscription_status,
        p.subscription_tier,
        p.subscription_expires_at,
        p.stripe_subscription_id,
        p.stripe_customer_id,
        prod.name as product_name,
        prod.features as product_features
    FROM profiles p
    LEFT JOIN subscriptions s ON p.stripe_subscription_id = s.stripe_subscription_id
    LEFT JOIN products prod ON s.product_id = prod.id
    WHERE p.clerk_user_id = clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set default subscription tier for existing users
UPDATE profiles 
SET 
    subscription_tier = 'free',
    subscription_status = 'inactive'
WHERE subscription_tier IS NULL OR subscription_status IS NULL;