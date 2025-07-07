'use client'

import React from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/contexts/LanguageContext'
import { languages } from '@/hooks/useLanguage'

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, isLoaded } = useTranslation()
  
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)

    // Show a success notification for language change
    const languageName = languages.find(l => l.code === languageCode)?.name

    // Create a success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>🌍</span>
        <span>Language changed to ${languageName}</span>
      </div>
    `
    document.body.appendChild(notification)

    // Remove notification after 2 seconds
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }

  const current = getCurrentLanguage()

  // Don't render until language preference is loaded
  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
        <Globe className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline mr-1">{current.flag}</span>
          <span className="hidden md:inline">{current.name}</span>
          <span className="md:hidden">{current.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${
              currentLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLanguage === language.code && (
              <span className="text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
