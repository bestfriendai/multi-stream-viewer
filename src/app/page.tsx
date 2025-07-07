'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import MobileHeader from '@/components/MobileHeader'
import EnhancedMobileStreamViewer from '@/components/EnhancedMobileStreamViewer'
import StreamGrid from '@/components/StreamGrid'
import ResizableStreamGrid from '@/components/ResizableStreamGrid'
import StreamChat from '@/components/StreamChat'
import MobileNav from '@/components/MobileNav'
import MobileSwipeControls from '@/components/MobileSwipeControls'
import ErrorBoundary from '@/components/ErrorBoundary'
import SEOSchema from '@/components/SEOSchema'
import SEOContent from '@/components/SEOContent'
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
const DiscoverPopup = dynamic(() => import('@/components/DiscoverPopup'), {
  loading: () => <div className="p-8 text-center">Loading discover...</div>
})
import StreamStatusBar from '@/components/StreamStatusBar'
import LandingPage from '@/components/LandingPage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedAddStreamDialog from '@/components/EnhancedAddStreamDialog'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useStreamPreload } from '@/hooks/useStreamPreload'
import { loadFromQueryParams } from '@/lib/shareableLinks'
import { getUserStreamCount } from '@/lib/sponsoredStreams'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Grid3x3, Compass, Zap, Heart } from 'lucide-react'
import MobileGestureOverlay from '@/components/MobileGestureOverlay'
import { useStreamGestures } from '@/hooks/useMobileGestures'
import BentoStreamGrid from '@/components/BentoStreamGrid'
import GestureStreamViewer from '@/components/GestureStreamViewer'
import EnhancedMobileLayout from '@/components/EnhancedMobileLayout'
import AppLikeMobileLayout from '@/components/AppLikeMobileLayout'
import MobileFAB from '@/components/MobileFAB'
import ResponsiveTextDemo from '@/components/ResponsiveTextDemo'

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { t } = useTranslation()
  const [showChat, setShowChat] = useState(false)
  const [showAddStream, setShowAddStream] = useState(false)
  const [showMobileView, setShowMobileView] = useState(false)
  const [showMobileStreamViewer, setShowMobileStreamViewer] = useState(false)
  const [showDiscoverPopup, setShowDiscoverPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('streams')
  const [showGestureHints, setShowGestureHints] = useState(false) // Always start with false to prevent tutorial blocking
  const [isMobile, setIsMobile] = useState(false)
  const { addStream, setGridLayout, streams, gridLayout } = useStreamStore()
  const { trackChatToggle, trackFeatureUsage, trackStreamAdded } = useAnalytics()

  // Mobile gesture support
  const streamGestures = useStreamGestures()

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Separate effect for gesture hints to avoid re-renders on stream changes
  useEffect(() => {
    // Completely disable gesture hints tutorial to prevent interface blocking
    setShowGestureHints(false)
    // Clear any existing localStorage entries that might trigger the tutorial
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gesture-hints-shown')
    }
    // Disabled auto-showing gesture hints:
    // if (isMobile && streams.length > 0 && !localStorage.getItem('gesture-hints-shown')) {
    //   setShowGestureHints(true)
    //   localStorage.setItem('gesture-hints-shown', 'true')
    // }
  }, [isMobile, streams.length])

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Preload streaming resources for faster loading
  useStreamPreload()

  // Track homepage visit
  useEffect(() => {
    // Simple check for GA and track page view
    const checkGA = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href
        })
      }
    }

    // Try immediately and after a short delay
    checkGA()
    setTimeout(checkGA, 1000)
  }, [])

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

  const faqItems = [
    {
      question: t('faq.howManyStreams.question'),
      answer: t('faq.howManyStreams.answer')
    },
    {
      question: t('faq.isFree.question'),
      answer: t('faq.isFree.answer')
    },
    {
      question: t('faq.mixPlatforms.question'),
      answer: t('faq.mixPlatforms.answer')
    },
    {
      question: t('faq.mobileSupport.question'),
      answer: t('faq.mobileSupport.answer')
    }
  ]

  // Enhanced page variants for smooth transitions
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background mobile-container safari-mobile-scroll" {...(isMobile ? streamGestures.handlers : {})}>
      <SEOSchema faqs={faqItems} type="WebApplication" />
      <SEOContent
        keywords={[
          "streamyyy",
          "streamy",
          "streamyy",
          "streamy app",
          "streamy viewer",
          "watch multiple streams",
          "multi stream viewer",
          "twitch multistream",
          "youtube multi stream",
          "stream aggregator",
          "esports viewing",
          "gaming streams",
          "live streaming platform",
          "multitwitch alternative",
          "stream viewer"
        ]}
        topics={[
          "Streamyyy multi-stream viewing",
          "Streamy platform for content creators",
          "Esports tournament viewing",
          "Gaming content creation",
          "Live streaming entertainment",
          "Multi-platform stream monitoring",
          "Content creator collaboration"
        ]}
        features={[
          "Streamyyy multi-stream grid layouts",
          "Streamy real-time chat integration",
          "Mobile responsive design",
          "Keyboard shortcuts support",
          "Stream synchronization",
          "Picture-in-picture mode",
          "Dark/light theme support",
          "Accessibility features"
        ]}
        platforms={[
          "Twitch",
          "YouTube",
          "Kick",
          "Rumble"
        ]}
      />

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header onToggleChat={() => setShowChat(!showChat)} showChat={showChat} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader
          onAddStream={() => {
            setShowAddStream(true)
            trackFeatureUsage('add_stream_mobile_header')
          }}
        />
      </div>

      {/* Main Content with Tabs */}
      <div className={cn(
        "flex-1 flex",
        "pb-16 md:pb-0", // Add padding for mobile nav
        "relative" // Relative positioning for proper layout
      )}>
        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {streams.length > 0 && (
              <div className="border-b px-4 py-0">
                <TabsList className="h-10 bg-transparent">
                <TabsTrigger value="streams" className="gap-2">
                  <Grid3x3 size={16} />
                  <span className="hidden sm:inline">{t('tabs.streams')}</span>
                  {streams.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {streams.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="discover" className="gap-2">
                  <Compass size={16} />
                  <span className="hidden sm:inline">{t('tabs.discover')}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                </TabsTrigger>
                <TabsTrigger value="following" className="gap-2">
                  <Heart size={16} />
                  <span className="hidden sm:inline">{t('tabs.following')}</span>
                  <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs bg-gradient-to-r from-red-600 to-pink-600">
                    {t('tabs.new')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="features" className="gap-2">
                  <Zap size={16} />
                  <span className="hidden sm:inline">{t('tabs.features')}</span>
                </TabsTrigger>
              </TabsList>
              </div>
            )}

            <TabsContent value="streams" className="flex-1 m-0 p-0 flex flex-col">
              <ErrorBoundary>
                {streams.length === 0 ? (
                  <LandingPage onAddStream={() => setShowAddStream(true)} />
                ) : (
                  <>
                    <StreamStatusBar />
                    <div className="flex-1 p-0">
                      {/* Route to appropriate component based on layout */}
                      {(() => {
                        // Route based on layout type, not device
                        switch (gridLayout) {
                          case 'custom':
                            return <BentoStreamGrid />
                          case 'focus':
                            return <StreamGrid />
                          case 'pip':
                            return <StreamGrid />
                          case 'stacked':
                            return <StreamGrid />
                          case 'mosaic':
                            return <StreamGrid />
                          case 'carousel':
                            // Only use EnhancedMobileLayout for carousel mode
                            return isMobile ? <EnhancedMobileLayout /> : <StreamGrid />
                          case 'app-mobile':
                            // New app-like mobile layout
                            return isMobile ? <AppLikeMobileLayout /> : <StreamGrid />
                          default:
                            // Use AppLikeMobileLayout for mobile, StreamGrid for desktop
                            return isMobile ? <AppLikeMobileLayout /> : <StreamGrid />
                        }
                      })()}
                    </div>
                  </>
                )}
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
                <div className="space-y-8">
                  <ResponsiveTextDemo />
                  <FeaturesShowcase />
                </div>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>

        <ErrorBoundary>
          <StreamChat show={showChat} onClose={() => {
            setShowChat(false)
            trackChatToggle(false)
          }} />
        </ErrorBoundary>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        onAddStream={() => {
          setShowAddStream(true)
          trackFeatureUsage('add_stream_mobile')
        }}
        onToggleChat={() => {
          setShowChat(!showChat)
          trackChatToggle(!showChat)
        }}
        onOpenLayouts={() => {
          trackFeatureUsage('layouts_mobile')
        }}
        onOpenDiscover={() => {
          setShowDiscoverPopup(true)
          trackFeatureUsage('discover_mobile')
        }}
        showChat={showChat}
        streamCount={streams.length}
        onToggleSwipeView={() => {
          setShowMobileStreamViewer(true)
          trackFeatureUsage('mobile_stream_viewer')
        }}
      />

      {/* Enhanced Mobile Stream Viewer */}
      <EnhancedMobileStreamViewer
        show={showMobileStreamViewer}
        onClose={() => setShowMobileStreamViewer(false)}
      />

      {/* Mobile Swipe Controls - Only show when explicitly enabled */}
      {showMobileView && <MobileSwipeControls onClose={() => setShowMobileView(false)} />}

      {/* Enhanced Add Stream Dialog */}
      <EnhancedAddStreamDialog
        open={showAddStream}
        onOpenChange={setShowAddStream}
      />

      {/* Discover Popup */}
      <DiscoverPopup
        open={showDiscoverPopup}
        onOpenChange={setShowDiscoverPopup}
      />

      {/* Mobile Gesture Overlay */}
      {isMobile && (
        <MobileGestureOverlay
          showHints={showGestureHints}
          onDismissHints={() => setShowGestureHints(false)}
        />
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && streams.length > 0 && <MobileFAB />}
    </div>
  );
}
