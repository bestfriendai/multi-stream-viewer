import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // First get the user profile to get the UUID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single();

    if (profileError) {
      // If profile doesn't exist, return no subscription
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({ subscription: null });
      }
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ subscription: null });
    }

    // Now get the active subscription using the profile UUID
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        status,
        product_name,
        current_period_end,
        cancel_at_period_end
      `)
      .eq('user_id', profile.id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ subscription: subscriptions?.[0] || null });
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}