# 🧪 Stripe Test Setup Documentation

## Overview
This documentation describes the safe test environment created for testing Stripe checkout session creation without touching live data or requiring authentication.

## ⚠️ Safety First
- **TEST KEYS ONLY**: All test endpoints use hardcoded Stripe test keys
- **NO LIVE DATA**: No real payments can be processed
- **NO AUTHENTICATION**: No login required for testing
- **NO DATABASE WRITES**: Test environment is completely isolated

## 🔧 Test Components Created

### 1. Test API Endpoint
**File:** `/src/app/api/stripe/test-checkout-session/route.ts`

**Features:**
- Uses hardcoded Stripe test keys (safely separated from live keys)
- Creates test checkout sessions with predefined test price IDs
- No authentication required
- No database writes
- Comprehensive error handling
- Safety checks to prevent live key usage

**Usage:**
```javascript
// POST request
fetch('/api/stripe/test-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceType: 'pro_monthly' })
});

// GET request for API info
fetch('/api/stripe/test-checkout-session');
```

### 2. Test HTML Page
**File:** `/public/stripe-test.html`

**Features:**
- Clean, professional interface
- Four test buttons for different subscription plans
- Real-time test results display
- Clear test mode indicators
- Comprehensive testing instructions
- Safety warnings throughout

**Access:** Visit `http://localhost:3000/stripe-test.html` or `https://yourapp.com/stripe-test.html`

## 📋 Test Plans Available

### Pro Plan Tests
- **Pro Monthly**: $9.99/month subscription
- **Pro Yearly**: $99.99/year subscription (17% savings)

### Premium Plan Tests
- **Premium Monthly**: $19.99/month subscription
- **Premium Yearly**: $199.99/year subscription

## 🧪 Testing Instructions

### Step 1: Access Test Page
1. Open your browser
2. Navigate to: `http://localhost:3000/stripe-test.html`
3. You'll see the test interface with plan options

### Step 2: Run Tests
1. Click any test button (e.g., "Test Pro Monthly")
2. The system will create a test checkout session
3. You'll be redirected to Stripe's test checkout page
4. Use the test card details provided

### Step 3: Test Card Details
Use these test card details in Stripe checkout:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3-digit number (e.g., `123`)
- **ZIP**: Any 5-digit number (e.g., `12345`)

### Step 4: Complete Test
1. Fill in the test card details
2. Complete the checkout process
3. You'll be redirected to a success page
4. The test is complete!

## 🔍 What Gets Tested

### Checkout Session Creation
- API endpoint functionality
- Stripe SDK integration
- Test customer creation
- Session parameter configuration
- Error handling

### Different Subscription Plans
- Pro Monthly ($9.99/month)
- Pro Yearly ($99.99/year)
- Premium Monthly ($19.99/month)
- Premium Yearly ($199.99/year)

### Safety Features
- Test key validation
- Test mode indicators
- No live data exposure
- Isolated test environment

## 📊 Test Results Analysis

### Success Indicators
- ✅ Checkout session created successfully
- ✅ Valid session ID returned
- ✅ Test mode confirmed
- ✅ Redirect to Stripe checkout works
- ✅ Test card acceptance works

### Failure Indicators
- ❌ API endpoint errors
- ❌ Invalid test keys
- ❌ Network connectivity issues
- ❌ Stripe service unavailable

## 🛡️ Security Features

### Test Key Safety
```javascript
// Safety check in test endpoint
if (STRIPE_TEST_SECRET_KEY.startsWith('sk_live_')) {
  throw new Error('🚨 DANGER: Live key detected in test endpoint!');
}
```

### Test Mode Indicators
- Clear "TEST MODE ONLY" warnings
- Test key validation
- Test customer creation
- Test metadata tagging

## 🐛 Troubleshooting

### Common Issues

**1. API Endpoint Not Found**
- Ensure the test API file exists: `/src/app/api/stripe/test-checkout-session/route.ts`
- Check if the application is running: `npm run dev`

**2. Test Keys Not Working**
- Verify test keys are correct in the endpoint file
- Check Stripe dashboard for test key validity
- Ensure test mode is enabled

**3. Checkout Session Creation Fails**
- Check browser console for error messages
- Verify network connectivity
- Check Stripe service status

**4. Redirect Issues**
- Verify `NEXT_PUBLIC_APP_URL` environment variable
- Check success/cancel URL configuration
- Ensure proper URL formatting

### Debug Steps
1. Open browser developer tools
2. Check network tab for API calls
3. Look for error messages in console
4. Verify test endpoint response format

## 📁 File Structure

```
/src/app/api/stripe/test-checkout-session/
├── route.ts                 # Test API endpoint

/public/
├── stripe-test.html         # Test HTML page

/
├── STRIPE_TEST_SETUP.md     # This documentation
```

## 🚀 Next Steps

After successful testing:
1. Verify all test scenarios work correctly
2. Check error handling for edge cases
3. Test different browsers/devices
4. Validate test card processing
5. Review test results and logs

## 📝 Test Log Template

```
Test Date: [DATE]
Test Environment: [LOCAL/STAGING/PRODUCTION]
Browser: [BROWSER NAME/VERSION]

Test Results:
- Pro Monthly: [PASS/FAIL]
- Pro Yearly: [PASS/FAIL]
- Premium Monthly: [PASS/FAIL]
- Premium Yearly: [PASS/FAIL]
- API Info: [PASS/FAIL]

Issues Found:
- [ISSUE 1]
- [ISSUE 2]

Notes:
- [ADDITIONAL NOTES]
```

## ⚡ Quick Start

1. **Start the application**: `npm run dev`
2. **Open test page**: `http://localhost:3000/stripe-test.html`
3. **Click any test button**: Choose a subscription plan to test
4. **Use test card**: `4242 4242 4242 4242`
5. **Complete checkout**: Follow the Stripe test checkout flow

## 🎯 Test Objectives

- [x] Verify checkout session creation logic
- [x] Test different subscription plans
- [x] Validate test card processing
- [x] Check error handling
- [x] Ensure test mode safety
- [x] Confirm redirect functionality

**Status: Ready for Testing** ✅