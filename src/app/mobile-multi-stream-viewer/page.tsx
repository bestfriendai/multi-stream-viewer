import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  X, 
  Play,
  Download,
  Zap,
  Shield,
  Users,
  Star,
  Globe,
  Wifi,
  Battery
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mobile Multi Stream Viewer - Watch Multiple Streams on Phone & Tablet | Streamyyy',
  description: 'Best mobile multi stream viewer for Twitch, YouTube & more. Watch multiple streams on phone/tablet with touch controls, no app needed. Works on iOS & Android.',
  keywords: 'mobile multi stream viewer, watch multiple streams mobile, twitch multistream android, ios multi stream app, mobile streaming app, tablet multi stream',
  openGraph: {
    title: 'Mobile Multi Stream Viewer - Watch Multiple Streams on Any Device',
    description: 'Perfect mobile experience for watching multiple streams. Touch-optimized controls, responsive layouts, and great performance on phones and tablets.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/mobile-multi-stream-viewer'
  }
}

const mobileFeatures = [
  {
    icon: Smartphone,
    title: 'Touch-Optimized Controls',
    description: 'Intuitive touch gestures for stream switching, volume control, and layout changes',
    benefits: ['Swipe to change streams', 'Pinch to zoom', 'Tap to focus', 'Long press for options']
  },
  {
    icon: Tablet,
    title: 'Responsive Layouts',
    description: 'Perfect viewing experience on any screen size from phones to tablets',
    benefits: ['Auto-adjusting grids', 'Portrait/landscape modes', 'Optimal stream sizing', 'Smart text scaling']
  },
  {
    icon: Battery,
    title: 'Power Efficient',
    description: 'Optimized for mobile battery life without sacrificing performance',
    benefits: ['Efficient video decoding', 'Smart background handling', 'Adaptive quality', 'Low CPU usage']
  },
  {
    icon: Wifi,
    title: 'Data Friendly',
    description: 'Intelligent bandwidth management for cellular and WiFi connections',
    benefits: ['Adaptive streaming', 'Data usage controls', 'WiFi optimization', 'Offline mode prep']
  }
]

const deviceCompatibility = [
  {
    device: 'iPhone',
    compatibility: 'iOS 14+',
    performance: 'Excellent',
    maxStreams: '8+ streams',
    features: ['Safari optimization', 'PWA support', 'Touch gestures', 'Picture-in-picture']
  },
  {
    device: 'Android Phone',
    compatibility: 'Android 8+', 
    performance: 'Excellent',
    maxStreams: '8+ streams',
    features: ['Chrome optimization', 'PWA support', 'Touch gestures', 'Background playback']
  },
  {
    device: 'iPad',
    compatibility: 'iPadOS 14+',
    performance: 'Outstanding',
    maxStreams: '16+ streams',
    features: ['Large screen layouts', 'Multi-window support', 'Apple Pencil support', 'Keyboard shortcuts']
  },
  {
    device: 'Android Tablet',
    compatibility: 'Android 8+',
    performance: 'Outstanding', 
    maxStreams: '16+ streams',
    features: ['Tablet layouts', 'Multi-window support', 'External keyboard', 'USB-C output']
  }
]

const mobileProblems = [
  {
    problem: 'Apps Require Installation',
    solution: 'Works instantly in any mobile browser - no app store downloads'
  },
  {
    problem: 'Poor Touch Controls',
    solution: 'Native touch gestures designed specifically for mobile viewing'
  },
  {
    problem: 'Battery Drain Issues',
    solution: 'Optimized video processing reduces battery usage by up to 40%'
  },
  {
    problem: 'Data Usage Concerns',
    solution: 'Smart bandwidth management and quality controls save data'
  },
  {
    problem: 'Small Screen Viewing',
    solution: 'Responsive layouts and focus modes maximize screen real estate'
  },
  {
    problem: 'Limited Stream Count',
    solution: 'Watch up to 16 streams even on mobile devices'
  }
]

const useCases = [
  {
    title: 'Tournament Viewing on the Go',
    icon: '🏆',
    description: 'Never miss esports action when you\'re away from your computer',
    scenarios: [
      'Watch tournaments during commute',
      'Follow multiple matches at events',
      'Keep up with results anywhere',
      'Share viewing with friends'
    ]
  },
  {
    title: 'Content Creation Mobile',
    icon: '🎬',
    description: 'Monitor your streams and collaborators from anywhere',
    scenarios: [
      'Check your own stream health',
      'Watch competitor analysis',
      'Monitor chat while mobile',
      'Coordinate with other creators'
    ]
  },
  {
    title: 'Casual Mobile Viewing',
    icon: '📱',
    description: 'Perfect for relaxed multi-stream watching',
    scenarios: [
      'Background streams while working',
      'Multiple perspectives of events',
      'Discover new content creators',
      'Social viewing experiences'
    ]
  }
]

export default function MobileMultiStreamViewerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "Streamyyy Mobile Multi Stream Viewer",
    "description": "Mobile-optimized multi-stream viewer for watching multiple Twitch, YouTube, and other streams on phones and tablets.",
    "url": "https://streamyyy.com/mobile-multi-stream-viewer",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": ["iOS", "Android"],
    "softwareRequirements": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Touch-optimized controls",
      "Responsive mobile layouts", 
      "Works on iOS and Android",
      "No app installation required",
      "Battery optimized",
      "Data usage controls"
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
          <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">MOBILE OPTIMIZED</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mobile Multi Stream Viewer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Watch multiple streams perfectly on your phone or tablet. Touch-optimized controls, 
            responsive layouts, and amazing performance - no app download required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/" className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Try on Mobile Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">See Mobile Features</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">16+</div>
              <div className="text-sm text-muted-foreground">Streams on Tablet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">8+</div>
              <div className="text-sm text-muted-foreground">Streams on Phone</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">Apps to Install</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-muted-foreground">Touch Optimized</div>
            </div>
          </div>
        </div>

        {/* Mobile Problems Solved */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Mobile Multi-Streaming Problems We Solved</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileProblems.map((item, index) => (
              <Card key={index} className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-red-600 text-lg">{item.problem}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{item.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Features */}
        <div id="features" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Mobile-First Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {mobileFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Device Compatibility */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Device Compatibility</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {deviceCompatibility.map((device, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {index < 2 ? <Smartphone className="h-5 w-5" /> : <Tablet className="h-5 w-5" />}
                    {device.device}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{device.compatibility}</Badge>
                    <Badge className="bg-green-600">{device.performance}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-blue-600 mb-1">{device.maxStreams}</div>
                      <div className="text-sm text-muted-foreground">Maximum recommended streams</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Optimized Features:</h4>
                      <ul className="space-y-1">
                        {device.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
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

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect Mobile Multi-Streaming Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{useCase.icon}</span>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.scenarios.map((scenario, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        {scenario}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Mobile Performance You Can Count On</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                  <div className="text-sm text-muted-foreground">Less Battery Usage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                  <div className="text-sm text-muted-foreground">Faster Loading</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
                  <div className="text-sm text-muted-foreground">Uptime Reliability</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
                  <div className="text-sm text-muted-foreground">Data Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Get Started */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Get Started on Mobile in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <CardTitle className="text-center">Open Your Browser</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Visit Streamyyy.com on your phone or tablet - works in Safari, Chrome, or any modern browser
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <CardTitle className="text-center">Add Your Streams</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Use the touch-optimized interface to add streamers - autocomplete makes it super fast
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <CardTitle className="text-center">Start Multi-Streaming</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Enjoy perfect mobile multi-stream viewing with gestures, layouts, and controls built for touch
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready for Mobile Multi-Streaming?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take your multi-stream viewing anywhere. Perfect performance on any mobile device, 
            no apps to install, no compromises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">Open on This Device</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">See All Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Works on iOS • Android • Tablets • No download required
          </p>
        </div>
      </div>
    </div>
  )
}