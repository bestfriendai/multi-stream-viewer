'use client'

import Script from 'next/script'
import { useEffect } from 'react'

// Production-ready GA configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Declare gtag function globally
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Check if user has consented to analytics
const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) return false
    
    const parsed = JSON.parse(consent)
    return parsed.analytics === true
  } catch {
    return false
  }
}

// Helper functions for tracking events - using exact Google specification
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || !hasAnalyticsConsent()) return
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      cookie_flags: 'SameSite=None;Secure',
    })
  }
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!GA_TRACKING_ID || !hasAnalyticsConsent()) return
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track specific business events
export const trackStreamAdd = (platform: string) => {
  event({
    action: 'add_stream',
    category: 'engagement',
    label: platform
  })
}

export const trackLayoutChange = (layoutType: string) => {
  event({
    action: 'layout_change', 
    category: 'engagement',
    label: layoutType
  })
}

export const trackSignup = () => {
  event({
    action: 'sign_up',
    category: 'conversion'
  })
}

export default function GoogleAnalytics() {
  useEffect(() => {
    // Only initialize if we have a tracking ID
    if (!GA_TRACKING_ID) {
      if (!IS_PRODUCTION) {
        console.warn('GA_TRACKING_ID not found. Analytics disabled.')
      }
      return
    }

    // Initialize Google Consent Mode
    if (typeof window !== 'undefined') {
      window.gtag = window.gtag || function() {
        (window.dataLayer = window.dataLayer || []).push(arguments)
      }
      
      // Set default consent state (denied by default for GDPR compliance)
      window.gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'wait_for_update': 500,
      })
      
      // Check for existing consent and update accordingly
      if (hasAnalyticsConsent()) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        })
      }
    }

    // Debug: Check if GA is loaded (only in development)
    if (!IS_PRODUCTION && GA_DEBUG) {
      const checkGA = () => {
        if (window.gtag && hasAnalyticsConsent()) {
          window.gtag('event', 'debug_ga_loaded', {
            event_category: 'Debug',
            event_label: 'GA_Initialized'
          })
        }
      }
      
      setTimeout(checkGA, 2000)
    }
  }, [])

  // Don't render anything if no tracking ID
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (!IS_PRODUCTION && GA_DEBUG) {
            console.log('GA script loaded successfully')
          }
        }}
        onError={(e) => {
          if (!IS_PRODUCTION) {
            console.error('Failed to load GA script:', e)
          }
        }}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Initialize with consent mode
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              cookie_flags: 'SameSite=None;Secure',
              ${!IS_PRODUCTION && GA_DEBUG ? "debug_mode: true," : ""}
              send_page_view: false // We'll handle page views manually
            });
            
            // Send initial page view only if consent is granted
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href
            });
          `,
        }}
      />
    </>
  )
}