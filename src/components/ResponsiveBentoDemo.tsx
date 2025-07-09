'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayCircle, 
  Users, 
  Eye, 
  MessageSquare, 
  Maximize2, 
  Volume2, 
  VolumeX,
  MoreHorizontal,
  Heart,
  Share2,
  Bookmark,
  Settings,
  Wifi,
  Signal
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ResponsiveBentoDemoProps {
  demoStreams: Array<{
    channelName: string
    viewerCount: number
    gameName?: string
    title?: string
  }>
  isMobile?: boolean
}

// Mock stream data for demo
const mockStreams = [
  {
    channelName: "ninja",
    viewerCount: 45000,
    gameName: "Fortnite",
    title: "Epic Victory Royales!",
    category: "Gaming",
    isLive: true
  },
  {
    channelName: "pokimane",
    viewerCount: 32000,
    gameName: "Just Chatting",
    title: "Morning Coffee & Chat",
    category: "IRL",
    isLive: true
  },
  {
    channelName: "shroud",
    viewerCount: 28000,
    gameName: "Valorant",
    title: "Ranked Grind",
    category: "Gaming",
    isLive: true
  },
  {
    channelName: "xqcow",
    viewerCount: 55000,
    gameName: "Overwatch 2",
    title: "INSANE GAMEPLAY",
    category: "Gaming",
    isLive: true
  },
  {
    channelName: "amouranth",
    viewerCount: 18000,
    gameName: "Hot Tub",
    title: "Relaxing Stream",
    category: "IRL",
    isLive: true
  },
  {
    channelName: "summit1g",
    viewerCount: 22000,
    gameName: "GTA V",
    title: "NoPixel RP",
    category: "Gaming",
    isLive: true
  }
]

// Stream card component with enhanced mobile interactions
const StreamCard = ({ 
  stream, 
  size = 'medium', 
  isMobile = false,
  index = 0
}: { 
  stream: any
  size?: 'small' | 'medium' | 'large'
  isMobile?: boolean
  index?: number
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPressed, setIsPressed] = useState(false)
  
  const sizeClasses = {
    small: "aspect-video",
    medium: "aspect-video",
    large: "aspect-[16/10]"
  }
  
  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  }
  
  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden bg-black group cursor-pointer",
        sizeClasses[size],
        isMobile && "touch-manipulation"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={!isMobile ? { scale: 1.02, zIndex: 10 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      onTapStart={() => isMobile && setIsPressed(true)}
      onTap={() => isMobile && setIsPressed(false)}
      onTapCancel={() => isMobile && setIsPressed(false)}
    >
      {/* Stream thumbnail */}
      <div className="absolute inset-0">
        <img 
          src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.channelName}-${size === 'large' ? '1920x1080' : size === 'medium' ? '640x360' : '320x180'}.jpg`}
          alt={stream.channelName}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            (isHovered || isPressed) && "scale-110"
          )}
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        {/* Live indicator */}
        <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0 text-xs px-2 py-1 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
          LIVE
        </Badge>
        
        {/* Viewer count */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <Eye className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-medium">
            {stream.viewerCount?.toLocaleString()}
          </span>
        </div>
        
        {/* Stream info */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-3 space-y-1",
          size === 'small' && "p-2 space-y-0.5"
        )}>
          <h3 className={cn(
            "text-white font-bold truncate",
            textSizes[size]
          )}>
            {stream.channelName}
          </h3>
          
          {size !== 'small' && (
            <>
              <p className="text-white/80 text-xs truncate">
                {stream.title}
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600/80 text-white border-0 text-xs px-1.5 py-0.5">
                  {stream.gameName}
                </Badge>
                <span className="text-white/60 text-xs">
                  {stream.category}
                </span>
              </div>
            </>
          )}
        </div>
        
        {/* Hover controls (desktop) */}
        <AnimatePresence>
          {isHovered && !isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMuted(!isMuted)
                  }}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile touch feedback */}
        <AnimatePresence>
          {isPressed && isMobile && (
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-xl"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        
        {/* Connection quality indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-1 flex items-center gap-1">
            <Signal className="w-3 h-3 text-green-400" />
            <div className="flex gap-0.5">
              <div className="w-1 h-2 bg-green-400 rounded-full" />
              <div className="w-1 h-2 bg-green-400 rounded-full" />
              <div className="w-1 h-2 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Mobile-optimized bento grid
const MobileBentoGrid = ({ streams }: { streams: any[] }) => {
  return (
    <div className="space-y-3">
      {/* Main featured stream */}
      <StreamCard 
        stream={streams[0]} 
        size="large" 
        isMobile={true}
        index={0}
      />
      
      {/* Secondary streams in 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {streams.slice(1, 5).map((stream, index) => (
          <StreamCard 
            key={index}
            stream={stream} 
            size="medium" 
            isMobile={true}
            index={index + 1}
          />
        ))}
      </div>
      
      {/* Additional streams in horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {streams.slice(5, 10).map((stream, index) => (
          <div key={index} className="flex-shrink-0 w-32">
            <StreamCard 
              stream={stream} 
              size="small" 
              isMobile={true}
              index={index + 5}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Desktop bento grid with complex layout
const DesktopBentoGrid = ({ streams }: { streams: any[] }) => {
  return (
    <div className="grid grid-cols-12 grid-rows-8 gap-3 h-full">
      {/* Main large stream */}
      <div className="col-span-8 row-span-6">
        <StreamCard 
          stream={streams[0]} 
          size="large" 
          index={0}
        />
      </div>
      
      {/* Side streams */}
      {streams.slice(1, 3).map((stream, index) => (
        <div key={index} className="col-span-4 row-span-3">
          <StreamCard 
            stream={stream} 
            size="medium" 
            index={index + 1}
          />
        </div>
      ))}
      
      {/* Bottom row */}
      {streams.slice(3, 7).map((stream, index) => (
        <div key={index} className="col-span-3 row-span-2">
          <StreamCard 
            stream={stream} 
            size="small" 
            index={index + 3}
          />
        </div>
      ))}
    </div>
  )
}

export default function ResponsiveBentoDemo({ 
  demoStreams, 
  isMobile = false 
}: ResponsiveBentoDemoProps) {
  const [streams, setStreams] = useState(mockStreams)
  const [isLoading, setIsLoading] = useState(true)
  
  // Use provided streams or fallback to mock data
  useEffect(() => {
    if (demoStreams && demoStreams.length > 0) {
      const enhancedStreams = demoStreams.map((stream, index) => ({
        ...stream,
        ...mockStreams[index % mockStreams.length],
        channelName: stream.channelName,
        viewerCount: stream.viewerCount
      }))
      setStreams(enhancedStreams)
    }
    setIsLoading(false)
  }, [demoStreams])
  
  if (isLoading) {
    return (
      <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }
  
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        isMobile ? "aspect-[4/5]" : "aspect-video"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full">
        {isMobile ? (
          <MobileBentoGrid streams={streams} />
        ) : (
          <DesktopBentoGrid streams={streams} />
        )}
      </div>
      
      {/* Floating UI elements */}
      <motion.div
        className="absolute top-4 right-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="font-semibold">Live Sync</span>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-4 left-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="font-semibold">Unified Chat</span>
        </div>
      </motion.div>
      
      {/* Performance indicator */}
      <motion.div
        className="absolute top-4 left-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl px-3 py-2 shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-600 dark:text-green-400">60 FPS</span>
        </div>
      </motion.div>
    </motion.div>
  )
}