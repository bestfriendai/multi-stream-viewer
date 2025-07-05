#!/bin/bash

# Start Stripe webhook forwarding for local development

echo "🌐 Starting Stripe webhook forwarding..."
echo "This will forward Stripe webhooks to your local development server"
echo ""

# Check if stripe CLI is available
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed or not in PATH"
    exit 1
fi

# Check if user is authenticated
if ! stripe config --list &> /dev/null; then
    echo "❌ Not authenticated with Stripe CLI"
    echo "Please run: stripe login"
    exit 1
fi

echo "✅ Starting webhook forwarding to localhost:3000/api/stripe/webhook"
echo ""
echo "📝 Make sure to:"
echo "1. Copy the webhook signing secret (whsec_...) to your .env.local"
echo "2. Keep this terminal window open while testing"
echo "3. Start your Next.js dev server in another terminal: npm run dev"
echo ""
echo "🧪 Test events you can trigger:"
echo "- stripe fixtures trigger customer.subscription.created"
echo "- stripe fixtures trigger customer.subscription.updated"
echo "- stripe fixtures trigger invoice.payment_succeeded"
echo "- stripe fixtures trigger invoice.payment_failed"
echo ""

# Start forwarding
export PATH="$HOME/bin:$PATH"
stripe listen --forward-to localhost:3000/api/stripe/webhook