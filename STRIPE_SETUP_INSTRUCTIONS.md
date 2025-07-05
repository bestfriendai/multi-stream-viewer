# Stripe Integration Setup Instructions

## Overview
This document provides step-by-step instructions to complete the Stripe integration setup for the multi-stream viewer application.

## Current Status
✅ **Completed:**
- Stripe API routes configured (`/api/stripe/webhook`, `/api/stripe/create-checkout-session`, `/api/stripe/create-portal-session`)
- Environment variables updated with live Stripe keys
- Supabase database schema configured for subscriptions
- Frontend pricing and profile pages implemented
- Subscription management and feature gating implemented

## Required Manual Setup Steps

### 1. Configure Stripe Dashboard

#### A. Create Products and Prices
In your Stripe Dashboard (https://dashboard.stripe.com/products):

1. **Create Pro Plan Product:**
   - Name: "Pro"
   - Description: "Enhanced streaming experience with premium features"
   - Create Price: $9.99/month recurring
   - Create Price: $99.99/year recurring
   - Note the price IDs (starts with `price_`)

2. **Create Premium Plan Product:**
   - Name: "Premium"
   - Description: "Ultimate streaming experience with all features"
   - Create Price: $19.99/month recurring
   - Create Price: $199.99/year recurring
   - Note the price IDs (starts with `price_`)

#### B. Configure Webhook Endpoint
1. Go to Developers → Webhooks in Stripe Dashboard
2. Add endpoint: `https://streamyyy.com/api/stripe/webhook`
3. Enable these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Note the webhook signing secret (starts with `whsec_`)

### 2. Update Supabase Database

#### Update Products Table
Connect to your Supabase database and update the products table with the actual Stripe price IDs:

```sql
-- Update Pro plan with actual Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_ACTUAL_PRO_MONTHLY_ID',
    stripe_price_yearly_id = 'price_ACTUAL_PRO_YEARLY_ID'
WHERE name = 'Pro';

-- Update Premium plan with actual Stripe price IDs
UPDATE products 
SET 
    stripe_price_monthly_id = 'price_ACTUAL_PREMIUM_MONTHLY_ID',
    stripe_price_yearly_id = 'price_ACTUAL_PREMIUM_YEARLY_ID'
WHERE name = 'Premium';
```

Replace `ACTUAL_PRO_MONTHLY_ID`, etc. with the actual price IDs from your Stripe Dashboard.

### 3. Configure Vercel Environment Variables

#### Option A: Using the Script
Run the provided script to add environment variables:
```bash
./scripts/setup-vercel-env.sh
```

#### Option B: Manual Setup
Add these environment variables in your Vercel project settings:

```bash
# Production Environment Variables
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51NwE4bKUMGTMjCZ42N3dkwkTg8hT9Q8noE02a77VtJeNcrYCc9Rks7FIYjYRwugESEtXJ4SnRKeFNreVXVS1rkx200Ug4AODfn
STRIPE_WEBHOOK_SECRET=whsec_c8610e66da2867273ff4fed7122245b964780b09381999f3aafea23e7a3a9aa3
```

### 4. Testing the Integration

#### Test Webhook Endpoint
1. Use Stripe CLI to test webhook locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. Trigger a test event:
   ```bash
   stripe trigger customer.subscription.created
   ```

#### Test Checkout Flow
1. Navigate to `/pricing` on your deployed application
2. Click "Subscribe" on a plan
3. Complete test checkout with Stripe test card: `4242 4242 4242 4242`
4. Verify subscription appears in Stripe Dashboard
5. Verify subscription syncs to Supabase database

#### Test Customer Portal
1. After subscribing, navigate to `/profile`
2. Click "Manage Subscription"
3. Verify Stripe Customer Portal opens
4. Test cancellation/modification

### 5. Deployment

After completing the above steps:

1. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

2. **Verify Environment Variables:**
   - Check that all Stripe keys are properly set in Vercel
   - Verify webhook endpoint is accessible

3. **Test Live Integration:**
   - Test with real payment methods
   - Verify webhook events are received and processed
   - Check subscription limits are enforced

## Features Implemented

### Subscription Plans
- **Free:** 4 simultaneous streams, basic features
- **Pro ($9.99/mo):** 8 simultaneous streams, custom layouts, advanced controls
- **Premium ($19.99/mo):** 20 simultaneous streams, all features, analytics

### Feature Gating
- Stream limits enforced based on subscription
- Custom layouts restricted to Pro/Premium
- Layout saving restricted to Pro/Premium
- Upgrade prompts for free users

### Payment Flow
- Stripe Checkout integration
- Automatic customer creation
- Real-time webhook processing
- Customer portal for self-service management

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events:**
   - Check webhook URL is correct in Stripe Dashboard
   - Verify webhook secret matches environment variable
   - Check server logs for webhook processing errors

2. **Subscription Not Syncing:**
   - Verify database connection in webhook handler
   - Check Supabase RLS policies allow webhook updates
   - Verify product IDs match between Stripe and database

3. **Payment Flow Errors:**
   - Check Stripe publishable key is correct
   - Verify checkout session creation logs
   - Test with different payment methods

### Logs and Monitoring
- Check Vercel function logs for API route errors
- Monitor Stripe Dashboard for webhook delivery status
- Use Supabase logs to debug database operations

## Next Steps

1. **Enable Tax Collection:** Configure tax settings in Stripe Dashboard
2. **Add Proration:** Handle plan changes with prorated billing
3. **Implement Trials:** Add free trial periods for new subscriptions
4. **Add Metrics:** Track subscription conversion and churn
5. **Optimize Performance:** Add caching for subscription status checks

## Support

For issues with this integration:
1. Check Stripe Dashboard for webhook delivery status
2. Review Vercel function logs for API errors
3. Verify Supabase database permissions and data consistency
4. Test with Stripe CLI for local development

---

**Important:** This integration uses live Stripe keys. Always test thoroughly in development before deploying to production.