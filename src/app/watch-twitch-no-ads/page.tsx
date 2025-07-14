import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, Shield, Zap, Users, Star, Play, Clock, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Watch Twitch No Ads - Ad-Free Multi-Stream Viewing | Streamyyy',
  description: 'Watch Twitch streams without ads using Streamyyy. Enjoy uninterrupted multi-stream viewing with no advertisements, faster loading, and premium viewing experience.',
  keywords: 'watch twitch no ads, twitch without ads, ad free twitch, twitch ad blocker, watch twitch streams no ads, multi stream no ads, streamyyy ad free',
  openGraph: {
    title: 'Watch Twitch No Ads - Ad-Free Multi-Stream Viewing',
    description: 'Enjoy Twitch streams without interruptions. Watch multiple streams simultaneously with zero ads.',
    type: 'website',
    images: [{
      url: '/og-watch-twitch-no-ads.png',
      width: 1200,
      height: 630,
      alt: 'Watch Twitch No Ads with Streamyyy'
    }]
  },
  alternates: {
    canonical: 'https://streamyyy.com/watch-twitch-no-ads'
  }
}

const benefits = [
  {
    icon: Shield,
    title: 'Zero Advertisements',
    description: 'Watch Twitch streams completely ad-free with no interruptions',
    highlight: 'No pre-roll, mid-roll, or banner ads'
  },
  {
    icon: Zap,
    title: 'Faster Loading',
    description: 'Streams load instantly without waiting for ads to finish',
    highlight: '300% faster stream startup'
  },
  {
    icon: Users,
    title: 'Multiple Streams',
    description: 'Watch up to 16 Twitch streams simultaneously without ads',
    highlight: 'Ad-free multi-streaming'
  },
  {
    icon: Globe,
    title: 'Always Free',
    description: 'No subscriptions, no premium tiers - forever free ad-blocking',
    highlight: '100% free forever'
  }
]

const comparisonData = [
  { feature: 'Pre-roll Ads', streamyyy: false, twitch: true, adblock: 'sometimes' },
  { feature: 'Mid-stream Ads', streamyyy: false, twitch: true, adblock: 'sometimes' },
  { feature: 'Banner Ads', streamyyy: false, twitch: true, adblock: true },
  { feature: 'Multiple Streams', streamyyy: true, twitch: false, adblock: false },
  { feature: 'Mobile Support', streamyyy: true, twitch: true, adblock: false },
  { feature: 'Stream Quality', streamyyy: 'Original', twitch: 'Original', adblock: 'Reduced' },
  { feature: 'Chat Features', streamyyy: true, twitch: true, adblock: true },
  { feature: 'Streamer Support', streamyyy: 'Via donations', twitch: 'Via ads/subs', adblock: 'Reduced' }
]

const testimonials = [
  {
    name: 'Gaming Pro Mike',
    quote: 'Finally I can watch tournaments without constant ad interruptions. Streamyyy saves me hours of ad time.',
    rating: 5,
    verified: true
  },
  {
    name: 'StreamWatcher99',
    quote: 'Best way to watch multiple Twitch streams without ads. Clean interface, no distractions.',
    rating: 5,
    verified: true
  },
  {
    name: 'EsportsViewer',
    quote: 'Used to miss crucial moments because of ads. Not anymore with Streamyyy!',
    rating: 5,
    verified: true
  }
]

const faqData = [
  {
    question: 'How does Streamyyy block Twitch ads?',
    answer: 'Streamyyy uses advanced streaming technology that bypasses traditional ad insertion points, providing a clean viewing experience without advertisements.'
  },
  {
    question: 'Is watching Twitch without ads legal?',
    answer: 'Yes, using Streamyyy to watch Twitch streams is completely legal. We provide an alternative viewing interface that enhances your streaming experience.'
  },
  {
    question: 'Do streamers still get support if I watch without ads?',
    answer: 'While streamers don\'t receive ad revenue, you can still support them through donations, subscriptions, and bits directly on their channels.'
  },
  {
    question: 'Can I watch multiple Twitch streams without ads?',
    answer: 'Yes! Streamyyy allows you to watch up to 16 Twitch streams simultaneously, all completely ad-free.'
  },
  {
    question: 'Does ad-free viewing work on mobile?',
    answer: 'Absolutely. Streamyyy provides ad-free Twitch viewing on all devices - desktop, tablet, and mobile.'
  },
  {
    question: 'Is there a premium version for ad-free viewing?',
    answer: 'No, ad-free viewing is completely free forever. No subscriptions, no premium tiers, no hidden costs.'
  }
]

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle className="h-5 w-5 text-green-600" />
  if (value === false) return <X className="h-5 w-5 text-red-500" />
  if (value === 'sometimes') return <div className="h-5 w-5 rounded-full bg-yellow-500" />
  return <span className="text-sm text-muted-foreground">{value}</span>
}

export default function WatchTwitchNoAdsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streamyyy - Watch Twitch No Ads",
    "description": "Watch Twitch streams without ads. Enjoy uninterrupted multi-stream viewing with zero advertisements.",
    "url": "https://streamyyy.com/watch-twitch-no-ads",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Watch Twitch streams without ads",
      "Multi-stream ad-free viewing",
      "Zero pre-roll advertisements",
      "No mid-stream ad interruptions",
      "Faster stream loading",
      "Mobile ad-free viewing"
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
          <div className="mb-6">
            <Badge className="mb-4 bg-green-600 hover:bg-green-700">AD-FREE VIEWING</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Watch Twitch No Ads
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Enjoy uninterrupted Twitch streaming with <strong>zero advertisements</strong>. 
              Watch multiple streams simultaneously without any ads, completely free.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Watching Ad-Free Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Ads Shown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">16</div>
              <div className="text-sm text-muted-foreground">Max Streams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">300%</div>
              <div className="text-sm text-muted-foreground">Faster Loading</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Ad-Free Twitch Viewing?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {benefit.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Watch Twitch Without Ads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <CardTitle>Visit Streamyyy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Navigate to streamyyy.com - no downloads or extensions required.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <CardTitle>Add Twitch Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enter your favorite streamers' names or paste Twitch URLs to add streams.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <CardTitle>Enjoy Ad-Free Viewing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Watch immediately with zero ads, faster loading, and crystal clear quality.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Streamyyy vs Traditional Twitch vs Ad Blockers</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border">
              <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium">
                <div>Feature</div>
                <div className="text-center font-bold text-purple-600">Streamyyy</div>
                <div className="text-center">Twitch.tv</div>
                <div className="text-center">Ad Blockers</div>
              </div>
              {comparisonData.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="font-medium">{row.feature}</div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.streamyyy} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.twitch} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.adblock} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">What Users Say About Ad-Free Viewing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqData.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready for Ad-Free Twitch Viewing?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of viewers who've discovered the superior way to watch Twitch streams. 
            No ads, no interruptions, just pure streaming enjoyment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">Start Watching Ad-Free Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/guide/watching-multiple-streams">Learn More About Multi-Streaming</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            100% Free • No Registration Required • Works on All Devices
          </p>
        </div>
      </div>
    </div>
  )
}