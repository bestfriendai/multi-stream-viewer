'use client'

import React, { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MessageSquare, 
  Compass, 
  Zap, 
  Trash2,
  Share2,
  BookmarkPlus,
  Settings,
  Moon,
  Sun,
  Monitor,
  Grid3X3,
  Maximize,
  Download,
  Upload,
  LogIn,
  LogOut,
  User,
  Search
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUser } from '@clerk/nextjs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleChat: () => void
  onOpenAddStream: () => void
  onOpenDiscovery: () => void
  showChat: boolean
}

interface CommandItem {
  id: string
  label: string
  description?: string | undefined
  icon: any
  action: () => void
  keywords?: string[] | undefined
  category: 'actions' | 'navigation' | 'settings' | 'streams' | 'theme'
  shortcut?: string | undefined
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onToggleChat,
  onOpenAddStream,
  onOpenDiscovery,
  showChat
}) => {
  const [search, setSearch] = useState('')
  const { theme, setTheme } = useTheme()
  const { streams, clearAllStreams } = useStreamStore()
  const { trackFeatureUsage } = useAnalytics()
  const { isSignedIn, user } = useUser()

  const commands: CommandItem[] = React.useMemo(() => [
    // Stream Actions
    {
      id: 'add-stream',
      label: 'Add Stream',
      description: 'Add a new stream to your grid',
      icon: Plus,
      action: () => {
        onOpenAddStream()
        onOpenChange(false)
        trackFeatureUsage('command_palette_add_stream')
      },
      keywords: ['add', 'new', 'stream', 'create'],
      category: 'actions',
      shortcut: '⌘⇧A'
    },
    {
      id: 'discover-streams',
      label: 'Discover Streams',
      description: 'Browse live streams and trending content',
      icon: Compass,
      action: () => {
        onOpenDiscovery()
        onOpenChange(false)
        trackFeatureUsage('command_palette_discover')
      },
      keywords: ['discover', 'browse', 'find', 'explore', 'live'],
      category: 'actions',
      shortcut: '⌘⇧D'
    },
    {
      id: 'toggle-chat',
      label: showChat ? 'Hide Chat' : 'Show Chat',
      description: showChat ? 'Hide the chat panel' : 'Show the chat panel',
      icon: MessageSquare,
      action: () => {
        onToggleChat()
        onOpenChange(false)
        trackFeatureUsage('command_palette_toggle_chat')
      },
      keywords: ['chat', 'toggle', 'show', 'hide', 'messages'],
      category: 'actions',
      shortcut: '⌘⇧C'
    },
    {
      id: 'share-layout',
      label: 'Share Layout',
      description: 'Share your current stream layout',
      icon: Share2,
      action: () => {
        onOpenChange(false)
        trackFeatureUsage('command_palette_share')
      },
      keywords: ['share', 'layout', 'link', 'export'],
      category: 'actions'
    },
    
    // Stream Management
    ...(streams.length > 0 ? [{
      id: 'clear-streams',
      label: 'Clear All Streams',
      description: `Remove all ${streams.length} streams`,
      icon: Trash2,
      action: () => {
        clearAllStreams()
        onOpenChange(false)
        trackFeatureUsage('command_palette_clear_all')
      },
      keywords: ['clear', 'remove', 'delete', 'streams', 'all'],
      category: 'streams' as const
    }] : []),

    // Navigation
    {
      id: 'amp-summer',
      label: 'AMP Summer',
      description: 'Visit the AMP Summer page',
      icon: Zap,
      action: () => {
        window.location.href = '/amp-summer'
        onOpenChange(false)
      },
      keywords: ['amp', 'summer', 'event', 'special'],
      category: 'navigation'
    },
    {
      id: 'blog',
      label: 'Blog',
      description: 'Read the latest blog posts',
      icon: BookmarkPlus,
      action: () => {
        window.location.href = '/blog'
        onOpenChange(false)
      },
      keywords: ['blog', 'posts', 'articles', 'news'],
      category: 'navigation'
    },

    // Theme Controls
    {
      id: 'theme-light',
      label: 'Light Theme',
      description: 'Switch to light mode',
      icon: Sun,
      action: () => {
        setTheme('light')
        onOpenChange(false)
        trackFeatureUsage('command_palette_theme_light')
      },
      keywords: ['light', 'theme', 'bright', 'day'],
      category: 'theme'
    },
    {
      id: 'theme-dark',
      label: 'Dark Theme',
      description: 'Switch to dark mode',
      icon: Moon,
      action: () => {
        setTheme('dark')
        onOpenChange(false)
        trackFeatureUsage('command_palette_theme_dark')
      },
      keywords: ['dark', 'theme', 'night', 'black'],
      category: 'theme'
    },
    {
      id: 'theme-system',
      label: 'System Theme',
      description: 'Use system preference',
      icon: Monitor,
      action: () => {
        setTheme('system')
        onOpenChange(false)
        trackFeatureUsage('command_palette_theme_system')
      },
      keywords: ['system', 'theme', 'auto', 'preference'],
      category: 'theme'
    },

    // User Actions
    ...(isSignedIn ? [{
      id: 'profile',
      label: 'Profile',
      description: 'View your profile',
      icon: User,
      action: () => {
        window.location.href = '/profile'
        onOpenChange(false)
      },
      keywords: ['profile', 'account', 'user', 'settings'],
      category: 'settings' as const
    }] : [{
      id: 'sign-in',
      label: 'Sign In',
      description: 'Sign in to your account',
      icon: LogIn,
      action: () => {
        // This would trigger the Clerk sign-in
        onOpenChange(false)
      },
      keywords: ['sign', 'in', 'login', 'auth'],
      category: 'settings' as const
    }])
  ], [
    showChat, 
    streams.length, 
    theme, 
    isSignedIn, 
    onToggleChat, 
    onOpenAddStream, 
    onOpenDiscovery, 
    onOpenChange, 
    clearAllStreams, 
    setTheme, 
    trackFeatureUsage
  ])

  const filteredCommands = React.useMemo(() => {
    if (!search.trim()) return commands

    const searchLower = search.toLowerCase().trim()
    return commands.filter(command => {
      const matchesLabel = command.label.toLowerCase().includes(searchLower)
      const matchesDescription = command.description?.toLowerCase().includes(searchLower)
      const matchesKeywords = command.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      )
      
      return matchesLabel || matchesDescription || matchesKeywords
    })
  }, [commands, search])

  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = []
      }
      groups[command.category]?.push(command)
    })
    
    return groups
  }, [filteredCommands])

  const categoryLabels = {
    actions: 'Quick Actions',
    streams: 'Stream Management',
    navigation: 'Navigation',
    theme: 'Theme',
    settings: 'Settings'
  }

  useEffect(() => {
    if (open) {
      setSearch('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-background/95 backdrop-blur-xl border shadow-2xl">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="ml-auto flex items-center space-x-2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ESC
              </kbd>
            </div>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <AnimatePresence mode="wait">
              {Object.keys(groupedCommands).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  No commands found.
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {Object.entries(groupedCommands).map(([category, commands]) => (
                    <Command.Group 
                      key={category}
                      heading={categoryLabels[category as keyof typeof categoryLabels]}
                      className="mb-2"
                    >
                      {commands.map((command) => (
                        <Command.Item
                          key={command.id}
                          onSelect={() => command.action()}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer",
                            "hover:bg-accent hover:text-accent-foreground",
                            "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                            "transition-colors"
                          )}
                        >
                          <command.icon className="h-4 w-4 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{command.label}</div>
                            {command.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {command.description}
                              </div>
                            )}
                          </div>
                          {command.shortcut && (
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                              {command.shortcut}
                            </kbd>
                          )}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Command.List>

          <div className="border-t border-border p-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, ↵ to select, ESC to close</span>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘K
                </kbd>
                <span>to open</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export default CommandPalette