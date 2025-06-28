'use client'

import { useState } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { Plus, Grid, Trash2, Monitor, MessageSquare, TrendingUp, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SuggestedStreams from './SuggestedStreams'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const layoutOptions = [
  { value: '1x1', label: '1x1', icon: '◻' },
  { value: '2x1', label: '2x1', icon: '◻◻' },
  { value: '2x2', label: '2x2', icon: '⊞' },
  { value: '3x3', label: '3x3', icon: '⊟' },
  { value: '4x4', label: '4x4', icon: '⊞' },
  { value: 'custom', label: 'Focus', icon: '◧' }
] as const

interface HeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

export default function Header({ onToggleChat, showChat }: HeaderProps) {
  const [channelInput, setChannelInput] = useState('')
  const [showAddStream, setShowAddStream] = useState(false)
  const { 
    streams, 
    addStream, 
    clearAllStreams, 
    gridLayout, 
    setGridLayout 
  } = useStreamStore()
  
  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault()
    if (channelInput.trim()) {
      const success = addStream(channelInput.trim())
      if (success) {
        setChannelInput('')
        setShowAddStream(false)
      } else {
        // Invalid input - you might want to show an error message
        alert('Invalid stream URL or username. Please enter a valid Twitch username/URL, YouTube URL, or Rumble URL.')
      }
    }
  }
  
  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
              <h1 className="text-lg sm:text-xl font-bold">Multi-Stream</h1>
            </div>
            
            {/* Mobile Stream Count */}
            <div className="text-sm text-muted-foreground lg:hidden">
              {streams.length}/16
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Add Stream */}
            {showAddStream ? (
              <form onSubmit={handleAddStream} className="flex gap-2">
                <Input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Channel or URL"
                  className="h-8 w-40 sm:w-64"
                  autoFocus
                />
                <Button type="submit" size="sm">
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddStream(false)
                    setChannelInput('')
                  }}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <Button
                onClick={() => setShowAddStream(true)}
                size="sm"
                disabled={streams.length >= 16}
              >
                <Plus size={16} className="mr-2" />
                Add Stream
              </Button>
            )}
            
            {/* Suggested Streams */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <TrendingUp size={16} className="mr-2" />
                  Discover
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sr-only">
                  <DialogTitle>Discover Streams</DialogTitle>
                </DialogHeader>
                <SuggestedStreams />
              </DialogContent>
            </Dialog>
            
            {/* Layout Options */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGridLayout(option.value)}
                  className={cn(
                    'px-2 py-1 text-sm rounded transition-colors',
                    gridLayout === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                  title={option.label}
                >
                  <span className="font-mono">{option.icon}</span>
                </button>
              ))}
            </div>
            
            {/* Saved Layouts */}
            <SavedLayoutsDialog />
            
            {/* Share */}
            <ShareDialog />
            
            {/* Chat Toggle */}
            <Button
              variant={showChat ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleChat}
            >
              <MessageSquare size={16} className="mr-2" />
              Chat
            </Button>
            
            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {
                  alert('Keyboard Shortcuts:\n\n1-9: Switch to stream\nSpace/M: Mute/unmute\n←→: Navigate streams\nCtrl+X: Clear all\n?: Show help')
                }}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                {streams.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={clearAllStreams}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Streams
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
          
          {/* Desktop Stream Count */}
          <div className="text-sm text-muted-foreground hidden lg:block">
            {streams.length} / 16 streams
          </div>
        </div>
      </div>
    </header>
  )
}