'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStreamStore } from '@/store/streamStore'
import { 
  Search, Filter, ChevronDown, Users, Eye, Clock, 
  TrendingUp, Gamepad2, Music, Palette, MessageSquare,
  Heart, Trophy, DollarSign, Sparkles, Globe, Play,
  ChevronLeft, ChevronRight, X, SlidersHorizontal
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

interface Category {
  id: string
  name: string
  box_art_url: string
  viewer_count?: number
  channels_count?: number
}

interface Stream {
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
  is_mature?: boolean
}

const LANGUAGES = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pl', name: 'Polski' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' }
]

const SORT_OPTIONS = [
  { value: 'viewers_high', label: 'Viewers (High to Low)' },
  { value: 'viewers_low', label: 'Viewers (Low to High)' },
  { value: 'recent', label: 'Recently Started' },
  { value: 'recommended', label: 'Recommended For You' }
]

// Format numbers for display
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Format stream duration
const formatDuration = (startedAt: string): string => {
  const start = new Date(startedAt)
  const now = new Date()
  const hours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60))
  const minutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60)) % 60
  
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function TwitchLikeDiscovery() {
  const [categories, setCategories] = useState<Category[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortBy, setSortBy] = useState('viewers_high')
  const [showMature, setShowMature] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingStreams, setLoadingStreams] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [pagination, setPagination] = useState<{ cursor?: string }>({})
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { addStream } = useStreamStore()

  // Fetch top categories
  const fetchCategories = useCallback(async (cursor?: string) => {
    try {
      const url = new URL('/api/twitch/categories', window.location.origin)
      url.searchParams.set('first', '50')
      if (cursor) url.searchParams.set('after', cursor)
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (cursor) {
        setCategories(prev => [...prev, ...data.categories])
      } else {
        setCategories(data.categories)
      }
      
      setPagination(data.pagination || {})
      setHasMore(!!data.pagination?.cursor)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  // Fetch streams for a category
  const fetchStreams = useCallback(async (categoryId?: string) => {
    setLoadingStreams(true)
    try {
      const response = await fetch('/api/twitch/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: categoryId,
          language: selectedLanguage === 'all' ? undefined : selectedLanguage,
          first: 24
        })
      })
      
      const data = await response.json()
      
      // Sort streams based on selected option
      let sortedStreams = [...data.streams]
      if (sortBy === 'viewers_high') {
        sortedStreams.sort((a, b) => b.viewer_count - a.viewer_count)
      } else if (sortBy === 'viewers_low') {
        sortedStreams.sort((a, b) => a.viewer_count - b.viewer_count)
      } else if (sortBy === 'recent') {
        sortedStreams.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      }
      
      // Filter mature content if needed
      if (!showMature) {
        sortedStreams = sortedStreams.filter(stream => !stream.is_mature)
      }
      
      setStreams(sortedStreams)
    } catch (error) {
      console.error('Error fetching streams:', error)
    } finally {
      setLoadingStreams(false)
    }
  }, [selectedLanguage, sortBy, showMature])

  // Search categories
  const searchCategories = useCallback(async () => {
    if (!searchQuery.trim()) {
      fetchCategories()
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/twitch/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      
      const data = await response.json()
      setCategories(data.categories)
      setHasMore(false)
    } catch (error) {
      console.error('Error searching categories:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, fetchCategories])

  // Load more categories on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || loading) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (pagination.cursor) {
        setLoading(true)
        fetchCategories(pagination.cursor).finally(() => setLoading(false))
      }
    }
  }, [pagination.cursor, hasMore, loading, fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (selectedCategory) {
      fetchStreams(selectedCategory)
    } else {
      fetchStreams()
    }
  }, [selectedCategory, fetchStreams])

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [handleScroll])

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={() => {
        setSelectedCategory(category.id)
        setActiveTab('streams')
      }}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={category.box_art_url.replace('{width}', '285').replace('{height}', '380')}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Category info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-sm truncate drop-shadow-lg">{category.name}</h3>
          {category.viewer_count && (
            <p className="text-xs opacity-90 drop-shadow">
              {formatNumber(category.viewer_count)} viewers
            </p>
          )}
        </div>
      </div>
    </Card>
  )

  const StreamCard = ({ stream }: { stream: Stream }) => (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video">
        <Image
          src={stream.thumbnail_url.replace('{width}', '440').replace('{height}', '248')}
          alt={stream.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Overlays */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-red-600 text-white border-0">
            LIVE
          </Badge>
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            {formatNumber(stream.viewer_count)} viewers
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(stream.started_at)}
          </Badge>
        </div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <Button
            size="lg"
            className="bg-white/90 text-black hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              addStream(stream.user_login)
            }}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex gap-3">
          {stream.profile_image_url && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={stream.profile_image_url}
                alt={stream.user_name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" title={stream.title}>
              {stream.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {stream.user_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {stream.game_name}
            </p>
          </div>
        </div>
        
        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {stream.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header with filters */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <TabsList className="grid grid-cols-3 w-full lg:w-auto">
                  <TabsTrigger value="browse" className="gap-2">
                    <Gamepad2 size={16} />
                    Browse
                  </TabsTrigger>
                  <TabsTrigger value="streams" className="gap-2">
                    <Users size={16} />
                    Live Streams
                  </TabsTrigger>
                  <TabsTrigger value="following" className="gap-2">
                    <Heart size={16} />
                    Following
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Search and filters */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchCategories()}
                    placeholder="Search categories..."
                    className="pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        fetchCategories()
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                
                {/* Language selector */}
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[140px]">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Sort and filter dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {SORT_OPTIONS.map(option => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={showMature}
                      onCheckedChange={setShowMature}
                    >
                      Show Mature Content
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Category breadcrumb */}
            {selectedCategory && activeTab === 'streams' && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null)
                    setActiveTab('browse')
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Categories
                </Button>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <TabsContent value="browse" className="m-0">
          <div 
            ref={scrollRef}
            className="container mx-auto px-4 py-6 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
              
              {loading && (
                <>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={`skeleton-${i}`} className="animate-pulse">
                      <div className="aspect-[3/4] bg-muted" />
                    </Card>
                  ))}
                </>
              )}
            </div>
            
            {!loading && categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No categories found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="streams" className="m-0">
          <div className="container mx-auto px-4 py-6">
            {loadingStreams ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={`stream-skeleton-${i}`} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-3">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {streams.map(stream => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            )}
            
            {!loadingStreams && streams.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No live streams found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="m-0">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="max-w-md mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Follow Your Favorite Streamers</h2>
              <p className="text-muted-foreground mb-6">
                Sign in to see live streams from channels you follow
              </p>
              <Button size="lg">
                Sign In
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}