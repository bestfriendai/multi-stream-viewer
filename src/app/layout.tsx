import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAnalyticsSimple from "@/components/GoogleAnalyticsSimple";
import AnalyticsPageTracker from "@/components/AnalyticsPageTracker";
import SessionTracker from "@/components/SessionTracker";
import MobileAnalyticsTracker from "@/components/MobileAnalyticsTracker";
import GADebugPanel from "@/components/GADebugPanel";
import Footer from "@/components/Footer"
import CookieConsent from "@/components/CookieConsent";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
}

export const metadata: Metadata = {
  title: "STREAMYYY - Watch Multiple Streams at Once | Best MultiTwitch Alternative",
  description: "Watch multiple Twitch streams simultaneously with STREAMYYY. The best free multistream viewer for watching up to 16 streams at once. Better than MultiTwitch, Multistre.am, and TwitchTheater. Watch Twitch, YouTube, Kick streams together.",
  metadataBase: new URL("https://streamyyy.com"),
  alternates: {
    canonical: "https://streamyyy.com",
  },
  manifest: "/manifest.json",
  keywords: [
    "multitwitch",
    "multi twitch",
    "multitwitch.tv",
    "multistre.am",
    "multistream",
    "watch multiple streams",
    "multi stream viewer",
    "watch multiple twitch streams",
    "twitch multistream",
    "youtube multistream",
    "watch multiple streams at once",
    "multi twitch viewer",
    "multiple stream viewer",
    "twitch squad stream",
    "watch 4 streams at once",
    "watch 8 streams at once",
    "watch 16 streams at once",
    "twitchtheater",
    "twitch theater",
    "multiwatch",
    "teamstream",
    "streamyyy",
    "best multitwitch alternative",
    "free multistream viewer"
  ],
  authors: [{ name: "Streamyyy.com Team" }],
  creator: "Streamyyy.com",
  publisher: "Streamyyy.com",
  applicationName: "Streamyyy Multi-Stream Viewer",
  category: "entertainment",
  openGraph: {
    title: "STREAMYYY - Best MultiTwitch Alternative | Watch Multiple Streams",
    description: "Better than MultiTwitch.tv and Multistre.am. Watch up to 16 Twitch, YouTube, Kick streams simultaneously. The most powerful free multistream viewer with custom layouts, unified chat, and mobile support.",
    url: "https://streamyyy.com",
    siteName: "STREAMYYY - MultiStream Viewer",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "STREAMYYY - Watch Multiple Twitch Streams at Once - Best MultiTwitch Alternative",
        type: "image/svg+xml",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STREAMYYY - Watch Multiple Streams | MultiTwitch Alternative",
    description: "Better than MultiTwitch & Multistre.am. Watch 16 streams at once. Free multistream viewer for Twitch, YouTube, Kick.",
    images: ["/twitter-card.svg"],
    creator: "@streamyyy",
    site: "@streamyyy",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "t7cKO1xHr9vSs0d_2wQzNjKxL8fM5pB3rX6yE4uVhWs",
    other: {
      'msvalidate.01': 'E4A5F0A21F7B8C9D3E6F2A8B5C7D9E1F4A6B8C2D5E3F',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "STREAMYYY - Best MultiTwitch Alternative",
    "description": "Watch multiple Twitch streams at once with STREAMYYY. Better than MultiTwitch.tv, Multistre.am, and TwitchTheater. Free multistream viewer supporting up to 16 simultaneous streams from Twitch, YouTube, Kick, and more.",
    "url": "https://streamyyy.com",
    "downloadUrl": "https://streamyyy.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "softwareVersion": "2.0",
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "screenshot": "https://streamyyy.com/og-image.svg",
    "author": {
      "@type": "Organization",
      "name": "STREAMYYY Team",
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
      "Watch up to 16 streams at once (more than MultiTwitch)",
      "Better performance than MultiTwitch.tv and Multistre.am",
      "Watch multiple Twitch streams simultaneously",
      "Watch multiple YouTube streams at once", 
      "Mix Twitch, YouTube, Kick streams in one view",
      "Custom grid layouts (2x2, 3x3, 4x4, mosaic)",
      "Unified chat panel for all streams",
      "Mobile optimized (unlike MultiTwitch)",
      "100% free - no premium features",
      "No registration required - instant access",
      "Keyboard shortcuts for power users",
      "Picture-in-picture mode",
      "Stream synchronization controls",
      "Save and share multistream layouts",
      "Auto-quality adjustment for bandwidth",
      "Dark and light theme support"
    ],
    "sameAs": [
      "https://twitter.com/streamyyy",
      "https://github.com/bestfriendai/multi-stream-viewer"
    ]
  };

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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Streamyyy" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        
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
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4679934692726562"
          crossOrigin="anonymous"
        />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BGPSFX3HF1"></script>
        <script
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <AnalyticsPageTracker />
          <SessionTracker />
          <MobileAnalyticsTracker />
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
            <GADebugPanel />
            <CookieConsent />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}