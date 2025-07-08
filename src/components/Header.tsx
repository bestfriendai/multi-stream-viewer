'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTranslation } from '@/contexts/LanguageContext'
import { useMobileLayoutManager } from '@/hooks/useMobileLayoutManager'
import { useSentryPerformance, useSentryMemoryTracking, useSentryApiTracking } from '@/hooks/useSentryPerformance'
import { StreamMonitor, UserJourneyTracker } from '@/lib/sentry-insights'
import { trackMobileError, setCustomMetrics } from '@/lib/sentry-wrapper'
import * as Sentry from "@sentry/nextjs"

import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import EnhancedLayoutSelector from './EnhancedLayoutSelector'
import LanguageSelector from './LanguageSelector'
import StreamyyyLogo from './StreamyyyLogo'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Import refactored components
import { UserAuth } from './Header/UserAuth'
import { NavigationActions } from './Header/NavigationActions'
import { MobileControls } from './Header/MobileControls'

import { X, Trash2 } from 'lucide-react'

const EnhancedAddStreamDialog = dynamic(() => import('./EnhancedAddStreamDialog'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-32" />
})
const DiscoverPopup = dynamic(() => import('./DiscoverPopup'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-96" />
})

interface HeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

const Header = React.memo(function Header({ onToggleChat, showChat }: HeaderProps) {
  const [showAddStream, setShowAddStream] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Sentry performance monitoring
  const { trackRender, trackInteraction, trackAsyncOperation } = useSentryPerformance('Header')
  const { trackApiCall } = useSentryApiTracking()
  useSentryMemoryTracking('Header', 30000)

  const { streams, clearAllStreams } = useStreamStore()
  const { trackFeatureUsage, trackMenuItemClick } = useAnalytics()
  const { t } = useTranslation()
  
  // Enhanced mobile layout management with Sentry tracking
  const {
    mobile,
    currentLayout,
    recommendedLayout,
    isOptimalLayout,
    refreshLayout,
    handleMobileLayoutError,
    isMobileOptimized,
    shouldShowMobileControls,
    deviceMetrics
  } = useMobileLayoutManager()

  // Track mobile header usage and render performance
  React.useEffect(() => {
    // Track render performance
    trackRender({ 
      streams: streams.length, 
      showChat, 
      mobile: mobile.isMobile,
      layout: currentLayout 
    })

    if (mobile.isMobile) {
      const journey = UserJourneyTracker.getInstance()
      journey.trackAction('mobile_header_rendered', {
        currentLayout,
        recommendedLayout,
        isOptimalLayout,
        deviceMetrics
      })

      // Set mobile-specific context for debugging
      setCustomMetrics({
        'mobile.header_render_time': performance.now(),
        'mobile.is_optimal_layout': isOptimalLayout ? 1 : 0,
        'mobile.stream_count': streams.length
      })

      Sentry.addBreadcrumb({
        message: 'Mobile header rendered',
        category: 'mobile.header',
        level: 'info',
        data: {
          currentLayout,
          recommendedLayout,
          streamCount: streams.length,
          viewport: `${mobile.screenWidth}x${mobile.screenHeight}`,
          orientation: mobile.orientation
        }
      })
    }
  }, [mobile.isMobile, currentLayout, recommendedLayout, isOptimalLayout, streams.length, deviceMetrics])
  





  return (
    <div>
      <header className="relative sticky top-0 z-50 border-b border-border/20">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
          <div className="h-16 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300">
            {/* Centered Responsive Logo */}
            <motion.div
              className="flex items-center justify-center flex-1 md:flex-initial md:justify-start gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                <div className="relative p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-background/90 to-background/70 border border-border/40 group-hover:border-primary/50 transition-all duration-300 backdrop-blur-sm shadow-lg group-hover:shadow-xl">
                  <StreamyyyLogo
                    size="xl"
                    variant="gradient"
                    useForHeader={true}
                    iconOnly={true}
                    showText={false}
                    className="transition-all duration-300"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Mobile Controls */}
            <MobileControls
              onAddStream={() => setShowAddStream(true)}
              onDiscovery={() => setShowDiscovery(true)}
              onToggleChat={onToggleChat}
              onClearAllStreams={clearAllStreams}
              showChat={showChat}
              streamCount={streams.length}
              showMobileMenu={showMobileMenu}
              onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
            />

            {/* Desktop Actions */}
            <motion.div
              className="hidden md:flex items-center gap-2 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <NavigationActions
                onAddStream={() => setShowAddStream(true)}
                onDiscovery={() => setShowDiscovery(true)}
                onToggleChat={onToggleChat}
                showChat={showChat}
                streamCount={streams.length}
              />

              {/* Controls Group */}
              <motion.div
                className="flex items-center gap-1 bg-gradient-to-r from-muted/35 via-muted/40 to-muted/35 backdrop-blur-sm rounded-lg p-1 border border-border/25 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <EnhancedLayoutSelector />
                <SavedLayoutsDialog />
                <ShareDialog />

                <AnimatePresence>
                  {streams.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowClearConfirm(true)}
                        className="h-8 px-3 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                        <span className="ml-1.5">{t('header.clear')} ({streams.length})</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Separator orientation="vertical" className="h-6 opacity-50" />

              {/* User Actions */}
              <motion.div
                className="flex items-center gap-2 bg-gradient-to-r from-muted/25 to-muted/30 backdrop-blur-sm rounded-lg p-1.5 border border-border/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <LanguageSelector />
                <ThemeToggle />
                <UserAuth />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>


      {/* Dialogs */}
      <EnhancedAddStreamDialog
        open={showAddStream}
        onOpenChange={setShowAddStream}
      />

      <DiscoverPopup
        open={showDiscovery}
        onOpenChange={setShowDiscovery}
      />

      {/* Clear Streams Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('header.clearAllStreams')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('common.confirmRemoveAllStreams')}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
{t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  const endInteraction = trackInteraction('clear_all_streams', 'confirmation_dialog')
                  try {
                    await trackAsyncOperation('clear_all_streams', async () => {
                      clearAllStreams()
                      setShowClearConfirm(false)
                      trackFeatureUsage('clear_all_streams_confirmed')
                    })
                  } finally {
                    endInteraction()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
{t('common.clearAll')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
})

export default Header