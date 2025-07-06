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
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist
        return NextResponse.json({ profile: null });
      }
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}