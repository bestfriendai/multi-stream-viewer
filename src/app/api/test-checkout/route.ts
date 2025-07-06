import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    console.log('🧪 Testing checkout prerequisites...');
    
    const user = await currentUser();
    console.log('👤 User check:', { 
      userId: user?.id, 
      email: user?.emailAddresses[0]?.emailAddress,
      isSignedIn: !!user 
    });
    
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_APP_URL'
    ];
    
    const envCheck = Object.fromEntries(
      requiredEnvVars.map(key => [key, !!process.env[key]])
    );
    
    console.log('🔧 Environment check:', envCheck);
    
    return NextResponse.json({
      success: true,
      user: user ? {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: user.fullName
      } : null,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test checkout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}