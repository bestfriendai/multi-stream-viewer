# Subscription Data Flow Analysis - TODO

## Problem Analysis
We need to verify how the subscription status from the Supabase database is being reflected in the app. The goal is to understand the complete flow of how a user's subscription status gets from the Supabase database to being displayed in the app interface.

## Todo Items

### 1. Database Schema Analysis
- [x] **COMPLETED** - Review Supabase database structure in `/src/lib/supabase.ts`
- [x] **COMPLETED** - Check profiles table schema for subscription fields
- [x] **COMPLETED** - Check subscriptions table schema and relationships
- [x] **COMPLETED** - Check products table schema

### 2. API Endpoints Analysis
- [x] **COMPLETED** - Analyze `/api/subscription/status` endpoint implementation
- [x] **COMPLETED** - Analyze `/api/subscription/get-active` endpoint implementation
- [x] **COMPLETED** - Document the differences between these two endpoints
- [ ] **PENDING** - Test both endpoints to verify they return consistent data

### 3. Subscription Library Analysis
- [x] **COMPLETED** - Review `/lib/subscription.ts` implementation
- [x] **COMPLETED** - Check `getUserSubscription()` function
- [x] **COMPLETED** - Check `getSubscriptionLimits()` function
- [x] **COMPLETED** - Check feature access functions

### 4. useSubscription Hook Analysis
- [x] **COMPLETED** - Review `useSubscription` hook implementation
- [x] **COMPLETED** - Check how it fetches subscription data
- [x] **COMPLETED** - Check auto-sync functionality
- [ ] **PENDING** - Test the hook's error handling

### 5. UI Components Analysis
- [x] **COMPLETED** - Review Header component subscription badge logic
- [x] **COMPLETED** - Review Profile page subscription display
- [ ] **PENDING** - Check if subscription data is displayed correctly in both components
- [ ] **PENDING** - Verify that subscription changes are reflected in real-time

### 6. Data Flow Verification
- [ ] **PENDING** - Test the complete flow: Database → API → Hook → UI
- [ ] **PENDING** - Verify subscription status updates are propagated correctly
- [ ] **PENDING** - Check sync service integration
- [ ] **PENDING** - Test edge cases (expired subscriptions, sync failures)

### 7. Integration Points Analysis
- [x] **COMPLETED** - Review subscription sync service
- [ ] **PENDING** - Check Stripe webhook integration
- [ ] **PENDING** - Verify data consistency between different sources

## Key Findings So Far

### Database Structure
The Supabase database has:
- `profiles` table with subscription-related fields (subscription_status, subscription_tier, subscription_expires_at, stripe_subscription_id)
- `subscriptions` table with detailed subscription data
- `products` table with plan information

### API Endpoints
There are two subscription endpoints:
1. `/api/subscription/status` - Returns subscription status directly from profiles table
2. `/api/subscription/get-active` - Uses a database function `get_active_subscription`

### Data Flow
The current flow appears to be:
1. `useSubscription` hook calls `getUserSubscription()` from `/lib/subscription.ts`
2. `getUserSubscription()` calls `/api/subscription/get-active` endpoint
3. The endpoint uses the `get_active_subscription` database function
4. The hook provides subscription data to UI components
5. Header and Profile components display subscription badges/status

### API Endpoint Differences

**`/api/subscription/status`:**
- Uses service role key for direct database access
- Queries profiles table directly using `clerk_user_id`
- Returns subscription status from profiles table fields:
  - `subscription_status`
  - `subscription_tier` 
  - `subscription_expires_at`
  - `stripe_subscription_id`
- Performs expiration check client-side
- Returns structured response with boolean flags
- Includes profile information in response

**`/api/subscription/get-active`:**
- Uses standard Supabase client with RLS
- First gets profile by `clerk_user_id` to get UUID
- Then calls database function `get_active_subscription(user_uuid)`
- Returns raw subscription data from subscriptions table
- Depends on database function existing
- Returns subscription object directly or null

### Potential Issues Identified
1. **Two different API endpoints** - `/status` and `/get-active` return different data formats and use different database access patterns
2. **Missing database fields** - The profiles table schema in TypeScript types doesn't include subscription fields (subscription_status, subscription_tier, subscription_expires_at)
3. **Sync complexity** - Auto-sync functionality adds complexity that could cause inconsistencies
4. **Database function dependency** - `/get-active` depends on `get_active_subscription` function existing in database
5. **RLS vs Service Role** - Different endpoints use different authentication methods which could cause permission issues
6. **Data source inconsistency** - One endpoint uses profiles table, other uses subscriptions table via database function

## Next Steps
1. Test both API endpoints to understand differences
2. Check if the database migration for subscription fields in profiles table was applied
3. Verify that the database function `get_active_subscription` exists and works correctly
4. Test the complete data flow end-to-end