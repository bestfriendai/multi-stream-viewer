# 🔍 Stripe + Supabase Integration Debugging Guide

This guide helps you debug and troubleshoot issues with the Stripe subscription and Supabase integration.

## 🚀 Quick Start Debugging

### 1. Run the Diagnostic Script
```bash
node scripts/debug-integration.js
```

This script will check all components of your integration and provide a detailed report.

### 2. Check Environment Variables
Ensure all required environment variables are set in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_live_... # or sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 Common Issues and Solutions

### Issue 1: Webhook Events Not Processing

**Symptoms:**
- Subscriptions created in Stripe but not appearing in Supabase
- Webhook endpoint returning errors
- No subscription data syncing

**Solutions:**

1. **Check Webhook Secret:**
   ```bash
   # Verify webhook secret is correct
   echo $STRIPE_WEBHOOK_SECRET
   ```

2. **Test Webhook Locally:**
   ```bash
   # Start local webhook forwarding
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # In another terminal, trigger test events
   stripe trigger customer.subscription.created
   ```

3. **Check Webhook Endpoint:**
   - Verify webhook URL in Stripe Dashboard
   - Ensure HTTPS is used for production
   - Check webhook endpoint logs in Vercel/your hosting platform

4. **Verify Database Permissions:**
   ```bash
   # Test Supabase connection
   node scripts/test-supabase-connection.js
   ```

### Issue 2: Products Missing Stripe Price IDs

**Symptoms:**
- "Product not found" errors in webhook processing
- Checkout sessions failing to create
- Price IDs showing as "REPLACE_WITH_..."

**Solutions:**

1. **Update Products with Real Price IDs:**
   ```bash
   # Run the Supabase connection script to update prices
   node scripts/test-supabase-connection.js
   ```

2. **Manually Update in Supabase:**
   ```sql
   -- Get your actual price IDs from Stripe Dashboard
   UPDATE products 
   SET 
       stripe_price_monthly_id = 'price_your_actual_monthly_id',
       stripe_price_yearly_id = 'price_your_actual_yearly_id'
   WHERE name = 'Pro' AND active = true;
   ```

3. **Create Products in Stripe:**
   ```bash
   # Create products and prices in Stripe
   stripe products create --name="Pro Plan" --description="Enhanced streaming"
   stripe prices create --product=prod_xxx --unit-amount=999 --currency=usd --recurring-interval=month
   ```

### Issue 3: Authentication Issues

**Symptoms:**
- "Unauthorized" errors when creating checkout sessions
- Profile creation failing
- User not found errors

**Solutions:**

1. **Check Clerk Configuration:**
   ```bash
   # Verify Clerk keys are set
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   echo $CLERK_SECRET_KEY
   ```

2. **Test Profile Creation:**
   - Sign in to your app
   - Check if profile is created in Supabase `profiles` table
   - Verify `clerk_user_id` is properly set

3. **Check RLS Policies:**
   ```sql
   -- Verify RLS policies allow profile creation
   SELECT * FROM profiles WHERE clerk_user_id = 'your_clerk_user_id';
   ```

### Issue 4: Checkout Session Creation Failing

**Symptoms:**
- "Failed to create checkout session" errors
- Invalid price ID errors
- Customer creation failing

**Solutions:**

1. **Verify Price IDs:**
   ```bash
   # List all prices in Stripe
   stripe prices list
   ```

2. **Check Product Configuration:**
   ```sql
   -- Verify products have valid Stripe price IDs
   SELECT name, stripe_price_monthly_id, stripe_price_yearly_id 
   FROM products 
   WHERE active = true;
   ```

3. **Test API Route:**
   ```bash
   # Test checkout session creation
   curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{"priceId":"price_xxx","productId":"uuid"}'
   ```

### Issue 5: Database Connection Issues

**Symptoms:**
- "Database error" messages
- Connection timeouts
- RLS policy violations

**Solutions:**

1. **Test Connection:**
   ```bash
   # Test basic Supabase connection
   node scripts/test-supabase-connection.js
   ```

2. **Check Service Role Key:**
   - Ensure you're using the service role key (not anon key) for server-side operations
   - Verify key has proper permissions

3. **Verify Database Schema:**
   ```sql
   -- Check if all tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## 🧪 Testing Commands

### Local Development Testing

```bash
# 1. Start development server
npm run dev

# 2. Start Stripe webhook forwarding (in another terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Test subscription flow
# - Go to http://localhost:3000/pricing
# - Sign in with Clerk
# - Try to subscribe to a plan
# - Use test card: 4242 4242 4242 4242

# 4. Trigger webhook events manually
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger checkout.session.completed
```

### Production Testing

```bash
# 1. Check webhook delivery in Stripe Dashboard
# Go to: Developers > Webhooks > Your webhook endpoint

# 2. Monitor webhook events
stripe events list --limit 10

# 3. Check specific event
stripe events retrieve evt_xxx

# 4. Test with real test cards
# Use Stripe test cards: https://stripe.com/docs/testing
```

## 📊 Monitoring and Logs

### Vercel Logs
```bash
# View function logs
vercel logs --follow

# View specific function logs
vercel logs --follow --function=api/stripe/webhook
```

### Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs section
3. Filter by API, Database, or Auth logs

### Stripe Dashboard
1. Go to Stripe Dashboard > Developers > Events
2. Check webhook delivery status
3. View event details and retry failed events

## 🔍 Debugging Checklist

### Before Deployment
- [ ] All environment variables are set correctly
- [ ] Products have real Stripe price IDs (not placeholders)
- [ ] Webhook endpoint is configured in Stripe Dashboard
- [ ] Database schema is up to date
- [ ] RLS policies are properly configured
- [ ] API routes are accessible

### After Deployment
- [ ] Webhook endpoint is accessible via HTTPS
- [ ] Test subscription flow end-to-end
- [ ] Verify webhook events are being processed
- [ ] Check subscription data syncs to database
- [ ] Test customer portal functionality

### Regular Monitoring
- [ ] Monitor webhook delivery success rate
- [ ] Check for failed payments
- [ ] Verify subscription renewals
- [ ] Monitor database performance
- [ ] Check error logs regularly

## 🆘 Getting Help

If you're still experiencing issues:

1. **Run the diagnostic script:** `node scripts/debug-integration.js`
2. **Check the logs:** Vercel, Supabase, and Stripe Dashboard
3. **Test individual components:** Use the test scripts in `/scripts/`
4. **Review the documentation:** Check Stripe and Supabase docs
5. **Check for updates:** Ensure you're using the latest SDK versions

## 📚 Useful Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Authentication Guide](https://clerk.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Remember:** Always test with Stripe test keys before using live keys in production!