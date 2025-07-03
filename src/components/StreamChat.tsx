'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStreamStore } from '@/store/streamStore'
import { MessageSquare, X, ChevronDown, Users, Eye, Volume2, VolumeX, ChevronUp, Maximize2, Minimize2 } from 'lucide-react'
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
  
  // Initialize with unmuted stream if available, otherwise first stream
  const getInitialStreamId = () => {
    const unmutedStream = twitchStreams.find(s => !s.muted)
    return unmutedStream?.id || twitchStreams[0]?.id || ''
  }
  
  const [selectedStreamId, setSelectedStreamId] = useState(getInitialStreamId())
  const [isMobile, setIsMobile] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Get Twitch status for viewer counts
  const twitchChannels = twitchStreams.map(s => s.channelName)
  const { status } = useTwitchStatus(twitchChannels, {
    enabled: show && twitchChannels.length > 0,
    refreshInterval: 60000
  })
  
  // Auto-select unmuted stream immediately when stream is unmuted
  useEffect(() => {
    if (!show) return
    
    // Always prioritize unmuted streams
    const unmutedStream = twitchStreams.find(s => !s.muted)
    
    if (unmutedStream && unmutedStream.id !== selectedStreamId) {
      // Immediately switch to unmuted stream
      setSelectedStreamId(unmutedStream.id)
      return
    }
    
    // If no unmuted stream and we don't have a valid selection, pick best option
    if (!twitchStreams.find(s => s.id === selectedStreamId)) {
      if (status.size > 0) {
        // Select stream with most viewers if available
        let maxViewers = 0
        let maxViewerStreamId = twitchStreams[0]?.id || ''
        
        twitchStreams.forEach(stream => {
          const streamStatus = status.get(stream.channelName)
          if (streamStatus && streamStatus.isLive && streamStatus.viewerCount > maxViewers) {
            maxViewers = streamStatus.viewerCount
            maxViewerStreamId = stream.id
          }
        })
        
        if (maxViewerStreamId) {
          setSelectedStreamId(maxViewerStreamId)
        }
      } else if (twitchStreams[0]) {
        // Fallback to first stream
        setSelectedStreamId(twitchStreams[0].id)
      }
    }
  }, [show, twitchStreams, selectedStreamId, status])
  
  // Reinitialize selected stream when twitch streams change (streams added/removed)
  useEffect(() => {
    if (twitchStreams.length > 0) {
      const currentSelected = twitchStreams.find(s => s.id === selectedStreamId)
      
      // If current selection is no longer valid, or if we should prefer an unmuted stream
      if (!currentSelected) {
        const newId = getInitialStreamId()
        if (newId !== selectedStreamId) {
          setSelectedStreamId(newId)
        }
      }
    }
  }, [twitchStreams.length, streams]) // eslint-disable-line react-hooks/exhaustive-deps
  
  if (!show) return null

  const selectedStream = twitchStreams.find(s => s.id === selectedStreamId) || twitchStreams[0]

  // Mobile Chat: Bottom sheet style
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isMinimized ? "calc(100% - 60px)" : isFullscreen ? "0%" : "30%" }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-xl shadow-2xl flex flex-col"
          style={{ height: isFullscreen ? "100vh" : "70vh" }}
        >
          {/* Mobile Header with drag handle */}
          <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                <h3 className="font-semibold">Chat</h3>
                {twitchStreams.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {twitchStreams.length}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8 w-8 p-0"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            
            {/* Mobile Stream Selector */}
            {twitchStreams.length > 0 && !isMinimized && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {twitchStreams.map(stream => {
                  const streamStatus = status.get(stream.channelName)
                  const isSelected = selectedStreamId === stream.id
                  
                  return (
                    <Button
                      key={stream.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStreamId(stream.id)}
                      className="flex-shrink-0 gap-2 min-w-fit"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        streamStatus?.isLive ? "bg-red-500 animate-pulse" : "bg-gray-400"
                      )} />
                      <span className="truncate max-w-[100px]">{stream.channelName}</span>
                      {!stream.muted && (
                        <Volume2 className="w-3 h-3" />
                      )}
                      {streamStatus && (
                        <Badge variant="secondary" className="text-xs">
                          {streamStatus.viewerCount > 1000 ? 
                            `${Math.floor(streamStatus.viewerCount / 1000)}K` : 
                            streamStatus.viewerCount
                          }
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Mobile Chat Content */}
          {!isMinimized && (
            <div className="flex-1 relative">
              {twitchStreams.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
                  <div>
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No Twitch streams active</p>
                    <p className="text-sm mt-2">Chat is only available for Twitch streams</p>
                  </div>
                </div>
              ) : (
                <>
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
                  
                  {/* Mobile chat overlay info */}
                  {selectedStream && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {selectedStream.channelName} chat
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  // Desktop Chat: Side panel
  return (
    <div className={cn(
      "relative h-auto w-96 bg-background border-l flex flex-col shadow-none"
    )}>
      {/* Desktop Header */}
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
        
        {/* Desktop Stream Selector */}
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
                  {selectedStream && !selectedStream.muted && (
                    <Volume2 className="w-4 h-4 text-primary" />
                  )}
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
                          {!stream.muted && (
                            <Volume2 className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {streamStatus && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              {streamStatus.viewerCount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Desktop Chat Content */}
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