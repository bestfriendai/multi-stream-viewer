import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, Gamepad2, Zap, BookOpen, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Complete Guide to Multi-Stream Viewing | Streamyyy Tutorials',
  description: 'Master multi-stream viewing with our comprehensive guides. Learn how to watch multiple Twitch streams, manage chat, and optimize your viewing experience.',
  keywords: 'multi stream guide, watch multiple streams tutorial, twitch multi stream help, stream viewing tips',
  openGraph: {
    title: 'Complete Guide to Multi-Stream Viewing | Streamyyy',
    description: 'Master multi-stream viewing with our comprehensive guides and tutorials.',
    type: 'article'
  }
}

const guides = [
  {
    title: 'Complete Guide to Watching Multiple Streams',
    description: 'Learn everything about multi-stream viewing from basic setup to advanced techniques.',
    href: '/guide/watching-multiple-streams',
    difficulty: 'Beginner',
    readTime: '8 min read',
    icon: BookOpen,
    featured: true,
    topics: ['Setup', 'Layouts', 'Performance', 'Best Practices']
  },
  {
    title: 'Advanced Chat Management',
    description: 'Master chat management across multiple streams with unified panels and moderation tools.',
    href: '/guide/chat-management',
    difficulty: 'Intermediate',
    readTime: '6 min read',
    icon: Users,
    topics: ['Chat Integration', 'Moderation', 'Notifications']
  },
  {
    title: 'Stream Synchronization Techniques',
    description: 'Keep your streams perfectly synchronized for coordinated viewing experiences.',
    href: '/guide/stream-synchronization',
    difficulty: 'Advanced',
    readTime: '5 min read',
    icon: Zap,
    topics: ['Timing Controls', 'Lag Management', 'Quality Settings']
  }
]

const quickTips = [
  'Use keyboard shortcuts for faster navigation',
  'Start with 2x2 grid for optimal performance',
  'Enable auto-quality for bandwidth optimization',
  'Save layouts for quick access to favorite setups',
  'Use picture-in-picture for multitasking'
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Multi-Stream Viewing Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the art of watching multiple streams simultaneously with our comprehensive tutorials and guides.
          </p>
        </div>

        {/* Featured Guide */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-purple-600" />
            Featured Guide
          </h2>
          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle className="text-xl mb-2">{guides[0].title}</CardTitle>
                    <CardDescription className="text-base">
                      {guides[0].description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">Featured</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {guides[0].topics.map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {guides[0].readTime}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {guides[0].difficulty}
                  </Badge>
                </div>
                <Button asChild>
                  <Link href={guides[0].href} className="flex items-center gap-2">
                    Start Guide
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-purple-600" />
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={guide.href} className="flex items-center gap-1">
                          Read
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Quick Tips */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Quick Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Ready to Start Multi-Streaming?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Put your knowledge into practice with Streamyyy's powerful multi-stream viewer.
          </p>
          <Button asChild size="lg">
            <Link href="/">Start Watching Streams</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}