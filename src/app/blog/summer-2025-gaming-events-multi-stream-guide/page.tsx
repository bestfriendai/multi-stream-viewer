import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Users, Trophy, Zap, Smartphone, Globe } from 'lucide-react'
import InternalLinks from '@/components/InternalLinks'

export const metadata: Metadata = {
  title: 'Summer 2025 Gaming Events: Complete Multi-Stream Viewing Guide',
  description: 'Never miss the action at summer 2025 gaming tournaments. Learn how to watch multiple streams simultaneously for esports events, tournaments, and gaming competitions.',
  keywords: 'summer gaming events 2025, esports tournaments multi stream, gaming event viewing, tournament multiple streams, summer esports 2025',
  openGraph: {
    title: 'Summer 2025 Gaming Events: Multi-Stream Guide',
    description: 'Complete guide to watching multiple streams during summer gaming tournaments and esports events.',
    type: 'article'
  }
}

const summerEvents = [
  {
    name: 'EVO 2025',
    dates: 'August 2-4, 2025',
    games: ['Street Fighter 6', 'Tekken 8', 'Guilty Gear Strive', 'Mortal Kombat 1'],
    platforms: ['Twitch', 'YouTube'],
    expectedViewers: '500K+',
    multiStreamTips: 'Watch multiple game finals simultaneously, follow your favorite players across different brackets'
  },
  {
    name: 'The International 2025',
    dates: 'August 15-25, 2025',
    games: ['Dota 2'],
    platforms: ['Twitch', 'YouTube', 'Steam'],
    expectedViewers: '2M+',
    multiStreamTips: 'Multiple language streams, player perspective streams, analyst desk coverage'
  },
  {
    name: 'VALORANT Champions 2025',
    dates: 'August 1-27, 2025',
    games: ['VALORANT'],
    platforms: ['Twitch', 'YouTube'],
    expectedViewers: '1.5M+',
    multiStreamTips: 'Watch team comms, multiple map perspectives, regional qualifier streams'
  },
  {
    name: 'League of Legends Worlds 2025',
    dates: 'September 5 - November 2, 2025',
    games: ['League of Legends'],
    platforms: ['Twitch', 'YouTube'],
    expectedViewers: '5M+',
    multiStreamTips: 'Multiple language broadcasts, player cams, analyst streams, watch parties'
  },
  {
    name: 'CS2 Major Championship',
    dates: 'July 17-28, 2025',
    games: ['Counter-Strike 2'],
    platforms: ['Twitch', 'YouTube'],
    expectedViewers: '1M+',
    multiStreamTips: 'GOTV streams, player POVs, multiple language coverage, community streams'
  },
  {
    name: 'Fortnite World Cup 2025',
    dates: 'July 25-28, 2025',
    games: ['Fortnite'],
    platforms: ['Twitch', 'YouTube', 'Epic Games'],
    expectedViewers: '3M+',
    multiStreamTips: 'Player streams, official broadcast, creative mode competitions'
  }
]

const multiStreamSetups = [
  {
    title: 'Tournament Finals Setup',
    description: 'Perfect for watching championship matches',
    layout: '2x2 Grid',
    streams: [
      'Main tournament broadcast',
      'Player 1 perspective',
      'Player 2 perspective', 
      'Community reaction stream'
    ],
    bestFor: 'Finals, Grand Finals, Important Matches'
  },
  {
    title: 'Multi-Game Event Setup',
    description: 'For events with multiple games running simultaneously',
    layout: '3x3 Grid',
    streams: [
      'Game 1 main stream',
      'Game 2 main stream',
      'Game 3 main stream',
      'Player interviews',
      'Behind the scenes',
      'Community highlights',
      'Analysis desk',
      'Chat/Social feed',
      'Schedule/Bracket view'
    ],
    bestFor: 'EVO, Multi-game tournaments, Convention streams'
  },
  {
    title: 'Language Diversity Setup',
    description: 'Watch in multiple languages simultaneously',
    layout: '2x1 Focus',
    streams: [
      'English main broadcast (large)',
      'Native language commentary (small)',
      'Optional: Player native language stream'
    ],
    bestFor: 'International tournaments, Regional events'
  },
  {
    title: 'Mobile Tournament Setup',
    description: 'Optimized for mobile viewing',
    layout: '1x1 + Picture-in-Picture',
    streams: [
      'Main tournament stream (full screen)',
      'Player reaction cam (PiP)',
      'Quick switch to other perspectives'
    ],
    bestFor: 'Mobile viewing, Commuting, Casual watching'
  }
]

const viewingTips = [
  {
    icon: Trophy,
    title: 'Pre-Event Preparation',
    tips: [
      'Check tournament schedules and time zones',
      'Bookmark official streams and player channels',
      'Test your multi-stream setup before events start',
      'Prepare snacks and drinks for long viewing sessions'
    ]
  },
  {
    icon: Users,
    title: 'Community Engagement',
    tips: [
      'Join tournament Discord servers for live discussion',
      'Follow event hashtags on social media',
      'Participate in prediction games and brackets',
      'Watch community reaction streams for added entertainment'
    ]
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    tips: [
      'Close unnecessary browser tabs and applications',
      'Use hardware acceleration when available',
      'Lower stream quality on secondary streams to save bandwidth',
      'Consider using ethernet connection for stable viewing'
    ]
  },
  {
    icon: Smartphone,
    title: 'Mobile Viewing',
    tips: [
      'Use mobile-optimized multi-stream viewers like Streamyyy',
      'Download tournament apps for schedules and notifications',
      'Enable data saver mode if on limited mobile data',
      'Use headphones for better audio experience'
    ]
  }
]

export default function Summer2025GamingEventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Summer 2025 Gaming</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Summer 2025 Gaming Events: Complete Multi-Stream Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Don't miss a moment of the biggest gaming tournaments this summer. Learn how to watch 
            multiple streams simultaneously to catch all the action, player perspectives, and community reactions.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline">Multi-Stream Setup</Badge>
            <Badge variant="outline">Tournament Guide</Badge>
            <Badge variant="outline">Mobile Optimized</Badge>
            <Badge variant="outline">All Platforms</Badge>
          </div>
        </div>

        {/* Quick Start CTA */}
        <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Watch Summer Tournaments?</CardTitle>
            <CardDescription className="text-lg">
              Set up your multi-stream viewer now and never miss the action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1">
                <p className="mb-4">
                  Get started with Streamyyy's tournament-optimized multi-stream viewer. 
                  Watch up to 16 streams simultaneously with mobile support and cross-platform compatibility.
                </p>
              </div>
              <Button asChild size="lg" className="shrink-0">
                <Link href="/">Start Multi-Streaming</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Major Summer Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Major Summer 2025 Gaming Events</h2>
          <div className="grid gap-6">
            {summerEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{event.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {event.dates}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {event.expectedViewers} viewers
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Games</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.games.map((game, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {game}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Platforms</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.platforms.map((platform, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Multi-Stream Tips:</h4>
                    <p className="text-sm text-muted-foreground">{event.multiStreamTips}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Multi-Stream Setups */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Optimal Multi-Stream Setups</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {multiStreamSetups.map((setup, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{setup.title}</CardTitle>
                  <CardDescription>{setup.description}</CardDescription>
                  <Badge variant="secondary" className="w-fit">
                    {setup.layout}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Recommended Streams:</h4>
                    <ul className="space-y-1">
                      {setup.streams.map((stream, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                          {stream}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Best for:</strong> {setup.bestFor}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Viewing Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Pro Tournament Viewing Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {viewingTips.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.tips.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform-Specific Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Platform-Specific Multi-Stream Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Twitch Events</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use Twitch's native multi-view when available</p>
                <p>• Follow tournament organizers for raid notifications</p>
                <p>• Enable notifications for your favorite streamers</p>
                <p>• Use Twitch mobile app for on-the-go viewing</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">YouTube Events</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Subscribe to tournament channels for notifications</p>
                <p>• Use YouTube's rewind feature for instant replays</p>
                <p>• Check for multiple language streams</p>
                <p>• Use YouTube Premium for ad-free viewing</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cross-Platform</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use Streamyyy for unified multi-platform viewing</p>
                <p>• Mix Twitch and YouTube streams in one interface</p>
                <p>• Sync audio from your preferred commentary</p>
                <p>• Save layouts for quick tournament setup</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tournament Schedule Integration */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Never Miss an Event</h2>
          <Card>
            <CardHeader>
              <CardTitle>Tournament Calendar Integration</CardTitle>
              <CardDescription>
                Stay updated with all summer gaming events and set up your multi-stream viewer in advance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Essential Tools:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Add tournament dates to your calendar</li>
                    <li>• Set up notifications 30 minutes before events</li>
                    <li>• Bookmark official tournament streams</li>
                    <li>• Join tournament Discord servers</li>
                    <li>• Follow event organizers on social media</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Pre-Event Checklist:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Test your internet connection speed</li>
                    <li>• Update your multi-stream viewer</li>
                    <li>• Prepare your viewing setup and snacks</li>
                    <li>• Check time zones for international events</li>
                    <li>• Set up your preferred stream layout</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Internal Links */}
        <InternalLinks />

        {/* Final CTA */}
        <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready for Summer 2025 Gaming Events?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Don't miss a single moment of the biggest gaming tournaments this summer. 
            Set up your multi-stream viewer now and experience every angle of the action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Start Multi-Stream Viewing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/multi-stream-viewer">Learn More About Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Free forever • Mobile optimized • All platforms supported
          </p>
        </div>
      </div>
    </div>
  )
}
