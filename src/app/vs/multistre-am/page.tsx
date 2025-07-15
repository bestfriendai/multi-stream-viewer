import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, Star, ArrowLeft, Users, Clock, Zap, Smartphone, Globe, Shield, Layout } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Streamyyy vs Multistre.am: Best Multi-Stream Viewer 2025 Comparison',
  description: 'Compare Streamyyy and Multistre.am for watching multiple streams. See why Streamyyy offers better mobile support, more features, and superior reliability.',
  keywords: 'streamyyy vs multistre.am, multistre.am alternative, best multistream viewer, streamyyy better than multistre.am',
  openGraph: {
    title: 'Streamyyy vs Multistre.am: Complete Feature Comparison',
    description: 'Discover why Streamyyy is the superior alternative to Multistre.am with better reliability, mobile experience, and advanced features.',
    type: 'article'
  }
}

const comparisonData = [
  {
    category: 'Reliability & Uptime',
    streamyyy: ['99.9% uptime guarantee', 'Stable infrastructure', 'Regular maintenance', 'Professional hosting'],
    multistre: ['Frequent downtime', 'Unreliable service', 'Server issues', 'No uptime guarantee'],
    winner: 'streamyyy'
  },
  {
    category: 'Platform Support',
    streamyyy: ['Twitch', 'YouTube', 'Kick', 'Rumble', 'More platforms coming'],
    multistre: ['Twitch only', 'Limited platform integration', 'No YouTube support'],
    winner: 'streamyyy'
  },
  {
    category: 'Mobile Experience',
    streamyyy: ['Native mobile app design', 'Touch controls', 'Mobile-optimized layouts', 'Perfect mobile performance'],
    multistre: ['Poor mobile experience', 'No mobile optimization', 'Desktop-only design'],
    winner: 'streamyyy'
  },
  {
    category: 'Stream Capacity',
    streamyyy: ['16+ streams supported', 'Hardware acceleration', 'Efficient memory usage', 'Smooth performance'],
    multistre: ['Limited stream count', 'Performance issues', 'High resource usage', 'Frequent lag'],
    winner: 'streamyyy'
  },
  {
    category: 'User Interface',
    streamyyy: ['Modern, intuitive design', 'Dark/light themes', 'Accessibility features', 'Clean layout'],
    multistre: ['Basic interface', 'Limited customization', 'Outdated design', 'Poor UX'],
    winner: 'streamyyy'
  },
  {
    category: 'Advanced Features',
    streamyyy: ['Picture-in-picture', 'Layout saving', 'Keyboard shortcuts', 'Chat management'],
    multistre: ['Basic grid layouts', 'No advanced features', 'Limited customization'],
    winner: 'streamyyy'
  },
  {
    category: 'Development & Support',
    streamyyy: ['Active development', 'Regular updates', 'Responsive support', 'Community feedback'],
    multistre: ['Minimal updates', 'Slow development', 'Limited support'],
    winner: 'streamyyy'
  }
]

const keyAdvantages = [
  {
    title: 'Superior Reliability',
    description: '99.9% uptime vs Multistre.am\'s frequent outages and downtime',
    icon: Shield,
    stats: '99.9% uptime'
  },
  {
    title: 'Better Mobile Support',
    description: 'Professional mobile experience vs Multistre.am\'s desktop-only design',
    icon: Smartphone,
    stats: 'Mobile-first'
  },
  {
    title: 'More Platforms',
    description: 'Support for 4+ streaming platforms vs Multistre.am\'s Twitch-only limitation',
    icon: Globe,
    stats: '4+ platforms'
  },
  {
    title: 'Advanced Layouts',
    description: 'Flexible layouts and customization vs Multistre.am\'s basic grid',
    icon: Layout,
    stats: '16+ layouts'
  }
]

const migrationSteps = [
  {
    step: 'Save Your Current Streams',
    description: 'Export or note down your current Multistre.am setup',
    time: '1 minute'
  },
  {
    step: 'Visit Streamyyy',
    description: 'Navigate to streamyyy.com - no download required',
    time: '30 seconds'
  },
  {
    step: 'Add Your Streams',
    description: 'Quickly recreate your setup with our intuitive interface',
    time: '2 minutes'
  },
  {
    step: 'Customize Layout',
    description: 'Choose from advanced layouts not available on Multistre.am',
    time: '1 minute'
  },
  {
    step: 'Enjoy Better Performance',
    description: 'Experience superior reliability and mobile support',
    time: 'Forever'
  }
]

const userTestimonials = [
  {
    name: 'Alex P.',
    quote: 'Multistre.am was always down when I needed it most. Streamyyy has been rock solid for months!',
    rating: 5,
    issue: 'Reliability'
  },
  {
    name: 'Maya L.',
    quote: 'Finally can watch on my phone! Multistre.am was impossible to use on mobile.',
    rating: 5,
    issue: 'Mobile Experience'
  },
  {
    name: 'Tyler K.',
    quote: 'Love being able to mix YouTube and Twitch streams. Multistre.am only had Twitch.',
    rating: 5,
    issue: 'Platform Support'
  },
  {
    name: 'Sarah M.',
    quote: 'The interface is so much cleaner and easier to use than Multistre.am ever was.',
    rating: 5,
    issue: 'User Experience'
  }
]

export default function StreamyyyVsMultistreAmPage() {
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
              Multistre.am
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive comparison between Streamyyy and Multistre.am. 
            Discover why users are switching to the more reliable, feature-rich alternative.
          </p>
          <Badge className="mt-4 bg-green-600">
            🚀 The Reliable Multistre.am Alternative
          </Badge>
        </div>

        {/* Reliability Warning */}
        <div className="mb-12">
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tired of Multistre.am Downtime?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-300 mb-4">
                Multistre.am users frequently experience service outages, loading issues, and unreliable performance. 
                Streamyyy offers 99.9% uptime with enterprise-grade infrastructure.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-red-700 dark:text-red-400">Common Multistre.am Issues:</strong>
                  <ul className="mt-2 space-y-1 text-red-600 dark:text-red-300">
                    <li>• Frequent downtime and outages</li>
                    <li>• Slow loading times</li>
                    <li>• Server errors during peak hours</li>
                    <li>• No mobile support</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-green-700 dark:text-green-400">Streamyyy Solutions:</strong>
                  <ul className="mt-2 space-y-1 text-green-600 dark:text-green-300">
                    <li>• 99.9% guaranteed uptime</li>
                    <li>• Lightning-fast performance</li>
                    <li>• Reliable 24/7 service</li>
                    <li>• Perfect mobile experience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Streamyyy Over Multistre.am</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyAdvantages.map((advantage, index) => {
              const Icon = advantage.icon
              return (
                <Card key={index} className="text-center border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <CardTitle className="text-lg">{advantage.title}</CardTitle>
                    <Badge variant="outline" className="mx-auto">{advantage.stats}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Complete Feature Comparison</h2>
          <div className="space-y-6">
            {comparisonData.map((comparison, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {comparison.category}
                    {comparison.winner === 'streamyyy' && (
                      <Badge className="bg-green-600">Clear Winner: Streamyyy</Badge>
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
                      <h4 className="font-semibold mb-3 text-muted-foreground">❌ Multistre.am</h4>
                      <ul className="space-y-2">
                        {comparison.multistre.map((feature, idx) => (
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

        {/* Migration Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Switch from Multistre.am in 5 Minutes</h2>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Tired of Multistre.am's reliability issues? Migrate to Streamyyy in just a few simple steps.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {migrationSteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.step}</CardTitle>
                  <Badge variant="outline" className="text-xs">{step.time}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">What Multistre.am Users Say About Streamyyy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTestimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">{testimonial.issue}</Badge>
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

        {/* Performance Stats */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Performance & Reliability Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-green-600">99.9%</CardTitle>
                <CardDescription>Streamyyy Uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Guaranteed reliable service</p>
                <p className="text-xs text-muted-foreground mt-2">vs Multistre.am's frequent outages</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-blue-600">5x</CardTitle>
                <CardDescription>Faster Loading</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Enterprise-grade infrastructure</p>
                <p className="text-xs text-muted-foreground mt-2">Optimized for speed and reliability</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-purple-600">16+</CardTitle>
                <CardDescription>Streams Supported</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">More capacity than competitors</p>
                <p className="text-xs text-muted-foreground mt-2">Without performance degradation</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Leave Multistre.am Behind?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Stop dealing with downtime and reliability issues. Join thousands who've already discovered 
            the superior multi-streaming experience with guaranteed uptime and modern features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Switch to Streamyyy Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/multi-stream-viewer">See All Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            99.9% uptime guarantee • No registration required • Free forever
          </p>
        </div>
      </div>
    </div>
  )
}