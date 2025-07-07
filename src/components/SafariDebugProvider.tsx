'use client'

import { useEffect, useRef } from 'react'
import { initSafariDebugger, cleanupSafariDebugger } from '@/utils/safariDebugger'
import { MobileDebugPanel } from './MobileDebugPanel'

interface SafariDebugProviderProps {
  children: React.ReactNode
}

export function SafariDebugProvider({ children }: SafariDebugProviderProps) {
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only initialize once and only on client side
    if (typeof window === 'undefined' || isInitialized.current) return

    // Check if we're on Safari mobile
    const isSafariMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                          /Safari/.test(navigator.userAgent) && 
                          !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)

    if (isSafariMobile) {
      console.log('[Safari Debug] Safari mobile detected, initializing debugger...')
      initSafariDebugger()
      isInitialized.current = true

      // Additional Safari-specific fixes
      applySafariMobileFixes()
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized.current) {
        cleanupSafariDebugger()
      }
    }
  }, [])

  return (
    <>
      {children}
      <MobileDebugPanel />
    </>
  )
}

function applySafariMobileFixes() {
  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input, textarea, select')
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      }
    })

    input.addEventListener('blur', () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes')
      }
    })
  })

  // Prevent double-tap zoom - Re-enabled with safer implementation
  let lastTouchEnd = 0
  let tapCount = 0
  
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime()
    
    if (now - lastTouchEnd <= 300) {
      tapCount++
      // Only prevent if it's a double-tap on non-interactive elements
      const target = event.target as Element
      if (tapCount >= 2 && !target.closest('button, input, textarea, select, a, [role="button"]')) {
        event.preventDefault()
      }
    } else {
      tapCount = 0
    }
    
    lastTouchEnd = now
    
    // Reset tap count after delay
    setTimeout(() => {
      tapCount = 0
    }, 400)
  }, { passive: false })

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    // Delay to ensure proper rendering after orientation change
    setTimeout(() => {
      window.scrollTo(0, 0)
      // Force a repaint
      document.body.style.display = 'none'
      document.body.offsetHeight // Trigger reflow
      document.body.style.display = ''
    }, 100)
  })

  // Handle page visibility changes (Safari often reloads on these)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Save critical state before page might be unloaded
      try {
        const criticalState = {
          timestamp: Date.now(),
          url: window.location.href,
          scrollPosition: window.scrollY
        }
        sessionStorage.setItem('safari-critical-state', JSON.stringify(criticalState))
      } catch (e) {
        console.warn('[Safari Debug] Could not save critical state:', e)
      }
    } else if (document.visibilityState === 'visible') {
      // Restore state if page was restored
      try {
        const savedState = sessionStorage.getItem('safari-critical-state')
        if (savedState) {
          const state = JSON.parse(savedState)
          // Restore scroll position
          setTimeout(() => {
            window.scrollTo(0, state.scrollPosition || 0)
          }, 100)
        }
      } catch (e) {
        console.warn('[Safari Debug] Could not restore critical state:', e)
      }
    }
  })

  // Handle memory warnings
  window.addEventListener('safari-memory-warning', () => {
    console.warn('[Safari Debug] Memory warning received, cleaning up...')
    
    // Clear any cached images that aren't visible
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      const rect = img.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isVisible && img.src && !img.src.startsWith('data:')) {
        // Store original src for later restoration
        img.dataset.originalSrc = img.src
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+'
      }
    })

    // Clear any unused video elements
    const videos = document.querySelectorAll('video')
    videos.forEach(video => {
      if (video.paused && !video.dataset.keepLoaded) {
        video.src = ''
        video.load()
      }
    })

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc()
    }
  })

  // Handle beforeunload to prevent data loss
  window.addEventListener('beforeunload', (event) => {
    // Save any critical form data
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      const formData = new FormData(form)
      const data: Record<string, string> = {}
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = value
        }
      })
      
      if (Object.keys(data).length > 0) {
        try {
          sessionStorage.setItem(`safari-form-${form.id || 'default'}`, JSON.stringify(data))
        } catch (e) {
          console.warn('[Safari Debug] Could not save form data:', e)
        }
      }
    })
  })

  // Monitor for excessive DOM mutations that might cause crashes
  if ('MutationObserver' in window) {
    let mutationCount = 0
    const mutationObserver = new MutationObserver((mutations) => {
      mutationCount += mutations.length
      
      // Reset counter every second
      setTimeout(() => {
        mutationCount = Math.max(0, mutationCount - mutations.length)
      }, 1000)
      
      // Warn if too many mutations
      if (mutationCount > 100) {
        console.warn('[Safari Debug] High DOM mutation rate detected:', mutationCount)
        window.dispatchEvent(new CustomEvent('safari-memory-warning'))
      }
    })
    
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    })
  }

  console.log('[Safari Debug] Safari mobile fixes applied')
}