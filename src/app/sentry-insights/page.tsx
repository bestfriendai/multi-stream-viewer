'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, 
  AlertTriangle, 
  Bug, 
  Eye, 
  BarChart3, 
  Users, 
  Zap,
  Clock,
  Monitor,
  Smartphone,
  Wifi,
  Database,
  ExternalLink
} from 'lucide-react'
import * as Sentry from "@sentry/nextjs"
import { 
  UserJourneyTracker, 
  PerformanceMonitor, 
  StreamMonitor, 
  ErrorContextManager,
  RealtimeDebugger 
} from '@/lib/sentry-insights'

export default function SentryInsightsPage() {
  const [performanceData, setPerformanceData] = useState<any>({})
  const [userJourney, setUserJourney] = useState<any>({})
  const [realtimeLogs, setRealtimeLogs] = useState<any[]>([])
  const [isCapturingInsights, setIsCapturingInsights] = useState(false)

  useEffect(() => {
    // Get initial data
    const journey = UserJourneyTracker.getInstance()
    setUserJourney(journey.getJourneyData())
    setRealtimeLogs(RealtimeDebugger.getLogs())

    // Track page visit
    journey.trackAction('view_sentry_insights', { page: '/sentry-insights' })
    
    // Set up real-time updates
    const interval = setInterval(() => {
      setUserJourney(journey.getJourneyData())
      setRealtimeLogs(RealtimeDebugger.getLogs())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const generateTestInsights = async () => {
    setIsCapturingInsights(true)
    
    try {
      // Generate various test scenarios for insights
      RealtimeDebugger.log('info', 'Starting comprehensive insights test')
      
      // Test performance measurement
      const perfTest = PerformanceMonitor.startMeasurement('insights_test_operation')
      await new Promise(resolve => setTimeout(resolve, 500))
      perfTest()
      
      // Test user journey tracking
      const journey = UserJourneyTracker.getInstance()
      journey.trackAction('test_insights_generation')
      
      // Test error categorization
      try {
        throw new Error('Test API error for insights categorization')
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            'test': 'true',
            'error.category': 'api',
            'insights.test': 'error_categorization'
          }
        })
      }
      
      // Test stream monitoring
      StreamMonitor.trackStreamLoad('test-stream-123', 'twitch', Date.now() - 1500)
      
      // Test feature flags
      ErrorContextManager.addFeatureFlag('insights_dashboard', true)
      ErrorContextManager.addExperiment('dashboard_layout', 'v2')
      
      // Test performance monitoring
      PerformanceMonitor.trackWebVital('first-contentful-paint', 850, 'good')
      PerformanceMonitor.trackWebVital('largest-contentful-paint', 3200, 'needs-improvement')
      
      RealtimeDebugger.log('info', 'Insights test completed successfully', {
        testsRun: 6,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      RealtimeDebugger.log('error', 'Insights test failed', { error: error.message })
    } finally {
      setIsCapturingInsights(false)
    }
  }

  const exportDebuggingData = () => {
    const data = RealtimeDebugger.exportLogs()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentry-debugging-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-600" />
          Sentry Insights Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive monitoring, debugging, and analytics for multi-stream-viewer
        </p>
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={generateTestInsights} 
            disabled={isCapturingInsights}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCapturingInsights ? 'Generating...' : 'Generate Test Insights'}
          </Button>
          <Button 
            onClick={exportDebuggingData}
            variant="outline"
          >
            Export Debug Data
          </Button>
          <Button 
            asChild
            variant="outline"
          >
            <a href="https://block-browser.sentry.io/projects/multi-stream-viewer/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Sentry Dashboard
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="debug">Debug Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor((userJourney.duration || 0) / 1000 / 60)}m {Math.floor(((userJourney.duration || 0) / 1000) % 60)}s
                </div>
                <p className="text-xs text-muted-foreground">Current session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Actions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userJourney.actions?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Tracked interactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Debug Logs</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realtimeLogs.length}</div>
                <p className="text-xs text-muted-foreground">Real-time entries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Device Type</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof window !== 'undefined' && window.innerWidth <= 768 ? (
                    <><Smartphone className="h-6 w-6 inline mr-2" />Mobile</>
                  ) : (
                    <><Monitor className="h-6 w-6 inline mr-2" />Desktop</>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sentry Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Tracking</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Monitoring</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Replay</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Feedback</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Custom Insights</span>
                <Badge variant="default" className="bg-blue-500">Enhanced</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
                <CardDescription>Real-time performance monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Page Load Time</span>
                    <span className="font-mono">
                      {typeof window !== 'undefined' && performance.timing ? 
                        `${performance.timing.loadEventEnd - performance.timing.navigationStart}ms` : 
                        'Measuring...'
                      }
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-mono">
                      {typeof window !== 'undefined' && (performance as any).memory ? 
                        `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
                        'Unknown'
                      }
                    </span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Connection Speed</span>
                    <span className="font-mono">
                      {typeof window !== 'undefined' ? 
                        (navigator as any).connection?.effectiveType || 'Unknown' : 
                        'Unknown'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Web Vitals Tracking
                </CardTitle>
                <CardDescription>Core performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">Good</div>
                    <div className="text-sm text-muted-foreground">FCP</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">Needs Work</div>
                    <div className="text-sm text-muted-foreground">LCP</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Performance metrics are automatically tracked and sent to Sentry
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Categorization & Tracking
              </CardTitle>
              <CardDescription>Advanced error insights and categorization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-blue-600">Stream Errors</div>
                  <div className="text-sm text-muted-foreground">Twitch/YouTube embeds</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-red-600">API Errors</div>
                  <div className="text-sm text-muted-foreground">Network & fetch issues</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-orange-600">UI Errors</div>
                  <div className="text-sm text-muted-foreground">Component & render issues</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-purple-600">Performance</div>
                  <div className="text-sm text-muted-foreground">Timeout & memory issues</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Enhanced Error Context</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Device Type Tracking</span>
                    <Badge variant="outline">Mobile/Desktop/Tablet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Stream Context</span>
                    <Badge variant="outline">Stream Count & Platform</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Context</span>
                    <Badge variant="outline">Load Times & Memory</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Context</span>
                    <Badge variant="outline">Connection Type & Status</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                User Journey Tracking
              </CardTitle>
              <CardDescription>Session: {userJourney.sessionId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Recent Actions ({userJourney.actions?.length || 0} total)
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userJourney.actions?.slice(-10).reverse().map((action: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-mono text-sm">{action.action}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-8">
                      No user actions tracked yet
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Stream Monitoring
              </CardTitle>
              <CardDescription>Real-time stream performance and error tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Stream Load Performance</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Track load times for Twitch/YouTube embeds</div>
                    <div>• Monitor slow stream loads (>3s)</div>
                    <div>• Platform-specific performance metrics</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Stream Error Tracking</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Categorize embed failures by platform</div>
                    <div>• Track offline streams and not found errors</div>
                    <div>• Monitor user interactions with streams</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Real-time Debug Logs
              </CardTitle>
              <CardDescription>Live debugging information and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {realtimeLogs.length} log entries
                  </span>
                  <Button 
                    onClick={() => RealtimeDebugger.log('info', 'Manual test log entry', { timestamp: Date.now() })}
                    size="sm"
                    variant="outline"
                  >
                    Add Test Log
                  </Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto bg-black/5 p-4 rounded-lg font-mono text-sm">
                  {realtimeLogs.length > 0 ? realtimeLogs.slice(-20).reverse().map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-muted-foreground text-xs w-20">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`w-12 text-xs ${
                        log.level === 'error' ? 'text-red-600' : 
                        log.level === 'warn' ? 'text-yellow-600' : 
                        'text-blue-600'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  )) : (
                    <div className="text-center text-muted-foreground py-8">
                      No debug logs yet. Generate test insights to see logs.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}