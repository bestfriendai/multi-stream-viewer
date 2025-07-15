'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview, event, trackStreamAdd, trackLayoutChange, trackSignup } from '@/components/GoogleAnalytics'

export function useGoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return {
    trackEvent: event,
    trackPageview: pageview,
    trackStreamAdd,
    trackLayoutChange, 
    trackSignup
  }
}

// Business-specific tracking hooks
export function useStreamTracking() {
  const { trackStreamAdd, trackLayoutChange } = useGoogleAnalytics()
  
  return {
    onStreamAdded: (platform: string) => {
      trackStreamAdd(platform)
    },
    onLayoutChanged: (layoutType: string) => {
      trackLayoutChange(layoutType)
    }
  }
}

export function useConversionTracking() {
  const { trackSignup, trackEvent } = useGoogleAnalytics()
  
  return {
    onSignup: () => {
      trackSignup()
    },
    onSubscribe: (plan: string) => {
      trackEvent({
        action: 'subscribe',
        category: 'conversion',
        label: plan
      })
    },
    onTrial: (plan: string) => {
      trackEvent({
        action: 'start_trial',
        category: 'conversion', 
        label: plan
      })
    }
  }
}