import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import InternalLinks from '@/components/InternalLinks'

export const metadata: Metadata = {
  title: '16 Stream Viewer - Watch 16 Streams Simultaneously | Streamyyy',
  description: 'Watch up to 16 streams at once with Streamyyy\'s advanced 16 stream viewer. Free multi-stream viewing for Twitch, YouTube, and Kick. No download required.',
  keywords: '16 stream viewer, watch 16 streams, 16 stream layout, multi stream viewer 16, sixteen stream viewer, advanced multi streaming',
  openGraph: {
    title: '16 Stream Viewer - Watch 16 Streams Simultaneously',
    description: 'Watch up to 16 streams at once with Streamyyy\'s advanced 16 stream viewer. Free multi-stream viewing for Twitch, YouTube, and Kick.',
    type: 'website',
    images: [{
      url: '/og-16-stream-viewer.png',
      width: 1200,
      height: 630,
      alt: '16 Stream Viewer - Streamyyy Multi-Stream Layout'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '16 Stream Viewer - Watch 16 Streams Simultaneously',
    description: 'Advanced 16 stream viewer for Twitch, YouTube, and Kick. Free, no download required.',
  }
}

export default function SixteenStreamViewer() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            16 Stream Viewer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Watch up to 16 streams simultaneously with Streamyyy's advanced multi-stream viewer. 
            Perfect for esports tournaments, content discovery, and community events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Watching 16 Streams →
            </Link>
            <Link 
              href="#features"
              className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
          
          {/* Hero Image */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/16-stream-viewer-hero.jpg"
                alt="16 Stream Viewer Layout - Streamyyy showing 16 simultaneous streams"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our 16 Stream Viewer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the most advanced multi-stream viewing with features designed for serious streamers and esports fans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect for Esports</h3>
              <p className="text-muted-foreground">
                Follow multiple matches, tournaments, and competitions simultaneously. Never miss the action.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Optimized Performance</h3>
              <p className="text-muted-foreground">
                Advanced optimization ensures smooth playback of all 16 streams without lag or buffering.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Layouts</h3>
              <p className="text-muted-foreground">
                Adjust stream sizes, positions, and focus areas. Create the perfect viewing experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-muted-foreground">
                Access your 16 stream layout on any device. Touch-friendly controls for mobile viewing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unified Chat</h3>
              <p className="text-muted-foreground">
                Interact with multiple communities at once. Tabbed chat interface for all 16 streams.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🆓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
              <p className="text-muted-foreground">
                No premium features, no ads, no hidden costs. Full 16 stream functionality for everyone.
              </p>
            </div>
          </div>

          {/* Platform Support */}
          <div className="bg-secondary/20 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Supported Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">T</span>
                </div>
                <h4 className="font-semibold">Twitch</h4>
                <p className="text-sm text-muted-foreground">Watch up to 16 Twitch streams</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">Y</span>
                </div>
                <h4 className="font-semibold">YouTube</h4>
                <p className="text-sm text-muted-foreground">Mix YouTube Gaming streams</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">K</span>
                </div>
                <h4 className="font-semibold">Kick</h4>
                <p className="text-sm text-muted-foreground">Include Kick streams in your layout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How to Use the 16 Stream Viewer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with 16 stream viewing in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Streams</h3>
              <p className="text-muted-foreground">
                Search for streamers or paste stream URLs. Add up to 16 streams from any supported platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Layout</h3>
              <p className="text-muted-foreground">
                Select the 4x4 grid layout or customize stream positions and sizes to your preference.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Watching</h3>
              <p className="text-muted-foreground">
                Enjoy all 16 streams simultaneously with unified chat and seamless controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect Use Cases for 16 Stream Viewing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🏆 Esports Tournaments</h3>
              <p className="text-muted-foreground mb-4">
                Follow multiple matches in tournaments like League of Legends Worlds, CS:GO Majors, or Valorant Champions. 
                Watch all group stage matches simultaneously.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Multiple tournament streams</li>
                <li>• Player perspective streams</li>
                <li>• Commentary and analysis</li>
                <li>• Community reactions</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🎮 Content Discovery</h3>
              <p className="text-muted-foreground mb-4">
                Discover new streamers and content by previewing multiple streams at once. 
                Perfect for finding new favorites across different games and platforms.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Browse multiple categories</li>
                <li>• Preview stream quality</li>
                <li>• Compare streamers</li>
                <li>• Find hidden gems</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">👥 Community Events</h3>
              <p className="text-muted-foreground mb-4">
                Monitor community events, collaborations, and multi-streamer activities. 
                Stay connected with your favorite streaming communities.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Multi-streamer collaborations</li>
                <li>• Community game nights</li>
                <li>• Charity events</li>
                <li>• Creator meetups</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📊 Content Creation</h3>
              <p className="text-muted-foreground mb-4">
                Monitor competitors, track trends, and gather content ideas by watching multiple creators 
                in your niche simultaneously.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Competitor analysis</li>
                <li>• Trend monitoring</li>
                <li>• Content inspiration</li>
                <li>• Market research</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              16 Stream Viewer FAQ
            </h2>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Can I really watch 16 streams at the same time?</h3>
              <p className="text-muted-foreground">
                Yes! Streamyyy's 16 stream viewer is optimized to handle up to 16 simultaneous streams with 
                minimal performance impact. The system automatically adjusts quality and buffering to ensure smooth playback.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">What are the system requirements for 16 stream viewing?</h3>
              <p className="text-muted-foreground">
                We recommend at least 8GB RAM, a modern processor (Intel i5 or AMD Ryzen 5), and a stable internet 
                connection with 50+ Mbps download speed for optimal 16 stream performance.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Can I mix streams from different platforms?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can combine Twitch, YouTube, and Kick streams in any combination within your 16 stream layout. 
                Mix and match platforms to create your perfect viewing experience.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Is the 16 stream viewer free to use?</h3>
              <p className="text-muted-foreground">
                Yes, completely free! There are no premium features, no ads, and no hidden costs. 
                All 16 stream functionality is available to everyone at no charge.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Can I save my 16 stream layouts?</h3>
              <p className="text-muted-foreground">
                Yes! You can save your custom 16 stream layouts and share them with others. 
                Create different layouts for different events or purposes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Watch 16 Streams?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the ultimate multi-stream viewing with Streamyyy's advanced 16 stream viewer. 
            Start watching now - no download, no signup required.
          </p>
          <Link 
            href="/"
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Your 16 Stream Experience →
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold mb-6 text-center">Related Multi-Stream Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/mobile-multi-stream" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">Mobile Multi-Stream</h4>
              <p className="text-sm text-muted-foreground">Multi-streaming on mobile devices</p>
            </Link>
            <Link href="/free-multi-stream-viewer" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">Free Multi-Stream Viewer</h4>
              <p className="text-sm text-muted-foreground">100% free multi-stream viewing</p>
            </Link>
            <Link href="/unified-chat-multi-stream" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">Unified Chat</h4>
              <p className="text-sm text-muted-foreground">Chat with multiple communities</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
