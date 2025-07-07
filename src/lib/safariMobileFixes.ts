'use client'

/**
 * Safari Mobile Fixes
 * Handles Safari mobile specific issues like viewport height, touch events, etc.
 */

export const initSafariMobileFixes = () => {
  if (typeof window === 'undefined') return

  // Detect Safari mobile
  const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  if (!isSafariMobile) return

  // Fix viewport height issues
  const setViewportHeight = () => {
    // Set CSS custom property for actual viewport height
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // Fix address bar resize issues
  const handleResize = () => {
    setViewportHeight()
    
    // Force a reflow to ensure proper sizing
    setTimeout(() => {
      setViewportHeight()
    }, 100)
  }

  // Fix orientation change issues
  const handleOrientationChange = () => {
    // Delay to allow iOS to complete orientation change
    setTimeout(() => {
      setViewportHeight()
      window.scrollTo(0, 0)
    }, 300)
  }

  // Fix iOS Safari status bar and safe area issues
  const updateSafeAreas = () => {
    const safeAreaTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0')
    const safeAreaBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0')
    
    document.documentElement.style.setProperty('--safe-area-inset-top', `${safeAreaTop}px`)
    document.documentElement.style.setProperty('--safe-area-inset-bottom', `${safeAreaBottom}px`)
  }

  // Prevent zoom on input focus
  const preventInputZoom = () => {
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
        // Ensure font size is at least 16px to prevent zoom
        const computedStyle = window.getComputedStyle(input)
        const fontSize = parseFloat(computedStyle.fontSize)
        if (fontSize < 16) {
          input.style.fontSize = '16px'
        }
      }
    })
  }

  // Fix scroll position after orientation change
  const fixScrollPosition = () => {
    // Scroll to top to avoid awkward positioning
    window.scrollTo(0, 0)
  }

  // Improve touch event handling
  const improveTouchHandling = () => {
    // Add touch-action manipulation to prevent unwanted behaviors
    document.body.style.touchAction = 'manipulation'
    
    // Prevent double-tap zoom
    let lastTouchEnd = 0
    document.addEventListener('touchend', (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, { passive: false })
  }

  // Fix modal and dialog positioning
  const fixModalPositioning = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Check if it's a modal or dialog
              if (node.matches('[role="dialog"], .dialog-content, .modal-content') || 
                  node.querySelector('[role="dialog"], .dialog-content, .modal-content')) {
                // Apply Safari mobile specific positioning fixes
                const dialogs = node.matches('[role="dialog"], .dialog-content, .modal-content') 
                  ? [node] 
                  : Array.from(node.querySelectorAll('[role="dialog"], .dialog-content, .modal-content'))
                
                dialogs.forEach((dialog) => {
                  if (dialog instanceof HTMLElement) {
                    dialog.style.position = 'fixed'
                    dialog.style.top = '50%'
                    dialog.style.left = '50%'
                    dialog.style.transform = 'translate(-50%, -50%)'
                    dialog.style.maxHeight = 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
                    dialog.style.maxWidth = '95vw'
                  }
                })
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return observer
  }

  // Initialize all fixes
  setViewportHeight()
  updateSafeAreas()
  preventInputZoom()
  improveTouchHandling()
  const modalObserver = fixModalPositioning()

  // Set up event listeners
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
  
  // Additional resize listener for iOS Safari address bar
  let ticking = false
  const handleVisualViewportResize = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setViewportHeight()
        ticking = false
      })
      ticking = true
    }
  }

  if ('visualViewport' in window) {
    window.visualViewport?.addEventListener('resize', handleVisualViewportResize, { passive: true })
  }

  // Re-apply fixes when DOM content changes
  document.addEventListener('DOMContentLoaded', () => {
    setViewportHeight()
    updateSafeAreas()
    preventInputZoom()
    fixScrollPosition()
  })

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleOrientationChange)
    if ('visualViewport' in window) {
      window.visualViewport?.removeEventListener('resize', handleVisualViewportResize)
    }
    modalObserver.disconnect()
  }
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafariMobileFixes)
  } else {
    initSafariMobileFixes()
  }
}