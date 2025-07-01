'use client'

import { useStreamStore } from '@/store/streamStore'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { Users, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StreamStatusBar() {
  const { streams } = useStreamStore()
  
  // Get all Twitch channel names
  const twitchChannels = streams
    .filter(stream => stream.platform === 'twitch')
    .map(stream => stream.channelName)
  
  const { status, loading } = useTwitchStatus(twitchChannels)
  
  // Calculate total viewers
  const totalViewers = Array.from(status.values())
    .filter(s => s.isLive)
    .reduce((sum, s) => sum + s.viewerCount, 0)
  
  const liveCount = Array.from(status.values()).filter(s => s.isLive).length
  
  if (streams.length === 0) return null
  
  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {streams.length} stream{streams.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {!loading && liveCount > 0 && (
            <>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <LiveIndicator isLive={true} showViewers={false} size="sm" />
                <span className="text-muted-foreground">
                  {liveCount} live
                </span>
              </div>
              
              {totalViewers > 0 && (
                <>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {totalViewers.toLocaleString()} viewers
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Stream pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {streams.map(stream => {
            const streamStatus = stream.platform === 'twitch' ? status.get(stream.channelName) : null
            
            return (
              <div
                key={stream.id}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs whitespace-nowrap",
                  "bg-secondary/50 text-secondary-foreground",
                  "hover:bg-secondary/70 transition-colors cursor-pointer"
                )}
              >
                {streamStatus?.isLive && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
                <span>{stream.channelName}</span>
                {streamStatus?.isLive && streamStatus.viewerCount > 0 && (
                  <span className="text-muted-foreground">
                    ({streamStatus.viewerCount.toLocaleString()})
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}