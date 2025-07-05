#!/usr/bin/env node

// Update script to set the correct Stripe price IDs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePrices() {
  console.log('🔄 Updating products with new Stripe price IDs...');
  
  try {
    // Update Pro plan with new price IDs
    const { error: proError } = await supabase
      .from('products')
      .update({
        stripe_price_monthly_id: 'price_1RhM9oKUMGTMjCZ4g2yPI67z',
        stripe_price_yearly_id: 'price_1RhM9uKUMGTMjCZ41faTrUwv'
      })
      .eq('name', 'Pro')
      .eq('active', true);
    
    if (proError) {
      console.error('❌ Error updating Pro plan:', proError.message);
      return false;
    }
    
    console.log('✅ Pro plan updated with new price IDs');
    
    // Update Premium plan with new price IDs
    const { error: premiumError } = await supabase
      .from('products')
      .update({
        stripe_price_monthly_id: 'price_1RhMA4KUMGTMjCZ4Iy23MnKJ',
        stripe_price_yearly_id: 'price_1RhMA8KUMGTMjCZ4wlVUc0AA'
      })
      .eq('name', 'Premium')
      .eq('active', true);
    
    if (premiumError) {
      console.error('❌ Error updating Premium plan:', premiumError.message);
      return false;
    }
    
    console.log('✅ Premium plan updated with new price IDs');
    
    // Verify the updates
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly');
    
    if (error) {
      console.error('❌ Error verifying updates:', error.message);
      return false;
    }
    
    console.log('\n📋 Updated products:');
    products.forEach(product => {
      console.log(`${product.name}:`);
      console.log(`  Monthly: $${product.price_monthly} (${product.stripe_price_monthly_id})`);
      console.log(`  Yearly: $${product.price_yearly} (${product.stripe_price_yearly_id})`);
    });
    
    return true;
  } catch (err) {
    console.error('❌ Update error:', err.message);
    return false;
  }
}

updatePrices().then(success => {
  if (success) {
    console.log('\n🎉 Price IDs updated successfully!');
  } else {
    console.log('\n❌ Failed to update price IDs');
    process.exit(1);
  }
});