import type { Stream } from '@/types/stream'

// Feature flag to enable/disable sponsored streams
export const SPONSORED_STREAMS_ENABLED = false // Set to true to enable sponsored streams

export interface SponsoredStream {
  id: string
  channelName: string
  platform: 'twitch' | 'youtube' | 'rumble'
  channelId?: string
  isSponsored: true
  priority: number
  placement: 'fixed' | 'rotating'
  position?: number // For fixed placement
}

// Configuration for sponsored streams
// DISABLED: Set to empty array to disable sponsored streams feature
export const SPONSORED_STREAMS: SponsoredStream[] = [
  // Disabled for now - uncomment to re-enable:
  // {
  //   id: 'sponsored_24fpslive',
  //   channelName: '24fpslive',
  //   platform: 'twitch',
  //   isSponsored: true,
  //   priority: 1,
  //   placement: 'fixed',
  //   position: 0 // Always in top-left position
  // }
]

// Get the current sponsored stream to display
export const getCurrentSponsoredStream = (): SponsoredStream | null => {
  // Check if sponsored streams are enabled
  if (!SPONSORED_STREAMS_ENABLED) {
    return null
  }
  
  // For now, return the first sponsored stream
  // In the future, this could implement rotation logic
  return SPONSORED_STREAMS[0] || null
}

// Convert sponsored stream to regular stream format for display
export const createSponsoredStreamObject = (sponsoredStream: SponsoredStream): Stream => {
  try {
    const now = new Date()
    return {
      id: sponsoredStream.id,
      channelName: sponsoredStream.channelName,
      platform: sponsoredStream.platform,
      ...(sponsoredStream.channelId && { channelId: sponsoredStream.channelId }),
      quality: 'auto',
      volume: 50, // Default volume
      position: sponsoredStream.position || 0,
      isActive: true,
      createdAt: now,
      lastUpdated: now,
      isSponsored: true // Add this property to identify sponsored streams
    }
  } catch (error) {
    console.error('Error creating sponsored stream object:', error)
    throw error
  }
}

// Inject sponsored stream into the stream array
export const injectSponsoredStream = (userStreams: Stream[]): Stream[] => {
  try {
    // Early return if sponsored streams are disabled
    if (!SPONSORED_STREAMS_ENABLED) {
      return userStreams
    }
    
    const sponsoredStream = getCurrentSponsoredStream()
    
    // Only inject if there are user streams and sponsored stream exists
    if (!sponsoredStream || userStreams.length === 0) {
      return userStreams
    }
    
    // Validate userStreams is actually an array
    if (!Array.isArray(userStreams)) {
      console.warn('injectSponsoredStream: userStreams is not an array', userStreams)
      return []
    }
    
    const sponsoredStreamObj = createSponsoredStreamObject(sponsoredStream)
  
  // Handle placement strategy
  if (sponsoredStream.placement === 'fixed') {
    // Fixed placement - insert at specified position
    const position = sponsoredStream.position || 0
    
    // Create new array with updated positions (avoiding mutation)
    const adjustedStreams = userStreams.map((stream, index) => ({
      ...stream,
      position: index >= position ? index + 1 : stream.position
    }))
    
    // Insert sponsored stream at fixed position
    adjustedStreams.splice(position, 0, sponsoredStreamObj)
    return adjustedStreams
  } else if (sponsoredStream.placement === 'rotating') {
    // Rotating placement - insert at different positions based on user stream count
    const rotationPosition = userStreams.length % 4 // Rotate through first 4 positions
    
    // Create new array with updated positions (avoiding mutation)
    const adjustedStreams = userStreams.map((stream, index) => ({
      ...stream,
      position: index >= rotationPosition ? index + 1 : stream.position
    }))
    
    // Insert sponsored stream at rotation position
    adjustedStreams.splice(rotationPosition, 0, sponsoredStreamObj)
    return adjustedStreams
  }
  
    return userStreams
  } catch (error) {
    console.error('Error in injectSponsoredStream:', error)
    return userStreams // Return original streams on error
  }
}

// Check if a stream is sponsored
export const isSponsoredStream = (streamId: string): boolean => {
  return SPONSORED_STREAMS.some(stream => stream.id === streamId)
}

// Filter out sponsored streams from user streams
export const filterSponsoredStreams = (streams: Stream[]): Stream[] => {
  return streams.filter(stream => !isSponsoredStream(stream.id))
}

// Get the count of user streams (excluding sponsored)
export const getUserStreamCount = (streams: Stream[]): number => {
  return filterSponsoredStreams(streams).length
}