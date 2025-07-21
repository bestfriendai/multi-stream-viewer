import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://streamyyy.com'
  const currentDate = new Date().toISOString()

  // Core pages with high priority
  const corePages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // SEO landing pages with high priority
  const seoPages = [
    {
      url: `${baseUrl}/multi-stream-viewer`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/multitwitch`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/watch-multiple-streams`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/watch-multiple-twitch-streams`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Blog pages
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-cameras-for-streaming-2025`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/best-streaming-platforms-2025-complete-comparison`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/complete-streaming-setup-guide-2025`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/grow-your-stream-2025-proven-strategies`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/grow-your-stream-proven-strategies`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-start-streaming-2025`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/how-to-watch-multiple-streams`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/multitwitch-vs-streamyyy-comparison`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/streaming-monetization-complete-guide-2025`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/streaming-monetization-guide`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/streaming-setup-ultimate-guide`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/twitch-ad-blocker-not-working-2025`,
      lastModified: '2025-01-15T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/watch-multiple-twitch-streams-mobile`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Comparison pages
  const comparisonPages = [
    {
      url: `${baseUrl}/vs/multitwitch`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vs/twitchtheater`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vs/multistre-am`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Feature and guide pages
  const featurePages = [
    {
      url: `${baseUrl}/guide/watching-multiple-streams`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-to-watch-multiple-streams`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-to-watch-multiple-twitch-streams-mobile`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mobile-multi-stream-viewer`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/multitwitch-alternative`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/twitch-multistream`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/twitch-ad-blocker`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/watch-twitch-no-ads`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Legal and support pages
  const legalPages = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca-policy`,
      lastModified: '2024-12-01T00:00:00.000Z',
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]

  return [
    ...corePages,
    ...seoPages,
    ...blogPages,
    ...comparisonPages,
    ...featurePages,
    ...legalPages,
  ]
}