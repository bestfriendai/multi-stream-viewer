'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  Zap, 
  MessageSquare, 
  Layout, 
  Smartphone,
  Globe,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Users,
  Eye,
  Gamepad2,
  Music,
  Video,
  Mic,
  ChevronRight,
  ExternalLink,
  Plus,
  Grid3x3,
  LayoutGrid,
  PictureInPicture2,
  Star,
  Trophy,
  TrendingUp,
  Rocket,
  Shield,
  Wifi,
  Smartphone as SmartphoneIcon,
  MousePointer,
  Command,
  Layers,
  BarChart3,
  X
} from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import '@/styles/landing.css'
import OptimizedBackgroundStreams from './OptimizedBackgroundStreams'
import StreamyyyLogo from './StreamyyyLogo'

interface LandingPageProps {
  onAddStream: () => void
}

const features = [
  {
    icon: Monitor,
    title: "Multiple Streams",
    description: "Watch up to 16 streams simultaneously",
    gradient: "from-blue-500 to-cyan-500",
    stats: "16 Streams"
  },
  {
    icon: Globe,
    title: "All Platforms",
    description: "Twitch, YouTube, Kick, and more",
    gradient: "from-green-500 to-teal-500",
    stats: "5+ Platforms"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Follow conversations across streams",
    gradient: "from-green-500 to-emerald-500",
    stats: "Real-time"
  },
  {
    icon: Layout,
    title: "Flexible Layouts",
    description: "Grid, focus, and picture-in-picture views",
    gradient: "from-orange-500 to-red-500",
    stats: "Multiple"
  },
  {
    icon: SmartphoneIcon,
    title: "Mobile Optimized",
    description: "Perfect experience on any device",
    gradient: "from-blue-500 to-indigo-500",
    stats: "Responsive"
  },
  {
    icon: Zap,
    title: "Instant Loading",
    description: "Fast stream switching and loading",
    gradient: "from-yellow-500 to-orange-500",
    stats: "Quick"
  }
]

const useCases = [
  {
    icon: Gamepad2,
    title: "Live Events",
    description: "Watch multiple perspectives during events",
    example: "Follow all the action from different angles"
  },
  {
    icon: Music,
    title: "Music & Entertainment",
    description: "Multiple performers, one screen",
    example: "Watch all your favorite shows together"
  },
  {
    icon: Video,
    title: "Content Creation",
    description: "Monitor your streams while watching others",
    example: "Stream management made easy"
  },
  {
    icon: Users,
    title: "IRL Streamers",
    description: "Follow creators in real-life content",
    example: "Catch every adventure live"
  }
]

export default function LandingPage({ onAddStream }: LandingPageProps) {
  const { addStream } = useStreamStore()
  const [liveChannels, setLiveChannels] = useState<Array<{
    channelName: string
    viewerCount: number
    gameName: string
    title: string
    isLive: boolean
    thumbnailUrl?: string
  }>>([])
  const [activeDemo, setActiveDemo] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [demoStreams, setDemoStreams] = useState<Array<{
    channelName: string
    viewerCount: number
  }>>([])
  const [loading, setLoading] = useState(true)
  
  // Stable mobile detection function
  const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }

  // Fetch top live streams directly with priority
  useEffect(() => {
    const fetchTopStreams = async () => {
      try {
        setLoading(true)
        // Use high priority fetch for faster loading
        const response = await fetch('/api/twitch/top-streams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 20 }),
          priority: 'high' as RequestPriority
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          
          if (data.streams && Array.isArray(data.streams)) {
            const channels = data.streams.map((stream: any) => ({
              channelName: stream.user_login || stream.user_name,
              viewerCount: stream.viewer_count || 0,
              gameName: stream.game_name || '',
              title: stream.title || '',
              isLive: true
            }))
            
            // Sort by viewer count
            channels.sort((a: any, b: any) => b.viewerCount - a.viewerCount)
            setLiveChannels(channels)
            
            // Set demo streams from top live channels
            setDemoStreams(channels.slice(0, 9).map((ch: any) => ({
              channelName: ch.channelName,
              viewerCount: ch.viewerCount
            })))
          }
        }
      } catch (error) {
        console.error('Failed to fetch top streams:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopStreams()
    // Refresh every 2 minutes
    const interval = setInterval(fetchTopStreams, 120000)
    
    return () => clearInterval(interval)
  }, [])

  const handleQuickAdd = async (channelName: string) => {
    await addStream(channelName)
  }

  const demoLayouts = [
    { name: "2x2 Grid", streams: 4, icon: Grid3x3 },
    { name: "3x3 Grid", streams: 9, icon: LayoutGrid },
    { name: "Picture in Picture", streams: 5, icon: PictureInPicture2 }
  ]

  const stats = [
    { value: "2M+", label: "Active Users", icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: "50M+", label: "Hours Watched", icon: Eye, color: "from-green-500 to-teal-500" },
    { value: "99.9%", label: "Uptime", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { value: "16x", label: "Max Streams", icon: Monitor, color: "from-orange-500 to-red-500" }
  ]


  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Optimized Background Live Streams */}
      <OptimizedBackgroundStreams channels={liveChannels} />
      
      {/* Clean Professional Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-background to-muted/20 pt-4">
        {/* Clean Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.05),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Headline - Full Width on Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12 lg:mb-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] mb-8 lg:whitespace-nowrap">
                <span className="text-foreground">Watch Multiple</span>
                <span className="block lg:inline"> </span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Live Streams
                </span>
                <span className="block lg:inline"> </span>
                <span className="text-foreground">At Once</span>
              </h1>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Left: Value Proposition */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8 lg:col-span-2"
              >

                {/* Value Proposition */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    Never miss a moment from your favorite creators. Watch multiple live streams simultaneously 
                    and stay connected to all the action across platforms.
                  </p>
                  
                  {/* Key Benefits */}
                  <div className="space-y-3 pt-4">
                    {[
                      "Up to 16 streams simultaneously - never miss anything",
                      "Works with Twitch, YouTube, Kick, and more",
                      "No signup required - start watching instantly"
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <span className="text-foreground font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      onClick={onAddStream}
                      className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold border-0 rounded-xl text-white"
                    >
                      <PlayCircle className="w-6 h-6" />
                      Start Watching - No Credit Card Required
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => window.location.href = '/sign-up'}
                      className="gap-3 text-lg px-10 py-7 border-2 border-border/60 hover:border-primary/30 hover:bg-muted/50 font-medium rounded-xl backdrop-blur-sm"
                    >
                      Sign Up Free
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-6 pt-8 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Always Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Fast Streaming</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Hero Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative lg:col-span-3 -mt-8 lg:-mt-16"
              >
                <div className="relative bg-gradient-to-br from-card via-card/95 to-card/80 rounded-3xl border border-border/50 shadow-2xl hover:shadow-3xl p-6 lg:p-10 backdrop-blur-sm transition-all duration-500">
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-sm opacity-60" />
                  {/* Demo Grid */}
                  <div className="aspect-video bg-gradient-to-br from-black/5 via-black/3 to-black/10 dark:from-black/20 dark:via-black/15 dark:to-black/30 rounded-xl overflow-hidden border border-border/20">
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-4">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const stream = demoStreams[i]
                        return (
                          <motion.div 
                            key={i} 
                            className="bg-black rounded-lg relative overflow-hidden cursor-pointer group"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              delay: 0.6 + i * 0.1,
                              duration: 0.5,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -5
                            }}
                          >
                            {stream ? (
                              <>
                                <motion.img 
                                  src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.channelName}-640x360.jpg`}
                                  alt={stream.channelName}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50" />
                                <motion.div 
                                  className="absolute bottom-1 left-1 right-1"
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.8 + i * 0.1 }}
                                >
                                  <p className="text-xs text-white font-medium truncate">{stream.channelName}</p>
                                </motion.div>
                                <motion.div
                                  className="absolute top-1 right-1"
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.8, 1, 0.8]
                                  }}
                                  transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Badge className="bg-red-600 text-white border-0 text-xs px-1.5 py-0.5 shadow-lg">
                                    LIVE
                                  </Badge>
                                </motion.div>
                                
                                {/* Animated viewer count */}
                                <motion.div
                                  className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 1 + i * 0.1 }}
                                >
                                  <motion.span 
                                    className="text-xs text-white font-medium flex items-center gap-1"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <Eye className="w-2.5 h-2.5" />
                                    {stream.viewerCount || Math.floor(Math.random() * 10000 + 1000)}
                                  </motion.span>
                                </motion.div>
                              </>
                            ) : (
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center"
                                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                              >
                                <motion.div
                                  animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ 
                                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                  }}
                                >
                                  <PlayCircle className="w-8 h-8 text-white/50" />
                                </motion.div>
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Enhanced Feature Callouts */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -right-6 top-12 bg-gradient-to-r from-background to-background/95 border border-border/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold">Live Sync</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="absolute -left-6 bottom-16 bg-gradient-to-r from-background to-background/95 border border-border/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">Unified Chat</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Interactive Demo Section with Live Streams */}
      <section id="demo" className="py-24 bg-gradient-to-b from-background via-muted/10 to-muted/20 relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Eye className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Watch Live Now</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {loading ? "Loading live channels..." : "Real streamers, real gameplay, real entertainment - all in perfect sync"}
            </p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-card via-card/80 to-card/50 border-2 shadow-2xl backdrop-blur-sm">
              {/* Demo Controls */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {demoLayouts.map((layout, index) => (
                  <motion.div
                    key={layout.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={activeDemo === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveDemo(index)}
                      className="gap-2 px-5 py-2.5 transition-all duration-300"
                    >
                      <layout.icon className="w-4 h-4" />
                      {layout.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {/* Animated Demo Grid with Live Streams */}
              <div className="relative aspect-video bg-black/10 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "absolute inset-0 p-4 grid gap-2",
                      activeDemo === 0 && "grid-cols-2 grid-rows-2",
                      activeDemo === 1 && "grid-cols-3 grid-rows-3",
                      activeDemo === 2 && "grid-cols-12 grid-rows-8"
                    )}
                  >
                    {Array.from({ length: demoLayouts[activeDemo]?.streams || 0 }).map((_, i) => {
                      const stream = demoStreams[i]
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            "bg-black rounded-md relative overflow-hidden",
                            activeDemo === 2 && i === 0 && "col-span-8 row-span-6",
                            activeDemo === 2 && i === 1 && "col-span-4 row-span-3",
                            activeDemo === 2 && i === 2 && "col-span-4 row-span-3",
                            activeDemo === 2 && i === 3 && "col-span-4 row-span-2",
                            activeDemo === 2 && i === 4 && "col-span-4 row-span-2"
                          )}
                        >
                          {stream ? (
                            <>
                              {isMobileDevice() ? (
                                // Mobile: Show thumbnail
                                <>
                                  <img 
                                    src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.channelName}-1920x1080.jpg`}
                                    alt={stream.channelName}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle className="w-10 h-10 text-white/80 drop-shadow-lg" />
                                  </div>
                                </>
                              ) : (
                                // Desktop: Show live iframe
                                <iframe
                                  src={`https://player.twitch.tv/?channel=${stream.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true`}
                                  className="absolute inset-0 w-full h-full"
                                  frameBorder="0"
                                  scrolling="no"
                                  allowFullScreen={true}
                                />
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-xs font-medium text-white truncate">{stream.channelName}</p>
                                <p className="text-xs text-white/80">
                                  {stream.viewerCount.toLocaleString()} viewers
                                </p>
                              </div>
                              <Badge className="absolute top-2 right-2 bg-red-600 text-white border-0 text-xs">
                                LIVE
                              </Badge>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 flex flex-col items-center justify-center">
                              <PlayCircle className="w-8 h-8 text-white/50" />
                              <div className="text-xs text-white/70 mt-2">
                                Stream {i + 1}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                {demoStreams.length > 0 
                  ? "Showing actual live streams - Click 'Start Watching Now' to try it yourself!"
                  : loading 
                    ? "Loading live streams..." 
                    : "Layouts automatically adjust based on the number of streams"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/5 via-transparent to-background/50" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/12 via-blue-500/6 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-blue-500/12 via-blue-500/6 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-24" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Zap className="w-3 h-3 mr-1" />
              Quick Start
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Get Started in Seconds</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Find Your Streamers",
                description: "Search for your favorite creators or paste their channel links",
                icon: Plus,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "2",
                title: "Pick Your View",
                description: "Grid, focus, or picture-in-picture - however you like to watch",
                icon: Layout,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "3",
                title: "Watch & Chat",
                description: "Follow the action across multiple streams with live chat",
                icon: PlayCircle,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 group cursor-pointer border-0 bg-gradient-to-br from-background via-background/95 to-muted/10 backdrop-blur-sm hover:scale-[1.02]">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl bg-gradient-to-r flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
                    item.color
                  )}>
                    <span className="text-3xl font-black text-white drop-shadow-sm">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    {item.title}
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-muted/10 to-background relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Trophy className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you're ready for more features
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Card className="p-8 h-full border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                  <div className="text-4xl font-black mb-2">$0</div>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Up to 4 streams simultaneously</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Basic layouts (Grid, Focus)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Mobile responsive design</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <X className="w-5 h-5 text-muted-foreground" />
                    <span>Ads displayed</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={onAddStream}>
                  Get Started Free
                </Button>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              </div>
              <Card className="p-8 h-full border-2 border-primary hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                  <div className="text-4xl font-black mb-2">$4.99<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                  <p className="text-muted-foreground">Chat Members benefits</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Up to 9 streams simultaneously</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>All layouts including PiP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Save custom layouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/sign-up'}>
                  Start Free Trial
                </Button>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <Card className="p-8 h-full border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                  <div className="text-4xl font-black mb-2">$9.99<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                  <p className="text-muted-foreground">SuperChat Members perks</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>All 16 streams simultaneously</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Advanced custom layouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Unified chat across all streams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Stream analytics & insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Premium support & features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Early access to new features</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/sign-up'}>
                  Start Free Trial
                </Button>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 text-sm text-muted-foreground"
          >
            <p>All plans include a 7-day free trial. Cancel anytime. No contracts.</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - SaaS Style */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for 
              <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Multi-Stream Viewing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The complete solution for watching multiple live streams. Perfect for events, entertainment, and staying connected with all your favorite creators.
            </p>
          </motion.div>
          
          {/* Primary Benefits Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Monitor,
                title: "Multi-Stream Display",
                description: "Watch up to 16 streams simultaneously with intelligent layout management",
                benefit: "Never miss anything happening across platforms",
                stats: "16 Streams"
              },
              {
                icon: MessageSquare,
                title: "Unified Chat",
                description: "Follow conversations across all your streams in one convenient place",
                benefit: "Stay connected with every community",
                stats: "Real-time"
              },
              {
                icon: Layout,
                title: "Smart Layouts",
                description: "Grid, focus, and picture-in-picture modes that adapt to your viewing needs",
                benefit: "Perfect view for any content type",
                stats: "Adaptive"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <Card className="p-8 h-full border-0 bg-gradient-to-br from-background via-background/98 to-muted/15 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.stats}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {feature.description}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        → {feature.benefit}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Secondary Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Platform Support",
                description: "Twitch, YouTube, Kick, and more",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: SmartphoneIcon,
                title: "Mobile Optimized",
                description: "Perfect experience on any device",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Zero buffering, instant loading",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-7 border-0 bg-gradient-to-br from-background via-background/95 to-muted/10 hover:shadow-xl transition-all duration-500 group-hover:scale-105 backdrop-blur-sm">
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-r flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md",
                    feature.gradient
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Users className="w-3 h-3 mr-1" />
              Use Cases
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perfect For</h2>
            <p className="text-xl text-muted-foreground">Whatever you're watching, we've got you covered</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center hover:shadow-2xl transition-all duration-300 group hover:scale-105 hover:border-primary/30">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{useCase.description}</p>
                  <p className="text-xs text-primary font-medium">{useCase.example}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streamers Section - Enhanced */}
      {liveChannels.length > 0 && (
        <section className="py-24 border-t bg-gradient-to-b from-background via-muted/10 to-muted/20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
          <div className="container mx-auto px-4 relative">
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8">
                <Badge className="px-6 py-2 text-base" variant="destructive">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
                  LIVE NOW
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Popular Streams
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"> Live Now</span>
              </h2>
              <p className="text-xl text-muted-foreground text-center">Click any stream to add it instantly</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {liveChannels.slice(0, 12).map((channel, index) => (
                <motion.div
                  key={channel.channelName}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleQuickAdd(channel.channelName)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-black">
                      {isMobileDevice() ? (
                        // Mobile: Show thumbnail only
                        <>
                          <img 
                            src={channel.thumbnailUrl || `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.channelName}-1920x1080.jpg`}
                            alt={channel.channelName}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white/80 drop-shadow-lg" />
                          </div>
                        </>
                      ) : (
                        // Desktop: Show live iframe
                        <iframe
                          src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false`}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          scrolling="no"
                          allowFullScreen={false}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-600 text-white border-0 text-xs">
                          LIVE
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 pointer-events-none">
                        <Plus className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold truncate mb-1">{channel.channelName}</h4>
                      <p className="text-xs text-muted-foreground truncate mb-2">{channel.gameName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-medium">{channel.viewerCount.toLocaleString()}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Final CTA Section - Professional */}
      <section className="py-32 bg-gradient-to-b from-background via-muted/10 to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-grid-16" />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-500/8 via-blue-500/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-gradient-to-r from-cyan-500/3 via-blue-500/3 to-blue-600/3 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
              >
                <Shield className="w-4 h-4" />
                No signup required • Start immediately
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-6xl md:text-7xl font-black leading-tight mb-8">
                  Ready to Transform Your
                  <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Streaming Experience?
                  </span>
                </h2>
              </motion.div>
              
              {/* Subheading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join thousands who've upgraded to multi-stream viewing. Never miss a moment from your favorite creators, 
                  events, and live content - all in one powerful platform.
                </p>
              </motion.div>
              
              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 justify-center pt-10"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    onClick={onAddStream}
                    className="gap-3 text-xl px-12 py-8 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:via-blue-700 hover:to-cyan-700 shadow-2xl hover:shadow-3xl transition-all duration-500 font-bold text-white border-0 rounded-2xl"
                  >
                    <PlayCircle className="w-7 h-7" />
                    Start Streaming Now
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.location.href = '/sign-up'}
                    className="gap-3 text-xl px-12 py-8 border-2 border-border/60 hover:border-primary/40 hover:bg-muted/50 font-semibold rounded-2xl backdrop-blur-sm"
                  >
                    Sign Up Free
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Final Trust Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>No Download Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Works Instantly</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}