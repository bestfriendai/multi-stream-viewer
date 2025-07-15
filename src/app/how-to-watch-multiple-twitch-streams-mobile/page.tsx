import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Smartphone, Wifi, Battery, Volume2, Maximize, 
  CheckCircle, Star, Users, Clock, ArrowRight, Zap,
  Monitor, MessageSquare, Settings, Download, PlayCircle
} from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedArticles, { multiStreamArticles, tutorialArticles } from '@/components/RelatedArticles'
import UserTestimonials, { mobileTestimonials } from '@/components/UserTestimonials'
import SEOSchema from '@/components/SEOSchema'

export const metadata: Metadata = {
  title: 'How to Watch Multiple Twitch Streams on Mobile | Complete Mobile Guide 2025',
  description: 'Learn how to watch multiple Twitch streams simultaneously on your mobile device. Step-by-step guide for the best mobile multi-stream viewing experience with Streamyyy.',
  keywords: 'watch multiple twitch streams mobile, mobile multi stream viewer, twitch mobile multistream, how to watch multiple streams on phone, mobile twitch viewer',
  openGraph: {
    title: 'How to Watch Multiple Twitch Streams on Mobile | Mobile Guide',
    description: 'Complete guide to watching multiple Twitch streams on mobile devices. Learn the best methods and tools for mobile multi-streaming.',
    type: 'article'
  }
}

const mobileSteps = [
  {
    step: 1,
    title: 'Open Your Mobile Browser',
    description: 'Navigate to streamyyy.com using any mobile browser (Chrome, Safari, Firefox)',
    details: [
      'No app download required',
      'Works on iOS and Android',
      'Compatible with all mobile browsers',
      'Instant access - no registration needed'
    ],
    icon: Smartphone,
    time: '30 seconds'
  },
  {
    step: 2,
    title: 'Add Your First Stream',
    description: 'Tap the "Add Stream" button and enter a Twitch username or URL',
    details: [
      'Type just the username (e.g., "ninja")',
      'Or paste full Twitch URL',
      'Auto-complete suggestions available',
      'Instant stream loading'
    ],
    icon: PlayCircle,
    time: '1 minute'
  },
  {
    step: 3,
    title: 'Add More Streams',
    description: 'Continue adding streams to build your multi-stream setup',
    details: [
      'Add up to 16 streams on mobile',
      'Mix Twitch with YouTube and Kick',
      'Automatic mobile layout optimization',
      'Touch-friendly interface'
    ],
    icon: Monitor,
    time: '2 minutes'
  },
  {
    step: 4,
    title: 'Optimize Mobile Layout',
    description: 'Choose the best mobile layout for your screen size',
    details: [
      'Auto-optimized 2x2 grid for phones',
      'Tablet-friendly 3x3 layouts',
      'Picture-in-picture mode available',
      'Swipe between streams easily'
    ],
    icon: Settings,
    time: '1 minute'
  },
  {
    step: 5,
    title: 'Control Audio & Chat',
    description: 'Manage audio and chat for the perfect mobile experience',
    details: [
      'Tap to mute/unmute individual streams',
      'Unified chat panel option',
      'Volume controls for each stream',
      'Background audio support'
    ],
    icon: Volume2,
    time: '30 seconds'
  }
]

const mobileFeatures = [
  {
    title: 'Touch Controls',
    description: 'Intuitive touch gestures for easy navigation',
    icon: Smartphone,
    benefits: ['Tap to focus streams', 'Swipe between layouts', 'Pinch to zoom', 'Touch-friendly buttons']
  },
  {
    title: 'Mobile-Optimized Layouts',
    description: 'Layouts designed specifically for mobile screens',
    icon: Monitor,
    benefits: ['Auto-sizing for phone screens', 'Tablet-optimized grids', 'Portrait and landscape modes', 'No horizontal scrolling']
  },
  {
    title: 'Battery Optimization',
    description: 'Efficient streaming that preserves battery life',
    icon: Battery,
    benefits: ['Hardware acceleration', 'Adaptive quality settings', 'Background mode support', 'Low power consumption']
  },
  {
    title: 'Mobile Chat',
    description: 'Full chat functionality optimized for mobile',
    icon: MessageSquare,
    benefits: ['Readable text size', 'Touch-friendly chat', 'Emoji support', 'Quick chat switching']
  }
]

const troubleshooting = [
  {
    issue: 'Streams won\'t load on mobile',
    solution: 'Ensure you have a stable internet connection and try refreshing the page. Check if your mobile browser allows autoplay.',
    prevention: 'Use a strong WiFi connection for best performance'
  },
  {
    issue: 'Audio not working on iPhone',
    solution: 'Tap each stream to unmute. iOS requires user interaction to start audio playback.',
    prevention: 'Tap streams after adding them to enable audio'
  },
  {
    issue: 'Layout looks cramped on phone',
    solution: 'Switch to 2x2 layout or use picture-in-picture mode for smaller screens.',
    prevention: 'Choose mobile-optimized layouts from the start'
  },
  {
    issue: 'Battery draining quickly',
    solution: 'Reduce stream quality in settings and close unnecessary background apps.',
    prevention: 'Use adaptive quality settings and limit to 4-6 streams on mobile'
  }
]

const mobileComparison = [
  {
    method: 'Streamyyy Mobile',
    pros: ['No app required', 'Up to 16 streams', 'Touch optimized', 'Multi-platform support'],
    cons: ['Requires internet browser'],
    rating: 5
  },
  {
    method: 'Official Twitch App',
    pros: ['Native app', 'Good single stream quality'],
    cons: ['Only one stream at a time', 'No multi-streaming', 'Twitch only'],
    rating: 2
  },
  {
    method: 'Other Multi-Stream Apps',
    pros: ['Sometimes available on app stores'],
    cons: ['Limited features', 'Often paid', 'Poor mobile experience', 'Frequent crashes'],
    rating: 2.5
  }
]

export default function HowToWatchMultipleTwitchStreamsMobilePage() {
  const breadcrumbItems = [
    { label: 'How to Watch Multiple Twitch Streams on Mobile' }
  ]

  const faqs = [
    {
      question: "Can I really watch multiple Twitch streams on my phone?",
      answer: "Yes! Streamyyy is specifically designed for mobile multi-streaming. You can watch up to 16 streams simultaneously on any mobile device through your browser."
    },
    {
      question: "Do I need to download an app to watch multiple streams on mobile?",
      answer: "No download required! Streamyyy works directly in your mobile browser. Just visit streamyyy.com and start adding streams immediately."
    },
    {
      question: "How many streams can I watch on my phone without lag?",
      answer: "Most modern phones can handle 4-6 streams smoothly. Newer devices with good internet can handle 8+ streams. The exact number depends on your device and connection."
    },
    {
      question: "Does mobile multi-streaming work on both iPhone and Android?",
      answer: "Yes! Streamyyy works perfectly on both iOS and Android devices. It's optimized for all mobile browsers including Safari, Chrome, and Firefox."
    },
    {
      question: "Can I watch Twitch and YouTube streams together on mobile?",
      answer: "Absolutely! You can mix Twitch, YouTube, Kick, and other platforms in the same mobile view. This is unique to Streamyyy compared to other mobile solutions."
    }
  ]

  const howToSteps = mobileSteps.map(step => ({
    name: step.title,
    text: step.description,
    url: `https://streamyyy.com/how-to-watch-multiple-twitch-streams-mobile#step-${step.step}`
  }))

  return (
    <article className="min-h-screen bg-background">
      <SEOSchema 
        faqs={faqs} 
        type="HowTo" 
        howToSteps={howToSteps}
        title="How to Watch Multiple Twitch Streams on Mobile"
        description="Complete step-by-step guide to watching multiple Twitch streams simultaneously on mobile devices"
      />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-600">
            📱 Mobile Guide 2025
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            How to Watch Multiple Twitch Streams on Mobile
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete step-by-step guide to watching multiple Twitch streams simultaneously on your mobile device. 
            No app downloads required - works perfectly in any mobile browser.
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">Works on all phones</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">No app required</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Try on Mobile Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#step-by-step">See Step-by-Step Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section id="step-by-step" className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            5-Step Mobile Multi-Streaming Guide
          </h2>
          
          <div className="space-y-8">
            {mobileSteps.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.step} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Icon className="h-6 w-6 text-primary" />
                          {step.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {step.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mobile-Optimized Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {mobileFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobile Method Comparison */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mobile Multi-Streaming Methods Compared
          </h2>
          
          <div className="grid gap-6">
            {mobileComparison.map((method, index) => (
              <Card key={index} className={method.method === 'Streamyyy Mobile' ? 'border-green-500 border-2' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{method.method}</CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < method.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 font-semibold">{method.rating}/5</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Pros:</h4>
                      <ul className="space-y-1">
                        {method.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-500 mb-2">Cons:</h4>
                      <ul className="space-y-1">
                        {method.cons.map((con, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                            {con}
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
      </section>

      {/* Troubleshooting */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mobile Troubleshooting Guide
          </h2>
          
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">
                    Problem: {item.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-600 mb-1">Solution:</h4>
                      <p className="text-sm">{item.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 mb-1">Prevention:</h4>
                      <p className="text-sm">{item.prevention}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <UserTestimonials 
            title="Mobile Users Love Streamyyy"
            testimonials={mobileTestimonials}
            showStats={false}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Mobile Multi-Streaming?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of mobile users who watch multiple Twitch streams on their phones every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="/">Start on Mobile Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/multi-stream-viewer">Learn More Features</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              Works on all phones
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              No app download
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Free forever
            </span>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <RelatedArticles 
            title="More Mobile Streaming Guides"
            articles={[...multiStreamArticles.slice(0, 2), ...tutorialArticles.slice(0, 2)]}
          />
        </div>
      </section>
    </article>
  )
}