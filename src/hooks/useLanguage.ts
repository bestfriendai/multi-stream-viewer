'use client'

import { useState, useEffect } from 'react'

// Translation type
type Translations = Record<string, any>

// Available translations
const translationCache: Record<string, Translations> = {}

export interface Language {
  code: string
  name: string
  flag: string
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

/**
 * Hook to manage language preferences
 * Currently returns English content but stores user preference for future i18n implementation
 */
export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')
  const [isLoaded, setIsLoaded] = useState(false)
  const [translations, setTranslations] = useState<Translations>({})

  // Load translations for a specific language
  const loadTranslations = async (languageCode: string): Promise<Translations> => {
    if (translationCache[languageCode]) {
      return translationCache[languageCode]
    }

    try {
      const response = await import(`../translations/${languageCode}.json`)
      const translations = response.default || response
      translationCache[languageCode] = translations
      return translations
    } catch (error) {
      console.warn(`Failed to load translations for ${languageCode}, falling back to English`)
      // Fallback to English if translation file doesn't exist
      if (languageCode !== 'en') {
        return loadTranslations('en')
      }
      return {}
    }
  }

  useEffect(() => {
    const initializeLanguage = async () => {
      // Load saved language preference from localStorage
      const savedLanguage = localStorage.getItem('preferred-language')
      const initialLanguage = (savedLanguage && languages.find(lang => lang.code === savedLanguage))
        ? savedLanguage
        : 'en'

      setCurrentLanguage(initialLanguage)

      // Load translations for the initial language
      const initialTranslations = await loadTranslations(initialLanguage)
      setTranslations(initialTranslations)
      setIsLoaded(true)
    }

    initializeLanguage()
  }, [])

  const changeLanguage = async (languageCode: string) => {
    if (!languages.find(lang => lang.code === languageCode)) {
      console.warn(`Language code "${languageCode}" not supported`)
      return
    }

    setCurrentLanguage(languageCode)
    localStorage.setItem('preferred-language', languageCode)

    // Set cookie for server-side detection
    document.cookie = `locale=${languageCode}; path=/; max-age=31536000; SameSite=Lax`

    // Load new translations
    const newTranslations = await loadTranslations(languageCode)
    setTranslations(newTranslations)

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: languageCode }
    }))
  }

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  // Translation function that looks up translations from loaded files
  const t = (key: string, fallback?: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return fallback || key
    }

    // Navigate through nested keys (e.g., "header.addStream")
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Key not found, return fallback or key
        return fallback || key
      }
    }

    return typeof value === 'string' ? value : (fallback || key)
  }

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    languages,
    isLoaded,
    t, // Translation function for future use
  }
}

/**
 * Get the user's preferred language from various sources
 * This can be used server-side or in components that need immediate access
 */
export function getPreferredLanguage(): string {
  if (typeof window === 'undefined') {
    // Server-side: could read from headers or cookies
    return 'en'
  }

  // Client-side: check localStorage first, then browser language
  const saved = localStorage.getItem('preferred-language')
  if (saved && languages.find(lang => lang.code === saved)) {
    return saved
  }

  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0]
  if (languages.find(lang => lang.code === browserLang)) {
    return browserLang
  }

  return 'en'
}
