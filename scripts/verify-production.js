// Script to verify Twitch API is working in production
const PRODUCTION_URL = 'https://streamyyy.com';

async function verifyProduction() {
  console.log('🔍 Verifying Twitch API on production...\n');
  
  try {
    // Test 1: Check if API endpoint is accessible
    console.log('📡 Testing API endpoint...');
    const apiResponse = await fetch(`${PRODUCTION_URL}/api/twitch/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channels: ['ninja', 'shroud', 'pokimane']
      })
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const apiData = await apiResponse.json();
    console.log('✅ API endpoint is working');
    console.log(`   Found ${apiData.results.filter(r => r.isLive).length} live streams\n`);
    
    // Display results
    console.log('📊 Stream Status:');
    apiData.results.forEach(result => {
      if (result.isLive) {
        console.log(`   ✓ ${result.channel} is LIVE`);
        console.log(`     - Viewers: ${result.data.viewer_count.toLocaleString()}`);
        console.log(`     - Playing: ${result.data.game_name}`);
      } else {
        console.log(`   ✗ ${result.channel} is offline`);
      }
    });
    
    // Test 2: Check test endpoint
    console.log('\n🧪 Running comprehensive tests...');
    const testResponse = await fetch(`${PRODUCTION_URL}/api/test-twitch`);
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log(`✅ Test endpoint status: ${testData.status}`);
      
      if (testData.tests) {
        console.log('\n📋 Test Results:');
        console.log(`   Environment: ${testData.tests.environment.clientId && testData.tests.environment.clientSecret ? '✓' : '✗'}`);
        console.log(`   Token Generation: ${testData.tests.token?.success ? '✓' : '✗'}`);
        console.log(`   API Calls: ${testData.tests.apiCalls.topStreams?.success ? '✓' : '✗'}`);
        
        if (testData.tests.errors.length > 0) {
          console.log('\n❌ Errors found:');
          testData.tests.errors.forEach(error => console.log(`   - ${error}`));
        }
      }
    }
    
    console.log('\n✅ Production verification complete!');
    console.log(`\n🌐 Visit ${PRODUCTION_URL}/test-twitch for interactive testing`);
    
  } catch (error) {
    console.error('\n❌ Production verification failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure environment variables are set in Vercel dashboard');
    console.error('2. Check that the deployment has completed');
    console.error('3. Verify domain is accessible');
  }
}

verifyProduction();