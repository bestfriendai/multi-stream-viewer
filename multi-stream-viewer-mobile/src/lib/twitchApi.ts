// Twitch API integration for React Native
// Simplified version for mobile app

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  offline_image_url: string;
  description: string;
}

// Cache for profile images to avoid repeated API calls
const profileImageCache = new Map<string, string>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Get Twitch profile image for a username
export async function getTwitchProfileImage(username: string): Promise<string> {
  const normalizedUsername = username.toLowerCase();
  
  // Check cache first
  const cached = profileImageCache.get(normalizedUsername);
  const expiry = cacheExpiry.get(normalizedUsername);
  
  if (cached && expiry && Date.now() < expiry) {
    return cached;
  }

  try {
    // Method 1: Try the standard Twitch profile image URL pattern
    const standardUrl = `https://static-cdn.jtvnw.net/jtv_user_pictures/${normalizedUsername}-profile_image-300x300.png`;
    
    // Test if the image exists
    const imageExists = await checkImageExists(standardUrl);
    if (imageExists) {
      // Cache the result
      profileImageCache.set(normalizedUsername, standardUrl);
      cacheExpiry.set(normalizedUsername, Date.now() + CACHE_DURATION);
      return standardUrl;
    }

    // Method 2: Try alternative URL patterns
    const altPatterns = [
      `https://static-cdn.jtvnw.net/jtv_user_pictures/${normalizedUsername}-profile_image-300x300.jpeg`,
      `https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png`
    ];

    for (const pattern of altPatterns) {
      const exists = await checkImageExists(pattern);
      if (exists) {
        profileImageCache.set(normalizedUsername, pattern);
        cacheExpiry.set(normalizedUsername, Date.now() + CACHE_DURATION);
        return pattern;
      }
    }

    // Method 3: Use a proxy service to get the actual profile image
    const proxyUrl = await getTwitchImageViaProxy(normalizedUsername);
    if (proxyUrl) {
      profileImageCache.set(normalizedUsername, proxyUrl);
      cacheExpiry.set(normalizedUsername, Date.now() + CACHE_DURATION);
      return proxyUrl;
    }

  } catch (error) {
    console.warn(`Failed to fetch Twitch profile image for ${username}:`, error);
  }

  // Fallback: Generate a consistent avatar using UI Avatars
  const fallbackUrl = generateFallbackAvatar(username);
  profileImageCache.set(normalizedUsername, fallbackUrl);
  cacheExpiry.set(normalizedUsername, Date.now() + CACHE_DURATION);
  
  return fallbackUrl;
}

// Check if an image URL exists and is accessible
async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD'
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Use a proxy service to get Twitch profile images
async function getTwitchImageViaProxy(username: string): Promise<string | null> {
  try {
    // Using a public API that can fetch Twitch user data
    const response = await fetch(`https://api.ivr.fi/v2/twitch/user/${username}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.logo) {
        return data.logo;
      }
    }
  } catch (error) {
    console.warn(`Proxy fetch failed for ${username}:`, error);
  }
  
  return null;
}

// Generate a consistent fallback avatar
function generateFallbackAvatar(username: string): string {
  const initials = username
    .split(/[\s_-]/)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Use Twitch purple color for consistency
  const bgColor = '9146ff';
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=300&bold=true&format=png`;
}

// Preload profile images for better UX
export function preloadTwitchProfileImages(usernames: string[]): void {
  usernames.forEach(username => {
    // Don't await - just start the process
    getTwitchProfileImage(username).catch(() => {
      // Ignore errors in preloading
    });
  });
}

// Clear cache if needed
export function clearProfileImageCache(): void {
  profileImageCache.clear();
  cacheExpiry.clear();
}
