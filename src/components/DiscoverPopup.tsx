'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStreamStore } from '@/store/streamStore'
import { 
  Search, Users, Clock, Play, Star, TrendingUp, 
  Gamepad2, MessageSquare, Music, Palette, X
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface StreamData {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: string
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tags: string[]
  profile_image_url?: string
}

interface DiscoverPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUICK_CATEGORIES = [
  { name: 'Just Chatting', icon: MessageSquare },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Music', icon: Music },
  { name: 'Art', icon: Palette },
]

export default function DiscoverPopup({ open, onOpenChange }: DiscoverPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StreamData[]>([])
  const [trendingStreams, setTrendingStreams] = useState<StreamData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('trending')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const { addStream } = useStreamStore()

  // Fetch trending streams
  const fetchTrendingStreams = useCallback(async () => {
    if (!open) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/twitch/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 12 })
      })

      if (response.ok) {
        const data = await response.json()
        setTrendingStreams(data.streams || [])
      }
    } catch (error) {
      console.error('Error fetching trending streams:', error)
    } finally {
      setLoading(false)
    }
  }, [open])

  // Search functionality
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch('/api/twitch/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 10 })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
        setSelectedCategory('search')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }, [searchQuery])

  // Handle category selection
  const handleCategorySelect = useCallback(async (category: string) => {
    setSelectedCategory(category)
    
    if (category === 'trending') {
      return // Already have trending data
    }

    setLoading(true)
    try {
      const response = await fetch('/api/twitch/streams-by-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories: [category],
          limit: 12 
        })
      })

      if (response.ok) {
        const data = await response.json()
        const categoryStreams = data.categorizedStreams?.[0]?.streams || []
        setSearchResults(categoryStreams)
      }
    } catch (error) {
      console.error('Error fetching category streams:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle add stream with immediate feedback
  const handleAddStream = useCallback(async (channelName: string) => {
    const success = await addStream(channelName)
    if (success) {
      // Close popup after successful add
      onOpenChange(false)
    }
  }, [addStream, onOpenChange])

  useEffect(() => {
    if (open) {
      fetchTrendingStreams()
      setSearchQuery('')
      setSearchResults([])
      setSelectedCategory('trending')
    }
  }, [open, fetchTrendingStreams])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch()
      } else {
        setSearchResults([])
        setSelectedCategory('trending')
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, handleSearch])

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDuration = (startedAt: string): string => {
    const start = new Date(startedAt)
    const now = new Date()
    const hours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60))
    const minutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60)) % 60
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const currentStreams = selectedCategory === 'trending' ? trendingStreams : searchResults

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Discover Streams
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search streamers, games, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategorySelect('trending')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Button>
            {QUICK_CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategorySelect(category.name)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>

          {/* Results */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : currentStreams.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No streams found' : 'Search for streamers to discover new content'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentStreams.map((stream) => (
                  <Card key={stream.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video">
                      <Image
                        src={stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
                        alt={stream.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Overlay info */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Badge className="bg-red-600 text-white border-0 text-xs">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                          LIVE
                        </Badge>
                        <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(stream.started_at)}
                        </Badge>
                      </div>

                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {formatViewerCount(stream.viewer_count)}
                        </Badge>
                      </div>

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Button
                          size="sm"
                          className="bg-white/90 text-black hover:bg-white"
                          onClick={() => handleAddStream(stream.user_login)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Add Stream
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        {stream.profile_image_url && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={stream.profile_image_url}
                              alt={stream.user_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate" title={stream.title}>
                            {stream.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {stream.user_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {stream.game_name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}