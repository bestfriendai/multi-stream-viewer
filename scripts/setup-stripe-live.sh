#!/bin/bash

echo "🚀 Setting up Stripe Live Mode for Streamyyy..."

# Check Stripe CLI configuration
echo "🔍 Checking Stripe CLI configuration..."
stripe config --list | grep -E "(live_mode|display_name)"

echo ""
echo "📦 Current live products and prices:"
stripe products list --live

echo ""
echo "💰 Current live prices:"
stripe prices list --live

echo ""
echo "⚠️  IMPORTANT: We need to create yearly prices!"
echo "To create yearly prices, you need to either:"
echo ""
echo "1. Use Stripe Dashboard (Recommended):"
echo "   - Go to https://dashboard.stripe.com/products"
echo "   - Click on Pro Plan"
echo "   - Add a new price: $99.99/year"
echo "   - Click on Premium Plan"
echo "   - Add a new price: $199.99/year"
echo ""
echo "2. Or request permission to create prices via CLI"
echo ""
echo "Current products in Stripe live mode:"
echo "✅ Pro Plan (prod_ScaqEZGR8kI97J) - Monthly: price_1RhLeMKUMGTMjCZ47Kn0pKxr ($9.99)"
echo "✅ Premium Plan (prod_ScaqTg605AnSav) - Monthly: price_1RhLeiKUMGTMjCZ4Jqql3RvC ($19.99)"
echo ""
echo "🔄 Supabase has been updated with these monthly price IDs"
echo ""
echo "🎯 To complete the setup:"
echo "1. Create yearly prices in Stripe Dashboard"
echo "2. Run: node scripts/add-yearly-prices.js [pro_yearly_price_id] [premium_yearly_price_id]"
echo "3. Test the subscription flow"
echo ""
echo "🔗 To start webhook forwarding for testing:"
echo "stripe listen --forward-to localhost:3000/api/stripe/webhook --live"