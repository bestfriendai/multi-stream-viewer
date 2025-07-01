// Stream status checking service
// Note: In production, you'd want to implement proper API keys and rate limiting

interface StreamStatus {
  isLive: boolean
  viewerCount?: number
  title?: string
  game?: string
}

// Popular streamers by category
export const POPULAR_STREAMERS = {
  gaming: [
    // Top Gaming Streamers
    { name: 'xqc', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'kai_cenat', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'summit1g', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'shroud', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'nickmercs', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'timthetatman', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'lirik', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'ninja', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'tfue', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'pokimane', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'sodapoppin', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'forsen', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'moonmoon', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'mizkif', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'nmplol', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'asmongold', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'moistcr1tikal', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'sykkuno', platform: 'twitch' as const, category: 'Gaming' },
    { name: 'valkyrae', platform: 'youtube' as const, category: 'Gaming' },
    { name: 'disguisedtoast', platform: 'twitch' as const, category: 'Gaming' },
  ],
  justChatting: [
    // IRL & Just Chatting
    { name: 'hasanabi', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'amouranth', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'zackrawrr', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'alinity', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'jinnytty', platform: 'twitch' as const, category: 'IRL' },
    { name: 'jakenbake', platform: 'twitch' as const, category: 'IRL' },
    { name: 'botezlive', platform: 'twitch' as const, category: 'Chess' },
    { name: 'qtcinderella', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'maya', platform: 'twitch' as const, category: 'Just Chatting' },
    { name: 'emiru', platform: 'twitch' as const, category: 'Just Chatting' },
  ],
  esports: [
    // Esports
    { name: 'esl_csgo', platform: 'twitch' as const, category: 'Esports' },
    { name: 'riotgames', platform: 'twitch' as const, category: 'Esports' },
    { name: 'overwatchleague', platform: 'twitch' as const, category: 'Esports' },
    { name: 'lec', platform: 'twitch' as const, category: 'Esports' },
    { name: 'valorant', platform: 'twitch' as const, category: 'Esports' },
    { name: 'rainbow6', platform: 'twitch' as const, category: 'Esports' },
    { name: 'rocketleague', platform: 'twitch' as const, category: 'Esports' },
    { name: 'callofduty', platform: 'twitch' as const, category: 'Esports' },
    { name: 'eleaguetv', platform: 'twitch' as const, category: 'Esports' },
    { name: 'dreamhackcs', platform: 'twitch' as const, category: 'Esports' },
  ],
  creative: [
    // Creative & Music
    { name: 'bobross', platform: 'twitch' as const, category: 'Art' },
    { name: 'monstercat', platform: 'twitch' as const, category: 'Music' },
    { name: 'a_couple_streams', platform: 'twitch' as const, category: 'Music' },
    { name: 'kennyhoppus', platform: 'twitch' as const, category: 'Music' },
    { name: 'lara6683', platform: 'twitch' as const, category: 'Music' },
    { name: 'djtechlive', platform: 'twitch' as const, category: 'Music' },
    { name: 'kaicenat', platform: 'twitch' as const, category: 'Creative' },
  ],
  sports: [
    // Sports & Fitness
    { name: 'nba', platform: 'twitch' as const, category: 'Sports' },
    { name: 'nfl', platform: 'twitch' as const, category: 'Sports' },
    { name: 'primevideo', platform: 'twitch' as const, category: 'Sports' },
    { name: 'espn', platform: 'twitch' as const, category: 'Sports' },
  ],
  vtubers: [
    // VTubers
    { name: 'ironmouse', platform: 'twitch' as const, category: 'VTuber' },
    { name: 'shylily', platform: 'twitch' as const, category: 'VTuber' },
    { name: 'zentreya', platform: 'twitch' as const, category: 'VTuber' },
    { name: 'nyanners', platform: 'twitch' as const, category: 'VTuber' },
    { name: 'veibae', platform: 'twitch' as const, category: 'VTuber' },
    { name: 'silvervale', platform: 'twitch' as const, category: 'VTuber' },
  ]
}

// Combine all streamers
export const ALL_STREAMERS = [
  ...POPULAR_STREAMERS.gaming,
  ...POPULAR_STREAMERS.justChatting,
  ...POPULAR_STREAMERS.esports,
  ...POPULAR_STREAMERS.creative,
  ...POPULAR_STREAMERS.sports,
  ...POPULAR_STREAMERS.vtubers,
]

// Mock function to check if stream is live
// In production, this would make actual API calls to Twitch/YouTube APIs
export async function checkStreamStatus(streamerName: string, platform: 'twitch' | 'youtube'): Promise<StreamStatus> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock data - in production, use real APIs
  // More realistic live status based on typical streaming patterns
  const alwaysLive = ['esl_csgo', 'riotgames', 'monstercat', 'bobross']
  const usuallyLive = ['xqc', 'kai_cenat', 'hasanabi', 'pokimane', 'summit1g', 'lirik', 'shroud', 'asmongold']
  const sometimesLive = ['ninja', 'timthetatman', 'nickmercs', 'tfue', 'mizkif', 'sodapoppin']
  
  let isLive = false
  const lowerName = streamerName.toLowerCase()
  
  if (alwaysLive.includes(lowerName)) {
    isLive = true
  } else if (usuallyLive.includes(lowerName)) {
    isLive = Math.random() > 0.2 // 80% chance
  } else if (sometimesLive.includes(lowerName)) {
    isLive = Math.random() > 0.5 // 50% chance
  } else {
    isLive = Math.random() > 0.7 // 30% chance for others
  }
  
  if (!isLive) {
    return { isLive: false }
  }
  
  // Generate realistic viewer counts based on streamer popularity
  const popularStreamers = ['xqc', 'kai_cenat', 'hasanabi', 'pokimane', 'ninja', 'shroud', 'summit1g']
  const isPopular = popularStreamers.includes(lowerName)
  
  const viewerCount = isPopular 
    ? Math.floor(Math.random() * 100000) + 20000 // 20k-120k viewers
    : Math.floor(Math.random() * 50000) + 1000   // 1k-51k viewers
  
  // Add some variety to game/category
  const games = ['Just Chatting', 'Fortnite', 'League of Legends', 'Valorant', 'GTA V', 'Minecraft', 'CS:GO 2']
  const game = games[Math.floor(Math.random() * games.length)]
  
  return {
    isLive: true,
    viewerCount,
    title: `${game || 'Gaming'} - Chill Stream`, // Would come from API
    game: game || 'Gaming'
  }
}

// Batch check multiple streams
export async function checkMultipleStreams(
  streamers: Array<{ name: string; platform: 'twitch' | 'youtube' }>
): Promise<Map<string, StreamStatus>> {
  const results = new Map<string, StreamStatus>()
  
  // In production, you'd want to batch these API calls
  await Promise.all(
    streamers.map(async (streamer) => {
      const status = await checkStreamStatus(streamer.name, streamer.platform)
      results.set(`${streamer.platform}:${streamer.name}`, status)
    })
  )
  
  return results
}

// Format viewer count for display
export function formatViewerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}