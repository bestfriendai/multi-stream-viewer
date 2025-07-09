'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

// Create the context
const LanguageContext = createContext<{
  t: (key: string, params?: Record<string, any> | string) => string
  currentLanguage: string
  changeLanguage: (languageCode: string) => Promise<void>
  isLoaded: boolean
  updateTrigger: number
} | null>(null)

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const languageHook = useLanguage()
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Listen for language changes and force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      setUpdateTrigger(prev => prev + 1)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => window.removeEventListener('languageChanged', handleLanguageChange)
  }, [])

  // Also trigger updates when the language hook's state changes
  useEffect(() => {
    setUpdateTrigger(prev => prev + 1)
  }, [languageHook.currentLanguage, languageHook.isLoaded])

  // Show loading screen until translations are loaded
  if (!languageHook.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading translations...</p>
        </div>
      </div>
    )
  }

  return (
    <LanguageContext.Provider value={{ ...languageHook, updateTrigger }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use the language context
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  
  // Return the context, the updateTrigger ensures components re-render when language changes
  return {
    t: context.t,
    currentLanguage: context.currentLanguage,
    changeLanguage: context.changeLanguage,
    isLoaded: context.isLoaded
  }
}