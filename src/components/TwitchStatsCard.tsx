'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Clock,
  Users,
  Calendar,
  Play,
  ExternalLink,
  Tag,
  Globe,
  Video,
  TrendingUp,
  Star,
  Gamepad2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnhancedTwitchStats } from '@/app/api/twitch/stats/route'

interface TwitchStatsCardProps {
  channel: string
  className?: string
  compact?: boolean
  showExtendedInfo?: boolean
}

export default function TwitchStatsCard({ 
  channel, 
  className, 
  compact = false,
  showExtendedInfo = false 
}: TwitchStatsCardProps) {
  const [stats, setStats] = useState<EnhancedTwitchStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchEnhancedStats()
  }, [channel])

  const fetchEnhancedStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/twitch/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channels: [channel] }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      const result = data.results?.[0]
      
      if (result) {
        setStats(result)
      } else {
        setError('No data available')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className={cn("w-full border-destructive/20", className)}>
        <CardContent className="p-4">
          <p className="text-sm text-destructive">Failed to load stats for {channel}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEnhancedStats}
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { streamData, channelData, recentClips, recentVideos, gameData, metrics } = stats

  if (compact) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {channelData?.profile_image_url && (
              <div className="relative w-10 h-10">
                <Image
                  src={channelData.profile_image_url}
                  alt={`${channelData.display_name} profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  sizes="40px"
                  priority={false}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{channelData?.display_name || channel}</h3>
                {stats.isLive && (
                  <Badge variant="destructive" className="bg-red-600">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                    LIVE
                  </Badge>
                )}
              </div>
              {streamData && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(streamData.viewer_count)}
                  </span>
                  {streamData.uptime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {streamData.uptime}
                    </span>
                  )}
                  {streamData.game_name && (
                    <span className="truncate">{streamData.game_name}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-0">
        {/* Header with avatar and basic info */}
        <div className="p-4 border-b">
          <div className="flex items-start gap-3">
            {channelData?.profile_image_url && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={channelData.profile_image_url}
                  alt={`${channelData.display_name} profile`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  sizes="48px"
                  priority={false}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{channelData?.display_name || channel}</h3>
                {stats.isLive && (
                  <Badge variant="destructive" className="bg-red-600">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                    LIVE
                  </Badge>
                )}
                {channelData?.broadcaster_type === 'partner' && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Star className="w-3 h-3 mr-1" />
                    Partner
                  </Badge>
                )}
              </div>
              
              {streamData?.title && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {streamData.title}
                </p>
              )}

              {/* Live stream stats */}
              {streamData && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(streamData.viewer_count)}
                  </span>
                  {streamData.uptime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {streamData.uptime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {streamData.language.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="ml-2"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Game info */}
        {streamData?.game_name && (
          <div className="px-4 py-2 bg-muted/30">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{streamData.game_name}</span>
              {streamData.is_mature && (
                <Badge variant="outline" className="text-xs">18+</Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {streamData?.tags && streamData.tags.length > 0 && (
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {streamData.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {streamData.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{streamData.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <>
            {/* Channel stats */}
            {channelData && (
              <div className="px-4 py-3 border-b">
                <h4 className="font-medium mb-2">Channel Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>Total Views: {formatNumber(channelData.view_count)}</span>
                  </div>
                  {channelData.account_age && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Account Age: {channelData.account_age}</span>
                    </div>
                  )}
                </div>
                {channelData.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {channelData.description}
                  </p>
                )}
              </div>
            )}

            {/* Recent Clips */}
            {recentClips.length > 0 && (
              <div className="px-4 py-3 border-b">
                <h4 className="font-medium mb-2">Recent Clips</h4>
                <div className="space-y-2">
                  {recentClips.slice(0, 2).map((clip) => (
                    <div key={clip.id} className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{clip.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatNumber(clip.view_count)} views</span>
                          <span>•</span>
                          <span>{formatDuration(clip.duration)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(clip.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Videos */}
            {recentVideos.length > 0 && (
              <div className="px-4 py-3">
                <h4 className="font-medium mb-2">Recent Videos</h4>
                <div className="space-y-2">
                  {recentVideos.slice(0, 1).map((video) => (
                    <div key={video.id} className="flex items-center gap-2 text-sm">
                      <Play className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{video.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatNumber(video.view_count)} views</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{video.type}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(video.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action buttons */}
        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  metrics.contentRating === 'mature' && "border-orange-500 text-orange-700"
                )}
              >
                {metrics.contentRating === 'mature' ? '18+' : 'Family Friendly'}
              </Badge>
              {metrics.streamFrequency && (
                <Badge variant="secondary" className="text-xs">
                  {metrics.streamFrequency}
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://twitch.tv/${channel}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View on Twitch
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}