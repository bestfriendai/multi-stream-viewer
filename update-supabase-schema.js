const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function updateSupabaseSchema() {
  console.log('🔧 Updating Supabase schema for pro memberships...');
  
  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // First, let's check the current structure of profiles table
    console.log('\n📋 Checking current profiles table structure...');
    const { data: currentProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    if (currentProfiles.length > 0) {
      console.log('✅ Current profile columns:', Object.keys(currentProfiles[0]));
    }

    // Add subscription_status column if it doesn't exist
    console.log('\n🔧 Adding subscription_status column...');
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';
      `
    });

    if (addColumnError) {
      console.log('ℹ️  Could not add column via RPC, trying direct SQL...');
      // Try alternative approach
      const { error: altError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'none' })
        .eq('id', 'non-existent-id'); // This will fail but might give us info
      
      console.log('Alternative approach result:', altError?.message);
    } else {
      console.log('✅ subscription_status column added successfully');
    }

    // Add subscription_tier column
    console.log('\n🔧 Adding subscription_tier column...');
    const { error: addTierError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
      `
    });

    if (addTierError) {
      console.log('ℹ️  Could not add tier column:', addTierError.message);
    } else {
      console.log('✅ subscription_tier column added successfully');
    }

    // Add subscription_expires_at column
    console.log('\n🔧 Adding subscription_expires_at column...');
    const { error: addExpiresError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
      `
    });

    if (addExpiresError) {
      console.log('ℹ️  Could not add expires column:', addExpiresError.message);
    } else {
      console.log('✅ subscription_expires_at column added successfully');
    }

    // Create subscriptions table if it doesn't exist
    console.log('\n🔧 Creating subscriptions table...');
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          stripe_subscription_id TEXT UNIQUE,
          stripe_customer_id TEXT,
          status TEXT NOT NULL DEFAULT 'inactive',
          plan_name TEXT,
          price_id TEXT,
          current_period_start TIMESTAMP WITH TIME ZONE,
          current_period_end TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createTableError) {
      console.log('ℹ️  Could not create subscriptions table:', createTableError.message);
    } else {
      console.log('✅ subscriptions table created successfully');
    }

    // Check the updated structure
    console.log('\n📋 Checking updated profiles table...');
    const { data: updatedProfiles, error: updatedError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (updatedError) {
      console.error('❌ Error fetching updated profiles:', updatedError);
    } else if (updatedProfiles.length > 0) {
      console.log('✅ Updated profile columns:', Object.keys(updatedProfiles[0]));
    }

    console.log('\n✅ Schema update completed!');

  } catch (error) {
    console.error('❌ Error updating schema:', error);
  }
}

updateSupabaseSchema();