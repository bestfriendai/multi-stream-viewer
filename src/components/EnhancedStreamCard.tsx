'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  VolumeX, 
  X, 
  Maximize2, 
  Users, 
  Play,
  Pause,
  MoreVertical,
  ExternalLink,
  Bookmark,
  Share2
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { StreamError } from '@/components/ui/error-boundary'
import type { Stream } from '@/types/stream'

interface EnhancedStreamCardProps {
  stream: Stream
  isLoading?: boolean
  error?: string
  isPrimary?: boolean
  onToggleMute: () => void
  onRemove: () => void
  onTogglePrimary: () => void
  onRetry?: () => void
  className?: string
}

export default function EnhancedStreamCard({
  stream,
  isLoading = false,
  error,
  isPrimary = false,
  onToggleMute,
  onRemove,
  onTogglePrimary,
  onRetry,
  className
}: EnhancedStreamCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Watch ${stream.channelName} on ${stream.platform}`,
        url: window.location.href
      })
    }
  }, [stream.channelName, stream.platform])

  const handleOpenExternal = useCallback(() => {
    let url = ''
    if (stream.platform === 'twitch') {
      url = `https://twitch.tv/${stream.channelName}`
    } else if (stream.platform === 'youtube') {
      url = `https://youtube.com/watch?v=${stream.channelId}`
    }
    if (url) window.open(url, '_blank')
  }, [stream.platform, stream.channelName, stream.channelId])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitch': return 'bg-purple-600'
      case 'youtube': return 'bg-red-600'
      case 'rumble': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  if (error) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-0 h-full">
          <StreamError
            streamName={stream.channelName}
            platform={stream.platform}
            {...(onRetry && { onRetry })}
            onRemove={onRemove}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          'relative overflow-hidden group transition-all duration-200 hover:shadow-lg',
          isPrimary && 'ring-2 ring-primary ring-offset-2',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setShowControls(!showControls)}
      >
        <CardContent className="p-0 h-full relative bg-black">
          {/* Platform Badge */}
          <div className="absolute top-2 left-2 z-20">
            <Badge 
              variant="secondary" 
              className={cn(
                'text-white border-0 text-xs font-medium',
                getPlatformColor(stream.platform)
              )}
            >
              {stream.platform.toUpperCase()}
            </Badge>
          </div>

          {/* Primary Stream Indicator */}
          {isPrimary && (
            <div className="absolute top-2 right-2 z-20">
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                PRIMARY
              </Badge>
            </div>
          )}

          {/* Stream Controls */}
          <div 
            className={cn(
              'absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/60',
              'flex flex-col justify-between p-3 transition-opacity duration-200',
              isHovered || showControls ? 'opacity-100' : 'opacity-0 md:opacity-0',
              'pointer-events-none',
              (isHovered || showControls) && 'pointer-events-auto'
            )}
          >
            {/* Top Controls */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm font-medium truncate max-w-[120px]">
                  {stream.channelName}
                </h3>
                {stream.isActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-xs">LIVE</span>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOpenExternal}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in {stream.platform}
                  </DropdownMenuItem>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Stream
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onTogglePrimary}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    {isPrimary ? 'Remove Primary' : 'Set Primary'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onRemove} className="text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    Remove Stream
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                {/* Viewer count would come from external API data */}
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleMute}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      aria-label={stream.muted ? 'Unmute' : 'Mute'}
                    >
                      {stream.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {stream.muted ? 'Unmute' : 'Mute'}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onTogglePrimary}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      aria-label="Toggle primary stream"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPrimary ? 'Remove Primary' : 'Set as Primary'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mb-3" />
                <p className="text-white text-sm">Loading {stream.channelName}...</p>
              </div>
            </div>
          )}

          {/* Stream Embed Container */}
          <div className="w-full h-full min-h-[200px] bg-gray-900 flex items-center justify-center">
            {!isLoading && !error && (
              <div className="w-full h-full">
                {/* This would contain the actual stream embed */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Stream content will load here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}