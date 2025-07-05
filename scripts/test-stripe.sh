#!/bin/bash

# Test Stripe integration with various webhook events

echo "🧪 Testing Stripe Integration"
echo "============================="
echo ""

# Check if stripe CLI is available
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed or not in PATH"
    exit 1
fi

export PATH="$HOME/bin:$PATH"

echo "Testing webhook endpoints..."
echo ""

echo "1. Testing successful subscription creation..."
stripe fixtures trigger customer.subscription.created
sleep 2

echo "2. Testing subscription update..."
stripe fixtures trigger customer.subscription.updated
sleep 2

echo "3. Testing successful payment..."
stripe fixtures trigger invoice.payment_succeeded
sleep 2

echo "4. Testing failed payment..."
stripe fixtures trigger invoice.payment_failed
sleep 2

echo "5. Testing checkout session completion..."
stripe fixtures trigger checkout.session.completed
sleep 2

echo ""
echo "✅ Test events sent! Check your:"
echo "- Next.js dev server console for webhook logs"
echo "- Database for updated subscription records"
echo "- Stripe dashboard for event history"
echo ""
echo "🔍 To view real-time webhook logs:"
echo "stripe logs tail"