import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Monitor, Users, Zap, Globe, MessageSquare, Layout } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Watch Multiple Twitch Streams at Once - Free Multi-Stream Viewer',
  description: 'Watch many Twitch streams simultaneously in one window. Perfect for tournaments, events, and following multiple streamers. Free Twitch multistream viewer with chat integration.',
  alternates: {
    canonical: 'https://streamyyy.com/watch-multiple-twitch-streams',
  },
}

export default function WatchMultipleTwitchStreams() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Watch Multiple Twitch Streams Simultaneously
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The best free tool to watch many Twitch streams at once. Perfect for esports tournaments, 
            speedrun marathons, and following your favorite streamers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="text-lg px-8">
                Start Watching Now
              </Button>
            </Link>
            <Link href="/#discover">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Live Streams
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Use Streamyyy for Multiple Twitch Streams?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Monitor className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Watch Up to 16 Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View multiple Twitch streams in customizable layouts. Perfect for watching 
                  tournaments, raids, or your favorite streamer squad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Integrated Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Switch between different Twitch chats seamlessly. Never miss important 
                  messages while watching multiple streams.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Live Viewer Counts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See real-time viewer counts and stream status. Know which streams are 
                  live and how many people are watching.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How to Watch Multiple Twitch Streams
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Add Twitch Channels</h3>
                <p className="text-muted-foreground">
                  Simply enter the Twitch username or channel URL. Add as many streams as you want to watch.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Choose Your Layout</h3>
                <p className="text-muted-foreground">
                  Select from multiple layout options - 2x2 grid, 3x3 grid, or custom focus mode with one main stream.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Watch and Chat</h3>
                <p className="text-muted-foreground">
                  Enjoy watching multiple Twitch streams simultaneously. Switch between chats and control audio for each stream.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect for Every Twitch Viewer
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Esports Tournaments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch multiple POVs during tournaments</p>
                <p>Follow different matches simultaneously</p>
                <p>Never miss crucial moments across streams</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Content Creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Monitor your stream while watching others</p>
                <p>Watch for raids and host opportunities</p>
                <p>Keep up with your streaming community</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gaming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch speedrun marathons with multiple runners</p>
                <p>Follow charity events across channels</p>
                <p>Experience gaming showcases fully</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Friend Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Watch your whole squad stream together</p>
                <p>Follow multiplayer games from all angles</p>
                <p>Support multiple streamers at once</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Watching Multiple Twitch Streams Now
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of viewers using Streamyyy to enhance their Twitch viewing experience.
            It's completely free!
          </p>
          <Link href="/">
            <Button size="lg" className="text-lg px-12">
              Open Multi-Stream Viewer
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}