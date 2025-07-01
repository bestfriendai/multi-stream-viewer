'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function MobileAnalyticsTracker() {
  const { trackMobileOrientation, trackMobileGesture, trackPWAInstall } = useAnalytics()

  useEffect(() => {
    // Track orientation changes
    const handleOrientationChange = () => {
      const orientation = window.screen.orientation?.type || 
        (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
      trackMobileOrientation(orientation)
    }

    // Track PWA install
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      // Track that install prompt was shown
      trackPWAInstall()
    }

    // Track touch gestures (simplified)
    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY - touchEndY
      const deltaX = touchStartX - touchEndX

      // Detect swipe gestures
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          trackMobileGesture('swipe_up', 'screen')
        } else {
          trackMobileGesture('swipe_down', 'screen')
        }
      }

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          trackMobileGesture('swipe_left', 'screen')
        } else {
          trackMobileGesture('swipe_right', 'screen')
        }
      }
    }

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', handleOrientationChange)
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      
      if ('ontouchstart' in window) {
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchend', handleTouchEnd, { passive: true })
      }

      // Initial orientation
      handleOrientationChange()
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        
        if ('ontouchstart' in window) {
          document.removeEventListener('touchstart', handleTouchStart)
          document.removeEventListener('touchend', handleTouchEnd)
        }
      }
    }
  }, [trackMobileOrientation, trackMobileGesture, trackPWAInstall])

  return null
}