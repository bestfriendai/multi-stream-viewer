'use client'

import { getTwitchProfileImage } from './twitchApi'

export interface EnhancedStreamData {
  channelName: string
  displayName: string
  avatarUrl: string
  platform: 'twitch' | 'youtube' | 'rumble'
  isLive: boolean
  viewerCount: number
  title: string
  category: string
}

// Enhance stream data with proper avatar URLs and metadata
export async function enhanceStreamData(
  channelName: string, 
  platform: 'twitch' | 'youtube' | 'rumble'
): Promise<EnhancedStreamData> {
  let avatarUrl = ''
  let displayName = channelName
  let isLive = true
  let viewerCount = Math.floor(Math.random() * 50000) + 1000 // Mock data
  let title = `${channelName} is live!`
  let category = 'Just Chatting'

  try {
    if (platform === 'twitch') {
      // Get actual Twitch profile image
      avatarUrl = await getTwitchProfileImage(channelName)
      
      // Try to get additional Twitch data
      const twitchData = await getTwitchStreamData(channelName)
      if (twitchData) {
        displayName = twitchData.display_name || channelName
        isLive = twitchData.is_live || false
        viewerCount = twitchData.viewer_count || viewerCount
        title = twitchData.title || title
        category = twitchData.game_name || category
      }
    } else if (platform === 'youtube') {
      // For YouTube, generate a fallback avatar
      avatarUrl = generatePlatformAvatar(channelName, 'youtube')
    } else if (platform === 'rumble') {
      // For Rumble, generate a fallback avatar
      avatarUrl = generatePlatformAvatar(channelName, 'rumble')
    }
  } catch (error) {
    console.warn(`Failed to enhance stream data for ${channelName}:`, error)
    // Use fallback avatar
    avatarUrl = generatePlatformAvatar(channelName, platform)
  }

  return {
    channelName,
    displayName,
    avatarUrl,
    platform,
    isLive,
    viewerCount,
    title,
    category
  }
}

// Get Twitch stream data from public APIs
async function getTwitchStreamData(channelName: string): Promise<any> {
  try {
    // Try using the IVR API for Twitch data
    const response = await fetch(`https://api.ivr.fi/v2/twitch/user/${channelName}`)
    
    if (response.ok) {
      const data = await response.json()
      return {
        display_name: data.displayName,
        is_live: data.live,
        viewer_count: data.viewCount,
        title: data.title,
        game_name: data.game
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch Twitch data for ${channelName}:`, error)
  }
  
  return null
}

// Generate platform-specific avatar
function generatePlatformAvatar(channelName: string, platform: string): string {
  const initials = channelName
    .split(/[\s_-]/)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  const platformColors = {
    twitch: '9146ff',
    youtube: 'ff0000',
    rumble: '85c742'
  }
  
  const bgColor = platformColors[platform as keyof typeof platformColors] || '6366f1'
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=300&bold=true&format=png`
}

// Batch enhance multiple streams
export async function enhanceMultipleStreams(
  streams: Array<{ channelName: string; platform: 'twitch' | 'youtube' | 'rumble' }>
): Promise<EnhancedStreamData[]> {
  const promises = streams.map(stream => 
    enhanceStreamData(stream.channelName, stream.platform)
  )
  
  return Promise.all(promises)
}
