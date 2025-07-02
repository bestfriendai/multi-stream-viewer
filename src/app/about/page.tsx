import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Users, 
  Target, 
  Heart, 
  Zap,
  Globe,
  Shield,
  ArrowLeft,
  Award,
  TrendingUp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'About Us - Streamyyy',
  description: 'Learn about Streamyyy, the premier multi-stream viewing platform. Our mission is to revolutionize how people watch live streams.',
}

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We build for streamers and viewers, always putting the community\'s needs at the forefront.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to deliver the best multi-stream viewing experience.'
    },
    {
      icon: Shield,
      title: 'Privacy & Trust',
      description: 'Your privacy is paramount. We\'re committed to protecting your data and being transparent.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Built by stream enthusiasts for stream enthusiasts. We love what we do.'
    }
  ]

  const milestones = [
    { year: '2023', event: 'Streamyyy was founded with a vision to transform multi-stream viewing' },
    { year: '2024', event: 'Launched support for 16 simultaneous streams' },
    { year: '2024', event: 'Introduced mobile-responsive design and touch controls' },
    { year: '2025', event: 'Reached 100,000+ active users worldwide' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Streamyyy
          </Link>
          <h1 className="text-3xl font-bold">About Streamyyy</h1>
          <p className="text-muted-foreground mt-2">
            Revolutionizing how the world watches live streams
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="outline">
              <Target className="w-3 h-3 mr-1" />
              Our Mission
            </Badge>
            <h2 className="text-3xl font-bold mb-6">
              Making Multi-Stream Viewing Accessible to Everyone
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Streamyyy, we believe that watching multiple streams shouldn't be complicated or expensive. 
              Our mission is to provide a free, powerful, and user-friendly platform that allows anyone to 
              enjoy multiple live streams simultaneously, whether it's for esports tournaments, content creation, 
              or entertainment.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Streamyyy was born out of frustration. As avid stream viewers and esports enthusiasts, 
                we found ourselves constantly switching between tabs during tournaments, missing crucial 
                moments, and struggling with multiple windows.
              </p>
              <p>
                We knew there had to be a better way. That's when we decided to build Streamyyy - 
                a platform that would let us watch all our favorite streams in one place, without 
                the hassle, without the cost, and without compromising on quality.
              </p>
              <p>
                What started as a simple tool for ourselves quickly grew into something much bigger. 
                Today, Streamyyy serves hundreds of thousands of users worldwide, from casual viewers 
                to professional esports analysts, content creators to stream moderators.
              </p>
            </div>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="p-6 text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <p className="text-muted-foreground">Streams Watched</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-muted-foreground">Uptime</p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Built by Streamers, for Streamers</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team consists of passionate developers, designers, and stream enthusiasts who 
              understand the needs of the streaming community. We're gamers, content creators, 
              and viewers ourselves, which drives us to build the best possible experience.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary">
                <Award className="w-3 h-3 mr-1" />
                10+ Years Combined Experience
              </Badge>
              <Badge variant="secondary">
                <Globe className="w-3 h-3 mr-1" />
                Global Team
              </Badge>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8 md:p-12 bg-primary/5">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a viewer, streamer, or content creator, we'd love to have you 
              as part of the Streamyyy community. Your feedback and support help us build 
              a better platform for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10">
                  Get in Touch
                </Badge>
              </Link>
              <Link href="https://discord.gg/streamyyy" target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10">
                  Join Discord
                </Badge>
              </Link>
              <Link href="https://twitter.com/streamyyy" target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10">
                  Follow on Twitter
                </Badge>
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}