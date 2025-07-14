import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Monitor, Users, Zap, Globe, Play, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Twitch Multistream Viewer - Watch Multiple Twitch Streams at Once | Streamyyy',
  description: 'Best Twitch multistream viewer. Watch multiple Twitch streams simultaneously with advanced layouts, chat integration, and mobile support. Free forever.',
  keywords: 'twitch multistream, twitch multi stream, multistream twitch, twitch multistream viewer, multiple twitch streams, twitch multi view',
  openGraph: {
    title: 'Twitch Multistream Viewer - Watch Multiple Streams Simultaneously',
    description: 'The ultimate Twitch multistream experience. Watch up to 16 streams at once with advanced features.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/twitch-multistream'
  }
}

const features = [
  {
    icon: Monitor,
    title: 'Advanced Multistream Layouts',
    description: 'Choose from 2x2, 3x3, 4x4 grids, picture-in-picture, and custom arrangements',
    stats: 'Up to 16 streams'
  },
  {
    icon: Users,
    title: 'Unified Twitch Chat',
    description: 'View and participate in multiple Twitch chats simultaneously',
    stats: 'All chats in one panel'
  },
  {
    icon: Zap,
    title: 'Superior Performance',
    description: 'Optimized for smooth playback across multiple Twitch streams',
    stats: '60 FPS on all streams'
  },
  {
    icon: Globe,
    title: 'Mobile Multistream',
    description: 'Perfect Twitch multistream experience on any device',
    stats: 'Works everywhere'
  }
]

const useCases = [
  {
    title: 'Esports Tournaments',
    description: 'Follow multiple player POVs during competitive matches',
    examples: ['League of Legends Worlds', 'CS:GO Majors', 'Valorant Champions']
  },
  {
    title: 'Speedrun Events',
    description: 'Watch multiple runners competing in the same category',
    examples: ['Games Done Quick', 'ESA events', 'RPG Limit Break']
  },
  {
    title: 'Community Events',
    description: 'Follow your favorite streamers during group activities',
    examples: ['Among Us lobbies', 'Minecraft events', 'Variety game shows']
  },
  {
    title: 'Content Creation',
    description: 'Monitor your stream while watching others for collaboration',
    examples: ['Raid targets', 'Collaboration planning', 'Community engagement']
  }
]

const benefits = [
  'Watch up to 16 Twitch streams simultaneously',
  'Advanced layout customization options',
  'Integrated chat for all streams',
  'Mobile-responsive multistream viewing',
  'No ads interrupting your experience',
  'Completely free with no limitations',
  'Works with any Twitch channel',
  'Save and share multistream layouts'
]

export default function TwitchMultistreamPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy - Twitch Multistream Viewer",
    "description": "Watch multiple Twitch streams simultaneously with advanced layouts and chat integration.",
    "url": "https://streamyyy.com/twitch-multistream",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Twitch multistream viewing up to 16 streams",
      "Advanced layout options for multistream",
      "Unified Twitch chat integration",
      "Mobile multistream support",
      "Ad-free multistream experience",
      "Custom multistream arrangements"
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">TWITCH MULTISTREAM</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Twitch Multistream Viewer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The ultimate way to watch multiple Twitch streams simultaneously. 
            Advanced layouts, unified chat, and perfect performance across all devices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Multistreaming Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">16</div>
              <div className="text-sm text-muted-foreground">Max Streams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Ads Shown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-muted-foreground">Layouts</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Twitch Multistream Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect for Every Twitch Multistream Scenario</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-2">Popular Events:</h4>
                    <ul className="text-sm space-y-1">
                      {useCase.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Streamyyy for Twitch Multistream?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">{benefit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Get Started */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Start Your Twitch Multistream Experience</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2 mx-auto">
                  1
                </div>
                <CardTitle>Visit Streamyyy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Open streamyyy.com in your browser - no downloads or installations needed.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2 mx-auto">
                  2
                </div>
                <CardTitle>Add Twitch Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enter Twitch channel names or URLs to add them to your multistream layout.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2 mx-auto">
                  3
                </div>
                <CardTitle>Enjoy Multistream</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose your layout and start watching multiple Twitch streams simultaneously!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience Twitch Multistream?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of viewers who've discovered the superior way to watch multiple Twitch streams. 
            Start your multistream journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">Start Twitch Multistream</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/guide/watching-multiple-streams">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}