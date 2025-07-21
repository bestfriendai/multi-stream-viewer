'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

// Optimized Image component with Core Web Vitals in mind
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  if (blurDataURL) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      quality={quality}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  )
}

// Performance monitoring and optimization component
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontPreloads = [
        '/fonts/inter-var.woff2',
        '/fonts/inter-var-latin.woff2'
      ]

      fontPreloads.forEach(font => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = font
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })

      // Preload critical images
      const criticalImages = [
        '/hero-image.webp',
        '/logo.png'
      ]

      criticalImages.forEach(imageSrc => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = imageSrc
        link.as = 'image'
        document.head.appendChild(link)
      })
    }

    // DNS prefetch for external domains
    const prefetchDomains = () => {
      const domains = [
        'https://api.twitch.tv',
        'https://www.youtube.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ]

      domains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = domain
        document.head.appendChild(link)
      })
    }

    // Optimize third-party scripts loading
    const optimizeThirdPartyScripts = () => {
      // Delay non-critical scripts until after page load
      window.addEventListener('load', () => {
        // Load analytics after page load
        if (typeof window !== 'undefined' && !window.gtag) {
          const script = document.createElement('script')
          script.async = true
          script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
          document.head.appendChild(script)
        }
      })
    }

    // Implement resource hints
    const implementResourceHints = () => {
      // Preconnect to critical third-party origins
      const preconnectDomains = [
        'https://api.twitch.tv',
        'https://fonts.googleapis.com'
      ]

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }

    // Optimize images with Intersection Observer for lazy loading
    const optimizeLazyLoading = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.classList.remove('lazy')
                imageObserver.unobserve(img)
              }
            }
          })
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        })

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img)
        })
      }
    }

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration)
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError)
            })
        })
      }
    }

    // Critical CSS optimization
    const optimizeCriticalCSS = () => {
      // Remove unused CSS classes (this would typically be done at build time)
      // This is a runtime optimization for dynamic content
      const unusedSelectors = [
        '.unused-class',
        '.debug-only'
      ]

      unusedSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => el.remove())
      })
    }

    // Implement performance budgets monitoring
    const monitorPerformanceBudgets = () => {
      if ('PerformanceObserver' in window) {
        // Monitor bundle size
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            
            // Alert if JavaScript bundles are too large
            if (resource.name.includes('.js') && resource.transferSize > 250000) {
              console.warn('Large JavaScript bundle detected:', {
                name: resource.name,
                size: `${(resource.transferSize / 1024).toFixed(2)}KB`
              })
            }

            // Alert if images are too large
            if (resource.name.match(/\.(jpg|jpeg|png|webp|gif)$/i) && resource.transferSize > 500000) {
              console.warn('Large image detected:', {
                name: resource.name,
                size: `${(resource.transferSize / 1024).toFixed(2)}KB`
              })
            }
          }
        })

        resourceObserver.observe({ entryTypes: ['resource'] })
      }
    }

    // Execute optimizations
    preloadCriticalResources()
    prefetchDomains()
    optimizeThirdPartyScripts()
    implementResourceHints()
    optimizeLazyLoading()
    registerServiceWorker()
    optimizeCriticalCSS()
    monitorPerformanceBudgets()

    // Cleanup function
    return () => {
      // Remove event listeners if needed
    }
  }, [])

  return null // This component doesn't render anything
}

// Utility function to generate responsive image sizes
export function generateResponsiveSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ')
}

// Utility function to create blur data URL for images
export function createBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL()
}

// Critical CSS inlining utility (for build-time optimization)
export const criticalCSS = `
  /* Critical above-the-fold styles */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`