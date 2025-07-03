/**
 * Haptic feedback utilities for mobile app-like experience
 */

interface HapticPattern {
  duration: number
  intensity?: number
}

export class HapticFeedback {
  private static isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  /**
   * Light tap feedback for buttons and UI interactions
   */
  static light() {
    if (this.isSupported) {
      navigator.vibrate(10)
    }
  }

  /**
   * Medium impact feedback for selection and toggle actions
   */
  static medium() {
    if (this.isSupported) {
      navigator.vibrate(20)
    }
  }

  /**
   * Heavy impact feedback for significant actions
   */
  static heavy() {
    if (this.isSupported) {
      navigator.vibrate(30)
    }
  }

  /**
   * Success feedback pattern
   */
  static success() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10])
    }
  }

  /**
   * Error feedback pattern
   */
  static error() {
    if (this.isSupported) {
      navigator.vibrate([100, 50, 100])
    }
  }

  /**
   * Selection feedback (like iOS scroll wheel)
   */
  static selection() {
    if (this.isSupported) {
      navigator.vibrate(5)
    }
  }

  /**
   * Notification feedback
   */
  static notification() {
    if (this.isSupported) {
      navigator.vibrate([50, 30, 50, 30, 50])
    }
  }

  /**
   * Custom vibration pattern
   */
  static custom(pattern: number | number[]) {
    if (this.isSupported) {
      navigator.vibrate(pattern)
    }
  }

  /**
   * Check if haptics are supported
   */
  static get supported() {
    return this.isSupported
  }
}

// Convenience exports
export const haptic = HapticFeedback
export default HapticFeedback