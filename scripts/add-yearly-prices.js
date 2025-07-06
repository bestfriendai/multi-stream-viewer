#!/usr/bin/env node

/**
 * Add yearly price IDs to Supabase products
 * Usage: node scripts/add-yearly-prices.js [pro_yearly_price_id] [premium_yearly_price_id]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const [,, proYearlyPriceId, premiumYearlyPriceId] = process.argv;

if (!proYearlyPriceId || !premiumYearlyPriceId) {
  console.log('Usage: node scripts/add-yearly-prices.js [pro_yearly_price_id] [premium_yearly_price_id]');
  console.log('');
  console.log('Example:');
  console.log('node scripts/add-yearly-prices.js price_1234567890 price_0987654321');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addYearlyPrices() {
  console.log('🔄 Adding yearly prices to Supabase...');
  
  // Update Pro plan with yearly price
  const { error: proError } = await supabase
    .from('products')
    .update({
      stripe_price_yearly_id: proYearlyPriceId
    })
    .eq('name', 'Pro')
    .eq('active', true);

  if (proError) {
    console.error('❌ Error updating Pro plan:', proError);
  } else {
    console.log(`✅ Pro plan yearly price updated: ${proYearlyPriceId}`);
  }

  // Update Premium plan with yearly price
  const { error: premiumError } = await supabase
    .from('products')
    .update({
      stripe_price_yearly_id: premiumYearlyPriceId
    })
    .eq('name', 'Premium')
    .eq('active', true);

  if (premiumError) {
    console.error('❌ Error updating Premium plan:', premiumError);
  } else {
    console.log(`✅ Premium plan yearly price updated: ${premiumYearlyPriceId}`);
  }

  // Verify updates
  console.log('\n🔍 Final verification...');
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('price_monthly');

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    return;
  }

  console.log('📦 Final products configuration:');
  products.forEach(product => {
    console.log(`  ${product.name}:`);
    console.log(`    Monthly: ${product.stripe_price_monthly_id} ($${product.price_monthly})`);
    console.log(`    Yearly:  ${product.stripe_price_yearly_id} ($${product.price_yearly})`);
  });

  console.log('\n✅ All price IDs updated successfully!');
  console.log('\n🧪 Ready to test subscription flow!');
}

addYearlyPrices().catch(console.error);