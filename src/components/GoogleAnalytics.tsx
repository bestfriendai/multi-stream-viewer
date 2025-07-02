'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-BGPSFX3HF1'

// Declare gtag function globally
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Helper functions for tracking events - using exact Google specification
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    // Debug: Check if GA is loaded
    const checkGA = () => {
      if (window.gtag) {
        // Send initial test event
        window.gtag('event', 'page_view', {
          event_category: 'Debug',
          event_label: 'GA_Loaded'
        })
      } else {
      }
    }
    
    // Check immediately and after a delay
    checkGA()
    setTimeout(checkGA, 2000)
  }, [])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
        }}
        onError={(e) => {
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onLoad={() => {
        }}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              debug_mode: true
            });
          `,
        }}
      />
    </>
  )
}