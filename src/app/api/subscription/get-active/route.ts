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

    // Now get the active subscription using the database function
    const { data: subscriptions, error: subscriptionError } = await supabase
      .rpc('get_active_subscription', { user_uuid: profile.id });

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // The RPC function returns an array, so get the first result
    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}