/**
 * MuteManager - Centralized mute control system
 * Handles all platform-specific mute operations without triggering re-renders
 */

import * as React from 'react'

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
  private muteEnforcementInterval: NodeJS.Timeout | null = null
  
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

      // Start mute enforcement for better ad handling
      this.startMuteEnforcement()
    }
  }

  // Start periodic mute enforcement to handle ad state changes
  private startMuteEnforcement() {
    if (this.muteEnforcementInterval) return

    this.muteEnforcementInterval = setInterval(() => {
      this.enforceMuteStates()
    }, 2000) // Check every 2 seconds
  }

  // Enforce current mute states on all players
  private enforceMuteStates() {
    // First, ensure only one stream is unmuted
    this.enforceOnlyOneUnmuted()

    // Then enforce mute states on all players
    this.muteStates.forEach((muted, streamId) => {
      if (muted) { // Only enforce muted state to avoid unmuting accidentally
        const player = this.playerRefs.get(streamId)
        if (player && player.platform === 'twitch') {
          try {
            if (player.ref?.setMuted) {
              player.ref.setMuted(true)
            }
            if (player.ref?.setVolume) {
              player.ref.setVolume(0)
            }
          } catch (error) {
            // Silently handle enforcement errors
          }
        }
      }
    })
  }

  // Stop mute enforcement
  private stopMuteEnforcement() {
    if (this.muteEnforcementInterval) {
      clearInterval(this.muteEnforcementInterval)
      this.muteEnforcementInterval = null
    }
  }

  
  // Register a player reference for a stream
  registerPlayer(streamId: string, playerRef: PlayerRef, platform: string) {
    this.playerRefs.set(streamId, { ref: playerRef, platform })

    // Ensure only one stream is unmuted when registering new players
    this.enforceOnlyOneUnmuted()

    // Apply current mute state if exists
    const currentMuted = this.getMuteState(streamId)
    this.applyMuteToPlayer(streamId, currentMuted, platform, playerRef)

    // Set up platform-specific event listeners for state changes
    if (platform === 'twitch' && playerRef?.addEventListener) {
      this.setupTwitchEventListeners(streamId, playerRef)
    }

    // Double-check mute state after a short delay to handle race conditions
    setTimeout(() => {
      const finalMuted = this.getMuteState(streamId)
      this.applyMuteToPlayer(streamId, finalMuted, platform, playerRef)
    }, 100)
  }

  // Setup Twitch player event listeners for better mute control
  private setupTwitchEventListeners(streamId: string, playerRef: any) {
    if (!playerRef?.addEventListener) return

    try {
      // Listen for ad events and re-apply mute state
      if (typeof window !== 'undefined' && window.Twitch?.Player) {
        // Ad start event
        playerRef.addEventListener(window.Twitch.Player.PLAY, () => {
          const currentMuted = this.getMuteState(streamId)
          // Always re-apply our mute state to override any native control changes
          setTimeout(() => {
            this.applyMuteToPlayer(streamId, currentMuted, 'twitch', playerRef)
          }, 100)
        })

        // Video ready event (after ads)
        playerRef.addEventListener(window.Twitch.Player.READY, () => {
          const currentMuted = this.getMuteState(streamId)
          this.applyMuteToPlayer(streamId, currentMuted, 'twitch', playerRef)
        })

        // Online/offline state changes
        playerRef.addEventListener(window.Twitch.Player.ONLINE, () => {
          const currentMuted = this.getMuteState(streamId)
          this.applyMuteToPlayer(streamId, currentMuted, 'twitch', playerRef)
        })

        // Listen for any volume/mute changes from native controls and override them
        if (playerRef.addEventListener) {
          // Override any native mute state changes
          const originalSetMuted = playerRef.setMuted
          if (originalSetMuted) {
            playerRef.setMuted = (muted: boolean) => {
              // Only allow our mute manager to control mute state
              const ourMuteState = this.getMuteState(streamId)
              originalSetMuted.call(playerRef, ourMuteState)
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to setup Twitch event listeners:', error)
    }
  }
  
  // Unregister player on cleanup
  unregisterPlayer(streamId: string) {
    this.playerRefs.delete(streamId)

    // Stop enforcement if no players remain
    if (this.playerRefs.size === 0 && this.muteEnforcementInterval) {
      clearInterval(this.muteEnforcementInterval)
      this.muteEnforcementInterval = null
    }
  }
  
  // Get mute state for a stream
  getMuteState(streamId: string): boolean {
    return this.muteStates.get(streamId) ?? true // Default to muted
  }

  // Force all streams to be muted except one
  setOnlyUnmuted(streamId: string) {
    // Mute all streams first
    this.muteStates.forEach((_, id) => {
      if (id !== streamId) {
        this.muteStates.set(id, true)
        this.applyMuteToStream(id, true)
        this.notifyListeners(id, true)
      }
    })

    // Unmute the target stream
    this.muteStates.set(streamId, false)
    this.applyMuteToStream(streamId, false)
    this.notifyListeners(streamId, false)

    // Save states
    this.saveStates()
  }

  // Ensure only one stream is unmuted at any time
  enforceOnlyOneUnmuted() {
    const unmutedStreams = Array.from(this.muteStates.entries())
      .filter(([_, muted]) => !muted)
      .map(([id, _]) => id)

    if (unmutedStreams.length > 1) {
      // Keep the first unmuted stream, mute the rest
      const keepUnmuted = unmutedStreams[0]
      unmutedStreams.slice(1).forEach(streamId => {
        this.muteStates.set(streamId, true)
        this.applyMuteToStream(streamId, true)
        this.notifyListeners(streamId, true)
      })
      this.saveStates()
    }
  }
  
  // Toggle mute for a stream
  toggleMute(streamId: string): boolean {
    const currentMuted = this.getMuteState(streamId)
    const newMuted = !currentMuted

    if (!newMuted) {
      // If unmuting, use the dedicated method to ensure only this stream is unmuted
      this.setOnlyUnmuted(streamId)
    } else {
      // If muting, just mute this stream
      this.muteStates.set(streamId, true)
      this.applyMuteToStream(streamId, true)

      // Add immediate enforcement for muted streams to handle ad states
      setTimeout(() => {
        this.applyMuteToStream(streamId, true)
      }, 100)
      setTimeout(() => {
        this.applyMuteToStream(streamId, true)
      }, 500)

      this.notifyListeners(streamId, true)
      this.saveStates()
    }

    // Always enforce only one unmuted stream
    setTimeout(() => {
      this.enforceOnlyOneUnmuted()
    }, 50)

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
  
  // Twitch mute control with enhanced ad state handling
  private muteTwitchPlayer(playerRef: any, muted: boolean) {
    if (!playerRef?.setMuted) return

    try {
      // Primary mute control
      playerRef.setMuted(muted)

      // Enhanced volume control for ad states and commercial breaks
      if (playerRef.setVolume) {
        if (muted) {
          playerRef.setVolume(0)
        } else {
          // Restore to reasonable volume when unmuting
          playerRef.setVolume(0.5)
        }
      }

      // Force mute state with retry mechanism for ad transitions
      if (muted) {
        // Use setTimeout to re-apply mute after potential ad state changes
        setTimeout(() => {
          try {
            if (playerRef.setMuted) {
              playerRef.setMuted(true)
            }
            if (playerRef.setVolume) {
              playerRef.setVolume(0)
            }
          } catch (retryError) {
            console.warn('Twitch mute retry failed:', retryError)
          }
        }, 100)

        // Additional retry for stubborn ad states
        setTimeout(() => {
          try {
            if (playerRef.setMuted) {
              playerRef.setMuted(true)
            }
            if (playerRef.setVolume) {
              playerRef.setVolume(0)
            }
          } catch (retryError) {
            console.warn('Twitch mute second retry failed:', retryError)
          }
        }, 500)
      }

    } catch (error) {
      console.error('Twitch mute/volume control error:', error)
      // Fallback: try just the basic mute with retries
      this.retryTwitchMute(playerRef, muted, 3)
    }
  }

  // Retry mechanism for stubborn Twitch mute states
  private retryTwitchMute(playerRef: any, muted: boolean, retries: number) {
    if (retries <= 0 || !playerRef?.setMuted) return

    try {
      playerRef.setMuted(muted)
      if (muted && playerRef.setVolume) {
        playerRef.setVolume(0)
      }
    } catch (error) {
      console.warn(`Twitch mute retry ${4 - retries} failed:`, error)
      setTimeout(() => {
        this.retryTwitchMute(playerRef, muted, retries - 1)
      }, 200 * (4 - retries)) // Exponential backoff
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

  // Debug method to log current state
  debugState() {
    console.log('=== MuteManager Debug State ===')
    console.log('Mute States:', this.getAllStates())
    console.log('Registered Players:', Array.from(this.playerRefs.keys()))
    console.log('Unmuted Streams:', Array.from(this.muteStates.entries())
      .filter(([_, muted]) => !muted)
      .map(([id, _]) => id))
    console.log('===============================')
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

