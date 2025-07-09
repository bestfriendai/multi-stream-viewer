'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
  X,
  Cpu,
  Headphones,
  Share2
} from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import '@/styles/landing.css'
import OptimizedBackgroundStreams from './OptimizedBackgroundStreams'
import StreamyyyLogo from './StreamyyyLogo'
import MobileEnhancedFeatures from './MobileEnhancedFeatures'
import ResponsiveBentoDemo from './ResponsiveBentoDemo'

interface EnhancedLandingPageProps {
  onAddStream: () => void
}

// Enhanced features with more sophisticated descriptions
const enhancedFeatures = [
  {
    icon: Monitor,
    title: "Multi-Stream Mastery",
    description: "Watch up to 16 streams with intelligent layout optimization",
    gradient: "from-blue-500 via-blue-600 to-cyan-500",
    stats: "16 Streams",
    details: "Advanced grid layouts with smart resizing"
  },
  {
    icon: Globe,
    title: "Universal Platform Support",
    description: "Seamlessly integrate Twitch, YouTube, Kick, and emerging platforms",
    gradient: "from-green-500 via-emerald-600 to-teal-500",
    stats: "5+ Platforms",
    details: "Cross-platform synchronization"
  },
  {
    icon: MessageSquare,
    title: "Unified Chat Experience",
    description: "Aggregate and filter conversations across all your streams",
    gradient: "from-purple-500 via-violet-600 to-indigo-500",
    stats: "Real-time",
    details: "Smart chat filtering and moderation"
  },
  {
    icon: Layout,
    title: "Adaptive Layouts",
    description: "AI-powered layout suggestions based on content type",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    stats: "Smart",
    details: "Automatic layout optimization"
  },
  {
    icon: SmartphoneIcon,
    title: "Mobile-First Design",
    description: "Optimized touch controls and gesture navigation",
    gradient: "from-blue-500 via-indigo-600 to-purple-500",
    stats: "Touch-Ready",
    details: "Gesture-based controls"
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Sub-second loading with intelligent stream preloading",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    stats: "<1s Load",
    details: "Predictive content loading"
  }
]

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}

// Glass Morphism Card Component
const GlassCard = ({ children, className, ...props }: any) => {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl",
        className
      )}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Floating Particle Component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
      animate={{
        y: [-20, -100, -20],
        x: [-10, 10, -10],
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.5, 1]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  )
}

// Enhanced Feature Card with Hover Details
const EnhancedFeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <GlassCard className="p-6 h-full relative overflow-hidden">
        {/* Gradient Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
          feature.gradient
        )} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 2} />
          ))}
        </div>
        
        {/* Icon with Gradient */}
        <motion.div
          className={cn(
            "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 relative z-10",
            feature.gradient
          )}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <feature.icon className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground group-hover:bg-clip-text transition-all duration-300">
            {feature.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {feature.description}
          </p>
          
          {/* Stats Badge */}
          <Badge className={cn(
            "bg-gradient-to-r text-white border-0 shadow-lg",
            feature.gradient
          )}>
            {feature.stats}
          </Badge>
          
          {/* Hover Details */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border/50"
              >
                <p className="text-sm text-muted-foreground">
                  {feature.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Hover Arrow */}
        <motion.div
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </GlassCard>
    </motion.div>
  )
}

// Legacy BentoGridDemo component (kept for compatibility)
const BentoGridDemo = ({ demoStreams }: { demoStreams: any[] }) => {
  return <ResponsiveBentoDemo demoStreams={demoStreams} isMobile={false} />
}

export default function EnhancedLandingPage({ onAddStream }: EnhancedLandingPageProps) {
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
  const [demoStreams, setDemoStreams] = useState<Array<{
    channelName: string
    viewerCount: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Mouse tracking for cursor effects (desktop only)
  useEffect(() => {
    if (isMobile) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])
  
  // Fetch top live streams
  useEffect(() => {
    const fetchTopStreams = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/twitch/top-streams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 20 }),
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.streams && Array.isArray(data.streams)) {
            const channels = data.streams.map((stream: any) => ({
              channelName: stream.user_login || stream.user_name,
              viewerCount: stream.viewer_count || 0,
              gameName: stream.game_name || '',
              title: stream.title || '',
              isLive: true
            }))
            
            channels.sort((a: any, b: any) => b.viewerCount - a.viewerCount)
            setLiveChannels(channels)
            setDemoStreams(channels.slice(0, 12))
          }
        }
      } catch (error) {
        console.error('Failed to fetch top streams:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopStreams()
    const interval = setInterval(fetchTopStreams, 120000)
    return () => clearInterval(interval)
  }, [])
  
  if (!translationsLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Cursor Follower (Desktop Only) */}
      {!isMobile && (
        <motion.div
          className="fixed w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
          animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28
          }}
        />
      )}
      
      {/* Background */}
      <OptimizedBackgroundStreams channels={liveChannels} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-32" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100, -20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Next-Gen Streaming Platform
                  </Badge>
                </motion.div>
                
                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Watch Multiple
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                      Streams Together
                    </span>
                  </h1>
                </motion.div>
                
                {/* Subtitle */}
                <motion.p
                  className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Experience the future of live streaming with intelligent multi-view layouts, 
                  unified chat, and seamless cross-platform integration.
                </motion.p>
                
                {/* Features List */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { icon: Monitor, text: "Up to 16 simultaneous streams" },
                    { icon: Zap, text: "Lightning-fast performance" },
                    { icon: Smartphone, text: "Perfect mobile experience" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <MagneticButton
                    size="lg"
                    onClick={onAddStream}
                    className="gap-3 text-lg px-8 py-6 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 font-semibold border-0 rounded-2xl text-white min-h-[60px] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <PlayCircle className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Start Watching Now</span>
                  </MagneticButton>
                  
                  {!isSignedIn && (
                    <MagneticButton
                      size="lg"
                      variant="outline"
                      onClick={() => window.location.href = '/sign-up'}
                      className="gap-3 text-lg px-8 py-6 border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 font-medium rounded-2xl backdrop-blur-sm min-h-[60px] group"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  )}
                </motion.div>
                
                {/* Trust Indicators */}
                <motion.div
                  className="flex flex-wrap items-center gap-6 pt-6 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>2M+ Active Users</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Demo */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <GlassCard className="p-8 relative overflow-hidden">
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Demo Content */}
                  <div className={cn(
                    "bg-black/20 rounded-xl overflow-hidden relative",
                    isMobile ? "aspect-[4/5]" : "aspect-video"
                  )}>
                    <ResponsiveBentoDemo demoStreams={demoStreams} isMobile={isMobile} />
                  </div>
                  
                  {/* Floating Badges */}
                  <motion.div
                    className="absolute top-4 right-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/40 rounded-xl px-4 py-2 shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="font-semibold">Live Sync</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-4 left-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/40 rounded-xl px-4 py-2 shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">Unified Chat</span>
                    </div>
                  </motion.div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-24" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          {isMobile ? (
            <MobileEnhancedFeatures onAddStream={onAddStream} />
          ) : (
            <>
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 px-6 py-3 text-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Rocket className="w-4 h-4 mr-2" />
                  Powerful Features
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Everything You Need
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover the advanced features that make Streamyyy the ultimate platform for multi-stream viewing
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {enhancedFeatures.map((feature, index) => (
                  <EnhancedFeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-16" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { value: "2M+", label: "Active Users", icon: Users, gradient: "from-blue-500 to-cyan-500" },
              { value: "50M+", label: "Hours Watched", icon: Eye, gradient: "from-green-500 to-emerald-500" },
              { value: "99.9%", label: "Uptime", icon: TrendingUp, gradient: "from-purple-500 to-pink-500" },
              { value: "16x", label: "Max Streams", icon: Monitor, gradient: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <GlassCard className="p-6 h-full">
                  <motion.div
                    className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mx-auto mb-4",
                      stat.gradient
                    )}
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div
                    className="text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}