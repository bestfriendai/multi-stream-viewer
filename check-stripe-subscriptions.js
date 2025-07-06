const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function checkStripeSubscriptions() {
  console.log('🔍 Checking Stripe subscriptions...');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment');
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Check all customers
    console.log('\n📊 Checking Stripe customers...');
    const customers = await stripe.customers.list({ limit: 10 });
    
    console.log(`✅ Found ${customers.data.length} Stripe customers`);
    
    for (const customer of customers.data) {
      console.log(`\n👤 Customer: ${customer.id}`);
      console.log(`   - Email: ${customer.email}`);
      console.log(`   - Name: ${customer.name || 'Not set'}`);
      console.log(`   - Created: ${new Date(customer.created * 1000).toISOString()}`);
      
      // Check subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10
      });
      
      console.log(`   - Subscriptions: ${subscriptions.data.length}`);
      
      if (subscriptions.data.length > 0) {
        subscriptions.data.forEach((sub, index) => {
          console.log(`\n   📋 Subscription ${index + 1}:`);
          console.log(`      - ID: ${sub.id}`);
          console.log(`      - Status: ${sub.status}`);
          console.log(`      - Current Period Start: ${sub.current_period_start ? new Date(sub.current_period_start * 1000).toISOString() : 'N/A'}`);
          console.log(`      - Current Period End: ${sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : 'N/A'}`);
          
          if (sub.items.data.length > 0) {
            const item = sub.items.data[0];
            console.log(`      - Price ID: ${item.price.id}`);
            console.log(`      - Product: ${item.price.product}`);
            console.log(`      - Amount: $${(item.price.unit_amount / 100).toFixed(2)}`);
            console.log(`      - Interval: ${item.price.recurring?.interval}`);
          }
        });
      }
    }

    // Check recent payments
    console.log('\n💳 Checking recent payment intents...');
    const paymentIntents = await stripe.paymentIntents.list({ 
      limit: 10,
      expand: ['data.customer']
    });
    
    console.log(`✅ Found ${paymentIntents.data.length} recent payment intents`);
    
    paymentIntents.data.forEach((payment, index) => {
      console.log(`\n${index + 1}. Payment Intent: ${payment.id}`);
      console.log(`   - Status: ${payment.status}`);
      console.log(`   - Amount: $${(payment.amount / 100).toFixed(2)}`);
      console.log(`   - Customer: ${payment.customer}`);
      console.log(`   - Created: ${new Date(payment.created * 1000).toISOString()}`);
    });

    // Check recent checkout sessions
    console.log('\n🛒 Checking recent checkout sessions...');
    const checkoutSessions = await stripe.checkout.sessions.list({ 
      limit: 10,
      expand: ['data.customer', 'data.subscription']
    });
    
    console.log(`✅ Found ${checkoutSessions.data.length} recent checkout sessions`);
    
    checkoutSessions.data.forEach((session, index) => {
      console.log(`\n${index + 1}. Checkout Session: ${session.id}`);
      console.log(`   - Status: ${session.status}`);
      console.log(`   - Payment Status: ${session.payment_status}`);
      console.log(`   - Customer: ${session.customer}`);
      console.log(`   - Subscription: ${session.subscription}`);
      console.log(`   - Amount Total: $${session.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A'}`);
      console.log(`   - Created: ${new Date(session.created * 1000).toISOString()}`);
    });

  } catch (error) {
    console.error('❌ Error checking Stripe:', error.message);
  }
}

checkStripeSubscriptions();