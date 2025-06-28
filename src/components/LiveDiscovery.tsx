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

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitch': return '🟣'
      case 'youtube': return '🔴'
      case 'rumble': return '🟢'
      default: return '📺'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Live Discovery</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            {trendingStreams.filter(s => s.isLive).length} Live
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending Now
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Top Streams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {getCategories().map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* Trending Streams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredStreams.map((stream, index) => (
              <Card key={`${stream.platform}-${stream.name}`} className="hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group border-2 hover:border-blue-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={stream.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.name)}&background=6366f1&color=fff&size=64&bold=true`}
                        alt={stream.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.name)}&background=6366f1&color=fff&size=64&bold=true`
                        }}
                      />
                      {stream.isLive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getPlatformColor(stream.platform)} rounded-full flex items-center justify-center border-2 border-white`}>
                        <span className="text-xs text-white font-bold">
                          {stream.platform === 'twitch' ? 'T' : stream.platform === 'youtube' ? 'Y' : 'R'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors mb-1">
                        {stream.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span className="capitalize font-medium">{stream.platform}</span>
                        <span>•</span>
                        <span>#{index + 1}</span>
                      </div>
                      {stream.viewers && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                          <Users className="h-3 w-3 text-green-500" />
                          <span className="font-semibold text-green-600">{formatViewerCount(stream.viewers)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {stream.category}
                    </Badge>

                    <Button 
                      size="sm" 
                      onClick={() => handleAddStream(stream)}
                      className="w-full h-8 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Watch Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topStreams.slice(0, 20).map((stream, index) => (
              <Card key={`${stream.platform}-${stream.name}-top`} className="hover:shadow-lg transition-shadow cursor-pointer group h-fit">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(stream.name)}&background=random&size=48`}
                        alt={stream.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                        {stream.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`inline-block w-2 h-2 rounded-full ${getPlatformColor(stream.platform)}`}></span>
                        <span className="capitalize">{stream.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-2" title={stream.title}>
                      {stream.title}
                    </p>
                    
                    <Badge variant="secondary" className="text-xs">
                      {stream.game}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{formatViewerCount(stream.viewers)} viewers</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{getPlatformIcon(stream.platform)}</span>
                        <span>#{index + 1}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-8 px-3 text-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => handleAddStream(stream)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                    </div>
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
