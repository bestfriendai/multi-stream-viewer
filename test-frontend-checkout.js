#!/usr/bin/env node

/**
 * Test frontend checkout flow to identify the exact issue
 * This simulates what happens when a user clicks subscribe on the pricing page
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFrontendFlow() {
  try {
    console.log('🧪 Testing frontend checkout flow...');
    
    // 1. Simulate fetching products (like the pricing page does)
    console.log('\n📦 Step 1: Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly', { ascending: true });
    
    if (productsError) {
      console.error('❌ Products fetch failed:', productsError);
      return;
    }
    
    console.log(`✅ Found ${products.length} products`);
    products.forEach(product => {
      console.log(`  - ${product.name}: $${product.price_monthly}/month, $${product.price_yearly}/year`);
      console.log(`    Monthly ID: ${product.stripe_price_monthly_id}`);
      console.log(`    Yearly ID: ${product.stripe_price_yearly_id}`);
    });
    
    // 2. Test the API endpoint directly (simulating frontend fetch)
    console.log('\n🔗 Step 2: Testing API endpoint...');
    
    for (const product of products) {
      console.log(`\n🧪 Testing ${product.name} subscription...`);
      
      // Test monthly subscription
      try {
        console.log('  Testing monthly subscription...');
        const response = await fetch('http://localhost:3000/api/stripe/checkout/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: product.stripe_price_monthly_id,
            productId: product.id,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('  ✅ Monthly checkout session created successfully');
          console.log(`     Session ID: ${data.sessionId}`);
          console.log(`     URL: ${data.url}`);
        } else {
          console.error('  ❌ Monthly checkout failed:');
          console.error(`     Status: ${response.status}`);
          console.error(`     Error: ${data.error}`);
          if (data.details) {
            console.error(`     Details: ${data.details}`);
          }
        }
      } catch (error) {
        console.error('  ❌ Monthly request failed:', error.message);
      }
      
      // Test yearly subscription
      try {
        console.log('  Testing yearly subscription...');
        const response = await fetch('http://localhost:3000/api/stripe/checkout/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: product.stripe_price_yearly_id,
            productId: product.id,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('  ✅ Yearly checkout session created successfully');
          console.log(`     Session ID: ${data.sessionId}`);
          console.log(`     URL: ${data.url}`);
        } else {
          console.error('  ❌ Yearly checkout failed:');
          console.error(`     Status: ${response.status}`);
          console.error(`     Error: ${data.error}`);
          if (data.details) {
            console.error(`     Details: ${data.details}`);
          }
        }
      } catch (error) {
        console.error('  ❌ Yearly request failed:', error.message);
      }
    }
    
    console.log('\n🎉 Frontend flow test complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Wait a bit for the server to be ready
setTimeout(() => {
  testFrontendFlow().then(() => process.exit(0));
}, 2000);