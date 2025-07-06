#!/usr/bin/env node

/**
 * Test script to check if subscribers are properly stored in Supabase
 * and reflected in the app interface
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Testing Subscriber Database and App Reflection...\n');

async function testSubscriberDatabase() {
    try {
        // 1. Check if profiles table has subscription fields
        console.log('1️⃣ Checking profiles table structure...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);
            
        if (profilesError) {
            console.error('❌ Error querying profiles:', profilesError.message);
            return;
        }
        
        if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            const hasSubscriptionFields = 'subscription_status' in profile && 
                                        'subscription_tier' in profile && 
                                        'subscription_expires_at' in profile;
            
            if (hasSubscriptionFields) {
                console.log('✅ Profiles table has subscription fields');
                console.log(`   Fields: subscription_status, subscription_tier, subscription_expires_at`);
            } else {
                console.log('⚠️  Profiles table missing subscription fields');
                console.log('   Available fields:', Object.keys(profile));
            }
        } else {
            console.log('ℹ️  No profiles found in database');
        }

        // 2. Check for active subscribers
        console.log('\n2️⃣ Checking for active subscribers...');
        const { data: activeSubscribers, error: subscribersError } = await supabase
            .from('profiles')
            .select('id, email, full_name, subscription_status, subscription_tier, subscription_expires_at, stripe_customer_id')
            .neq('subscription_tier', 'free')
            .neq('subscription_status', 'inactive');
            
        if (subscribersError) {
            console.log('⚠️  Could not query subscription fields:', subscribersError.message);
            console.log('   This likely means the migration needs to be run');
        } else if (activeSubscribers && activeSubscribers.length > 0) {
            console.log(`✅ Found ${activeSubscribers.length} active subscriber(s):`);
            activeSubscribers.forEach((sub, i) => {
                console.log(`   ${i+1}. ${sub.email || 'No email'} - ${sub.subscription_tier} (${sub.subscription_status})`);
                if (sub.subscription_expires_at) {
                    console.log(`      Expires: ${new Date(sub.subscription_expires_at).toLocaleDateString()}`);
                }
            });
        } else {
            console.log('ℹ️  No active subscribers found');
        }

        // 3. Check subscriptions table
        console.log('\n3️⃣ Checking subscriptions table...');
        const { data: subscriptions, error: subscriptionsError } = await supabase
            .from('subscriptions')
            .select(`
                id,
                status,
                stripe_subscription_id,
                stripe_customer_id,
                current_period_end,
                products!inner(name)
            `)
            .eq('status', 'active');
            
        if (subscriptionsError) {
            console.error('❌ Error querying subscriptions:', subscriptionsError.message);
        } else if (subscriptions && subscriptions.length > 0) {
            console.log(`✅ Found ${subscriptions.length} active subscription(s) in subscriptions table:`);
            subscriptions.forEach((sub, i) => {
                console.log(`   ${i+1}. Product: ${sub.products?.name} - Status: ${sub.status}`);
                console.log(`      Stripe ID: ${sub.stripe_subscription_id}`);
                console.log(`      Period End: ${new Date(sub.current_period_end).toLocaleDateString()}`);
            });
        } else {
            console.log('ℹ️  No active subscriptions found in subscriptions table');
        }

        // 4. Test API endpoints
        console.log('\n4️⃣ Testing subscription API endpoints...');
        
        // Test subscription status endpoint
        try {
            const statusResponse = await fetch('http://localhost:3000/api/subscription/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (statusResponse.ok) {
                console.log('✅ Subscription status API endpoint is accessible');
            } else {
                console.log(`⚠️  Subscription status API returned ${statusResponse.status}: ${statusResponse.statusText}`);
            }
        } catch (error) {
            console.log('⚠️  Could not reach subscription status API:', error.message);
        }

        // Test get active subscription endpoint
        try {
            const activeResponse = await fetch('http://localhost:3000/api/subscription/get-active', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (activeResponse.ok) {
                console.log('✅ Get active subscription API endpoint is accessible');
            } else {
                console.log(`⚠️  Get active subscription API returned ${activeResponse.status}: ${activeResponse.statusText}`);
            }
        } catch (error) {
            console.log('⚠️  Could not reach get active subscription API:', error.message);
        }

        // 5. Check products table
        console.log('\n5️⃣ Checking products configuration...');
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('active', true);
            
        if (productsError) {
            console.error('❌ Error querying products:', productsError.message);
        } else if (products && products.length > 0) {
            console.log(`✅ Found ${products.length} active product(s):`);
            products.forEach((product, i) => {
                console.log(`   ${i+1}. ${product.name} - $${product.price_monthly}/mo, $${product.price_yearly}/yr`);
                console.log(`      Monthly Stripe ID: ${product.stripe_price_monthly_id || 'Not set'}`);
                console.log(`      Yearly Stripe ID: ${product.stripe_price_yearly_id || 'Not set'}`);
            });
        } else {
            console.log('⚠️  No active products found');
        }

        console.log('\n📊 Summary:');
        console.log('========================');
        
        if (profiles && profiles.length > 0 && 'subscription_status' in profiles[0]) {
            console.log('✅ Database schema includes subscription fields');
        } else {
            console.log('❌ Database schema missing subscription fields');
            console.log('   Run the migration: supabase db push');
        }
        
        if (activeSubscribers && activeSubscribers.length > 0) {
            console.log(`✅ ${activeSubscribers.length} active subscriber(s) in database`);
        } else {
            console.log('ℹ️  No active subscribers found');
        }
        
        if (subscriptions && subscriptions.length > 0) {
            console.log(`✅ ${subscriptions.length} active subscription(s) in subscriptions table`);
        }
        
        if (products && products.length > 0) {
            console.log(`✅ ${products.length} product(s) configured`);
        }

        console.log('\n🎯 Next Steps:');
        if (!profiles || profiles.length === 0 || !('subscription_status' in profiles[0])) {
            console.log('1. Run database migration to add subscription fields to profiles table');
            console.log('2. Test webhook flow by creating a test subscription');
        } else {
            console.log('1. Create test subscription to verify end-to-end flow');
            console.log('2. Check that subscription badge appears in app header');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testSubscriberDatabase();