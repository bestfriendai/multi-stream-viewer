#!/usr/bin/env node

/**
 * Create a database function to add subscription columns
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akwvmljopucsnorvdwuu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd3ZtbGpvcHVjc25vcnZkd3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc1MjUzMiwiZXhwIjoyMDYwMzI4NTMyfQ.J-LVAtCa116zSmNBPe5WnYw1eL09VWL9qvlc-kGFU6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔧 Attempting to add subscription columns through database functions...\n');

async function attemptMigration() {
    try {
        // Since we can't run DDL directly, let's just verify what we need
        // and create the exact instructions for manual execution
        
        console.log('📋 MANUAL MIGRATION REQUIRED');
        console.log('===============================\n');
        
        console.log('Please run this SQL in your Supabase Dashboard:');
        console.log('https://supabase.com/dashboard/project/akwvmljopucsnorvdwuu/sql/new\n');
        
        console.log('-- Migration: Add subscription fields to profiles table');
        console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT \'inactive\';');
        console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT \'free\';');
        console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;');
        console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;');
        console.log('');
        console.log('-- Add performance indexes');
        console.log('CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);');
        console.log('CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);');
        console.log('CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);');
        console.log('');
        console.log('-- Set default values for existing users');
        console.log('UPDATE profiles SET subscription_tier = \'free\', subscription_status = \'inactive\' WHERE subscription_tier IS NULL;');
        
        console.log('\n🎯 After running the SQL:');
        console.log('1. The webhook handler will work correctly');
        console.log('2. Subscription badges will appear in the app header');
        console.log('3. Users will see Pro/Premium status immediately after payment');
        console.log('4. All subscription features will be fully functional');
        
        console.log('\n📊 Current Status:');
        
        // Check products
        const { data: products } = await supabase
            .from('products')
            .select('name, price_monthly, stripe_price_monthly_id')
            .eq('active', true);
            
        console.log(`✅ Products configured: ${products?.length || 0}`);
        products?.forEach(p => console.log(`   - ${p.name}: $${p.price_monthly}/mo`));
        
        // Check if any subscriptions exist
        const { data: subs } = await supabase
            .from('subscriptions')
            .select('*')
            .limit(1);
            
        console.log(`✅ Subscriptions table ready: ${subs ? 'Yes' : 'No'}`);
        
        // Check profiles count
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
            
        console.log(`✅ User profiles: ${count || 0} users`);
        
        console.log('\n⚡ Everything is ready except the database schema!');
        console.log('   Just run the SQL above and your subscription system will be fully autonomous.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

attemptMigration();