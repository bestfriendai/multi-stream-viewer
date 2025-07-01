'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  Ear, 
  Keyboard, 
  MousePointer, 
  Accessibility,
  Settings
} from 'lucide-react'

interface AccessibilityOptions {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
  autoplay: boolean
  captions: boolean
}

export default function AccessibilitySettings() {
  const [options, setOptions] = useState<AccessibilityOptions>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    autoplay: true,
    captions: false,
  })

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accessibility-settings')
      if (saved) {
        setOptions(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error)
    }

    // Detect system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOptions(prev => ({ ...prev, reducedMotion: true }))
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setOptions(prev => ({ ...prev, highContrast: true }))
    }
  }, [])

  // Save settings to localStorage and apply to document
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(options))
    } catch (error) {
      console.error('Failed to save accessibility settings:', error)
    }

    // Apply settings to document
    const root = document.documentElement

    // Reduced motion
    root.style.setProperty(
      '--animation-duration', 
      options.reducedMotion ? '0s' : '0.3s'
    )
    
    // High contrast
    if (options.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (options.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Screen reader optimized
    if (options.screenReaderOptimized) {
      root.classList.add('sr-optimized')
    } else {
      root.classList.remove('sr-optimized')
    }

    // Keyboard navigation
    if (options.keyboardNavigation) {
      root.classList.add('keyboard-nav')
    } else {
      root.classList.remove('keyboard-nav')
    }
  }, [options])

  const updateOption = (key: keyof AccessibilityOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize the app to better suit your accessibility needs and preferences.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Visual Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" />
            <h3 className="font-medium">Visual</h3>
          </div>
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduced-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={options.reducedMotion}
                onCheckedChange={(checked) => updateOption('reducedMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-sm text-muted-foreground">
                  Increase color contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={options.highContrast}
                onCheckedChange={(checked) => updateOption('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-text">Large Text</Label>
                <p className="text-sm text-muted-foreground">
                  Increase text size throughout the app
                </p>
              </div>
              <Switch
                id="large-text"
                checked={options.largeText}
                onCheckedChange={(checked) => updateOption('largeText', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Audio Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ear className="w-4 h-4" />
            <h3 className="font-medium">Audio</h3>
          </div>
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoplay">Autoplay Streams</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play audio when streams load
                </p>
              </div>
              <Switch
                id="autoplay"
                checked={options.autoplay}
                onCheckedChange={(checked) => updateOption('autoplay', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="captions">Prefer Captions</Label>
                <p className="text-sm text-muted-foreground">
                  Enable captions when available
                </p>
              </div>
              <Switch
                id="captions"
                checked={options.captions}
                onCheckedChange={(checked) => updateOption('captions', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Keyboard className="w-4 h-4" />
            <h3 className="font-medium">Navigation</h3>
          </div>
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
                <p className="text-sm text-muted-foreground">
                  Improve focus indicators and keyboard shortcuts
                </p>
              </div>
              <Switch
                id="keyboard-nav"
                checked={options.keyboardNavigation}
                onCheckedChange={(checked) => updateOption('keyboardNavigation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
                <p className="text-sm text-muted-foreground">
                  Optimize for screen readers and assistive technology
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={options.screenReaderOptimized}
                onCheckedChange={(checked) => updateOption('screenReaderOptimized', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">These settings are saved locally and will persist across sessions.</p>
          <p>For additional accessibility features, please check your operating system settings.</p>
        </div>
      </CardContent>
    </Card>
  )
}