'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useStreamStore } from '@/store/streamStore'
import { 
  Play, Users, Eye, Search, TrendingUp, Globe, Star, 
  Flame, Crown, Sparkles, Gamepad2, MessageSquare, 
  Music, Palette, Trophy, DollarSign, Brain, Heart,
  Clock, Video, Filter, ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FollowingRecommended from './FollowingRecommended'

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

interface CategoryStreams {
  category: string
  gameId: string
  streams: StreamData[]
}

interface ClipData {
  id: string
  url: string
  embed_url: string
  broadcaster_name: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
  broadcaster_profile_image?: string
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  'Just Chatting': MessageSquare,
  'Gaming': Gamepad2,
  'Music': Music,
  'Art': Palette,
  'Sports': Trophy,
  'Slots': DollarSign,
  'Chess': Brain,
  'IRL': Heart
}

// Language names
const LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese'
}

const StreamCard = memo(({ 
  stream, 
  onAddStream,
  showCategory = true 
}: { 
  stream: StreamData
  onAddStream: (channelName: string) => void
  showCategory?: boolean
}) => {
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

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur">
      <div className="relative aspect-video">
        <Image
          src={stream.thumbnail_url.replace('{width}', '440').replace('{height}', '248')}
          alt={stream.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Live indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge className="bg-red-600 text-white border-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
            LIVE
          </Badge>
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(stream.started_at)}
          </Badge>
        </div>

        {/* Viewer count */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            <Users className="w-3 h-3 mr-1" />
            {formatViewerCount(stream.viewer_count)}
          </Badge>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="lg"
            className="bg-white/90 text-black hover:bg-white shadow-lg"
            onClick={() => onAddStream(stream.user_login)}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Stream
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Profile image */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {stream.profile_image_url ? (
              <Image
                src={stream.profile_image_url}
                alt={stream.user_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                {stream.user_name[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" title={stream.title}>
              {stream.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {stream.user_name}
            </p>
            {showCategory && (
              <p className="text-sm text-muted-foreground mt-1">
                {stream.game_name}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
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
})

StreamCard.displayName = 'StreamCard'

const ClipCard = memo(({ 
  clip, 
  onPlay 
}: { 
  clip: ClipData
  onPlay: (clip: ClipData) => void 
}) => {
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`
    return `${count} views`
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={() => onPlay(clip)}
    >
      <div className="relative aspect-video">
        <Image
          src={clip.thumbnail_url}
          alt={clip.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            {formatDuration(clip.duration)}
          </Badge>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-black ml-1" />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-1" title={clip.title}>
          {clip.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {clip.broadcaster_profile_image && (
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <Image
                src={clip.broadcaster_profile_image}
                alt={clip.broadcaster_name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span>{clip.broadcaster_name}</span>
          <span>•</span>
          <span>{formatViewCount(clip.view_count)}</span>
        </div>
      </CardContent>
    </Card>
  )
})

ClipCard.displayName = 'ClipCard'

export default function EnhancedDiscovery() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [categorizedStreams, setCategorizedStreams] = useState<CategoryStreams[]>([])
  const [topStreams, setTopStreams] = useState<StreamData[]>([])
  const [clips, setClips] = useState<ClipData[]>([])
  const [activeTab, setActiveTab] = useState('categories')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categoryStreams, setCategoryStreams] = useState<StreamData[]>([])
  const { addStream } = useStreamStore()

  // Fetch categorized streams
  const fetchCategorizedStreams = useCallback(async () => {
    try {
      const response = await fetch('/api/twitch/streams-by-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories: [
            'Just Chatting', 'League of Legends', 'VALORANT', 
            'Fortnite', 'Grand Theft Auto V', 'Minecraft',
            'Counter-Strike', 'Apex Legends', 'Call of Duty: Warzone',
            'World of Warcraft', 'Dota 2', 'Overwatch 2'
          ],
          limit: 6 
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCategorizedStreams(data.categorizedStreams)
        setTopStreams(data.topStreams)
      }
    } catch (error) {
      console.error('Error fetching categorized streams:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch popular clips
  const fetchClips = useCallback(async () => {
    try {
      const response = await fetch('/api/twitch/clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: 'week', limit: 12 })
      })

      if (response.ok) {
        const data = await response.json()
        setClips(data.clips)
      }
    } catch (error) {
      console.error('Error fetching clips:', error)
    }
  }, [])

  // Search functionality
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return

    setSearching(true)
    try {
      const response = await fetch('/api/twitch/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 20 })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results)
        setActiveTab('search')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }, [searchQuery])

  // Fetch category streams when category is selected
  const fetchCategoryStreams = useCallback(async (category: string) => {
    try {
      const response = await fetch('/api/twitch/streams-by-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories: [category],
          limit: 50 
        })
      })

      if (response.ok) {
        const data = await response.json()
        const streams = data.categorizedStreams?.[0]?.streams || []
        setCategoryStreams(streams)
      }
    } catch (error) {
      console.error('Error fetching category streams:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategorizedStreams()
    fetchClips()
  }, [fetchCategorizedStreams, fetchClips])

  useEffect(() => {
    if (selectedCategory && activeTab === 'category-view') {
      fetchCategoryStreams(selectedCategory)
    }
  }, [selectedCategory, activeTab, fetchCategoryStreams])

  const handleAddStream = useCallback(async (channelName: string) => {
    const success = await addStream(channelName)
    if (!success) {
      console.log(`Stream ${channelName} already added or invalid`)
    }
  }, [addStream])

  const handlePlayClip = useCallback((clip: ClipData) => {
    // Create a modal or embed player for clips
    // For now, open in new tab but could be enhanced with modal
    window.open(clip.url, '_blank', 'noopener,noreferrer')
  }, [])

  // Filter streams by language
  const filteredStreams = useMemo(() => {
    if (selectedLanguage === 'all') return topStreams
    return topStreams.filter(stream => stream.language === selectedLanguage)
  }, [topStreams, selectedLanguage])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Discover Streams</h1>
            <p className="text-muted-foreground">Find your next favorite streamer</p>
          </div>
          
          {/* Search bar */}
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search streamers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              Search
            </Button>
          </div>
        </div>

        {/* Language filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Language:</span>
          <div className="flex gap-2">
            <Button
              variant={selectedLanguage === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('all')}
            >
              All
            </Button>
            {Object.entries(LANGUAGES).slice(0, 5).map(([code, name]) => (
              <Button
                key={code}
                variant={selectedLanguage === code ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage(code)}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={cn(
          "grid w-full",
          activeTab === 'category-view' ? "grid-cols-5" : "grid-cols-4"
        )}>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="top">Top Streams</TabsTrigger>
          <TabsTrigger value="clips">Popular Clips</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          {activeTab === 'category-view' && (
            <TabsTrigger value="category-view">{selectedCategory}</TabsTrigger>
          )}
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-8 mt-6">
          {categorizedStreams.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {CATEGORY_ICONS[category.category] && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {(() => {
                        const Icon = CATEGORY_ICONS[category.category]
                        return <Icon className="w-5 h-5 text-primary" />
                      })()}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                  <Badge variant="secondary">
                    {category.streams.length} Live
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.category)
                    setActiveTab('category-view')
                  }}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {category.streams.map((stream) => (
                    <div key={stream.id} className="w-[320px] flex-shrink-0">
                      <StreamCard
                        stream={stream}
                        onAddStream={handleAddStream}
                        showCategory={false}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </TabsContent>

        {/* Top Streams Tab */}
        <TabsContent value="top" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onAddStream={handleAddStream}
              />
            ))}
          </div>
        </TabsContent>

        {/* Clips Tab */}
        <TabsContent value="clips" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onPlay={handlePlayClip}
              />
            ))}
          </div>
        </TabsContent>

        {/* Category View Tab */}
        <TabsContent value="category-view" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedCategory}</h2>
              <p className="text-muted-foreground">{categoryStreams.length} live streams</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('categories')}
            >
              ← Back to Categories
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onAddStream={handleAddStream}
              />
            ))}
          </div>
        </TabsContent>

        {/* Search Results Tab */}
        <TabsContent value="search" className="mt-6">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No results found' : 'Enter a search query'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  {result.is_live && result.stream ? (
                    // Live stream card with thumbnail
                    <>
                      <div className="relative aspect-video">
                        <Image
                          src={result.stream.thumbnail_url?.replace('{width}', '440').replace('{height}', '248') || '/placeholder-thumbnail.jpg'}
                          alt={result.title || result.display_name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        
                        {/* Live indicator */}
                        <div className="absolute top-2 left-2 flex items-center gap-2">
                          <Badge className="bg-red-600 text-white border-0">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                            LIVE
                          </Badge>
                        </div>

                        {/* Viewer count */}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-black/70 text-white border-0">
                            <Users className="w-3 h-3 mr-1" />
                            {result.stream.viewer_count?.toLocaleString() || '0'}
                          </Badge>
                        </div>

                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <Button
                            size="lg"
                            className="bg-white/90 text-black hover:bg-white"
                            onClick={() => handleAddStream(result.login)}
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Watch Stream
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {result.profile_image_url && (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={result.profile_image_url}
                                alt={result.display_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate" title={result.title || result.display_name}>
                              {result.title || result.display_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {result.display_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.game_name || 'No category'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // Offline channel card
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {result.profile_image_url ? (
                            <Image
                              src={result.profile_image_url}
                              alt={result.display_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                              {result.display_name[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{result.display_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {result.game_name || 'No category'}
                          </p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            OFFLINE
                          </Badge>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleAddStream(result.login)}
                        variant="outline"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Add Channel
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}