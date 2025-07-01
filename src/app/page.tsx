'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import StreamGrid from '@/components/StreamGrid'
import StreamChat from '@/components/StreamChat'
import MobileNav from '@/components/MobileNav'
import MobileSwipeControls from '@/components/MobileSwipeControls'
import ErrorBoundary from '@/components/ErrorBoundary'
import SEOSchema from '@/components/SEOSchema'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const FeaturesShowcase = dynamic(() => import('@/components/FeaturesShowcase'), {
  loading: () => <div className="p-8 text-center">Loading features...</div>
})
const EnhancedDiscovery = dynamic(() => import('@/components/EnhancedDiscovery'), {
  loading: () => <div className="p-8 text-center">Loading discovery...</div>
})
const FollowingRecommended = dynamic(() => import('@/components/FollowingRecommended'), {
  loading: () => <div className="p-8 text-center">Loading...</div>
})
import StreamStatusBar from '@/components/StreamStatusBar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useStreamStore } from '@/store/streamStore'
import { loadFromQueryParams } from '@/lib/shareableLinks'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Grid3x3, Compass, Zap, Heart } from 'lucide-react'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [showAddStream, setShowAddStream] = useState(false)
  const [showMobileView, setShowMobileView] = useState(false)
  const [channelInput, setChannelInput] = useState('')
  const [activeTab, setActiveTab] = useState('streams')
  const { addStream, setGridLayout, streams } = useStreamStore()
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts()
  
  // Load streams from URL params on mount
  useEffect(() => {
    const loadStreams = async () => {
      const params = loadFromQueryParams()
      if (params) {
        // Clear any existing streams and load from URL
        for (const stream of params.streams) {
          await addStream(stream)
        }
        setGridLayout(params.layout as 'grid-2x2' | 'grid-3x3' | 'grid-4x4' | 'mosaic' | 'pip')
      }
    }
    loadStreams()
  }, [])
  
  // Removed auto-show mobile view - let users choose their preferred view
  // useEffect(() => {
  //   const isMobile = window.innerWidth < 768
  //   if (isMobile && streams.filter(s => s.isActive).length > 0) {
  //     setShowMobileView(true)
  //   }
  // }, [streams])
  
  const handleAddStream = async (input: string) => {
    const success = await addStream(input)
    if (success) {
      setChannelInput('')
      setShowAddStream(false)
    }
    return success
  }
  
  const faqItems = [
    {
      question: "How many streams can I watch at once?",
      answer: "You can watch up to 16 streams simultaneously with Streamyyy. The layout automatically adjusts based on the number of streams you add."
    },
    {
      question: "Is Streamyyy free to use?",
      answer: "Yes! Streamyyy is completely free to use. No registration, subscription, or hidden fees required."
    },
    {
      question: "Can I watch Twitch and YouTube streams together?",
      answer: "Absolutely! You can mix streams from Twitch, YouTube, Rumble and other supported platforms in the same viewer."
    },
    {
      question: "Does it work on mobile devices?",
      answer: "Yes, Streamyyy is fully responsive and optimized for phones, tablets, and desktop computers."
    }
  ]

  return (
    <div className="flex flex-col h-screen bg-background">
      <SEOSchema faqs={faqItems} type="WebApplication" />
      <Header onToggleChat={() => setShowChat(!showChat)} showChat={showChat} />
      
      {/* Main Content with Tabs */}
      <div className={cn(
        "flex-1 flex overflow-hidden",
        "pb-16 md:pb-0" // Add padding for mobile nav
      )}>
        <main className={cn(
          "flex-1 overflow-hidden transition-all",
          showChat && "sm:mr-80"
        )}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent">
                <TabsTrigger value="streams" className="gap-2">
                  <Grid3x3 size={16} />
                  <span className="hidden sm:inline">Streams</span>
                  {streams.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {streams.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="discover" className="gap-2">
                  <Compass size={16} />
                  <span className="hidden sm:inline">Discover</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                </TabsTrigger>
                <TabsTrigger value="following" className="gap-2">
                  <Heart size={16} />
                  <span className="hidden sm:inline">Following</span>
                  <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs bg-gradient-to-r from-red-600 to-pink-600">
                    NEW
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="features" className="gap-2">
                  <Zap size={16} />
                  <span className="hidden sm:inline">Features</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="streams" className="flex-1 overflow-hidden m-0 flex flex-col">
              <ErrorBoundary>
                <StreamStatusBar />
                <div className="flex-1 overflow-auto">
                  <StreamGrid />
                </div>
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="discover" className="flex-1 overflow-y-auto">
              <ErrorBoundary>
                <EnhancedDiscovery />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="following" className="flex-1 overflow-y-auto">
              <ErrorBoundary>
                <FollowingRecommended />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="features" className="flex-1 overflow-y-auto p-4">
              <ErrorBoundary>
                <FeaturesShowcase />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>
        
        <ErrorBoundary>
          <StreamChat show={showChat} onClose={() => setShowChat(false)} />
        </ErrorBoundary>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav
        onAddStream={() => setShowAddStream(true)}
        onToggleChat={() => setShowChat(!showChat)}
        onOpenLayouts={() => {}}
        onOpenDiscover={() => setActiveTab('discover')}
        showChat={showChat}
        streamCount={streams.length}
        onToggleSwipeView={() => setShowMobileView(true)}
      />
      
      {/* Mobile Swipe Controls - Only show when explicitly enabled */}
      {showMobileView && <MobileSwipeControls onClose={() => setShowMobileView(false)} />}
      
      {/* Mobile Add Stream Dialog */}
      <Dialog open={showAddStream} onOpenChange={setShowAddStream}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stream</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (channelInput.trim()) {
              handleAddStream(channelInput.trim())
            }
          }} className="space-y-4">
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              placeholder="Enter channel name or URL"
              className="w-full px-3 py-2 border rounded-md"
              autoFocus
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Supported formats:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Twitch: username or twitch.tv/username</li>
                <li>YouTube: youtube.com/watch?v=VIDEO_ID</li>
                <li>Rumble: rumble.com/v1234-title.html</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Add
              </button>
              <button type="button" onClick={() => setShowAddStream(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
