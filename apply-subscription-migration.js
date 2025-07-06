#!/usr/bin/env node

/**
 * Apply subscription migration using Supabase service role
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akwvmljopucsnorvdwuu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd3ZtbGpvcHVjc25vcnZkd3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc1MjUzMiwiZXhwIjoyMDYwMzI4NTMyfQ.J-LVAtCa116zSmNBPe5WnYw1eL09VWL9qvlc-kGFU6s';

console.log('🔧 Applying subscription migration through API...\n');

// Try multiple approaches to add the columns
async function applyMigration() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    try {
        // First, let's check what columns exist
        console.log('1. Checking current profiles table structure...');
        const { data: existingData, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);
            
        if (checkError) {
            console.error('❌ Cannot access profiles table:', checkError.message);
            return;
        }
        
        const existingColumns = existingData && existingData.length > 0 ? Object.keys(existingData[0]) : [];
        console.log('   Existing columns:', existingColumns.join(', '));
        
        // Check if subscription columns already exist
        const hasSubscriptionColumns = existingColumns.includes('subscription_status') && 
                                      existingColumns.includes('subscription_tier');
        
        if (hasSubscriptionColumns) {
            console.log('✅ Subscription columns already exist!');
        } else {
            console.log('❌ Subscription columns missing');
            console.log('\n⚠️  Database migration required');
            console.log('   Please run this SQL in your Supabase Dashboard → SQL Editor:');
            console.log('\n   -- Add subscription fields to profiles table');
            console.log('   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT \'inactive\';');
            console.log('   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT \'free\';');
            console.log('   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;');
            console.log('   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;');
            console.log('\n   -- Add indexes for performance');
            console.log('   CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);');
            console.log('   CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);');
            console.log('   CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);');
            console.log('\n   -- Set default values for existing users');
            console.log('   UPDATE profiles SET subscription_tier = \'free\', subscription_status = \'inactive\' WHERE subscription_tier IS NULL;');
        }
        
        // Now let's check the subscriptions table
        console.log('\n2. Checking subscriptions table...');
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .limit(3);
            
        if (subError) {
            console.error('❌ Cannot access subscriptions table:', subError.message);
        } else {
            console.log(`✅ Subscriptions table exists with ${subscriptions?.length || 0} records`);
        }
        
        // Check products table
        console.log('\n3. Checking products table...');
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('name, price_monthly, stripe_price_monthly_id, stripe_price_yearly_id')
            .eq('active', true);
            
        if (prodError) {
            console.error('❌ Cannot access products table:', prodError.message);
        } else {
            console.log(`✅ Products table exists with ${products?.length || 0} active products:`);
            products?.forEach(p => {
                console.log(`   - ${p.name}: $${p.price_monthly}/mo (Monthly: ${p.stripe_price_monthly_id})`);
            });
        }
        
        // Test webhook functionality by checking if we can query as expected
        console.log('\n4. Testing webhook handler compatibility...');
        if (hasSubscriptionColumns) {
            // Try a query that the webhook handler would make
            const { data: profileTest, error: profileError } = await supabase
                .from('profiles')
                .select('id, subscription_status, subscription_tier, stripe_customer_id')
                .limit(1);
                
            if (profileError) {
                console.error('❌ Webhook compatibility test failed:', profileError.message);
            } else {
                console.log('✅ Webhook handler queries will work correctly');
            }
        } else {
            console.log('⚠️  Webhook handler will fail until migration is applied');
        }
        
        console.log('\n📊 Summary:');
        console.log('===========');
        console.log(`Database Schema: ${hasSubscriptionColumns ? '✅ Ready' : '❌ Migration needed'}`);
        console.log(`Products: ${products?.length || 0} configured`);
        console.log(`Subscriptions: ${subscriptions?.length || 0} records`);
        
        if (!hasSubscriptionColumns) {
            console.log('\n🎯 Next Steps:');
            console.log('1. Copy the SQL above');
            console.log('2. Go to https://supabase.com/dashboard/project/akwvmljopucsnorvdwuu/sql/new');
            console.log('3. Paste and run the SQL');
            console.log('4. Test subscription flow');
        } else {
            console.log('\n🎉 Database is ready for subscriptions!');
        }
        
    } catch (error) {
        console.error('❌ Migration check failed:', error.message);
    }
}

applyMigration();