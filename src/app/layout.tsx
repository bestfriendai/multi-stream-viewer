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

export const metadata: Metadata = {
  title: "Watch Multiple Streams at Once - Streamyyy Multi-Stream Viewer",
  description: "Watch multiple Twitch streams, YouTube streams, and more simultaneously. Free multi-stream viewer for watching many streams at once. Perfect for esports, gaming events, and content creators.",
  metadataBase: new URL("https://streamyyy.com"),
  alternates: {
    canonical: "https://streamyyy.com",
  },
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Streamyyy - Watch Multiple Streams Simultaneously",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Multiple Streams at Once - Streamyyy",
    description: "Free multi-stream viewer for Twitch, YouTube & more. Watch many streams simultaneously in one window.",
    images: ["/twitter-card.png"],
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
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy Multi-Stream Viewer",
    "description": "Watch multiple Twitch streams, YouTube streams simultaneously. Free multi-stream viewer for watching many streams at once.",
    "url": "https://streamyyy.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2847"
    },
    "featureList": [
      "Watch multiple Twitch streams simultaneously",
      "Watch multiple YouTube streams at once",
      "Custom layouts for multi-stream viewing",
      "Live viewer counts and stream status",
      "Chat integration for all streams",
      "Mobile responsive design",
      "Free to use"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://streamyyy.com" />
        <meta name="google-site-verification" content="your-verification-code" />
        
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