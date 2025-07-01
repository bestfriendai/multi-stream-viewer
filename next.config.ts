import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable modern React features
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clips-media-assets2.twitch.tv',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vod-secure.twitch.tv',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
        pathname: '/**',
      },
    ],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Bundle analyzer for production builds
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // Enable strict mode for better performance
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking for type safety
  },
};

export default nextConfig;
