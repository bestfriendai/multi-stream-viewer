// Test script to verify Twitch API credentials
require('dotenv').config({ path: '.env.local' });

async function testTwitchAPI() {
  console.log('Testing Twitch API credentials...\n');
  
  // Check if credentials are loaded
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    console.error('❌ Missing Twitch credentials in .env.local');
    return;
  }
  
  console.log('✓ Credentials loaded');
  console.log(`  Client ID: ${process.env.TWITCH_CLIENT_ID}`);
  console.log(`  Client Secret: ${process.env.TWITCH_CLIENT_SECRET.substring(0, 5)}...`);
  
  try {
    // Get access token
    console.log('\n📡 Requesting access token...');
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token request failed: ${error}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✓ Access token obtained');
    console.log(`  Token type: ${tokenData.token_type}`);
    console.log(`  Expires in: ${tokenData.expires_in} seconds`);
    
    // Test API call - Get top streams
    console.log('\n🎮 Testing API call (Get Top Streams)...');
    const streamsResponse = await fetch('https://api.twitch.tv/helix/streams?first=5', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID
      }
    });
    
    if (!streamsResponse.ok) {
      const error = await streamsResponse.text();
      throw new Error(`API call failed: ${error}`);
    }
    
    const streamsData = await streamsResponse.json();
    console.log('✓ API call successful');
    console.log(`\n📊 Top 5 Live Streams:`);
    
    streamsData.data.forEach((stream, index) => {
      console.log(`\n${index + 1}. ${stream.user_name}`);
      console.log(`   Game: ${stream.game_name}`);
      console.log(`   Viewers: ${stream.viewer_count.toLocaleString()}`);
      console.log(`   Title: ${stream.title.substring(0, 50)}...`);
    });
    
    console.log('\n✅ Twitch API integration is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your Client ID and Secret are correct');
    console.error('2. Ensure your Twitch app is not suspended');
    console.error('3. Try regenerating your Client Secret on Twitch Developer Console');
  }
}

testTwitchAPI();