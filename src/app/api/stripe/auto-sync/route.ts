import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionSyncService } from '@/lib/subscription-sync-service';

// Auto-sync endpoint that can be called periodically or on app startup
export async function POST(request: NextRequest) {
  try {
    const syncService = getSubscriptionSyncService();
    
    // Check if manual sync is requested
    const body = await request.json().catch(() => ({}));
    const forceSync = body.force === true;
    
    if (forceSync) {
      // Force a full sync
      const result = await syncService.performFullSync();
      return NextResponse.json({
        success: result.success,
        message: result.message,
        synced: result.synced,
        errors: result.errors,
        type: 'manual_sync',
        timestamp: new Date().toISOString()
      });
    } else {
      // Auto-sync (only if needed)
      await syncService.autoSync();
      const status = syncService.getSyncStatus();
      
      return NextResponse.json({
        success: true,
        message: 'Auto-sync completed',
        lastSync: status.lastSync,
        inProgress: status.inProgress,
        type: 'auto_sync',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Error in auto-sync endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Auto-sync failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Get sync status
export async function GET() {
  try {
    const syncService = getSubscriptionSyncService();
    const status = syncService.getSyncStatus();
    
    return NextResponse.json({
      success: true,
      status,
      message: 'Sync status retrieved',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}