import { Stream } from '@/store/streamStore'

export function generateShareableLink(streams: Stream[], gridLayout: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  const streamParams = streams.map(stream => {
    if (stream.platform === 'twitch') {
      return stream.channelName
    } else {
      return `${stream.platform}:${stream.channelId || stream.channelName}`
    }
  }).join(',')
  
  const params = new URLSearchParams({
    streams: streamParams,
    layout: gridLayout
  })
  
  return `${baseUrl}?${params.toString()}`
}

export function parseShareableLink(url: string): { streams: string[], layout: string } | null {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    
    const streams = params.get('streams')
    const layout = params.get('layout')
    
    if (!streams) return null
    
    return {
      streams: streams.split(',').filter(Boolean),
      layout: layout || '2x2'
    }
  } catch {
    return null
  }
}

export function loadFromQueryParams() {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  const streams = params.get('streams')
  const layout = params.get('layout')
  
  if (!streams) return null
  
  return {
    streams: streams.split(',').filter(Boolean),
    layout: layout || '2x2'
  }
}