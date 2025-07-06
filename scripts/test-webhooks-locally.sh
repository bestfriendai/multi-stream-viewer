#!/bin/bash

# Local Webhook Testing Script for Stripe + Supabase Integration
# This script helps you test the webhook functionality locally

echo "🧪 STRIPE WEBHOOK LOCAL TESTING"
echo "================================="
echo ""

# Check if Stripe CLI is available
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed or not in PATH"
    echo "   Install from: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if development server is running
echo "🔍 Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running on localhost:3000"
else
    echo "❌ Development server is not running"
    echo "   Start it with: npm run dev"
    echo "   Then run this script again"
    exit 1
fi

echo ""
echo "🚀 Starting webhook forwarding..."
echo "   This will forward Stripe webhook events to your local server"
echo "   Keep this terminal open and use another terminal for testing"
echo ""
echo "📋 Testing Commands (run in another terminal):"
echo "   stripe trigger customer.subscription.created"
echo "   stripe trigger customer.subscription.updated"
echo "   stripe trigger customer.subscription.deleted"
echo "   stripe trigger checkout.session.completed"
echo "   stripe trigger invoice.payment_succeeded"
echo "   stripe trigger invoice.payment_failed"
echo ""
echo "🔍 Monitor Commands:"
echo "   stripe events list --limit 10"
echo "   node scripts/debug-integration.js"
echo ""
echo "Press Ctrl+C to stop webhook forwarding"
echo ""

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook