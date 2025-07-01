'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { event } from '@/components/GoogleAnalytics'

export default function GADebugPanel() {
  const [isGALoaded, setIsGALoaded] = useState(false)
  const [eventsSent, setEventsSent] = useState(0)

  useEffect(() => {
    const checkGA = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        setIsGALoaded(true)
      }
    }
    
    checkGA()
    const interval = setInterval(checkGA, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const sendTestEvent = () => {
    event({
      action: 'test_event',
      category: 'Debug',
      label: 'Manual Test',
      value: 1
    })
    setEventsSent(prev => prev + 1)
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-semibold mb-2">GA Debug</h3>
      <div className="space-y-2 text-xs">
        <div>Status: {isGALoaded ? '✅ Loaded' : '❌ Not Loaded'}</div>
        <div>Events Sent: {eventsSent}</div>
        <Button size="sm" onClick={sendTestEvent} disabled={!isGALoaded}>
          Send Test Event
        </Button>
      </div>
    </div>
  )
}