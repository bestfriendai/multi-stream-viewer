'use client'

import React, { useState } from 'react'
import { Plus, Grid3X3, Layers, Play, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/haptics'
import { useStreamStore } from '@/store/streamStore'
import { useRouter } from 'next/navigation'
import { muteManager } from '@/lib/muteManager'

interface MobileFABProps {
  className?: string
}

export default function MobileFAB({ className }: MobileFABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { streams, setGridLayout, gridLayout } = useStreamStore()
  const router = useRouter()

  const toggleMenu = () => {
    haptic.light()
    setIsOpen(!isOpen)
  }

  const handleAddStream = () => {
    haptic.medium()
    setIsOpen(false)
    router.push('/')
  }

  const handleLayoutChange = (layout: string) => {
    haptic.light()
    setGridLayout(layout as any)
    setIsOpen(false)
  }

  const handleAutoPlay = () => {
    haptic.medium()
    // Auto-play all muted streams
    const mutedStreams = streams.filter(s => muteManager.getMuteState(s.id))
    mutedStreams.forEach(stream => {
      // Trigger play action
    })
    setIsOpen(false)
  }

  const fabActions = [
    {
      icon: <Plus size={20} />,
      label: 'Add Stream',
      color: 'from-blue-500 to-blue-600',
      onClick: handleAddStream
    },
    {
      icon: <Grid3X3 size={20} />,
      label: 'Grid Layout',
      color: 'from-purple-500 to-purple-600',
      onClick: () => handleLayoutChange('auto')
    },
    {
      icon: <Layers size={20} />,
      label: 'Focus Mode',
      color: 'from-green-500 to-green-600',
      onClick: () => handleLayoutChange('focus')
    },
    {
      icon: <Play size={20} />,
      label: 'Auto Play All',
      color: 'from-orange-500 to-orange-600',
      onClick: handleAutoPlay
    }
  ]

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className={cn("fixed bottom-20 right-4 z-50 md:hidden", className)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {fabActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={action.onClick}
                  className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-full pl-4 pr-6 py-3 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={cn(
                    "p-2 rounded-full bg-gradient-to-r text-white",
                    action.color
                  )}>
                    {action.icon}
                  </div>
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={toggleMenu}
          className={cn(
            "relative w-14 h-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-blue-500 to-purple-600",
            "flex items-center justify-center text-white",
            "hover:shadow-xl active:scale-95 transition-all duration-200"
          )}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
          
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full bg-white/20 scale-0 active:scale-100 transition-transform duration-300" />
        </motion.button>

        {/* Stream count badge */}
        {streams.length > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">{streams.length}</span>
          </motion.div>
        )}
      </div>
    </>
  )
}