# Stripe CLI Setup Guide

## 1. Installation ✅
Stripe CLI v1.28.0 is now installed.

## 2. Authentication
Run this command to authenticate with your Stripe account:
```bash
stripe login
```
Follow the browser authentication flow.

## 3. Create Products and Prices

### Create Pro Product
```bash
stripe products create \
  --name "Pro" \
  --description "Enhanced streaming experience with premium features"
```

### Create Pro Monthly Price
```bash
stripe prices create \
  --product <PRO_PRODUCT_ID> \
  --unit-amount 999 \
  --currency usd \
  --recurring interval=month \
  --nickname "Pro Monthly"
```

### Create Pro Yearly Price (with 17% discount)
```bash
stripe prices create \
  --product <PRO_PRODUCT_ID> \
  --unit-amount 9999 \
  --currency usd \
  --recurring interval=year \
  --nickname "Pro Yearly"
```

### Create Premium Product
```bash
stripe products create \
  --name "Premium" \
  --description "Ultimate streaming experience with all features"
```

### Create Premium Monthly Price
```bash
stripe prices create \
  --product <PREMIUM_PRODUCT_ID> \
  --unit-amount 1999 \
  --currency usd \
  --recurring interval=month \
  --nickname "Premium Monthly"
```

### Create Premium Yearly Price (with 17% discount)
```bash
stripe prices create \
  --product <PREMIUM_PRODUCT_ID> \
  --unit-amount 19999 \
  --currency usd \
  --recurring interval=year \
  --nickname "Premium Yearly"
```

## 4. Update Database with Product IDs

After creating products and prices, update your database:

```sql
-- Update Pro product
UPDATE products 
SET 
  stripe_price_monthly_id = 'price_XXXXX',
  stripe_price_yearly_id = 'price_YYYYY'
WHERE name = 'Pro';

-- Update Premium product  
UPDATE products 
SET 
  stripe_price_monthly_id = 'price_ZZZZZ',
  stripe_price_yearly_id = 'price_WWWWW'
WHERE name = 'Premium';
```

## 5. Local Webhook Testing

### Start Webhook Forwarding
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will:
- Create a webhook endpoint in your Stripe dashboard
- Forward all webhook events to your local server
- Provide you with a webhook signing secret

### Copy Webhook Secret
The command above will output something like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Add this to your `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## 6. Test Events

### Test Subscription Creation
```bash
stripe fixtures trigger customer.subscription.created
```

### Test Subscription Updates
```bash
stripe fixtures trigger customer.subscription.updated
```

### Test Payment Success
```bash
stripe fixtures trigger invoice.payment_succeeded
```

### Test Payment Failure
```bash
stripe fixtures trigger invoice.payment_failed
```

## 7. Environment Variables

Create a `.env.local` file with:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Other existing environment variables...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8. Customer Portal Configuration

In your Stripe Dashboard, configure the Customer Portal:
1. Go to Settings > Customer Portal
2. Enable the portal
3. Configure allowed actions:
   - Update payment method
   - View invoices
   - Cancel subscription
   - Update billing information

## 9. Testing the Integration

### Local Development Flow:
1. Start your Next.js app: `npm run dev`
2. In another terminal, start webhook forwarding: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Visit `http://localhost:3000/pricing`
4. Test the subscription flow

### Test Cards:
- Success: `4242424242424242`
- Decline: `4000000000000002`
- Requires authentication: `4000002500003155`

## 10. Production Setup

For production:
1. Replace test API keys with live keys
2. Set up production webhook endpoint in Stripe Dashboard
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Configure Customer Portal for production

## Commands Summary

```bash
# Authenticate
stripe login

# Create products and prices (see commands above)

# Test webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test specific events
stripe fixtures trigger customer.subscription.created

# View logs
stripe logs tail

# Test checkout session
stripe checkout sessions create \
  --success-url="http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}" \
  --cancel-url="http://localhost:3000/pricing" \
  --mode=subscription \
  --line-items="[{price: 'price_XXXXX', quantity: 1}]"
```

This setup will allow you to fully test the Stripe integration locally before deploying to production.