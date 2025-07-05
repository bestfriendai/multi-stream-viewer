#!/bin/bash

# Setup script for Vercel environment variables
# This script will configure all necessary environment variables for the Stripe integration

echo "Setting up Vercel environment variables for Stripe integration..."

# Add Stripe Live Keys
echo "Adding Stripe secret key..."
echo "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" | vercel env add STRIPE_SECRET_KEY production

echo "Adding Stripe publishable key..."
echo "pk_live_51NwE4bKUMGTMjCZ42N3dkwkTg8hT9Q8noE02a77VtJeNcrYCc9Rks7FIYjYRwugESEtXJ4SnRKeFNreVXVS1rkx200Ug4AODfn" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

echo "Adding Stripe webhook secret..."
echo "whsec_c8610e66da2867273ff4fed7122245b964780b09381999f3aafea23e7a3a9aa3" | vercel env add STRIPE_WEBHOOK_SECRET production

echo "Vercel environment variables configured successfully!"
echo ""
echo "Important: You will need to:"
echo "1. Configure your Stripe webhook endpoint in the Stripe Dashboard"
echo "2. Point the webhook to: https://streamyyy.com/api/stripe/webhook"
echo "3. Enable these events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, checkout.session.completed"
echo "4. Update your Supabase products table with actual Stripe product/price IDs"