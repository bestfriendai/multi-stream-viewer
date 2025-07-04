'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  Plus, 
  Menu, 
  Search,
  MoreHorizontal,
  Zap,
  Users,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ThemeToggle } from './theme-toggle'
import StreamyyyLogo from './StreamyyyLogo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  onAddStream: () => void
  onToggleMenu?: () => void
  showSearchBar?: boolean
}

export default function MobileHeader({ 
  onAddStream, 
  onToggleMenu,
  showSearchBar = false 
}: MobileHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { streams, addStream, clearAllStreams } = useStreamStore()
  const { trackMenuItemClick, trackStreamSearch } = useAnalytics()

  const activeStreams = streams.filter(stream => stream.isActive)

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim() && !isLoading) {
      setIsLoading(true)
      try {
        const success = await addStream(searchInput.trim())
        if (success) {
          trackStreamSearch(searchInput, 'mobile_header')
          setSearchInput('')
          setIsSearchOpen(false)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClearAll = () => {
    clearAllStreams()
    trackMenuItemClick('clear_all_mobile')
  }

  return (
    <header className="bg-background/95 backdrop-blur-md sticky top-0 z-40 border-b md:hidden">
      <div className="px-4">
        {/* Main Header Row */}
        <div className="h-14 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <StreamyyyLogo size="sm" variant="gradient" useForHeader={true} iconOnly={true} />
            </Link>
            
            {activeStreams.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {activeStreams.length}
              </Badge>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            {/* Quick Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-8 w-8 p-0"
            >
              {isSearchOpen ? <X size={18} /> : <Search size={18} />}
            </Button>

            {/* Quick Add Stream */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddStream}
              className="h-8 w-8 p-0"
              disabled={streams.length >= 16}
            >
              <Plus size={18} />
            </Button>

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => {
                    trackMenuItemClick('amp_summer_mobile')
                  }}
                  asChild
                >
                  <Link href="/amp-summer" className="flex items-center w-full">
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                    AMP Summer
                  </Link>
                </DropdownMenuItem>
                
                {activeStreams.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleClearAll}
                      className="text-destructive focus:text-destructive"
                    >
                      Clear All Streams
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => trackMenuItemClick('theme_toggle_mobile')}>
                  <ThemeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar Row (Expandable) */}
        {isSearchOpen && (
          <div className="pb-3 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleQuickSearch} className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Paste stream URL or channel name..."
                className="flex-1 h-9 text-sm"
                autoFocus
              />
              <Button 
                type="submit" 
                size="sm" 
                className="h-9 px-3"
                disabled={!searchInput.trim() || isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Add'}
              </Button>
            </form>
            <div className="mt-2 text-xs text-muted-foreground">
              Supports Twitch, YouTube, and more platforms
            </div>
          </div>
        )}

        {/* Stream Status Row (When streams are active) */}
        {activeStreams.length > 0 && !isSearchOpen && (
          <div className="pb-2 border-t border-border/50 pt-2 mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>
                  {activeStreams.length} stream{activeStreams.length !== 1 ? 's' : ''} active
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {activeStreams.slice(0, 3).map((stream, index) => (
                  <Badge 
                    key={stream.id} 
                    variant="outline" 
                    className="text-xs px-1.5 py-0.5 h-auto"
                  >
                    {stream.channelName.length > 8 
                      ? `${stream.channelName.slice(0, 8)}...` 
                      : stream.channelName
                    }
                  </Badge>
                ))}
                {activeStreams.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
                    +{activeStreams.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}