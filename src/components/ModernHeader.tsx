'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  Plus, 
  MessageSquare, 
  Compass, 
  Zap, 
  Search,
  Settings,
  Share2,
  MoreVertical,
  Command,
  Layout,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from './theme-toggle'
import StreamyyyLogo from './StreamyyyLogo'
import LayoutSelector from './LayoutSelector'
import { cn } from '@/lib/utils'

interface ModernHeaderProps {
  onToggleChat: () => void
  showChat: boolean
  className?: string
}

export default function ModernHeader({ onToggleChat, showChat, className }: ModernHeaderProps) {
  const [channelInput, setChannelInput] = useState('')
  const [showAddStream, setShowAddStream] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  const { 
    streams, 
    addStream, 
    clearAllStreams,
    gridLayout 
  } = useStreamStore()
  
  const { 
    trackStreamAdded, 
    trackChatToggle, 
    trackFeatureUsage 
  } = useAnalytics()

  const activeStreams = streams.filter(stream => stream.isActive)

  const handleAddStream = useCallback(async (input: string) => {
    if (!input.trim()) return false
    
    const success = await addStream(input.trim())
    if (success) {
      const platform = input.includes('youtube') || input.includes('youtu.be') ? 'youtube' : 'twitch'
      const channelName = input.split('/').pop() || input
      trackStreamAdded(channelName, platform)
      setChannelInput('')
      setShowAddStream(false)
      setShowSearch(false)
    }
    return success
  }, [addStream, trackStreamAdded])

  const handleQuickSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleAddStream(channelInput)
  }, [channelInput, handleAddStream])

  const handleClearAll = useCallback(() => {
    clearAllStreams()
    trackFeatureUsage('clear_all_streams')
  }, [clearAllStreams, trackFeatureUsage])

  const handleToggleChat = useCallback(() => {
    onToggleChat()
    trackChatToggle(!showChat)
  }, [onToggleChat, showChat, trackChatToggle])

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section - Logo and Stream Count */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <StreamyyyLogo size="lg" variant="gradient" useForHeader={true} iconOnly={true} />
          </Link>
          
          {activeStreams.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {activeStreams.length} active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {gridLayout.replace('-', ' ')}
              </Badge>
            </div>
          )}
        </div>

        {/* Center Section - Search and Quick Actions */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
          {showSearch ? (
            <form onSubmit={handleQuickSearch} className="flex w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Add stream by name or URL..."
                  className="pl-10 pr-10"
                  autoFocus
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button type="submit" size="sm" disabled={!channelInput.trim()}>
                Add
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowSearch(true)}
              className="w-full justify-start text-muted-foreground"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add stream...</span>
              <span className="sm:hidden">Add...</span>
              <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>
          )}
        </div>

        {/* Right Section - Actions and Menu */}
        <div className="flex items-center gap-2">
          {/* Chat Toggle */}
          <Button
            variant={showChat ? "default" : "ghost"}
            size="sm"
            onClick={handleToggleChat}
            className="hidden md:flex gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Button>

          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <MoreVertical className="w-4 h-4" />
                <span className="hidden md:inline">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setShowAddStream(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Stream
                <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => trackFeatureUsage('discovery_opened')}>
                <Compass className="w-4 h-4 mr-2" />
                Discover Streams
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/amp-summer">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  AMP Summer
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => trackFeatureUsage('layout_selector')}>
                <Layout className="w-4 h-4 mr-2" />
                Change Layout
              </DropdownMenuItem>
              
              {activeStreams.length > 0 && (
                <>
                  <DropdownMenuItem onClick={() => trackFeatureUsage('share_opened')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Setup
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleClearAll}
                    className="text-destructive focus:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Streams
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between w-full">
                  <span>Theme</span>
                  <ThemeToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Add Stream Dialog */}
      <Dialog open={showAddStream} onOpenChange={setShowAddStream}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Stream</DialogTitle>
            <DialogDescription>
              Enter a channel name or paste a stream URL to add it to your viewer.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleQuickSearch} className="space-y-4">
            <div className="space-y-2">
              <Input
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="twitch.tv/username or youtube.com/watch?v=..."
                autoFocus
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Twitch: username or twitch.tv/username</li>
                  <li>YouTube: youtube.com/watch?v=VIDEO_ID</li>
                  <li>Rumble: rumble.com/v1234-title.html</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddStream(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!channelInput.trim()}
              >
                Add Stream
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}