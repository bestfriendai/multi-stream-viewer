import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'MultiTwitch Alternative - STREAMYYY | Watch Multiple Twitch Streams',
  description: 'Better than MultiTwitch.tv! Watch multiple Twitch streams at once with STREAMYYY. Free multistream viewer supporting 16 simultaneous streams, custom layouts, and mobile support.',
  keywords: 'multitwitch, multi twitch, multitwitch.tv, multitwitch alternative, watch multiple twitch streams, twitch multistream, multi twitch viewer',
  alternates: {
    canonical: 'https://streamyyy.com/multitwitch',
  },
  openGraph: {
    title: 'MultiTwitch Alternative - Watch Multiple Streams | STREAMYYY',
    description: 'The best MultiTwitch.tv alternative. Watch up to 16 Twitch streams simultaneously with better performance and more features.',
    url: 'https://streamyyy.com/multitwitch',
  },
}

export default function MultiTwitchPage() {
  // Redirect to home page with multitwitch query param for tracking
  redirect('/?ref=multitwitch')
}