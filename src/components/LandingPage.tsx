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
  BarChart3
} from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import '@/styles/landing.css'
import OptimizedBackgroundStreams from './OptimizedBackgroundStreams'

interface LandingPageProps {
  onAddStream: () => void
}

const features = [
  {
    icon: Monitor,
    title: "Multiple Streams",
    description: "Watch up to 16 streams at once",
    gradient: "from-blue-500 to-cyan-500",
    stats: "16 Streams"
  },
  {
    icon: Globe,
    title: "All Platforms",
    description: "Twitch, YouTube, Kick, and more",
    gradient: "from-purple-500 to-pink-500",
    stats: "5+ Platforms"
  },
  {
    icon: MessageSquare,
    title: "Unified Chat",
    description: "All chat in one place",
    gradient: "from-green-500 to-emerald-500",
    stats: "Real-time"
  },
  {
    icon: Layout,
    title: "Smart Layouts",
    description: "Auto-adjusting grids and custom layouts",
    gradient: "from-orange-500 to-red-500",
    stats: "Multiple"
  },
  {
    icon: SmartphoneIcon,
    title: "Mobile Friendly",
    description: "Works great on phones and tablets",
    gradient: "from-indigo-500 to-purple-500",
    stats: "Responsive"
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "No lag, no buffering",
    gradient: "from-yellow-500 to-orange-500",
    stats: "Instant"
  }
]

const useCases = [
  {
    icon: Gamepad2,
    title: "Esports Tournaments",
    description: "Watch multiple POVs during tournaments",
    example: "Follow all players in a CS2 match"
  },
  {
    icon: Music,
    title: "Music Festivals",
    description: "Multiple stages, one screen",
    example: "Watch all Coachella streams together"
  },
  {
    icon: Video,
    title: "Content Creation",
    description: "Monitor your streams while watching others",
    example: "Stream management made easy"
  },
  {
    icon: Mic,
    title: "Podcast Networks",
    description: "Follow multiple live podcasts",
    example: "Never miss a moment"
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
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    { value: "50M+", label: "Hours Watched", icon: Eye, color: "from-purple-500 to-pink-500" },
    { value: "99.9%", label: "Uptime", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { value: "16x", label: "Max Streams", icon: Monitor, color: "from-orange-500 to-red-500" }
  ]

  const testimonials = [
    {
      quote: "Perfect for watching multiple streams during tournaments.",
      author: "ProGamer_2024",
      role: "Esports Fan",
      rating: 5
    },
    {
      quote: "Great for monitoring competitors while streaming.",
      author: "StreamMaster",
      role: "Content Creator",
      rating: 5
    },
    {
      quote: "Finally, a multi-stream viewer that just works!",
      author: "ChatModerator",
      role: "Viewer",
      rating: 5
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Optimized Background Live Streams */}
      <OptimizedBackgroundStreams channels={liveChannels} />
      
      {/* Professional SaaS Hero Section */}
      <section className="relative py-24 lg:py-32 min-h-[90vh] flex items-center">
        {/* Enhanced Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-muted/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-grid-32" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/3 via-blue-500/3 to-violet-500/3 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Value Proposition */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Trust Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                >
                  <Shield className="w-4 h-4" />
                  Trusted by 2M+ users worldwide
                </motion.div>

                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-8">
                    <span className="text-foreground">Watch Multiple</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Live Streams
                    </span>
                    <br />
                    <span className="text-foreground">In One Place</span>
                  </h1>
                </motion.div>

                {/* Value Proposition */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    The professional multi-stream platform for creators, esports fans, and content enthusiasts. 
                    No more switching tabs or missing moments.
                  </p>
                  
                  {/* Key Benefits */}
                  <div className="space-y-3 pt-4">
                    {[
                      "Watch up to 16 streams simultaneously",
                      "Works with Twitch, YouTube, Kick & more",
                      "Zero setup required - works instantly"
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
                      className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-primary via-violet-600 to-purple-600 hover:from-primary/90 hover:via-violet-600/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold border-0 rounded-xl"
                    >
                      <PlayCircle className="w-6 h-6" />
                      Start Free - No Signup Required
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      className="gap-3 text-lg px-10 py-7 border-2 border-border/60 hover:border-primary/30 hover:bg-muted/50 font-medium rounded-xl backdrop-blur-sm"
                    >
                      Watch Demo
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
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Zero Lag</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Hero Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-card via-card/95 to-card/80 rounded-3xl border border-border/50 shadow-2xl hover:shadow-3xl p-8 backdrop-blur-sm transition-all duration-500">
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-sm opacity-60" />
                  {/* Demo Grid */}
                  <div className="aspect-video bg-gradient-to-br from-black/5 via-black/3 to-black/10 dark:from-black/20 dark:via-black/15 dark:to-black/30 rounded-xl overflow-hidden border border-border/20">
                    <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full p-3">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const stream = demoStreams[i]
                        return (
                          <div key={i} className="bg-black rounded-md relative overflow-hidden">
                            {stream ? (
                              <>
                                <img 
                                  src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.channelName}-640x360.jpg`}
                                  alt={stream.channelName}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-1 left-1 right-1">
                                  <p className="text-xs text-white font-medium truncate">{stream.channelName}</p>
                                </div>
                                <Badge className="absolute top-1 right-1 bg-red-600 text-white border-0 text-xs px-1 py-0">
                                  LIVE
                                </Badge>
                              </>
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                <PlayCircle className="w-8 h-8 text-white/50" />
                              </div>
                            )}
                          </div>
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

      {/* Statistics Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Numbers Speak for Themselves
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join millions of users who've made Streamyyy their go-to multi-streaming platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-gradient-to-br from-background via-background to-muted/20">
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-xl bg-gradient-to-r flex items-center justify-center",
                    stat.color
                  )}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Additional Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span>User Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="font-semibold">SOC 2</span>
                <span>Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">#1</span>
                <span>Multi-Stream Platform</span>
              </div>
            </div>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">See It In Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {loading ? "Loading live streams..." : "Experience multi-stream viewing with real live streams from popular creators"}
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
                              {isMobile ? (
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
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex flex-col items-center justify-center">
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
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/12 via-purple-500/6 to-transparent rounded-full blur-3xl" />
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
            <h2 className="text-4xl md:text-5xl font-bold">Simple as 1-2-3</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Add Your Streams",
                description: "Paste URLs or type channel names from any supported platform",
                icon: Plus,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Choose Your Layout",
                description: "Select from pre-made layouts or create your own custom view",
                icon: Layout,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Enjoy The Show",
                description: "Watch all streams with synchronized controls and unified chat",
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

      {/* Benefits Section - SaaS Style */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to 
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Stream Smarter
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Built for creators, streamers, and viewers who demand the best multi-streaming experience
            </p>
          </motion.div>
          
          {/* Primary Benefits Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Monitor,
                title: "Multi-Stream Viewing",
                description: "Watch up to 16 streams simultaneously with intelligent layout management",
                benefit: "Never miss a moment across multiple streams",
                stats: "16 Streams"
              },
              {
                icon: MessageSquare,
                title: "Unified Chat System",
                description: "All your favorite stream chats in one convenient sidebar",
                benefit: "Stay connected with all communities at once",
                stats: "Real-time"
              },
              {
                icon: Layout,
                title: "Smart Layouts",
                description: "AI-powered layout suggestions and custom grid arrangements",
                benefit: "Perfect viewing experience every time",
                stats: "Auto-Adjust"
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
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
                      {isMobile ? (
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

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Star className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Content Creators</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community of streamers, viewers, and content creators are saying
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-lg leading-relaxed mb-6 relative">
                    <div className="absolute -top-2 -left-2 text-4xl text-primary/20">"</div>
                    {testimonial.quote}
                    <div className="absolute -bottom-4 -right-2 text-4xl text-primary/20">"</div>
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.author[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Additional Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span>Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">10K+</span>
                <span>Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">#1</span>
                <span>MultiTwitch Alternative</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section - Professional */}
      <section className="py-32 bg-gradient-to-b from-background via-muted/10 to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-grid-16" />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/8 via-purple-500/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-gradient-to-r from-cyan-500/3 via-blue-500/3 to-violet-500/3 rounded-full blur-3xl" />
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
                  <span className="block bg-gradient-to-r from-primary via-violet-600 to-purple-600 bg-clip-text text-transparent">
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
                  Join millions who've upgraded to the professional multi-streaming platform. 
                  Start watching multiple streams instantly.
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
                    className="gap-3 text-xl px-12 py-8 bg-gradient-to-r from-primary via-violet-600 to-purple-600 hover:from-primary/90 hover:via-violet-600/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl transition-all duration-500 font-bold text-white border-0 rounded-2xl"
                  >
                    <PlayCircle className="w-7 h-7" />
                    Start Free Now
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                    className="gap-3 text-xl px-12 py-8 border-2 border-border/60 hover:border-primary/40 hover:bg-muted/50 font-semibold rounded-2xl backdrop-blur-sm"
                  >
                    See Live Demo
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
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
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