'use client'

import { useState, useEffect, useRef } from 'react'
import { SafariMemoryMonitor, SafariErrorTracker } from '@/utils/safariDebugger'

interface DebugInfo {
  memory?: {
    used: number
    total: number
    limit: number
  }
  errors: any[]
  performance: {
    domNodes: number
    loadTime: number
    navigationTiming: any
  }
  device: {
    userAgent: string
    viewport: string
    pixelRatio: number
    connection?: any
  }
}

export function MobileDebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Show debug panel only on Safari mobile and in development
  const shouldShow = typeof window !== 'undefined' && (
    /iPhone|iPad|iPod/.test(navigator.userAgent) && 
    /Safari/.test(navigator.userAgent) && 
    !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
  ) && (process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true'))

  useEffect(() => {
    if (!shouldShow) return

    // Listen for debug key combination (triple tap)
    let tapCount = 0
    let tapTimer: NodeJS.Timeout

    const handleTap = () => {
      tapCount++
      clearTimeout(tapTimer)
      
      if (tapCount === 3) {
        setIsVisible(prev => !prev)
        tapCount = 0
      } else {
        tapTimer = setTimeout(() => {
          tapCount = 0
        }, 500)
      }
    }

    document.addEventListener('touchend', handleTap)

    return () => {
      document.removeEventListener('touchend', handleTap)
      clearTimeout(tapTimer)
    }
  }, [shouldShow])

  useEffect(() => {
    if (!isVisible || !shouldShow) return

    const updateDebugInfo = () => {
      const memoryMonitor = SafariMemoryMonitor.getInstance()
      const errorTracker = SafariErrorTracker.getInstance()

      // Get memory info
      let memoryInfo
      if ('memory' in performance) {
        const memory = (performance as any).memory
        memoryInfo = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      }

      // Get performance info
      const domNodes = document.querySelectorAll('*').length
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigationTiming ? navigationTiming.loadEventEnd - navigationTiming.navigationStart : 0

      // Get device info
      const viewport = `${window.innerWidth}x${window.innerHeight}`
      const pixelRatio = window.devicePixelRatio || 1
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      setDebugInfo({
        memory: memoryInfo,
        errors: errorTracker.getErrorReport().errors.slice(-5), // Last 5 errors
        performance: {
          domNodes,
          loadTime,
          navigationTiming
        },
        device: {
          userAgent: navigator.userAgent,
          viewport,
          pixelRatio,
          connection
        }
      })
    }

    // Update immediately
    updateDebugInfo()

    // Update every 2 seconds if monitoring
    if (isMonitoring) {
      intervalRef.current = setInterval(updateDebugInfo, 2000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, isMonitoring, shouldShow])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const triggerMemoryCleanup = () => {
    window.dispatchEvent(new CustomEvent('safari-memory-warning'))
    alert('Memory cleanup triggered!')
  }

  const exportDebugReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      debugInfo,
      url: window.location.href,
      sessionStorage: Object.keys(sessionStorage).length,
      localStorage: Object.keys(localStorage).length
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `safari-debug-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!shouldShow || !isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 text-white text-xs p-2 max-h-[50vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Safari Debug Panel</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-2 py-1 rounded text-xs ${
              isMonitoring ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {isMonitoring ? 'Stop' : 'Monitor'}
          </button>
          <button
            onClick={triggerMemoryCleanup}
            className="px-2 py-1 bg-yellow-600 rounded text-xs"
          >
            Cleanup
          </button>
          <button
            onClick={exportDebugReport}
            className="px-2 py-1 bg-blue-600 rounded text-xs"
          >
            Export
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 bg-gray-600 rounded text-xs"
          >
            ×
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className="space-y-2">
          {/* Memory Info */}
          {debugInfo.memory && (
            <div className="bg-gray-800 p-2 rounded">
              <h4 className="font-semibold mb-1">Memory Usage</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>Used: {formatBytes(debugInfo.memory.used)}</div>
                <div>Total: {formatBytes(debugInfo.memory.total)}</div>
                <div>Limit: {formatBytes(debugInfo.memory.limit)}</div>
              </div>
              <div className="mt-1">
                <div className="bg-gray-700 h-2 rounded">
                  <div 
                    className="bg-red-500 h-2 rounded"
                    style={{ width: `${(debugInfo.memory.used / debugInfo.memory.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Performance Info */}
          <div className="bg-gray-800 p-2 rounded">
            <h4 className="font-semibold mb-1">Performance</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>DOM Nodes: {debugInfo.performance.domNodes}</div>
              <div>Load Time: {debugInfo.performance.loadTime.toFixed(0)}ms</div>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-gray-800 p-2 rounded">
            <h4 className="font-semibold mb-1">Device</h4>
            <div className="text-xs space-y-1">
              <div>Viewport: {debugInfo.device.viewport}</div>
              <div>Pixel Ratio: {debugInfo.device.pixelRatio}</div>
              {debugInfo.device.connection && (
                <div>Connection: {debugInfo.device.connection.effectiveType}</div>
              )}
            </div>
          </div>

          {/* Recent Errors */}
          {debugInfo.errors.length > 0 && (
            <div className="bg-red-900 p-2 rounded">
              <h4 className="font-semibold mb-1">Recent Errors ({debugInfo.errors.length})</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {debugInfo.errors.map((error, index) => (
                  <div key={index} className="text-xs">
                    <div className="font-mono">{error.error.message}</div>
                    <div className="text-gray-400">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400">
        Triple tap to toggle • Monitoring: {isMonitoring ? 'ON' : 'OFF'}
      </div>
    </div>
  )
}