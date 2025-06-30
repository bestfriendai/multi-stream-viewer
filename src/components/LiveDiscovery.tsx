'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTrendingStreams, getTopLiveStreams } from '@/lib/streamStatusReal'
import { useStreamStore } from '@/store/streamStore'
import { Play, Users, Eye, Zap, TrendingUp, Globe, Star, Flame, Crown, Sparkles } from 'lucide-react'
import AvatarImage from './AvatarImage'
import TwitchAvatarImage from './TwitchAvatarImage'
import { getTwitchProfileImage } from '@/lib/twitchApi'

interface LiveStreamer {
  name: string
  platform: string
  category: string
  isLive: boolean
  viewers?: number
  profileImage?: string
  title?: string
  game?: string
}

interface TopStreamer {
  name: string
  platform: string
  viewers: number
  title: string
  game: string
  profileImage?: string
}

export default function LiveDiscovery() {
  const [trendingStreams, setTrendingStreams] = useState<LiveStreamer[]>([])
  const [topStreams, setTopStreams] = useState<TopStreamer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { addStream } = useStreamStore()

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true)
      try {
        const [trending, top] = await Promise.all([
          getTrendingStreams(),
          getTopLiveStreams(50)
        ])
        
        setTrendingStreams(trending)
        setTopStreams(top)
      } catch (error) {
        console.error('Error fetching live data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveData()
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchLiveData, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Function to get proper profile image with better fallback
  const getProfileImage = (stream: LiveStreamer | TopStreamer, size: number = 300) => {
    if (stream.profileImage && stream.profileImage.startsWith('http')) {
      return stream.profileImage
    }
    
    // Generate better looking avatars based on platform
    const colors = {
      twitch: '9146ff',
      youtube: 'ff0000', 
      rumble: '85c742'
    }
    
    const bgColor = colors[stream.platform.toLowerCase() as keyof typeof colors] || '6366f1'
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.name)}&background=${bgColor}&color=fff&size=${size}&bold=true&format=png`
  }

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getCategories = () => {
    const categories = new Set(['all'])
    // Only show categories from live Twitch streams
    trendingStreams
      .filter(stream => stream.isLive && stream.platform.toLowerCase() === 'twitch')
      .forEach(stream => {
        if (stream.category) {
          categories.add(stream.category)
        }
      })
    return Array.from(categories)
  }

  // Filter to show only live Twitch streams
  const filteredStreams = trendingStreams
    .filter(stream => stream.isLive && stream.platform.toLowerCase() === 'twitch')
    .filter(stream =>
      selectedCategory === 'all' || stream.category === selectedCategory
    )

  // Filter top streams to show only live Twitch streams
  const filteredTopStreams = topStreams.filter(stream =>
    stream.platform.toLowerCase() === 'twitch'
  )

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitch': return 'bg-gradient-to-r from-purple-600 to-purple-700'
      case 'youtube': return 'bg-gradient-to-r from-red-600 to-red-700'
      case 'rumble': return 'bg-gradient-to-r from-green-600 to-green-700'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  }


  const handleAddStream = (stream: LiveStreamer | TopStreamer) => {
    const success = addStream(stream.name)
    if (success) {
      // Show success feedback
      console.log(`Added ${stream.name} to streams`)
    } else {
      // Show error feedback
      console.log(`Failed to add ${stream.name} - may already be added or invalid`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Live Discovery</h2>
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen">
      {/* Sleek black header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-gray-800/30 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-xl blur-md opacity-75"></div>
                <div className="relative bg-gradient-to-r from-gray-800 to-black p-3 rounded-xl">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
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
                {trendingStreams.filter(s => s.isLive && s.platform.toLowerCase() === 'twitch').length} Live
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="self-start sm:self-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-300/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 sm:h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-1">
          <TabsTrigger
            value="trending"
            className="flex items-center gap-2 text-sm sm:text-base px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-800 data-[state=active]:to-black data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline font-semibold">Trending</span>
            <span className="xs:hidden font-semibold">Trend</span>
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="flex items-center gap-2 text-sm sm:text-base px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-700 data-[state=active]:to-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline font-semibold">Top Streams</span>
            <span className="xs:hidden font-semibold">Top</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6 mt-6">
          {/* Sleek Category Filter */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-black/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4">
              <div className="flex flex-wrap gap-3 max-w-full overflow-x-auto">
                {getCategories().map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`capitalize whitespace-nowrap min-h-[44px] px-4 text-sm font-medium flex-shrink-0 transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg border-0 hover:from-gray-700 hover:to-gray-900'
                        : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-300/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {category === 'all' ? '⭐ All Categories' : `🎮 ${category}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Trending Streams Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredStreams.map((stream, index) => (
              <Card
                key={stream.uniqueId || `${stream.platform}-${stream.name}-${index}`}
                className="group relative overflow-hidden touch-manipulation active:scale-95 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/10 dark:from-white/5 dark:to-gray-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Trending rank badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-gradient-to-r from-gray-800 to-black text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    #{index + 1}
                  </div>
                </div>

                <CardContent className="relative p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      {/* Subtle dark ring effect */}
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

                      {stream.isLive && (
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
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Flame className="h-3 w-3" />
                          <span className="text-xs font-bold">Trending</span>
                        </div>
                      </div>

                      {stream.viewers && (
                        <div className="flex items-center justify-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 rounded-full px-3 py-1.5">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="font-bold text-green-600 dark:text-green-400">{formatViewerCount(stream.viewers)}</span>
                        </div>
                      )}

                      <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border-0 px-3 py-1.5 text-sm font-medium max-w-full truncate">
                        🎮 {stream.category}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddStream(stream)
                      }}
                      className="w-full min-h-[48px] text-sm font-bold bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredTopStreams.slice(0, 20).map((stream, index) => (
              <Card
                key={`top-${stream.uniqueId || `${stream.platform}-${stream.name}-${index}`}`}
                className="group relative overflow-hidden touch-manipulation active:scale-95 transition-all duration-300 cursor-pointer border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl hover:shadow-gray-900/50 hover:scale-105"
              >
                {/* Subtle dark glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Top rank crown for top 3 */}
                {index < 3 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-1.5 rounded-full shadow-lg">
                      <Crown className="h-3 w-3" />
                    </div>
                  </div>
                )}

                {/* Rank badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    #{index + 1}
                  </div>
                </div>

                <CardContent className="relative p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      {/* Subtle dark avatar glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                      {stream.platform.toLowerCase() === 'twitch' ? (
                        <TwitchAvatarImage
                          username={stream.name}
                          name={stream.name}
                          size={64}
                          platform="twitch"
                          className="relative border-3 border-gray-600 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <AvatarImage
                          src={getProfileImage(stream, 128)}
                          name={stream.name}
                          size={64}
                          platform={stream.platform.toLowerCase() as 'twitch' | 'youtube' | 'rumble'}
                          className="relative border-3 border-gray-600 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110"
                        />
                      )}

                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-gray-600 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>

                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-gray-600 shadow-lg">
                        <span className="text-xs text-white font-bold">
                          T
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base truncate text-white group-hover:text-gray-300 transition-all duration-300 mb-2">
                        {stream.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-2 py-0.5 text-xs font-semibold">
                          TWITCH
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-bold">Top</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="font-bold text-green-400 text-sm">{formatViewerCount(stream.viewers)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed group-hover:text-gray-200 transition-colors duration-300" title={stream.title}>
                      {stream.title}
                    </p>

                    <Badge className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 border border-gray-600/30 px-3 py-1 text-sm font-medium max-w-full truncate">
                      🎮 {stream.game}
                    </Badge>

                    <Button
                      size="sm"
                      className="w-full min-h-[48px] text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddStream(stream)
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
