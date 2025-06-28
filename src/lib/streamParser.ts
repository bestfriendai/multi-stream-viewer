import { Platform } from '@/store/streamStore'

export interface ParsedStream {
  platform: Platform
  channelName: string
  channelId?: string
}

export function parseStreamInput(input: string): ParsedStream | null {
  const trimmedInput = input.trim()
  
  // YouTube patterns
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)\/live/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)\/live/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([a-zA-Z0-9_-]+)\/live/
  ]
  
  // Twitch patterns
  const twitchPatterns = [
    /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)\/?$/,
    /^([a-zA-Z0-9_]+)$/ // Just username
  ]
  
  // Rumble patterns
  const rumblePatterns = [
    /(?:https?:\/\/)?(?:www\.)?rumble\.com\/v([a-zA-Z0-9]+)-/,
    /(?:https?:\/\/)?(?:www\.)?rumble\.com\/embed\/([a-zA-Z0-9]+)/,
    /(?:https?:\/\/)?(?:www\.)?rumble\.com\/([a-zA-Z0-9_-]+)\/?$/
  ]
  
  // Check YouTube
  for (const pattern of youtubePatterns) {
    const match = trimmedInput.match(pattern)
    if (match) {
      return {
        platform: 'youtube',
        channelName: match[1],
        channelId: match[1]
      }
    }
  }
  
  // Check Rumble
  for (const pattern of rumblePatterns) {
    const match = trimmedInput.match(pattern)
    if (match) {
      return {
        platform: 'rumble',
        channelName: match[1],
        channelId: match[1]
      }
    }
  }
  
  // Check Twitch (this should be last as it has the most permissive pattern)
  for (const pattern of twitchPatterns) {
    const match = trimmedInput.match(pattern)
    if (match) {
      return {
        platform: 'twitch',
        channelName: match[1]
      }
    }
  }
  
  return null
}