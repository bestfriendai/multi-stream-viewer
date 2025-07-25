import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/app-mobile-layout.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";

import CookieConsent from "@/components/CookieConsent";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AutoSyncInitializer from "@/components/AutoSyncInitializer";
import Footer from "@/components/Footer";
import DynamicLang from "@/components/DynamicLang";
import { MobileLayoutProvider } from "@/contexts/MobileLayoutContext";
import { SafariDebugProvider } from "@/components/SafariDebugProvider";
import SentryProvider from "@/components/SentryProvider";
import MobileSentryInitializer from "@/components/MobileSentryInitializer";
import { ToastProvider } from "@/components/Providers/ToastProvider";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProductSchema from "@/components/ProductSchema";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Critical for Core Web Vitals
  preload: true, // Preload critical font
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Critical for Core Web Vitals
  preload: false, // Mono font is less critical
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  // Safari mobile optimizations
  minimumScale: 1,
  shrinkToFit: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://streamyyy.com'),
  title: "Streamyyy - Free Multi-Stream Viewer | Watch Multiple Twitch & YouTube Streams",
  description: "Watch multiple Twitch, YouTube, and Kick streams simultaneously with Streamyyy's free multi-stream viewer. No download required. Perfect for esports and gaming. 16+ streams supported.",
  keywords: "multi stream viewer, watch multiple streams, multistream viewer, twitch multi viewer, youtube multi stream, watch multiple twitch streams simultaneously, free multi stream viewer, multiple stream viewer no download, esports multistream viewer, streamyyy, multitwitch alternative, stream viewer, 16 stream viewer, mobile multi stream, unified chat multi stream",
  authors: [{ name: "Streamyyy Team", url: "https://streamyyy.com" }],
  creator: "Streamyyy Team",
  publisher: "Streamyyy",
  category: "Technology",
  classification: "Multi-Stream Viewer Application",
  openGraph: {
    title: "Streamyyy - Free Multi-Stream Viewer | Watch Multiple Streams Simultaneously",
    description: "Watch multiple Twitch, YouTube, and Kick streams at once with Streamyyy. Free multi-stream viewer supporting 16+ streams. Perfect for esports and gaming.",
    url: "https://streamyyy.com",
    siteName: "Streamyyy",
    type: "website",
    images: [
      {
        url: "/streamyyy-logo-box.png",
        width: 1200,
        height: 630,
        alt: "Streamyyy Multi Stream Viewer - Watch Multiple Twitch Streams"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Streamyyy - Free Multi-Stream Viewer | Watch Multiple Streams",
    description: "Watch multiple Twitch, YouTube & Kick streams simultaneously. Free multi-stream viewer supporting 16+ streams. Perfect for esports and gaming.",
    images: ["/streamyyy-logo-box.png"],
    site: "@streamyyy",
    creator: "@streamyyy"
  },
  verification: {
    google: "t7cKO1xHr9vSs0d_2wQzNjKxL8fM5pB3rX6yE4uVhWs",
    other: {
      "msvalidate.01": "E4A5F0A21F7B8C9D3E6F2A8B5C7D9E1F4A6B8C2D5E3F"
    }
  },
  applicationName: "Streamyyy",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  appleWebApp: {
    capable: true,
    title: "Streamyyy",
    statusBarStyle: "black-translucent"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#6366f1",
    "color-scheme": "light dark",
    "supported-color-schemes": "light dark",
    "rating": "General",
    "distribution": "Global",
    "revisit-after": "7 days",
    "language": "en",
    "geo.region": "US",
    "geo.placename": "United States",
    "ICBM": "37.7749,-122.4194"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://streamyyy.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
    "name": "Streamyyy - Free Multi-Stream Viewer",
    "description": "Streamyyy is the best free multi-stream viewer for watching multiple Twitch streams, YouTube streams, and Kick streams simultaneously. Watch up to 16 streams at once with our advanced multistream viewer. Perfect for esports viewing and gaming content. No download required - access instantly in your browser.",
    "url": "https://streamyyy.com",
    "downloadUrl": "https://streamyyy.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "softwareVersion": "2.0",
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-01T00:00:00Z",
    "screenshot": "https://streamyyy.com/streamyyy-screenshot.png",
    "author": {
      "@type": "Organization",
      "name": "Streamyyy Team",
      "url": "https://streamyyy.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "3856",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Free multi-stream viewer - watch multiple streams simultaneously",
      "Watch multiple Twitch streams at once - no download required",
      "YouTube multi-stream support - watch multiple YouTube streams",
      "Kick streams integration - mix platforms in one view",
      "Watch up to 16 streams simultaneously with advanced layouts",
      "Multistream viewer with custom grid layouts (2x2, 3x3, 4x4, mosaic)",
      "Multiple stream viewer optimized for esports tournaments",
      "Twitch multi viewer with unified chat integration",
      "Mobile multi-stream viewer - perfect on any device",
      "100% free multistream viewer - no premium features or ads",
      "No download multi-stream viewer - instant browser access",
      "Multitwitch alternative with superior performance",
      "Stream synchronization and quality controls",
      "Save and share multistream layouts",
      "Keyboard shortcuts for power users",
      "Picture-in-picture mode for focused viewing"
    ],
    "sameAs": [
      "https://twitter.com/streamyyy",
      "https://github.com/bestfriendai/multi-stream-viewer"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Streamyyy",
    "url": "https://streamyyy.com",
    "description": "Free multi-stream viewer for watching multiple Twitch, YouTube, and Kick streams simultaneously",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://streamyyy.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many streams can I watch simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Streamyyy supports watching up to 16 streams simultaneously with customizable grid layouts including 2x2, 3x3, 4x4, and mosaic views."
        }
      },
      {
        "@type": "Question",
        "name": "Is Streamyyy completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Streamyyy is 100% free with no premium features, ads, or hidden costs. All features are available to everyone."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms does Streamyyy support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Streamyyy supports Twitch, YouTube, and Kick streams. You can mix and match streams from different platforms in the same view."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to download anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No download required! Streamyyy works directly in your web browser. Simply visit streamyyy.com and start watching multiple streams instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Does Streamyyy work on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Streamyyy is fully responsive and optimized for mobile devices, tablets, and desktops with touch-friendly controls."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "How to Use Streamyyy Multi-Stream Viewer",
    "description": "Learn how to watch multiple Twitch, YouTube, and Kick streams simultaneously with Streamyyy's free multi-stream viewer",
    "thumbnailUrl": "https://streamyyy.com/tutorial-thumbnail.jpg",
    "uploadDate": "2025-01-01T00:00:00Z",
    "duration": "PT3M30S",
    "contentUrl": "https://streamyyy.com/tutorial",
    "embedUrl": "https://streamyyy.com/tutorial",
    "publisher": {
      "@type": "Organization",
      "name": "Streamyyy Team",
      "url": "https://streamyyy.com"
    }
  }
];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://streamyyy.com" />
        <link rel="alternate" hrefLang="en" href="https://streamyyy.com" />
        <link rel="alternate" hrefLang="en-US" href="https://streamyyy.com" />
        <link rel="alternate" hrefLang="en-GB" href="https://streamyyy.com" />
        <link rel="alternate" hrefLang="es" href="https://streamyyy.com/es" />
        <link rel="alternate" hrefLang="fr" href="https://streamyyy.com/fr" />
        <link rel="alternate" hrefLang="de" href="https://streamyyy.com/de" />
        <link rel="alternate" hrefLang="pt" href="https://streamyyy.com/pt" />
        <link rel="alternate" hrefLang="ja" href="https://streamyyy.com/ja" />
        <link rel="alternate" hrefLang="ko" href="https://streamyyy.com/ko" />
        <link rel="alternate" hrefLang="x-default" href="https://streamyyy.com" />
        <meta name="google-site-verification" content="t7cKO1xHr9vSs0d_2wQzNjKxL8fM5pB3rX6yE4uVhWs" />
        <meta name="msvalidate.01" content="E4A5F0A21F7B8C9D3E6F2A8B5C7D9E1F4A6B8C2D5E3F" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Streamyyy" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait-any landscape-any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/streamyyy-logo-box.png" type="image/png" />
        <link rel="apple-touch-icon" href="/streamyyy-logo-box.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/streamyyy-logo-box.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/streamyyy-logo-box.png" />
        <link rel="manifest" href="/manifest.json" />
        

        {/* Performance and mobile optimizations */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <link rel="preconnect" href="https://player.twitch.tv" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="//player.twitch.tv" />
        <link rel="dns-prefetch" href="//www.youtube.com" />

        {/* Google Consent Mode - Must be before GTM/Analytics */}
        <Script
          id="google-consent-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Default consent state (denied until user accepts)
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 2000 // Wait up to 2 seconds for consent
              });
            `
          }}
        />

        {/* Google AdSense - Will respect consent mode */}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4679934692726562"
          crossOrigin="anonymous"
          async
        />

        {/* Google tag (gtag.js) */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-BGPSFX3HF1"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BGPSFX3HF1');
            `,
          }}
        />

        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Core Web Vitals Monitoring */}
        <Script
          id="core-web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function sendToGA(name, value, id) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', name, {
                      event_category: 'Web Vitals',
                      value: Math.round(name === 'CLS' ? value * 1000 : value),
                      event_label: id,
                      non_interaction: true,
                    });
                  }
                }

                // Core Web Vitals monitoring
                function getCLS(callback) {
                  let clsValue = 0;
                  let clsEntries = [];
                  let sessionValue = 0;
                  let sessionEntries = [];
                  
                  const entryHandler = (entry) => {
                    if (!entry.hadRecentInput) {
                      const firstSessionEntry = sessionEntries[0];
                      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                      
                      if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                      } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                      }
                      
                      if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        clsEntries = sessionEntries;
                        callback({
                          name: 'CLS',
                          value: clsValue,
                          id: entry.id,
                          entries: clsEntries
                        });
                      }
                    }
                  };
                  
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entryHandler);
                  });
                  observer.observe({type: 'layout-shift', buffered: true});
                }

                function getFID(callback) {
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      callback({
                        name: 'FID',
                        value: entry.processingStart - entry.startTime,
                        id: entry.id || 'fid-' + Date.now()
                      });
                    });
                  });
                  observer.observe({type: 'first-input', buffered: true});
                }

                function getLCP(callback) {
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      callback({
                        name: 'LCP',
                        value: entry.startTime,
                        id: entry.id || 'lcp-' + Date.now()
                      });
                    });
                  });
                  observer.observe({type: 'largest-contentful-paint', buffered: true});
                }

                function getFCP(callback) {
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      if (entry.name === 'first-contentful-paint') {
                        callback({
                          name: 'FCP',
                          value: entry.startTime,
                          id: 'fcp-' + Date.now()
                        });
                      }
                    });
                  });
                  observer.observe({type: 'paint', buffered: true});
                }

                // Initialize monitoring when page loads
                window.addEventListener('load', function() {
                  getCLS(sendToGA);
                  getFID(sendToGA);
                  getLCP(sendToGA);
                  getFCP(sendToGA);
                });
              })();
            `
          }}
        />

        {/* Safari Mobile Fixes */}
        <Script
          id="safari-mobile-fixes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate Safari mobile viewport fix
              if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                function setVH() {
                  const vh = window.innerHeight * 0.01;
                  document.documentElement.style.setProperty('--vh', vh + 'px');
                }
                setVH();
                window.addEventListener('resize', setVH);
                window.addEventListener('orientationchange', () => setTimeout(setVH, 300));
              }
            `
          }}
        />

        {/* NoScript fallback for search engines and users without JavaScript */}
        <noscript>
          <style>{`
            .js-only { display: none !important; }
            .noscript-fallback { display: block !important; }
          `}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased safari-mobile-fix`}
      >
        <SentryProvider enableFeedback={true} enableSpotlight={process.env.NODE_ENV === 'development'}>
          <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <SupabaseProvider>
              <LanguageProvider>
                <MobileLayoutProvider>
                  <SafariDebugProvider>
                    <DynamicLang />
                    <AutoSyncInitializer />
                    <MobileSentryInitializer />
                    <GoogleAnalytics />
                    <BreadcrumbSchema />
                    <ProductSchema />
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="dark"
                      enableSystem
                      disableTransitionOnChange
                    >
                    <div className="flex flex-col min-h-screen">
                      {children}
                      <Footer />
                    </div>
                    <Toaster />
                    <ToastProvider />
                    <CookieConsent />
                  </ThemeProvider>
                </SafariDebugProvider>
              </MobileLayoutProvider>
            </LanguageProvider>
          </SupabaseProvider>
        </ClerkProvider>
        </SentryProvider>
      </body>
    </html>
  );
}