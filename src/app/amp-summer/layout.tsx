import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AMP Summer 2025 - Watch Kai Cenat, Duke Dennis, Agent00, Fanum Live | AMPSUMMER.com',
  description: 'Watch AMP Summer live streams featuring Kai Cenat, Duke Dennis, Agent00, and Fanum all in one place. Any Means Possible ⚡️ AMP exclusive content, multi-stream viewer for the ultimate AMP gang experience.',
  keywords: 'AMP Summer, AMPSUMMER.com, Kai Cenat, Duke Dennis, Agent00, Fanum, AMP, Any Means Possible, AMP gang, AMP exclusive, ampexclusive, AMP streamers, live stream, Twitch, multi stream, watch AMP live, AMP members, AMP content, AMP 2025, streaming',
  authors: [{ name: 'AMP Summer' }],
  creator: 'AMP Summer',
  publisher: 'AMPSUMMER.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ampsummer.com'),
  alternates: {
    canonical: '/amp-summer',
  },
  openGraph: {
    title: 'AMP Summer 2025 - Watch Kai Cenat, Duke Dennis, Agent00, Fanum Live',
    description: 'Watch all AMP members live in one place. Any Means Possible ⚡️ Experience AMP Summer with Kai Cenat, Duke Dennis, Agent00, and Fanum streaming together.',
    url: 'https://ampsummer.com/amp-summer',
    siteName: 'AMP Summer',
    images: [
      {
        url: '/amp-summer-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AMP Summer - Kai Cenat, Duke Dennis, Agent00, Fanum Live Streams',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMP Summer 2025 - Live Now ⚡️',
    description: 'Watch Kai Cenat, Duke Dennis, Agent00 & Fanum live on AMPSUMMER.com. Any Means Possible exclusive content.',
    images: ['/amp-summer-twitter.jpg'],
    creator: '@AMPexclusive',
    site: '@AMPexclusive',
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
}

export default function AmpSummerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}