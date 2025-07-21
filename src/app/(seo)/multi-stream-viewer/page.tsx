import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EnhancedSEOSchema from '@/components/EnhancedSEOSchema'
import CoreWebVitalsMonitor from '@/components/CoreWebVitalsMonitor'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import { generateLandingPageMetadata } from '@/components/SEOMetadata'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedArticles, { multiStreamArticles, tutorialArticles } from '@/components/RelatedArticles'
import {
  Monitor, Users, Zap, Globe, MessageSquare, Layout,
  CheckCircle2, Star, TrendingUp, Shield, Clock, Smartphone, PlayCircle, Award
} from 'lucide-react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
}

export const metadata: Metadata = generateLandingPageMetadata({
  title: 'Multi-Stream Viewer - Watch Multiple Live Streams Simultaneously | Streamyyy',
  description: 'The best free multi-stream viewer for watching multiple Twitch, YouTube, and live streams at once. Perfect for esports, gaming events, and content creators. Updated for 2025.',
  canonical: 'https://streamyyy.com/multi-stream-viewer',
  image: '/og-multi-stream-viewer.jpg',
  imageAlt: 'Streamyyy Multi-Stream Viewer - Watch Multiple Streams Simultaneously',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  author: 'Streamyyy Team',
  tags: ['multi-stream viewer', 'watch multiple streams', 'twitch multi stream', 'youtube multi stream', 'esports viewing', 'streaming tools']
})

export default function MultiStreamViewer() {
  const faqs = [
    {
      question: "What is a multi-stream viewer and how does it work?",
      answer: "A multi-stream viewer is a powerful tool that allows you to watch multiple live streams simultaneously in one window. Streamyyy's free multi-stream viewer lets you watch up to 16 streams from platforms like Twitch, YouTube, and Rumble at the same time with customizable layouts and unified chat management."
    },
    {
      question: "How do I watch multiple Twitch streams simultaneously?",
      answer: "Simply enter Twitch usernames or stream URLs into Streamyyy's multi-stream viewer, choose your preferred layout (2x2, 3x3, 4x4, or custom), and start watching. Each stream can be controlled independently with audio, quality, and chat options. Perfect for esports tournaments and gaming events."
    },
    {
      question: "Is Streamyyy's multi-stream viewer completely free?",
      answer: "Yes, Streamyyy is 100% free to use with no limits, no registration required, and no premium features. Unlike other multi-stream viewers, we offer unlimited access to watch multiple streams simultaneously without any cost or subscription fees."
    },
    {
      question: "Which streaming platforms are supported for multi-viewing?",
      answer: "Streamyyy supports all major streaming platforms including Twitch, YouTube Live, Rumble, and more. You can mix and match streams from different platforms in the same viewing session, making it the most versatile cross-platform multi-stream viewer available."
    },
    {
      question: "Can I use the multi-stream viewer on mobile devices?",
      answer: "Absolutely! Streamyyy is a fully responsive mobile multi-stream viewer that works perfectly on smartphones, tablets, and desktop computers. Our mobile-optimized interface includes touch gestures, swipe controls, and adaptive layouts for the best mobile multi-streaming experience."
    },
    {
      question: "How many streams can I watch at once with Streamyyy?",
      answer: "You can watch up to 16 streams simultaneously with Streamyyy's advanced multi-stream viewer. Choose from various layout options including 2x2 (4 streams), 3x3 (9 streams), 4x4 (16 streams), or create custom arrangements to suit your viewing preferences."
    }
  ]

  const breadcrumbItems = [
    { label: 'Multi-Stream Viewer' }
  ]

  return (
    <article className="min-h-screen bg-background">
      <CoreWebVitalsMonitor />
      <PerformanceOptimizer />
      <EnhancedSEOSchema
        faqs={faqs}
        type="SoftwareApplication"
        title="Multi-Stream Viewer - Watch Multiple Live Streams Simultaneously"
        description="The best free multi-stream viewer for watching multiple Twitch, YouTube, and live streams at once. Perfect for esports, gaming events, and content creators."
        url="https://streamyyy.com/multi-stream-viewer"
        image="/og-multi-stream-viewer.jpg"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
        author="Streamyyy Team"
      />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      {/* Hero Section with E-E-A-T signals */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Updated June 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Multi-Stream Viewer - Watch Multiple Streams Simultaneously
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The best free multi-stream viewer for watching multiple Twitch, YouTube, and live streams at once.
              Perfect for esports tournaments, gaming events, and content creators. Trusted by over 50,000 users worldwide.
            </p>
            
            {/* Enhanced Trust Signals with E-E-A-T */}
            <div className="flex justify-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">50K+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">4.8/5 User Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold">100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Industry Leading</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Updated 2025</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/">
                <Button size="lg" className="text-lg px-8">
                  Launch Multi-Stream Viewer
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Web Vitals Optimized Features */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Streamyyy as Your Multi-Stream Viewer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most advanced free multi-stream viewer built with cutting-edge technology for optimal performance,
              mobile-first design, and superior user experience in 2025. Watch up to 16 streams simultaneously.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Lightning Fast Multi-Stream Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimized for Core Web Vitals with instant loading, smooth interactions,
                  and zero layout shifts. Experience the fastest free multi-stream viewer available
                  with superior performance for watching multiple streams simultaneously.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Mobile Multi-Stream Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fully responsive mobile multi-stream viewer with touch gestures, swipe controls,
                  and optimized layouts for every device. Perfect for watching multiple Twitch streams
                  on mobile, tablets, and desktop computers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Advanced Stream Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Live viewer counts, stream statistics, and performance metrics for all platforms.
                  Track engagement across multiple streams in real-time with comprehensive analytics
                  for Twitch, YouTube, and more.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step Guide */}
      <section className="py-20 px-6 bg-muted/30" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Our Multi-Stream Viewer
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Streams</h3>
                <p className="text-muted-foreground mb-2">
                  Enter channel names or stream URLs from any supported platform:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Twitch: Enter username (e.g., &quot;ninja&quot;) or full URL</li>
                  <li>YouTube: Paste the live stream or video URL</li>
                  <li>Rumble: Use the embed URL from any live stream</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Layout</h3>
                <p className="text-muted-foreground mb-2">
                  Select from pre-configured layouts or create your own:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div className="border rounded-lg p-3 text-center">
                    <Layout className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">2x2 Grid</span>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <Layout className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">3x3 Grid</span>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <Layout className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Focus Mode</span>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <Layout className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Custom</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Control Everything</h3>
                <p className="text-muted-foreground">
                  Manage each stream independently with full controls:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground mt-2">
                  <li>Mute/unmute individual streams</li>
                  <li>Switch between multiple chat windows</li>
                  <li>Adjust quality settings per stream</li>
                  <li>Fullscreen any stream instantly</li>
                  <li>Share your multi-stream setup via URL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases with Rich Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Popular Multi-Stream Viewer Use Cases
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">🎮 Esports Tournaments</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Perfect for watching:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Multiple player POVs in tournaments</li>
                  <li>• Different matches simultaneously</li>
                  <li>• Main stream + player cams</li>
                  <li>• Commentary + gameplay feeds</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">🏃 Speedrun Events</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Ideal for marathons:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Watch multiple runners race</li>
                  <li>• Compare different strategies</li>
                  <li>• Follow GDQ events fully</li>
                  <li>• Never miss world records</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">👥 Content Creator Groups</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Great for collabs:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Watch streamer squads</li>
                  <li>• Follow podcast co-hosts</li>
                  <li>• Multi-POV gameplay</li>
                  <li>• Creator collaborations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">📺 Live Events</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Enhanced viewing for:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Multiple camera angles</li>
                  <li>• News from various sources</li>
                  <li>• Conference streams</li>
                  <li>• Live performances</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">🎨 Creative Streams</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Watch creators:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Art collaboration streams</li>
                  <li>• Music jam sessions</li>
                  <li>• Coding marathons</li>
                  <li>• Design workshops</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">🎯 Personal Use</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Everyday benefits:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Follow friend groups</li>
                  <li>• Monitor your own stream</li>
                  <li>• Background entertainment</li>
                  <li>• Multi-tasking viewing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Features for 2025 SEO */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Built for Performance & Privacy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-green-600 mb-3" />
                <CardTitle>Privacy-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>No account required - completely anonymous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>No tracking cookies or user data collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Secure HTTPS connections only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>GDPR and privacy law compliant</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Optimized for 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Perfect Core Web Vitals scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Mobile-first responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>AI-powered stream recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Adaptive bitrate streaming</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Streamyyy vs Other Multi-Stream Viewers
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Streamyyy</th>
                  <th className="text-center p-4">Others</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Number of Streams</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Up to 16</td>
                  <td className="text-center p-4">Usually 4-8</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Platform Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Multiple</td>
                  <td className="text-center p-4">Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Mobile Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Full</td>
                  <td className="text-center p-4">Partial</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Chat Integration</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Yes</td>
                  <td className="text-center p-4">Sometimes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Cost</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Free</td>
                  <td className="text-center p-4">Often Paid</td>
                </tr>
                <tr>
                  <td className="p-4">Registration Required</td>
                  <td className="text-center p-4 text-green-600 font-semibold">No</td>
                  <td className="text-center p-4">Usually Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Streamyyy is the Best MultiTwitch Alternative
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">🚀 Better than MultiTwitch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Up to 16 streams vs MultiTwitch&apos;s 4 streams</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Mobile-optimized interface (MultiTwitch lacks mobile support)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Cross-platform support (Twitch, YouTube, Rumble)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Always online and reliable (no downtime issues)</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">⚡ Superior to TwitchTheater</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Modern, responsive design vs outdated interface</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Advanced layout customization options</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Unified chat management across all streams</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Regular updates and new features</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Trusted by esports enthusiasts, content creators, and gaming communities worldwide as the
              premier free multi-stream viewer and MultiTwitch replacement.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA with Trust Signals */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Using the Best Free Multi-Stream Viewer Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join over 50,000 users who trust Streamyyy as their go-to multi-stream viewer for watching
            multiple Twitch streams, YouTube live streams, and more. No sign-up required, completely free forever.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                <PlayCircle className="mr-2" />
                Launch Multi-Stream Viewer
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-12">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              100% Free Forever
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              50,000+ Active Users
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              4.8/5 User Rating
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              Mobile Optimized
            </span>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <RelatedArticles 
            title="Continue Learning About Multi-Stream Viewing"
            articles={[...multiStreamArticles, ...tutorialArticles.slice(0, 2)]}
          />
        </div>
      </section>
    </article>
  )
}