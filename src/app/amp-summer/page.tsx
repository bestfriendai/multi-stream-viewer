'use client'

import { useEffect, useState, useMemo } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import Header from '@/components/Header'
import AMPStreamGrid from '@/components/AMPStreamGrid'
import StreamChat from '@/components/StreamChat'
import StreamStatusBar from '@/components/StreamStatusBar'
import { Badge } from '@/components/ui/badge'
import { Zap, Users } from 'lucide-react'
import TwitchAvatarImage from '@/components/TwitchAvatarImage'
import Script from 'next/script'
import './amp-summer.css'

const AMP_STREAMERS = [
  { 
    name: 'kaicenat', 
    displayName: 'Kai Cenat', 
    platform: 'twitch' as const
  },
  { 
    name: 'fanum', 
    displayName: 'Fanum', 
    platform: 'twitch' as const
  },
  { 
    name: 'dukedennis', 
    displayName: 'Duke Dennis', 
    platform: 'twitch' as const
  },
  { 
    name: 'agent00', 
    displayName: 'Agent 00', 
    platform: 'twitch' as const
  }
]

export default function AmpSummerPage() {
  const { streams, addStream, setGridLayout, clearAllStreams } = useStreamStore()
  const [showChat, setShowChat] = useState(false)
  const { trackAMPSummerView, trackChatToggle } = useAnalytics()
  
  // Get live status for all AMP streamers
  const channelNames = useMemo(() => 
    streams.map(stream => stream.channelName).filter(Boolean),
    [streams]
  )
  
  const { status: liveStatusMap } = useTwitchStatus(channelNames, {
    refreshInterval: 30000, // Check every 30 seconds
    enabled: true
  })

  useEffect(() => {
    // Track AMP Summer page view
    trackAMPSummerView()
    
    // Clear existing streams and add AMP streamers
    clearAllStreams()
    
    // Set 2x2 grid layout for 4 streams
    setGridLayout('2x2')
    
    // Add all AMP streamers
    AMP_STREAMERS.forEach(streamer => {
      addStream({
        channelName: streamer.name,
        platform: streamer.platform
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AMP Summer 2025 - Live Streaming Hub',
    description: 'Watch AMP Summer 2025 with Kai Cenat, Duke Dennis, Agent00, and Fanum streaming live. Any Means Possible ⚡️ The official AMP exclusive multi-stream viewer.',
    url: 'https://ampsummer.com/amp-summer',
    mainEntity: {
      '@type': 'Event',
      name: 'AMP Summer 2025',
      description: 'AMP Summer 2025 featuring Kai Cenat, Duke Dennis, Agent00, and Fanum. Watch all AMP members live in one place.',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: {
        '@type': 'VirtualLocation',
        url: 'https://ampsummer.com/amp-summer'
      },
      performer: [
        {
          '@type': 'Person',
          name: 'Kai Cenat',
          url: 'https://twitch.tv/kaicenat',
          sameAs: ['https://twitter.com/kaicenat', 'https://instagram.com/kaicenat']
        },
        {
          '@type': 'Person',
          name: 'Duke Dennis',
          url: 'https://twitch.tv/dukedennis',
          sameAs: ['https://twitter.com/dukedennis', 'https://instagram.com/dukedennis']
        },
        {
          '@type': 'Person',
          name: 'Agent00',
          url: 'https://twitch.tv/agent00',
          sameAs: ['https://twitter.com/callmeagent00', 'https://instagram.com/callmeagent00']
        },
        {
          '@type': 'Person',
          name: 'Fanum',
          url: 'https://twitch.tv/fanum',
          sameAs: ['https://twitter.com/fanum', 'https://instagram.com/fanum']
        }
      ],
      organizer: {
        '@type': 'Organization',
        name: 'AMP (Any Means Possible)',
        url: 'https://ampsummer.com',
        sameAs: ['https://twitter.com/AMPexclusive']
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ampsummer.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AMP Summer',
          item: 'https://ampsummer.com/amp-summer'
        }
      ]
    }
  }

  return (
    <>
      <Script
        id="amp-summer-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header showChat={showChat} onToggleChat={() => {
        setShowChat(!showChat)
        trackChatToggle(!showChat)
      }} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-background border-b amp-hero-section">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-4">
          <div className="text-center space-y-4">
            {/* Title with animation */}
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
              <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AMP SUMMER 2025
              </h1>
              <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Subtitle */}
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Watch all your favorite AMP members live in one place on AMPSUMMER.com - The official home of AMP (Any Means Possible) streaming.
            </p>
            
            {/* Streamer avatars */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {AMP_STREAMERS.map((streamer, index) => (
                <div 
                  key={streamer.name}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 group-hover:border-yellow-500 transition-all duration-300 amp-avatar-container">
                    <TwitchAvatarImage
                      username={streamer.name}
                      name={streamer.displayName}
                      platform={streamer.platform}
                      size={64}
                      className="w-full h-full"
                    />
                  </div>
                  <Badge 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white border-yellow-500 text-xs whitespace-nowrap"
                  >
                    {streamer.displayName}
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-red-600 font-semibold">LIVE NOW</span>
              </div>
            </div>
            
            {/* SEO Keywords */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">#AMPSummer</span>
              <span className="text-xs text-muted-foreground">#AMPexclusive</span>
              <span className="text-xs text-muted-foreground">#AnyMeansPossible</span>
              <span className="text-xs text-muted-foreground">#KaiCenat</span>
              <span className="text-xs text-muted-foreground">#DukeDennis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Status Bar */}
      <StreamStatusBar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-auto min-h-0 amp-stream-container">
        {/* Streams Grid */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-black/5 min-h-0">
          <AMPStreamGrid streams={streams} liveStatusMap={liveStatusMap} />
        </div>

        {/* Chat Panel */}
        <StreamChat show={showChat} onClose={() => setShowChat(false)} />
      </div>

      {/* Footer Info */}
      <div className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Users className="w-3 h-3" />
                {streams.length} Active Streams
              </Badge>
              <Badge variant="outline">
                2x2 Layout
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>Watching: {AMP_STREAMERS.map(s => s.displayName).join(', ')}</p>
              <p className="text-xs mt-1">AMP Summer 2025 • AMPSUMMER.com • Any Means Possible ⚡️ #AMPexclusive</p>
            </div>
          </div>
        </div>
        
        {/* SEO Content Section */}
        <div className="sr-only">
          <h2>About AMP Summer 2025</h2>
          <p>AMP Summer 2025 is the premier streaming event featuring all members of AMP (Any Means Possible). Watch Kai Cenat, Duke Dennis, Agent00, and Fanum live on AMPSUMMER.com. Experience the best of AMP exclusive content with our multi-stream viewer.</p>
          <h3>Featured AMP Streamers</h3>
          <ul>
            <li>Kai Cenat - The energetic entertainer bringing non-stop content</li>
            <li>Duke Dennis - Gaming legend and AMP co-founder</li>
            <li>Agent00 - Elite gamer and content creator</li>
            <li>Fanum - The comedic genius of AMP</li>
          </ul>
          <p>Join millions of viewers watching AMP Summer on AMPSUMMER.com. Any Means Possible represents the future of content creation. Don&apos;t miss out on AMP exclusive streams, special events, and collaborations only on AMPSUMMER.com.</p>
        </div>
      </div>
    </div>
    </>
  )
}