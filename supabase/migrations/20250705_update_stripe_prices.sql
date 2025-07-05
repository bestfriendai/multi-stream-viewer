-- Update products table with actual Stripe price IDs
-- Run this after creating products and prices in Stripe Dashboard

-- You will need to replace these placeholder values with actual price IDs from Stripe Dashboard
-- Stripe price IDs start with 'price_' followed by a long string

-- Update Pro plan with actual Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_REPLACE_WITH_PRO_MONTHLY_PRICE_ID',
    stripe_price_yearly_id = 'price_REPLACE_WITH_PRO_YEARLY_PRICE_ID'
WHERE name = 'Pro' AND active = true;

-- Update Premium plan with actual Stripe price IDs  
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_REPLACE_WITH_PREMIUM_MONTHLY_PRICE_ID',
    stripe_price_yearly_id = 'price_REPLACE_WITH_PREMIUM_YEARLY_PRICE_ID'
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