'use client'

import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  name: string
  item: string
  position: number
}

export default function BreadcrumbSchema() {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const baseUrl = 'https://streamyyy.com'
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    const breadcrumbs: BreadcrumbItem[] = [
      {
        name: 'Home',
        item: baseUrl,
        position: 1
      }
    ]

    // Build breadcrumbs from path segments
    let currentPath = baseUrl
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable name
      let name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Special cases for better naming
      const specialCases: Record<string, string> = {
        'blog': 'Blog',
        'vs': 'Comparisons',
        'guide': 'Guides',
        '16-stream-viewer': '16 Stream Viewer',
        'mobile-multi-stream': 'Mobile Multi Stream',
        'multi-stream-viewer': 'Multi Stream Viewer',
        'multitwitch': 'MultiTwitch Alternative',
        'watch-multiple-streams': 'Watch Multiple Streams',
        'watch-multiple-twitch-streams': 'Watch Multiple Twitch Streams',
        'multitwitch-alternative': 'MultiTwitch Alternative',
        'twitch-multistream': 'Twitch Multi Stream',
        'complete-multi-stream-setup-guide-2025': 'Complete Multi Stream Setup Guide 2025',
        'best-streaming-platforms-2025-complete-comparison': 'Best Streaming Platforms 2025',
        'how-to-watch-multiple-streams': 'How to Watch Multiple Streams',
        'streaming-setup-ultimate-guide': 'Streaming Setup Ultimate Guide',
        'grow-your-stream-proven-strategies': 'Grow Your Stream - Proven Strategies'
      }

      if (specialCases[segment]) {
        name = specialCases[segment]
      }

      breadcrumbs.push({
        name,
        item: currentPath,
        position: index + 2
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map(breadcrumb => ({
      "@type": "ListItem",
      "position": breadcrumb.position,
      "name": breadcrumb.name,
      "item": breadcrumb.item
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
      }}
    />
  )
}
