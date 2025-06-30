'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTrendingStreams, getTopLiveStreams } from '@/lib/streamStatusReal'
import { useStreamStore } from '@/store/streamStore'
import { Play, Users, Eye, Zap, TrendingUp, Globe } from 'lucide-react'

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
    trendingStreams.forEach(stream => categories.add(stream.category))
    return Array.from(categories)
  }

  const filteredStreams = (selectedCategory === 'all' 
    ? trendingStreams 
    : trendingStreams.filter(stream => stream.category === selectedCategory)
  ).filter(stream => stream.isLive) // Only show live streamers

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitch': return 'bg-purple-500'
      case 'youtube': return 'bg-red-500'
      case 'rumble': return 'bg-green-500'
      default: return 'bg-gray-500'
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
    <div className="space-y-4 p-3 sm:p-6 max-w-full overflow-hidden">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl sm:text-3xl font-bold truncate">Live Discovery</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 py-1 text-xs sm:text-sm flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></div>
            {trendingStreams.filter(s => s.isLive).length} Live
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 self-start sm:self-auto min-h-[44px] px-4"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14">
          <TabsTrigger value="trending" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Trending</span>
            <span className="xs:hidden">Trend</span>
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Top Streams</span>
            <span className="xs:hidden">Top</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4 sm:space-y-6 mt-4">
          {/* Mobile-optimized Category Filter */}
          <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
            {getCategories().map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize whitespace-nowrap min-h-[40px] px-3 text-xs sm:text-sm flex-shrink-0"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* Mobile-optimized Trending Streams Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredStreams.map((stream, index) => (
              <Card 
                key={`${stream.platform}-${stream.name}`} 
                className="touch-manipulation active:scale-95 transition-all duration-200 cursor-pointer group border border-gray-200 active:border-blue-300 !bg-gradient-to-br !from-gray-50 !to-gray-100 hover:!from-blue-50 hover:!to-purple-50 shadow-sm hover:shadow-lg"
              >
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="relative">
                      <img
                        src={getProfileImage(stream, 160)}
                        alt={stream.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = getProfileImage(stream, 160)
                        }}
                        loading="lazy"
                      />
                      {stream.isLive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 ${getPlatformColor(stream.platform)} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}>
                        <span className="text-xs sm:text-sm text-white font-bold">
                          {stream.platform === 'twitch' ? 'T' : stream.platform === 'youtube' ? 'Y' : 'R'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 w-full min-w-0">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg group-active:text-blue-600 transition-colors truncate">
                        {stream.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="capitalize font-medium truncate">{stream.platform}</span>
                        <span>•</span>
                        <span>#{index + 1}</span>
                      </div>
                      
                      {stream.viewers && (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span className="font-semibold text-green-600 truncate">{formatViewerCount(stream.viewers)} viewers</span>
                        </div>
                      )}
                      
                      <Badge variant="secondary" className="text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 max-w-full truncate">
                        {stream.category}
                      </Badge>
                    </div>

                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddStream(stream)
                      }}
                      className="w-full min-h-[44px] text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 transition-all duration-200 shadow-md active:shadow-lg touch-manipulation"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      Watch Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-4 sm:space-y-6 mt-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {topStreams.slice(0, 20).map((stream, index) => (
              <Card 
                key={`${stream.platform}-${stream.name}-top`} 
                className="touch-manipulation active:scale-95 transition-all duration-200 cursor-pointer group border border-gray-200 active:border-blue-200 !bg-gradient-to-br !from-gray-900 !to-gray-800 hover:!from-gray-800 hover:!to-gray-700 shadow-sm hover:shadow-lg text-white"
              >
                <CardContent className="p-3 sm:p-4 lg:p-5">
                  <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={getProfileImage(stream, 128)}
                        alt={stream.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = getProfileImage(stream, 128)
                        }}
                        loading="lazy"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${getPlatformColor(stream.platform)} rounded-full flex items-center justify-center border-2 border-white`}>
                        <span className="text-[10px] sm:text-xs text-white font-bold">
                          {stream.platform === 'twitch' ? 'T' : stream.platform === 'youtube' ? 'Y' : 'R'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base truncate text-white group-active:text-blue-400 transition-colors mb-1">
                        {stream.name}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                        <span className="capitalize font-medium truncate">{stream.platform}</span>
                        <span>•</span>
                        <span>#{index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-300">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                        <span className="font-semibold text-green-400 truncate">{formatViewerCount(stream.viewers)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed" title={stream.title}>
                      {stream.title}
                    </p>
                    
                    <Badge variant="secondary" className="text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 max-w-full truncate">
                      {stream.game}
                    </Badge>

                    <Button 
                      size="sm" 
                      className="w-full min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 transition-all duration-200 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddStream(stream)
                      }}
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
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
