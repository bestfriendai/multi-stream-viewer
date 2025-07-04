/**
 * MuteManager - Centralized mute control system
 * Handles all platform-specific mute operations without triggering re-renders
 */

type MuteState = Map<string, boolean>
type PlayerRef = any // Platform-specific player reference

interface MuteListener {
  streamId: string
  callback: (muted: boolean) => void
}

class MuteManager {
  private static instance: MuteManager
  private muteStates: MuteState = new Map()
  private playerRefs: Map<string, PlayerRef> = new Map()
  private listeners: MuteListener[] = []
  
  // Singleton pattern
  static getInstance(): MuteManager {
    if (!MuteManager.instance) {
      MuteManager.instance = new MuteManager()
    }
    return MuteManager.instance
  }
  
  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamMuteStates')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          Object.entries(parsed).forEach(([id, muted]) => {
            this.muteStates.set(id, muted as boolean)
          })
        } catch (e) {
          console.error('Failed to load mute states:', e)
        }
      }
    }
  }
  
  // Register a player reference for a stream
  registerPlayer(streamId: string, playerRef: PlayerRef, platform: string) {
    this.playerRefs.set(streamId, { ref: playerRef, platform })
    
    // Apply current mute state if exists
    const currentMuted = this.getMuteState(streamId)
    this.applyMuteToPlayer(streamId, currentMuted, platform, playerRef)
  }
  
  // Unregister player on cleanup
  unregisterPlayer(streamId: string) {
    this.playerRefs.delete(streamId)
  }
  
  // Get mute state for a stream
  getMuteState(streamId: string): boolean {
    return this.muteStates.get(streamId) ?? true // Default to muted
  }
  
  // Toggle mute for a stream
  toggleMute(streamId: string): boolean {
    const currentMuted = this.getMuteState(streamId)
    const newMuted = !currentMuted
    
    // Update state
    this.muteStates.set(streamId, newMuted)
    
    // If unmuting this stream, mute all others
    if (!newMuted) {
      this.muteStates.forEach((_, id) => {
        if (id !== streamId) {
          this.muteStates.set(id, true)
          this.applyMuteToStream(id, true)
          // Notify listeners for the muted streams
          this.notifyListeners(id, true)
        }
      })
    }
    
    // Apply to player
    this.applyMuteToStream(streamId, newMuted)
    
    // Notify listeners
    this.notifyListeners(streamId, newMuted)
    
    // Save to localStorage
    this.saveStates()
    
    return newMuted
  }
  
  // Apply mute state to a specific stream's player
  private applyMuteToStream(streamId: string, muted: boolean) {
    const player = this.playerRefs.get(streamId)
    if (!player) return
    
    this.applyMuteToPlayer(streamId, muted, player.platform, player.ref)
  }
  
  // Platform-specific mute application
  private applyMuteToPlayer(streamId: string, muted: boolean, platform: string, playerRef: any) {
    try {
      switch (platform) {
        case 'twitch':
          this.muteTwitchPlayer(playerRef, muted)
          break
        case 'youtube':
          this.muteYouTubePlayer(playerRef, muted)
          break
        case 'rumble':
          this.muteRumblePlayer(playerRef, muted)
          break
      }
    } catch (error) {
      console.error(`Failed to ${muted ? 'mute' : 'unmute'} ${platform} stream:`, error)
    }
  }
  
  // Twitch mute control
  private muteTwitchPlayer(playerRef: any, muted: boolean) {
    if (playerRef?.setMuted) {
      playerRef.setMuted(muted)
    }
  }
  
  // YouTube mute control with retry logic
  private muteYouTubePlayer(iframeOrPlayer: any, muted: boolean, retries = 3) {
    // If it's a YouTube player API object
    if (iframeOrPlayer?.mute && iframeOrPlayer?.unMute) {
      muted ? iframeOrPlayer.mute() : iframeOrPlayer.unMute()
      return
    }
    
    // If it's an iframe element
    if (iframeOrPlayer?.contentWindow) {
      const command = muted ? 'mute' : 'unMute'
      try {
        iframeOrPlayer.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        )
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => {
            this.muteYouTubePlayer(iframeOrPlayer, muted, retries - 1)
          }, 100 * (4 - retries)) // Exponential backoff
        }
      }
    }
  }
  
  // Rumble mute control (currently no API, relies on initial state)
  private muteRumblePlayer(playerRef: any, muted: boolean) {
    // Rumble doesn't provide a mute API yet
    console.log('Rumble mute state:', muted)
  }
  
  // Subscribe to mute state changes
  subscribe(streamId: string, callback: (muted: boolean) => void): () => void {
    const listener: MuteListener = { streamId, callback }
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
  
  // Notify listeners of mute state changes
  private notifyListeners(streamId: string, muted: boolean) {
    this.listeners
      .filter(l => l.streamId === streamId)
      .forEach(l => l.callback(muted))
  }
  
  // Save states to localStorage
  private saveStates() {
    if (typeof window === 'undefined') return
    
    const states: Record<string, boolean> = {}
    this.muteStates.forEach((muted, id) => {
      states[id] = muted
    })
    
    localStorage.setItem('streamMuteStates', JSON.stringify(states))
  }
  
  // Clear all mute states
  clearAll() {
    this.muteStates.clear()
    this.playerRefs.clear()
    this.listeners = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('streamMuteStates')
    }
  }
  
  // Get all current mute states (for debugging)
  getAllStates(): Record<string, boolean> {
    const states: Record<string, boolean> = {}
    this.muteStates.forEach((muted, id) => {
      states[id] = muted
    })
    return states
  }
}

// Export singleton instance
export const muteManager = MuteManager.getInstance()

// React hook for using mute state
export function useMuteState(streamId: string): [boolean, () => void] {
  const [muted, setMuted] = React.useState(() => muteManager.getMuteState(streamId))
  
  React.useEffect(() => {
    // Subscribe to changes
    const unsubscribe = muteManager.subscribe(streamId, setMuted)
    
    // Get current state
    setMuted(muteManager.getMuteState(streamId))
    
    return unsubscribe
  }, [streamId])
  
  const toggleMute = React.useCallback(() => {
    muteManager.toggleMute(streamId)
  }, [streamId])
  
  return [muted, toggleMute]
}

// Import React for the hook
import * as React from 'react'