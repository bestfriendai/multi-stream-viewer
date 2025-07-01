'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStreamStore } from '@/store/streamStore'
import Header from '@/components/Header'
import StreamGrid from '@/components/StreamGrid'
import StreamChat from '@/components/StreamChat'
import StreamStatusBar from '@/components/StreamStatusBar'
import { Badge } from '@/components/ui/badge'
import { Zap, Users } from 'lucide-react'
import Image from 'next/image'
import TwitchAvatarImage from '@/components/TwitchAvatarImage'

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
  const router = useRouter()
  const { streams, addStream, setGridLayout, clearAllStreams } = useStreamStore()
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Clear existing streams and add AMP streamers
    clearAllStreams()
    
    // Set 2x2 grid layout for 4 streams
    setGridLayout('2x2')
    
    // Add all AMP streamers
    AMP_STREAMERS.forEach(streamer => {
      addStream({
        channelName: streamer.name,
        platform: streamer.platform as any
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header showChat={showChat} onToggleChat={() => setShowChat(!showChat)} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-background border-b">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            {/* Title with animation */}
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AMP SUMMER
              </h1>
              <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch all your favorite AMP members live in one place. The ultimate streaming experience.
            </p>
            
            {/* Streamer avatars */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {AMP_STREAMERS.map((streamer, index) => (
                <div 
                  key={streamer.name}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-yellow-500/50 group-hover:border-yellow-500 transition-all duration-300">
                    <TwitchAvatarImage
                      username={streamer.name}
                      name={streamer.displayName}
                      platform={streamer.platform}
                      size={80}
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
          </div>
        </div>
      </div>

      {/* Stream Status Bar */}
      <StreamStatusBar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Streams Grid */}
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-black/5">
          <StreamGrid />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}