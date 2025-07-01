import type { Stream } from '@/types/stream'

export interface SavedLayout {
  id: string
  name: string
  streams: {
    channelName: string
    platform: string
    channelId?: string
  }[]
  gridLayout: string
  createdAt: number
}

const STORAGE_KEY = 'multi-stream-layouts'

export function getSavedLayouts(): SavedLayout[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveLayout(name: string, streams: Stream[], gridLayout: string): SavedLayout {
  const layouts = getSavedLayouts()
  
  const newLayout: SavedLayout = {
    id: `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    streams: streams.map(s => ({
      channelName: s.channelName,
      platform: s.platform,
      ...(s.channelId && { channelId: s.channelId })
    })),
    gridLayout,
    createdAt: Date.now()
  }
  
  layouts.push(newLayout)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
  
  return newLayout
}

export function deleteLayout(layoutId: string) {
  const layouts = getSavedLayouts()
  const filtered = layouts.filter(l => l.id !== layoutId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function updateLayout(layoutId: string, updates: Partial<SavedLayout>) {
  const layouts = getSavedLayouts()
  const index = layouts.findIndex(l => l.id === layoutId)
  
  if (index !== -1) {
    const currentLayout = layouts[index]
    if (currentLayout) {
      layouts[index] = { ...currentLayout, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
    }
  }
}

// Default presets
export const DEFAULT_PRESETS: SavedLayout[] = [
  {
    id: 'preset-gaming',
    name: 'Gaming Mix',
    streams: [
      { channelName: 'shroud', platform: 'twitch' },
      { channelName: 'summit1g', platform: 'twitch' },
      { channelName: 'lirik', platform: 'twitch' },
      { channelName: 'timthetatman', platform: 'twitch' }
    ],
    gridLayout: '2x2',
    createdAt: 0
  },
  {
    id: 'preset-esports',
    name: 'Esports Central',
    streams: [
      { channelName: 'esl_csgo', platform: 'twitch' },
      { channelName: 'riotgames', platform: 'twitch' },
      { channelName: 'overwatchleague', platform: 'twitch' }
    ],
    gridLayout: '3x3',
    createdAt: 0
  }
]