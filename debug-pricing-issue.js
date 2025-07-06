#!/usr/bin/env node

/**
 * Debug the pricing page checkout issue
 * This script will help identify the exact problem
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugPricingIssue() {
  console.log('🔍 Debugging pricing page checkout issue...');
  
  try {
    // 1. Check environment variables
    console.log('\n📋 Environment Check:');
    const envVars = {
      'STRIPE_SECRET_KEY': !!process.env.STRIPE_SECRET_KEY,
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      'CLERK_SECRET_KEY': !!process.env.CLERK_SECRET_KEY,
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      'NEXT_PUBLIC_SUPABASE_URL': !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      'SUPABASE_SERVICE_ROLE_KEY': !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
    
    Object.entries(envVars).forEach(([key, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${key}`);
    });
    
    // 2. Test Supabase connection and products
    console.log('\n📦 Supabase Products Check:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);
    
    if (productsError) {
      console.error('❌ Products fetch failed:', productsError);
      return;
    }
    
    console.log(`✅ Found ${products.length} active products`);
    products.forEach(product => {
      console.log(`\n  📦 ${product.name}:`);
      console.log(`     ID: ${product.id}`);
      console.log(`     Monthly: $${product.price_monthly} (${product.stripe_price_monthly_id})`);
      console.log(`     Yearly: $${product.price_yearly} (${product.stripe_price_yearly_id})`);
    });
    
    // 3. Test Stripe price validation
    console.log('\n💳 Stripe Price Validation:');
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    for (const product of products) {
      console.log(`\n  Testing ${product.name} prices...`);
      
      try {
        const monthlyPrice = await stripe.prices.retrieve(product.stripe_price_monthly_id);
        console.log(`    ✅ Monthly price valid: $${monthlyPrice.unit_amount / 100}`);
      } catch (error) {
        console.log(`    ❌ Monthly price invalid: ${error.message}`);
      }
      
      try {
        const yearlyPrice = await stripe.prices.retrieve(product.stripe_price_yearly_id);
        console.log(`    ✅ Yearly price valid: $${yearlyPrice.unit_amount / 100}`);
      } catch (error) {
        console.log(`    ❌ Yearly price invalid: ${error.message}`);
      }
    }
    
    // 4. Common Issues Check
    console.log('\n🔧 Common Issues Check:');
    
    // Check if using test vs live keys
    const isTestKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
    const isLiveKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
    console.log(`  Stripe Key Type: ${isTestKey ? 'TEST' : isLiveKey ? 'LIVE' : 'UNKNOWN'}`);
    
    // Check if price IDs match key type
    const samplePriceId = products[0]?.stripe_price_monthly_id;
    if (samplePriceId) {
      const priceIsTest = samplePriceId.includes('test');
      const priceIsLive = !priceIsTest;
      console.log(`  Price ID Type: ${priceIsTest ? 'TEST' : 'LIVE'}`);
      
      if ((isTestKey && priceIsLive) || (isLiveKey && priceIsTest)) {
        console.log('  ⚠️  WARNING: Key type and price ID type mismatch!');
        console.log('     This could cause checkout session creation to fail.');
      } else {
        console.log('  ✅ Key type and price ID type match');
      }
    }
    
    // 5. Recommendations
    console.log('\n💡 Recommendations:');
    console.log('  1. Make sure you are signed in when testing the pricing page');
    console.log('  2. Check browser console for authentication errors');
    console.log('  3. Verify Clerk authentication is working properly');
    console.log('  4. Test with the simple test endpoint: /api/stripe/test-checkout-simple');
    
    console.log('\n🎉 Debugging complete!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPricingIssue().then(() => process.exit(0));