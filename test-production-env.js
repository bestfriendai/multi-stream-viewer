#!/usr/bin/env node

/**
 * Script to test production environment variables on streamyyy.com
 * This will verify all required keys for Stripe checkout functionality
 */

const PRODUCTION_URL = 'https://streamyyy.com';

async function testProductionEnvironment() {
  console.log('🔍 Testing Production Environment Variables on streamyyy.com\n');

  try {
    // 1. Test health endpoint
    console.log('1️⃣ Checking health endpoint...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    
    if (!healthResponse.ok) {
      console.log('   ❌ Health endpoint failed:', healthResponse.status, healthResponse.statusText);
      return;
    }
    
    const healthData = await healthResponse.json();
    console.log('   ✅ Health endpoint working');
    console.log('   Environment:', healthData.environment?.nodeEnv || 'unknown');

    // 2. Test Stripe environment variables
    console.log('\n2️⃣ Testing Stripe integration...');
    
    try {
      const stripeTestResponse = await fetch(`${PRODUCTION_URL}/api/stripe/test-checkout-simple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1RhLeMKUMGTMjCZ47Kn0pKxr',
          productId: 'db42a963-1d7b-49b8-ac2b-f80b819da7ba'
        })
      });
      
      if (stripeTestResponse.ok) {
        const stripeData = await stripeTestResponse.json();
        console.log('   ✅ Stripe integration working');
        console.log('   Checkout URL created:', stripeData.url ? '✅' : '❌');
      } else {
        console.log('   ❌ Stripe test failed:', stripeTestResponse.status);
        const errorData = await stripeTestResponse.text();
        console.log('   Error:', errorData);
      }
    } catch (error) {
      console.log('   ❌ Stripe test error:', error.message);
    }

    // 3. Test Supabase connection
    console.log('\n3️⃣ Testing Supabase connection...');
    
    try {
      const supabaseTestResponse = await fetch(`${PRODUCTION_URL}/api/products`);
      
      if (supabaseTestResponse.ok) {
        const products = await supabaseTestResponse.json();
        console.log('   ✅ Supabase connection working');
        console.log('   Products found:', products.length || 0);
      } else {
        console.log('   ❌ Supabase test failed:', supabaseTestResponse.status);
      }
    } catch (error) {
      console.log('   ❌ Supabase test error:', error.message);
    }

    // 4. Test Clerk authentication endpoint
    console.log('\n4️⃣ Testing Clerk authentication...');
    
    try {
      const clerkTestResponse = await fetch(`${PRODUCTION_URL}/api/auth/user`);
      
      // We expect 401 for unauthenticated requests, which means Clerk is working
      if (clerkTestResponse.status === 401) {
        console.log('   ✅ Clerk authentication working (401 for unauthenticated)');
      } else if (clerkTestResponse.ok) {
        console.log('   ✅ Clerk authentication working (authenticated user)');
      } else {
        console.log('   ❌ Clerk test failed:', clerkTestResponse.status);
      }
    } catch (error) {
      console.log('   ❌ Clerk test error:', error.message);
    }

    // 5. Summary
    console.log('\n📊 Summary:');
    console.log('\n✅ Production environment test completed!');
    console.log('\n🔗 Test the checkout flow manually:');
    console.log('   1. Visit: https://streamyyy.com/pricing');
    console.log('   2. Sign in with your account');
    console.log('   3. Click "Get Started" on any plan');
    console.log('   4. Verify you\'re redirected to Stripe checkout');
    console.log('\n💡 If checkout still doesn\'t work:');
    console.log('   - Check browser console for errors');
    console.log('   - Verify you\'re signed in');
    console.log('   - Try a different browser/incognito mode');

  } catch (error) {
    console.error('\n❌ Error testing production environment:', error.message);
    console.error('\nThis could mean:');
    console.error('1. The site is not accessible');
    console.error('2. Network connectivity issues');
    console.error('3. Environment variables not properly set');
  }
}

// Run the test
testProductionEnvironment();