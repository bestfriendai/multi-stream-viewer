'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { haptic } from '@/lib/haptics'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  threshold?: number
  maxPull?: number
  disabled?: boolean
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPull = 120,
  disabled = false
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTriggered, setIsTriggered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, threshold], [0, 1])
  const rotate = useTransform(y, [0, threshold], [0, 180])
  const scale = useTransform(y, [0, threshold * 0.8, threshold], [0.8, 1, 1.1])

  const handleDragStart = useCallback(() => {
    if (disabled || isRefreshing) return false
    
    // Only allow pull-to-refresh at the top of the scroll container
    const container = containerRef.current
    if (container && container.scrollTop > 0) return false
    
    return true
  }, [disabled, isRefreshing])

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    if (disabled || isRefreshing) return
    
    const pullDistance = Math.max(0, Math.min(info.offset.y, maxPull))
    y.set(pullDistance)
    
    // Trigger haptic feedback when crossing threshold
    if (pullDistance >= threshold && !isTriggered) {
      setIsTriggered(true)
      haptic.medium()
    } else if (pullDistance < threshold && isTriggered) {
      setIsTriggered(false)
    }
  }, [disabled, isRefreshing, y, threshold, maxPull, isTriggered])

  const handleDragEnd = useCallback(async (_: any, info: PanInfo) => {
    if (disabled || isRefreshing) return
    
    const pullDistance = info.offset.y
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      haptic.success()
      
      try {
        await onRefresh()
      } catch (error) {
        haptic.error()
        console.error('Pull to refresh error:', error)
      } finally {
        setIsRefreshing(false)
        setIsTriggered(false)
      }
    } else {
      setIsTriggered(false)
    }
    
    // Animate back to starting position
    y.set(0)
  }, [disabled, isRefreshing, threshold, onRefresh, y])

  const refreshIndicatorY = useTransform(y, [0, threshold], [-40, 10])

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Refresh Indicator */}
      <motion.div
        style={{
          y: refreshIndicatorY,
          opacity,
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <motion.div
          style={{ scale }}
          className="flex items-center justify-center w-12 h-12 bg-background border border-border rounded-full shadow-lg backdrop-blur-sm"
        >
          <motion.div
            style={{ rotate }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { 
              duration: 1, 
              repeat: Infinity, 
              ease: 'linear' 
            } : {}}
          >
            <RefreshCw 
              size={20} 
              className={`transition-colors duration-200 ${
                isTriggered || isRefreshing ? 'text-primary' : 'text-muted-foreground'
              }`} 
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default PullToRefresh