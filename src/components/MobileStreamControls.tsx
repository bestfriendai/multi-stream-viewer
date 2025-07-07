'use client'

import React, { useState } from 'react'
import { Volume2, VolumeX, X, Maximize2, Maximize, MoreVertical, Share2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createMuteButtonHandler, createMobileButtonHandler } from '@/utils/eventHandlers'
import { useTranslation } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

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
  const { t } = useTranslation()

  const handleMuteToggle = createMuteButtonHandler(onMuteToggle)

  const handleFullscreen = createMobileButtonHandler(onFullscreen, {
    hapticFeedback: 'medium',
    analytics: { event: 'fullscreen_toggle', properties: { source: 'mobile_controls' } }
  })

  const handleSetPrimary = createMobileButtonHandler(onSetPrimary, {
    hapticFeedback: 'medium',
    analytics: { event: 'set_primary', properties: { source: 'mobile_controls' } }
  })

  const handleRemove = createMobileButtonHandler(onRemove, {
    hapticFeedback: 'heavy',
    analytics: { event: 'remove_stream', properties: { source: 'mobile_controls' } }
  })

  const handleShare = createMobileButtonHandler(() => {
    if (onShare) onShare()
    // Native share implementation
    if (navigator.share) {
      navigator.share({
        title: t('mobile.shareTitle', { channel: channelName }),
        text: t('mobile.shareText', { channel: channelName }),
        url: window.location.href
      })
    }
  }, {
    hapticFeedback: 'light',
    analytics: { event: 'share_stream', properties: { source: 'mobile_controls', platform } }
  })

  const handleFavorite = createMobileButtonHandler(() => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite()
  }, {
    hapticFeedback: 'light',
    analytics: { event: 'favorite_toggle', properties: { source: 'mobile_controls', favorited: !isFavorite } }
  })

  return (
    <>
      {/* Floating Control Bar - Always visible on mobile */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
        <div className="flex items-center justify-between gap-2">
          {/* Primary Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleMuteToggle}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "flex items-center justify-center",
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
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "flex items-center justify-center",
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
                className={cn(
                  "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                  "flex items-center justify-center",
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