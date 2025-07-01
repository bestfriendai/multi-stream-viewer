'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTwitchAutosuggest } from '@/hooks/useTwitchAutosuggest'
import { 
  Plus, 
  Menu, 
  MessageSquare, 
  Compass, 
  Zap, 
  X,
  Trash2,
  Keyboard,
  Share2,
  BookmarkPlus,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import EnhancedLayoutSelector from './EnhancedLayoutSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LiveDiscovery from './LiveDiscovery'
import StreamyyyLogo from './StreamyyyLogo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

export default function Header({ onToggleChat, showChat }: HeaderProps) {
  const [channelInput, setChannelInput] = useState('')
  const [showAddStream, setShowAddStream] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  const { 
    streams, 
    addStream, 
    clearAllStreams
  } = useStreamStore()
  
  const { trackStreamAdded, trackFeatureUsage, trackMenuItemClick } = useAnalytics()
  const { suggestions, isLoading, searchChannels, clearSuggestions } = useTwitchAutosuggest()
  
  const handleAddStream = async (e: React.FormEvent) => {
    e.preventDefault()
    if (channelInput.trim()) {
      const success = await addStream(channelInput.trim())
      if (success) {
        // Track stream addition
        const platform = channelInput.includes('youtube') || channelInput.includes('youtu.be') ? 'youtube' : 'twitch'
        const channelName = channelInput.split('/').pop() || channelInput
        trackStreamAdded(channelName, platform)
        
        setChannelInput('')
        setShowAddStream(false)
        clearSuggestions()
      }
    }
  }

  const handleInputChange = (value: string) => {
    setChannelInput(value)
    setSelectedSuggestionIndex(-1)
    
    // Only search if it looks like a Twitch username (no URLs)
    if (!value.includes('.') && !value.includes('/')) {
      searchChannels(value)
    } else {
      clearSuggestions()
    }
  }

  const handleSelectSuggestion = (login: string) => {
    setChannelInput(login)
    clearSuggestions()
    setSelectedSuggestionIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > -1 ? prev - 1 : -1
        )
        break
      case 'Enter':
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          e.preventDefault()
          handleSelectSuggestion(suggestions[selectedSuggestionIndex].login)
        }
        break
      case 'Escape':
        clearSuggestions()
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        clearSuggestions()
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clearSuggestions])
  
  return (
    <div>
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="h-14 flex items-center justify-between gap-4">
            {/* Logo */}
            <div>
              <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                <StreamyyyLogo size="sm" variant="gradient" />
              </Link>
            </div>

            {/* Main Actions - Center */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              {/* Add Stream */}
              {showAddStream ? (
                <form 
                  onSubmit={handleAddStream} 
                  className="flex items-center gap-2 max-w-xs relative"
                >
                    <div className="relative flex-1">
                      <Input
                        ref={inputRef}
                        type="text"
                        value={channelInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter channel or URL"
                        className="h-8"
                        autoFocus
                      />
                      
                      {/* Autosuggest Dropdown */}
                      {suggestions.length > 0 && (
                        <div 
                          ref={suggestionsRef}
                          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden"
                        >
                          <div className="max-h-64 overflow-y-auto">
                            {suggestions.map((channel, index) => (
                              <button
                                key={channel.id}
                                type="button"
                                className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-center gap-3 ${
                                  index === selectedSuggestionIndex ? 'bg-accent' : ''
                                }`}
                                onClick={() => handleSelectSuggestion(channel.login)}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                              >
                                {channel.profile_image_url && (
                                  <img
                                    src={channel.profile_image_url}
                                    alt={channel.display_name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium truncate">{channel.display_name}</span>
                                    {channel.is_live && (
                                      <span className="flex items-center gap-1 text-xs text-red-600">
                                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  {channel.game_name && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {channel.game_name}
                                      {channel.stream?.viewer_count && (
                                        <span className="ml-2">
                                          {channel.stream.viewer_count.toLocaleString()} viewers
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Loading indicator */}
                      {isLoading && channelInput.length >= 2 && !channelInput.includes('.') && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 p-3 text-center text-sm text-muted-foreground">
                          Searching...
                        </div>
                      )}
                    </div>
                    
                    <Button type="submit" size="sm" className="h-8">
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setShowAddStream(false)
                        setChannelInput('')
                        clearSuggestions()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowAddStream(true)}
                      size="sm"
                      className="h-8"
                      disabled={streams.length >= 16}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="ml-1.5 hidden sm:inline">Add Stream</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => setShowDiscovery(true)}
                    >
                      <Compass className="h-4 w-4" />
                      <span className="ml-1.5 hidden sm:inline">Discover</span>
                    </Button>

                    {/* AMP Summer */}
                    <Link href="/amp-summer" className="hidden sm:block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                      >
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="ml-1.5 font-medium">AMP</span>
                      </Button>
                    </Link>
                  </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-2">
                <EnhancedLayoutSelector />
                
                <SavedLayoutsDialog />
                
                <ShareDialog />
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button
                  variant={showChat ? "default" : "ghost"}
                  size="sm"
                  onClick={onToggleChat}
                  className="h-8"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="ml-1.5">Chat</span>
                </Button>
              </div>

              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onToggleChat}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {showChat ? 'Hide' : 'Show'} Chat
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/amp-summer">
                      <Zap className="mr-2 h-4 w-4 text-yellow-600" />
                      AMP Summer
                    </Link>
                  </DropdownMenuItem>
                  
                  {streams.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={clearAllStreams}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
              
              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem
                    onClick={() => {
                      alert(
                        'Keyboard Shortcuts:\n\n' +
                        '1-9: Switch to stream\n' +
                        'Space/M: Mute/unmute\n' +
                        '←→: Navigate streams\n' +
                        'C: Toggle chat\n' +
                        'F: Fullscreen\n' +
                        'Ctrl+X: Clear all\n' +
                        '?: Show help'
                      )
                    }}
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Shortcuts
                    <DropdownMenuShortcut>?</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {streams.length} / 16 streams
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <Dialog open={showDiscovery} onOpenChange={setShowDiscovery}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Discover Live Streams</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[85vh]">
            <LiveDiscovery />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}