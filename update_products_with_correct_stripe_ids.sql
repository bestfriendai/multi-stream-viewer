-- Update products table with the CORRECT Stripe price IDs from your live account
-- Product IDs: prod_ScaqEZGR8kI97J (Pro), prod_ScaqTg605AnSav (Premium)

-- Update Pro plan with correct Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhLeMKUMGTMjCZ47Kn0pKxr',
    stripe_price_yearly_id = NULL  -- Only monthly price available
WHERE name = 'Pro' AND active = true;

-- Update Premium plan with correct Stripe price IDs  
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhLeiKUMGTMjCZ4Jqql3RvC',
    stripe_price_yearly_id = NULL  -- Only monthly price available
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

-- Show the mapping for verification:
-- Pro ($9.99/month): prod_ScaqEZGR8kI97J -> price_1RhLeMKUMGTMjCZ47Kn0pKxr
-- Premium ($19.99/month): prod_ScaqTg605AnSav -> price_1RhLeiKUMGTMjCZ4Jqql3RvC