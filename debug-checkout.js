#!/usr/bin/env node

/**
 * Debug checkout session creation
 * This script simulates the checkout process to identify the issue
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugCheckout() {
  try {
    console.log('🔍 Debugging checkout session creation...');
    
    // 1. Check environment variables
    console.log('\n📋 Environment Check:');
    console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
    console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing');
    
    // 2. Test Stripe connection
    console.log('\n🔗 Testing Stripe connection...');
    const balance = await stripe.balance.retrieve();
    console.log('✅ Stripe connection successful');
    
    // 3. Get products from Supabase
    console.log('\n📦 Fetching products from Supabase...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);
    
    if (productsError) {
      console.error('❌ Products fetch error:', productsError);
      return;
    }
    
    console.log(`✅ Found ${products.length} products`);
    
    // 4. Test checkout session creation for each product
    for (const product of products) {
      console.log(`\n🧪 Testing ${product.name} checkout session...`);
      
      try {
        // Test monthly price
        console.log(`  Testing monthly price: ${product.stripe_price_monthly_id}`);
        const monthlySession = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [{
            price: product.stripe_price_monthly_id,
            quantity: 1,
          }],
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel',
          metadata: {
            product_id: product.id,
            test: 'true'
          }
        });
        console.log(`  ✅ Monthly session created: ${monthlySession.id}`);
        
        // Test yearly price
        console.log(`  Testing yearly price: ${product.stripe_price_yearly_id}`);
        const yearlySession = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [{
            price: product.stripe_price_yearly_id,
            quantity: 1,
          }],
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel',
          metadata: {
            product_id: product.id,
            test: 'true'
          }
        });
        console.log(`  ✅ Yearly session created: ${yearlySession.id}`);
        
      } catch (error) {
        console.error(`  ❌ Error for ${product.name}:`, error.message);
        
        // Check if price exists in Stripe
        try {
          await stripe.prices.retrieve(product.stripe_price_monthly_id);
          console.log(`  ✅ Monthly price exists in Stripe`);
        } catch (priceError) {
          console.error(`  ❌ Monthly price not found:`, priceError.message);
        }
        
        try {
          await stripe.prices.retrieve(product.stripe_price_yearly_id);
          console.log(`  ✅ Yearly price exists in Stripe`);
        } catch (priceError) {
          console.error(`  ❌ Yearly price not found:`, priceError.message);
        }
      }
    }
    
    console.log('\n🎉 Checkout debugging complete!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugCheckout().then(() => process.exit(0));