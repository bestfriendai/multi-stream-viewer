#!/usr/bin/env node

/**
 * Script to check Vercel environment setup
 * Run this to verify your environment variables are properly configured
 */

const PRODUCTION_URL = 'https://streamyyy.com';

async function checkEnvironment() {
  console.log('🔍 Checking Vercel Environment Setup...\n');

  try {
    // 1. Check health endpoint
    console.log('1️⃣ Checking health endpoint...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    console.log('   Status:', healthData.status);
    console.log('   Environment:', healthData.environment.nodeEnv);
    console.log('   Required environment variables:');
    Object.entries(healthData.environment.hasRequiredEnvVars).forEach(([key, value]) => {
      console.log(`     ${key}: ${value ? '✅' : '❌'}`);
    });

    // 2. Check verification endpoint
    console.log('\n2️⃣ Checking Twitch verification endpoint...');
    const verifyResponse = await fetch(`${PRODUCTION_URL}/api/twitch/verify`);
    const verifyData = await verifyResponse.json();
    
    console.log('   Client ID present:', verifyData.environment.hasClientId ? '✅' : '❌');
    console.log('   Client Secret present:', verifyData.environment.hasClientSecret ? '✅' : '❌');
    console.log('   Recommendation:', verifyData.recommendation);

    // 3. Test the streams endpoint
    console.log('\n3️⃣ Testing streams endpoint...');
    const streamsResponse = await fetch(`${PRODUCTION_URL}/api/twitch/streams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels: ['ninja'] })
    });
    
    console.log('   Response status:', streamsResponse.status);
    
    if (streamsResponse.ok) {
      const streamsData = await streamsResponse.json();
      console.log('   Results returned:', streamsData.results ? '✅' : '❌');
      if (streamsData.error) {
        console.log('   Error message:', streamsData.error);
      }
    } else {
      console.log('   ❌ Endpoint returned error:', streamsResponse.statusText);
    }

    // Summary
    console.log('\n📊 Summary:');
    if (!verifyData.environment.hasClientId || !verifyData.environment.hasClientSecret) {
      console.log('\n❌ Environment variables are NOT configured properly!');
      console.log('\n🔧 To fix this:');
      console.log('1. Go to https://vercel.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to Settings → Environment Variables');
      console.log('4. Add these variables:');
      console.log('   - TWITCH_CLIENT_ID = 840q0uzqa2ny9oob3yp8ako6dqs31g');
      console.log('   - TWITCH_CLIENT_SECRET = 6359is1cljkasakhaobken9r0shohc');
      console.log('   - TWITCH_REDIRECT_URI = https://streamyyy.com/auth/twitch/callback');
      console.log('   - NEXT_PUBLIC_APP_URL = https://streamyyy.com');
      console.log('5. Redeploy your project\n');
    } else {
      console.log('\n✅ Environment variables appear to be configured!');
      console.log('   If you\'re still having issues, try:');
      console.log('   1. Redeploying from Vercel dashboard');
      console.log('   2. Checking the Function logs for errors');
      console.log('   3. Verifying the credentials are correct\n');
    }

  } catch (error) {
    console.error('\n❌ Error checking environment:', error.message);
    console.error('\nThis could mean:');
    console.error('1. The site is not accessible');
    console.error('2. The API endpoints are not deployed');
    console.error('3. There\'s a network issue\n');
  }
}

// Run the check
checkEnvironment();