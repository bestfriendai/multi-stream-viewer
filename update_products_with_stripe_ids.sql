-- Update products table with actual Stripe price IDs

-- Update Pro plan with actual Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhM9oKUMGTMjCZ4g2yPI67z',
    stripe_price_yearly_id = 'price_1RhM9uKUMGTMjCZ41faTrUwv'
WHERE name = 'Pro' AND active = true;

-- Update Premium plan with actual Stripe price IDs  
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_1RhMA4KUMGTMjCZ4Iy23MnKJ',
    stripe_price_yearly_id = 'price_1RhMA8KUMGTMjCZ4wlVUc0AA'
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