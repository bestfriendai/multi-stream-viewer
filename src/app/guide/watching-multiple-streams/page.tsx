import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Clock, Users, Gamepad2, Zap, Settings, ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Complete Guide: How to Watch Multiple Twitch Streams Simultaneously | Streamyyy',
  description: 'Learn how to watch multiple Twitch streams at once with our comprehensive step-by-step guide. Master layouts, chat management, and performance optimization.',
  keywords: 'how to watch multiple twitch streams, multi stream tutorial, twitch multistream guide, watch multiple streams simultaneously',
  openGraph: {
    title: 'Complete Guide: How to Watch Multiple Twitch Streams Simultaneously',
    description: 'Master multi-stream viewing with our comprehensive step-by-step guide covering setup, layouts, and optimization.',
    type: 'article'
  }
}

const tableOfContents = [
  { title: 'Getting Started', anchor: 'getting-started' },
  { title: 'Setting Up Your First Multi-Stream', anchor: 'setup' },
  { title: 'Choosing the Right Layout', anchor: 'layouts' },
  { title: 'Managing Multiple Chats', anchor: 'chat-management' },
  { title: 'Performance Optimization', anchor: 'performance' },
  { title: 'Advanced Features', anchor: 'advanced' },
  { title: 'Troubleshooting', anchor: 'troubleshooting' },
  { title: 'Best Practices', anchor: 'best-practices' }
]

const layouts = [
  {
    name: '2x2 Grid',
    description: 'Perfect for watching 4 streams with equal importance',
    useCase: 'Tournament viewing, friend groups',
    performance: 'Excellent'
  },
  {
    name: '3x3 Grid',
    description: 'Watch up to 9 streams for comprehensive coverage',
    useCase: 'Large events, category browsing',
    performance: 'Good'
  },
  {
    name: 'Picture-in-Picture',
    description: 'One main stream with smaller overlays',
    useCase: 'Following one main streamer while monitoring others',
    performance: 'Excellent'
  },
  {
    name: 'Mosaic',
    description: 'Dynamic layout that adapts to stream count',
    useCase: 'Flexible viewing, varying stream numbers',
    performance: 'Good'
  }
]

const performanceTips = [
  {
    tip: 'Lower Quality Settings',
    description: 'Set streams to 720p or 480p to reduce bandwidth usage',
    impact: 'High'
  },
  {
    tip: 'Disable Auto-Play',
    description: 'Prevent streams from starting until you\'re ready',
    impact: 'Medium'
  },
  {
    tip: 'Use Hardware Acceleration',
    description: 'Enable GPU acceleration in your browser settings',
    impact: 'High'
  },
  {
    tip: 'Close Unused Tabs',
    description: 'Free up memory and processing power',
    impact: 'Medium'
  }
]

const troubleshooting = [
  {
    problem: 'Streams are lagging or buffering',
    solution: 'Reduce video quality, close other applications, check internet connection'
  },
  {
    problem: 'Audio from multiple streams is overwhelming',
    solution: 'Mute all streams except your primary focus, use the unified chat instead'
  },
  {
    problem: 'Chat messages are hard to follow',
    solution: 'Use the unified chat panel, enable chat filtering, focus on one chat at a time'
  },
  {
    problem: 'Browser is becoming slow or unresponsive',
    solution: 'Reduce the number of streams, restart browser, enable hardware acceleration'
  }
]

export default function WatchingMultipleStreamsGuide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/guide" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">Beginner Guide</Badge>
            <Badge variant="secondary">8 min read</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Complete Guide: How to Watch Multiple Twitch Streams Simultaneously
          </h1>
          <p className="text-xl text-muted-foreground">
            Master the art of multi-stream viewing with this comprehensive step-by-step guide. 
            Learn everything from basic setup to advanced optimization techniques.
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              {tableOfContents.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.anchor}`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted text-sm transition-colors"
                >
                  <span className="text-muted-foreground">{index + 1}.</span>
                  {item.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Getting Started */}
          <section id="getting-started">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Getting Started
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                Watching multiple streams simultaneously opens up a whole new dimension of content consumption. 
                Whether you're following an esports tournament, keeping up with multiple friends, or exploring 
                different categories, multi-stream viewing helps you never miss the action.
              </p>
              <p className="mb-4">
                <strong>What you'll need:</strong>
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                <li>Stable internet connection (at least 25 Mbps for 4 streams)</li>
                <li>Computer with 8GB+ RAM for optimal performance</li>
                <li>Streamyyy.com account (optional but recommended for saving layouts)</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Setup */}
          <section id="setup">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              Setting Up Your First Multi-Stream
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Access Streamyyy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Navigate to <Link href="/" className="text-blue-600 hover:underline">streamyyy.com</Link> in your web browser. No downloads or installations required.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Add Your First Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>Click the "Add Stream" button and enter a streamer's username or stream URL:</p>
                    <ul className="list-disc pl-6">
                      <li>Twitch: Just enter the username (e.g., "ninja")</li>
                      <li>YouTube: Paste the full stream URL or channel URL</li>
                      <li>Other platforms: Paste the complete stream URL</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 3: Add Additional Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Repeat the process to add more streams. Streamyyy automatically arranges them in an optimal layout.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Layouts */}
          <section id="layouts">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              Choosing the Right Layout
            </h2>
            <p className="text-lg mb-6">
              The layout you choose dramatically affects your viewing experience. Here's a breakdown of each option:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {layouts.map((layout, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{layout.name}</CardTitle>
                    <CardDescription>{layout.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Best for:</span>
                        <span className="text-sm text-muted-foreground">{layout.useCase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Performance:</span>
                        <Badge variant={layout.performance === 'Excellent' ? 'default' : 'secondary'} className="text-xs">
                          {layout.performance}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Chat Management */}
          <section id="chat-management">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Managing Multiple Chats
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                Managing chat across multiple streams can be overwhelming. Here's how to stay organized:
              </p>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Unified Chat Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enable the unified chat panel to see messages from all streams in one place. This prevents you from missing important interactions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat Filtering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Use chat filters to highlight important messages, hide spam, or focus on specific streamers' responses.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audio Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Keep only one or two streams with audio enabled to avoid overwhelming noise. Use visual cues from other streams.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Performance */}
          <section id="performance">
            <h2 className="text-3xl font-bold mb-4">Performance Optimization</h2>
            <p className="text-lg mb-6">
              Multi-stream viewing can be resource-intensive. Follow these tips to maintain smooth performance:
            </p>
            <div className="grid gap-4">
              {performanceTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tip.tip}</CardTitle>
                      <Badge variant={tip.impact === 'High' ? 'default' : 'secondary'}>
                        {tip.impact} Impact
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Troubleshooting */}
          <section id="troubleshooting">
            <h2 className="text-3xl font-bold mb-4">Troubleshooting Common Issues</h2>
            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600 dark:text-red-400">
                      Problem: {item.problem}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Solution:</strong> {item.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Best Practices */}
          <section id="best-practices">
            <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Start Small</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Begin with 2-3 streams and gradually increase as you get comfortable with the interface and your system's performance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Save Layouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Save your favorite stream combinations as layouts for quick access during events or regular viewing sessions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Use Keyboard Shortcuts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Learn the keyboard shortcuts to quickly switch between streams, adjust volumes, and navigate layouts without using the mouse.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monitor Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Keep an eye on your browser's memory usage and CPU utilization to ensure smooth performance across all streams.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Multi-Streaming?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Now that you know the fundamentals, put your knowledge into practice with Streamyyy's powerful multi-stream viewer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                Start Watching Streams
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/guide" className="flex items-center gap-2">
                More Guides
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}