'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStreamStore } from '@/store/streamStore'
import StreamGrid from '@/components/StreamGrid'
import StreamStatusBar from '@/components/StreamStatusBar'
import { Badge } from '@/components/ui/badge'
import { Zap, Users } from 'lucide-react'
import Image from 'next/image'

const AMP_STREAMERS = [
  { name: 'fanum', displayName: 'Fanum', platform: 'twitch' },
  { name: 'duke', displayName: 'Duke Dennis', platform: 'twitch' },
  { name: 'agent00', displayName: 'Agent 00', platform: 'twitch' },
  { name: 'kai5fn', displayName: 'Kai Cenat', platform: 'twitch' } // Using correct username
]

export default function AmpSummerPage() {
  const router = useRouter()
  const { streams, addStream, setGridLayout, clearAllStreams } = useStreamStore()

  useEffect(() => {
    // Clear existing streams and add AMP streamers
    clearAllStreams()
    
    // Set 2x2 grid layout for 4 streams
    setGridLayout('2x2')
    
    // Add all AMP streamers
    AMP_STREAMERS.forEach(streamer => {
      addStream(streamer.name)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-background border-b">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            {/* Title with animation */}
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AMP SUMMER
              </h1>
              <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
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
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-yellow-500/50 group-hover:border-yellow-500 transition-all duration-300 animate-bounce-in">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20" />
                    <div className="flex items-center justify-center h-full text-2xl md:text-3xl font-bold">
                      {streamer.displayName[0]}
                    </div>
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

      {/* Streams Grid */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-black/5">
        <StreamGrid />
      </div>

      {/* Footer Info */}
      <div className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
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