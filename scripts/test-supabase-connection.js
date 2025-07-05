#!/usr/bin/env node

// Test script to verify Supabase connection and update products with Stripe price IDs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function checkCurrentProducts() {
  console.log('\n📋 Checking current products...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly');
    
    if (error) {
      console.error('❌ Error fetching products:', error.message);
      return null;
    }
    
    console.log('Current products:');
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price_monthly}/mo, $${product.price_yearly}/yr`);
      console.log(`  Monthly Price ID: ${product.stripe_price_monthly_id || 'NOT SET'}`);
      console.log(`  Yearly Price ID: ${product.stripe_price_yearly_id || 'NOT SET'}`);
    });
    
    return products;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return null;
  }
}

async function updateProductPrices() {
  console.log('\n🔄 Updating products with Stripe price IDs...');
  
  try {
    // Update Pro plan
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
    
    console.log('✅ Pro plan updated');
    
    // Update Premium plan
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
    
    console.log('✅ Premium plan updated');
    return true;
  } catch (err) {
    console.error('❌ Update error:', err.message);
    return false;
  }
}

async function verifyUpdates() {
  console.log('\n✅ Verifying updates...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly');
    
    if (error) {
      console.error('❌ Error verifying updates:', error.message);
      return false;
    }
    
    let allUpdated = true;
    
    products.forEach(product => {
      console.log(`\n${product.name} Plan:`);
      console.log(`  Monthly: $${product.price_monthly} (${product.stripe_price_monthly_id})`);
      console.log(`  Yearly: $${product.price_yearly} (${product.stripe_price_yearly_id})`);
      
      if (!product.stripe_price_monthly_id || !product.stripe_price_yearly_id) {
        console.log(`  ❌ Missing Stripe price IDs for ${product.name}`);
        allUpdated = false;
      } else {
        console.log(`  ✅ ${product.name} plan properly configured`);
      }
    });
    
    return allUpdated;
  } catch (err) {
    console.error('❌ Verification error:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Database Setup and Verification\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  // Check current products
  const products = await checkCurrentProducts();
  if (!products) {
    process.exit(1);
  }
  
  // Check if updates are needed
  const needsUpdate = products.some(p => !p.stripe_price_monthly_id || !p.stripe_price_yearly_id);
  
  if (needsUpdate) {
    // Update products
    const updated = await updateProductPrices();
    if (!updated) {
      process.exit(1);
    }
    
    // Verify updates
    const verified = await verifyUpdates();
    if (!verified) {
      process.exit(1);
    }
  } else {
    console.log('\n✅ All products already have Stripe price IDs configured');
  }
  
  console.log('\n🎉 Database setup complete! Products are ready for Stripe integration.');
}

main().catch(console.error);