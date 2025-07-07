'use client'

import React, { memo, useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Wifi, Signal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PerformanceMonitor, UserJourneyTracker } from '@/lib/sentry-insights'
import { setCustomMetrics } from '@/lib/sentry-wrapper'
import * as Sentry from "@sentry/nextjs"

interface MobileLoadingOptimizerProps {
  isLoading?: boolean
  loadingText?: string
  showConnectionStatus?: boolean
  optimizeForLowNetwork?: boolean
  children?: React.ReactNode
  className?: string
}

interface ConnectionInfo {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

const MobileLoadingOptimizer = memo(function MobileLoadingOptimizer({
  isLoading = false,
  loadingText = 'Loading...',
  showConnectionStatus = true,
  optimizeForLowNetwork = true,
  children,
  className
}: MobileLoadingOptimizerProps) {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null)
  const [loadingStartTime] = useState(Date.now())
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  // Monitor connection quality
  useEffect(() => {
    const connection = (navigator as any).connection
    if (connection) {
      const updateConnectionInfo = () => {
        const info: ConnectionInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }
        setConnectionInfo(info)
        
        // Determine if connection is slow
        const isSlow = info.effectiveType === 'slow-2g' || 
                      info.effectiveType === '2g' || 
                      info.downlink < 0.5 ||
                      info.rtt > 2000
        setIsSlowConnection(isSlow)

        // Track connection metrics
        setCustomMetrics({
          'mobile.connection_downlink': info.downlink,
          'mobile.connection_rtt': info.rtt,
          'mobile.connection_is_slow': isSlow ? 1 : 0,
          'mobile.connection_save_data': info.saveData ? 1 : 0
        })

        Sentry.setTag('connection.type', info.effectiveType)
        Sentry.setTag('connection.is_slow', isSlow ? 'true' : 'false')
      }

      updateConnectionInfo()
      connection.addEventListener('change', updateConnectionInfo)

      return () => {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  // Track loading performance
  useEffect(() => {
    if (isLoading) {
      const journey = UserJourneyTracker.getInstance()
      journey.trackAction('mobile_loading_start', {
        loadingText,
        connectionType: connectionInfo?.effectiveType || 'unknown',
        isSlowConnection
      })

      const endMeasurement = PerformanceMonitor.startMeasurement('mobile_loading')
      
      return () => {
        const loadingDuration = Date.now() - loadingStartTime
        endMeasurement()
        
        journey.trackAction('mobile_loading_end', {
          duration: loadingDuration,
          connectionType: connectionInfo?.effectiveType || 'unknown',
          isSlowConnection
        })

        setCustomMetrics({
          'mobile.loading_duration': loadingDuration,
          'mobile.loading_with_slow_connection': isSlowConnection ? 1 : 0
        })

        // Track slow loading for debugging
        if (loadingDuration > 3000) {
          Sentry.addBreadcrumb({
            message: 'Slow mobile loading detected',
            category: 'mobile.performance',
            level: 'warning',
            data: {
              duration: loadingDuration,
              connectionType: connectionInfo?.effectiveType,
              isSlowConnection,
              loadingText
            }
          })
        }
      }
    }
  }, [isLoading, loadingText, connectionInfo, isSlowConnection, loadingStartTime])

  // Optimized loading animations based on connection
  const loadingVariants = useMemo(() => {
    const baseVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: isSlowConnection ? 0.8 : 0.4,
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.8,
        transition: {
          duration: isSlowConnection ? 0.6 : 0.3
        }
      }
    }

    // Reduce animation complexity for slow connections
    if (isSlowConnection && optimizeForLowNetwork) {
      return {
        ...baseVariants,
        visible: {
          ...baseVariants.visible,
          transition: {
            duration: 0.2,
            ease: "linear"
          }
        }
      }
    }

    return baseVariants
  }, [isSlowConnection, optimizeForLowNetwork])

  const spinnerVariants = useMemo(() => ({
    animate: {
      rotate: 360,
      transition: {
        duration: isSlowConnection ? 2 : 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }), [isSlowConnection])

  // Connection status indicator
  const ConnectionStatus = memo(() => {
    if (!showConnectionStatus || !connectionInfo) return null

    const getConnectionColor = () => {
      switch (connectionInfo.effectiveType) {
        case '4g': return 'text-green-500'
        case '3g': return 'text-yellow-500'
        case '2g':
        case 'slow-2g': return 'text-red-500'
        default: return 'text-gray-500'
      }
    }

    const getConnectionIcon = () => {
      if (connectionInfo.saveData) return <Wifi className="h-3 w-3" />
      return <Signal className="h-3 w-3" />
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <span className={cn("transition-colors", getConnectionColor())}>
          {getConnectionIcon()}
        </span>
        <span>
          {connectionInfo.effectiveType.toUpperCase()}
          {connectionInfo.saveData && " (Save Data)"}
        </span>
      </motion.div>
    )
  })

  // Optimized loading message for slow connections
  const getOptimizedLoadingText = () => {
    if (isSlowConnection && optimizeForLowNetwork) {
      return loadingText.includes('Loading') 
        ? loadingText.replace('Loading', 'Optimizing for your connection')
        : `${loadingText} (Optimized)`
    }
    return loadingText
  }

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-[200px] p-6"
          >
            {/* Loading Spinner */}
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              className="mb-4"
            >
              <Loader2 className={cn(
                "h-8 w-8 text-primary",
                isSlowConnection && "h-6 w-6" // Smaller spinner for slow connections
              )} />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-2"
            >
              <p className="text-sm font-medium text-foreground">
                {getOptimizedLoadingText()}
              </p>
              
              {/* Connection Status */}
              <ConnectionStatus />

              {/* Performance Tip for Slow Connections */}
              {isSlowConnection && optimizeForLowNetwork && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-muted-foreground max-w-xs"
                >
                  Your connection seems slow. We're optimizing the experience for you.
                </motion.p>
              )}
            </motion.div>

            {/* Progress Indicator for Long Loads */}
            {isSlowConnection && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="mt-4 h-1 bg-primary/20 rounded-full overflow-hidden max-w-xs"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default MobileLoadingOptimizer

// Hook for easy integration
export const useMobileLoadingOptimizer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const startLoading = (text = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
    
    // Track loading start
    const journey = UserJourneyTracker.getInstance()
    journey.trackAction('mobile_loading_started', { loadingText: text })
  }

  const stopLoading = () => {
    setIsLoading(false)
    
    // Track loading completion
    const journey = UserJourneyTracker.getInstance()
    journey.trackAction('mobile_loading_completed', { loadingText })
  }

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    MobileLoadingOptimizer
  }
}