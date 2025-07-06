#!/bin/bash

echo "🧪 Setting up Stripe test environment..."

# Check if we have test keys in environment
if [[ -z "$STRIPE_TEST_SECRET_KEY" ]]; then
    echo "⚠️  Warning: Using live Stripe keys for development!"
    echo "For testing, you should use test keys that start with 'sk_test_' and 'pk_test_'"
    echo ""
    echo "To get test keys:"
    echo "1. Go to https://dashboard.stripe.com/test/apikeys"
    echo "2. Copy your test keys and add them to .env.local:"
    echo "   STRIPE_SECRET_KEY=\"sk_test_your_test_secret_key\""
    echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_test_your_test_publishable_key\""
    echo ""
    echo "For now, you can use the live keys but BE CAREFUL - any transactions will be real!"
fi

# Set up webhook endpoint for development
echo "🔗 To set up webhook forwarding:"
echo "1. Run: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "2. Copy the webhook signing secret (whsec_...) and add to .env.local:"
echo "   STRIPE_WEBHOOK_SECRET=\"whsec_your_signing_secret\""
echo ""

# Create test products and prices
echo "📦 Creating test products in Stripe..."
echo "Run these commands in your terminal:"
echo ""
echo "# Create Pro product"
echo "stripe products create --name=\"Pro\" --description=\"Enhanced streaming experience\""
echo ""
echo "# Create Pro monthly price (replace prod_xxx with actual product ID)"
echo "stripe prices create --unit-amount=999 --currency=usd --recurring-interval=month --product=prod_xxx"
echo ""
echo "# Create Pro yearly price"
echo "stripe prices create --unit-amount=9999 --currency=usd --recurring-interval=year --product=prod_xxx"
echo ""
echo "# Create Premium product"  
echo "stripe products create --name=\"Premium\" --description=\"Ultimate streaming experience\""
echo ""
echo "# Create Premium monthly price"
echo "stripe prices create --unit-amount=1999 --currency=usd --recurring-interval=month --product=prod_xxx"
echo ""
echo "# Create Premium yearly price"
echo "stripe prices create --unit-amount=19999 --currency=usd --recurring-interval=year --product=prod_xxx"
echo ""
echo "Then update your Supabase products table with the price IDs"