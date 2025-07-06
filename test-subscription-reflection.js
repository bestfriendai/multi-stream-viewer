const fetch = require('node-fetch');

// Test that subscription changes are reflected instantly
async function testSubscriptionReflection() {
  console.log('🔄 Testing instant subscription reflection from Stripe to Supabase...');
  
  try {
    // 1. Force a sync to ensure latest data
    console.log('\n1. Forcing sync to get latest subscription data...');
    const forceSyncResponse = await fetch('https://streamyyy.com/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ force: true })
    });
    
    const forceSyncResult = await forceSyncResponse.json();
    console.log('Force sync result:', forceSyncResult);
    
    // 2. Check subscription sync endpoint
    console.log('\n2. Running subscription sync...');
    const syncResponse = await fetch('https://streamyyy.com/api/stripe/sync-subscriptions', {
      method: 'POST'
    });
    
    const syncResult = await syncResponse.json();
    console.log('Subscription sync result:', syncResult);
    
    // 3. Verify sync status
    console.log('\n3. Checking final sync status...');
    const statusResponse = await fetch('https://streamyyy.com/api/stripe/auto-sync', {
      method: 'GET'
    });
    
    const statusResult = await statusResponse.json();
    console.log('Final sync status:', statusResult);
    
    // 4. Summary
    console.log('\n📊 Sync Summary:');
    console.log('- Auto-sync is working:', forceSyncResult.success ? '✅' : '❌');
    console.log('- Subscription sync is working:', syncResult.success ? '✅' : '❌');
    console.log('- Last sync time:', statusResult.status?.lastSync || 'Unknown');
    console.log('- Sync in progress:', statusResult.status?.inProgress ? 'Yes' : 'No');
    
    if (forceSyncResult.success && syncResult.success) {
      console.log('\n🎉 Subscription reflection is working! Changes in Stripe will be reflected instantly in Supabase.');
    } else {
      console.log('\n⚠️  There may be issues with subscription reflection. Check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Error testing subscription reflection:', error);
  }
}

// Run the test
testSubscriptionReflection();