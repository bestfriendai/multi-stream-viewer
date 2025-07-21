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
import { Monitor, Youtube, Twitch, Globe, Zap, Users, Layout, PlayCircle, Star, Shield, Clock, Smartphone, Award } from 'lucide-react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
}

export const metadata: Metadata = generateLandingPageMetadata({
  title: 'Watch Multiple Streams at Once - Multi-Platform Stream Viewer | Streamyyy',
  description: 'Watch multiple live streams simultaneously from Twitch, YouTube, and more. Free multi-stream viewer for watching many streams at once in a single window. Perfect for esports and gaming.',
  canonical: 'https://streamyyy.com/watch-multiple-streams',
  image: '/og-watch-multiple-streams.jpg',
  imageAlt: 'Watch Multiple Streams Simultaneously with Streamyyy',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  author: 'Streamyyy Team',
  tags: ['watch multiple streams', 'multi-platform streaming', 'watch many streams', 'simultaneous streaming', 'cross-platform viewer']
})

export default function WatchMultipleStreams() {
  const faqs = [
    {
      question: "How can I watch multiple streams at once?",
      answer: "With Streamyyy's free multi-stream viewer, you can watch up to 16 streams simultaneously from platforms like Twitch, YouTube, and Rumble. Simply add stream URLs or channel names, choose your layout, and start watching multiple streams at once."
    },
    {
      question: "Which platforms support watching multiple streams simultaneously?",
      answer: "Streamyyy supports watching multiple streams from Twitch, YouTube Live, Rumble, and other major streaming platforms. You can mix and match streams from different platforms in the same viewing session."
    },
    {
      question: "Is it free to watch multiple streams at once?",
      answer: "Yes! Streamyyy is completely free to use for watching multiple streams simultaneously. No registration, no subscription fees, no limitations - just add your streams and start watching."
    },
    {
      question: "Can I watch multiple streams on mobile devices?",
      answer: "Absolutely! Streamyyy is fully optimized for mobile devices, allowing you to watch multiple streams simultaneously on smartphones and tablets with touch-friendly controls and responsive layouts."
    },
    {
      question: "How many streams can I watch simultaneously?",
      answer: "You can watch up to 16 streams at once with Streamyyy. Choose from various layout options including 2x2 (4 streams), 3x3 (9 streams), or 4x4 (16 streams) to customize your multi-stream viewing experience."
    }
  ]

  const breadcrumbItems = [
    { label: 'Watch Multiple Streams' }
  ]

  return (
    <article className="min-h-screen bg-background">
      <CoreWebVitalsMonitor />
      <PerformanceOptimizer />
      <EnhancedSEOSchema
        faqs={faqs}
        type="SoftwareApplication"
        title="Watch Multiple Streams at Once - Multi-Platform Stream Viewer"
        description="Watch multiple live streams simultaneously from Twitch, YouTube, and more. Free multi-stream viewer for watching many streams at once in a single window."
        url="https://streamyyy.com/watch-multiple-streams"
        image="/og-watch-multiple-streams.jpg"
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
            Updated 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Watch Multiple Streams at Once
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The ultimate free multi-stream viewer to watch many live streams simultaneously.
            Cross-platform support for Twitch, YouTube, Rumble and more in one unified viewer.
          </p>

          {/* Trust Signals */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">50K+ Users</span>
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
              <span className="font-semibold">Multi-Platform</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button size="lg" className="text-lg px-8">
                <PlayCircle className="mr-2" />
                Start Multi-Streaming
              </Button>
            </Link>
            <Link href="/#discover">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Discover Live Streams
              </Button>
            </Link>
          </div>
          
          {/* Platform Logos */}
          <div className="flex justify-center gap-8 mt-12 opacity-60">
            <Twitch className="w-12 h-12" />
            <Youtube className="w-12 h-12" />
            <Globe className="w-12 h-12" />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Best Way to Watch Multiple Streams
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Whether you&apos;re following esports tournaments, content creators, or live events, 
            Streamyyy makes it easy to watch everything at once.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20">
              <CardHeader>
                <Monitor className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Multi-Platform Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Watch streams from Twitch, YouTube, Rumble and more platforms simultaneously. 
                  Mix and match streams from different platforms in one view.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Layout className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Flexible Layouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from multiple layout options or create custom arrangements. 
                  Watch 2, 4, 9, or up to 16 streams at once with perfect sizing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Real-Time Features</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Live viewer counts, stream status indicators, and integrated chat. 
                  Control audio and video quality for each stream independently.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Watch Streams from All Major Platforms
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Twitch className="w-8 h-8 text-purple-600" />
                  <CardTitle>Twitch Streams</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Live viewer counts</li>
                  <li>✓ Chat integration</li>
                  <li>✓ Category browsing</li>
                  <li>✓ Clips and highlights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Youtube className="w-8 h-8 text-red-600" />
                  <CardTitle>YouTube Live</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Live streams support</li>
                  <li>✓ Video embedding</li>
                  <li>✓ Quality selection</li>
                  <li>✓ Full-screen mode</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-8 h-8 text-green-600" />
                  <CardTitle>Other Platforms</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Rumble support</li>
                  <li>✓ More coming soon</li>
                  <li>✓ Universal player</li>
                  <li>✓ Cross-platform viewing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Popular Ways to Use Multi-Stream Viewer
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎮 Gaming Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                  Watch multiple player perspectives during esports events, 
                  tournaments, and competitive matches.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Content Creator Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  Follow your favorite streamer squad or content creator 
                  collaborations across multiple channels.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎵 Music & Podcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  Watch live music performances, DJ sets, or podcast recordings 
                  from different angles and perspectives.
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📰 News & Events</CardTitle>
                </CardHeader>
                <CardContent>
                  Monitor multiple news sources or live event coverage 
                  simultaneously for comprehensive viewing.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏃 Speedrun Marathons</CardTitle>
                </CardHeader>
                <CardContent>
                  Watch multiple speedrunners compete or follow different 
                  games during charity marathons.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎨 Creative Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  Watch artists, makers, and creators work on projects 
                  simultaneously for inspiration.
                </CardContent>
              </Card>
            </div>
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
            <Card>
              <CardHeader>
                <CardTitle>How many streams can I watch at once?</CardTitle>
              </CardHeader>
              <CardContent>
                You can watch up to 16 streams simultaneously. The layout automatically 
                adjusts based on the number of streams you add.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is it free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                Yes! Streamyyy is completely free to use. No registration, no subscription, 
                no hidden fees. Just add streams and start watching.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I mix streams from different platforms?</CardTitle>
              </CardHeader>
              <CardContent>
                Absolutely! You can watch Twitch, YouTube, and other supported platform 
                streams all in the same viewer.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Does it work on mobile devices?</CardTitle>
              </CardHeader>
              <CardContent>
                Yes, Streamyyy is fully responsive and works on phones, tablets, and 
                desktop computers with optimized layouts for each device.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Watch Multiple Streams?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who enhance their streaming experience with Streamyyy.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                Start Watching Now
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="text-lg px-12">
                Learn More
              </Button>
            </Link>
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

      {/* Enhanced Final CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Watching Multiple Streams Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who watch multiple streams simultaneously with Streamyyy.
            Free forever, no registration required, works on all devices.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                <PlayCircle className="mr-2" />
                Watch Multiple Streams Now
              </Button>
            </Link>
            <Link href="/multi-stream-viewer">
              <Button size="lg" variant="outline" className="text-lg px-12">
                Learn More Features
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
    </article>
  )
}