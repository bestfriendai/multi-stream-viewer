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
  title: "Watch Multiple Streams at Once - Streamyyy Multi-Stream Viewer",
  description: "Watch multiple Twitch streams, YouTube streams, and more simultaneously. Free multi-stream viewer for watching many streams at once. Perfect for esports, gaming events, and content creators.",
  metadataBase: new URL("https://streamyyy.com"),
  alternates: {
    canonical: "https://streamyyy.com",
  },
  manifest: "/manifest.json",
  keywords: [
    "watch multiple streams",
    "multi stream viewer",
    "watch many twitch streams", 
    "multiple twitch streams",
    "twitch multistream",
    "youtube multi stream",
    "watch multiple streams at once",
    "multi twitch viewer",
    "multiple stream viewer",
    "twitch squad stream",
    "watch 4 streams at once",
    "watch multiple streamers",
    "simultaneous streams",
    "stream aggregator",
    "esports multi stream",
    "gaming multi viewer",
    "free multi stream viewer",
    "online multi stream",
    "streamyyy",
    "streamyyy.com"
  ],
  authors: [{ name: "Streamyyy.com Team" }],
  creator: "Streamyyy.com",
  publisher: "Streamyyy.com",
  applicationName: "Streamyyy Multi-Stream Viewer",
  category: "entertainment",
  openGraph: {
    title: "Watch Multiple Streams at Once - Free Multi-Stream Viewer | Streamyyy",
    description: "Watch multiple Twitch streams, YouTube streams simultaneously in one window. The best free multi-stream viewer for watching many streams at once. Perfect for tournaments, events, and following multiple streamers.",
    url: "https://streamyyy.com",
    siteName: "Streamyyy - Multi-Stream Viewer",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Streamyyy - Watch Multiple Streams Simultaneously - Free Multi-Stream Viewer",
        type: "image/svg+xml",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Multiple Streams at Once - Streamyyy",
    description: "Free multi-stream viewer for Twitch, YouTube & more. Watch many streams simultaneously in one window.",
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
    "name": "Streamyyy Multi-Stream Viewer",
    "description": "Watch multiple Twitch streams, YouTube streams simultaneously. Free multi-stream viewer for watching many streams at once.",
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
      "ratingValue": "4.8",
      "ratingCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Watch multiple Twitch streams simultaneously",
      "Watch multiple YouTube streams at once", 
      "Watch Kick streams and other platforms",
      "Custom grid layouts for multi-stream viewing",
      "Live viewer counts and stream status tracking",
      "Integrated chat from all platforms",
      "Mobile responsive design with touch controls",
      "100% free to use forever",
      "No registration or login required",
      "Support up to 16 simultaneous streams",
      "Keyboard shortcuts and hotkeys",
      "Full accessibility features and screen reader support",
      "Real-time analytics and performance metrics",
      "Dark and light theme support",
      "Stream synchronization controls",
      "Picture-in-picture mode support"
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
        <AnalyticsPageTracker />
        <SessionTracker />
        <MobileAnalyticsTracker />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <GADebugPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}