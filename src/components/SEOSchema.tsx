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

interface SEOSchemaProps {
  faqs?: FAQItem[]
  type?: 'WebApplication' | 'Article' | 'HowTo'
  howToSteps?: HowToStep[]
  title?: string
  description?: string
}

export default function SEOSchema({ 
  faqs, 
  type = 'WebApplication', 
  howToSteps,
  title,
  description 
}: SEOSchemaProps) {
  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://streamyyy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Watch Multiple Streams",
        "item": "https://streamyyy.com/watch-multiple-streams"
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
    "url": "https://streamyyy.com",
    "logo": "https://streamyyy.com/logo.png",
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
    }
  }

  // HowTo Schema for step-by-step guides
  const howToSchema = howToSteps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title || "How to Watch Multiple Streams",
    "description": description || "Step-by-step guide to watching multiple streams simultaneously",
    "totalTime": "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url,
      "image": step.image
    }))
  } : null

  // VideoObject Schema for tutorials
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "How to Watch Multiple Streams with Streamyyy",
    "description": "Learn how to watch multiple Twitch and YouTube streams simultaneously using Streamyyy's free multi-stream viewer.",
    "thumbnailUrl": "https://streamyyy.com/video-thumbnail.jpg",
    "uploadDate": new Date().toISOString(),
    "duration": "PT2M30S",
    "contentUrl": "https://streamyyy.com/tutorial",
    "embedUrl": "https://streamyyy.com/embed/tutorial"
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

      {howToSchema && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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