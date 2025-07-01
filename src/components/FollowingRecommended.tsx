'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStreamStore } from '@/store/streamStore'
import { 
  Heart, Star, TrendingUp, Users, Eye, Clock, Play,
  Bell, BellOff, Sparkles, UserPlus, Settings
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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

interface FollowedChannel {
  channelName: string
  platform: string
  notifications: boolean
  addedAt: string
  lastWatched?: string
}

export default function FollowingRecommended() {
  const { addStream } = useStreamStore()
  const [activeTab, setActiveTab] = useState('following')
  const [followedChannels, setFollowedChannels] = useState<FollowedChannel[]>([])
  const [liveFollowedStreams, setLiveFollowedStreams] = useState<StreamData[]>([])
  const [recommendedStreams, setRecommendedStreams] = useState<StreamData[]>([])
  const [viewingHistory, setViewingHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedFollows = localStorage.getItem('followedChannels')
    const savedHistory = localStorage.getItem('viewingHistory')
    const savedNotifications = localStorage.getItem('notificationsEnabled')
    
    if (savedFollows) {
      setFollowedChannels(JSON.parse(savedFollows))
    }
    if (savedHistory) {
      setViewingHistory(JSON.parse(savedHistory))
    }
    if (savedNotifications) {
      setNotificationsEnabled(JSON.parse(savedNotifications))
    }
  }, [])

  // Save followed channels
  const saveFollowedChannels = useCallback((channels: FollowedChannel[]) => {
    setFollowedChannels(channels)
    localStorage.setItem('followedChannels', JSON.stringify(channels))
  }, [])

  // Toggle follow
  const toggleFollow = useCallback((channelName: string, platform: string = 'twitch') => {
    const existing = followedChannels.find(
      c => c.channelName === channelName && c.platform === platform
    )
    
    if (existing) {
      saveFollowedChannels(
        followedChannels.filter(c => c.channelName !== channelName || c.platform !== platform)
      )
    } else {
      saveFollowedChannels([
        ...followedChannels,
        {
          channelName,
          platform,
          notifications: true,
          addedAt: new Date().toISOString()
        }
      ])
    }
  }, [followedChannels, saveFollowedChannels])

  // Toggle notifications for a channel
  const toggleChannelNotifications = useCallback((channelName: string, platform: string) => {
    const updated = followedChannels.map(channel => {
      if (channel.channelName === channelName && channel.platform === platform) {
        return { ...channel, notifications: !channel.notifications }
      }
      return channel
    })
    saveFollowedChannels(updated)
  }, [followedChannels, saveFollowedChannels])

  // Fetch live status for followed channels
  const fetchFollowedStreams = useCallback(async () => {
    if (followedChannels.length === 0) {
      setLiveFollowedStreams([])
      setLoading(false)
      return
    }

    try {
      const twitchChannels = followedChannels
        .filter(c => c.platform === 'twitch')
        .map(c => c.channelName)
      
      if (twitchChannels.length > 0) {
        const response = await fetch('/api/twitch/streams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_login: twitchChannels,
            first: 100 
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setLiveFollowedStreams(data.streams)
        }
      }
    } catch (error) {
      console.error('Error fetching followed streams:', error)
    } finally {
      setLoading(false)
    }
  }, [followedChannels])

  // Fetch recommended streams based on viewing history and follows
  const fetchRecommendedStreams = useCallback(async () => {
    try {
      // Get categories from followed channels
      const followedCategories = new Set<string>()
      liveFollowedStreams.forEach(stream => {
        if (stream.game_name) followedCategories.add(stream.game_name)
      })
      
      // For now, fetch popular streams as recommendations
      // In production, this would use a recommendation engine
      const response = await fetch('/api/twitch/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first: 20 })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Filter out already followed channels
        const followedNames = followedChannels.map(c => c.channelName)
        const recommendations = data.streams.filter(
          (stream: StreamData) => !followedNames.includes(stream.user_login)
        )
        setRecommendedStreams(recommendations.slice(0, 12))
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }, [followedChannels, liveFollowedStreams])

  // Update viewing history
  const updateViewingHistory = useCallback((channelName: string) => {
    const updated = [channelName, ...viewingHistory.filter(c => c !== channelName)].slice(0, 50)
    setViewingHistory(updated)
    localStorage.setItem('viewingHistory', JSON.stringify(updated))
  }, [viewingHistory])

  // Handle adding stream and updating history
  const handleAddStream = useCallback(async (channelName: string) => {
    const success = await addStream(channelName)
    if (success) {
      updateViewingHistory(channelName)
    }
  }, [addStream, updateViewingHistory])

  // Request notification permission
  const enableNotifications = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      const enabled = permission === 'granted'
      setNotificationsEnabled(enabled)
      localStorage.setItem('notificationsEnabled', JSON.stringify(enabled))
      
      if (enabled) {
        new Notification('Streamyyy Notifications Enabled', {
          body: 'You\'ll be notified when followed channels go live!',
          icon: '/icon-192.png'
        })
      }
    }
  }, [])

  useEffect(() => {
    fetchFollowedStreams()
  }, [fetchFollowedStreams])

  useEffect(() => {
    if (liveFollowedStreams.length > 0 || followedChannels.length > 0) {
      fetchRecommendedStreams()
    }
  }, [fetchRecommendedStreams, liveFollowedStreams.length, followedChannels.length])

  // Auto-refresh live status
  useEffect(() => {
    const interval = setInterval(fetchFollowedStreams, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchFollowedStreams])

  const StreamCard = ({ stream, isFollowed = false }: { stream: StreamData; isFollowed?: boolean }) => {
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
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video">
          <Image
            src={stream.thumbnail_url.replace('{width}', '440').replace('{height}', '248')}
            alt={stream.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Badge className="bg-red-600 text-white border-0">
              LIVE
            </Badge>
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(stream.started_at)}
            </Badge>
          </div>

          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              <Users className="w-3 h-3 mr-1" />
              {formatViewerCount(stream.viewer_count)}
            </Badge>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="flex gap-2">
              <Button
                size="lg"
                className="bg-white/90 text-black hover:bg-white"
                onClick={() => handleAddStream(stream.user_login)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch
              </Button>
              <Button
                size="icon"
                variant={isFollowed ? "secondary" : "outline"}
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFollow(stream.user_login, 'twitch')
                }}
              >
                <Heart className={cn("w-5 h-5", isFollowed && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
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
              <h3 className="font-semibold truncate" title={stream.title}>
                {stream.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {stream.user_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {stream.game_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Streams</h2>
          <p className="text-muted-foreground">Follow channels and get personalized recommendations</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
              <DialogDescription>
                Get notified when your favorite streamers go live
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={enableNotifications}
                />
              </div>
              
              {notificationsEnabled && (
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive browser notifications when followed channels go live
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="following" className="gap-2">
            <Heart className="w-4 h-4" />
            Following ({followedChannels.length})
          </TabsTrigger>
          <TabsTrigger value="recommended" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Recommended
          </TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="space-y-6">
          {followedChannels.length === 0 ? (
            <Card className="p-12 text-center">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Followed Channels</h3>
              <p className="text-muted-foreground mb-4">
                Start following channels to see when they go live
              </p>
              <Button onClick={() => setActiveTab('recommended')}>
                Discover Channels
              </Button>
            </Card>
          ) : (
            <>
              {/* Live followed streams */}
              {liveFollowedStreams.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    Live Now
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {liveFollowedStreams.map(stream => (
                      <StreamCard key={stream.id} stream={stream} isFollowed={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* All followed channels */}
              <div>
                <h3 className="text-lg font-semibold mb-4">All Followed Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followedChannels.map(channel => {
                    const isLive = liveFollowedStreams.some(
                      s => s.user_login === channel.channelName
                    )
                    
                    return (
                      <Card key={`${channel.platform}-${channel.channelName}`} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              {channel.channelName[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold">{channel.channelName}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs">
                                  {isLive ? 'LIVE' : 'OFFLINE'}
                                </Badge>
                                <span>{channel.platform}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleChannelNotifications(channel.channelName, channel.platform)}
                            >
                              {channel.notifications ? (
                                <Bell className="w-4 h-4" />
                              ) : (
                                <BellOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleFollow(channel.channelName, channel.platform)}
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recommended For You
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Based on your viewing history and followed channels
            </p>
            
            {recommendedStreams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendedStreams.map(stream => (
                  <StreamCard 
                    key={stream.id} 
                    stream={stream} 
                    isFollowed={followedChannels.some(c => c.channelName === stream.user_login)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground">
                  Follow some channels to get personalized recommendations
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}