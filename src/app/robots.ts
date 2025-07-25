import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/private/',
          '/api/debug*',
          '/api/test*',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/profile/',
          '/sign-in/',
          '/sign-up/',
          '/test-*',
          '/sentry-*',
          '/*.json$',
          '/layouts/',
          '/favorites/',
          '/chat/',
          '/compliance/',
          '/cookies/',
          '/dmca/',
          '/privacy/',
          '/terms/',
          '/feedback/',
          '/amp-summer/',
          '/advertise/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/private/',
          '/api/debug*',
          '/api/test*',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/profile/',
          '/sign-in/',
          '/sign-up/',
          '/test-*',
          '/sentry-*',
          '/*.json$',
          '/layouts/',
          '/favorites/',
          '/chat/',
          '/compliance/',
          '/cookies/',
          '/dmca/',
          '/privacy/',
          '/terms/',
          '/feedback/',
          '/amp-summer/',
          '/advertise/',
        ],
      },
    ],
    sitemap: 'https://streamyyy.com/sitemap.xml',
    host: 'https://streamyyy.com',
  }
}