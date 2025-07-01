'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsPageTracker() {
  const pathname = usePathname()
  const { trackPageView, trackLoadTime } = useAnalytics()

  useEffect(() => {
    const startTime = performance.now()
    
    // Track page view
    trackPageView(pathname)
    
    // Track page load time
    const handleLoad = () => {
      const loadTime = performance.now() - startTime
      trackLoadTime(pathname, loadTime)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [pathname, trackPageView, trackLoadTime])

  return null
}