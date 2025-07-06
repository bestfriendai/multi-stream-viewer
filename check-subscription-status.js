const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSubscriptionStatus() {
  console.log('🔍 Checking subscription status in Supabase...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Check current profiles
    console.log('\n📊 Current user profiles:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    console.log(`✅ Found ${profiles.length} profiles`);
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. Profile:`);
      console.log(`   - Email: ${profile.email}`);
      console.log(`   - Clerk ID: ${profile.clerk_user_id}`);
      console.log(`   - Stripe Customer: ${profile.stripe_customer_id}`);
      console.log(`   - Subscription Status: ${profile.subscription_status || 'NOT SET'}`);
      console.log(`   - Subscription Tier: ${profile.subscription_tier || 'NOT SET'}`);
      console.log(`   - Expires At: ${profile.subscription_expires_at || 'NOT SET'}`);
    });

    // Check if subscriptions table exists
    console.log('\n📊 Checking subscriptions table...');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.log('ℹ️  Subscriptions table status:', subscriptionsError.message);
    } else {
      console.log(`✅ Found ${subscriptions.length} subscriptions`);
      subscriptions.forEach((sub, index) => {
        console.log(`\n${index + 1}. Subscription:`);
        console.log(`   - User ID: ${sub.user_id}`);
        console.log(`   - Status: ${sub.status}`);
        console.log(`   - Plan: ${sub.plan_name}`);
        console.log(`   - Stripe Sub ID: ${sub.stripe_subscription_id}`);
        console.log(`   - Current Period End: ${sub.current_period_end}`);
      });
    }

    // Check for any users who might have made purchases
    console.log('\n🔍 Checking for users with Stripe customers...');
    const usersWithStripe = profiles.filter(p => p.stripe_customer_id);
    console.log(`✅ Found ${usersWithStripe.length} users with Stripe customer IDs`);

    if (usersWithStripe.length > 0) {
      console.log('\n💡 These users have Stripe customer IDs and may have made purchases:');
      usersWithStripe.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - Customer: ${user.stripe_customer_id}`);
      });
    }

    // Provide migration instructions
    console.log('\n📋 MIGRATION INSTRUCTIONS:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of "supabase-migration.sql"');
    console.log('5. Run the migration');
    console.log('6. Re-run this script to verify the changes');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSubscriptionStatus();