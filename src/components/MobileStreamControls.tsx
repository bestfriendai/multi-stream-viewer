'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Volume2, VolumeX, X, Maximize2, Maximize, MoreVertical, Share2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createMuteButtonHandler, createMobileButtonHandler } from '@/utils/eventHandlers'
import { useTranslation } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { StreamMonitor, UserJourneyTracker, PerformanceMonitor } from '@/lib/sentry-insights'
import { trackMobileError, setCustomMetrics } from '@/lib/sentry-wrapper'
import * as Sentry from "@sentry/nextjs"

interface MobileStreamControlsProps {
  streamId: string
  channelName: string
  platform: 'twitch' | 'youtube' | 'rumble'
  muted: boolean
  isPrimary: boolean
  onMuteToggle: () => void
  onFullscreen: () => void
  onSetPrimary: () => void
  onRemove: () => void
  onShare?: () => void
  onFavorite?: () => void
}

export default function MobileStreamControls({
  streamId,
  channelName,
  platform,
  muted,
  isPrimary,
  onMuteToggle,
  onFullscreen,
  onSetPrimary,
  onRemove,
  onShare,
  onFavorite
}: MobileStreamControlsProps) {
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isActionInProgress, setIsActionInProgress] = useState(false)
  const { t } = useTranslation()

  // Track mobile control usage
  useEffect(() => {
    const journey = UserJourneyTracker.getInstance()
    journey.trackAction('mobile_controls_rendered', {
      streamId,
      platform,
      channelName,
      isPrimary,
      muted
    })

    // Track mobile performance context
    setCustomMetrics({
      'mobile.controls_render_time': performance.now(),
      'mobile.viewport_width': window.innerWidth,
      'mobile.viewport_height': window.innerHeight
    })

    return () => {
      journey.trackAction('mobile_controls_unmounted', { streamId })
    }
  }, [streamId, platform, channelName, isPrimary, muted])

  // Enhanced error handling for mobile actions
  const handleMobileAction = useCallback(async (action: string, callback: () => void | Promise<void>) => {
    if (isActionInProgress) return

    setIsActionInProgress(true)
    const startTime = performance.now()

    try {
      // Track action start
      StreamMonitor.trackStreamInteraction(streamId, platform, `mobile_${action}`)
      
      await callback()
      
      // Track successful action
      const duration = performance.now() - startTime
      setCustomMetrics({
        [`mobile.${action}_duration`]: duration,
        [`mobile.${action}_success`]: 1
      })

      Sentry.addBreadcrumb({
        message: `Mobile action completed: ${action}`,
        category: 'mobile.interaction',
        level: 'info',
        data: {
          streamId,
          platform,
          action,
          duration,
          success: true
        }
      })

    } catch (error) {
      // Track failed action
      setCustomMetrics({
        [`mobile.${action}_error`]: 1
      })

      if (error instanceof Error) {
        trackMobileError(error, {
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
          touchDevice: true,
          component: 'MobileStreamControls',
          action,
          streamId,
          platform
        })
      }

      console.error(`Mobile action failed: ${action}`, error)
    } finally {
      setIsActionInProgress(false)
    }
  }, [isActionInProgress, streamId, platform])

  const handleMuteToggle = useCallback(() => {
    handleMobileAction('mute_toggle', onMuteToggle)
  }, [handleMobileAction, onMuteToggle])

  const handleFullscreen = useCallback(() => {
    handleMobileAction('fullscreen', onFullscreen)
  }, [handleMobileAction, onFullscreen])

  const handleSetPrimary = useCallback(() => {
    handleMobileAction('set_primary', onSetPrimary)
  }, [handleMobileAction, onSetPrimary])

  const handleRemove = useCallback(() => {
    handleMobileAction('remove_stream', onRemove)
  }, [handleMobileAction, onRemove])

  const handleShare = useCallback(async () => {
    await handleMobileAction('share', async () => {
      if (onShare) onShare()
      
      // Enhanced native share with error handling
      if (navigator.share) {
        try {
          await navigator.share({
            title: t('mobile.shareTitle', { channel: channelName }),
            text: t('mobile.shareText', { channel: channelName }),
            url: window.location.href
          })
          
          Sentry.addBreadcrumb({
            message: 'Native share completed successfully',
            category: 'mobile.share',
            level: 'info',
            data: { streamId, platform, channelName }
          })
        } catch (shareError) {
          // User cancelled share or share failed
          if (shareError instanceof Error && shareError.name !== 'AbortError') {
            throw shareError
          }
        }
      } else {
        // Fallback for browsers without native share
        await navigator.clipboard.writeText(window.location.href)
        
        Sentry.addBreadcrumb({
          message: 'URL copied to clipboard (fallback)',
          category: 'mobile.share',
          level: 'info',
          data: { streamId, platform, channelName }
        })
      }
    })
  }, [handleMobileAction, onShare, t, channelName, streamId, platform])

  const handleFavorite = useCallback(() => {
    handleMobileAction('favorite_toggle', () => {
      setIsFavorite(!isFavorite)
      if (onFavorite) onFavorite()
    })
  }, [handleMobileAction, isFavorite, onFavorite])

  return (
    <>
      {/* Floating Control Bar - Always visible on mobile */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-100 transition-all duration-200 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* Primary Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleMuteToggle}
              disabled={isActionInProgress}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "flex items-center justify-center",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                muted 
                  ? "bg-red-500/20 border border-red-400/30 text-red-100"
                  : "bg-white/20 border border-white/30 text-white"
              )}
              style={{ minWidth: '56px', minHeight: '56px' }}
              aria-label={muted ? t('header.unmuteStream') : t('header.muteStream')}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {/* Touch feedback ripple */}
              <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
            </button>

            <button
              onClick={handleFullscreen}
              disabled={isActionInProgress}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "flex items-center justify-center",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-white/20 border border-white/30 text-white"
              )}
              style={{ minWidth: '56px', minHeight: '56px' }}
              aria-label={t('header.fullscreen')}
            >
              <Maximize size={20} />
              <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
            </button>

            {!isPrimary && (
              <button
                onClick={handleSetPrimary}
                disabled={isActionInProgress}
                className={cn(
                  "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                  "flex items-center justify-center",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "bg-blue-500/20 border border-blue-400/30 text-blue-100"
                )}
                style={{ minWidth: '56px', minHeight: '56px' }}
                aria-label={t('streams.setPrimary')}
              >
                <Maximize2 size={20} />
                <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
              </button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex gap-2">
            <button
              onClick={createMobileButtonHandler(() => {
                setShowQuickActions(!showQuickActions)
              }, {
                hapticFeedback: 'light',
                analytics: { event: 'quick_actions_toggle', properties: { source: 'mobile_controls' } }
              })}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "flex items-center justify-center",
                "bg-white/20 border border-white/30 text-white"
              )}
              style={{ minWidth: '56px', minHeight: '56px' }}
              aria-label={t('mobile.moreOptions')}
            >
              <MoreVertical size={20} />
              <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Menu */}
      <AnimatePresence>
        {showQuickActions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowQuickActions(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-50 safe-bottom"
            >
              <div className="p-2">
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
              </div>

              <div className="px-4 pb-4 space-y-2">
                <h3 className="text-white font-semibold text-lg mb-3">{channelName}</h3>

                <button
                  onClick={createMobileButtonHandler(() => {
                    handleShare()
                    setShowQuickActions(false)
                  })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                  style={{ minHeight: '56px' }}
                  aria-label={t('mobile.shareStream')}
                >
                  <Share2 size={24} className="text-white" />
                  <span className="text-white text-left">{t('mobile.shareStream')}</span>
                </button>

                <button
                  onClick={createMobileButtonHandler(() => {
                    handleFavorite()
                    setShowQuickActions(false)
                  })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                  style={{ minHeight: '56px' }}
                  aria-label={isFavorite ? t('streams.removeFromFavorites') : t('streams.addToFavorites')}
                >
                  <Heart size={24} className={cn("transition-colors", isFavorite ? "text-red-500 fill-red-500" : "text-white")} />
                  <span className="text-white text-left">{isFavorite ? t('streams.removeFromFavorites') : t('streams.addToFavorites')}</span>
                </button>

                <button
                  onClick={createMobileButtonHandler(() => {
                    handleRemove()
                    setShowQuickActions(false)
                  })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  style={{ minHeight: '56px' }}
                  aria-label={t('header.removeStream')}
                >
                  <X size={24} className="text-red-400" />
                  <span className="text-red-400 text-left">{t('header.removeStream')}</span>
                </button>

                <button
                  onClick={createMobileButtonHandler(() => setShowQuickActions(false))}
                  className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors mt-4"
                  style={{ minHeight: '56px' }}
                  aria-label={t('common.cancel')}
                >
                  <span className="text-white">{t('common.cancel')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}