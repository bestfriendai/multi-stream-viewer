#!/usr/bin/env node

/**
 * Test script for subscription flow
 * Run with: node scripts/test-subscription-flow.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test functions
async function testApiEndpoint(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`🧪 Testing: ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting subscription flow tests...\n');
  
  // Test 1: Environment variables check
  console.log('📋 Test 1: Checking environment variables...');
  try {
    const result = await testApiEndpoint('/api/debug-env');
    console.log(`   Status: ${result.status}`);
    if (result.data.hasVars) {
      console.log('   ✅ Environment variables:');
      Object.entries(result.data.hasVars).forEach(([key, value]) => {
        console.log(`      ${key}: ${value ? '✅' : '❌'}`);
      });
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n');
  
  // Test 2: Supabase connection
  console.log('📋 Test 2: Testing Supabase connection...');
  try {
    const result = await testApiEndpoint('/api/test-supabase');
    console.log(`   Status: ${result.status}`);
    console.log(`   Result: ${JSON.stringify(result.data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n');
  
  // Test 3: Health check
  console.log('📋 Test 3: Health check...');
  try {
    const result = await testApiEndpoint('/api/health');
    console.log(`   Status: ${result.status}`);
    console.log(`   Result: ${JSON.stringify(result.data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n');
  
  console.log('✅ Tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure Stripe CLI is running: stripe listen --forward-to localhost:3000/api/stripe/webhook');
  console.log('2. Test a subscription flow by going to /pricing and trying to subscribe');
  console.log('3. Check the webhook events in Stripe CLI output');
}

runTests().catch(console.error);