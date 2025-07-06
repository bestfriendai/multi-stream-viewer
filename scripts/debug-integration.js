#!/usr/bin/env node

/**
 * Comprehensive Debugging Script for Stripe + Supabase Integration
 * This script helps diagnose issues with the subscription integration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 STRIPE + SUPABASE INTEGRATION DEBUGGER');
console.log('=' .repeat(50));
console.log('');

// 1. Environment Variables Check
async function checkEnvironmentVariables() {
  console.log('1️⃣ ENVIRONMENT VARIABLES CHECK');
  console.log('-'.repeat(30));
  
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl,
    'SUPABASE_SERVICE_ROLE_KEY': supabaseServiceKey,
    'STRIPE_SECRET_KEY': stripeSecretKey,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': stripePublishableKey,
    'STRIPE_WEBHOOK_SECRET': webhookSecret,
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    'CLERK_SECRET_KEY': process.env.CLERK_SECRET_KEY
  };
  
  let allValid = true;
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value && value.length > 0) {
      console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${key}: MISSING OR EMPTY`);
      allValid = false;
    }
  }
  
  // Check for common issues
  if (stripeSecretKey && !stripeSecretKey.startsWith('sk_')) {
    console.log('⚠️  STRIPE_SECRET_KEY should start with "sk_"');
    allValid = false;
  }
  
  if (stripePublishableKey && !stripePublishableKey.startsWith('pk_')) {
    console.log('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should start with "pk_"');
    allValid = false;
  }
  
  if (webhookSecret && !webhookSecret.startsWith('whsec_')) {
    console.log('⚠️  STRIPE_WEBHOOK_SECRET should start with "whsec_"');
    allValid = false;
  }
  
  console.log('');
  return allValid;
}

// 2. Supabase Connection Test
async function testSupabaseConnection() {
  console.log('2️⃣ SUPABASE CONNECTION TEST');
  console.log('-'.repeat(30));
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count').single();
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test service role permissions
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('⚠️  Service role permissions issue:', testError.message);
    } else {
      console.log('✅ Service role permissions working');
    }
    
    console.log('');
    return true;
  } catch (err) {
    console.log('❌ Supabase connection error:', err.message);
    console.log('');
    return false;
  }
}

// 3. Database Schema Check
async function checkDatabaseSchema() {
  console.log('3️⃣ DATABASE SCHEMA CHECK');
  console.log('-'.repeat(30));
  
  const tables = ['profiles', 'products', 'subscriptions', 'saved_layouts', 'user_preferences'];
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' error:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' check failed:`, err.message);
      allTablesExist = false;
    }
  }
  
  console.log('');
  return allTablesExist;
}

// 4. Products Configuration Check
async function checkProductsConfiguration() {
  console.log('4️⃣ PRODUCTS CONFIGURATION CHECK');
  console.log('-'.repeat(30));
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('price_monthly');
    
    if (error) {
      console.log('❌ Error fetching products:', error.message);
      return false;
    }
    
    if (products.length === 0) {
      console.log('❌ No active products found in database');
      return false;
    }
    
    console.log(`Found ${products.length} active products:`);
    
    let allConfigured = true;
    
    products.forEach(product => {
      console.log(`\n📦 ${product.name}:`);
      console.log(`   Price: $${product.price_monthly}/mo, $${product.price_yearly}/yr`);
      
      if (!product.stripe_price_monthly_id || product.stripe_price_monthly_id.includes('REPLACE')) {
        console.log(`   ❌ Monthly Stripe Price ID missing or placeholder`);
        allConfigured = false;
      } else {
        console.log(`   ✅ Monthly Price ID: ${product.stripe_price_monthly_id}`);
      }
      
      if (!product.stripe_price_yearly_id || product.stripe_price_yearly_id.includes('REPLACE')) {
        console.log(`   ❌ Yearly Stripe Price ID missing or placeholder`);
        allConfigured = false;
      } else {
        console.log(`   ✅ Yearly Price ID: ${product.stripe_price_yearly_id}`);
      }
    });
    
    console.log('');
    return allConfigured;
  } catch (err) {
    console.log('❌ Products check error:', err.message);
    console.log('');
    return false;
  }
}

// 5. Stripe CLI Check
async function checkStripeCLI() {
  console.log('5️⃣ STRIPE CLI CHECK');
  console.log('-'.repeat(30));
  
  try {
    const { stdout } = await execAsync('stripe --version');
    console.log('✅ Stripe CLI installed:', stdout.trim());
    
    // Check if logged in
    try {
      const { stdout: whoami } = await execAsync('stripe config --list');
      if (whoami.includes('test_mode')) {
        console.log('✅ Stripe CLI authenticated');
      } else {
        console.log('⚠️  Stripe CLI authentication unclear');
      }
    } catch (err) {
      console.log('⚠️  Stripe CLI not authenticated. Run: stripe login');
    }
    
    console.log('');
    return true;
  } catch (err) {
    console.log('❌ Stripe CLI not installed or not in PATH');
    console.log('   Install: https://stripe.com/docs/stripe-cli');
    console.log('');
    return false;
  }
}

// 6. API Routes Test
async function testAPIRoutes() {
  console.log('6️⃣ API ROUTES TEST');
  console.log('-'.repeat(30));
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const routes = [
    '/api/stripe/webhook',
    '/api/stripe/create-checkout-session',
    '/api/stripe/create-portal-session'
  ];
  
  let allRoutesWork = true;
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      // We expect 401 (unauthorized) or 400 (bad request) for these protected routes
      if (response.status === 401 || response.status === 400) {
        console.log(`✅ ${route}: Accessible and secured (${response.status})`);
      } else if (response.status === 404) {
        console.log(`❌ ${route}: Not found (${response.status})`);
        allRoutesWork = false;
      } else {
        console.log(`⚠️  ${route}: Unexpected status (${response.status})`);
      }
    } catch (err) {
      console.log(`❌ ${route}: Error -`, err.message);
      allRoutesWork = false;
    }
  }
  
  console.log('');
  return allRoutesWork;
}

// 7. Webhook Configuration Check
async function checkWebhookConfiguration() {
  console.log('7️⃣ WEBHOOK CONFIGURATION CHECK');
  console.log('-'.repeat(30));
  
  if (!webhookSecret) {
    console.log('❌ STRIPE_WEBHOOK_SECRET not configured');
    console.log('');
    return false;
  }
  
  console.log('✅ Webhook secret configured');
  
  // Check if webhook endpoint is accessible
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook`;
  console.log(`Webhook URL: ${webhookUrl}`);
  
  try {
    const response = await fetch(webhookUrl, { method: 'POST' });
    if (response.status === 400) {
      console.log('✅ Webhook endpoint accessible (returns 400 without signature)');
    } else {
      console.log(`⚠️  Webhook endpoint returned: ${response.status}`);
    }
  } catch (err) {
    console.log('❌ Webhook endpoint not accessible:', err.message);
  }
  
  console.log('');
  return true;
}

// 8. Generate Debugging Commands
function generateDebuggingCommands() {
  console.log('8️⃣ DEBUGGING COMMANDS');
  console.log('-'.repeat(30));
  
  console.log('🔧 Useful commands for debugging:');
  console.log('');
  
  console.log('📡 Test webhook locally:');
  console.log('   stripe listen --forward-to localhost:3000/api/stripe/webhook');
  console.log('');
  
  console.log('🧪 Trigger test events:');
  console.log('   stripe trigger customer.subscription.created');
  console.log('   stripe trigger customer.subscription.updated');
  console.log('   stripe trigger checkout.session.completed');
  console.log('');
  
  console.log('🔍 Check Stripe products:');
  console.log('   stripe products list');
  console.log('   stripe prices list');
  console.log('');
  
  console.log('📊 Monitor webhook events:');
  console.log('   stripe events list --limit 10');
  console.log('');
  
  console.log('🗄️  Test Supabase connection:');
  console.log('   node scripts/test-supabase-connection.js');
  console.log('');
  
  console.log('🧪 Run integration tests:');
  console.log('   node scripts/test-stripe-integration.js');
  console.log('');
}

// Main debugging function
async function runDiagnostics() {
  const results = {
    environment: await checkEnvironmentVariables(),
    supabase: await testSupabaseConnection(),
    schema: await checkDatabaseSchema(),
    products: await checkProductsConfiguration(),
    stripeCLI: await checkStripeCLI(),
    apiRoutes: await testAPIRoutes(),
    webhook: await checkWebhookConfiguration()
  };
  
  generateDebuggingCommands();
  
  console.log('📋 DIAGNOSTIC SUMMARY');
  console.log('=' .repeat(30));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}`);
  });
  
  console.log('');
  console.log(`Overall: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 All checks passed! Your integration should be working.');
  } else {
    console.log('⚠️  Some issues found. Please address the failed checks above.');
  }
  
  console.log('');
  console.log('💡 Next steps:');
  if (!results.environment) {
    console.log('   1. Fix missing environment variables in .env.local');
  }
  if (!results.products) {
    console.log('   2. Update products with real Stripe price IDs');
    console.log('      Run: node scripts/test-supabase-connection.js');
  }
  if (!results.stripeCLI) {
    console.log('   3. Install and authenticate Stripe CLI');
  }
  if (!results.webhook) {
    console.log('   4. Configure webhook endpoint in Stripe Dashboard');
  }
  
  console.log('   5. Test the complete flow with: npm run dev');
  console.log('   6. Use Stripe CLI to test webhooks locally');
}

// Run diagnostics
runDiagnostics().catch(console.error);