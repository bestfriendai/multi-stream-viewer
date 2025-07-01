import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SEOSchema from '@/components/SEOSchema'
import { 
  Monitor, Users, Zap, Globe, MessageSquare, Layout, 
  CheckCircle2, Star, TrendingUp, Shield, Clock, Smartphone 
} from 'lucide-react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
}

export const metadata: Metadata = {
  title: 'Multi-Stream Viewer - Watch Multiple Live Streams Simultaneously | Streamyyy',
  description: 'The best free multi-stream viewer for watching multiple Twitch, YouTube, and live streams at once. Perfect for esports, gaming events, and content creators. Updated for 2025.',
  alternates: {
    canonical: 'https://streamyyy.com/multi-stream-viewer',
  },
  other: {
    'article:published_time': new Date().toISOString(),
    'article:modified_time': new Date().toISOString(),
    'article:author': 'Streamyyy Team',
  }
}

export default function MultiStreamViewer() {
  const faqs = [
    {
      question: "What is a multi-stream viewer?",
      answer: "A multi-stream viewer is a tool that allows you to watch multiple live streams simultaneously in one window. Streamyyy lets you watch up to 16 streams from platforms like Twitch, YouTube, and Rumble at the same time."
    },
    {
      question: "How does Streamyyy's multi-stream viewer work?",
      answer: "Simply add stream URLs or channel names, choose your preferred layout (2x2, 3x3, 4x4, or custom), and start watching. Each stream can be controlled independently with audio, quality, and chat options."
    },
    {
      question: "Is the multi-stream viewer free?",
      answer: "Yes, Streamyyy is 100% free to use with no limits. No sign-up required, no premium features, just add streams and start watching multiple streams instantly."
    },
    {
      question: "Which platforms are supported?",
      answer: "Streamyyy supports Twitch, YouTube Live, Rumble, and more platforms. You can mix streams from different platforms in the same viewing session."
    },
    {
      question: "Can I use it on mobile?",
      answer: "Yes! Streamyyy is fully responsive and works perfectly on smartphones, tablets, and desktop computers with optimized layouts for each device type."
    }
  ]

  return (
    <article className="min-h-screen bg-background">
      <SEOSchema faqs={faqs} type="Article" />
      
      {/* Hero Section with E-E-A-T signals */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Updated June 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Multi-Stream Viewer by Streamyyy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Watch multiple live streams simultaneously from Twitch, YouTube, and more. 
              The most advanced free multi-stream viewer trusted by over 50,000 users.
            </p>
            
            {/* Trust Signals */}
            <div className="flex justify-center gap-8 mb-8">
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
              Why Choose Streamyyy Multi-Stream Viewer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with the latest technology for optimal performance and user experience in 2025
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Lightning Fast Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimized for Core Web Vitals with instant loading, smooth interactions, 
                  and zero layout shifts. Experience the fastest multi-stream viewer available.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Mobile-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fully responsive with touch gestures, swipe controls, and optimized 
                  layouts for every device. Perfect performance on phones and tablets.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Live viewer counts, stream statistics, and performance metrics. 
                  Track engagement across all your streams in real-time.
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

      {/* Final CTA with Trust Signals */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Using the Best Multi-Stream Viewer Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust Streamyyy for their multi-stream viewing needs.
            No sign-up, no fees, just instant multi-streaming.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                Launch Multi-Stream Viewer
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
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
          </div>
        </div>
      </section>
    </article>
  )
}