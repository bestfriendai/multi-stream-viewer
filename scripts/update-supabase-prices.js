#!/usr/bin/env node

/**
 * Update Supabase products table with correct Stripe price IDs
 * Run with: node scripts/update-supabase-prices.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePrices() {
  console.log('🔍 Checking current products...');
  
  // First, get current products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('price_monthly');

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    return;
  }

  console.log('📦 Current products:');
  products.forEach(product => {
    console.log(`  ${product.name}: monthly=${product.stripe_price_monthly_id}, yearly=${product.stripe_price_yearly_id}`);
  });

  console.log('\n🔄 Updating with live Stripe price IDs...');

  // Update Pro plan
  const { error: proError } = await supabase
    .from('products')
    .update({
      stripe_price_monthly_id: 'price_1RhLeMKUMGTMjCZ47Kn0pKxr', // $9.99/month
      stripe_price_yearly_id: null // Need to create yearly price
    })
    .eq('name', 'Pro')
    .eq('active', true);

  if (proError) {
    console.error('❌ Error updating Pro plan:', proError);
  } else {
    console.log('✅ Pro plan updated');
  }

  // Update Premium plan
  const { error: premiumError } = await supabase
    .from('products')
    .update({
      stripe_price_monthly_id: 'price_1RhLeiKUMGTMjCZ4Jqql3RvC', // $19.99/month
      stripe_price_yearly_id: null // Need to create yearly price
    })
    .eq('name', 'Premium')
    .eq('active', true);

  if (premiumError) {
    console.error('❌ Error updating Premium plan:', premiumError);
  } else {
    console.log('✅ Premium plan updated');
  }

  // Verify updates
  console.log('\n🔍 Verifying updates...');
  const { data: updatedProducts, error: verifyError } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('price_monthly');

  if (verifyError) {
    console.error('❌ Error verifying updates:', verifyError);
    return;
  }

  console.log('📦 Updated products:');
  updatedProducts.forEach(product => {
    console.log(`  ${product.name}: monthly=${product.stripe_price_monthly_id}, yearly=${product.stripe_price_yearly_id}`);
  });

  console.log('\n✅ Price IDs updated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Create yearly prices in Stripe Dashboard or with Stripe CLI');
  console.log('2. Update the yearly price IDs in Supabase');
  console.log('3. Test the subscription flow');
}

updatePrices().catch(console.error);