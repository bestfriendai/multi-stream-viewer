'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStreamStore } from '@/store/streamStore'
import { MessageSquare, X, ChevronDown, Users, Eye } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StreamChatProps {
  show: boolean
  onClose: () => void
}

export default function StreamChat({ show, onClose }: StreamChatProps) {
  const { streams } = useStreamStore()
  const twitchStreams = streams.filter(s => s.platform === 'twitch')
  const [selectedStreamId, setSelectedStreamId] = useState(twitchStreams[0]?.id || '')
  
  // Get Twitch status for viewer counts
  const twitchChannels = twitchStreams.map(s => s.channelName)
  const { status } = useTwitchStatus(twitchChannels, {
    enabled: show && twitchChannels.length > 0,
    refreshInterval: 60000
  })
  
  // Auto-select stream with most viewers when chat opens
  useEffect(() => {
    if (show && status.size > 0) {
      let maxViewers = 0
      let maxViewerStreamId = twitchStreams[0]?.id || ''
      
      twitchStreams.forEach(stream => {
        const streamStatus = status.get(stream.channelName)
        if (streamStatus && streamStatus.isLive && streamStatus.viewerCount > maxViewers) {
          maxViewers = streamStatus.viewerCount
          maxViewerStreamId = stream.id
        }
      })
      
      if (maxViewerStreamId && maxViewerStreamId !== selectedStreamId) {
        setSelectedStreamId(maxViewerStreamId)
      }
    }
  }, [show, status]) // eslint-disable-line react-hooks/exhaustive-deps
  
  if (!show) return null
  
  const selectedStream = twitchStreams.find(s => s.id === selectedStreamId) || twitchStreams[0]
  
  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-background border-l z-50 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="font-semibold">Stream Chats</h3>
            {twitchStreams.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {twitchStreams.length}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Stream Selector */}
        {twitchStreams.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between text-left font-normal"
              >
                <div className="flex items-center gap-2 flex-1 truncate">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="truncate">{selectedStream?.channelName}</span>
                  {selectedStream?.channelName && status.get(selectedStream.channelName) && (
                    <Badge variant="secondary" className="ml-auto mr-2">
                      <Eye className="w-3 h-3 mr-1" />
                      {status.get(selectedStream.channelName)?.viewerCount.toLocaleString()}
                    </Badge>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[352px]" align="end">
              <ScrollArea className="max-h-[300px]">
                {twitchStreams.map(stream => {
                  const streamStatus = status.get(stream.channelName)
                  return (
                    <DropdownMenuItem
                      key={stream.id}
                      onClick={() => setSelectedStreamId(stream.id)}
                      className={cn(
                        "cursor-pointer",
                        selectedStreamId === stream.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            streamStatus?.isLive ? "bg-red-500 animate-pulse" : "bg-gray-400"
                          )} />
                          <span className="font-medium">{stream.channelName}</span>
                        </div>
                        {streamStatus && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {streamStatus.viewerCount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Chat Content */}
      {twitchStreams.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
          <div>
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No Twitch streams active</p>
            <p className="text-sm mt-2">Chat is only available for Twitch streams</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          {twitchStreams.map(stream => (
            <div
              key={stream.id}
              className={cn(
                "absolute inset-0",
                selectedStreamId === stream.id ? "visible" : "invisible"
              )}
            >
              <iframe
                src={`https://www.twitch.tv/embed/${stream.channelName}/chat?parent=${window.location.hostname}&parent=localhost&darkpopout`}
                className="w-full h-full"
                style={{ border: 'none' }}
                title={`${stream.channelName} chat`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}