import { NextRequest, NextResponse } from 'next/server';
import { getStripeService } from '@/lib/stripe-service';
import { getStripeWrapper } from '@/lib/supabase-stripe-wrapper';

// Comprehensive test endpoint for new Stripe implementation v2
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Stripe implementation v2...');
    
    const { priceId, productId, testCustomer = true } = await request.json();

    if (!priceId || !productId) {
      return NextResponse.json({
        error: 'priceId and productId are required for testing'
      }, { status: 400 });
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: { passed: 0, failed: 0 },
    };

    // Test 1: Stripe Service Connection
    console.log('🔍 Testing Stripe service connection...');
    try {
      const stripeService = getStripeService();
      const connectionTest = await stripeService.testConnection();
      results.tests.stripeConnection = {
        name: 'Stripe API Connection',
        passed: connectionTest.success,
        error: connectionTest.error,
      };
      if (connectionTest.success) results.summary.passed++;
      else results.summary.failed++;
    } catch (error) {
      results.tests.stripeConnection = {
        name: 'Stripe API Connection',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      results.summary.failed++;
    }

    // Test 2: Customer Creation (if enabled)
    if (testCustomer) {
      console.log('👤 Testing customer creation...');
      try {
        const stripeService = getStripeService();
        const { customer, isNew } = await stripeService.ensureCustomer({
          clerkUserId: 'test_user_' + Date.now(),
          email: 'test@example.com',
          name: 'Test Customer',
        });

        results.tests.customerCreation = {
          name: 'Customer Creation',
          passed: true,
          data: {
            customerId: customer.id,
            isNew,
            email: customer.email,
          },
        };
        results.summary.passed++;
      } catch (error) {
        results.tests.customerCreation = {
          name: 'Customer Creation',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        results.summary.failed++;
      }
    }

    // Test 3: Checkout Session Creation
    console.log('🛒 Testing checkout session creation...');
    try {
      const stripeService = getStripeService();
      
      // Create a test customer first
      const { customer } = await stripeService.ensureCustomer({
        clerkUserId: 'test_checkout_' + Date.now(),
        email: 'checkout@example.com',
        name: 'Checkout Test',
      });

      const session = await stripeService.createCheckoutSession({
        priceId,
        customerId: customer.id,
        metadata: {
          test: 'true',
          timestamp: new Date().toISOString(),
        },
      });

      results.tests.checkoutSession = {
        name: 'Checkout Session Creation',
        passed: true,
        data: {
          sessionId: session.id,
          url: session.url,
          customerId: customer.id,
          mode: session.mode,
          status: session.status,
        },
      };
      results.summary.passed++;
    } catch (error) {
      results.tests.checkoutSession = {
        name: 'Checkout Session Creation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      results.summary.failed++;
    }

    // Test 4: Supabase Stripe Wrapper (optional)
    console.log('🔌 Testing Supabase Stripe wrapper...');
    try {
      const wrapper = getStripeWrapper();
      const healthCheck = await wrapper.healthCheck();
      
      results.tests.supabaseWrapper = {
        name: 'Supabase Stripe Wrapper',
        passed: healthCheck.success,
        data: {
          hasData: healthCheck.hasData,
          error: healthCheck.error,
        },
      };
      if (healthCheck.success) results.summary.passed++;
      else results.summary.failed++;
    } catch (error) {
      results.tests.supabaseWrapper = {
        name: 'Supabase Stripe Wrapper',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      results.summary.failed++;
    }

    // Calculate overall status
    const overallSuccess = results.summary.failed === 0;
    
    console.log(`${overallSuccess ? '✅' : '❌'} Test suite completed:`, results.summary);

    return NextResponse.json({
      success: overallSuccess,
      message: `${results.summary.passed} tests passed, ${results.summary.failed} tests failed`,
      ...results,
    });

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Test suite execution failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Health check and documentation
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Implementation v2 Test Suite',
    description: 'Comprehensive testing for modern Stripe integration',
    usage: {
      method: 'POST',
      body: {
        priceId: 'price_xxx (required)',
        productId: 'product_xxx (required)', 
        testCustomer: 'boolean (optional, default: true)',
      },
    },
    features: [
      'Stripe API connection testing',
      'Customer creation and management',
      'Checkout session creation with modern parameters',
      'Supabase Stripe wrapper integration',
      'Comprehensive error handling',
    ],
    timestamp: new Date().toISOString(),
  });
}