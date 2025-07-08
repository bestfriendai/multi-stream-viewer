'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMobileLayoutManager } from '@/hooks/useMobileLayoutManager'
import { Plus, Compass, Menu, X, MessageSquare, Zap, Trash2 } from 'lucide-react'
import Link from 'next/link'
import EnhancedLayoutSelector from '@/components/EnhancedLayoutSelector'
import SavedLayoutsDialog from '@/components/SavedLayoutsDialog'
import ShareDialog from '@/components/ShareDialog'
import { ThemeToggle } from '@/components/theme-toggle'
import LanguageSelector from '@/components/LanguageSelector'
import { MobileUserAuth } from './UserAuth'

interface MobileControlsProps {
  onAddStream: () => void
  onDiscovery: () => void
  onToggleChat: () => void
  onClearAllStreams: () => void
  showChat: boolean
  streamCount: number
  maxStreams?: number
  showMobileMenu: boolean
  onToggleMobileMenu: () => void
}

export function MobileControls({ 
  onAddStream, 
  onDiscovery, 
  onToggleChat,
  onClearAllStreams,
  showChat, 
  streamCount,
  maxStreams = 16,
  showMobileMenu,
  onToggleMobileMenu
}: MobileControlsProps) {
  const { t } = useTranslation()
  const { trackFeatureUsage } = useAnalytics()
  
  const {
    mobile,
    currentLayout,
    recommendedLayout,
    isOptimalLayout,
    refreshLayout,
    handleMobileLayoutError
  } = useMobileLayoutManager()

  const handleMobileAction = React.useCallback(async (action: string, callback: () => void | Promise<void>) => {
    try {
      await callback()
      trackFeatureUsage(`mobile_${action}`, { source: 'header' })
    } catch (error) {
      if (mobile.isMobile && error instanceof Error) {
        handleMobileLayoutError(error, { action, component: 'MobileControls' })
      }
      console.error(`Mobile action failed: ${action}`, error)
    }
  }, [mobile.isMobile, handleMobileLayoutError, trackFeatureUsage])

  const handleAddStream = () => {
    handleMobileAction('add_stream', onAddStream)
  }

  const handleDiscovery = () => {
    handleMobileAction('discovery', onDiscovery)
  }

  return (
    <>
      {/* Mobile Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:hidden transition-all duration-300">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddStream}
            size="sm"
            className="h-10 px-3 sm:px-4 font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg border-0 min-w-[44px] touch-manipulation transition-all duration-300 text-responsive-sm"
            disabled={streamCount >= maxStreams}
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1.5 hidden xs:inline transition-opacity duration-300 text-responsive-sm">{t('header.addStream')}</span>
          </Button>
        </motion.div>

        {/* Mobile Layout Selector - Show when streams exist */}
        {streamCount > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 relative"
          >
            <div className="h-10 flex items-center">
              <EnhancedLayoutSelector mobile />
            </div>
            {/* Layout optimization indicator */}
            {mobile.isMobile && !isOptimalLayout && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-background"
                title="Layout can be optimized for mobile"
              />
            )}
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 sm:px-3 sm:w-auto border-border/40 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm min-w-[44px] touch-manipulation transition-all duration-300 text-responsive-sm"
            onClick={handleDiscovery}
          >
            <Compass className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline transition-opacity duration-300 text-responsive-sm">{t('header.discover')}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-muted/60 rounded-lg min-w-[44px] touch-manipulation"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={onToggleMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                opacity: { duration: 0.2 }
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-border/50 z-50 md:hidden shadow-2xl"
            >
              <motion.div
                className="flex items-center justify-between p-4 border-b border-border/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-responsive-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {t('header.menu')}
                </h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleMobileMenu}
                    className="h-8 w-8 p-0 hover:bg-muted/60"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="p-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {/* Stream Count */}
                <motion.div
                  className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="text-responsive-sm text-muted-foreground">{t('header.activeStreams')}</div>
                  <div className="text-responsive-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {streamCount} / {maxStreams}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      onToggleChat()
                      onToggleMobileMenu()
                    }}
                    variant={showChat ? "default" : "outline"}
                    className="w-full justify-start h-12"
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    {showChat ? t('chat.hide') : t('chat.show')}
                  </Button>

                  <Link href="/amp-summer" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                      onClick={onToggleMobileMenu}
                    >
                      <Zap className="mr-3 h-5 w-5 text-yellow-600" />
                      AMP Summer
                    </Button>
                  </Link>
                </motion.div>

                {/* Layout Controls */}
                <div className="pt-4 border-t border-border">
                  <div className="text-responsive-sm font-medium mb-3">Layout & Controls</div>
                  
                  {/* Mobile Layout Optimization */}
                  {mobile.isMobile && !isOptimalLayout && streamCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="text-responsive-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Layout Optimization
                        </span>
                      </div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                        Your current layout ({currentLayout}) can be optimized for mobile viewing.
                      </p>
                      <Button
                        onClick={() => {
                          refreshLayout()
                          onToggleMobileMenu()
                          handleMobileAction('optimize_layout', () => {})
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full h-8 text-xs border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                      >
                        Switch to {recommendedLayout}
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className="space-y-2">
                    <EnhancedLayoutSelector mobile />
                    <SavedLayoutsDialog mobile />
                    <ShareDialog mobile />
                  </div>
                </div>

                {/* Stream Management */}
                {streamCount > 0 && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => {
                        onClearAllStreams()
                        onToggleMobileMenu()
                      }}
                      variant="destructive"
                      className="w-full justify-start h-12"
                    >
                      <Trash2 className="mr-3 h-5 w-5" />
                      {t('header.clearAllStreams')}
                    </Button>
                  </div>
                )}

                {/* Theme Toggle */}
                <div className="pt-4 border-t border-border flex justify-center gap-3">
                  <LanguageSelector />
                  <ThemeToggle />
                  <MobileUserAuth />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}