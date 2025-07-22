'use client'

import { usePathname } from 'next/navigation'

interface ProductSchemaProps {
  productName?: string
  description?: string
  features?: string[]
  category?: string
  price?: string
  currency?: string
  ratingValue?: string
  ratingCount?: string
}

export default function ProductSchema({
  productName,
  description,
  features,
  category = "MultimediaApplication",
  price = "0",
  currency = "USD",
  ratingValue = "4.8",
  ratingCount = "1250"
}: ProductSchemaProps) {
  const pathname = usePathname()
  
  // Auto-detect product info based on pathname if not provided
  const getProductInfo = () => {
    const pathMap: Record<string, { name: string; description: string; features: string[] }> = {
      '/multi-stream-viewer': {
        name: 'Multi Stream Viewer',
        description: 'Watch multiple live streams simultaneously with advanced layout options and unified chat management',
        features: [
          'Watch up to 16 streams simultaneously',
          'Multiple layout options (1x1, 2x1, 2x2, 3x3, 4x4)',
          'Cross-platform support (Twitch, YouTube, Rumble)',
          'Mobile-optimized interface',
          'Unified chat management',
          'Saved layouts and shareable links'
        ]
      },
      '/16-stream-viewer': {
        name: '16 Stream Viewer',
        description: 'Advanced multi-stream viewer supporting up to 16 simultaneous streams with professional-grade features',
        features: [
          'Support for 16 simultaneous streams',
          'Professional grid layouts',
          'Advanced stream management',
          'High-performance streaming',
          'Cross-platform compatibility',
          'Mobile and desktop optimization'
        ]
      },
      '/mobile-multi-stream': {
        name: 'Mobile Multi Stream Viewer',
        description: 'Mobile-optimized multi-stream viewing experience with touch controls and responsive design',
        features: [
          'Mobile-first responsive design',
          'Touch-optimized controls',
          'Gesture-based navigation',
          'Optimized for mobile bandwidth',
          'Portrait and landscape support',
          'Offline viewing capabilities'
        ]
      },
      '/multitwitch-alternative': {
        name: 'MultiTwitch Alternative',
        description: 'Modern alternative to MultiTwitch with enhanced features, better performance, and mobile support',
        features: [
          'Superior performance to MultiTwitch',
          'Mobile-responsive design',
          'Enhanced chat integration',
          'Better stream quality options',
          'Advanced layout customization',
          'Cross-platform stream support'
        ]
      },
      '/watch-multiple-streams': {
        name: 'Watch Multiple Streams Tool',
        description: 'Easy-to-use tool for watching multiple live streams from different platforms in one interface',
        features: [
          'Multi-platform stream support',
          'Intuitive user interface',
          'Quick stream discovery',
          'Seamless switching between streams',
          'Social viewing features',
          'Stream recommendation engine'
        ]
      }
    }

    return pathMap[pathname] || {
      name: productName || 'Streamyyy Multi-Stream Viewer',
      description: description || 'Watch multiple live streams simultaneously',
      features: features || ['Multi-stream viewing', 'Cross-platform support', 'Mobile optimization']
    }
  }

  const productInfo = getProductInfo()

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productInfo.name,
    "description": productInfo.description,
    "brand": {
      "@type": "Brand",
      "name": "Streamyyy",
      "url": "https://streamyyy.com"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Streamyyy",
      "url": "https://streamyyy.com"
    },
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "url": `https://streamyyy.com${pathname}`,
      "seller": {
        "@type": "Organization",
        "name": "Streamyyy"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "ratingCount": ratingCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": productInfo.features,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser, iOS, Android",
    "url": `https://streamyyy.com${pathname}`,
    "sameAs": [
      "https://streamyyy.com",
      "https://twitter.com/streamyyy",
      "https://github.com/streamyyy"
    ]
  }

  // Only show on feature/product pages
  const showOnPaths = [
    '/multi-stream-viewer',
    '/16-stream-viewer', 
    '/mobile-multi-stream',
    '/multitwitch-alternative',
    '/watch-multiple-streams',
    '/watch-multiple-twitch-streams',
    '/twitch-multistream'
  ]

  if (!showOnPaths.includes(pathname)) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema)
      }}
    />
  )
}
