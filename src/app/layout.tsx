import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamyyy.com - Ultimate Multi-Stream Viewer",
  description: "Watch multiple live streams simultaneously with Streamyyy.com. The ultimate platform for stream aggregation and multi-stream viewing experience.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  keywords: ["multi-stream viewer", "live streaming", "stream aggregation", "twitch multi-stream", "youtube live streams", "streamyyy"],
  authors: [{ name: "Streamyyy.com Team" }],
  creator: "Streamyyy.com",
  publisher: "Streamyyy.com",
  openGraph: {
    title: "Streamyyy.com - Ultimate Multi-Stream Viewer",
    description: "Watch multiple live streams simultaneously with Streamyyy.com. The ultimate platform for stream aggregation and multi-stream viewing experience.",
    url: "https://streamyyy.com",
    siteName: "Streamyyy.com",
    images: [
      {
        url: "https://streamyyy.com/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Streamyyy.com - Multi-Stream Viewer Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streamyyy.com - Ultimate Multi-Stream Viewer",
    description: "Watch multiple live streams simultaneously with Streamyyy.com. The ultimate platform for stream aggregation and multi-stream viewing experience.",
    images: ["https://streamyyy.com/assets/twitter-card.png"],
    creator: "@streamyyy",
    site: "@streamyyy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
