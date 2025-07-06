-- Update Supabase products table with current live Stripe price IDs
-- Based on the Stripe CLI output we just retrieved

-- First, let's see what we currently have
SELECT 
    id,
    name,
    price_monthly,
    price_yearly,
    stripe_price_monthly_id,
    stripe_price_yearly_id,
    active
FROM products 
WHERE active = true
ORDER BY price_monthly;

-- Update Pro plan with current live Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhLeMKUMGTMjCZ47Kn0pKxr',  -- $9.99/month
    stripe_price_yearly_id = NULL  -- Need to create yearly price
WHERE name = 'Pro' AND active = true;

-- Update Premium plan with current live Stripe price IDs  
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhLeiKUMGTMjCZ4Jqql3RvC',  -- $19.99/month
    stripe_price_yearly_id = NULL  -- Need to create yearly price
WHERE name = 'Premium' AND active = true;

-- Verify the updates
SELECT 
    id,
    name,
    price_monthly,
    price_yearly,
    stripe_price_monthly_id,
    stripe_price_yearly_id,
    active
FROM products 
WHERE active = true
ORDER BY price_monthly;