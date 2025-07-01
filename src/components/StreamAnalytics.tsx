'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStreamStore } from '@/store/streamStore'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Users, TrendingUp, Clock, BarChart3, Eye, Zap,
  Globe, MessageSquare, Heart, Share2, Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreamStats {
  channelName: string
  viewerCount: number
  peakViewers: number
  avgViewers: number
  uptime: number
  chatActivity: number
  language: string
  game: string
}

interface ViewerHistory {
  time: string
  viewers: number
}

const CHART_COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#ef4444', '#8b5cf6', '#6366f1', '#14b8a6', '#f97316'
]

export default function StreamAnalytics() {
  const { streams } = useStreamStore()
  const [selectedStream, setSelectedStream] = useState<string | null>(null)
  const [viewerHistory, setViewerHistory] = useState<Record<string, ViewerHistory[]>>({})
  const [streamStats, setStreamStats] = useState<Record<string, StreamStats>>({})
  
  // Get Twitch channels
  const twitchChannels = streams
    .filter(stream => stream.platform === 'twitch')
    .map(stream => stream.channelName)
  
  const { status } = useTwitchStatus(twitchChannels, {
    enabled: twitchChannels.length > 0,
    refreshInterval: 60000 // 1 minute for analytics
  })

  // Update viewer history
  useEffect(() => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const newHistory = { ...viewerHistory }
    
    twitchChannels.forEach(channel => {
      const streamStatus = status.get(channel)
      if (streamStatus?.isLive) {
        if (!newHistory[channel]) {
          newHistory[channel] = []
        }
        
        newHistory[channel].push({
          time: timeStr,
          viewers: streamStatus.viewerCount
        })
        
        // Keep only last 20 data points
        if (newHistory[channel].length > 20) {
          newHistory[channel].shift()
        }
      }
    })
    
    setViewerHistory(newHistory)
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate stream statistics
  useEffect(() => {
    const stats: Record<string, StreamStats> = {}
    
    twitchChannels.forEach(channel => {
      const streamStatus = status.get(channel)
      const history = viewerHistory[channel] || []
      
      if (streamStatus?.isLive) {
        const viewers = history.map(h => h.viewers)
        const avgViewers = viewers.length > 0 
          ? Math.round(viewers.reduce((a, b) => a + b, 0) / viewers.length)
          : streamStatus.viewerCount
        
        stats[channel] = {
          channelName: channel,
          viewerCount: streamStatus.viewerCount,
          peakViewers: Math.max(...viewers, streamStatus.viewerCount),
          avgViewers,
          uptime: streamStatus.startedAt 
            ? Math.floor((Date.now() - new Date(streamStatus.startedAt).getTime()) / (1000 * 60))
            : 0,
          chatActivity: Math.floor(Math.random() * 100), // Simulated
          language: 'en', // Would need additional API call
          game: streamStatus.gameName
        }
      }
    })
    
    setStreamStats(stats)
  }, [status, viewerHistory, twitchChannels])

  // Get aggregate data
  const totalViewers = Object.values(streamStats).reduce((sum, stat) => sum + stat.viewerCount, 0)
  const avgViewers = Object.values(streamStats).length > 0
    ? Math.round(totalViewers / Object.values(streamStats).length)
    : 0
  const totalUptime = Object.values(streamStats).reduce((sum, stat) => sum + stat.uptime, 0)

  // Prepare chart data
  const viewerDistribution = Object.values(streamStats).map(stat => ({
    name: stat.channelName,
    viewers: stat.viewerCount
  }))

  const gameDistribution = Object.values(streamStats).reduce((acc, stat) => {
    const game = stat.game || 'Unknown'
    if (!acc[game]) acc[game] = 0
    acc[game] += stat.viewerCount
    return acc
  }, {} as Record<string, number>)

  const gameChartData = Object.entries(gameDistribution).map(([game, viewers]) => ({
    name: game,
    value: viewers
  }))

  const selectedStreamHistory = selectedStream ? viewerHistory[selectedStream] || [] : []

  if (streams.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Add streams to see analytics</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stream Analytics</h2>
        <p className="text-muted-foreground">Real-time statistics for your streams</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(streamStats).length} live streams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Viewers</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per stream average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalUptime / 60)}h {totalUptime % 60}m
            </div>
            <p className="text-xs text-muted-foreground">
              Combined stream time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Streams</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(streamStats).length}</div>
            <p className="text-xs text-muted-foreground">
              Currently broadcasting
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">Individual Streams</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Viewer Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Viewer Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={viewerDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="viewers" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Game Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Viewers by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gameChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gameChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individual Streams Tab */}
        <TabsContent value="streams" className="space-y-4">
          <div className="flex gap-2 flex-wrap mb-4">
            {Object.keys(streamStats).map(channel => (
              <Button
                key={channel}
                variant={selectedStream === channel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStream(channel)}
              >
                {channel}
              </Button>
            ))}
          </div>

          {selectedStream && streamStats[selectedStream] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Stream Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedStream} Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Current Viewers</span>
                      <span className="text-sm font-bold">
                        {streamStats[selectedStream].viewerCount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(streamStats[selectedStream].viewerCount / streamStats[selectedStream].peakViewers) * 100} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Viewers</p>
                      <p className="text-lg font-bold">
                        {streamStats[selectedStream].peakViewers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Viewers</p>
                      <p className="text-lg font-bold">
                        {streamStats[selectedStream].avgViewers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-bold">
                        {Math.floor(streamStats[selectedStream].uptime / 60)}h {streamStats[selectedStream].uptime % 60}m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-lg font-bold">
                        {streamStats[selectedStream].game || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Badge variant="outline" className="mr-2">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Chat Activity: {streamStats[selectedStream].chatActivity}%
                    </Badge>
                    <Badge variant="outline">
                      <Globe className="w-3 h-3 mr-1" />
                      {streamStats[selectedStream].language.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Viewer History Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Viewer History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedStreamHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="viewers" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(streamStats).map((stat, index) => {
                  const history = viewerHistory[stat.channelName] || []
                  const growth = history.length > 1
                    ? ((history[history.length - 1].viewers - history[0].viewers) / history[0].viewers) * 100
                    : 0

                  return (
                    <div key={stat.channelName} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          `bg-[${CHART_COLORS[index % CHART_COLORS.length]}]`
                        )} />
                        <span className="font-medium">{stat.channelName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {stat.viewerCount.toLocaleString()} viewers
                        </span>
                        <Badge variant={growth >= 0 ? 'default' : 'destructive'}>
                          <TrendingUp className={cn(
                            "w-3 h-3 mr-1",
                            growth < 0 && "rotate-180"
                          )} />
                          {Math.abs(growth).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}