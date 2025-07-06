import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeService } from '@/lib/stripe-service';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Use the new StripeService
    const stripeService = getStripeService();
    const portalSession = await stripeService.createPortalSession(profile.stripe_customer_id);

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}