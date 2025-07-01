'use client'

import { useState, useEffect } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  MoreVertical,
  X,
  Share2,
  ExternalLink,
  Bookmark
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import StreamEmbedOptimized from './StreamEmbedOptimized'

interface MobileStreamViewerProps {
  show: boolean
  onClose: () => void
}

export default function MobileStreamViewer({ show, onClose }: MobileStreamViewerProps) {
  const { streams } = useStreamStore()
  const { trackMobileGesture, trackStreamClicked, trackStreamFullscreen } = useAnalytics()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activeStreams = streams.filter(stream => stream.isActive)

  useEffect(() => {
    if (show && activeStreams.length > 0) {
      trackMobileGesture('swipe', 'stream_viewer_opened')
    }
  }, [show, activeStreams.length, trackMobileGesture])

  const currentStream = activeStreams[currentIndex]

  const goToNext = () => {
    if (currentIndex < activeStreams.length - 1) {
      setCurrentIndex(currentIndex + 1)
      trackMobileGesture('swipe', 'next_stream')
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      trackMobileGesture('swipe', 'previous_stream')
    }
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
      trackStreamFullscreen(currentStream?.channelName || '', currentStream?.platform || '')
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleStreamClick = () => {
    if (currentStream) {
      trackStreamClicked(currentStream.channelName, currentStream.platform)
    }
  }

  const shareStream = () => {
    if (currentStream && typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title: `Watch ${currentStream.channelName} on ${currentStream.platform}`,
        url: window.location.href
      })
    }
  }

  if (!show || activeStreams.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black z-50 md:hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              {currentIndex + 1} of {activeStreams.length}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                <DropdownMenuItem onClick={toggleFullscreen} className="text-white">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </DropdownMenuItem>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <DropdownMenuItem onClick={shareStream} className="text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Stream
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-white">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Stream
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {currentStream && (
          <div className="mt-2">
            <h2 className="text-white font-semibold text-lg">
              {currentStream.channelName}
            </h2>
            <p className="text-white/70 text-sm capitalize">
              {currentStream.platform}
            </p>
          </div>
        )}
      </div>

      {/* Main Stream Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentStream && (
          <div 
            className="w-full h-full"
            onClick={handleStreamClick}
          >
            <StreamEmbedOptimized 
              stream={currentStream}
            />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={cn(
              "text-white hover:bg-white/20 w-16 h-16 rounded-full",
              currentIndex === 0 && "opacity-30"
            )}
          >
            <ChevronLeft size={24} />
          </Button>

          {/* Stream Indicators */}
          <div className="flex items-center gap-2">
            {activeStreams.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={goToNext}
            disabled={currentIndex === activeStreams.length - 1}
            className={cn(
              "text-white hover:bg-white/20 w-16 h-16 rounded-full",
              currentIndex === activeStreams.length - 1 && "opacity-30"
            )}
          >
            <ChevronRight size={24} />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            <Maximize2 size={20} />
          </Button>
        </div>
      </div>

      {/* Swipe Gesture Indicators */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-50">
        {currentIndex > 0 && (
          <div className="text-white/60 text-xs">
            ← Swipe for previous
          </div>
        )}
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-50">
        {currentIndex < activeStreams.length - 1 && (
          <div className="text-white/60 text-xs">
            Swipe for next →
          </div>
        )}
      </div>
    </div>
  )
}