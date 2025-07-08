'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Zap, Crown, Plus, Compass, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationActionsProps {
  onAddStream: () => void
  onDiscovery: () => void
  onToggleChat: () => void
  showChat: boolean
  streamCount: number
  maxStreams?: number
}

export function NavigationActions({ 
  onAddStream, 
  onDiscovery, 
  onToggleChat, 
  showChat, 
  streamCount,
  maxStreams = 16 
}: NavigationActionsProps) {
  const { t } = useTranslation()
  const { trackFeatureUsage } = useAnalytics()

  const handleAddStream = () => {
    onAddStream()
    trackFeatureUsage('add_stream', { source: 'header' })
  }

  const handleDiscovery = () => {
    onDiscovery()
    trackFeatureUsage('discovery', { source: 'header' })
  }

  return (
    <>
      {/* Enhanced Primary Actions Group */}
      <motion.div
        className="flex items-center gap-1 bg-gradient-to-r from-muted/30 via-muted/40 to-muted/30 backdrop-blur-md rounded-xl p-1.5 border border-border/30 shadow-lg"
        whileHover={{ scale: 1.01, y: -1, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddStream}
            size="sm"
            className="h-8 px-3 font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 border-0 shadow-md text-responsive-sm"
            disabled={streamCount >= maxStreams}
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1.5 text-responsive-sm transition-all duration-300">{t('header.addStream')}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-background/60 rounded-lg text-responsive-sm"
            onClick={handleDiscovery}
          >
            <Compass className="h-4 w-4" />
            <span className="ml-1.5 text-responsive-sm transition-all duration-300">Discover</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={showChat ? "default" : "ghost"}
            size="sm"
            onClick={onToggleChat}
            className={cn(
              "h-8 px-3 rounded-lg",
              showChat
                ? "bg-gradient-to-r from-primary to-primary/90 border-0"
                : "hover:bg-background/60"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="ml-1.5 text-responsive-sm transition-all duration-300">{t('header.chat')}</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Navigation Links */}
      <motion.div
        className="flex items-center gap-1 bg-gradient-to-r from-muted/20 via-muted/25 to-muted/20 backdrop-blur-sm rounded-lg p-1 border border-border/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <Link href="/amp-summer">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-yellow-600 hover:bg-yellow-500/10"
            >
              <Zap className="h-4 w-4" />
              <span className="ml-1.5 text-responsive-sm transition-all duration-300">AMP</span>
            </Button>
          </motion.div>
        </Link>

        <Link href="/pricing">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-purple-600 hover:bg-purple-500/10"
            >
              <Crown className="h-4 w-4" />
              <span className="ml-1.5 text-responsive-sm transition-all duration-300">{t('header.pricing')}</span>
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </>
  )
}