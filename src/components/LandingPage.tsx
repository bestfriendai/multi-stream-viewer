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
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 min-h-screen flex items-center">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
          
          {/* Floating video frames effect */}
          <div className="absolute top-16 left-16 w-32 h-20 border-2 border-white/20 rounded-lg backdrop-blur-sm animate-bounce-slow" />
          <div className="absolute bottom-32 right-24 w-40 h-24 border-2 border-primary/30 rounded-lg backdrop-blur-sm animate-float" />
          <div className="absolute top-1/3 right-16 w-36 h-22 border-2 border-purple-400/20 rounded-lg backdrop-blur-sm animate-float-delayed" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8 max-w-5xl mx-auto"
          >
            {/* Enhanced Logo Animation with Glass Effect */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, bounce: 0.5 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                <div className="relative bg-black/30 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                  <Sparkles className="w-28 h-28 text-white drop-shadow-2xl" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse shadow-lg" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse animation-delay-1000 shadow-lg" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-8xl font-black tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative">
                <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                  STREAMYYY
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-70 blur-sm">
                  STREAMYYY
                </div>
              </div>
              <br />
              <motion.div 
                className="text-2xl md:text-4xl font-semibold mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 inline-block">
                  <span className="text-white drop-shadow-lg">
                    The Best Multi-Stream Platform
                  </span>
                </div>
              </motion.div>
            </motion.h1>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="bg-black/50 backdrop-blur-md rounded-3xl px-8 py-6 border border-white/20 shadow-2xl inline-block max-w-4xl">
                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                  Watch multiple streams at once. Simple, fast, and free.
                </p>
              </div>
            </motion.div>
            
            {/* Enhanced Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {[
                { icon: Shield, text: "Enterprise Security", color: "text-green-400" },
                { icon: Wifi, text: "99.9% Uptime", color: "text-blue-400" },
                { icon: Trophy, text: "Industry Leading", color: "text-yellow-400" },
                { icon: Rocket, text: "Zero Lag Guarantee", color: "text-purple-400" }
              ].map((item, index) => (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-black/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <item.icon className={`w-4 h-4 ${item.color} drop-shadow-lg`} />
                  <span className="text-white font-medium text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.08, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
                <Button 
                  size="lg" 
                  onClick={onAddStream}
                  className="relative gap-4 text-xl px-12 py-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-2xl border-2 border-white/20 backdrop-blur-sm font-bold tracking-wide group"
                >
                  <PlayCircle className="w-7 h-7 group-hover:animate-spin transition-transform" />
                  Start Watching Now
                  <Sparkles className="w-5 h-5 group-hover:animate-bounce" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.08, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="gap-4 text-xl px-12 py-8 border-2 border-white/40 hover:border-white/60 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white hover:text-white shadow-2xl font-semibold tracking-wide group transition-all duration-300"
                >
                  See It In Action
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <BarChart3 className="w-3 h-3 mr-1" />
              Platform Stats
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Millions</h2>
            <p className="text-xl text-muted-foreground">Real numbers from real users around the world</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", duration: 0.6 }}
                className="text-center group"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-background to-muted/30">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500",
                    stat.color
                  )}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    item.color
                  )}>
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    {item.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-muted/30 via-muted/20 to-background relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need for multi-stream viewing.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <Card className={cn(
                  "p-8 h-full transition-all duration-500 relative overflow-hidden group cursor-pointer",
                  hoveredFeature === index && "shadow-2xl scale-105 border-primary/50"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className={cn(
                      "text-xs font-bold bg-gradient-to-r text-white border-0 shadow-lg",
                      feature.gradient
                    )}>
                      {feature.stats}
                    </Badge>
                  </div>
                  
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6 transition-all duration-500 relative z-10 shadow-lg",
                    feature.gradient,
                    hoveredFeature === index && "scale-110 rotate-3 shadow-2xl"
                  )}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 relative z-10 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground relative z-10 leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r opacity-10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                  
                  {/* Interactive Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
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

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-b from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-32" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Ready to Start
                <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                  Multi-Streaming?
                </span>
              </h2>
            </motion.div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of viewers using the best multi-stream platform.
            </p>
            
            <motion.div 
              className="pt-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={onAddStream}
                className="gap-3 text-xl px-12 py-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-2xl hover:shadow-primary/30 transition-all duration-300 relative group"
              >
                <Zap className="w-7 h-7 group-hover:animate-pulse" />
                Start Streaming Now
                <div className="absolute inset-0 rounded-md bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}