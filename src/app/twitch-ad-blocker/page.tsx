import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  X, 
  Monitor, 
  Smartphone, 
  Globe, 
  Star,
  Play,
  Download,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Twitch Ad Blocker - Watch Twitch Without Ads | Streamyyy',
  description: 'Built-in Twitch ad blocker that actually works. No extensions needed. Watch Twitch streams without ads, purple screens, or interruptions. 100% free and effective.',
  keywords: 'twitch ad blocker, watch twitch no ads, twitch ad free, block twitch ads, twitch without ads, ublock origin twitch, twitch ad blocker extension, chrome twitch ad blocker',
  openGraph: {
    title: 'Free Twitch Ad Blocker - No Extensions Needed',
    description: 'Skip all Twitch ads instantly. Built-in ad blocking that works better than extensions. No purple screens, no interruptions.',
    type: 'website'
  },
  alternates: {
    canonical: 'https://streamyyy.com/twitch-ad-blocker'
  }
}

const competitorComparison = [
  {
    feature: 'Works Without Extensions',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: false
  },
  {
    feature: 'No Purple Screens',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: true
  },
  {
    feature: 'Mobile Support',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: true
  },
  {
    feature: 'Multi-Stream Support',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: false
  },
  {
    feature: 'Always Updated',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: true
  },
  {
    feature: 'Zero Setup Required',
    streamyyy: true,
    ublock: false,
    adblock: false,
    vpn: false
  }
]

const adBlockingProblems = [
  {
    problem: "Extensions Keep Breaking",
    description: "Twitch constantly updates to break uBlock Origin, AdBlock Plus, and other extensions",
    solution: "Streamyyy uses a different approach that doesn't rely on browser extensions"
  },
  {
    problem: "Purple Screen of Death",
    description: "Ad blockers often cause purple screens instead of blocking ads",
    solution: "No purple screens - watch content immediately without interruptions"
  },
  {
    problem: "Mobile Ad Blocking Fails",
    description: "Most ad blockers don't work on mobile browsers or apps",
    solution: "Works perfectly on all devices - mobile, tablet, and desktop"
  },
  {
    problem: "Complex Setup Required",
    description: "Installing extensions, configuring filters, updating manually",
    solution: "Zero setup - just visit Streamyyy and start watching ad-free"
  }
]

const testimonials = [
  {
    text: "Finally! No more purple screens when trying to watch Twitch. Streamyyy just works.",
    author: "Alex_Gaming",
    verified: true
  },
  {
    text: "Been using this for tournaments. Can watch multiple streams without any ads. Game changer.",
    author: "ESports_Fan2024",
    verified: true
  },
  {
    text: "Mobile ad blocking that actually works. No more ads on my phone while watching streams.",
    author: "MobileViewer",
    verified: true
  }
]

export default function TwitchAdBlockerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy Twitch Ad Blocker",
    "description": "Built-in Twitch ad blocker that works without extensions. Watch Twitch streams without ads on any device.",
    "url": "https://streamyyy.com/twitch-ad-blocker",
    "applicationCategory": "BrowserApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Built-in Twitch ad blocking",
      "No browser extensions required",
      "Works on mobile devices",
      "Multi-stream ad blocking",
      "No purple screens",
      "Instant setup"
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does this Twitch ad blocker actually work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Streamyyy's built-in ad blocking works by using a different approach than traditional extensions. It doesn't rely on filter lists that Twitch can detect and block."
        }
      },
      {
        "@type": "Question", 
        "name": "Do I need to install any extensions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No extensions needed. Simply visit Streamyyy and start watching Twitch streams without ads immediately. Works in any modern web browser."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work on mobile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Streamyyy works perfectly on mobile devices including phones and tablets. No apps to install - just use your mobile browser."
        }
      },
      {
        "@type": "Question",
        "name": "Why doesn't uBlock Origin work for Twitch anymore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Twitch actively detects and blocks traditional ad blockers like uBlock Origin, causing purple screens or forcing ads through. Streamyyy uses a different method that avoids this detection."
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-600 hover:bg-red-700">AD-FREE SOLUTION</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Free Twitch Ad Blocker That Actually Works
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            No extensions needed. No purple screens. No interruptions. 
            Watch Twitch streams without ads on any device - 100% free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Start Blocking Ads Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-muted-foreground">Ads Shown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">Extensions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-muted-foreground">Streams</div>
            </div>
          </div>
        </div>

        {/* Problems with Current Ad Blockers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Other Twitch Ad Blockers Fail</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {adBlockingProblems.map((item, index) => (
              <Card key={index} className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    {item.problem}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
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

        {/* How It Works */}
        <div id="how-it-works" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How Streamyyy Blocks Twitch Ads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>1. Direct Stream Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We access Twitch streams directly without going through their ad-serving infrastructure, 
                  completely bypassing ad injection points.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>2. Built-in Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our ad blocking is built into the platform itself, not relying on browser extensions 
                  that can be detected and blocked by Twitch.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>3. Instant Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streams load faster without ads. No waiting, no purple screens, 
                  no interruptions - just pure content from the moment you click play.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Streamyyy vs Other Ad Blocking Methods</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border">
              <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium">
                <div>Feature</div>
                <div className="text-center font-bold text-green-600">Streamyyy</div>
                <div className="text-center">uBlock Origin</div>
                <div className="text-center">AdBlock Plus</div>
                <div className="text-center">VPN Methods</div>
                <div className="text-center">Browser Extensions</div>
              </div>
              {competitorComparison.map((row, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center">
                    {row.streamyyy ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {row.ublock ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {row.adblock ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {row.vpn ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What Users Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{testimonial.author}</div>
                    {testimonial.verified && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Focus */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Smartphone className="h-6 w-6" />
                Perfect Mobile Ad Blocking
              </CardTitle>
              <CardDescription className="text-lg">
                The only solution that blocks Twitch ads on mobile without apps or complicated setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Why Mobile Ad Blocking is Hard:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Browser extensions don't work on mobile</li>
                    <li>• Apps can't be modified or extended</li>
                    <li>• VPNs slow down streaming significantly</li>
                    <li>• DNS blocking breaks other functionality</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">How Streamyyy Solves It:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Works in any mobile browser
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      No apps to install or configure
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Full speed streaming
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Touch-optimized controls
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Does this Twitch ad blocker actually work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, Streamyyy's built-in ad blocking works by using a different approach than traditional extensions. 
                It doesn't rely on filter lists that Twitch can detect and block, so you get consistent ad-free viewing.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Do I need to install any extensions or software?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No extensions needed. Simply visit Streamyyy and start watching Twitch streams without ads immediately. 
                Works in any modern web browser on desktop, mobile, or tablet.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Why doesn't uBlock Origin work for Twitch anymore?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Twitch actively detects and blocks traditional ad blockers like uBlock Origin and AdBlock Plus, 
                causing purple screens or forcing ads through. Streamyyy uses a completely different method that avoids this detection.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Is this legal and safe to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, completely legal and safe. We don't modify Twitch's website or use any unauthorized access methods. 
                We simply provide an alternative way to view the same public content without ads.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-950/20 dark:to-purple-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Stop Fighting with Ad Blockers</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            No more purple screens. No more extension updates. No more compromises. 
            Just pure, ad-free Twitch streaming that works everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/">Block Ads Now - It's Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">See All Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Works instantly • No setup required • 100% free forever
          </p>
        </div>
      </div>
    </div>
  )
}