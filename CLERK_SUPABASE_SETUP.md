# Clerk + Supabase Integration Setup Guide

## Overview

This guide walks you through setting up the integration between Clerk (authentication) and Supabase (database) for the Streamyyy.com multi-stream viewer application.

## Current Status

✅ **COMPLETED:**
- Database migration applied successfully
- Supabase client configuration updated to use new native integration
- Test components created
- Environment variables configured

⚠️ **MANUAL STEPS REQUIRED:**
- Clerk Supabase integration activation
- Supabase third-party auth configuration

## Step-by-Step Setup

### 1. Activate Clerk Supabase Integration

1. Go to [Clerk Dashboard → Supabase Integration](https://dashboard.clerk.com/setup/supabase)
2. Select your configuration options
3. Click **"Activate Supabase integration"**
4. Copy the **Clerk domain** that appears (should be: `quality-doe-43.clerk.accounts.dev`)

### 2. Configure Supabase Third-Party Auth

1. Go to [Supabase Dashboard → Authentication → Third Party](https://supabase.com/dashboard/project/akwvmljopucsnorvdwuu/auth/third-party)
2. Click **"Add provider"**
3. Select **"Clerk"** from the list of providers
4. Paste the **Clerk domain** you copied from step 1
5. Save the configuration

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/test-integration`
3. Sign in with Clerk
4. Run the integration tests to verify everything works

## What the Integration Does

### Authentication Flow
1. User signs in through Clerk
2. Clerk generates a session token
3. Supabase validates the token using the configured Clerk domain
4. Database queries are authorized based on Row Level Security policies

### Database Security
- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Policies use `auth.jwt()->>'sub'` to identify the current user
- Service role can manage subscriptions for webhook handlers

### Key Features
- **Automatic Profile Creation**: User profiles are created/updated on sign-in
- **Secure Data Access**: All queries are authenticated and authorized
- **Subscription Management**: Ready for Stripe webhook integration
- **Layout Persistence**: Users can save and retrieve custom stream layouts

## Database Schema

### Tables Created
- `profiles` - User profile information linked to Clerk user ID
- `products` - Subscription products (Pro, Premium)
- `subscriptions` - User subscription data
- `saved_layouts` - Custom stream layout configurations
- `user_preferences` - User settings and preferences

### Default Products
- **Pro Plan**: $9.99/month, $99.99/year (8 streams, custom layouts)
- **Premium Plan**: $19.99/month, $199.99/year (20 streams, analytics, branding)

## Code Changes Made

### 1. Updated Supabase Client (`src/lib/supabase.ts`)
```typescript
// New native integration approach
export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken()
    },
  })
}
```

### 2. Updated Supabase Context (`src/contexts/SupabaseContext.tsx`)
- Removed deprecated JWT template usage
- Implemented new native integration
- Automatic profile creation/sync

### 3. Updated Supabase Config (`supabase/config.toml`)
```toml
[auth.third_party.clerk]
enabled = true
domain = "quality-doe-43.clerk.accounts.dev"
```

## Environment Variables

Ensure these are set in your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://akwvmljopucsnorvdwuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cXVhbGl0eS1kb2UtNDMuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_RQc3HdVhrlsURQMw3EosutCsMDJUnbRm9VdHkD4Vts
```

## Troubleshooting

### Common Issues

1. **"Invalid JWT" errors**
   - Ensure Clerk domain is correctly configured in Supabase
   - Check that the integration is activated in Clerk dashboard

2. **RLS policy violations**
   - Verify user is signed in with Clerk
   - Check that `clerk_user_id` matches the authenticated user

3. **Profile creation fails**
   - Ensure email is available from Clerk user object
   - Check database permissions and RLS policies

### Testing Commands

```bash
# Run the development server
npm run dev

# Test the integration
open http://localhost:3000/test-integration

# Check database directly
npx supabase db diff
```

## Next Steps

After completing the manual setup steps:

1. **Test the integration** using the test page
2. **Implement Stripe webhooks** for subscription management
3. **Add layout saving functionality** to main components
4. **Set up production environment** with proper domains

## Support

If you encounter issues:
1. Check the test page for specific error messages
2. Verify all environment variables are set correctly
3. Ensure both Clerk and Supabase configurations are saved
4. Check browser console for additional error details
