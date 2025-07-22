'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface RelatedLink {
  title: string
  href: string
  description: string
  category: string
}

export default function InternalLinks() {
  const pathname = usePathname()
  
  // Define related links for different page types
  const linkMap: Record<string, RelatedLink[]> = {
    '/': [
      {
        title: 'Multi Stream Viewer Guide',
        href: '/multi-stream-viewer',
        description: 'Complete guide to watching multiple streams simultaneously',
        category: 'Guide'
      },
      {
        title: '16 Stream Viewer',
        href: '/16-stream-viewer',
        description: 'Advanced multi-stream viewing with up to 16 streams',
        category: 'Feature'
      },
      {
        title: 'Mobile Multi Stream',
        href: '/mobile-multi-stream',
        description: 'Optimized mobile multi-stream viewing experience',
        category: 'Mobile'
      }
    ],
    '/multi-stream-viewer': [
      {
        title: 'How to Watch Multiple Streams',
        href: '/blog/how-to-watch-multiple-streams',
        description: 'Step-by-step tutorial for multi-stream viewing',
        category: 'Tutorial'
      },
      {
        title: 'Best MultiTwitch Alternative 2025',
        href: '/best-multitwitch-alternative-2025',
        description: 'Compare the top MultiTwitch alternatives',
        category: 'Comparison'
      },
      {
        title: 'Streamyyy vs MultiTwitch',
        href: '/vs/multitwitch',
        description: 'Detailed comparison with MultiTwitch',
        category: 'Comparison'
      }
    ],
    '/16-stream-viewer': [
      {
        title: 'Multi Stream Viewer',
        href: '/multi-stream-viewer',
        description: 'Learn about multi-stream viewing basics',
        category: 'Guide'
      },
      {
        title: 'Complete Multi-Stream Setup Guide',
        href: '/blog/complete-multi-stream-setup-guide-2025',
        description: 'Professional setup guide for 2025',
        category: 'Tutorial'
      },
      {
        title: 'Mobile Multi Stream',
        href: '/mobile-multi-stream',
        description: 'Mobile-optimized streaming experience',
        category: 'Mobile'
      }
    ],
    '/mobile-multi-stream': [
      {
        title: 'Watch Multiple Twitch Streams Mobile',
        href: '/blog/watch-multiple-twitch-streams-mobile',
        description: 'Mobile Twitch streaming guide',
        category: 'Tutorial'
      },
      {
        title: '16 Stream Viewer',
        href: '/16-stream-viewer',
        description: 'Advanced multi-stream capabilities',
        category: 'Feature'
      },
      {
        title: 'Multi Stream Viewer',
        href: '/multi-stream-viewer',
        description: 'Complete multi-stream viewing guide',
        category: 'Guide'
      }
    ],
    '/best-multitwitch-alternative-2025': [
      {
        title: 'Streamyyy vs MultiTwitch',
        href: '/vs/multitwitch',
        description: 'Direct comparison with MultiTwitch',
        category: 'Comparison'
      },
      {
        title: 'Streamyyy vs TwitchTheater',
        href: '/vs/twitchtheater',
        description: 'Compare with TwitchTheater features',
        category: 'Comparison'
      },
      {
        title: 'Multi Stream Viewer Guide',
        href: '/multi-stream-viewer',
        description: 'Complete guide to multi-stream viewing',
        category: 'Guide'
      }
    ]
  }

  // Blog post related links
  const blogLinks: Record<string, RelatedLink[]> = {
    '/blog/complete-multi-stream-setup-guide-2025': [
      {
        title: '16 Stream Viewer',
        href: '/16-stream-viewer',
        description: 'Advanced 16-stream viewing setup',
        category: 'Feature'
      },
      {
        title: 'Mobile Multi Stream',
        href: '/mobile-multi-stream',
        description: 'Mobile streaming optimization',
        category: 'Mobile'
      },
      {
        title: 'Best Streaming Platforms 2025',
        href: '/blog/best-streaming-platforms-2025-complete-comparison',
        description: 'Compare top streaming platforms',
        category: 'Guide'
      }
    ],
    '/blog/how-to-watch-multiple-streams': [
      {
        title: 'Multi Stream Viewer',
        href: '/multi-stream-viewer',
        description: 'Complete multi-stream viewing guide',
        category: 'Guide'
      },
      {
        title: 'Best MultiTwitch Alternative',
        href: '/best-multitwitch-alternative-2025',
        description: 'Top MultiTwitch alternatives comparison',
        category: 'Comparison'
      },
      {
        title: 'Complete Multi-Stream Setup Guide',
        href: '/blog/complete-multi-stream-setup-guide-2025',
        description: 'Professional setup guide for 2025',
        category: 'Tutorial'
      }
    ]
  }

  // Comparison page links
  const comparisonLinks: Record<string, RelatedLink[]> = {
    '/vs/multitwitch': [
      {
        title: 'Best MultiTwitch Alternative 2025',
        href: '/best-multitwitch-alternative-2025',
        description: 'Complete alternatives comparison',
        category: 'Comparison'
      },
      {
        title: 'Streamyyy vs TwitchTheater',
        href: '/vs/twitchtheater',
        description: 'Compare with TwitchTheater',
        category: 'Comparison'
      },
      {
        title: 'Multi Stream Viewer',
        href: '/multi-stream-viewer',
        description: 'Learn about our features',
        category: 'Guide'
      }
    ],
    '/vs/twitchtheater': [
      {
        title: 'Streamyyy vs MultiTwitch',
        href: '/vs/multitwitch',
        description: 'Compare with MultiTwitch',
        category: 'Comparison'
      },
      {
        title: 'Best MultiTwitch Alternative 2025',
        href: '/best-multitwitch-alternative-2025',
        description: 'Top alternatives comparison',
        category: 'Comparison'
      },
      {
        title: 'Mobile Multi Stream',
        href: '/mobile-multi-stream',
        description: 'Mobile-optimized experience',
        category: 'Mobile'
      }
    ]
  }

  // Combine all link maps
  const allLinks = { ...linkMap, ...blogLinks, ...comparisonLinks }
  const relatedLinks = allLinks[pathname] || []

  // Don't show on pages without related links
  if (relatedLinks.length === 0) {
    return null
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">Related Articles & Guides</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {relatedLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {link.category}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg leading-tight">
                <Link 
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm">
                {link.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Contextual inline links component
interface ContextualLinksProps {
  keywords: string[]
  className?: string
}

export function ContextualLinks({ keywords, className = "" }: ContextualLinksProps) {
  const keywordMap: Record<string, { href: string; title: string }> = {
    'multi stream viewer': { href: '/multi-stream-viewer', title: 'Multi Stream Viewer' },
    'multitwitch alternative': { href: '/best-multitwitch-alternative-2025', title: 'MultiTwitch Alternative' },
    '16 stream viewer': { href: '/16-stream-viewer', title: '16 Stream Viewer' },
    'mobile multi stream': { href: '/mobile-multi-stream', title: 'Mobile Multi Stream' },
    'watch multiple streams': { href: '/blog/how-to-watch-multiple-streams', title: 'How to Watch Multiple Streams' },
    'streaming setup': { href: '/blog/complete-multi-stream-setup-guide-2025', title: 'Streaming Setup Guide' },
    'multitwitch vs streamyyy': { href: '/vs/multitwitch', title: 'MultiTwitch vs Streamyyy' },
    'twitchtheater alternative': { href: '/vs/twitchtheater', title: 'TwitchTheater Alternative' }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Related:</span>
      {keywords.map((keyword, index) => {
        const link = keywordMap[keyword.toLowerCase()]
        if (!link) return null
        
        return (
          <Link
            key={index}
            href={link.href}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            {link.title}
            <ExternalLink className="h-3 w-3" />
          </Link>
        )
      })}
    </div>
  )
}
