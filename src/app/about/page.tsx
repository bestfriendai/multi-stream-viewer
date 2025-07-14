import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Zap, 
  Users, 
  Eye, 
  Shield, 
  Smartphone, 
  Globe,
  Monitor,
  Shuffle,
  Brain,
  Sparkles,
  Heart
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Streamyyy - The Future of Multi-Stream Viewing',
  description: 'Learn about Streamyyy, the most advanced multi-stream viewer for Twitch, YouTube, and more. Built for creators, viewers, and esports fans who demand better.',
  keywords: 'about streamyyy, multi stream viewer, twitch viewer, youtube viewer, streaming platform, esports viewer, content creator tools',
  openGraph: {
    title: 'About Streamyyy - Multi-Stream Viewing Revolution',
    description: 'Discover why Streamyyy is the future of watching multiple streams simultaneously. Fast, free, and privacy-focused.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/about'
  }
}

export default function AboutPage() {
  const problems = [
    {
      icon: Eye,
      title: "Multiple Stream Viewing",
      problem: "Watching multiple streams meant juggling tabs, high CPU usage, and missed moments across different platforms.",
      solution: "Streamyyy provides optimized multi-stream viewing with unified layouts, efficient resource management, and seamless platform integration.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Monitor,
      title: "Multi-Monitor Complexity",
      problem: "Multi-monitor setups were expensive, took desk space, and required complex window management to watch multiple streams.",
      solution: "Our advanced grid layouts maximize screen real estate on any device, from mobile phones to ultrawide monitors.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Tournament Coverage",
      problem: "Following esports tournaments meant missing crucial moments when switching between different player perspectives.",
      solution: "Watch up to 16 streams simultaneously with synchronized controls and instant switching between perspectives.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Limitations",
      problem: "Mobile devices couldn't handle multiple streams effectively, with poor performance and limited viewing options.",
      solution: "Mobile-first design with optimized layouts, touch controls, and efficient performance on any device.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Platform Fragmentation",
      problem: "Content was scattered across Twitch, YouTube, Kick, and other platforms, requiring separate tools and interfaces.",
      solution: "Unified multi-platform support bringing together all your favorite streams in one powerful interface.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shuffle,
      title: "Complex Setup",
      problem: "Existing solutions required complex setup, accounts, subscriptions, and technical knowledge to get started.",
      solution: "Zero setup required. Open Streamyyy and start watching immediately. No account, no subscription, no complexity.",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const stats = [
    { number: "1M+", label: "Streams Watched", icon: Eye },
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "Free", label: "Always", icon: Heart },
    { number: "16", label: "Max Streams", icon: Monitor }
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Streamyyy
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
              About Streamyyy
            </span>
            <br />
            <span className="text-2xl md:text-4xl text-muted-foreground">
              The Future of Multi-Stream Viewing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We built Streamyyy because watching one stream at a time is like watching TV in black and white. 
            The future is multi-stream, and we're leading the way.
          </p>
        </div>

        {/* Problems & Solutions Grid */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Problems We Solved
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {problems.map((item, index) => (
              <div key={index}>
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="destructive" className="mb-2">The Problem</Badge>
                          <p className="text-sm text-muted-foreground">{item.problem}</p>
                        </div>
                        <div>
                          <Badge variant="default" className="mb-2 bg-green-600">Our Solution</Badge>
                          <p className="text-sm">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Our Philosophy: <span className="text-primary">Simplicity First</span>
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">No Account Required</h3>
                  <p className="text-muted-foreground">
                    Your time is valuable. You shouldn't need to create an account, verify email, or remember passwords just to watch streams. Open Streamyyy and start watching immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">All Features Free</h3>
                  <p className="text-muted-foreground">
                    We believe powerful tools shouldn't be locked behind paywalls. Every feature in Streamyyy is free, forever. No premium tiers, no feature limits, no hidden costs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Built for Users</h3>
                  <p className="text-muted-foreground">
                    Every decision we make prioritizes user experience over profit. We're not owned by big tech, we don't sell data, and we don't show ads. This is your platform.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index}>
                <Card className="p-6 text-center hover:shadow-lg transition-all">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Why Different Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Blazing Fast</h3>
              <p className="text-muted-foreground">
                Optimized for speed with minimal overhead. Clean, efficient code that loads quickly 
                and runs smoothly across all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy Focused</h3>
              <p className="text-muted-foreground">
                We respect your privacy. We don't sell your data. No account required to start watching. 
                Transparent about our data practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by the community, for the community. Every feature request is considered. 
                Every bug report is valued. This is your platform.
              </p>
            </div>
          </div>
        </div>

        {/* The Future Section */}
        <div className="mb-20">
          <Card className="p-8 md:p-12 border-2 border-primary/30">
            <h2 className="text-3xl font-bold text-center mb-6">The Future is Multi-Stream</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              <p className="text-lg">
                Streaming has evolved. Viewers have evolved. But the tools haven't. Until now.
              </p>
              <p className="text-muted-foreground">
                We're not just building a multi-stream viewer. We're building the future of how 
                people consume live content. Where watching one stream at a time becomes as 
                outdated as black and white TV.
              </p>
              <p className="text-muted-foreground">
                And we're doing it without venture capital, without selling out, without 
                compromising our values. Because some things are more important than money.
              </p>
              <p className="text-lg font-semibold text-primary mt-6">
                Welcome to the revolution. Welcome to Streamyyy.
              </p>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop juggling tabs. Stop missing moments. Stop paying for basic features.
            Start watching smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground rounded-xl font-bold text-lg">
              <Link href="/">
                Start Watching Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-4 border-2 border-primary rounded-xl font-bold text-lg">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center pb-8">
          <p className="text-lg text-muted-foreground italic">
            "We didn't disrupt the industry. We just built what should have existed all along."
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            - The Streamyyy Team
          </p>
        </div>
      </div>
    </div>
  )
}