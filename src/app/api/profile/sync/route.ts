import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Check if profile exists
    let { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let profile;

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName || '',
          avatar_url: user.imageUrl || '',
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }
      profile = updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName || '',
          avatar_url: user.imageUrl || '',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }
      profile = newProfile;
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error syncing profile:', error);
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    );
  }
}