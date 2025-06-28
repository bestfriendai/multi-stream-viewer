'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, Clock, Eye, Users, Calendar, BarChart3, 
  PieChart, Activity, Award, Target, Zap, Download,
  ChevronUp, ChevronDown, Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { cn, formatDuration } from '@/lib/utils'

interface StreamStats {
  streamerId: string
  platform: string
  totalWatchTime: number
  lastWatched: number
  sessionCount: number
  averageSessionLength: number
  peakViewers?: number
  category?: string
}

interface ViewingPattern {
  hour: number
  dayOfWeek: number
  count: number
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'watchTime' | 'sessions' | 'streamers'>('watchTime')
  const [streamStats, setStreamStats] = useState<StreamStats[]>([])
  const [viewingPatterns, setViewingPatterns] = useState<ViewingPattern[]>([])
  
  const { analytics, user } = useAppStore()
  
  useEffect(() => {
    // Calculate stream statistics from analytics data
    calculateStreamStats()
    calculateViewingPatterns()
  }, [analytics, timeRange])
  
  const calculateStreamStats = () => {
    const stats = new Map<string, StreamStats>()
    const now = Date.now()
    const rangeStart = getTimeRangeStart(timeRange)
    
    // Safety check for analytics data
    if (!analytics?.streamingHistory) {
      setStreamStats([])
      return
    }
    
    // Filter sessions by time range
    const sessions = analytics.streamingHistory.filter(session => 
      session.startTime >= rangeStart && session.startTime <= now
    )
    
    // Aggregate stats by streamer
    sessions.forEach(session => {
      const key = `${session.platform}:${session.streamerId}`
      const existing = stats.get(key) || {
        streamerId: session.streamerId,
        platform: session.platform,
        totalWatchTime: 0,
        lastWatched: 0,
        sessionCount: 0,
        averageSessionLength: 0,
        category: session.platform
      }
      
      const duration = session.endTime - session.startTime
      existing.totalWatchTime += duration
      existing.sessionCount += 1
      existing.lastWatched = Math.max(existing.lastWatched, session.endTime)
      existing.averageSessionLength = existing.totalWatchTime / existing.sessionCount
      
      stats.set(key, existing)
    })
    
    // Sort by total watch time
    const sortedStats = Array.from(stats.values())
      .sort((a, b) => b.totalWatchTime - a.totalWatchTime)
    
    setStreamStats(sortedStats)
  }
  
  const calculateViewingPatterns = () => {
    const patterns = new Map<string, ViewingPattern>()
    
    // Safety check for analytics data
    if (!analytics?.streamingHistory) {
      setViewingPatterns([])
      return
    }
    
    analytics.streamingHistory.forEach(session => {
      const date = new Date(session.startTime)
      const hour = date.getHours()
      const dayOfWeek = date.getDay()
      const key = `${hour}-${dayOfWeek}`
      
      const existing = patterns.get(key) || { hour, dayOfWeek, count: 0 }
      existing.count += 1
      patterns.set(key, existing)
    })
    
    setViewingPatterns(Array.from(patterns.values()))
  }
  
  const getTimeRangeStart = (range: typeof timeRange): number => {
    const now = Date.now()
    switch (range) {
      case 'day': return now - 24 * 60 * 60 * 1000
      case 'week': return now - 7 * 24 * 60 * 60 * 1000
      case 'month': return now - 30 * 24 * 60 * 60 * 1000
      case 'all': return 0
    }
  }
  
  const formatAnalyticsDuration = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  const getHeatmapColor = (count: number, maxCount: number): string => {
    const intensity = count / maxCount
    if (intensity > 0.8) return 'bg-purple-600'
    if (intensity > 0.6) return 'bg-purple-500'
    if (intensity > 0.4) return 'bg-purple-400'
    if (intensity > 0.2) return 'bg-purple-300'
    return 'bg-purple-200'
  }
  
  // Calculate key metrics with safety checks
  const totalWatchTime = streamStats.reduce((sum, stat) => sum + stat.totalWatchTime, 0)
  const totalSessions = analytics?.streamingHistory?.length || 0
  const uniqueStreamers = new Set(streamStats.map(s => s.streamerId)).size
  const averageSessionLength = totalSessions > 0 ? totalWatchTime / totalSessions : 0
  
  // Find peak viewing hour
  const hourCounts = viewingPatterns.reduce((acc, pattern) => {
    acc[pattern.hour] = (acc[pattern.hour] || 0) + pattern.count
    return acc
  }, {} as Record<number, number>)
  const peakHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '0'
  
  // Calculate week-over-week growth
  const lastWeekStart = getTimeRangeStart('week') - 7 * 24 * 60 * 60 * 1000
  const lastWeekSessions = analytics?.streamingHistory?.filter(s => 
    s.startTime >= lastWeekStart && s.startTime < getTimeRangeStart('week')
  )?.length || 0
  const weekGrowth = totalSessions > 0 && lastWeekSessions > 0
    ? ((totalSessions - lastWeekSessions) / lastWeekSessions) * 100
    : 0
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track your viewing habits and discover insights
          </p>
        </div>
        
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as const).map(range => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-muted-foreground" size={20} />
            <Badge variant="secondary" className="text-xs">
              {weekGrowth > 0 ? (
                <><ChevronUp size={12} /> {weekGrowth.toFixed(0)}%</>
              ) : (
                <><ChevronDown size={12} /> {Math.abs(weekGrowth).toFixed(0)}%</>
              )}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{formatAnalyticsDuration(totalWatchTime)}</p>
            <p className="text-xs text-muted-foreground">Total Watch Time</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-muted-foreground" size={20} />
            <Sparkles className="text-yellow-500" size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{totalSessions}</p>
            <p className="text-xs text-muted-foreground">Stream Sessions</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-muted-foreground" size={20} />
            <Badge variant="outline" className="text-xs">{peakHour}:00</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{uniqueStreamers}</p>
            <p className="text-xs text-muted-foreground">Unique Streamers</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-muted-foreground" size={20} />
            <div className="w-16 h-16">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(totalWatchTime / (24 * 60 * 60 * 1000)) * 251.2} 251.2`}
                  className="text-purple-600"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{formatAnalyticsDuration(averageSessionLength)}</p>
            <p className="text-xs text-muted-foreground">Avg Session</p>
          </div>
        </Card>
      </div>
      
      {/* Top Streamers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Award size={20} />
            Top Streamers
          </h4>
          <Button size="sm" variant="outline">
            <Download size={14} className="mr-1" />
            Export
          </Button>
        </div>
        
        <div className="space-y-3">
          {streamStats.slice(0, 10).map((stat, idx) => {
            const percentage = (stat.totalWatchTime / totalWatchTime) * 100
            
            return (
              <div key={`${stat.platform}-${stat.streamerId}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      idx === 0 && "bg-yellow-500 text-yellow-950",
                      idx === 1 && "bg-gray-400 text-gray-950",
                      idx === 2 && "bg-orange-600 text-orange-950",
                      idx > 2 && "bg-muted text-muted-foreground"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{stat.streamerId}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.platform} • {stat.category || 'Gaming'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatAnalyticsDuration(stat.totalWatchTime)}</p>
                    <p className="text-xs text-muted-foreground">{stat.sessionCount} sessions</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Viewing Patterns Heatmap */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar size={20} />
          Viewing Patterns
        </h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-25 gap-1 text-xs">
            <div className="col-span-1"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-center text-muted-foreground">
                {i}
              </div>
            ))}
          </div>
          
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIdx) => (
            <div key={day} className="grid grid-cols-25 gap-1">
              <div className="text-xs text-muted-foreground">{day}</div>
              {Array.from({ length: 24 }, (_, hourIdx) => {
                const pattern = viewingPatterns.find(p => 
                  p.dayOfWeek === dayIdx && p.hour === hourIdx
                )
                const maxCount = Math.max(...viewingPatterns.map(p => p.count))
                
                return (
                  <div
                    key={hourIdx}
                    className={cn(
                      "aspect-square rounded-sm",
                      pattern ? getHeatmapColor(pattern.count, maxCount) : "bg-muted"
                    )}
                    title={pattern ? `${pattern.count} sessions` : 'No activity'}
                  />
                )
              })}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {['bg-muted', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600'].map(color => (
              <div key={color} className={cn("w-3 h-3 rounded-sm", color)} />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>
      
      {/* Achievements */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Zap size={20} />
          Achievements
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { 
              name: 'Early Bird', 
              desc: 'Watch 10 morning streams', 
              progress: 7, 
              total: 10,
              icon: '🌅'
            },
            { 
              name: 'Night Owl', 
              desc: 'Watch 20 late night streams', 
              progress: 15, 
              total: 20,
              icon: '🦉'
            },
            { 
              name: 'Variety Viewer', 
              desc: 'Watch 50 different streamers', 
              progress: uniqueStreamers, 
              total: 50,
              icon: '🎭'
            },
            { 
              name: 'Marathon Watcher', 
              desc: 'Watch for 24 hours total', 
              progress: Math.floor(totalWatchTime / (60 * 60 * 1000)), 
              total: 24,
              icon: '🏃'
            }
          ].map(achievement => (
            <div key={achievement.name} className="text-center space-y-2">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">{achievement.desc}</p>
              </div>
              <Progress 
                value={(achievement.progress / achievement.total) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {achievement.progress} / {achievement.total}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}