'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTrendingStreams, getTopLiveStreams } from '@/lib/streamStatusReal'
import { useStreamStore } from '@/store/streamStore'
import { Play, Users, Eye, Zap, TrendingUp, Globe, Star, Flame, Crown, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy load avatar components to improve initial load
const AvatarImage = dynamic(() => import('./AvatarImage'), { 
  loading: () => <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
})
const TwitchAvatarImage = dynamic(() => import('./TwitchAvatarImage'), { 
  loading: () => <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
})

interface LiveStreamer {
  name: string
  platform: string
  category: string
  isLive: boolean
  viewers?: number
  profileImage?: string
  title?: string
  game?: string
  uniqueId?: string
}

interface TopStreamer {
  name: string
  platform: string
  viewers: number
  title: string
  game: string
  profileImage?: string
  uniqueId?: string
}

// Memoized stream card component
const StreamCard = memo(({ 
  stream, 
  index, 
  onAddStream 
}: { 
  stream: LiveStreamer | TopStreamer; 
  index: number; 
  onAddStream: (stream: LiveStreamer | TopStreamer) => void 
}) => {
  const getProfileImage = useCallback((stream: LiveStreamer | TopStreamer, size: number = 300) => {
    if (stream.profileImage && stream.profileImage.startsWith('http')) {
      return stream.profileImage
    }
    
    const colors = {
      twitch: '9146ff',
      youtube: 'ff0000', 
      rumble: '85c742'
    }
    
    const bgColor = colors[stream.platform.toLowerCase() as keyof typeof colors] || '6366f1'
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.name)}&background=${bgColor}&color=fff&size=${size}&bold=true&format=png`
  }, [])

  const formatViewerCount = useCallback((count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }, [])

  const getPlatformColor = useCallback((platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitch': return 'bg-gradient-to-r from-purple-600 to-purple-700'
      case 'youtube': return 'bg-gradient-to-r from-red-600 to-red-700'
      case 'rumble': return 'bg-gradient-to-r from-green-600 to-green-700'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddStream(stream)
  }, [stream, onAddStream])

  const isTopStreamer = 'viewers' in stream && 'title' in stream

  return (
    <Card
      className="group relative overflow-hidden touch-manipulation active:scale-95 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl hover:scale-105"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/10 dark:from-white/5 dark:to-gray-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {!isTopStreamer && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-gray-800 to-black text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            #{index + 1}
          </div>
        </div>
      )}

      <CardContent className="relative p-4 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

            {stream.platform.toLowerCase() === 'twitch' ? (
              <TwitchAvatarImage
                username={stream.name}
                name={stream.name}
                size={96}
                platform="twitch"
                className="relative border-4 border-white dark:border-gray-700 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110"
              />
            ) : (
              <AvatarImage
                src={getProfileImage(stream, 160)}
                name={stream.name}
                size={96}
                platform={stream.platform.toLowerCase() as 'twitch' | 'youtube' | 'rumble'}
                className="relative border-4 border-white dark:border-gray-700 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110"
              />
            )}

            {'isLive' in stream && stream.isLive && (
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-3 border-white dark:border-gray-700 shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}

            <div className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 ${getPlatformColor(stream.platform)} rounded-full flex items-center justify-center border-3 border-white dark:border-gray-700 shadow-lg`}>
              <span className="text-xs text-white font-bold">
                T
              </span>
            </div>
          </div>

          <div className="space-y-3 w-full min-w-0">
            <h3 className="font-bold text-base sm:text-lg bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-900 dark:group-hover:from-gray-200 dark:group-hover:to-white transition-all duration-300 truncate">
              {stream.name}
            </h3>

            <div className="flex items-center justify-center gap-2 text-sm">
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-2 py-1 text-xs font-semibold">
                TWITCH
              </Badge>
            </div>

            {stream.viewers && (
              <div className="flex items-center justify-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 rounded-full px-3 py-1.5">
                <Users className="h-4 w-4 text-green-500" />
                <span className="font-bold text-green-600 dark:text-green-400">{formatViewerCount(stream.viewers)}</span>
              </div>
            )}

            {isTopStreamer && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed" title={stream.title}>
                  {stream.title}
                </p>
                <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border-0 px-3 py-1.5 text-sm font-medium max-w-full truncate">
                  🎮 {stream.game}
                </Badge>
              </>
            )}

            {!isTopStreamer && 'category' in stream && (
              <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border-0 px-3 py-1.5 text-sm font-medium max-w-full truncate">
                🎮 {stream.category}
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleClick}
            className="w-full min-h-[48px] text-sm font-bold bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch Live
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

StreamCard.displayName = 'StreamCard'

export default function LiveDiscoveryOptimized() {
  const [trendingStreams, setTrendingStreams] = useState<LiveStreamer[]>([])
  const [topStreams, setTopStreams] = useState<TopStreamer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const { addStream } = useStreamStore()

  // Use useCallback to prevent recreation of functions
  const fetchLiveData = useCallback(async () => {
    try {
      const [trending, top] = await Promise.all([
        getTrendingStreams(),
        getTopLiveStreams(20) // Reduced from 50 to improve performance
      ])
      
      setTrendingStreams(trending)
      setTopStreams(top)
      setError(null)
    } catch (error) {
      console.error('Error fetching live data:', error)
      setError('Failed to load streams. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch with delay to prevent blocking
    const initialFetch = setTimeout(() => {
      fetchLiveData()
    }, 100)

    // Set up refresh with longer interval
    const interval = setInterval(fetchLiveData, 5 * 60 * 1000) // 5 minutes instead of 2
    
    return () => {
      clearTimeout(initialFetch)
      clearInterval(interval)
    }
  }, [fetchLiveData])

  const handleAddStream = useCallback((stream: LiveStreamer | TopStreamer) => {
    const success = addStream(stream.name)
    if (!success) {
      console.log(`Stream ${stream.name} already added or invalid`)
    }
  }, [addStream])

  // Memoize categories calculation
  const categories = useMemo(() => {
    const cats = new Set(['all'])
    trendingStreams
      .filter(stream => stream.isLive && stream.platform.toLowerCase() === 'twitch')
      .forEach(stream => {
        if (stream.category) {
          cats.add(stream.category)
        }
      })
    return Array.from(cats)
  }, [trendingStreams])

  // Memoize filtered streams
  const filteredStreams = useMemo(() => 
    trendingStreams
      .filter(stream => stream.isLive && stream.platform.toLowerCase() === 'twitch')
      .filter(stream => selectedCategory === 'all' || stream.category === selectedCategory)
      .slice(0, 20), // Limit displayed items
    [trendingStreams, selectedCategory]
  )

  const filteredTopStreams = useMemo(() => 
    topStreams.filter(stream => stream.platform.toLowerCase() === 'twitch').slice(0, 20),
    [topStreams]
  )

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Live Discovery</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchLiveData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative bg-gradient-to-r from-gray-800 to-black p-3 rounded-xl">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Live Discovery
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Discover live Twitch streams happening right now
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 px-3 py-1.5 text-sm font-semibold shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {filteredStreams.length} Live
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLiveData}
              className="self-start sm:self-auto"
            >
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 sm:h-16">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-2">
            <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold">Top Streams</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6 mt-6">
          {/* Category Filter */}
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap gap-3 max-w-full overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize whitespace-nowrap min-h-[44px] px-4"
                >
                  {category === 'all' ? '⭐ All Categories' : `🎮 ${category}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Trending Streams Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredStreams.map((stream, index) => (
              <StreamCard
                key={stream.uniqueId || `${stream.platform}-${stream.name}-${index}`}
                stream={stream}
                index={index}
                onAddStream={handleAddStream}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredTopStreams.map((stream, index) => (
              <StreamCard
                key={stream.uniqueId || `top-${stream.platform}-${stream.name}-${index}`}
                stream={stream}
                index={index}
                onAddStream={handleAddStream}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}