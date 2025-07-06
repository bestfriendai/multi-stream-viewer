#!/usr/bin/env node

/**
 * Run SQL migration using Supabase REST API
 */

import fetch from 'node-fetch';

const supabaseUrl = 'https://akwvmljopucsnorvdwuu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd3ZtbGpvcHVjc25vcnZkd3V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc1MjUzMiwiZXhwIjoyMDYwMzI4NTMyfQ.J-LVAtCa116zSmNBPe5WnYw1eL09VWL9qvlc-kGFU6s';

console.log('🔧 Applying subscription migration via REST API...\n');

async function runSQLMigration() {
    const sqlStatements = [
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;",
        "CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);",
        "CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);",
        "CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);",
        "UPDATE profiles SET subscription_tier = 'free', subscription_status = 'inactive' WHERE subscription_tier IS NULL;"
    ];
    
    for (let i = 0; i < sqlStatements.length; i++) {
        const sql = sqlStatements[i];
        console.log(`${i + 1}. Running: ${sql.substring(0, 50)}...`);
        
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'apikey': supabaseServiceKey
                },
                body: JSON.stringify({
                    sql: sql
                })
            });
            
            if (response.ok) {
                console.log('   ✅ Success');
            } else {
                const error = await response.text();
                console.log(`   ⚠️  Status ${response.status}: ${error}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n🧪 Testing migration result...');
    
    // Test if the migration worked by trying to query the new columns
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=subscription_status,subscription_tier&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Migration successful! Subscription columns are now accessible.');
            console.log('   Sample data:', data);
        } else {
            console.log('❌ Migration may have failed - cannot query new columns');
        }
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

runSQLMigration();