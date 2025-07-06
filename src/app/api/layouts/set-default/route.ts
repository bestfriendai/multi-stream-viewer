import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement set default layout
    // For now return success to fix build
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting default layout:', error);
    return NextResponse.json(
      { error: 'Failed to set default layout' },
      { status: 500 }
    );
  }
}