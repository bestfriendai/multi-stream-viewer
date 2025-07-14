import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, X, Star, Users, Clock, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Streamyyy vs Other Multi-Stream Viewers | Feature Comparison',
  description: 'Compare Streamyyy with MultiTwitch, TwitchTheater and other multi-stream viewers. See why Streamyyy is the best choice for watching multiple streams.',
  keywords: 'streamyyy vs multitwitch, multi stream viewer comparison, twitchtheater alternative, best multi stream viewer',
  openGraph: {
    title: 'Streamyyy vs Other Multi-Stream Viewers | Feature Comparison',
    description: 'Comprehensive comparison of multi-stream viewers. See why Streamyyy outperforms the competition.',
    type: 'article'
  }
}

const competitors = [
  {
    name: 'MultiTwitch',
    description: 'Popular multi-stream viewer with basic grid layouts',
    href: '/vs/multitwitch',
    features: ['Grid layouts', 'Twitch only', 'Basic chat'],
    pros: ['Simple interface', 'Fast loading'],
    cons: ['Limited features', 'No mobile support', 'Twitch only'],
    rating: 3.5,
    users: '500K+'
  },
  {
    name: 'TwitchTheater',
    description: 'Theater-style multi-stream viewing experience',
    href: '/vs/twitchtheater',
    features: ['Theater mode', 'Multiple layouts', 'Stream chat'],
    pros: ['Good design', 'Multiple layouts'],
    cons: ['Performance issues', 'Limited chat features', 'Outdated UI'],
    rating: 3.2,
    users: '200K+'
  },
  {
    name: 'Other Alternatives',
    description: 'Comparison with other multi-stream solutions',
    href: '/vs/alternatives',
    features: ['Various approaches', 'Different platforms', 'Mixed results'],
    pros: ['Variety of options'],
    cons: ['Inconsistent quality', 'Limited features'],
    rating: 2.8,
    users: 'Various'
  }
]

const streamyyyFeatures = [
  {
    feature: 'Multiple Platforms',
    description: 'Twitch, YouTube, Kick, and more',
    advantage: 'vs Twitch-only competitors'
  },
  {
    feature: 'Mobile Optimization',
    description: 'Perfect mobile experience with touch controls',
    advantage: 'vs desktop-only solutions'
  },
  {
    feature: 'Advanced Chat Management',
    description: 'Unified chat, filtering, and moderation tools',
    advantage: 'vs basic chat implementations'
  },
  {
    feature: 'Performance Optimization',
    description: 'Handles 16+ streams without lag',
    advantage: 'vs competitors with 4-stream limits'
  },
  {
    feature: 'Custom Layouts',
    description: 'Flexible grid systems and picture-in-picture',
    advantage: 'vs fixed layout competitors'
  },
  {
    feature: 'Keyboard Shortcuts',
    description: 'Power user features for quick navigation',
    advantage: 'vs mouse-only interfaces'
  }
]

const comparisonTable = [
  { feature: 'Multiple Platforms', streamyyy: true, multitwitch: false, twitchtheater: false, others: 'partial' },
  { feature: 'Mobile Support', streamyyy: true, multitwitch: false, twitchtheater: 'limited', others: false },
  { feature: 'Custom Layouts', streamyyy: true, multitwitch: 'limited', twitchtheater: true, others: 'limited' },
  { feature: 'Unified Chat', streamyyy: true, multitwitch: false, twitchtheater: 'basic', others: false },
  { feature: 'Performance (16+ streams)', streamyyy: true, multitwitch: false, twitchtheater: false, others: false },
  { feature: 'Keyboard Shortcuts', streamyyy: true, multitwitch: 'limited', twitchtheater: false, others: 'limited' },
  { feature: 'Free to Use', streamyyy: true, multitwitch: true, twitchtheater: true, others: 'varies' },
  { feature: 'Regular Updates', streamyyy: true, multitwitch: 'slow', twitchtheater: 'rare', others: 'varies' }
]

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle className="h-5 w-5 text-green-600" />
  if (value === false) return <X className="h-5 w-5 text-red-500" />
  if (value === 'limited' || value === 'basic') return <div className="h-5 w-5 rounded-full bg-yellow-500" />
  if (value === 'partial' || value === 'slow' || value === 'rare') return <div className="h-5 w-5 rounded-full bg-orange-500" />
  return <div className="h-5 w-5 rounded-full bg-gray-400" />
}

export default function VSPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Streamyyy vs The Competition
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Streamyyy compares to other multi-stream viewers. Discover why thousands of users 
            are making the switch to the most advanced multi-streaming platform.
          </p>
        </div>

        {/* Streamyyy Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Streamyyy?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamyyyFeatures.map((item, index) => (
              <Card key={index} className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {item.feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.advantage}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Comparisons */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Detailed Comparisons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{competitor.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{competitor.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{competitor.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{competitor.users} users</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {competitor.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-green-600">Pros:</h4>
                      <ul className="text-xs space-y-1">
                        {competitor.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-red-500">Cons:</h4>
                      <ul className="text-xs space-y-1">
                        {competitor.cons.map((con, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <X className="h-3 w-3 text-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={competitor.href} className="flex items-center justify-center gap-2">
                        Detailed Comparison
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border">
              <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium">
                <div>Feature</div>
                <div className="text-center">Streamyyy</div>
                <div className="text-center">MultiTwitch</div>
                <div className="text-center">TwitchTheater</div>
                <div className="text-center">Others</div>
              </div>
              {comparisonTable.map((row, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="font-medium">{row.feature}</div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.streamyyy} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.multitwitch} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.twitchtheater} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIcon value={row.others} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Full Support
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
              Limited/Basic
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-orange-500" />
              Partial/Slow
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-500" />
              Not Available
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who've already discovered why Streamyyy is the superior choice for multi-stream viewing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Try Streamyyy Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/vs/multitwitch">Compare with MultiTwitch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}