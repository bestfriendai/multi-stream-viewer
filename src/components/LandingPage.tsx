'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@clerk/nextjs'

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
  X,
  Check,
  Crown
} from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import '@/styles/landing.css'
import '@/styles/landing-mobile-enhancements.css'
import OptimizedBackgroundStreams from './OptimizedBackgroundStreams'
import StreamyyyLogo from './StreamyyyLogo'

interface LandingPageProps {
  onAddStream: () => void
}

const features = [
  {
    icon: Monitor,
    title: "Multi-Stream Viewer",
    description: "Watch multiple streams simultaneously - up to 16 streams at once",
    gradient: "from-blue-500 to-cyan-500",
    stats: "16 Streams"
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description: "Watch multiple Twitch streams, YouTube streams, and Kick streams together",
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
  const { isLoaded, isSignedIn, user } = useUser()
  const { t, isLoaded: translationsLoaded } = useTranslation()


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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // Subscription handler
  const handleSubscribe = async (plan: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=' + encodeURIComponent('/pricing')
      return
    }

    // Redirect to pricing page for full checkout flow
    window.location.href = '/pricing'
  }

  // Stable mobile detection function
  const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }

  // Check if user prefers reduced motion for accessibility
  const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
          } else {
            // Use fallback demo data if API doesn't return streams
            setDemoStreams([
              { channelName: 'demo1', viewerCount: 12500 },
              { channelName: 'demo2', viewerCount: 8300 },
              { channelName: 'demo3', viewerCount: 6100 },
              { channelName: 'demo4', viewerCount: 4200 },
              { channelName: 'demo5', viewerCount: 3800 },
              { channelName: 'demo6', viewerCount: 2900 },
              { channelName: 'demo7', viewerCount: 2400 },
              { channelName: 'demo8', viewerCount: 1800 },
              { channelName: 'demo9', viewerCount: 1200 }
            ])
          }
        } else {
          // Use fallback demo data on API error
          setDemoStreams([
            { channelName: 'demo1', viewerCount: 12500 },
            { channelName: 'demo2', viewerCount: 8300 },
            { channelName: 'demo3', viewerCount: 6100 },
            { channelName: 'demo4', viewerCount: 4200 }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch top streams:', error)
        // Use fallback demo data on fetch error
        setDemoStreams([
          { channelName: 'demo1', viewerCount: 12500 },
          { channelName: 'demo2', viewerCount: 8300 },
          { channelName: 'demo3', viewerCount: 6100 },
          { channelName: 'demo4', viewerCount: 4200 }
        ])
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

  // Don't render until translations are loaded
  if (!translationsLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4 loading-fade-in">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mobile-typography-enhanced">Loading your streaming experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Optimized Background Live Streams */}
      <OptimizedBackgroundStreams channels={liveChannels} />

      {/* Mobile-First Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-background to-muted/20 pt-20 pb-8 px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 z-10">
        {/* Enhanced Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.06),transparent_60%)]" />
          {/* Subtle grid pattern for desktop */}
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-32 hidden lg:block" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Layout - Full Right Side Demo */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Left Content - Smaller on Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-1 lg:col-span-4 w-full text-center lg:text-left space-y-4 lg:space-y-6"
              >
                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-3 lg:mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                    {t('landing.heroTitle')}
                  </h1>
                </motion.div>

                {/* Value Proposition */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3 lg:space-y-4"
                >
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {t('landing.heroSubtitle')}
                  </p>

                  {/* Key Benefits - Mobile Optimized */}
                  <div className="space-y-3 pt-4 lg:pt-6">
                    {[
                      t('landing.features.multiPlatform.description'),
                      t('landing.features.customLayouts.description'),
                      isSignedIn ? t('landing.startWatchingNow') : t('landing.getStartedFree')
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 lg:items-center"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5 lg:mt-0">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <span className="text-base lg:text-lg text-foreground font-medium leading-relaxed">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Buttons - Enhanced Mobile Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 w-full"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      size="default"
                      onClick={onAddStream}
                      className="gap-2 text-base px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold border-0 rounded-lg text-white w-full sm:w-auto min-h-[48px] enhanced-button touch-target"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {t('landing.startWatchingNow')}
                    </Button>
                  </motion.div>

                  {!isSignedIn && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 sm:flex-initial"
                    >
                      <Button
                        size="default"
                        variant="outline"
                        onClick={() => window.location.href = '/sign-up'}
                        className="gap-2 text-base px-6 py-4 border-2 border-border/60 hover:border-primary/30 hover:bg-muted/50 font-medium rounded-lg backdrop-blur-sm w-full sm:w-auto min-h-[48px] enhanced-button touch-target enhanced-focus"
                      >
                        {t('landing.getStartedFree')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Trust Indicators - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-6 lg:pt-8 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>{t('landing.trustIndicators.alwaysOnline')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>{t('landing.trustIndicators.securePrivate')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{t('landing.trustIndicators.fastStreaming')}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Full Demo Streams */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="order-2 lg:order-2 lg:col-span-8 w-full flex justify-center mt-8 lg:mt-0"
              >
                <div className="relative bg-gradient-to-br from-card via-card/95 to-card/80 rounded-2xl lg:rounded-3xl border border-border/50 shadow-2xl hover:shadow-3xl p-4 lg:p-8 backdrop-blur-sm transition-all duration-500 w-full max-w-lg lg:max-w-none">
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-sm opacity-60"
                    animate={{
                      y: [0, 10, 0],
                      x: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Demo Grid - Full Right Side */}
                  <div className="aspect-video lg:aspect-[16/10] bg-gradient-to-br from-black/5 via-black/3 to-black/10 dark:from-black/20 dark:via-black/15 dark:to-black/30 rounded-xl lg:rounded-2xl overflow-hidden border border-border/20">
                    <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:gap-6 h-full p-3 lg:p-8 items-center justify-center">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const stream = demoStreams[i]
                        return (
                          <motion.div
                            key={i}
                            className="bg-black rounded-lg lg:rounded-2xl relative overflow-hidden cursor-pointer group h-full shadow-lg hover:shadow-2xl transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                              delay: 0.6 + i * 0.1,
                              duration: 0.5,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{
                              scale: 1.03,
                              y: -3
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
                                  className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 right-2 lg:right-3"
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.8 + i * 0.1 }}
                                >
                                  <p className="text-xs lg:text-base text-white font-medium truncate">{stream.channelName}</p>
                                </motion.div>
                                <motion.div
                                  className="absolute top-2 lg:top-3 right-2 lg:right-3"
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
                                  <Badge className="bg-red-600 text-white border-0 text-xs lg:text-base px-2 lg:px-3 py-1 lg:py-1.5 shadow-lg">
                                    LIVE
                                  </Badge>
                                </motion.div>

                                {/* Animated viewer count */}
                                <motion.div
                                  className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-black/60 backdrop-blur-sm rounded px-2 lg:px-3 py-1 lg:py-1.5"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 1 + i * 0.1 }}
                                >
                                  <motion.span
                                    className="text-xs lg:text-base text-white font-medium flex items-center gap-1 lg:gap-2"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <Eye className="w-3 lg:w-4 h-3 lg:h-4" />
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

                  {/* Feature Callouts for Full-Width Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-3 right-3 lg:-right-12 lg:top-20 bg-gradient-to-r from-background to-background/95 border border-border/40 rounded-lg lg:rounded-xl px-3 py-2 lg:px-5 lg:py-4 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-base">
                      <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold">Live Sync</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="absolute bottom-3 left-3 lg:-left-12 lg:bottom-24 bg-gradient-to-r from-background to-background/95 border border-border/40 rounded-lg lg:rounded-xl px-3 py-2 lg:px-5 lg:py-4 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-base">
                      <MessageSquare className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500" />
                      <span className="font-semibold">Unified Chat</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Interactive Demo Section - Enhanced Mobile Experience */}
      <section id="demo" className="mobile-section-spacing lg:py-24 bg-gradient-to-b from-background via-muted/10 to-muted/20 relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-4 py-2 text-sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              {t('landing.demo.liveDemo')}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('landing.demo.watchLiveNow')}</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {loading ? t('landing.demo.loadingChannels') : t('landing.demo.realStreamers')}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-card via-card/80 to-card/50 border-2 shadow-2xl backdrop-blur-sm mobile-card-enhanced">
              {/* Demo Controls - Enhanced Mobile Experience */}
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
                      className="gap-2 px-4 py-3 transition-all duration-300 text-sm min-h-[48px] touch-manipulation font-medium"
                    >
                      <layout.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{layout.name}</span>
                      <span className="sm:hidden">
                        {layout.name === '2x2 Grid' ? '2×2' :
                         layout.name === '3x3 Grid' ? '3×3' :
                         layout.name === 'Picture in Picture' ? 'PiP' : layout.name.split(' ')[0]}
                      </span>
                      {activeDemo === index && (
                        <motion.div
                          layoutId="activeDemo"
                          className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Demo Display - Screenshots on Mobile, Live Grid on Desktop */}
              <div className="relative aspect-video sm:aspect-[4/3] bg-black/10 rounded-lg overflow-hidden">
                {/* Mobile: Show Screenshots */}
                <div className="block lg:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDemo}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={`/${activeDemo === 0 ? '2by2' : activeDemo === 1 ? '3by3' : 'pip'}.svg`}
                        alt={`${demoLayouts[activeDemo]?.name} Layout Demo`}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={activeDemo === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Desktop: Show Live Grid */}
                <div className="hidden lg:block">
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
                            "bg-black rounded-sm sm:rounded-md relative overflow-hidden min-h-[40px] sm:min-h-[60px]",
                            activeDemo === 2 && i === 0 && "col-span-8 row-span-6",
                            activeDemo === 2 && i === 1 && "col-span-4 row-span-3",
                            activeDemo === 2 && i === 2 && "col-span-4 row-span-3",
                            activeDemo === 2 && i === 3 && "col-span-4 row-span-2",
                            activeDemo === 2 && i === 4 && "col-span-4 row-span-2"
                          )}
                        >
                          {stream ? (
                            <>
                              {/* Always show thumbnail on mobile, iframe on desktop */}
                              <Image
                                src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.channelName}-1920x1080.jpg`}
                                alt={`${stream.channelName} stream thumbnail`}
                                fill
                                className="object-cover block lg:hidden"
                                sizes="(max-width: 1024px) 100vw, 0px"
                                priority={i < 4} // Prioritize first 4 images for LCP
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent block lg:hidden" />
                              <div className="absolute inset-0 flex items-center justify-center block lg:hidden">
                                <PlayCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white/80 drop-shadow-lg" />
                              </div>
                              {/* Stream info for larger cells on mobile */}
                              {(activeDemo === 2 && i === 0) && (
                                <div className="absolute bottom-1 left-1 right-1 block lg:hidden">
                                  <div className="text-white text-xs font-medium truncate bg-black/50 px-1 py-0.5 rounded">
                                    {stream.channelName}
                                  </div>
                                </div>
                              )}

                              {/* Desktop: Show live iframe */}
                              <iframe
                                src={`https://player.twitch.tv/?channel=${stream.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true`}
                                className="absolute inset-0 w-full h-full hidden lg:block"
                                frameBorder="0"
                                scrolling="no"
                                allowFullScreen={true}
                              />
                              {/* Desktop stream info overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-0.5 sm:p-1 lg:p-2 hidden lg:block">
                                <p className="text-[10px] sm:text-xs font-medium text-white truncate">{stream.channelName}</p>
                                <p className="text-[9px] sm:text-xs text-white/80">
                                  {stream.viewerCount.toLocaleString()} viewers
                                </p>
                              </div>
                              <Badge className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 lg:top-2 lg:right-2 bg-red-600 text-white border-0 text-[8px] sm:text-xs">
                                LIVE
                              </Badge>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 flex flex-col items-center justify-center">
                              <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white/50" />
                              <div className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1 lg:mt-2">
                                {activeDemo === 2 && i === 0 ? 'Main' : `${i + 1}`}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <p className="text-center text-sm lg:text-base text-muted-foreground mt-4 lg:mt-6">
                {demoStreams.length > 0
                  ? t('landing.demo.showingLiveStreams')
                  : loading
                    ? t('landing.demo.loadingStreams')
                    : t('landing.demo.layoutsAdjust')}
              </p>
            </Card>
          </div>
        </div>
      </section>


      {/* Pricing Section - Enhanced with Billing Toggle */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-muted/10 to-background relative">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-2 text-sm" variant="outline">
              <Trophy className="w-4 h-4 mr-2" />
              {t('landing.pricing.badge')}
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">{t('pricing.title')}</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2">Save 17%</Badge>
              )}
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="group"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="p-6 lg:p-8 h-full border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Free</h3>
                  <div className="text-3xl lg:text-4xl font-black mb-2">$0</div>
                  <p className="text-muted-foreground text-sm lg:text-base">Perfect for getting started</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Up to 4 simultaneous streams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Basic layouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Standard controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Community support</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <X className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Ads displayed</span>
                  </li>
                </ul>
                <Button className="w-full py-3 text-base" variant="outline" onClick={onAddStream}>
                  Get Started
                </Button>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-sm">
                  Most Popular
                </Badge>
              </div>
              <Card className="p-6 lg:p-8 h-full border-2 border-primary hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-3xl lg:text-4xl font-black mb-2">
                    ${billingCycle === 'monthly' ? '9.99' : '99.99'}
                    <span className="text-base lg:text-lg font-normal text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm lg:text-base">Best for streamers and content creators</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Up to 8 simultaneous streams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Custom layouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Advanced controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Ad-free experience</span>
                  </li>
                </ul>
                <Button className="w-full py-3 text-base bg-primary hover:bg-primary/90" onClick={() => handleSubscribe('pro')}>
                  Subscribe to Pro
                </Button>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 text-sm">
                  Best Value
                </Badge>
              </div>
              <Card className="p-6 lg:p-8 h-full border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Crown className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-3xl lg:text-4xl font-black mb-2">
                    ${billingCycle === 'monthly' ? '19.99' : '199.99'}
                    <span className="text-base lg:text-lg font-normal text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm lg:text-base">Ultimate streaming experience</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Up to 16 simultaneous streams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Unlimited custom layouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm lg:text-base leading-relaxed">Early access to new features</span>
                  </li>
                </ul>
                <Button className="w-full py-3 text-base" variant="outline" onClick={() => handleSubscribe('premium')}>
                  Subscribe to Premium
                </Button>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 lg:mt-16 text-sm lg:text-base text-muted-foreground"
          >
            <p>All plans include a 7-day free trial. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            className="text-center mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              {t('landing.benefits.title.main')}
              <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('landing.benefits.title.highlight')}
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('landing.benefits.subtitle')}
            </p>
          </motion.div>

          {/* Primary Benefits Grid - Mobile Optimized */}
          <div className="grid gap-8 lg:grid-cols-3 mb-16">
            {[
              {
                icon: Monitor,
                title: t('landing.benefits.multiStream.title'),
                description: t('landing.benefits.multiStream.description'),
                benefit: t('landing.benefits.multiStream.benefit'),
                stats: "16 Streams"
              },
              {
                icon: MessageSquare,
                title: t('landing.benefits.unifiedChat.title'),
                description: t('landing.benefits.unifiedChat.description'),
                benefit: t('landing.benefits.unifiedChat.benefit'),
                stats: "Real-time"
              },
              {
                icon: Layout,
                title: t('landing.benefits.smartLayouts.title'),
                description: t('landing.benefits.smartLayouts.description'),
                benefit: t('landing.benefits.smartLayouts.benefit'),
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
                <Card className="p-6 lg:p-8 h-full border-0 bg-gradient-to-br from-background via-background/98 to-muted/15 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto lg:mx-0">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-center lg:text-left">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                        <h3 className="text-lg lg:text-xl font-bold text-foreground">{feature.title}</h3>
                        <Badge variant="secondary" className="text-xs mx-auto lg:mx-0 w-fit">
                          {feature.stats}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4 text-sm lg:text-base">
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

          {/* Secondary Features Grid - Enhanced Mobile Experience */}
          <div className="mobile-grid-responsive gap-6">
            {[
              {
                icon: Globe,
                title: t('landing.benefits.platformSupport.title'),
                description: t('landing.benefits.platformSupport.description'),
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: SmartphoneIcon,
                title: t('landing.benefits.mobileOptimized.title'),
                description: t('landing.benefits.mobileOptimized.description'),
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: t('landing.benefits.lightningFast.title'),
                description: t('landing.benefits.lightningFast.description'),
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
                <Card className="p-6 lg:p-7 border-0 bg-gradient-to-br from-background via-background/95 to-muted/10 hover:shadow-xl transition-all duration-500 group-hover:scale-105 backdrop-blur-sm">
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-r flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md mx-auto lg:mx-0",
                    feature.gradient
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2 text-center lg:text-left">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm lg:text-base text-center lg:text-left">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases - Mobile Optimized */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-1.5 text-sm" variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {t('landing.useCases.badge')}
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">{t('landing.useCases.title')}</h2>
            <p className="text-lg lg:text-xl text-muted-foreground">{t('landing.useCases.subtitle')}</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-4 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 lg:p-8 h-full text-center hover:shadow-2xl transition-all duration-300 group hover:scale-105 hover:border-primary/30">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{useCase.title}</h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-3 leading-relaxed">{useCase.description}</p>
                  <p className="text-xs lg:text-sm text-primary font-medium">{useCase.example}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streamers Section - Mobile Optimized */}
      {liveChannels.length > 0 && (
        <section className="py-16 lg:py-24 border-t bg-gradient-to-b from-background via-muted/10 to-muted/20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
          <div className="container mx-auto px-4 lg:px-8 relative">
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
              <h2 className="text-3xl lg:text-5xl font-bold text-center mb-4">
                {t('landing.liveStreamers.popularStreams')}
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"> {t('landing.liveStreamers.liveNow')}</span>
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground text-center">{t('landing.liveStreamers.clickToAdd')}</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {liveChannels.slice(0, 12).map((channel, index) => (
                <motion.div
                  key={channel.channelName}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="smooth-interaction"
                >
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group mobile-card-enhanced touch-target"
                    onClick={() => handleQuickAdd(channel.channelName)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-black">
                      {isMobileDevice() ? (
                        // Mobile: Show thumbnail only
                        <>
                          <Image
                            src={channel.thumbnailUrl || `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.channelName}-1920x1080.jpg`}
                            alt={`${channel.channelName} live stream`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            priority={false} // Below fold, no priority needed
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

                    <div className="p-3 lg:p-4">
                      <h4 className="font-semibold truncate mb-1 text-sm lg:text-base">{channel.channelName}</h4>
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


      {/* Final CTA Section - Mobile Optimized */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/10 to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-grid-16" />
          <div className="absolute top-0 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-gradient-to-br from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[350px] lg:w-[500px] h-[350px] lg:h-[500px] bg-gradient-to-tl from-blue-500/8 via-blue-500/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[800px] h-[150px] lg:h-[200px] bg-gradient-to-r from-cyan-500/3 via-blue-500/3 to-blue-600/3 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
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
                {isSignedIn ? t('landing.finalCta.welcomeBack') : t('landing.finalCta.noSignup')}
              </motion.div>

              {/* Headline - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl lg:text-7xl font-black leading-tight mb-8">
                  {t('landing.finalCta.title.main')}
                  <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t('landing.finalCta.title.highlight')}
                  </span>
                </h2>
              </motion.div>

              {/* Subheading - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-lg lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t('landing.finalCta.subtitle')}
                </p>
              </motion.div>

              {/* CTAs - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 lg:flex-row lg:gap-6 justify-center pt-10"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    onClick={onAddStream}
                    className="gap-3 text-lg lg:text-xl px-10 lg:px-12 py-7 lg:py-8 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:via-blue-700 hover:to-cyan-700 shadow-2xl hover:shadow-3xl transition-all duration-500 font-bold text-white border-0 rounded-2xl w-full lg:w-auto"
                  >
                    <PlayCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                    {t('landing.finalCta.startButton')}
                  </Button>
                </motion.div>

                {!isSignedIn && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => window.location.href = '/sign-up'}
                      className="gap-3 text-lg lg:text-xl px-10 lg:px-12 py-7 lg:py-8 border-2 border-border/60 hover:border-primary/40 hover:bg-muted/50 font-semibold rounded-2xl backdrop-blur-sm w-full lg:w-auto"
                    >
                      {t('landing.getStartedFree')}
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {/* Final Trust Elements - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 pt-12 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{t('landing.finalCta.trustElements.free')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{t('landing.finalCta.trustElements.noDownload')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{t('landing.finalCta.trustElements.worksInstantly')}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO Internal Links Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Explore Streamyyy's Advanced Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover all the ways Streamyyy enhances your streaming experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <Shield className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Ad-Free Viewing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch Twitch streams without any advertisements or interruptions
                </p>
                <a
                  href="/watch-twitch-no-ads"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Learn More →
                </a>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <Monitor className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Multi-Stream Viewing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch multiple Twitch streams simultaneously with advanced layouts
                </p>
                <a
                  href="/watch-multiple-twitch-streams"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Learn More →
                </a>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <Zap className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Multistream Technology</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced Twitch multistream viewer with superior performance
                </p>
                <a
                  href="/twitch-multistream"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Learn More →
                </a>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8 text-orange-600 mb-3" />
                <h3 className="font-semibold mb-2">Complete Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to master multi-stream viewing with our tutorials
                </p>
                <a
                  href="/guide/watching-multiple-streams"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Learn More →
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}