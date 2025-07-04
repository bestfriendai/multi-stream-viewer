'use client'

import React, { useState } from 'react'
import { Volume2, VolumeX, X, Maximize2, Maximize, MoreVertical, Share2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/haptics'
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

  const handleMuteToggle = () => {
    haptic.light()
    onMuteToggle()
  }

  const handleFullscreen = () => {
    haptic.medium()
    onFullscreen()
  }

  const handleSetPrimary = () => {
    haptic.medium()
    onSetPrimary()
  }

  const handleRemove = () => {
    haptic.heavy()
    onRemove()
  }

  const handleShare = () => {
    haptic.light()
    if (onShare) onShare()
    // Native share implementation
    if (navigator.share) {
      navigator.share({
        title: `Watch ${channelName} on Streamyyy`,
        text: `Check out ${channelName}'s stream!`,
        url: window.location.href
      })
    }
  }

  const handleFavorite = () => {
    haptic.light()
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite()
  }

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
                "min-w-[48px] min-h-[48px] flex items-center justify-center",
                muted 
                  ? "bg-red-500/20 border border-red-400/30 text-red-100"
                  : "bg-white/20 border border-white/30 text-white"
              )}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {/* Touch feedback ripple */}
              <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
            </button>

            <button
              onClick={handleFullscreen}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "min-w-[48px] min-h-[48px] flex items-center justify-center",
                "bg-white/20 border border-white/30 text-white"
              )}
              aria-label="Fullscreen"
            >
              <Maximize size={20} />
              <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
            </button>

            {!isPrimary && (
              <button
                onClick={handleSetPrimary}
                className={cn(
                  "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                  "min-w-[48px] min-h-[48px] flex items-center justify-center",
                  "bg-blue-500/20 border border-blue-400/30 text-blue-100"
                )}
                aria-label="Set as primary"
              >
                <Maximize2 size={20} />
                <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
              </button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                haptic.light()
                setShowQuickActions(!showQuickActions)
              }}
              className={cn(
                "relative p-3 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-90",
                "min-w-[48px] min-h-[48px] flex items-center justify-center",
                "bg-white/20 border border-white/30 text-white"
              )}
              aria-label="More options"
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
                  onClick={() => {
                    handleShare()
                    setShowQuickActions(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Share2 size={24} className="text-white" />
                  <span className="text-white text-left">Share Stream</span>
                </button>

                <button
                  onClick={() => {
                    handleFavorite()
                    setShowQuickActions(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Heart size={24} className={cn("transition-colors", isFavorite ? "text-red-500 fill-red-500" : "text-white")} />
                  <span className="text-white text-left">{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={() => {
                    handleRemove()
                    setShowQuickActions(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <X size={24} className="text-red-400" />
                  <span className="text-red-400 text-left">Remove Stream</span>
                </button>

                <button
                  onClick={() => setShowQuickActions(false)}
                  className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors mt-4"
                >
                  <span className="text-white">Cancel</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}