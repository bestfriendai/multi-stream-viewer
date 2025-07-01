// Demo data generator for better user experience

export function generateMockAnalyticsData() {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  const oneDay = 24 * oneHour
  
  // Generate streaming history for the past week
  const streamingHistory = []
  const streamers = ['xqc', 'kai_cenat', 'pokimane', 'shroud', 'ninja', 'ludwig', 'hasanabi', 'mizkif']
  
  for (let day = 0; day < 7; day++) {
    const dayStart = now - (day * oneDay)
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1 // 1-3 sessions per day
    
    for (let session = 0; session < sessionsPerDay; session++) {
      const startTime = dayStart - Math.floor(Math.random() * 20 * oneHour) // Random time in day
      const duration = (Math.random() * 3 + 0.5) * oneHour // 30min to 3.5 hours
      const endTime = startTime + duration
      
      const streamer = streamers[Math.floor(Math.random() * streamers.length)]
      
      streamingHistory.push({
        streamerId: streamer,
        startTime,
        endTime,
        platform: 'twitch'
      })
    }
  }
  
  // Calculate total watch time
  const totalWatchTime = streamingHistory.reduce((sum, session) => 
    sum + (session.endTime - session.startTime), 0
  )
  
  // Generate favorite streamers based on watch time
  const favoriteStreamers: Record<string, number> = {}
  streamingHistory.forEach(session => {
    if (session.streamerId) {
      const watchTime = session.endTime - session.startTime
      favoriteStreamers[session.streamerId] = (favoriteStreamers[session.streamerId] || 0) + watchTime
    }
  })
  
  // Generate peak viewing hours
  const peakViewingHours = new Array(24).fill(0)
  streamingHistory.forEach(session => {
    const startHour = new Date(session.startTime).getHours()
    const endHour = new Date(session.endTime).getHours()
    
    for (let hour = startHour; hour <= endHour; hour++) {
      peakViewingHours[hour % 24] += 1
    }
  })
  
  return {
    totalWatchTime,
    favoriteStreamers,
    peakViewingHours,
    streamingHistory,
    categoryBreakdown: {
      'Gaming': 45,
      'Just Chatting': 25,
      'IRL': 15,
      'Music': 10,
      'Art': 5
    }
  }
}

export function generateMockScheduledStreams() {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  const oneDay = 24 * oneHour
  
  return [
    {
      id: '1',
      streamerId: 'xqc',
      platform: 'twitch',
      scheduledTime: now + 2 * oneHour, // 2 hours from now
      recurring: false,
      enabled: true
    },
    {
      id: '2',
      streamerId: 'kai_cenat',
      platform: 'twitch',
      scheduledTime: now + oneDay, // Tomorrow
      recurring: true,
      recurrencePattern: 'Mon,Wed,Fri',
      enabled: true
    },
    {
      id: '3',
      streamerId: 'pokimane',
      platform: 'twitch',
      scheduledTime: now + 3 * oneDay, // 3 days from now
      recurring: false,
      enabled: true
    }
  ]
}

export function initializeDemoData() {
  if (typeof window === 'undefined') return
  
  const hasInitialized = localStorage.getItem('demo-data-initialized')
  if (hasInitialized) return
  
  // Only initialize once
  localStorage.setItem('demo-data-initialized', 'true')
  
  // This would ideally be called from the store initialization
  console.log('Demo data initialized')
}