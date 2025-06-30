/**
 * Stream URL utilities
 * Generate embed URLs without requiring API keys
 */

export const getEmbedUrl = (platform: string, channelName: string): string => {
  switch (platform) {
    case 'twitch':
      // Twitch embed works without API key
      return `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname || 'localhost'}&muted=false`;
    
    case 'youtube':
      // YouTube live embed works without API key
      // For channels: youtube.com/c/CHANNELNAME/live
      // For direct streams: youtube.com/watch?v=VIDEO_ID
      if (channelName.includes('watch?v=')) {
        const videoId = channelName.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      // For channel live streams
      return `https://www.youtube.com/embed/live_stream?channel=${channelName}&autoplay=1`;
    
    case 'kick':
      // Kick embed
      return `https://kick.com/${channelName}/embed`;
    
    default:
      // Custom URL - return as is
      return channelName;
  }
};

export const extractChannelFromUrl = (url: string): { platform: string; channelName: string } | null => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Twitch
    if (hostname.includes('twitch.tv')) {
      const channelName = urlObj.pathname.split('/')[1];
      return { platform: 'twitch', channelName };
    }
    
    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      // Handle different YouTube URL formats
      if (urlObj.pathname.includes('/channel/')) {
        const channelId = urlObj.pathname.split('/channel/')[1].split('/')[0];
        return { platform: 'youtube', channelName: channelId };
      }
      if (urlObj.pathname.includes('/c/')) {
        const channelName = urlObj.pathname.split('/c/')[1].split('/')[0];
        return { platform: 'youtube', channelName };
      }
      if (urlObj.pathname.includes('/@')) {
        const channelName = urlObj.pathname.split('/@')[1].split('/')[0];
        return { platform: 'youtube', channelName };
      }
      if (urlObj.searchParams.get('v')) {
        return { platform: 'youtube', channelName: url };
      }
    }
    
    // Kick
    if (hostname.includes('kick.com')) {
      const channelName = urlObj.pathname.split('/')[1];
      return { platform: 'kick', channelName };
    }
    
    return null;
  } catch {
    return null;
  }
};

export const validateStreamUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};