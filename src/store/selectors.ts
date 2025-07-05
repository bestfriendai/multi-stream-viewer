import type { StreamStore } from '@/types/stream'

// Optimized selectors for Zustand store
// These prevent unnecessary re-renders by selecting only specific data

// Basic selectors
export const selectStreams = (state: StreamStore) => state.streams
export const selectActiveStreamId = (state: StreamStore) => state.activeStreamId
export const selectGridLayout = (state: StreamStore) => state.gridLayout
export const selectPrimaryStreamId = (state: StreamStore) => state.primaryStreamId
export const selectIsLoading = (state: StreamStore) => state.isLoading
export const selectError = (state: StreamStore) => state.error

// Derived selectors (computed values)
export const selectActiveStream = (state: StreamStore) => 
  state.streams.find(stream => stream.id === state.activeStreamId) || null

export const selectPrimaryStream = (state: StreamStore) =>
  state.streams.find(stream => stream.id === state.primaryStreamId) || null

export const selectStreamCount = (state: StreamStore) => state.streams.length

export const selectHasStreams = (state: StreamStore) => state.streams.length > 0

export const selectActiveStreams = (state: StreamStore) =>
  state.streams.filter(stream => stream.isActive)

export const selectMutedStreams = (state: StreamStore) => {
  if (typeof window === 'undefined') return []
  
  try {
    const { muteManager } = require('@/lib/muteManager')
    return state.streams.filter(stream => muteManager.getMuteState(stream.id))
  } catch {
    return []
  }
}

export const selectUnmutedStreams = (state: StreamStore) => {
  if (typeof window === 'undefined') return state.streams
  
  try {
    const { muteManager } = require('@/lib/muteManager')
    return state.streams.filter(stream => !muteManager.getMuteState(stream.id))
  } catch {
    return state.streams
  }
}

// Parametrized selectors (return functions)
export const selectStreamById = (id: string) => (state: StreamStore) =>
  state.streams.find(stream => stream.id === id) || null

export const selectStreamsByPlatform = (platform: string) => (state: StreamStore) =>
  state.streams.filter(stream => stream.platform === platform)

export const selectStreamIndex = (id: string) => (state: StreamStore) =>
  state.streams.findIndex(stream => stream.id === id)

// Complex selectors for performance
export const selectStreamIds = (state: StreamStore) =>
  state.streams.map(stream => stream.id)

export const selectStreamMetadata = (state: StreamStore) =>
  state.streams.map(stream => ({
    id: stream.id,
    channelName: stream.channelName,
    platform: stream.platform,
    isActive: stream.isActive
  }))

// Action selectors (for better organization)
export const selectStreamActions = (state: StreamStore) => ({
  addStream: state.addStream,
  removeStream: state.removeStream,
  setStreamQuality: state.setStreamQuality,
  setStreamVolume: state.setStreamVolume,
  toggleStreamMute: state.toggleStreamMute,
  setActiveStream: state.setActiveStream,
  setPrimaryStream: state.setPrimaryStream,
  setGridLayout: state.setGridLayout,
  reorderStreams: state.reorderStreams,
  clearAllStreams: state.clearAllStreams,
  setLoading: state.setLoading,
  setError: state.setError
})

// Layout-specific selectors
export const selectLayoutConfig = (state: StreamStore) => ({
  gridLayout: state.gridLayout,
  primaryStreamId: state.primaryStreamId,
  streamCount: state.streams.length
})

// Performance selectors (minimal data for UI updates)
export const selectStreamListForUI = (state: StreamStore) => {
  if (typeof window === 'undefined') {
    return state.streams.map(stream => ({
      id: stream.id,
      channelName: stream.channelName,
      platform: stream.platform,
      position: stream.position,
      muted: false,
      isActive: stream.isActive
    }))
  }
  
  try {
    const { muteManager } = require('@/lib/muteManager')
    return state.streams.map(stream => ({
      id: stream.id,
      channelName: stream.channelName,
      platform: stream.platform,
      position: stream.position,
      muted: muteManager.getMuteState(stream.id),
      isActive: stream.isActive
    }))
  } catch {
    return state.streams.map(stream => ({
      id: stream.id,
      channelName: stream.channelName,
      platform: stream.platform,
      position: stream.position,
      muted: false,
      isActive: stream.isActive
    }))
  }
}

// State validation selectors
export const selectIsValidState = (state: StreamStore) => ({
  hasValidActiveStream: !state.activeStreamId || 
    state.streams.some(s => s.id === state.activeStreamId),
  hasValidPrimaryStream: !state.primaryStreamId || 
    state.streams.some(s => s.id === state.primaryStreamId),
  streamsHaveUniqueIds: new Set(state.streams.map(s => s.id)).size === state.streams.length
})