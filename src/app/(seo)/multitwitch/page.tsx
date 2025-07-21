import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EnhancedSEOSchema from '@/components/EnhancedSEOSchema'
import CoreWebVitalsMonitor from '@/components/CoreWebVitalsMonitor'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import { generateLandingPageMetadata } from '@/components/SEOMetadata'
import Breadcrumb from '@/components/Breadcrumb'
import {
  Users, Shield, CheckCircle2, Star,
  Clock, Smartphone, PlayCircle, Award, ArrowRight, X
} from 'lucide-react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
}

export const metadata: Metadata = generateLandingPageMetadata({
  title: 'MultiTwitch Alternative - Better Free Multi-Stream Viewer | Streamyyy',
  description: 'The best MultiTwitch.tv alternative! Watch multiple Twitch streams at once with Streamyyy. Free multistream viewer supporting 16 simultaneous streams, custom layouts, and mobile support.',
  canonical: 'https://streamyyy.com/multitwitch',
  image: '/og-multitwitch-alternative.jpg',
  imageAlt: 'Streamyyy - The Best MultiTwitch Alternative for Watching Multiple Streams',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  author: 'Streamyyy Team',
  tags: ['multitwitch alternative', 'multitwitch replacement', 'better than multitwitch', 'free multi stream viewer', 'watch multiple twitch streams']
})

export default function MultiTwitchAlternative() {
  const faqs = [
    {
      question: "Why is Streamyyy better than MultiTwitch?",
      answer: "Streamyyy offers up to 16 streams vs MultiTwitch's 4 streams, full mobile support, cross-platform compatibility, unified chat management, and zero downtime. Plus, it's completely free with no limitations."
    },
    {
      question: "What happens when MultiTwitch is down?",
      answer: "When MultiTwitch.tv is down or not working, Streamyyy is always available as a reliable alternative. Our platform has 99.9% uptime and doesn't suffer from the frequent outages that affect MultiTwitch."
    },
    {
      question: "Can I watch more than 4 streams like MultiTwitch?",
      answer: "Yes! Unlike MultiTwitch which limits you to 4 streams, Streamyyy allows you to watch up to 16 streams simultaneously with flexible layout options including 2x2, 3x3, 4x4, and custom arrangements."
    },
    {
      question: "Does this MultiTwitch alternative work on mobile?",
      answer: "Absolutely! Unlike MultiTwitch which has poor mobile support, Streamyyy is fully optimized for mobile devices with touch gestures, responsive layouts, and perfect performance on phones and tablets."
    },
    {
      question: "Is Streamyyy really free like MultiTwitch?",
      answer: "Yes, Streamyyy is completely free forever with no premium features, subscriptions, or limitations. Unlike some MultiTwitch alternatives that charge fees, we provide all features at no cost."
    }
  ]

  const breadcrumbItems = [
    { label: 'MultiTwitch Alternative' }
  ]

  return (
    <article className="min-h-screen bg-background">
      <CoreWebVitalsMonitor />
      <PerformanceOptimizer />
      <EnhancedSEOSchema 
        faqs={faqs} 
        type="SoftwareApplication"
        title="MultiTwitch Alternative - Better Free Multi-Stream Viewer"
        description="The best MultiTwitch.tv alternative! Watch multiple Twitch streams at once with Streamyyy. Free multistream viewer supporting 16 simultaneous streams, custom layouts, and mobile support."
        url="https://streamyyy.com/multitwitch"
        image="/og-multitwitch-alternative.jpg"
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              MultiTwitch Alternative 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              The Best MultiTwitch Alternative
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Better than MultiTwitch.tv! Watch multiple Twitch streams simultaneously with up to 16 streams, 
              mobile support, and zero downtime. The superior free MultiTwitch replacement.
            </p>
            
            {/* Trust Signals */}
            <div className="flex justify-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">50K+ Users Switched</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Always Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Superior Features</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/">
                <Button size="lg" className="text-lg px-8">
                  <PlayCircle className="mr-2" />
                  Try Streamyyy Now
                </Button>
              </Link>
              <Link href="#comparison">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  See Comparison
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MultiTwitch Problems Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Problems with MultiTwitch That Streamyyy Solves
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <X className="w-8 h-8 text-red-600" />
                  <CardTitle className="text-xl text-red-700">MultiTwitch Issues</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Limited to only 4 streams maximum</span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Poor mobile experience and compatibility</span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Frequent downtime and &quot;not working&quot; issues</span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Outdated interface and limited customization</span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>No cross-platform support (Twitch only)</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-xl text-green-700">Streamyyy Solutions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Watch up to 16 streams simultaneously</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Fully optimized mobile multi-stream viewer</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>99.9% uptime - always available when you need it</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Modern interface with advanced customization</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Multi-platform support (Twitch, YouTube, Rumble)</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Section */}
      <section className="py-20 px-6" id="comparison">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Streamyyy vs MultiTwitch: Complete Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold text-green-700">Streamyyy</th>
                  <th className="text-center p-4 font-semibold text-red-700">MultiTwitch</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Maximum Streams</td>
                  <td className="text-center p-4 text-green-600 font-semibold">16 Streams</td>
                  <td className="text-center p-4 text-red-600">4 Streams</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Mobile Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Full Mobile Optimization</td>
                  <td className="text-center p-4 text-red-600">Poor/Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Platform Support</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Multi-Platform</td>
                  <td className="text-center p-4 text-red-600">Twitch Only</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Uptime Reliability</td>
                  <td className="text-center p-4 text-green-600 font-semibold">99.9% Uptime</td>
                  <td className="text-center p-4 text-red-600">Frequent Downtime</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Chat Integration</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Unified Chat</td>
                  <td className="text-center p-4 text-red-600">Basic</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Layout Customization</td>
                  <td className="text-center p-4 text-green-600 font-semibold">Advanced Options</td>
                  <td className="text-center p-4 text-red-600">Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Cost</td>
                  <td className="text-center p-4 text-green-600 font-semibold">100% Free</td>
                  <td className="text-center p-4 text-green-600">Free</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Last Updated</td>
                  <td className="text-center p-4 text-green-600 font-semibold">2025</td>
                  <td className="text-center p-4 text-red-600">Outdated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Migration Guide Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How to Switch from MultiTwitch to Streamyyy
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Visit Streamyyy</h3>
                <p className="text-muted-foreground">
                  Simply go to Streamyyy.com - no account creation or downloads required. 
                  Start using it immediately as your MultiTwitch replacement.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Streams</h3>
                <p className="text-muted-foreground">
                  Enter the same Twitch usernames you used on MultiTwitch, plus add streams from 
                  YouTube, Rumble, and other platforms that MultiTwitch doesn&apos;t support.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Superior Features</h3>
                <p className="text-muted-foreground">
                  Experience up to 16 streams, mobile optimization, better layouts, and reliable uptime. 
                  Everything MultiTwitch offers and much more!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            MultiTwitch Alternative FAQ
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

      {/* Final CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Switch from MultiTwitch?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join over 50,000 users who&apos;ve already made the switch to the better MultiTwitch alternative. 
            Experience superior multi-stream viewing with more features, better reliability, and mobile support.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link href="/">
              <Button size="lg" className="text-lg px-12">
                <ArrowRight className="mr-2" />
                Start Using Streamyyy
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
              50,000+ Happy Users
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