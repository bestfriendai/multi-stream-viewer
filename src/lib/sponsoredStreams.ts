import type { Stream } from '@/types/stream'

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
export const SPONSORED_STREAMS: SponsoredStream[] = [
  {
    id: 'sponsored_24fpslive',
    channelName: '24fpslive',
    platform: 'twitch',
    isSponsored: true,
    priority: 1,
    placement: 'fixed',
    position: 0 // Always in top-left position
  }
]

// Get the current sponsored stream to display
export const getCurrentSponsoredStream = (): SponsoredStream | null => {
  // For now, return the first sponsored stream
  // In the future, this could implement rotation logic
  return SPONSORED_STREAMS[0] || null
}

// Convert sponsored stream to regular stream format for display
export const createSponsoredStreamObject = (sponsoredStream: SponsoredStream): Stream => {
  const now = new Date()
  return {
    id: sponsoredStream.id,
    channelName: sponsoredStream.channelName,
    platform: sponsoredStream.platform,
    ...(sponsoredStream.channelId && { channelId: sponsoredStream.channelId }),
    quality: 'auto',
    volume: 50, // Default volume
    muted: true, // Start muted
    position: sponsoredStream.position || 0,
    isActive: true,
    createdAt: now,
    lastUpdated: now,
    isSponsored: true // Add this property to identify sponsored streams
  }
}

// Inject sponsored stream into the stream array
export const injectSponsoredStream = (userStreams: Stream[]): Stream[] => {
  const sponsoredStream = getCurrentSponsoredStream()
  
  // Only inject if there are user streams and sponsored stream exists
  if (!sponsoredStream || userStreams.length === 0) {
    return userStreams
  }
  
  const sponsoredStreamObj = createSponsoredStreamObject(sponsoredStream)
  
  // Handle placement strategy
  if (sponsoredStream.placement === 'fixed') {
    // Fixed placement - insert at specified position
    const position = sponsoredStream.position || 0
    const result = [...userStreams]
    
    // Adjust positions of existing streams
    result.forEach((stream, index) => {
      if (index >= position) {
        stream.position = index + 1
      }
    })
    
    // Insert sponsored stream at fixed position
    result.splice(position, 0, sponsoredStreamObj)
    return result
  } else if (sponsoredStream.placement === 'rotating') {
    // Rotating placement - insert at different positions based on user stream count
    const rotationPosition = userStreams.length % 4 // Rotate through first 4 positions
    const result = [...userStreams]
    
    // Adjust positions of existing streams
    result.forEach((stream, index) => {
      if (index >= rotationPosition) {
        stream.position = index + 1
      }
    })
    
    // Insert sponsored stream at rotation position
    result.splice(rotationPosition, 0, sponsoredStreamObj)
    return result
  }
  
  return userStreams
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