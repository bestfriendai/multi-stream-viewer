'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { Plus, Trash2, MessageSquare, TrendingUp, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LiveDiscovery from './LiveDiscovery'
import StreamyyyLogo from './StreamyyyLogo'
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
    <header className="glass sticky top-0 z-40 border-b border-border/50 animate-slide-down">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between">
            <Link
              href="/"
              className="transition-opacity hover:opacity-80 cursor-pointer"
              title="Go to Home"
            >
              <StreamyyyLogo
                size="md"
                variant="gradient"
                className="flex items-center"
              />
            </Link>

            {/* Mobile Stream Count */}
            <div className="text-sm text-muted-foreground lg:hidden">
              {streams.length}/16
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Add Stream */}
            <div className="animate-fade-in">
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Plus size={16} className="mr-2" />
                Add Stream
              </Button>
            )}
            </div>
            
            {/* Enhanced Discovery Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-black/50 border-gray-300 dark:border-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800/50 dark:hover:to-gray-900/50 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <TrendingUp size={16} className="mr-2 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                    Discover
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-[98vw] sm:max-w-7xl max-h-[98vh] sm:max-h-[95vh] p-0 border-0 bg-transparent shadow-none"
                showCloseButton={false}
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Discover Live Streams</DialogTitle>
                </DialogHeader>

                {/* Enhanced modal container with glassmorphism */}
                <div className="relative w-full h-full">
                  {/* Background blur overlay */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl"></div>

                  {/* Main content container */}
                  <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden">
                    {/* Custom close button */}
                    <div className="absolute top-4 right-4 z-50">
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 shadow-lg transition-all duration-300"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </DialogTrigger>
                    </div>

                    {/* Scrollable content */}
                    <div className="max-h-[98vh] sm:max-h-[95vh] overflow-y-auto">
                      <LiveDiscovery />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Layout Options */}
            <div className="flex items-center gap-1 border border-border/50 rounded-xl p-1 bg-muted/30 backdrop-blur-sm">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGridLayout(option.value)}
                  className={cn(
                    'px-2 py-1 text-sm rounded-lg transition-all duration-200',
                    gridLayout === option.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted/50'
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
