/**
 * SEO Configuration for Streamyyy.com
 * Centralized SEO metadata and configuration
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: any;
}

export const defaultSEO: SEOConfig = {
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

export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: 'Streamyyy.com - Ultimate Multi-Stream Viewer',
    description: 'Watch multiple live streams simultaneously with Streamyyy.com. The ultimate platform for stream aggregation and multi-stream viewing experience.',
    keywords: ['multi-stream viewer', 'live streaming', 'stream aggregation', 'streamyyy'],
    canonical: 'https://streamyyy.com/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Streamyyy.com',
      description: 'Ultimate multi-stream viewing platform',
      url: 'https://streamyyy.com',
      applicationCategory: 'EntertainmentApplication'
    }
  },
  
  browse: {
    title: 'Browse Live Streams - Streamyyy.com',
    description: 'Discover and browse thousands of live streams across multiple platforms. Find gaming, music, sports, and entertainment streams all in one place.',
    keywords: ['browse streams', 'live streams', 'discover streams', 'stream directory'],
    canonical: 'https://streamyyy.com/browse'
  },
  
  multiView: {
    title: 'Multi-View Streaming - Watch Multiple Streams - Streamyyy.com',
    description: 'Watch up to 4 live streams simultaneously with our advanced multi-view interface. Perfect for comparing streams or following multiple events.',
    keywords: ['multi-view', 'multiple streams', 'concurrent viewing', 'stream comparison'],
    canonical: 'https://streamyyy.com/multi-view'
  },
  
  categories: {
    title: 'Stream Categories - Streamyyy.com',
    description: 'Explore live streams by category including Gaming, Music, Sports, Entertainment, and more. Find exactly what you want to watch.',
    keywords: ['stream categories', 'gaming streams', 'music streams', 'sports streams'],
    canonical: 'https://streamyyy.com/categories'
  },
  
  gaming: {
    title: 'Gaming Live Streams - Streamyyy.com',
    description: 'Watch the best gaming live streams from Twitch, YouTube, and other platforms. Follow your favorite games and streamers.',
    keywords: ['gaming streams', 'twitch gaming', 'game streaming', 'esports'],
    canonical: 'https://streamyyy.com/categories/gaming'
  },
  
  music: {
    title: 'Music Live Streams - Streamyyy.com',
    description: 'Discover live music streams, concerts, DJ sets, and musical performances from around the world.',
    keywords: ['music streams', 'live music', 'concerts', 'dj streams'],
    canonical: 'https://streamyyy.com/categories/music'
  },
  
  sports: {
    title: 'Sports Live Streams - Streamyyy.com',
    description: 'Watch live sports streams, matches, and sporting events from multiple sources in one convenient location.',
    keywords: ['sports streams', 'live sports', 'sports events', 'match streaming'],
    canonical: 'https://streamyyy.com/categories/sports'
  },
  
  favorites: {
    title: 'My Favorite Streams - Streamyyy.com',
    description: 'Access your favorite live streams and streamers quickly. Personalized dashboard for your preferred content.',
    keywords: ['favorite streams', 'bookmarked streams', 'personal dashboard'],
    canonical: 'https://streamyyy.com/favorites',
    noindex: true // Personal page, don't index
  },
  
  settings: {
    title: 'Settings - Streamyyy.com',
    description: 'Customize your Streamyyy.com experience with personalized settings and preferences.',
    keywords: ['settings', 'preferences', 'customization'],
    canonical: 'https://streamyyy.com/settings',
    noindex: true // Settings page, don't index
  }
};

export const brandInfo = {
  name: 'Streamyyy.com',
  shortName: 'Streamyyy',
  tagline: 'Ultimate Multi-Stream Viewer',
  description: 'The ultimate platform for stream aggregation and multi-stream viewing experience',
  url: 'https://streamyyy.com',
  logo: 'https://streamyyy.com/assets/logo.png',
  icon: 'https://streamyyy.com/assets/icon.png',
  themeColor: '#6366f1',
  backgroundColor: '#0a0a0a',
  twitterHandle: '@streamyyy',
  email: 'support@streamyyy.com'
};

export const socialLinks = {
  twitter: 'https://twitter.com/streamyyy',
  github: 'https://github.com/streamyyy',
  discord: 'https://discord.gg/streamyyy',
  reddit: 'https://reddit.com/r/streamyyy'
};

/**
 * Generate structured data for a page
 */
export function generateStructuredData(pageKey: string, additionalData?: any) {
  const basePage = pageSEO[pageKey] || defaultSEO;
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: basePage.title,
    description: basePage.description,
    url: basePage.canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: brandInfo.name,
      url: brandInfo.url
    },
    publisher: {
      '@type': 'Organization',
      name: brandInfo.name,
      logo: brandInfo.logo
    }
  };
  
  return {
    ...baseStructuredData,
    ...basePage.structuredData,
    ...additionalData
  };
}

/**
 * Get SEO config for a specific page
 */
export function getSEOConfig(pageKey: string, overrides?: Partial<SEOConfig>): SEOConfig {
  const basePage = pageSEO[pageKey] || defaultSEO;
  
  return {
    ...basePage,
    ...overrides
  };
}
