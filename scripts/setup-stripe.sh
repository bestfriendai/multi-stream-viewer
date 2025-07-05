#!/bin/bash

# Stripe Setup Script for Multi-Stream Viewer
# This script creates products and prices in Stripe

set -e

# Add stripe CLI to PATH
export PATH="$HOME/bin:$PATH"

echo "🎯 Setting up Stripe products and prices for Multi-Stream Viewer..."

# Check if stripe CLI is available
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed or not in PATH"
    echo "Please install it first: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if user is authenticated
if ! stripe config --list &> /dev/null; then
    echo "❌ Not authenticated with Stripe CLI"
    echo "Please run: stripe login"
    exit 1
fi

echo "✅ Stripe CLI is ready"

# Create Pro Product
echo "📦 Creating Pro product..."
PRO_PRODUCT=$(stripe products create \
  --name "Pro" \
  --description "Enhanced streaming experience with premium features" \
  --metadata max_streams=8 \
  --metadata custom_layouts=true \
  --metadata advanced_controls=true \
  --metadata priority_support=true \
  --metadata analytics=false \
  --metadata custom_branding=false)

PRO_PRODUCT_ID=$(echo "$PRO_PRODUCT" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Pro product: $PRO_PRODUCT_ID"

# Create Pro Monthly Price
echo "💰 Creating Pro monthly price..."
PRO_MONTHLY_PRICE=$(stripe prices create \
  --product "$PRO_PRODUCT_ID" \
  --unit-amount 999 \
  --currency usd \
  --recurring interval=month \
  --nickname "Pro Monthly")

PRO_MONTHLY_PRICE_ID=$(echo "$PRO_MONTHLY_PRICE" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Pro monthly price: $PRO_MONTHLY_PRICE_ID"

# Create Pro Yearly Price (17% discount: $99.99 instead of $119.88)
echo "💰 Creating Pro yearly price..."
PRO_YEARLY_PRICE=$(stripe prices create \
  --product "$PRO_PRODUCT_ID" \
  --unit-amount 9999 \
  --currency usd \
  --recurring interval=year \
  --nickname "Pro Yearly")

PRO_YEARLY_PRICE_ID=$(echo "$PRO_YEARLY_PRICE" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Pro yearly price: $PRO_YEARLY_PRICE_ID"

# Create Premium Product
echo "📦 Creating Premium product..."
PREMIUM_PRODUCT=$(stripe products create \
  --name "Premium" \
  --description "Ultimate streaming experience with all features" \
  --metadata max_streams=20 \
  --metadata custom_layouts=true \
  --metadata advanced_controls=true \
  --metadata priority_support=true \
  --metadata analytics=true \
  --metadata custom_branding=true)

PREMIUM_PRODUCT_ID=$(echo "$PREMIUM_PRODUCT" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Premium product: $PREMIUM_PRODUCT_ID"

# Create Premium Monthly Price
echo "💰 Creating Premium monthly price..."
PREMIUM_MONTHLY_PRICE=$(stripe prices create \
  --product "$PREMIUM_PRODUCT_ID" \
  --unit-amount 1999 \
  --currency usd \
  --recurring interval=month \
  --nickname "Premium Monthly")

PREMIUM_MONTHLY_PRICE_ID=$(echo "$PREMIUM_MONTHLY_PRICE" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Premium monthly price: $PREMIUM_MONTHLY_PRICE_ID"

# Create Premium Yearly Price (17% discount: $199.99 instead of $239.88)
echo "💰 Creating Premium yearly price..."
PREMIUM_YEARLY_PRICE=$(stripe prices create \
  --product "$PREMIUM_PRODUCT_ID" \
  --unit-amount 19999 \
  --currency usd \
  --recurring interval=year \
  --nickname "Premium Yearly")

PREMIUM_YEARLY_PRICE_ID=$(echo "$PREMIUM_YEARLY_PRICE" | grep '"id"' | head -1 | cut -d'"' -f4)
echo "✅ Created Premium yearly price: $PREMIUM_YEARLY_PRICE_ID"

# Generate SQL to update database
echo ""
echo "🗄️  Database Update SQL:"
echo "========================"
echo ""
echo "-- Copy and run this SQL in your Supabase dashboard or database client:"
echo ""
echo "UPDATE products SET"
echo "  stripe_price_monthly_id = '$PRO_MONTHLY_PRICE_ID',"
echo "  stripe_price_yearly_id = '$PRO_YEARLY_PRICE_ID'"
echo "WHERE name = 'Pro';"
echo ""
echo "UPDATE products SET"
echo "  stripe_price_monthly_id = '$PREMIUM_MONTHLY_PRICE_ID',"
echo "  stripe_price_yearly_id = '$PREMIUM_YEARLY_PRICE_ID'"
echo "WHERE name = 'Premium';"
echo ""

# Generate environment variables
echo "🔧 Environment Variables:"
echo "========================="
echo ""
echo "Add these to your .env.local file:"
echo ""
echo "# Stripe Product IDs (for reference)"
echo "STRIPE_PRO_PRODUCT_ID=$PRO_PRODUCT_ID"
echo "STRIPE_PREMIUM_PRODUCT_ID=$PREMIUM_PRODUCT_ID"
echo ""
echo "# Stripe Price IDs (for reference)"
echo "STRIPE_PRO_MONTHLY_PRICE_ID=$PRO_MONTHLY_PRICE_ID"
echo "STRIPE_PRO_YEARLY_PRICE_ID=$PRO_YEARLY_PRICE_ID"
echo "STRIPE_PREMIUM_MONTHLY_PRICE_ID=$PREMIUM_MONTHLY_PRICE_ID"
echo "STRIPE_PREMIUM_YEARLY_PRICE_ID=$PREMIUM_YEARLY_PRICE_ID"
echo ""

echo "🎉 Stripe setup complete!"
echo ""
echo "Next steps:"
echo "1. Run the SQL commands above in your database"
echo "2. Add your Stripe API keys to .env.local"
echo "3. Start webhook forwarding: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "4. Test the integration at http://localhost:3000/pricing"