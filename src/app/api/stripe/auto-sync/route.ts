import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionSyncService } from '@/lib/subscription-sync-service';
import { sentryApiMonitor } from '@/lib/sentry-api-monitor';
import * as Sentry from '@sentry/nextjs';

// Cache for auto-sync to prevent duplicate calls
const syncCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Auto-sync endpoint that can be called periodically or on app startup
export async function POST(request: NextRequest) {
  return await sentryApiMonitor.monitorApiCall(
    'stripe.auto-sync',
    'POST',
    '/api/stripe/auto-sync',
    async () => {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      // Add request context to Sentry
      Sentry.setTag('request.ip', ip);
      Sentry.setTag('request.user_agent', userAgent.substring(0, 100));
      
      const body = await request.json().catch(() => ({}));
      const forceSync = body.force === true;
      
      Sentry.addBreadcrumb({
        message: `Stripe auto-sync requested${forceSync ? ' (forced)' : ''}`,
        category: 'stripe.sync',
        level: 'info',
        data: { forceSync, ip }
      });

      // Check cache for auto-sync (not for forced sync)
      if (!forceSync) {
        const cacheKey = 'auto-sync';
        const cached = syncCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          Sentry.addBreadcrumb({
            message: 'Stripe auto-sync served from cache',
            category: 'stripe.sync',
            level: 'info',
            data: { cacheAge: Date.now() - cached.timestamp }
          });
          
          return NextResponse.json({
            ...cached.result,
            cached: true,
            cacheAge: Date.now() - cached.timestamp
          });
        }
      }

      const syncService = getSubscriptionSyncService();
      
      if (forceSync) {
        // Force a full sync with monitoring
        const result = await sentryApiMonitor.monitorStripeCall('full-sync', async () => {
          return await syncService.performFullSync();
        });
        
        const response = {
          success: result.success,
          message: result.message,
          synced: result.synced,
          errors: result.errors,
          type: 'manual_sync',
          timestamp: new Date().toISOString()
        };

        // Track sync results
        Sentry.setMeasurement('stripe.sync.items_synced', result.synced || 0, 'none');
        Sentry.setMeasurement('stripe.sync.errors', (result.errors || []).length, 'none');
        
        if (!result.success) {
          Sentry.captureMessage('Stripe manual sync failed', {
            level: 'error',
            extra: { result }
          });
        }

        return NextResponse.json(response);
      } else {
        // Auto-sync (only if needed) with monitoring
        const result = await sentryApiMonitor.monitorStripeCall('auto-sync', async () => {
          await syncService.autoSync();
          return syncService.getSyncStatus();
        });
        
        const response = {
          success: true,
          message: 'Auto-sync completed',
          lastSync: result.lastSync,
          inProgress: result.inProgress,
          type: 'auto_sync',
          timestamp: new Date().toISOString()
        };

        // Cache the result
        syncCache.set('auto-sync', {
          result: response,
          timestamp: Date.now()
        });

        // Clean old cache entries
        if (syncCache.size > 10) {
          const oldestTime = Date.now() - CACHE_DURATION * 2;
          for (const [key, value] of syncCache.entries()) {
            if (value.timestamp < oldestTime) {
              syncCache.delete(key);
            }
          }
        }

        return NextResponse.json(response);
      }
    },
    {
      timeout: 8000, // 8 second timeout
      retryCount: 1,
      expectedDuration: 1000,
      critical: true
    }
  );
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