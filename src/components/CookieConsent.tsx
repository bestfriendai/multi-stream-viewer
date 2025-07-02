'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cookie, Shield, X } from 'lucide-react'
import Link from 'next/link'

// List of countries that require consent (EEA, UK, Switzerland)
const CONSENT_REQUIRED_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', // EU countries
  'IS', 'LI', 'NO', // EEA countries
  'GB', // UK
  'CH'  // Switzerland
]

interface ConsentState {
  necessary: boolean
  analytics: boolean
  advertising: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    advertising: false
  })

  useEffect(() => {
    const checkConsentRequired = async () => {
      // Check if consent has already been given
      const existingConsent = localStorage.getItem('cookie-consent')
      if (existingConsent) {
        const parsed = JSON.parse(existingConsent)
        // Apply existing consent
        if (parsed.advertising) {
          enableGoogleAds()
        }
        return
      }

      // Check user's location
      try {
        const response = await fetch('/api/geo-location')
        const data = await response.json()
        
        if (CONSENT_REQUIRED_COUNTRIES.includes(data.countryCode)) {
          setShowBanner(true)
        } else {
          // Auto-consent for non-regulated regions
          handleAcceptAll()
        }
      } catch (error) {
        // If geo-detection fails, show banner to be safe
        console.error('Geo-detection failed:', error)
        setShowBanner(true)
      }
    }

    checkConsentRequired()
  }, [])

  const enableGoogleAds = () => {
    // Enable Google AdSense
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(fullConsent))
    setConsent({ necessary: true, analytics: true, advertising: true })
    setShowBanner(false)
    
    // Enable Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      })
    }
    
    enableGoogleAds()
  }

  const handleAcceptSelected = () => {
    const selectedConsent = {
      ...consent,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(selectedConsent))
    setShowBanner(false)
    
    // Update Google consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_storage': consent.advertising ? 'granted' : 'denied'
      })
    }
    
    if (consent.advertising) {
      enableGoogleAds()
    }
  }

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent))
    setShowBanner(false)
    
    // Update Google consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cookie Consent</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your experience
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBanner(false)}
                className="hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main content */}
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                We use cookies and similar technologies to help personalize content, tailor and measure ads, 
                and provide a better experience. By clicking accept, you agree to this, as outlined in our{' '}
                <Link href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>

              {/* Details section */}
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-3 pt-3 border-t"
                >
                  <div className="space-y-3">
                    {/* Necessary cookies */}
                    <label className="flex items-start gap-3 cursor-not-allowed opacity-75">
                      <input
                        type="checkbox"
                        checked={consent.necessary}
                        disabled
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Necessary cookies</div>
                        <p className="text-xs text-muted-foreground">
                          Required for the website to function. Cannot be disabled.
                        </p>
                      </div>
                    </label>

                    {/* Analytics cookies */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Analytics cookies</div>
                        <p className="text-xs text-muted-foreground">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                    </label>

                    {/* Advertising cookies */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.advertising}
                        onChange={(e) => setConsent({ ...consent, advertising: e.target.checked })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Advertising cookies</div>
                        <p className="text-xs text-muted-foreground">
                          Used to show you relevant ads and measure ad campaign effectiveness.
                        </p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Reject All
              </Button>
              
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                {showDetails ? 'Hide' : 'Manage'} Preferences
              </Button>

              {showDetails ? (
                <Button
                  onClick={handleAcceptSelected}
                  className="flex-1 sm:flex-none bg-primary"
                >
                  Accept Selected
                </Button>
              ) : (
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none bg-primary"
                >
                  Accept All
                </Button>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Shield className="w-3 h-3" />
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>Your privacy is protected</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}