/**
 * Startup sync utility to automatically sync Stripe subscriptions with Supabase
 * This should be called when the app starts to ensure data consistency
 */

let syncInProgress = false;
let lastSyncTime: Date | null = null;
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Performs automatic sync on app startup
 * Only syncs if enough time has passed since last sync
 */
export async function performStartupSync(): Promise<void> {
  // Prevent multiple simultaneous syncs
  if (syncInProgress) {
    console.log('Sync already in progress, skipping startup sync');
    return;
  }

  // Check if we need to sync (only if enough time has passed)
  if (lastSyncTime && (Date.now() - lastSyncTime.getTime()) < SYNC_INTERVAL) {
    console.log('Recent sync detected, skipping startup sync');
    return;
  }

  try {
    syncInProgress = true;
    console.log('Starting automatic subscription sync...');

    const response = await fetch('/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ force: false })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Startup sync completed:', result);
      lastSyncTime = new Date();
    } else {
      console.error('Startup sync failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('Error during startup sync:', error);
  } finally {
    syncInProgress = false;
  }
}

/**
 * Forces a sync regardless of timing
 */
export async function forceStartupSync(): Promise<void> {
  try {
    syncInProgress = true;
    console.log('Forcing subscription sync...');

    const response = await fetch('/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ force: true })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Forced sync completed:', result);
      lastSyncTime = new Date();
      return result;
    } else {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('Error during forced sync:', error);
    throw error;
  } finally {
    syncInProgress = false;
  }
}

/**
 * Gets the current sync status
 */
export function getSyncStatus() {
  return {
    inProgress: syncInProgress,
    lastSync: lastSyncTime,
    nextSyncDue: lastSyncTime ? new Date(lastSyncTime.getTime() + SYNC_INTERVAL) : null
  };
}

/**
 * Initialize automatic sync on app startup
 * This should be called once when the app starts
 */
export function initializeAutoSync() {
  // Only run on the client side
  if (typeof window === 'undefined') {
    return;
  }

  // Perform initial sync after a short delay
  setTimeout(() => {
    performStartupSync();
  }, 2000); // 2 second delay to let the app initialize

  // Set up periodic sync
  setInterval(() => {
    performStartupSync();
  }, SYNC_INTERVAL);

  console.log('Auto-sync initialized');
}