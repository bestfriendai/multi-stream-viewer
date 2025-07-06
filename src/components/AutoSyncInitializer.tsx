'use client';

import { useEffect } from 'react';
import { initializeAutoSync } from '@/lib/startup-sync';

/**
 * Component that initializes automatic subscription sync
 * This runs on the client side when the app starts
 */
export default function AutoSyncInitializer() {
  useEffect(() => {
    // Initialize auto-sync when the component mounts
    initializeAutoSync();
  }, []);

  // This component doesn't render anything
  return null;
}