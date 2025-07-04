'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { Users, Eye, TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StreamStatusBar() {
  const { streams } = useStreamStore()
  const [enableStatus, setEnableStatus] = useState(false)
  const [totalTwitchStreams, setTotalTwitchStreams] = useState<number | null>(null)
  
  // Delay enabling status check to prevent immediate API calls
  useEffect(() => {
    const timer = setTimeout(() => setEnableStatus(true), 3000) // Increased delay
    return () => clearTimeout(timer)
  }, [])

  // Fetch total Twitch streams count
  useEffect(() => {
    if (!enableStatus) return
    
    const fetchTotalStreams = async () => {
      try {
        const response = await fetch('/api/twitch/total-streams')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.totalStreams) {
            setTotalTwitchStreams(data.totalStreams)
          }
        }
      } catch (error) {
        console.error('Failed to fetch total Twitch streams:', error)
      }
    }

    fetchTotalStreams()
    // Refresh every 10 minutes
    const interval = setInterval(fetchTotalStreams, 600000)
    
    return () => clearInterval(interval)
  }, [enableStatus])
  
  // Get all Twitch channel names
  const twitchChannels = streams
    .filter(stream => stream.platform === 'twitch')
    .map(stream => stream.channelName)
  
  const { status, loading } = useTwitchStatus(
    twitchChannels,
    { 
      enabled: enableStatus && twitchChannels.length > 0,
      refreshInterval: 180000 // 3 minutes instead of 2
    }
  )
  
  // Calculate total viewers
  const totalViewers = Array.from(status.values())
    .filter(s => s.isLive)
    .reduce((sum, s) => sum + s.viewerCount, 0)
  
  const liveCount = Array.from(status.values()).filter(s => s.isLive).length
  
  if (streams.length === 0) return null
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border-b border-border px-4 py-2"
      style={{ boxShadow: "var(--elevation-1)" }}
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {!loading && liveCount > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <LiveIndicator isLive={true} showViewers={false} size="sm" />
                <span className="text-muted-foreground font-medium">
                  Watching {liveCount} live{liveCount !== 1 ? 's' : ''}
                </span>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {streams.length} stream{streams.length !== 1 ? 's' : ''}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {!loading && liveCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-4"
              >
                
                {totalViewers > 0 && (
                  <>
                    <div className="w-px h-4 bg-border" />
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">
                        {totalViewers.toLocaleString()} viewers
                      </span>
                    </motion.div>
                  </>
                )}

                {totalTwitchStreams && (
                  <>
                    <div className="w-px h-4 bg-border" />
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground font-medium text-xs">
                        {totalTwitchStreams.toLocaleString()}+ live on Twitch
                      </span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Enhanced Stream pills */}
        <motion.div 
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {streams.map((stream, index) => {
              const streamStatus = stream.platform === 'twitch' ? status.get(stream.channelName) : null
              
              return (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap",
                    "bg-secondary/50 text-secondary-foreground border border-border/50",
                    "hover:bg-secondary/70 hover:border-border transition-all duration-200 cursor-pointer",
                    "backdrop-blur-sm"
                  )}
                  style={{
                    boxShadow: streamStatus?.isLive ? "var(--elevation-2)" : "var(--elevation-1)"
                  }}
                >
                  {streamStatus?.isLive && (
                    <motion.span 
                      className="w-1.5 h-1.5 bg-red-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                    />
                  )}
                  <span className="font-medium">{stream.channelName}</span>
                  {streamStatus?.isLive && streamStatus.viewerCount > 0 && (
                    <motion.span 
                      className="text-muted-foreground flex items-center gap-1"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {streamStatus.viewerCount.toLocaleString()}
                    </motion.span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}