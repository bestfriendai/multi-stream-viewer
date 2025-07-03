'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  snapPoints?: number[] // Heights as percentages: [30, 60, 90]
  initialSnap?: number // Index of initial snap point
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className,
  snapPoints = [30, 60, 90],
  initialSnap = 1
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 100], [1, 0.8])
  
  // Convert snap points to actual pixel values
  const getSnapHeight = (snapIndex: number) => {
    if (typeof window === 'undefined') return 0
    const vh = window.innerHeight
    const snapPoint = snapPoints[snapIndex]
    if (snapPoint === undefined) return 0
    return vh - (vh * snapPoint / 100)
  }

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden'
      // Haptic feedback on open
      if ('vibrate' in navigator) navigator.vibrate(10)
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleDragEnd = (_event: unknown, info: any) => {
    if (!info) return
    
    const velocity = info.velocity?.y || 0
    const offset = info.offset?.y || 0
    
    // Close if dragged down significantly or with high velocity
    if (offset > 100 || velocity > 500) {
      onClose()
      return
    }
    
    // Snap to nearest snap point
    const currentHeight = Math.abs(y.get())
    let closestSnap = initialSnap
    let minDistance = Infinity
    
    snapPoints.forEach((point, index) => {
      const snapHeight = getSnapHeight(index)
      const distance = Math.abs(currentHeight - snapHeight)
      if (distance < minDistance) {
        minDistance = distance
        closestSnap = index
      }
    })
    
    // Animate to closest snap point
    y.set(-getSnapHeight(closestSnap))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ 
              top: typeof window !== 'undefined' ? -window.innerHeight * 0.9 : -800, 
              bottom: 0 
            }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: `-${snapPoints[initialSnap] || 60}%` }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              restDelta: 0.001
            }}
            style={{ 
              opacity,
              maxHeight: '90vh'
            }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-background border-t border-border',
              'rounded-t-3xl shadow-2xl',
              'flex flex-col overflow-hidden',
              className
            )}
          >
            {/* Drag Handle */}
            <div 
              className="flex-shrink-0 p-4 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-2" />
              
              {/* Header */}
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-lg font-semibold">{title}</h3>
                )}
                <div className="ml-auto">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BottomSheet