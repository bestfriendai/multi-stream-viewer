#!/bin/bash

# Setup Stripe webhook for local development
echo "🔧 Setting up Stripe webhook for local development..."

# Check if Stripe CLI is authenticated
stripe --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Stripe CLI not found. Please install it first:"
    echo "   brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Check if user is authenticated
stripe config --list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Please authenticate with Stripe first:"
    echo "   stripe login"
    exit 1
fi

echo "✅ Stripe CLI is ready"

# Get the webhook endpoint secret
echo "🔗 Setting up webhook endpoint..."
echo "Run this command in a separate terminal to forward webhooks:"
echo ""
echo "stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo "This will show you the webhook signing secret (starts with whsec_)"
echo "Add this secret to your .env.local file as STRIPE_WEBHOOK_SECRET"
echo ""
echo "📝 Example .env.local entry:"
echo "STRIPE_WEBHOOK_SECRET=whsec_your_secret_here"
echo ""
echo "🧪 To test the webhook, run:"
echo "stripe trigger checkout.session.completed"