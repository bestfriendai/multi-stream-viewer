import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, productId } = await request.json();

    if (!priceId || !productId) {
      return NextResponse.json({ error: 'Price ID and Product ID are required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Get or create user profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Create profile if it doesn't exist
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName || '',
          avatar_url: user.imageUrl || ''
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }
      profile = newProfile;
    }

    // Create or get Stripe customer
    let customerId = profile.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || '',
        metadata: {
          clerk_user_id: user.id,
        },
      });
      
      customerId = customer.id;
      
      // Update profile with stripe_customer_id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        clerk_user_id: user.id,
        product_id: productId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}