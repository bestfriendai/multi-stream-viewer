import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, Star, ArrowLeft, Users, Clock, Zap, Smartphone, Globe, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Streamyyy vs TwitchTheater: Best Multi-Stream Viewer Comparison 2025',
  description: 'Compare Streamyyy and TwitchTheater.tv for multi-stream viewing. See why Streamyyy offers better mobile experience, more platforms, and superior performance.',
  keywords: 'streamyyy vs twitchtheater, twitchtheater alternative, best multi stream viewer 2025, streamyyy better than twitchtheater',
  openGraph: {
    title: 'Streamyyy vs TwitchTheater: Complete Comparison',
    description: 'Discover why Streamyyy is the superior alternative to TwitchTheater with better mobile support, multi-platform streaming, and modern interface.',
    type: 'article'
  }
}

const comparisonData = [
  {
    category: 'Platform Support',
    streamyyy: ['Twitch', 'YouTube', 'Kick', 'Rumble', 'Cross-platform mixing'],
    twitchtheater: ['Twitch', 'YouTube', 'Limited platform integration'],
    winner: 'streamyyy'
  },
  {
    category: 'Mobile Experience',
    streamyyy: ['Native mobile design', 'Touch gestures', 'Mobile-optimized layouts', 'Perfect mobile performance'],
    twitchtheater: ['Basic mobile support', 'Desktop-focused', 'Poor mobile UX', 'Limited mobile features'],
    winner: 'streamyyy'
  },
  {
    category: 'Stream Capacity',
    streamyyy: ['Up to 16 streams', 'Hardware acceleration', 'Efficient memory usage', 'Smooth performance'],
    twitchtheater: ['Limited to 4-6 streams', 'Performance degrades quickly', 'High resource usage'],
    winner: 'streamyyy'
  },
  {
    category: 'User Interface',
    streamyyy: ['Modern, clean design', 'Dark/light themes', 'Intuitive controls', 'Accessibility features'],
    twitchtheater: ['Outdated interface', 'Cluttered layout', 'Limited customization', 'Poor UX'],
    winner: 'streamyyy'
  },
  {
    category: 'Chat Management',
    streamyyy: ['Unified chat panel', 'Multi-platform chat', 'Chat filtering', 'Moderation tools'],
    twitchtheater: ['Separate chat windows', 'Basic chat features', 'No unified management'],
    winner: 'streamyyy'
  },
  {
    category: 'Layout Options',
    streamyyy: ['Custom layouts', 'Picture-in-picture', 'Flexible grids', 'Layout saving'],
    twitchtheater: ['Fixed grid layouts', 'Limited customization', 'No layout saving'],
    winner: 'streamyyy'
  },
  {
    category: 'Performance & Reliability',
    streamyyy: ['99.9% uptime', 'Regular updates', 'Active development', 'Bug fixes'],
    twitchtheater: ['Frequent downtime', 'Slow updates', 'Reliability issues'],
    winner: 'streamyyy'
  }
]

const migrationBenefits = [
  {
    title: 'Better Mobile Experience',
    description: 'Watch streams perfectly on any device with our mobile-first design',
    icon: Smartphone
  },
  {
    title: 'More Platforms',
    description: 'Mix Twitch, YouTube, Kick, and Rumble streams in one view',
    icon: Globe
  },
  {
    title: 'Superior Performance',
    description: 'Handle 16+ streams with smooth performance and low memory usage',
    icon: Zap
  },
  {
    title: 'Better Chat',
    description: 'Unified chat management across all platforms and streams',
    icon: MessageSquare
  }
]

const userReviews = [
  {
    name: 'Jordan T.',
    quote: 'TwitchTheater always crashed on my phone. Streamyyy works perfectly on mobile - exactly what I needed!',
    rating: 5,
    platform: 'Mobile User'
  },
  {
    name: 'Emma R.',
    quote: 'Love being able to watch YouTube and Twitch together. TwitchTheater never had good YouTube support.',
    rating: 5,
    platform: 'Multi-Platform User'
  },
  {
    name: 'Carlos M.',
    quote: 'Performance is so much better. Used to lag with 4 streams on TwitchTheater, now I watch 12+ easily.',
    rating: 5,
    platform: 'Power User'
  }
]

export default function StreamyyyVsTwitchTheaterPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/vs" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Comparisons
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Streamyyy
            </div>
            <div className="text-2xl text-muted-foreground">vs</div>
            <div className="text-4xl font-bold text-muted-foreground">
              TwitchTheater
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive comparison between Streamyyy and TwitchTheater.tv. 
            See why Streamyyy is the modern, mobile-friendly alternative that's taking over.
          </p>
          <Badge className="mt-4 bg-green-600">
            🏆 Streamyyy Rated #1 TwitchTheater Alternative
          </Badge>
        </div>

        {/* Key Migration Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Users Switch from TwitchTheater to Streamyyy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {migrationBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">At a Glance Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Streamyyy</th>
                  <th className="text-center p-4">TwitchTheater</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Maximum Streams</td>
                  <td className="text-center p-4 text-green-600 font-semibold">16+</td>
                  <td className="text-center p-4">4-6</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Mobile Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Excellent</td>
                  <td className="text-center p-4">Poor</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Platform Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">4+ Platforms</td>
                  <td className="text-center p-4">2 Platforms</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Interface Design</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Modern</td>
                  <td className="text-center p-4">Outdated</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Performance</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Optimized</td>
                  <td className="text-center p-4">Heavy</td>
                </tr>
                <tr>
                  <td className="p-4">Development Status</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Active</td>
                  <td className="text-center p-4">Slow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Detailed Feature Breakdown</h2>
          <div className="space-y-6">
            {comparisonData.map((comparison, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {comparison.category}
                    {comparison.winner === 'streamyyy' && (
                      <Badge className="bg-green-600">Streamyyy Advantage</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-purple-600">✅ Streamyyy</h4>
                      <ul className="space-y-2">
                        {comparison.streamyyy.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-muted-foreground">❌ TwitchTheater</h4>
                      <ul className="space-y-2">
                        {comparison.twitchtheater.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* User Reviews */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">What TwitchTheater Users Say About Streamyyy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {userReviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">{review.platform}</Badge>
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic">"{review.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Technical Superiority</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-green-600">99.9%</CardTitle>
                <CardDescription>Uptime Reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Consistent, reliable service</p>
                <p className="text-xs text-muted-foreground mt-2">vs TwitchTheater's frequent outages</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-blue-600">3x</CardTitle>
                <CardDescription>Faster Loading</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Optimized for speed and performance</p>
                <p className="text-xs text-muted-foreground mt-2">Hardware acceleration enabled</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-purple-600">2025</CardTitle>
                <CardDescription>Modern Technology</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Built with latest web standards</p>
                <p className="text-xs text-muted-foreground mt-2">vs TwitchTheater's legacy code</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Upgrade from TwitchTheater?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Experience the future of multi-stream viewing. Better performance, mobile-friendly design, 
            and support for more platforms than TwitchTheater.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Start Using Streamyyy</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/multi-stream-viewer">Learn More About Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Free forever • Better than TwitchTheater
          </p>
        </div>
      </div>
    </div>
  )
}