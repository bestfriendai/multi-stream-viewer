import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement preferences updating
    // For now return empty preferences to fix build
    return NextResponse.json({ preferences: {} });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}