'use client'

import { useTranslation } from '@/contexts/LanguageContext'
import { useEffect } from 'react'

export default function DynamicLang() {
  const { currentLanguage, isLoaded } = useTranslation()

  useEffect(() => {
    if (isLoaded && currentLanguage) {
      // Update the HTML lang attribute dynamically
      document.documentElement.lang = currentLanguage
    }
  }, [currentLanguage, isLoaded])

  return null
}