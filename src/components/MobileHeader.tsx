'use client'

import { useState, useEffect, useCallback } from 'react'
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
  X,
  LogIn,
  UserPlus,
  Clock,
  TrendingUp,
  PlayCircle
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
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"

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
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{
    channelName: string
    viewerCount: number
    isLive: boolean
    gameName?: string
    type: 'trending' | 'recent' | 'popular'
  }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { streams, addStream, clearAllStreams } = useStreamStore()
  const { trackMenuItemClick, trackStreamSearch } = useAnalytics()
  const { isSignedIn, user, isLoaded } = useUser()

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

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      // Fetch top live streams that match the query
      const response = await fetch('/api/twitch/top-streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.streams && Array.isArray(data.streams)) {
          const suggestions = data.streams
            .filter((stream: any) => 
              stream.user_login?.toLowerCase().includes(query.toLowerCase()) ||
              stream.user_name?.toLowerCase().includes(query.toLowerCase()) ||
              stream.game_name?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
            .map((stream: any) => ({
              channelName: stream.user_login || stream.user_name,
              viewerCount: stream.viewer_count || 0,
              isLive: true,
              gameName: stream.game_name || '',
              type: 'trending' as const
            }))

          setSearchSuggestions(suggestions)
          setShowSuggestions(suggestions.length > 0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }, [])

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput.trim()) {
        fetchSuggestions(searchInput.trim())
      } else {
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, fetchSuggestions])

  const handleSuggestionSelect = async (suggestion: any) => {
    setIsLoading(true)
    try {
      const success = await addStream(suggestion.channelName)
      if (success) {
        trackStreamSearch(suggestion.channelName, 'mobile_suggestion')
        setSearchInput('')
        setShowSuggestions(false)
        setIsSearchOpen(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="bg-background/95 backdrop-blur-md sticky top-0 z-40 border-b md:hidden">
      <div className="px-4">
        {/* Main Header Row */}
        <div className="h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <StreamyyyLogo size="xl" variant="gradient" useForHeader={true} iconOnly={true} />
            </Link>
            
            {activeStreams.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {activeStreams.length}
              </Badge>
            )}
          </div>

          {/* Right Section - Improved touch targets */}
          <div className="flex items-center gap-1.5">
            {/* Quick Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-10 w-10 p-0 min-w-[44px] touch-manipulation hover:bg-muted/60"
            >
              {isSearchOpen ? <X size={18} /> : <Search size={18} />}
            </Button>

            {/* Quick Add Stream */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddStream}
              className="h-10 w-10 p-0 min-w-[44px] touch-manipulation hover:bg-primary/10 text-primary"
              disabled={streams.length >= 16}
            >
              <Plus size={18} />
            </Button>

            {/* Authentication Button - Visible on Mobile */}
            {isSignedIn ? (
              <div className="h-10 w-10 flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 min-w-[44px] touch-manipulation hover:bg-muted/60"
                >
                  <LogIn size={18} />
                </Button>
              </SignInButton>
            )}

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 min-w-[44px] touch-manipulation hover:bg-muted/60"
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
                
                {/* Authentication Section */}
                {isSignedIn ? (
                  <DropdownMenuItem className="flex items-center justify-between p-0">
                    <div className="flex items-center gap-2 p-2">
                      <UserButton afterSignOutUrl="/" />
                      <span className="text-sm">Profile</span>
                    </div>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                      <DropdownMenuItem className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </DropdownMenuItem>
                    </SignInButton>
                    <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                      <DropdownMenuItem className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </DropdownMenuItem>
                    </SignUpButton>
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
          <div className="pb-3 animate-in slide-in-from-top duration-200 relative">
            <form onSubmit={handleQuickSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search live streams or paste URL..."
                  className="h-9 text-sm pr-8"
                  autoFocus
                  onFocus={() => searchInput.trim() && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {searchInput && (
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="h-9 px-3"
                disabled={!searchInput.trim() || isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Add'}
              </Button>
            </form>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2 text-xs text-muted-foreground border-b">
                  Live Streams
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.channelName}-${index}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <PlayCircle className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        {suggestion.isLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {suggestion.channelName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          {suggestion.gameName && (
                            <span>{suggestion.gameName}</span>
                          )}
                          {suggestion.isLive && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              LIVE
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{suggestion.viewerCount.toLocaleString()}</span>
                      {suggestion.type === 'trending' && (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-2 text-xs text-muted-foreground">
              Supports Twitch, YouTube, and more platforms • Start typing to see live suggestions
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