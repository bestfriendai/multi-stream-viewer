import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EnhancedSEOSchema from '@/components/EnhancedSEOSchema'
import CoreWebVitalsMonitor from '@/components/CoreWebVitalsMonitor'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import { generateLandingPageMetadata } from '@/components/SEOMetadata'
import Breadcrumb from '@/components/Breadcrumb'
import { CheckCircle2, Monitor, Users, MessageSquare, Star, Shield, Clock, Smartphone, PlayCircle, Award } from 'lucide-react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
}

export const metadata: Metadata = generateLandingPageMetadata({
  title: 'Watch Multiple Twitch Streams Simultaneously - Best Multi-Stream Viewer 2025',
  description: 'Watch multiple Twitch streams at once with Streamyyy. Free multi-stream viewer supporting up to 16 streams simultaneously. Perfect for tournaments, esports, and gaming events.',
  canonical: 'https://streamyyy.com/watch-multiple-twitch-streams',
  image: '/og-multiple-twitch-streams.png',
  imageAlt: 'Watch Multiple Twitch Streams with Streamyyy',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  author: 'Streamyyy Team',
  tags: ['watch multiple twitch streams', 'twitch multi stream', 'watch multiple streams simultaneously', 'twitch multistream viewer', 'multi stream twitch', 'watch many twitch streams']
})

export default function WatchMultipleTwitchStreams() {
  const faqs = [
    {
      question: "How many Twitch streams can I watch at once?",
      answer: "With Streamyyy, you can watch up to 16 Twitch streams simultaneously in various layouts including 2x2, 3x3, and custom arrangements. This is perfect for esports tournaments, speedrun marathons, and following multiple streamers."
    },
    {
      question: "Is it free to watch multiple Twitch streams?",
      answer: "Yes, Streamyyy is completely free to use. There are no premium features or subscription fees required to watch multiple Twitch streams. Unlike other multi-stream viewers, we provide all features at no cost."
    },
    {
      question: "Can I chat while watching multiple Twitch streams?",
      answer: "Yes, Streamyyy includes integrated Twitch chat support. You can view and participate in chat for any of the streams you're watching, with easy switching between different stream chats."
    },
    {
      question: "Does watching multiple Twitch streams work on mobile?",
      answer: "Absolutely! Streamyyy is fully responsive and optimized for mobile devices, tablets, and desktop computers. Our mobile interface is specifically designed for watching multiple Twitch streams on the go."
    },
    {
      question: "What's the best layout for watching multiple Twitch streams?",
      answer: "The best layout depends on your needs. For tournaments, try 2x2 (4 streams) or 3x3 (9 streams). For casual viewing, 2x2 works great. For major events, you can use our 4x4 layout to watch up to 16 Twitch streams simultaneously."
    }
  ]

  const breadcrumbItems = [
    { label: 'Watch Multiple Twitch Streams' }
  ]

  return (
    <article className="min-h-screen bg-background">
      <CoreWebVitalsMonitor />
      <PerformanceOptimizer />
      <EnhancedSEOSchema
        faqs={faqs}
        type="SoftwareApplication"
        title="Watch Multiple Twitch Streams Simultaneously - Best Multi-Stream Viewer 2025"
        description="Watch multiple Twitch streams at once with Streamyyy. Free multi-stream viewer supporting up to 16 streams simultaneously. Perfect for tournaments, esports, and gaming events."
        url="https://streamyyy.com/watch-multiple-twitch-streams"
        image="/og-multiple-twitch-streams.png"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
        author="Streamyyy Team"
      />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Clock className="w-3 h-3 mr-1" />
            Best Twitch Multi-Stream Viewer 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Watch Multiple Twitch Streams Simultaneously
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The best free tool to watch many Twitch streams at once. Perfect for esports tournaments,
            speedrun marathons, and following your favorite streamers. Up to 16 streams simultaneously.
          </p>

          {/* Trust Signals */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">50K+ Twitch Viewers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">4.8/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold">100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">16 Streams Max</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button size="lg" className="text-lg px-8">
                <PlayCircle className="mr-2" />
                Start Watching Twitch Streams
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Use Streamyyy for Multiple Twitch Streams?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Monitor className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Watch Up to 16 Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View multiple Twitch streams in customizable layouts. Perfect for watching 
                  tournaments, raids, or your favorite streamer squad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Integrated Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Switch between different Twitch chats seamlessly. Never miss important 
                  messages while watching multiple streams.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Live Viewer Counts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See real-time viewer counts and stream status. Know which streams are 
                  live and how many people are watching.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How to Watch Multiple Twitch Streams
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Add Twitch Channels</h3>
                <p className="text-muted-foreground">
                  Simply enter the Twitch username or channel URL. Add as many streams as you want to watch.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Choose Your Layout</h3>
                <p className="text-muted-foreground">
                  Select from multiple layout options - 2x2 grid, 3x3 grid, or custom focus mode with one main stream.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Watch and Chat</h3>
                <p className="text-muted-foreground">
                  Enjoy watching multiple Twitch streams simultaneously. Switch between chats and control audio for each stream.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect for Every Twitch Viewer
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Esports Tournaments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch multiple POVs during tournaments</p>
                <p>Follow different matches simultaneously</p>
                <p>Never miss crucial moments across streams</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Content Creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Monitor your stream while watching others</p>
                <p>Watch for raids and host opportunities</p>
                <p>Keep up with your streaming community</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gaming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch speedrun marathons with multiple runners</p>
                <p>Follow charity events across channels</p>
                <p>Experience gaming showcases fully</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Friend Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch your whole squad stream together</p>
                <p>Follow multiplayer games from all angles</p>
                <p>Support multiple streamers at once</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Watching Multiple Twitch Streams Now
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of Twitch viewers using Streamyyy to enhance their multi-stream viewing experience.
            Watch up to 16 Twitch streams simultaneously - completely free forever!
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                <PlayCircle className="mr-2" />
                Open Multi-Stream Viewer
              </Button>
            </Link>
            <Link href="/multitwitch">
              <Button size="lg" variant="outline" className="text-lg px-12">
                MultiTwitch Alternative
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
              50,000+ Twitch Viewers
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
    </article>
  )
}