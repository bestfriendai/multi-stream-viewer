import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {/* Home link */}
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Helper function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Convert segment to readable label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Special handling for common paths
    const pathMappings: Record<string, string> = {
      'vs': 'Comparisons',
      'multitwitch': 'MultiTwitch',
      'twitchtheater': 'TwitchTheater',
      'multistre-am': 'Multistre.am',
      'multi-stream-viewer': 'Multi-Stream Viewer',
      'watch-multiple-streams': 'Watch Multiple Streams',
      'amp-summer': 'AMP Summer'
    }
    
    if (pathMappings[segment]) {
      label = pathMappings[segment]
    }
    
    // Last item should not have href (current page)
    const isLast = index === segments.length - 1
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    })
  })
  
  return breadcrumbs
}