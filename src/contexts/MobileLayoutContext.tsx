'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type ViewMode = 'stack' | 'carousel' | 'grid' | 'focus' | 'swipe'

interface MobileLayoutContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  currentStreamIndex: number
  setCurrentStreamIndex: (index: number) => void
}

const MobileLayoutContext = createContext<MobileLayoutContextType | null>(null)

export function useMobileLayout() {
  const context = useContext(MobileLayoutContext)
  if (!context) {
    // Return default values instead of throwing during SSR
    return {
      viewMode: 'stack' as ViewMode,
      setViewMode: () => {},
      currentStreamIndex: 0,
      setCurrentStreamIndex: () => {}
    }
  }
  return context
}

interface MobileLayoutProviderProps {
  children: ReactNode
}

export function MobileLayoutProvider({ children }: MobileLayoutProviderProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('stack')
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)

  return (
    <MobileLayoutContext.Provider value={{
      viewMode,
      setViewMode,
      currentStreamIndex,
      setCurrentStreamIndex
    }}>
      {children}
    </MobileLayoutContext.Provider>
  )
}