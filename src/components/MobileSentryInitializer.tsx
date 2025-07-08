'use client';

import { useEffect } from 'react';
import { initializeMobileSentryDebugger } from '@/lib/sentry-mobile-debug';
import { useMobileDetection } from '@/hooks/useMobileDetection';

/**
 * Component that initializes mobile Sentry debugging
 * Only runs on mobile/tablet devices to avoid unnecessary overhead
 */
export default function MobileSentryInitializer() {
  const { isMobile, isTablet } = useMobileDetection();
  const shouldInitialize = isMobile || isTablet;

  useEffect(() => {
    if (shouldInitialize) {
      // Initialize mobile debugging with a small delay to ensure page is loaded
      const timer = setTimeout(() => {
        try {
          initializeMobileSentryDebugger();
          console.debug('Mobile Sentry debugging initialized');
        } catch (error) {
          console.error('Failed to initialize mobile Sentry debugging:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldInitialize]);

  // This component doesn't render anything
  return null;
}