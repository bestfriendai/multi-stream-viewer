import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Monitor, 
  Users, 
  Zap, 
  Globe, 
  Shield, 
  Smartphone, 
  Layout, 
  MessageSquare, 
  Volume2, 
  Settings, 
  Download, 
  Eye, 
  Clock, 
  Star,
  CheckCircle,
  Play,
  BarChart3,
  Layers,
  Keyboard
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Streamyyy Features - Advanced Multi-Stream Viewer Capabilities',
  description: 'Discover all Streamyyy features: watch 16+ streams simultaneously, unified chat, mobile support, custom layouts, and more. Complete feature overview.',
  keywords: 'streamyyy features, multi stream viewer features, twitch multistream features, stream viewer capabilities, multi platform streaming',
  openGraph: {
    title: 'Streamyyy Features - Advanced Multi-Stream Viewer',
    description: 'Comprehensive overview of Streamyyy\'s powerful multi-stream viewing features and capabilities.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/features'
  }
}

const coreFeatures = [
  {
    icon: Monitor,
    title: 'Multi-Stream Viewing',
    description: 'Watch up to 16 streams simultaneously',
    details: [
      'Support for 16+ concurrent streams',
      'Advanced grid layouts (2x2, 3x3, 4x4)',
      'Custom arrangement options',
      'Picture-in-picture mode',
      'Mosaic and focus layouts'
    ],
    highlight: 'Up to 16 streams'
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Works with Twitch, YouTube, Kick, and more',
    details: [
      'Twitch streams and chat integration',
      'YouTube live streams support',
      'Kick platform compatibility',
      'Rumble streaming support',
      'Cross-platform viewing in one interface'
    ],
    highlight: '4+ platforms'
  },
  {
    icon: Users,
    title: 'Unified Chat Management',
    description: 'All chats in one convenient panel',
    details: [
      'Combine chats from all streams',
      'Switch between individual chats',
      'Chat filtering and moderation',
      'Emote support across platforms',
      'Real-time chat synchronization'
    ],
    highlight: 'All chats unified'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Perfect experience on any device',
    details: [
      'Responsive design for all screen sizes',
      'Touch-optimized controls',
      'Mobile-specific layouts',
      'Gesture navigation support',
      'Optimized for mobile bandwidth'
    ],
    highlight: 'Works everywhere'
  }
]

const advancedFeatures = [
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Smooth streaming even with many streams',
    features: [
      'Hardware acceleration support',
      'Intelligent quality adjustment',
      'Low latency streaming',
      'Efficient resource management',
      'Automatic sync optimization'
    ]
  },
  {
    icon: Layout,
    title: 'Custom Layouts',
    description: 'Create and save your perfect viewing setup',
    features: [
      'Drag and drop stream arrangement',
      'Save multiple layout presets',
      'Share layouts with others',
      'Import/export configurations',
      'Quick layout switching'
    ]
  },
  {
    icon: Volume2,
    title: 'Audio Management',
    description: 'Advanced audio controls for multiple streams',
    features: [
      'Individual stream volume control',
      'Master volume management',
      'Audio-only mode for background streams',
      'Sound isolation options',
      'Audio quality optimization'
    ]
  },
  {
    icon: Shield,
    title: 'Ad-Free Experience',
    description: 'No advertisements or interruptions',
    features: [
      'Zero pre-roll advertisements',
      'No mid-stream interruptions',
      'Clean viewing interface',
      'Faster loading times',
      'Uninterrupted streaming'
    ]
  },
  {
    icon: Settings,
    title: 'Advanced Controls',
    description: 'Professional-grade streaming controls',
    features: [
      'Keyboard shortcuts support',
      'Stream synchronization controls',
      'Quality presets and profiles',
      'Bandwidth monitoring',
      'Performance analytics'
    ]
  },
  {
    icon: Eye,
    title: 'Discovery Features',
    description: 'Find and explore new content',
    features: [
      'Live stream recommendations',
      'Category browsing',
      'Trending content discovery',
      'Following integration',
      'Popular combinations'
    ]
  }
]

const comparisons = [
  {
    feature: 'Maximum Streams',
    streamyyy: '16+ streams',
    competitors: '4-8 streams',
    advantage: '2-4x more streams'
  },
  {
    feature: 'Platform Support',
    streamyyy: '4+ platforms',
    competitors: '1-2 platforms',
    advantage: 'True multi-platform'
  },
  {
    feature: 'Mobile Support',
    streamyyy: 'Fully optimized',
    competitors: 'Limited or none',
    advantage: 'Best mobile experience'
  },
  {
    feature: 'Performance',
    streamyyy: 'Hardware accelerated',
    competitors: 'Basic optimization',
    advantage: 'Superior performance'
  },
  {
    feature: 'Ads',
    streamyyy: 'Zero ads',
    competitors: 'Various ads',
    advantage: 'Clean experience'
  },
  {
    feature: 'Cost',
    streamyyy: 'Free forever',
    competitors: 'Free with limits',
    advantage: 'No restrictions'
  }
]

const useCases = [
  {
    title: 'Esports Tournaments',
    icon: '🏆',
    description: 'Follow multiple players and matches simultaneously',
    benefits: [
      'Never miss crucial moments',
      'Compare different player strategies',
      'Watch multiple matches at once',
      'Full tournament coverage'
    ]
  },
  {
    title: 'Content Creation',
    icon: '🎬',
    description: 'Monitor and collaborate with other creators',
    benefits: [
      'Watch your own stream while viewing others',
      'Coordinate with other streamers',
      'Study successful streaming techniques',
      'Find collaboration opportunities'
    ]
  },
  {
    title: 'Community Events',
    icon: '🎮',
    description: 'Stay connected with your gaming community',
    benefits: [
      'Follow friend group activities',
      'Watch community game nights',
      'Support multiple streamers at once',
      'Never miss community events'
    ]
  },
  {
    title: 'Professional Monitoring',
    icon: '📊',
    description: 'Monitor multiple streams for business purposes',
    benefits: [
      'Track brand mentions across streams',
      'Monitor sponsored content',
      'Analyze competitor activities',
      'Gather market intelligence'
    ]
  }
]

export default function FeaturesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy Features",
    "description": "Advanced multi-stream viewer with support for 16+ streams, unified chat, mobile optimization, and more.",
    "url": "https://streamyyy.com/features",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "featureList": [
      "Watch up to 16 streams simultaneously",
      "Multi-platform support (Twitch, YouTube, Kick, Rumble)",
      "Unified chat management across all streams",
      "Mobile-optimized responsive design",
      "Advanced layout customization",
      "Hardware acceleration support",
      "Ad-free viewing experience",
      "Keyboard shortcuts and advanced controls",
      "Stream discovery and recommendations",
      "Performance optimization features"
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">FEATURE OVERVIEW</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Streamyyy Features
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the most advanced multi-stream viewing platform. 
            Built for creators, viewers, and professionals who demand the best.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Try All Features Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/how-to-watch-multiple-streams">Learn How to Use</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">16+</div>
              <div className="text-sm text-muted-foreground">Max Streams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">4+</div>
              <div className="text-sm text-muted-foreground">Platforms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Ads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-purple-600" />
                      <Badge variant="secondary">{feature.highlight}</Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How Streamyyy Compares</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border">
              <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium">
                <div>Feature</div>
                <div className="text-center font-bold text-purple-600">Streamyyy</div>
                <div className="text-center">Other Tools</div>
                <div className="text-center">Advantage</div>
              </div>
              {comparisons.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center font-semibold text-green-600">{row.streamyyy}</div>
                  <div className="text-center text-muted-foreground">{row.competitors}</div>
                  <div className="text-center text-purple-600 font-medium">{row.advantage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect for Every Use Case</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{useCase.icon}</span>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Hardware acceleration support</li>
                  <li>• 60 FPS playback capability</li>
                  <li>• Sub-second latency</li>
                  <li>• Adaptive quality streaming</li>
                  <li>• Memory-optimized rendering</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• All modern web browsers</li>
                  <li>• Desktop, tablet, mobile</li>
                  <li>• iOS and Android devices</li>
                  <li>• Windows, Mac, Linux</li>
                  <li>• Progressive Web App support</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• No data collection</li>
                  <li>• HTTPS encryption</li>
                  <li>• No account required</li>
                  <li>• Privacy-first design</li>
                  <li>• GDPR compliant</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Keyboard Shortcuts</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Power User Controls
              </CardTitle>
              <CardDescription>Master these shortcuts for lightning-fast navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Stream Controls</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Play/Pause focused stream</span>
                      <code className="bg-muted px-2 py-1 rounded">Space</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Fullscreen current stream</span>
                      <code className="bg-muted px-2 py-1 rounded">F</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Mute/unmute focused stream</span>
                      <code className="bg-muted px-2 py-1 rounded">M</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle through streams</span>
                      <code className="bg-muted px-2 py-1 rounded">Tab</code>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Layout Controls</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Switch to 2x2 layout</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl+2</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Switch to 3x3 layout</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl+3</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle chat panel</span>
                      <code className="bg-muted px-2 py-1 rounded">C</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Add new stream</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl+N</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Experience All Features Today</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who've discovered the most advanced multi-stream viewing platform. 
            All features are free and available instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">Start Using Streamyyy</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/how-to-watch-multiple-streams">Read the Complete Guide</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Works instantly • All features included
          </p>
        </div>
      </div>
    </div>
  )
}