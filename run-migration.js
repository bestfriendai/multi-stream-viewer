#!/usr/bin/env node

/**
 * Apply migration to add subscription fields to profiles table
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Initialize Supabase client with service role
const supabaseUrl = 'https://akwvmljopucsnorvdwuu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd3ZtbGpvcHVjc25vcnZkd3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc1MjUzMiwiZXhwIjoyMDYwMzI4NTMyfQ.J-LVAtCa116zSmNBPe5WnYw1eL09VWL9qvlc-kGFU6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔧 Applying database migration...\n');

async function applyMigration() {
    try {
        // Add subscription fields to profiles table
        console.log('1. Adding subscription_status column...');
        const { error: error1 } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT \'inactive\';'
        });
        
        if (error1) {
            console.log('⚠️  Could not use RPC, trying direct queries...');
            
            // Try with direct query instead
            const { error: directError1 } = await supabase
                .from('profiles')
                .select('subscription_status')
                .limit(1);
                
            if (directError1 && directError1.message.includes('does not exist')) {
                console.log('❌ Subscription fields missing and cannot add via API');
                console.log('   This requires database admin access.');
                console.log('   Please run this SQL manually in your Supabase dashboard:');
                console.log('\n   ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT \'inactive\';');
                console.log('   ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT \'free\';');
                console.log('   ALTER TABLE profiles ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;');
                console.log('   ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;');
                return;
            } else if (!directError1) {
                console.log('✅ Subscription fields already exist');
            }
        } else {
            console.log('✅ subscription_status column added');
        }

        // Test if the fields now exist
        console.log('\n2. Verifying subscription fields...');
        const { data: testProfile, error: testError } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_tier, subscription_expires_at, stripe_subscription_id')
            .limit(1);
            
        if (testError) {
            if (testError.message.includes('does not exist')) {
                console.log('❌ Migration needed - please run SQL manually in Supabase dashboard');
                console.log('\nSQL to run:');
                console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT \'inactive\';');
                console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT \'free\';');
                console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;');
                console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;');
            } else {
                console.error('❌ Unexpected error:', testError.message);
            }
        } else {
            console.log('✅ All subscription fields exist and are accessible');
            
            // Update existing users to have default values
            console.log('\n3. Setting default values for existing users...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: 'free',
                    subscription_status: 'inactive'
                })
                .is('subscription_tier', null);
                
            if (updateError) {
                console.log('⚠️  Could not set default values:', updateError.message);
            } else {
                console.log('✅ Default values set for existing users');
            }
        }

        console.log('\n✅ Migration check completed!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    }
}

applyMigration();