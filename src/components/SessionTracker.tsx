'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function SessionTracker() {
  const { trackSessionDuration, trackUserRetention } = useAnalytics()
  const sessionStartTime = useRef<number>(Date.now())
  const visitCountRef = useRef<number>(0)

  useEffect(() => {
    // Track user retention (visit count)
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1
    localStorage.setItem('visitCount', visitCount.toString())
    visitCountRef.current = visitCount
    trackUserRetention(visitCount)

    // Track session duration on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartTime.current
      trackSessionDuration(sessionDuration)
    }

    // Track session duration on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const sessionDuration = Date.now() - sessionStartTime.current
        trackSessionDuration(sessionDuration)
      } else {
        sessionStartTime.current = Date.now() // Reset timer when returning
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [trackSessionDuration, trackUserRetention])

  return null
}