const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSupabaseUsers() {
  console.log('🔍 Checking Supabase user data...');
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Check profiles table
    console.log('\n📊 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log(`✅ Found ${profiles.length} profiles`);
      profiles.forEach((profile, index) => {
        console.log(`\n${index + 1}. Profile:`);
        console.log(`   - ID: ${profile.id}`);
        console.log(`   - Clerk User ID: ${profile.clerk_user_id}`);
        console.log(`   - Email: ${profile.email}`);
        console.log(`   - Subscription Status: ${profile.subscription_status || 'none'}`);
        console.log(`   - Stripe Customer ID: ${profile.stripe_customer_id || 'none'}`);
        console.log(`   - Created: ${profile.created_at}`);
      });
    }

    // Check subscriptions table if it exists
    console.log('\n📊 Checking subscriptions table...');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (subscriptionsError) {
      console.log('ℹ️  Subscriptions table might not exist or is empty:', subscriptionsError.message);
    } else {
      console.log(`✅ Found ${subscriptions.length} subscriptions`);
      subscriptions.forEach((sub, index) => {
        console.log(`\n${index + 1}. Subscription:`);
        console.log(`   - ID: ${sub.id}`);
        console.log(`   - User ID: ${sub.user_id}`);
        console.log(`   - Status: ${sub.status}`);
        console.log(`   - Plan: ${sub.plan_name || sub.price_id}`);
        console.log(`   - Created: ${sub.created_at}`);
      });
    }

    // Check for users with pro status
    console.log('\n🔍 Checking for pro members...');
    const { data: proUsers, error: proError } = await supabase
      .from('profiles')
      .select('*')
      .eq('subscription_status', 'active');

    if (proError) {
      console.log('ℹ️  Error checking pro users:', proError.message);
    } else {
      console.log(`✅ Found ${proUsers.length} active pro members`);
      proUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. Pro Member:`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Clerk ID: ${user.clerk_user_id}`);
        console.log(`   - Stripe Customer: ${user.stripe_customer_id}`);
      });
    }

    // Check table structure
    console.log('\n📋 Checking profiles table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' })
      .single();

    if (tableError) {
      console.log('ℹ️  Could not get table structure:', tableError.message);
    } else {
      console.log('✅ Table structure available');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSupabaseUsers();