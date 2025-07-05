-- Check current products in the database
SELECT 
    id,
    name,
    description,
    price_monthly,
    price_yearly,
    stripe_price_monthly_id,
    stripe_price_yearly_id,
    active
FROM products 
WHERE active = true
ORDER BY price_monthly;