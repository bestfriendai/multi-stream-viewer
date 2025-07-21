'use client'

import Script from 'next/script'

interface FAQItem {
  question: string
  answer: string
}

interface HowToStep {
  name: string
  text: string
  url?: string
  image?: string
}

interface ReviewData {
  itemName: string
  rating: number
  maxRating?: number
  reviewBody?: string
  author?: string
}

interface ProductData {
  name: string
  description: string
  price?: string
  currency?: string
  availability?: string
  brand?: string
  category?: string
  features?: string[]
}

interface EnhancedSEOSchemaProps {
  faqs?: FAQItem[]
  type?: 'WebApplication' | 'Article' | 'HowTo' | 'Product' | 'SoftwareApplication' | 'Review'
  howToSteps?: HowToStep[]
  title?: string
  description?: string
  productData?: ProductData
  reviewData?: ReviewData
  url?: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
}

export default function EnhancedSEOSchema({ 
  faqs, 
  type = 'WebApplication', 
  howToSteps,
  title,
  description,
  productData,
  reviewData,
  url,
  image,
  datePublished,
  dateModified,
  author
}: EnhancedSEOSchemaProps) {
  const baseUrl = 'https://streamyyy.com'
  const currentUrl = url || baseUrl
  
  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title || "Multi-Stream Viewer",
        "item": currentUrl
      }
    ]
  }

  // FAQ Schema
  const faqSchema = faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Organization Schema with E-E-A-T signals
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Streamyyy",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "The leading multi-stream viewer platform for watching multiple live streams simultaneously.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/streamyyy",
      "https://github.com/streamyyy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@streamyyy.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5"
    }
  }

  // SoftwareApplication Schema
  const softwareApplicationSchema = type === 'SoftwareApplication' ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title || "Streamyyy Multi-Stream Viewer",
    "description": description || "Watch multiple live streams simultaneously from Twitch, YouTube, and more platforms",
    "url": currentUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5"
    },
    "featureList": [
      "Watch up to 16 streams simultaneously",
      "Cross-platform support (Twitch, YouTube, Rumble)",
      "Mobile-optimized interface",
      "Unified chat management",
      "Custom layout options",
      "No registration required",
      "100% free to use"
    ],
    "screenshot": `${baseUrl}/screenshots/multi-stream-viewer.jpg`,
    "softwareVersion": "2.0",
    "datePublished": datePublished || "2024-01-01",
    "dateModified": dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Streamyyy Team"
    }
  } : null

  // Product Schema
  const productSchema = (type === 'Product' && productData) ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "description": productData.description,
    "brand": {
      "@type": "Brand",
      "name": productData.brand || "Streamyyy"
    },
    "category": productData.category || "Software",
    "offers": {
      "@type": "Offer",
      "price": productData.price || "0",
      "priceCurrency": productData.currency || "USD",
      "availability": productData.availability || "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5"
    },
    "additionalProperty": productData.features?.map(feature => ({
      "@type": "PropertyValue",
      "name": "Feature",
      "value": feature
    }))
  } : null

  // HowTo Schema for step-by-step guides
  const howToSchema = (type === 'HowTo' && howToSteps) ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title || "How to Watch Multiple Streams",
    "description": description || "Step-by-step guide to watching multiple streams simultaneously",
    "image": image || `${baseUrl}/images/how-to-guide.jpg`,
    "totalTime": "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Web Browser or Mobile Device"
      },
      {
        "@type": "HowToSupply", 
        "name": "Internet Connection"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Streamyyy Multi-Stream Viewer"
      }
    ],
    "step": howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url,
      "image": step.image
    }))
  } : null

  // Review Schema
  const reviewSchema = (type === 'Review' && reviewData) ? {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": reviewData.itemName
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewData.rating,
      "bestRating": reviewData.maxRating || 5
    },
    "author": {
      "@type": "Organization",
      "name": reviewData.author || "Streamyyy Team"
    },
    "reviewBody": reviewData.reviewBody,
    "datePublished": datePublished || new Date().toISOString()
  } : null

  // Article Schema
  const articleSchema = type === 'Article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image || `${baseUrl}/images/article-image.jpg`,
    "author": {
      "@type": "Organization",
      "name": author || "Streamyyy Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Streamyyy",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  } : null

  // VideoObject Schema for tutorials
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "How to Watch Multiple Streams with Streamyyy",
    "description": "Learn how to watch multiple Twitch and YouTube streams simultaneously using Streamyyy's free multi-stream viewer.",
    "thumbnailUrl": `${baseUrl}/video-thumbnail.jpg`,
    "uploadDate": new Date().toISOString(),
    "duration": "PT2M30S",
    "contentUrl": `${baseUrl}/tutorial`,
    "embedUrl": `${baseUrl}/embed/tutorial`,
    "publisher": {
      "@type": "Organization",
      "name": "Streamyyy",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {softwareApplicationSchema && (
        <Script
          id="software-application-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
      )}

      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {howToSchema && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {reviewSchema && (
        <Script
          id="review-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}

      {articleSchema && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <Script
        id="video-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
    </>
  )
}