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
  PictureInPicture2
} from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import '@/styles/landing.css'

interface LandingPageProps {
  onAddStream: () => void
}

const features = [
  {
    icon: Monitor,
    title: "16 Simultaneous Streams",
    description: "Watch up to 16 live streams at once in perfectly optimized layouts",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Globe,
    title: "Universal Platform Support",
    description: "Seamlessly mix Twitch, YouTube, Kick, and Rumble streams",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: MessageSquare,
    title: "Unified Chat Experience",
    description: "Follow conversations from all streams in one integrated chat panel",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Layout,
    title: "Smart Layout System",
    description: "Auto-adjusting grids, custom layouts, and picture-in-picture modes",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Excellence",
    description: "Fully responsive design with swipe controls and mobile optimization",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Hardware-accelerated streaming with minimal resource usage",
    gradient: "from-yellow-500 to-orange-500"
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
  }>>([])
  const [activeDemo, setActiveDemo] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [demoStreams, setDemoStreams] = useState<Array<{
    channelName: string
    viewerCount: number
  }>>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch top live streams directly
  useEffect(() => {
    const fetchTopStreams = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/twitch/top-streams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 20 })
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

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-32" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        {/* Background Live Streams - Full Coverage */}
        {liveChannels.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 scale-110">
              {[...Array(12)].map((_, index) => {
                const channel = liveChannels[index % liveChannels.length]
                if (!channel) return null
                return (
                  <motion.div 
                    key={`${channel.channelName}-${index}`} 
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ delay: (index % 4) * 0.1, duration: 0.8 }}
                  >
                    <div className="aspect-video relative">
                      <iframe
                        src={`https://player.twitch.tv/?channel=${channel.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true&controls=false`}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen={false}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {/* Logo Animation */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20">
                  <Sparkles className="w-24 h-24 text-primary" />
                </div>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Multi-Stream
              </span>
              <br />
              <span className="text-3xl md:text-5xl text-muted-foreground">
                Viewing Perfected
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Watch up to 16 live streams simultaneously from Twitch, YouTube, and more. 
              The ultimate streaming experience with zero compromises.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                onClick={onAddStream}
                className="gap-3 text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <PlayCircle className="w-6 h-6" />
                Start Watching Now
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-3 text-lg px-8 py-6 border-2"
              >
                See It In Action
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section with Live Streams */}
      <section id="demo" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">
              {loading ? "Loading live streams..." : "Experience multi-stream viewing with real live streams"}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2">
              {/* Demo Controls */}
              <div className="flex justify-center gap-2 mb-6">
                {demoLayouts.map((layout, index) => (
                  <Button
                    key={layout.name}
                    variant={activeDemo === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDemo(index)}
                    className="gap-2"
                  >
                    <layout.icon className="w-4 h-4" />
                    {layout.name}
                  </Button>
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
                              <iframe
                                src={`https://player.twitch.tv/?channel=${stream.channelName}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true&autoplay=true`}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                scrolling="no"
                                allowFullScreen={true}
                              />
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Simple as 1-2-3</h2>
          
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
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Powerful features that make multi-streaming effortless</p>
          </div>
          
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
                  "p-6 h-full transition-all duration-300",
                  hoveredFeature === index && "shadow-2xl scale-105"
                )}>
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-r flex items-center justify-center mb-4 transition-transform",
                    feature.gradient,
                    hoveredFeature === index && "scale-110 rotate-3"
                  )}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-xl text-muted-foreground">Whatever you're watching, we've got you covered</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow">
                  <useCase.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                  <p className="text-xs text-primary">{useCase.example}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streamers Section - Enhanced */}
      {liveChannels.length > 0 && (
        <section className="py-20 border-t bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 animate-pulse" />
                  <div className="w-4 h-4 bg-red-600 rounded-full relative" />
                </div>
                Popular Streams Live Now
              </h2>
              <p className="text-muted-foreground">Click any stream to add it instantly</p>
            </div>
            
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
                    <div className="aspect-video bg-gradient-to-br from-red-600/20 to-purple-600/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white/80 transition-colors" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-600 text-white border-0 text-xs">
                          LIVE
                        </Badge>
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

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> Viewing Experience?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of viewers who've discovered the better way to watch streams.
            </p>
            
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={onAddStream}
                className="gap-3 text-lg px-10 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Zap className="w-6 h-6" />
                Start Streaming Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}