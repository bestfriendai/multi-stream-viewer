const fetch = require('node-fetch');

// Test the automatic sync functionality
async function testAutoSync() {
  console.log('🧪 Testing automatic subscription sync on streamyyy.com...');
  
  try {
    // Test the auto-sync endpoint
    console.log('\n1. Testing auto-sync endpoint...');
    const autoSyncResponse = await fetch('https://streamyyy.com/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ force: false })
    });
    
    const autoSyncResult = await autoSyncResponse.json();
    console.log('Auto-sync result:', autoSyncResult);
    
    // Test forced sync
    console.log('\n2. Testing forced sync...');
    const forcedSyncResponse = await fetch('https://streamyyy.com/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ force: true })
    });
    
    const forcedSyncResult = await forcedSyncResponse.json();
    console.log('Forced sync result:', forcedSyncResult);
    
    // Test sync status
    console.log('\n3. Testing sync status...');
    const statusResponse = await fetch('https://streamyyy.com/api/stripe/auto-sync', {
      method: 'GET'
    });
    
    const statusResult = await statusResponse.json();
    console.log('Sync status:', statusResult);
    
    // Test subscription sync endpoint
    console.log('\n4. Testing subscription sync endpoint...');
    const syncResponse = await fetch('https://streamyyy.com/api/stripe/sync-subscriptions', {
      method: 'POST'
    });
    
    const syncResult = await syncResponse.json();
    console.log('Subscription sync result:', syncResult);
    
    // Get sync statistics
    console.log('\n5. Getting sync statistics...');
    const statsResponse = await fetch('https://streamyyy.com/api/stripe/sync-subscriptions', {
      method: 'GET'
    });
    
    const statsResult = await statsResponse.json();
    console.log('Sync statistics:', statsResult);
    
    console.log('\n✅ Auto-sync test completed!');
    
  } catch (error) {
    console.error('❌ Error testing auto-sync:', error);
  }
}

// Run the test
testAutoSync();