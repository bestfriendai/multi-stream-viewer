/**
 * Stream Error Handler Utility
 * Provides centralized error handling for stream-related issues
 */

export interface StreamError {
  type: 'offline' | 'not_found' | 'network' | 'player' | 'unknown'
  message: string
  channelName: string
  platform: string
  timestamp: Date
}

export class StreamErrorHandler {
  private static errors: Map<string, StreamError> = new Map()
  private static listeners: ((error: StreamError) => void)[] = []

  /**
   * Register an error for a specific stream
   */
  static registerError(streamId: string, error: Partial<StreamError>) {
    const fullError: StreamError = {
      type: 'unknown',
      message: 'Unknown error occurred',
      channelName: 'Unknown',
      platform: 'unknown',
      timestamp: new Date(),
      ...error
    }

    this.errors.set(streamId, fullError)
    
    // Notify listeners
    this.listeners.forEach(listener => listener(fullError))
    
    // Log error for debugging
    console.warn(`Stream Error [${fullError.type}]:`, {
      channel: fullError.channelName,
      platform: fullError.platform,
      message: fullError.message,
      timestamp: fullError.timestamp
    })
  }

  /**
   * Get error for a specific stream
   */
  static getError(streamId: string): StreamError | undefined {
    return this.errors.get(streamId)
  }

  /**
   * Clear error for a specific stream
   */
  static clearError(streamId: string) {
    this.errors.delete(streamId)
  }

  /**
   * Check if a stream has an error
   */
  static hasError(streamId: string): boolean {
    return this.errors.has(streamId)
  }

  /**
   * Get all current errors
   */
  static getAllErrors(): StreamError[] {
    return Array.from(this.errors.values())
  }

  /**
   * Subscribe to error events
   */
  static onError(callback: (error: StreamError) => void) {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Parse Amazon IVS error and determine error type
   */
  static parseAmazonIVSError(errorMessage: string): StreamError['type'] {
    if (errorMessage.includes('404') || errorMessage.includes('Failed to load playlist')) {
      return 'offline'
    }
    if (errorMessage.includes('ErrorNotAvailable')) {
      return 'not_found'
    }
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return 'network'
    }
    return 'player'
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: StreamError): string {
    switch (error.type) {
      case 'offline':
        return `${error.channelName} is currently offline`
      case 'not_found':
        return `Stream ${error.channelName} not found`
      case 'network':
        return `Network error loading ${error.channelName}`
      case 'player':
        return `Player error for ${error.channelName}`
      default:
        return `Error loading ${error.channelName}`
    }
  }
}

/**
 * Hook for React components to use stream error handling
 */
export function useStreamError(streamId: string) {
  const error = StreamErrorHandler.getError(streamId)
  
  const registerError = (errorData: Partial<StreamError>) => {
    StreamErrorHandler.registerError(streamId, errorData)
  }
  
  const clearError = () => {
    StreamErrorHandler.clearError(streamId)
  }
  
  return {
    error,
    hasError: StreamErrorHandler.hasError(streamId),
    registerError,
    clearError,
    userFriendlyMessage: error ? StreamErrorHandler.getUserFriendlyMessage(error) : null
  }
}

