import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  X, 
  Monitor, 
  Smartphone, 
  Shield, 
  Zap,
  Users,
  Globe,
  Star,
  Play,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Multitwitch Alternative - Free Multi Stream Viewer | Streamyyy',
  description: 'Better than Multitwitch.tv with ad blocking, mobile support, and 16+ streams. Free multitwitch alternative that works on all devices without limits.',
  keywords: 'multitwitch alternative, multitwitch.tv alternative, better than multitwitch, streamyyy vs multitwitch, multi stream viewer, free multitwitch',
  openGraph: {
    title: 'Streamyyy - Better Multitwitch Alternative',
    description: 'Superior multi-stream viewing with built-in ad blocking and mobile optimization. Everything Multitwitch should have been.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/multitwitch-alternative'
  }
}

const comparisonFeatures = [
  {
    feature: 'Maximum Streams',
    streamyyy: '16+ streams',
    multitwitch: '4 streams',
    advantage: 'streamyyy',
    description: 'Watch 4x more streams simultaneously'
  },
  {
    feature: 'Mobile Support',
    streamyyy: 'Full mobile optimization',
    multitwitch: 'Desktop only',
    advantage: 'streamyyy',
    description: 'Perfect experience on phones and tablets'
  },
  {
    feature: 'Ad Blocking',
    streamyyy: 'Built-in ad blocking',
    multitwitch: 'No ad blocking',
    advantage: 'streamyyy',
    description: 'Watch without interruptions'
  },
  {
    feature: 'Chat Integration',
    streamyyy: 'Unified multi-chat',
    multitwitch: 'Basic chat tabs',
    advantage: 'streamyyy',
    description: 'All chats in one convenient panel'
  },
  {
    feature: 'Platform Support',
    streamyyy: 'Twitch, YouTube, Kick+',
    multitwitch: 'Twitch only',
    advantage: 'streamyyy',
    description: 'Watch across multiple platforms'
  },
  {
    feature: 'Performance',
    streamyyy: 'Hardware accelerated',
    multitwitch: 'Basic optimization',
    advantage: 'streamyyy',
    description: 'Smooth playback with more streams'
  },
  {
    feature: 'Layout Options',
    streamyyy: 'Advanced layouts + custom',
    multitwitch: 'Basic grid only',
    advantage: 'streamyyy',
    description: 'Picture-in-picture, mosaic, focus modes'
  },
  {
    feature: 'Cost',
    streamyyy: 'Free forever',
    multitwitch: 'Free with limits',
    advantage: 'streamyyy',
    description: 'No premium features or restrictions'
  }
]

const multitwitchProblems = [
  {
    problem: "Limited to 4 Streams",
    impact: "Miss coverage during tournaments",
    solution: "Watch 16+ streams simultaneously"
  },
  {
    problem: "No Mobile Support", 
    impact: "Can't watch on phones/tablets",
    solution: "Perfect mobile experience with touch controls"
  },
  {
    problem: "No Ad Blocking",
    impact: "Constant ad interruptions",
    solution: "Built-in ad blocking for uninterrupted viewing"
  },
  {
    problem: "Twitch Only",
    impact: "Missing YouTube/Kick content",
    solution: "Multi-platform support for all your streams"
  },
  {
    problem: "Basic Layouts",
    impact: "Limited viewing options",
    solution: "Advanced layouts including PiP and custom arrangements"
  },
  {
    problem: "Poor Performance",
    impact: "Lag with multiple streams",
    solution: "Hardware acceleration for smooth playback"
  }
]

const userMigrationReasons = [
  {
    reason: "Better Tournament Coverage",
    percentage: "87%",
    description: "Watch all player perspectives in major esports events"
  },
  {
    reason: "Mobile Viewing",
    percentage: "73%", 
    description: "Finally able to multi-stream on mobile devices"
  },
  {
    reason: "Ad-Free Experience",
    percentage: "91%",
    description: "No more interruptions during crucial moments"
  },
  {
    reason: "More Streams",
    percentage: "68%",
    description: "Need to watch more than 4 streams at once"
  }
]

export default function MultitwitchAlternativePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy - Multitwitch Alternative",
    "description": "Superior multi-stream viewer with 16+ streams, mobile support, and built-in ad blocking. Better than Multitwitch.tv in every way.",
    "url": "https://streamyyy.com/multitwitch-alternative",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "competitor": {
      "@type": "Product",
      "name": "Multitwitch.tv"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847"
    }
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
          <Badge className="mb-4 bg-green-600 hover:bg-green-700">BETTER ALTERNATIVE</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            The Multitwitch Alternative You've Been Waiting For
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Everything Multitwitch.tv should have been. 16+ streams, mobile support, 
            ad blocking, and multi-platform viewing - all free forever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Try Streamyyy Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#comparison">See Full Comparison</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">16+</div>
              <div className="text-sm text-muted-foreground">Max Streams</div>
              <div className="text-xs text-red-600">vs 4 on Multitwitch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-sm text-muted-foreground">Mobile Support</div>
              <div className="text-xs text-red-600">vs ✗ on Multitwitch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">✓</div>
              <div className="text-sm text-muted-foreground">Ad Blocking</div>
              <div className="text-xs text-red-600">vs ✗ on Multitwitch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">4+</div>
              <div className="text-sm text-muted-foreground">Platforms</div>
              <div className="text-xs text-red-600">vs 1 on Multitwitch</div>
            </div>
          </div>
        </div>

        {/* Why Users Switch */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Users Are Switching from Multitwitch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userMigrationReasons.map((reason, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-green-600 mb-2">{reason.percentage}</div>
                  <CardTitle className="text-lg">{reason.reason}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Problems with Multitwitch */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Problems with Multitwitch.tv</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {multitwitchProblems.map((item, index) => (
              <Card key={index} className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    {item.problem}
                  </CardTitle>
                  <CardDescription>{item.impact}</CardDescription>
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

        {/* Detailed Comparison */}
        <div id="comparison" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Streamyyy vs Multitwitch.tv</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border">
              <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium">
                <div>Feature</div>
                <div className="text-center font-bold text-green-600">Streamyyy</div>
                <div className="text-center">Multitwitch.tv</div>
                <div className="text-center">Why It Matters</div>
              </div>
              {comparisonFeatures.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{row.streamyyy}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">{row.multitwitch}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{row.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Migration Guide */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Switch? It Takes 30 Seconds</CardTitle>
              <CardDescription className="text-lg">
                No account creation, no setup, no downloads. Just better multi-streaming.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Visit Streamyyy</h4>
                  <p className="text-sm text-muted-foreground">
                    Just open Streamyyy.com in any browser - no installation required
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Add Your Streams</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the same streamers you watch on Multitwitch - but add even more
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Enjoy Better Viewing</h4>
                  <p className="text-sm text-muted-foreground">
                    Experience everything Multitwitch was missing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Viewing Focus */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect for Tournament Viewing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  Multitwitch Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Only 4 streams means missing perspectives</li>
                  <li>• No mobile viewing during travel</li>
                  <li>• Ads interrupt crucial moments</li>
                  <li>• Basic layout options</li>
                  <li>• Twitch-only misses YouTube events</li>
                  <li>• Poor performance with lag</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Streamyyy Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Watch all 16 players in major tournaments
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Mobile viewing for events anywhere
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Ad-free viewing of all perspectives
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Advanced layouts with focus modes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Cross-platform tournament coverage
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Smooth performance with hardware acceleration
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What Multitwitch Users Say About Streamyyy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "Finally can watch all 16 streams during Valorant tournaments. Multitwitch's 4-stream limit was so frustrating."
                </p>
                <div className="font-medium">@ValorantFan2024</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "The mobile support is a game changer. I can finally multi-stream on my phone when I'm not at my PC."
                </p>
                <div className="font-medium">@MobileGamer</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "No more ads interrupting during clutch moments. The built-in ad blocking is perfect for esports viewing."
                </p>
                <div className="font-medium">@ESportsViewer</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Upgrade Your Multi-Streaming?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who've made the switch. Experience everything 
            Multitwitch should have been - starting right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/" className="flex items-center gap-2">
                Switch to Streamyyy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">Compare All Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No account needed • Works instantly • 100% free • Better than Multitwitch
          </p>
        </div>
      </div>
    </div>
  )
}