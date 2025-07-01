'use client'

import { useEffect } from 'react'

const GA_TRACKING_ID = 'G-BGPSFX3HF1'

export default function GoogleAnalyticsSimple() {
  useEffect(() => {
    // Create the script elements directly
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_title: document.title,
        page_location: window.location.href
      });
      console.log('Google Analytics loaded with ID: ${GA_TRACKING_ID}');
    `
    
    // Add to head
    document.head.appendChild(script1)
    document.head.appendChild(script2)
    
    // Cleanup function
    return () => {
      try {
        if (document.head.contains(script1)) {
          document.head.removeChild(script1)
        }
        if (document.head.contains(script2)) {
          document.head.removeChild(script2)
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, [])

  return null
}