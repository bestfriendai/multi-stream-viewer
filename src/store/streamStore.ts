import { create } from 'zustand'
import { parseStreamInput } from '@/lib/streamParser'

export type Platform = 'twitch' | 'youtube' | 'rumble'

export interface Stream {
  id: string
  channelName: string
  platform: Platform
  channelId?: string // For YouTube video IDs
  quality: 'auto' | '160p' | '360p' | '480p' | '720p' | '1080p'
  volume: number
  muted: boolean
  position: number
  isActive: boolean
}

export type GridLayout = '1x1' | '2x1' | '2x2' | '3x3' | '4x4' | 'custom' | 'grid-2x2' | 'grid-3x3' | 'grid-4x4' | 'mosaic' | 'pip'

interface StreamStore {
  streams: Stream[]
  activeStreamId: string | null
  gridLayout: GridLayout
  primaryStreamId: string | null
  
  addStream: (input: string) => boolean
  removeStream: (streamId: string) => void
  setStreamQuality: (streamId: string, quality: Stream['quality']) => void
  setStreamVolume: (streamId: string, volume: number) => void
  toggleStreamMute: (streamId: string) => void
  setActiveStream: (streamId: string) => void
  setPrimaryStream: (streamId: string) => void
  setGridLayout: (layout: GridLayout) => void
  reorderStreams: (streams: Stream[]) => void
  clearAllStreams: () => void
}

const calculateNextPosition = (streams: Stream[]): number => {
  return streams.length
}

export const useStreamStore = create<StreamStore>((set, get) => ({
  streams: [],
  activeStreamId: null,
  gridLayout: '2x2',
  primaryStreamId: null,
  
  addStream: (input) => {
    const parsed = parseStreamInput(input)
    if (!parsed) return false
    
    const state = get()
    const newStream: Stream = {
      id: `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channelName: parsed.channelName,
      platform: parsed.platform,
      channelId: parsed.channelId,
      quality: 'auto',
      volume: 100,
      muted: state.streams.length > 0, // Auto-mute non-primary streams
      position: calculateNextPosition(state.streams),
      isActive: true
    }
    
    set((state) => ({
      streams: [...state.streams, newStream],
      primaryStreamId: state.primaryStreamId || newStream.id
    }))
    
    return true
  },
  
  removeStream: (streamId) => set((state) => ({
    streams: state.streams.filter(s => s.id !== streamId),
    activeStreamId: state.activeStreamId === streamId ? null : state.activeStreamId,
    primaryStreamId: state.primaryStreamId === streamId 
      ? state.streams.find(s => s.id !== streamId)?.id || null
      : state.primaryStreamId
  })),
  
  setStreamQuality: (streamId, quality) => set((state) => ({
    streams: state.streams.map(s => 
      s.id === streamId ? { ...s, quality } : s
    )
  })),
  
  setStreamVolume: (streamId, volume) => set((state) => ({
    streams: state.streams.map(s => 
      s.id === streamId ? { ...s, volume } : s
    )
  })),
  
  toggleStreamMute: (streamId) => set((state) => ({
    streams: state.streams.map(s => 
      s.id === streamId ? { ...s, muted: !s.muted } : s
    )
  })),
  
  setActiveStream: (streamId) => set({ activeStreamId: streamId }),
  
  setPrimaryStream: (streamId) => set((state) => ({
    primaryStreamId: streamId,
    streams: state.streams.map(s => ({
      ...s,
      muted: s.id !== streamId // Mute all streams except primary
    }))
  })),
  
  setGridLayout: (layout) => set({ gridLayout: layout }),
  
  reorderStreams: (streams) => set({ streams }),
  
  clearAllStreams: () => set({ 
    streams: [], 
    activeStreamId: null,
    primaryStreamId: null 
  })
}))