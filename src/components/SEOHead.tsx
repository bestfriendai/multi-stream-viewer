import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: any;
}

const defaultSEO = {
  title: 'Streamyyy.com - Ultimate Multi-Stream Viewer | Watch Multiple Live Streams',
  description: 'Watch multiple live streams simultaneously with Streamyyy.com. The ultimate platform for stream aggregation, multi-stream viewing, and live video entertainment. Support for Twitch, YouTube, and more.',
  keywords: [
    'multi-stream viewer',
    'live streaming',
    'stream aggregation',
    'twitch multi-stream',
    'youtube live streams',
    'stream viewer',
    'live video',
    'streaming platform',
    'watch multiple streams',
    'stream overlay',
    'streamyyy',
    'multi-view streaming',
    'concurrent streams',
    'stream dashboard'
  ],
  ogImage: 'https://streamyyy.com/assets/og-image.png',
  twitterImage: 'https://streamyyy.com/assets/twitter-card.png',
  canonical: 'https://streamyyy.com/'
};

export default function SEOHead({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  ogImage = defaultSEO.ogImage,
  twitterImage = defaultSEO.twitterImage,
  canonical = defaultSEO.canonical,
  noindex = false,
  structuredData
}: SEOHeadProps) {
  const fullTitle = title.includes('Streamyyy') ? title : `${title} | Streamyyy.com`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Streamyyy.com Team" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Streamyyy.com - Multi-Stream Viewer Platform" />
      <meta property="og:site_name" content="Streamyyy.com" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={twitterImage} />
      <meta property="twitter:image:alt" content="Streamyyy.com - Multi-Stream Viewer Platform" />
      <meta property="twitter:creator" content="@streamyyy" />
      <meta property="twitter:site" content="@streamyyy" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Streamyyy" />
      <meta name="application-name" content="Streamyyy.com" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//api.streamyyy.com" />
      <link rel="dns-prefetch" href="//cdn.streamyyy.com" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Default Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Streamyyy.com",
            "alternateName": "Streamyyy",
            "description": description,
            "url": "https://streamyyy.com",
            "applicationCategory": "EntertainmentApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "Streamyyy.com Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Streamyyy.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://streamyyy.com/assets/logo.png"
              }
            },
            "featureList": [
              "Multi-stream viewing",
              "Live stream aggregation",
              "Twitch integration",
              "YouTube Live support",
              "Real-time chat",
              "Stream overlay",
              "Mobile responsive",
              "Dark mode"
            ],
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "softwareVersion": "1.0.0"
          })
        }}
      />
      
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Streamyyy.com",
            "url": "https://streamyyy.com",
            "logo": "https://streamyyy.com/assets/logo.png",
            "description": "The ultimate multi-stream viewing platform for live streaming entertainment.",
            "sameAs": [
              "https://twitter.com/streamyyy",
              "https://github.com/streamyyy"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@streamyyy.com"
            }
          })
        }}
      />
    </Head>
  );
}
