import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement layout fetching
    // For now return empty array to fix build
    return NextResponse.json({ layouts: [] });
  } catch (error) {
    console.error('Error getting layouts:', error);
    return NextResponse.json(
      { error: 'Failed to get layouts' },
      { status: 500 }
    );
  }
}