import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User preferences and settings
interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  audioMixerSettings: AudioMixerSettings
  breakReminders: boolean
  breakInterval: number // minutes
  dataHints: boolean
  incognitoMode: boolean
  parentalControls: ParentalControls
  language: string
}

interface AudioMixerSettings {
  masterVolume: number
  individualVolumes: Record<string, number>
  eq: Record<string, EQBand[]>
  compressor: boolean
  noiseSuppression: boolean
}

interface EQBand {
  frequency: number
  gain: number
  q: number
}

interface ParentalControls {
  enabled: boolean
  pin: string
  blockedCategories: string[]
  blockedStreamers: string[]
  maxStreamingHours: number
}

// Analytics data
interface AnalyticsData {
  totalWatchTime: number
  favoriteStreamers: Record<string, number>
  peakViewingHours: number[]
  streamingHistory: StreamingSession[]
  categoryBreakdown: Record<string, number>
}

interface StreamingSession {
  streamerId: string
  startTime: number
  endTime: number
  platform: string
}

// Premium features
interface PremiumFeatures {
  tier: 'basic' | 'pro' | 'studio'
  maxStreams: number
  features: string[]
  expiresAt: number | null
}

// Watch party
interface WatchParty {
  id: string
  name: string
  host: string
  participants: Participant[]
  streams: string[]
  isPublic: boolean
  voiceEnabled: boolean
  createdAt: number
}

interface Participant {
  id: string
  name: string
  avatar?: string
  isMuted: boolean
  reactions: Reaction[]
}

interface Reaction {
  emoji: string
  timestamp: number
  x: number
  y: number
}

// Stream scheduling
interface ScheduledStream {
  id: string
  streamerId: string
  platform: string
  scheduledTime: number
  recurring: boolean
  recurrencePattern?: string
  enabled: boolean
}

// App state store
interface AppState {
  // User
  user: {
    id: string | null
    username: string | null
    avatar?: string
    preferences: UserPreferences
    premium: PremiumFeatures
  }
  
  // Analytics
  analytics: AnalyticsData
  
  // Watch parties
  activeWatchParty: WatchParty | null
  watchParties: WatchParty[]
  
  // Scheduling
  scheduledStreams: ScheduledStream[]
  
  // Recording
  recordings: Recording[]
  isRecording: boolean
  recordingStreams: string[]
  
  // AI Features
  recommendations: StreamRecommendation[]
  highlights: Highlight[]
  
  // Actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  trackWatchTime: (streamerId: string, duration: number) => void
  createWatchParty: (party: Omit<WatchParty, 'id' | 'createdAt'>) => string
  joinWatchParty: (partyId: string, participant: Participant) => void
  leaveWatchParty: (partyId: string, participantId: string) => void
  scheduleStream: (stream: Omit<ScheduledStream, 'id'>) => void
  startRecording: (streamIds: string[]) => void
  stopRecording: () => void
  addReaction: (partyId: string, reaction: Reaction) => void
}

interface Recording {
  id: string
  streamIds: string[]
  startTime: number
  endTime?: number
  size: number
  url?: string
}

interface StreamRecommendation {
  streamerId: string
  platform: string
  score: number
  reason: string
}

interface Highlight {
  id: string
  streamIds: string[]
  timestamp: number
  duration: number
  type: 'clip' | 'moment' | 'reaction'
  description: string
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        id: null,
        username: null,
        preferences: {
          theme: 'system',
          audioMixerSettings: {
            masterVolume: 100,
            individualVolumes: {},
            eq: {},
            compressor: false,
            noiseSuppression: false
          },
          breakReminders: true,
          breakInterval: 60,
          dataHints: true,
          incognitoMode: false,
          parentalControls: {
            enabled: false,
            pin: '',
            blockedCategories: [],
            blockedStreamers: [],
            maxStreamingHours: 24
          },
          language: 'en'
        },
        premium: {
          tier: 'basic',
          maxStreams: 4,
          features: ['basic_layouts', 'saved_layouts'],
          expiresAt: null
        }
      },
      
      analytics: {
        totalWatchTime: 157800000, // 43.8 hours in milliseconds
        favoriteStreamers: {
          'xqc': 25,
          'kai_cenat': 18,
          'pokimane': 15,
          'shroud': 12
        },
        peakViewingHours: [2, 1, 0, 0, 0, 1, 2, 5, 8, 12, 15, 18, 22, 24, 26, 28, 32, 35, 38, 42, 35, 28, 18, 8],
        streamingHistory: [
          {
            streamerId: 'xqc',
            startTime: Date.now() - 7200000, // 2 hours ago
            endTime: Date.now() - 3600000,   // 1 hour ago
            platform: 'twitch'
          },
          {
            streamerId: 'kai_cenat',
            startTime: Date.now() - 86400000, // 1 day ago
            endTime: Date.now() - 82800000,   // 23 hours ago
            platform: 'twitch'
          },
          {
            streamerId: 'pokimane',
            startTime: Date.now() - 172800000, // 2 days ago
            endTime: Date.now() - 169200000,   // 47 hours ago
            platform: 'twitch'
          },
          {
            streamerId: 'shroud',
            startTime: Date.now() - 259200000, // 3 days ago
            endTime: Date.now() - 255600000,   // 71 hours ago
            platform: 'twitch'
          }
        ],
        categoryBreakdown: {
          'Gaming': 45,
          'Just Chatting': 25,
          'IRL': 15,
          'Music': 10,
          'Art': 5
        }
      },
      
      activeWatchParty: null,
      watchParties: [],
      scheduledStreams: [],
      recordings: [],
      isRecording: false,
      recordingStreams: [],
      recommendations: [],
      highlights: [],
      
      // Actions
      updatePreferences: (preferences) => set((state) => ({
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        }
      })),
      
      trackWatchTime: (streamerId, duration) => set((state) => {
        const hour = new Date().getHours()
        const newHistory = [...state.analytics.streamingHistory]
        const existingSession = newHistory[newHistory.length - 1]
        
        if (existingSession?.streamerId === streamerId && 
            Date.now() - existingSession.endTime < 60000) {
          existingSession.endTime = Date.now()
        } else {
          newHistory.push({
            streamerId,
            startTime: Date.now() - duration,
            endTime: Date.now(),
            platform: 'twitch'
          })
        }
        
        return {
          analytics: {
            ...state.analytics,
            totalWatchTime: state.analytics.totalWatchTime + duration,
            favoriteStreamers: {
              ...state.analytics.favoriteStreamers,
              [streamerId]: (state.analytics.favoriteStreamers[streamerId] || 0) + duration
            },
            peakViewingHours: state.analytics.peakViewingHours.map((count, i) => 
              i === hour ? count + 1 : count
            ),
            streamingHistory: newHistory.slice(-100) // Keep last 100 sessions
          }
        }
      }),
      
      createWatchParty: (party) => {
        const id = `party-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        set((state) => ({
          watchParties: [...state.watchParties, {
            ...party,
            id,
            createdAt: Date.now()
          }],
          activeWatchParty: {
            ...party,
            id,
            createdAt: Date.now()
          }
        }))
        return id
      },
      
      joinWatchParty: (partyId, participant) => set((state) => ({
        watchParties: state.watchParties.map(party =>
          party.id === partyId
            ? { ...party, participants: [...party.participants, participant] }
            : party
        ),
        activeWatchParty: state.activeWatchParty?.id === partyId
          ? { ...state.activeWatchParty, participants: [...state.activeWatchParty.participants, participant] }
          : state.activeWatchParty
      })),
      
      leaveWatchParty: (partyId, participantId) => set((state) => ({
        watchParties: state.watchParties.map(party =>
          party.id === partyId
            ? { ...party, participants: party.participants.filter(p => p.id !== participantId) }
            : party
        ),
        activeWatchParty: state.activeWatchParty?.id === partyId
          ? { ...state.activeWatchParty, participants: state.activeWatchParty.participants.filter(p => p.id !== participantId) }
          : state.activeWatchParty
      })),
      
      scheduleStream: (stream) => set((state) => ({
        scheduledStreams: [...state.scheduledStreams, {
          ...stream,
          id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]
      })),
      
      startRecording: (streamIds) => set({
        isRecording: true,
        recordingStreams: streamIds,
        recordings: [{
          id: `recording-${Date.now()}`,
          streamIds,
          startTime: Date.now(),
          size: 0
        }]
      }),
      
      stopRecording: () => set((state) => ({
        isRecording: false,
        recordingStreams: [],
        recordings: state.recordings.map((rec, idx) => 
          idx === state.recordings.length - 1
            ? { ...rec, endTime: Date.now() }
            : rec
        )
      })),
      
      addReaction: (partyId, reaction) => set((state) => ({
        watchParties: state.watchParties.map(party =>
          party.id === partyId
            ? {
                ...party,
                participants: party.participants.map(p =>
                  p.id === state.user.id
                    ? { ...p, reactions: [...p.reactions, reaction] }
                    : p
                )
              }
            : party
        )
      }))
    }),
    {
      name: 'multi-stream-app-storage',
      partialize: (state) => ({
        user: state.user,
        analytics: state.analytics,
        scheduledStreams: state.scheduledStreams
      })
    }
  )
)