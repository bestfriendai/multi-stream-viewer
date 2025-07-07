import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  // Generate some test errors for Sentry debugging
  const errorType = request.nextUrl.searchParams.get('type') || 'generic';
  
  try {
    switch (errorType) {
      case 'validation':
        // Simulate validation error
        throw new Error('Stream validation failed: Invalid channel name format');
        
      case 'api':
        // Simulate API error
        const fakeResponse = { status: 429, message: 'Rate limit exceeded' };
        throw new Error(`Twitch API error: ${fakeResponse.status} - ${fakeResponse.message}`);
        
      case 'database':
        // Simulate database error
        throw new Error('Database connection timeout: Unable to save stream layout');
        
      case 'auth':
        // Simulate authentication error
        throw new Error('User authentication failed: Invalid session token');
        
      case 'memory':
        // Simulate memory issue
        const largeArray = new Array(1000000).fill('memory-test');
        throw new Error(`Memory allocation failed: ${largeArray.length} items`);
        
      case 'async':
        // Simulate async error
        await new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Async operation timeout')), 100);
        });
        break;
        
      case 'network':
        // Simulate network error
        throw new Error('Network error: Failed to fetch stream data from external API');
        
      default:
        // Generic error
        throw new Error('Test error generated for Sentry debugging purposes');
    }
    
    return NextResponse.json({ success: true, message: 'No error generated' });
    
  } catch (error) {
    // Capture the error with additional context
    Sentry.captureException(error, {
      tags: {
        'error.type': errorType,
        'error.source': 'debug-endpoint',
        'api.route': '/api/debug-error',
      },
      extra: {
        errorType,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
        requestUrl: request.url,
      },
      level: 'error',
    });
    
    return NextResponse.json(
      { 
        error: 'Debug error generated',
        type: errorType,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate processing error based on body content
    if (body.simulateError) {
      throw new Error(`Simulated POST error: ${body.simulateError}`);
    }
    
    // Simulate successful processing
    return NextResponse.json({ 
      success: true, 
      processed: body,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        'error.type': 'post_processing',
        'error.source': 'debug-endpoint',
        'api.route': '/api/debug-error',
        'http.method': 'POST',
      },
      extra: {
        requestBody: await request.json().catch(() => null),
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      },
    });
    
    return NextResponse.json(
      { 
        error: 'POST processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}