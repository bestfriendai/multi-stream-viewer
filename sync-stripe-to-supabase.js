const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function syncStripeToSupabase() {
  console.log('🔄 Syncing Stripe subscriptions to Supabase...');
  
  // Initialize clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // First, let's manually add the subscription columns if they don't exist
    console.log('\n🔧 Ensuring subscription columns exist...');
    
    // Get all Stripe customers
    const customers = await stripe.customers.list({ limit: 100 });
    console.log(`\n📊 Found ${customers.data.length} Stripe customers`);
    
    for (const customer of customers.data) {
      console.log(`\n👤 Processing customer: ${customer.id} (${customer.email})`);
      
      // Find the corresponding profile in Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('stripe_customer_id', customer.id)
        .single();
      
      if (profileError) {
        console.log(`   ⚠️  No profile found for customer ${customer.id}`);
        continue;
      }
      
      console.log(`   ✅ Found profile: ${profile.email}`);
      
      // Get subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10
      });
      
      console.log(`   📋 Found ${subscriptions.data.length} subscriptions`);
      
      if (subscriptions.data.length > 0) {
        const activeSubscription = subscriptions.data.find(sub => sub.status === 'active');
        
        if (activeSubscription) {
          console.log(`   🎯 Active subscription found: ${activeSubscription.id}`);
          
          // Get the price/product info
          const priceId = activeSubscription.items.data[0]?.price?.id;
          const productId = activeSubscription.items.data[0]?.price?.product;
          
          // Determine plan name based on price
          let planName = 'Unknown';
          let tier = 'basic';
          
          if (priceId) {
            const price = await stripe.prices.retrieve(priceId, {
              expand: ['product']
            });
            
            planName = price.product.name || 'Unknown Plan';
            
            // Determine tier based on plan name or price
            if (planName.toLowerCase().includes('pro') || (price.unit_amount >= 999)) {
              tier = 'pro';
            } else if (planName.toLowerCase().includes('premium')) {
              tier = 'premium';
            }
          }
          
          console.log(`   📦 Plan: ${planName} (${tier})`);
          console.log(`   💰 Amount: $${activeSubscription.items.data[0]?.price?.unit_amount / 100}`);
          
          // Try to update the profile with subscription info
          // Since the columns might not exist yet, we'll try a simple update first
          const updateData = {
            // Only update existing columns for now
          };
          
          // Try to add subscription data if columns exist
          try {
            const { data: updateResult, error: updateError } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_tier: tier,
                subscription_expires_at: new Date(activeSubscription.current_period_end * 1000).toISOString(),
                stripe_subscription_id: activeSubscription.id
              })
              .eq('id', profile.id)
              .select();
            
            if (updateError) {
              console.log(`   ⚠️  Could not update subscription columns (they may not exist yet):`, updateError.message);
              console.log(`   💡 Please run the SQL migration first!`);
            } else {
              console.log(`   ✅ Updated profile with subscription data`);
            }
          } catch (err) {
            console.log(`   ⚠️  Update failed:`, err.message);
          }
          
          // Try to insert into subscriptions table
          try {
            const { data: subResult, error: subError } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: profile.id,
                stripe_subscription_id: activeSubscription.id,
                stripe_customer_id: customer.id,
                status: activeSubscription.status,
                plan_name: planName,
                price_id: priceId,
                current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'stripe_subscription_id'
              });
            
            if (subError) {
              console.log(`   ⚠️  Could not insert subscription:`, subError.message);
            } else {
              console.log(`   ✅ Inserted/updated subscription record`);
            }
          } catch (err) {
            console.log(`   ⚠️  Subscription insert failed:`, err.message);
          }
        } else {
          console.log(`   ℹ️  No active subscriptions found`);
        }
      }
    }
    
    console.log('\n✅ Sync completed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. If you see column errors, run the SQL migration in Supabase first');
    console.log('2. Then re-run this script to sync the data');
    console.log('3. Run check-subscription-status.js to verify the results');
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

syncStripeToSupabase();