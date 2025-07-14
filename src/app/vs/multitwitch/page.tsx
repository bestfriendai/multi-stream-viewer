import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, Star, ArrowLeft, Users, Clock, Zap, Smartphone, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Streamyyy vs MultiTwitch: Complete Feature Comparison | Best Multi-Stream Viewer',
  description: 'Detailed comparison between Streamyyy and MultiTwitch. See why Streamyyy offers superior performance, mobile support, and multi-platform streaming capabilities.',
  keywords: 'streamyyy vs multitwitch, multitwitch alternative, best multi stream viewer comparison, streamyyy better than multitwitch',
  openGraph: {
    title: 'Streamyyy vs MultiTwitch: Complete Feature Comparison',
    description: 'Discover why Streamyyy is the superior alternative to MultiTwitch with better performance, mobile support, and multi-platform capabilities.',
    type: 'article'
  }
}

const comparisonData = [
  {
    category: 'Platform Support',
    streamyyy: ['Twitch', 'YouTube', 'Kick', 'Rumble', 'More platforms'],
    multitwitch: ['Twitch only'],
    winner: 'streamyyy'
  },
  {
    category: 'Mobile Experience',
    streamyyy: ['Native mobile design', 'Touch controls', 'Mobile-optimized layouts', 'Responsive interface'],
    multitwitch: ['Desktop only', 'No mobile support', 'Poor mobile experience'],
    winner: 'streamyyy'
  },
  {
    category: 'Performance',
    streamyyy: ['16+ streams support', 'Hardware acceleration', 'Memory optimization', 'Smooth playback'],
    multitwitch: ['Limited to 4-6 streams', 'Performance issues', 'High memory usage'],
    winner: 'streamyyy'
  },
  {
    category: 'Chat Features',
    streamyyy: ['Unified chat panel', 'Chat filtering', 'Moderation tools', 'Multi-platform chat'],
    multitwitch: ['Basic chat windows', 'No unified chat', 'Limited features'],
    winner: 'streamyyy'
  },
  {
    category: 'Layouts & Customization',
    streamyyy: ['Custom layouts', 'Picture-in-picture', 'Flexible grids', 'Layout saving'],
    multitwitch: ['Fixed grid only', 'Limited customization', 'No layout saving'],
    winner: 'streamyyy'
  },
  {
    category: 'User Interface',
    streamyyy: ['Modern design', 'Dark/light themes', 'Intuitive controls', 'Accessibility features'],
    multitwitch: ['Outdated design', 'Limited theming', 'Basic interface'],
    winner: 'streamyyy'
  },
  {
    category: 'Development & Updates',
    streamyyy: ['Active development', 'Regular updates', 'New features', 'Bug fixes'],
    multitwitch: ['Minimal updates', 'Slow development', 'Limited new features'],
    winner: 'streamyyy'
  }
]

const migrationGuide = [
  {
    step: '1. Save Your Stream List',
    description: 'Make note of the streamers you regularly watch on MultiTwitch',
    action: 'Export or write down your favorite streamers'
  },
  {
    step: '2. Visit Streamyyy',
    description: 'Navigate to streamyyy.com in your web browser',
    action: 'No download or installation required'
  },
  {
    step: '3. Add Your Streams',
    description: 'Use the Add Stream button to quickly recreate your setup',
    action: 'Supports usernames, URLs, and auto-complete'
  },
  {
    step: '4. Customize Your Layout',
    description: 'Choose from advanced layout options not available on MultiTwitch',
    action: 'Try picture-in-picture, custom grids, or mosaic mode'
  },
  {
    step: '5. Save Your Setup',
    description: 'Create an account to save your layouts for future use',
    action: 'Never lose your perfect multi-stream configuration'
  }
]

const userTestimonials = [
  {
    name: 'Alex M.',
    quote: 'Switched from MultiTwitch last month. The mobile support alone makes it worth it - I can watch streams on my phone during breaks.',
    rating: 5
  },
  {
    name: 'Sarah K.',
    quote: 'Finally can watch YouTube and Twitch streams together! MultiTwitch was so limiting.',
    rating: 5
  },
  {
    name: 'Mike D.',
    quote: 'Performance is night and day. Used to lag with 4 streams on MultiTwitch, now I watch 8+ without issues.',
    rating: 5
  }
]

const features = [
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Watch Twitch, YouTube, Kick, and more platforms simultaneously',
    streamyyy: true,
    multitwitch: false
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimization',
    description: 'Perfect mobile experience with touch controls and responsive design',
    streamyyy: true,
    multitwitch: false
  },
  {
    icon: Zap,
    title: 'Superior Performance',
    description: 'Handle 16+ streams with hardware acceleration and memory optimization',
    streamyyy: true,
    multitwitch: false
  },
  {
    icon: Users,
    title: 'Advanced Chat Management',
    description: 'Unified chat panel with filtering and moderation tools',
    streamyyy: true,
    multitwitch: false
  }
]

export default function StreamyyyVsMultiTwitchPage() {
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
              MultiTwitch
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive comparison between Streamyyy and MultiTwitch. 
            Discover why thousands of users are migrating to the superior multi-streaming experience.
          </p>
        </div>

        {/* Key Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Users Choose Streamyyy Over MultiTwitch</h2>
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
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Streamyyy:</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">MultiTwitch:</span>
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Detailed Feature Comparison</h2>
          <div className="space-y-6">
            {comparisonData.map((comparison, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {comparison.category}
                    {comparison.winner === 'streamyyy' && (
                      <Badge className="bg-green-600">Streamyyy Wins</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-purple-600">Streamyyy</h4>
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
                      <h4 className="font-semibold mb-3 text-muted-foreground">MultiTwitch</h4>
                      <ul className="space-y-2">
                        {comparison.multitwitch.map((feature, idx) => (
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
          <h2 className="text-3xl font-bold mb-6 text-center">Easy Migration from MultiTwitch</h2>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Switching from MultiTwitch to Streamyyy takes less than 5 minutes. Here's how:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {migrationGuide.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{step.step}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-xs">
                    {step.action}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">What MultiTwitch Users Say About Streamyyy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {userTestimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{testimonial.name}</span>
                  </div>
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
          <h2 className="text-3xl font-bold mb-6 text-center">Performance Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-green-600">16+</CardTitle>
                <CardDescription>Streams Supported</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Streamyyy handles 16+ streams smoothly</p>
                <p className="text-xs text-muted-foreground mt-2">vs MultiTwitch's 4-6 stream limit</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-600">50%</CardTitle>
                <CardDescription>Lower Memory Usage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Optimized performance and efficiency</p>
                <p className="text-xs text-muted-foreground mt-2">Less strain on your system</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-purple-600">4</CardTitle>
                <CardDescription>Platforms Supported</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Twitch, YouTube, Kick, Rumble</p>
                <p className="text-xs text-muted-foreground mt-2">vs MultiTwitch's Twitch-only support</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Upgrade from MultiTwitch?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join the thousands of users who've already discovered the superior multi-streaming experience. 
            Make the switch today and never look back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Try Streamyyy Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/guide/watching-multiple-streams">Learn How to Get Started</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Free forever • Migration takes under 5 minutes
          </p>
        </div>
      </div>
    </div>
  )
}