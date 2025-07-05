#!/bin/bash

# Setup script for Stripe products via Stripe CLI
# This script creates products and prices in Stripe and provides the IDs for database update

echo "Setting up Stripe products using Stripe CLI..."
echo ""

# Create Pro plan product
echo "Creating Pro plan product..."
PRO_PRODUCT=$(stripe products create \
  --name "Pro" \
  --description "Enhanced streaming experience with premium features")

PRO_PRODUCT_ID=$(echo $PRO_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Pro Product ID: $PRO_PRODUCT_ID"

# Create Pro monthly price
echo "Creating Pro monthly price..."
PRO_MONTHLY_PRICE=$(stripe prices create \
  --product $PRO_PRODUCT_ID \
  --unit-amount 999 \
  --currency usd \
  --recurring interval=month)

PRO_MONTHLY_PRICE_ID=$(echo $PRO_MONTHLY_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Pro Monthly Price ID: $PRO_MONTHLY_PRICE_ID"

# Create Pro yearly price
echo "Creating Pro yearly price..."
PRO_YEARLY_PRICE=$(stripe prices create \
  --product $PRO_PRODUCT_ID \
  --unit-amount 9999 \
  --currency usd \
  --recurring interval=year)

PRO_YEARLY_PRICE_ID=$(echo $PRO_YEARLY_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Pro Yearly Price ID: $PRO_YEARLY_PRICE_ID"

echo ""

# Create Premium plan product
echo "Creating Premium plan product..."
PREMIUM_PRODUCT=$(stripe products create \
  --name "Premium" \
  --description "Ultimate streaming experience with all features")

PREMIUM_PRODUCT_ID=$(echo $PREMIUM_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Premium Product ID: $PREMIUM_PRODUCT_ID"

# Create Premium monthly price
echo "Creating Premium monthly price..."
PREMIUM_MONTHLY_PRICE=$(stripe prices create \
  --product $PREMIUM_PRODUCT_ID \
  --unit-amount 1999 \
  --currency usd \
  --recurring interval=month)

PREMIUM_MONTHLY_PRICE_ID=$(echo $PREMIUM_MONTHLY_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Premium Monthly Price ID: $PREMIUM_MONTHLY_PRICE_ID"

# Create Premium yearly price
echo "Creating Premium yearly price..."
PREMIUM_YEARLY_PRICE=$(stripe prices create \
  --product $PREMIUM_PRODUCT_ID \
  --unit-amount 19999 \
  --currency usd \
  --recurring interval=year)

PREMIUM_YEARLY_PRICE_ID=$(echo $PREMIUM_YEARLY_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "Premium Yearly Price ID: $PREMIUM_YEARLY_PRICE_ID"

echo ""
echo "✅ Stripe products and prices created successfully!"
echo ""
echo "📋 Price IDs for database update:"
echo "Pro Monthly: $PRO_MONTHLY_PRICE_ID"
echo "Pro Yearly: $PRO_YEARLY_PRICE_ID"
echo "Premium Monthly: $PREMIUM_MONTHLY_PRICE_ID"  
echo "Premium Yearly: $PREMIUM_YEARLY_PRICE_ID"
echo ""
echo "🔧 Now update your Supabase database with these price IDs:"
echo ""
cat << EOF
-- Run this SQL in your Supabase SQL Editor:

UPDATE products 
SET 
    stripe_price_monthly_id = '$PRO_MONTHLY_PRICE_ID',
    stripe_price_yearly_id = '$PRO_YEARLY_PRICE_ID'
WHERE name = 'Pro' AND active = true;

UPDATE products 
SET 
    stripe_price_monthly_id = '$PREMIUM_MONTHLY_PRICE_ID',
    stripe_price_yearly_id = '$PREMIUM_YEARLY_PRICE_ID'
WHERE name = 'Premium' AND active = true;

-- Verify the updates:
SELECT name, stripe_price_monthly_id, stripe_price_yearly_id FROM products WHERE active = true;
EOF

echo ""
echo "🌐 Next steps:"
echo "1. Set up webhook endpoint in Stripe Dashboard:"
echo "   URL: https://streamyyy.com/api/stripe/webhook"
echo "   Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted"
echo "2. Copy the SQL above and run it in your Supabase SQL Editor"
echo "3. Deploy your application to Vercel"