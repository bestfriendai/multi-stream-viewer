export const config = {
  // App Information
  appName: 'Multi-Stream Viewer',
  appVersion: '1.0.0',
  bundleId: 'com.multistreamviewer.app',
  
  // Legal URLs (Required by Apple)
  privacyPolicyUrl: 'https://multistreamviewer.com/privacy',
  termsOfServiceUrl: 'https://multistreamviewer.com/terms',
  supportUrl: 'https://multistreamviewer.com/support',
  
  // Age Rating
  minimumAge: 13, // Required for streaming content
  contentRating: '12+', // Apple's age rating
  
  // API Endpoints (Replace with your actual endpoints)
  api: {
    baseUrl: 'https://api.multistreamviewer.com',
    timeout: 30000,
  },
  
  // Third-party Services
  // Note: API keys only needed if implementing stream discovery
  // For basic viewing, embed URLs work without authentication
  services: {
    twitch: {
      embedUrl: 'https://player.twitch.tv',
    },
    youtube: {
      embedUrl: 'https://www.youtube.com/embed',
    },
    kick: {
      embedUrl: 'https://kick.com',
    },
  },
  
  // In-App Purchases (if applicable)
  iap: {
    premiumMonthly: 'com.multistreamviewer.premium.monthly',
    premiumYearly: 'com.multistreamviewer.premium.yearly',
  },
  
  // Content Guidelines
  contentGuidelines: {
    maxStreamsSimultaneous: 9, // Reasonable limit for performance
    minStreamQuality: '360p',
    maxStreamQuality: '1080p',
    defaultQuality: 'auto',
  },
  
  // Data Collection (Must match App Store Connect privacy labels)
  dataCollection: {
    collectsAnalytics: true,
    collectsIdentifiers: false,
    collectsCrashData: true,
    sharesDataWithThirdParties: false,
  },
  
  // Feature Flags
  features: {
    chatEnabled: true,
    recordingEnabled: false, // Disabled by default for copyright reasons
    screenshotEnabled: false, // Disabled to respect content creators
    downloadEnabled: false, // Disabled for copyright compliance
  },
};