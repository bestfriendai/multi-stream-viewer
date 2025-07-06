# Stripe Test Setup Creation Plan

## Overview
Create a simple test setup to safely test Stripe checkout session creation without touching live data or requiring authentication.

## Current State Analysis
- ✅ Stripe integration is fully implemented and working
- ✅ Live Stripe keys are configured in production
- ✅ Full pricing page and API routes exist
- ❌ No safe test environment for checkout session creation testing
- ❌ No simple HTML test page for isolated testing

## Task List

### Phase 1: Analysis and Planning
- [ ] Analyze existing pricing page structure
- [ ] Identify the checkout session creation logic
- [ ] Determine test data requirements
- [ ] Plan minimal test implementation

### Phase 2: Create Test API Endpoint
- [ ] Create simple test API endpoint using Stripe test keys
- [ ] Use hardcoded test product/price data
- [ ] Ensure test mode is clearly marked and safe
- [ ] Add test-specific error handling

### Phase 3: Create Test HTML Page
- [ ] Create simple HTML test page
- [ ] Add basic styling for clarity
- [ ] Include test buttons for different scenarios
- [ ] Add clear test mode indicators

### Phase 4: Documentation and Safety
- [ ] Document test setup clearly
- [ ] Provide exact testing instructions
- [ ] Ensure test keys are clearly separated from live keys
- [ ] Add safety warnings and test mode indicators

## Test Requirements
- Use Stripe test keys only
- No authentication required
- Simple HTML interface
- Clear test mode indicators
- Safe test data only
- No database writes for test

## Notes
- Keep test files completely separate from production code
- Use obvious test naming conventions
- Include safety checks to prevent accidental live key usage
- Focus on checkout session creation logic only

## ✅ IMPLEMENTATION COMPLETE

### 🎯 Successfully Created Test Environment

**Phase 1: Analysis and Planning** ✅
- Analyzed existing pricing page structure (`/src/app/pricing/page.tsx`)
- Identified checkout session creation logic in API route (`/src/app/api/stripe/create-checkout-session/route.ts`)
- Determined test data requirements (test keys, test price IDs, test customer data)
- Planned minimal test implementation focusing on core checkout session creation

**Phase 2: Test API Endpoint** ✅
- Created `/src/app/api/stripe/test-checkout-session/route.ts`
- Uses hardcoded Stripe test keys with safety validation
- Includes test price IDs for all subscription plans
- No authentication required for testing
- Comprehensive error handling and test mode indicators
- Safety check to prevent live key usage

**Phase 3: Test HTML Page** ✅
- Created `/public/stripe-test.html`
- Professional interface with clear test mode indicators
- Four test buttons for different subscription scenarios
- Real-time test results display
- Comprehensive testing instructions
- Safety warnings throughout the interface

**Phase 4: Documentation and Safety** ✅
- Created comprehensive documentation (`STRIPE_TEST_SETUP.md`)
- Provided exact testing instructions
- Ensured test keys are clearly separated from live keys
- Added multiple safety warnings and test mode indicators

### 🧪 Test Components Created

1. **Test API Endpoint**: `/src/app/api/stripe/test-checkout-session/route.ts`
   - Uses hardcoded test keys only
   - Creates checkout sessions for Pro/Premium plans
   - No database writes or authentication required
   - Comprehensive error handling

2. **Test HTML Page**: `/public/stripe-test.html`
   - Clean, professional interface
   - Four test scenarios (Pro/Premium Monthly/Yearly)
   - Real-time results display
   - Clear test mode indicators

3. **Documentation**: `/STRIPE_TEST_SETUP.md`
   - Complete testing instructions
   - Safety guidelines
   - Troubleshooting section
   - Test card details

### 🛡️ Safety Features Implemented

- **Test Key Validation**: Prevents live key usage
- **Test Mode Indicators**: Clear warnings throughout
- **No Authentication**: Safe testing without login
- **No Database Writes**: Isolated test environment
- **Test Customer Creation**: Uses test@example.com
- **Comprehensive Error Handling**: Detailed error messages

### 📋 Testing Instructions

1. **Access Test Page**: `http://localhost:3000/stripe-test.html`
2. **Choose Test Plan**: Click any test button
3. **Use Test Card**: `4242 4242 4242 4242`
4. **Complete Checkout**: Follow Stripe test flow
5. **Verify Results**: Check session creation and redirect

### 🎉 Ready for Testing

The test environment is now complete and ready for safe Stripe checkout session testing. All components are properly isolated from production code and use only test keys and test data.

**Status: Test Environment Ready** ✅

---

# Supabase Database Schema Investigation

## Issues Identified

Based on my investigation of the Supabase database schema and related code, I've identified several potential issues that could be causing the 406 and 500 errors:

### 1. **RLS (Row Level Security) Policy Issues**
- **Problem**: The RLS policies in the profiles table are using `auth.jwt()->>'sub'` but Clerk uses a different JWT structure
- **Impact**: This causes 406 errors when trying to fetch profiles because the RLS policy denies access
- **Location**: `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/supabase/migrations/20250703234336_create_initial_schema.sql` lines 87-94

### 2. **Clerk-Supabase Integration Configuration**
- **Problem**: The Supabase config shows Clerk integration is enabled but the JWT claim mapping may be incorrect
- **Impact**: Authentication tokens from Clerk may not be properly recognized by Supabase
- **Location**: `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/supabase/config.toml` lines 282-285

### 3. **Inconsistent Stripe Price IDs**
- **Problem**: Multiple SQL files show different Stripe price IDs, indicating potential inconsistency
- **Impact**: This could cause 500 errors when creating checkout sessions due to invalid price IDs
- **Files**: 
  - `update_products_with_stripe_ids.sql`
  - `scripts/update-stripe-prices.sql`
  - `supabase/migrations/20250705_update_stripe_prices.sql`

### 4. **Missing Service Role Key Usage**
- **Problem**: Server-side operations may not be using the service role key properly
- **Impact**: Database operations fail due to RLS restrictions
- **Location**: `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/src/lib/supabase/server.ts`

### 5. **Profile Creation Logic Issues**
- **Problem**: The profile creation logic in multiple places could lead to race conditions
- **Impact**: Multiple attempts to create the same profile could cause errors
- **Locations**: 
  - `src/contexts/SupabaseContext.tsx`
  - `src/app/api/stripe/create-checkout-session/route.ts`

## Database Schema Analysis

### Current Schema Structure:
- **profiles table**: Has proper structure with Clerk integration
- **products table**: Contains subscription plans with Stripe integration
- **subscriptions table**: Links users to their active subscriptions
- **saved_layouts table**: User-specific layout storage
- **user_preferences table**: User preference storage

### RLS Policies:
- All tables have RLS enabled
- Policies rely on JWT claims that may not match Clerk's structure
- Service role bypass is implemented for webhooks

### Key Files Reviewed:
1. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/supabase/migrations/20250703234336_create_initial_schema.sql`
2. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/supabase/config.toml`
3. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/src/lib/supabase.ts`
4. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/src/lib/supabase/server.ts`
5. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/src/contexts/SupabaseContext.tsx`
6. `/Users/iamabillionaire/Desktop/untitled folder 2/multi-stream-viewer/src/app/api/stripe/create-checkout-session/route.ts`

## Root Cause Analysis

### 406 Errors (Profile Fetching)
The 406 errors when fetching profiles are likely caused by:
1. **JWT Structure Mismatch**: Clerk's JWT structure doesn't match what the RLS policy expects
2. **Incorrect Claims**: The `auth.jwt()->>'sub'` claim extraction may not work with Clerk tokens
3. **Authentication Context**: The client-side authentication context might not be properly passed to Supabase

### 500 Errors (Checkout Session Creation)
The 500 errors when creating checkout sessions are likely caused by:
1. **Inconsistent Price IDs**: Multiple files have different Stripe price IDs
2. **Database Connection Issues**: Server-side Supabase client configuration issues
3. **Profile Creation Race Conditions**: Multiple concurrent attempts to create the same profile

## Recommended Solutions

### High Priority
1. **Fix RLS Policies**: Update JWT claim extraction to match Clerk's structure
2. **Verify Stripe Integration**: Ensure all price IDs are consistent and valid
3. **Improve Error Handling**: Add better error logging and handling

### Medium Priority
4. **Add Database Functions**: Create functions to handle common operations safely
5. **Update Clerk Configuration**: Ensure proper JWT claim mapping
6. **Implement Proper Service Role Usage**: Use service role for server-side operations

### Low Priority
7. **Add Comprehensive Testing**: Create tests for database operations
8. **Implement Caching**: Add caching for frequently accessed data
9. **Add Monitoring**: Implement proper error monitoring and alerting

## Next Steps

1. **Test Current Setup**: Use the test-supabase API endpoint to verify current issues
2. **Fix JWT Claims**: Update RLS policies to work with Clerk JWT structure
3. **Consolidate Stripe Data**: Ensure all price IDs are consistent across files
4. **Add Proper Error Handling**: Implement comprehensive error logging
5. **Test Full Flow**: Verify the entire authentication and subscription flow works