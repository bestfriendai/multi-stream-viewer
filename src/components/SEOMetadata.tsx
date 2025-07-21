import type { Metadata } from 'next'

interface SEOMetadataProps {
  title: string
  description: string
  canonical?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  locale?: string
  alternateLocales?: Array<{ locale: string; url: string }>
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  nofollow = false,
  locale = 'en_US',
  alternateLocales = []
}: SEOMetadataProps): Metadata {
  const baseUrl = 'https://streamyyy.com'
  const fullCanonical = canonical || baseUrl
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.jpg`
  const siteName = 'Streamyyy'

  // Build robots directive
  const robotsDirectives = []
  if (noindex) robotsDirectives.push('noindex')
  if (nofollow) robotsDirectives.push('nofollow')
  if (robotsDirectives.length === 0) {
    robotsDirectives.push('index', 'follow')
  }

  const metadata: Metadata = {
    title,
    description,
    robots: robotsDirectives.join(', '),
    
    // Canonical URL
    alternates: {
      canonical: fullCanonical,
      languages: alternateLocales.reduce((acc, alt) => {
        acc[alt.locale] = alt.url
        return acc
      }, {} as Record<string, string>)
    },

    // Open Graph metadata
    openGraph: {
      title,
      description,
      url: fullCanonical,
      siteName,
      locale,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        }
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : ['Streamyyy Team'],
        section,
        tags
      })
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@streamyyy',
      site: '@streamyyy'
    },

    // Additional metadata
    other: {
      // Article-specific metadata
      ...(type === 'article' && publishedTime && {
        'article:published_time': publishedTime,
      }),
      ...(type === 'article' && modifiedTime && {
        'article:modified_time': modifiedTime,
      }),
      ...(type === 'article' && author && {
        'article:author': author,
      }),
      ...(type === 'article' && section && {
        'article:section': section,
      }),
      ...(type === 'article' && tags && {
        'article:tag': tags.join(','),
      }),

      // Product-specific metadata
      ...(type === 'product' && {
        'product:price:amount': '0',
        'product:price:currency': 'USD',
        'product:availability': 'in stock',
      }),

      // Additional SEO metadata
      'theme-color': '#6366f1',
      'msapplication-TileColor': '#6366f1',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
    }
  }

  return metadata
}

// Pre-configured metadata generators for common page types
export const generateLandingPageMetadata = (props: Omit<SEOMetadataProps, 'type'>) =>
  generateSEOMetadata({ ...props, type: 'website' })

export const generateArticleMetadata = (props: Omit<SEOMetadataProps, 'type'>) =>
  generateSEOMetadata({ ...props, type: 'article' })

export const generateProductMetadata = (props: Omit<SEOMetadataProps, 'type'>) =>
  generateSEOMetadata({ ...props, type: 'product' })

// Common metadata presets
export const defaultSEOConfig = {
  siteName: 'Streamyyy',
  baseUrl: 'https://streamyyy.com',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@streamyyy',
  locale: 'en_US'
}

// Utility function to generate structured data for breadcrumbs
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

// Utility function to generate JSON-LD script tag
export function generateJSONLD(data: object) {
  return {
    __html: JSON.stringify(data)
  }
}