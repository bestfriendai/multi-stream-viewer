'use client'

import { useEffect, useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Keyboard, Command } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['Cmd', 'K'], description: 'Quick search / Add stream', category: 'Navigation' },
  { keys: ['Cmd', 'B'], description: 'Toggle chat sidebar', category: 'Navigation' },
  { keys: ['Cmd', 'D'], description: 'Open discovery panel', category: 'Navigation' },
  { keys: ['Escape'], description: 'Close dialogs/panels', category: 'Navigation' },
  
  // Stream Control
  { keys: ['Space'], description: 'Toggle mute on focused stream', category: 'Stream Control' },
  { keys: ['M'], description: 'Mute/unmute all streams', category: 'Stream Control' },
  { keys: ['F'], description: 'Toggle fullscreen on focused stream', category: 'Stream Control' },
  { keys: ['Cmd', 'Delete'], description: 'Remove focused stream', category: 'Stream Control' },
  
  // Layout
  { keys: ['1'], description: 'Switch to 1x1 layout', category: 'Layout' },
  { keys: ['2'], description: 'Switch to 2x2 layout', category: 'Layout' },
  { keys: ['3'], description: 'Switch to 3x3 layout', category: 'Layout' },
  { keys: ['4'], description: 'Switch to 4x4 layout', category: 'Layout' },
  { keys: ['P'], description: 'Toggle PiP mode', category: 'Layout' },
  
  // Quick Actions
  { keys: ['Cmd', 'A'], description: 'Add new stream', category: 'Quick Actions' },
  { keys: ['Cmd', 'S'], description: 'Share current setup', category: 'Quick Actions' },
  { keys: ['Cmd', 'R'], description: 'Refresh all streams', category: 'Quick Actions' },
  { keys: ['Cmd', 'Shift', 'X'], description: 'Clear all streams', category: 'Quick Actions' },
  
  // Accessibility
  { keys: ['Alt', 'A'], description: 'Open accessibility settings', category: 'Accessibility' },
  { keys: ['Alt', 'K'], description: 'Show keyboard shortcuts', category: 'Accessibility' },
  { keys: ['Tab'], description: 'Navigate between interactive elements', category: 'Accessibility' },
  { keys: ['Shift', 'Tab'], description: 'Navigate backwards', category: 'Accessibility' },
]

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const { addStream, clearAllStreams, setGridLayout, toggleStreamMute } = useStreamStore()
  const { trackFeatureUsage } = useAnalytics()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey, altKey } = event
      const cmdKey = metaKey || ctrlKey

      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Navigation shortcuts
      if (cmdKey && key === 'k') {
        event.preventDefault()
        trackFeatureUsage('keyboard_quick_search')
        // Focus search input or open add stream dialog
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      if (cmdKey && key === 'b') {
        event.preventDefault()
        trackFeatureUsage('keyboard_toggle_chat')
        // Toggle chat - would need to be passed from parent
      }

      if (cmdKey && key === 'd') {
        event.preventDefault()
        trackFeatureUsage('keyboard_open_discovery')
        // Open discovery panel
      }

      // Layout shortcuts
      if (!cmdKey && !altKey && ['1', '2', '3', '4'].includes(key)) {
        event.preventDefault()
        const layoutMap: Record<string, string> = {
          '1': '1x1',
          '2': '2x2', 
          '3': '3x3',
          '4': '4x4'
        }
        setGridLayout(layoutMap[key] as any)
        trackFeatureUsage(`keyboard_layout_${key}`)
      }

      if (!cmdKey && !altKey && key === 'p') {
        event.preventDefault()
        setGridLayout('pip' as any)
        trackFeatureUsage('keyboard_pip_mode')
      }

      // Stream control shortcuts
      if (!cmdKey && !altKey && key === 'm') {
        event.preventDefault()
        trackFeatureUsage('keyboard_mute_all')
        // Toggle mute all streams
      }

      // Quick actions
      if (cmdKey && key === 'a') {
        event.preventDefault()
        trackFeatureUsage('keyboard_add_stream')
        // Open add stream dialog
      }

      if (cmdKey && shiftKey && key === 'X') {
        event.preventDefault()
        trackFeatureUsage('keyboard_clear_all')
        clearAllStreams()
      }

      // Accessibility shortcuts
      if (altKey && key === 'k') {
        event.preventDefault()
        setIsOpen(true)
        trackFeatureUsage('keyboard_shortcuts_opened')
      }

      // Escape to close dialogs
      if (key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setGridLayout, clearAllStreams, trackFeatureUsage])

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category]!.push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Shortcuts</span>
          <Badge variant="outline" className="text-xs">
            Alt+K
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{category}</CardTitle>
                <CardDescription className="text-sm">
                  {category === 'Navigation' && 'Move around the app quickly'}
                  {category === 'Stream Control' && 'Control your streams'}
                  {category === 'Layout' && 'Change viewing layouts'}
                  {category === 'Quick Actions' && 'Perform common tasks'}
                  {category === 'Accessibility' && 'Accessibility features'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <kbd className="px-2 py-1 text-xs bg-muted border rounded font-mono">
                            {key === 'Cmd' ? (
                              <Command className="w-3 h-3" />
                            ) : key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-xs text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Separator />
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Tip:</strong> Most shortcuts work globally, but some require focus on specific elements.
          </p>
          <p>
            Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate between 
            interactive elements and <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> or 
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to activate them.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}