'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMobileDetection } from '@/hooks/useMobileDetection'

interface MobileState {
  // Device detection
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  
  // Mobile UI state
  showMobileNav: boolean
  mobileViewMode: 'stack' | 'grid' | 'carousel' | 'focus'
  showMobileControls: boolean
  currentStreamIndex: number
  
  // Mobile settings
  enableGestures: boolean
  enableHaptics: boolean
  enablePullToRefresh: boolean
  
  // Performance settings
  enableVirtualization: boolean
  reducedMotion: boolean
}

interface MobileActions {
  // UI actions
  setShowMobileNav: (show: boolean) => void
  setMobileViewMode: (mode: MobileState['mobileViewMode']) => void
  setShowMobileControls: (show: boolean) => void
  setCurrentStreamIndex: (index: number) => void
  
  // Settings actions
  setEnableGestures: (enabled: boolean) => void
  setEnableHaptics: (enabled: boolean) => void
  setEnablePullToRefresh: (enabled: boolean) => void
  setEnableVirtualization: (enabled: boolean) => void
  
  // Utility actions
  toggleMobileNav: () => void
  resetMobileState: () => void
}

interface MobileContextValue extends MobileState, MobileActions {}

const defaultMobileState: MobileState = {
  // Device detection (will be overridden)
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  orientation: 'portrait',
  screenWidth: 0,
  screenHeight: 0,
  isTouchDevice: false,
  isIOS: false,
  isAndroid: false,
  isSafari: false,
  
  // Mobile UI state
  showMobileNav: true,
  mobileViewMode: 'stack',
  showMobileControls: true,
  currentStreamIndex: 0,
  
  // Mobile settings
  enableGestures: true,
  enableHaptics: true,
  enablePullToRefresh: false, // Disabled by default to prevent issues
  
  // Performance settings
  enableVirtualization: false, // Disabled by default for simplicity
  reducedMotion: false
}

const MobileContext = createContext<MobileContextValue | undefined>(undefined)

interface MobileProviderProps {
  children: ReactNode
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const deviceInfo = useMobileDetection()
  const [mobileState, setMobileState] = useState<Omit<MobileState, keyof typeof deviceInfo>>(
    () => {
      // Load from localStorage if available
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('mobile-app-state')
          if (saved) {
            const parsed = JSON.parse(saved)
            return { ...defaultMobileState, ...parsed }
          }
        } catch (error) {
          console.warn('Failed to load mobile state from localStorage:', error)
        }
      }
      return {
        showMobileNav: defaultMobileState.showMobileNav,
        mobileViewMode: defaultMobileState.mobileViewMode,
        showMobileControls: defaultMobileState.showMobileControls,
        currentStreamIndex: defaultMobileState.currentStreamIndex,
        enableGestures: defaultMobileState.enableGestures,
        enableHaptics: defaultMobileState.enableHaptics,
        enablePullToRefresh: defaultMobileState.enablePullToRefresh,
        enableVirtualization: defaultMobileState.enableVirtualization,
        reducedMotion: defaultMobileState.reducedMotion
      }
    }
  )

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setMobileState(prev => ({
        ...prev,
        reducedMotion: mediaQuery.matches
      }))

      const handleChange = (e: MediaQueryListEvent) => {
        setMobileState(prev => ({
          ...prev,
          reducedMotion: e.matches
        }))
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mobile-app-state', JSON.stringify(mobileState))
      } catch (error) {
        console.warn('Failed to save mobile state to localStorage:', error)
      }
    }
  }, [mobileState])

  // Create actions
  const actions: MobileActions = {
    setShowMobileNav: (show: boolean) => 
      setMobileState(prev => ({ ...prev, showMobileNav: show })),
    
    setMobileViewMode: (mode: MobileState['mobileViewMode']) => 
      setMobileState(prev => ({ ...prev, mobileViewMode: mode })),
    
    setShowMobileControls: (show: boolean) => 
      setMobileState(prev => ({ ...prev, showMobileControls: show })),
    
    setCurrentStreamIndex: (index: number) => 
      setMobileState(prev => ({ ...prev, currentStreamIndex: index })),
    
    setEnableGestures: (enabled: boolean) => 
      setMobileState(prev => ({ ...prev, enableGestures: enabled })),
    
    setEnableHaptics: (enabled: boolean) => 
      setMobileState(prev => ({ ...prev, enableHaptics: enabled })),
    
    setEnablePullToRefresh: (enabled: boolean) => 
      setMobileState(prev => ({ ...prev, enablePullToRefresh: enabled })),
    
    setEnableVirtualization: (enabled: boolean) => 
      setMobileState(prev => ({ ...prev, enableVirtualization: enabled })),
    
    toggleMobileNav: () => 
      setMobileState(prev => ({ ...prev, showMobileNav: !prev.showMobileNav })),
    
    resetMobileState: () => 
      setMobileState({
        showMobileNav: defaultMobileState.showMobileNav,
        mobileViewMode: defaultMobileState.mobileViewMode,
        showMobileControls: defaultMobileState.showMobileControls,
        currentStreamIndex: defaultMobileState.currentStreamIndex,
        enableGestures: defaultMobileState.enableGestures,
        enableHaptics: defaultMobileState.enableHaptics,
        enablePullToRefresh: defaultMobileState.enablePullToRefresh,
        enableVirtualization: defaultMobileState.enableVirtualization,
        reducedMotion: mobileState.reducedMotion // Keep current reduced motion setting
      })
  }

  const contextValue: MobileContextValue = {
    ...deviceInfo,
    ...mobileState,
    ...actions
  }

  return (
    <MobileContext.Provider value={contextValue}>
      {children}
    </MobileContext.Provider>
  )
}

export const useMobile = (): MobileContextValue => {
  const context = useContext(MobileContext)
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider')
  }
  return context
}

// Convenience hooks for specific mobile features
export const useMobileDevice = () => {
  const { isMobile, isTablet, isDesktop, orientation, isTouchDevice, isIOS, isAndroid, isSafari } = useMobile()
  return { isMobile, isTablet, isDesktop, orientation, isTouchDevice, isIOS, isAndroid, isSafari }
}

export const useMobileUI = () => {
  const { 
    showMobileNav, 
    mobileViewMode, 
    showMobileControls, 
    currentStreamIndex,
    setShowMobileNav,
    setMobileViewMode,
    setShowMobileControls,
    setCurrentStreamIndex,
    toggleMobileNav
  } = useMobile()
  
  return {
    showMobileNav,
    mobileViewMode,
    showMobileControls,
    currentStreamIndex,
    setShowMobileNav,
    setMobileViewMode,
    setShowMobileControls,
    setCurrentStreamIndex,
    toggleMobileNav
  }
}

export const useMobileSettings = () => {
  const {
    enableGestures,
    enableHaptics,
    enablePullToRefresh,
    enableVirtualization,
    reducedMotion,
    setEnableGestures,
    setEnableHaptics,
    setEnablePullToRefresh,
    setEnableVirtualization,
    resetMobileState
  } = useMobile()
  
  return {
    enableGestures,
    enableHaptics,
    enablePullToRefresh,
    enableVirtualization,
    reducedMotion,
    setEnableGestures,
    setEnableHaptics,
    setEnablePullToRefresh,
    setEnableVirtualization,
    resetMobileState
  }
}