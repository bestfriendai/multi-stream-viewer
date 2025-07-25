'use client'

import { useState, useEffect, useRef } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { 
  ChevronLeft, ChevronRight, Volume2, VolumeX, 
  MessageSquare, Maximize2, Grid
} from 'lucide-react'
import { muteManager } from '@/lib/muteManager'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SwipeGesture {
  startX: number
  startY: number
  currentX: number
  currentY: number
  startTime: number
  velocityX: number
  velocityY: number
  lastX: number
  lastY: number
  lastTime: number
}

interface MobileSwipeControlsProps {
  onClose?: () => void
}

export default function MobileSwipeControls({ onClose }: MobileSwipeControlsProps) {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [, setIsFullscreen] = useState(false)
  const [swipeGesture, setSwipeGesture] = useState<SwipeGesture | null>(null)
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(100)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<number | null>(null)
  
  const { streams, setStreamVolume, toggleStreamMute } = useStreamStore()
  
  const activeStreams = streams.filter(s => s.isActive)
  const currentStream = activeStreams[currentStreamIndex]
  
  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControls) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls])
  
  useEffect(() => {
    // Update volume when stream changes
    if (currentStream) {
      setCurrentVolume(currentStream.volume)
    }
  }, [currentStream])
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    
    setSwipeGesture({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime: Date.now(),
      velocityX: 0,
      velocityY: 0,
      lastX: touch.clientX,
      lastY: touch.clientY,
      lastTime: Date.now()
    })
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeGesture) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    const currentTime = Date.now()
    const deltaTime = currentTime - swipeGesture.lastTime
    
    // Calculate velocity for momentum scrolling
    const velocityX = deltaTime > 0 ? (touch.clientX - swipeGesture.lastX) / deltaTime : 0
    const velocityY = deltaTime > 0 ? (touch.clientY - swipeGesture.lastY) / deltaTime : 0
    
    setSwipeGesture({
      ...swipeGesture,
      currentX: touch.clientX,
      currentY: touch.clientY,
      velocityX,
      velocityY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      lastTime: currentTime
    })
    
    // Handle vertical swipe for volume with haptic feedback
    const deltaY = swipeGesture.startY - touch.clientY
    const screenHeight = window.innerHeight
    
    if (Math.abs(deltaY) > 30 && Math.abs(deltaY) > Math.abs(touch.clientX - swipeGesture.startX)) {
      // Show volume slider
      setVolumeSliderVisible(true)
      
      // Calculate new volume with easing
      const volumeChange = (deltaY / screenHeight) * 150
      const newVolume = Math.max(0, Math.min(100, currentVolume + volumeChange))
      
      if (currentStream) {
        setStreamVolume(currentStream.id, newVolume)
        setCurrentVolume(newVolume)
        
        // Haptic feedback at volume limits
        if ((newVolume === 0 || newVolume === 100) && 'vibrate' in navigator) {
          navigator.vibrate(10)
        }
      }
    }
  }
  
  const handleTouchEnd = () => {
    if (!swipeGesture) return
    
    const deltaX = swipeGesture.currentX - swipeGesture.startX
    const deltaY = swipeGesture.currentY - swipeGesture.startY
    const deltaTime = Date.now() - swipeGesture.startTime
    
    // Hide volume slider after gesture
    setTimeout(() => setVolumeSliderVisible(false), 1000)
    
    // Quick tap - show/hide controls
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      setShowControls(!showControls)
      return
    }
    
    // Horizontal swipe with velocity detection
    const minSwipeDistance = 50
    const minVelocity = 0.3
    
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
      const shouldSwipe = Math.abs(swipeGesture.velocityX) > minVelocity || Math.abs(deltaX) > window.innerWidth * 0.3
      
      if (shouldSwipe && deltaX > 0 && currentStreamIndex > 0) {
        // Swipe right - previous stream
        setCurrentStreamIndex(currentStreamIndex - 1)
        toast.info(`Switched to ${activeStreams[currentStreamIndex - 1]?.channelName || 'stream'}`)
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(20)
        }
      } else if (shouldSwipe && deltaX < 0 && currentStreamIndex < activeStreams.length - 1) {
        // Swipe left - next stream
        setCurrentStreamIndex(currentStreamIndex + 1)
        toast.info(`Switched to ${activeStreams[currentStreamIndex + 1]?.channelName || 'stream'}`)
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(20)
        }
      }
    }
    
    // Double tap detection
    const lastTap = (window as Window & { lastTap?: number }).lastTap || 0
    const currentTime = Date.now()
    const tapLength = currentTime - lastTap
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap - toggle fullscreen
      toggleFullscreen()
    }
    
    (window as Window & { lastTap?: number }).lastTap = currentTime
    
    setSwipeGesture(null)
  }
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  const navigateStream = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStreamIndex > 0) {
      setCurrentStreamIndex(currentStreamIndex - 1)
    } else if (direction === 'next' && currentStreamIndex < activeStreams.length - 1) {
      setCurrentStreamIndex(currentStreamIndex + 1)
    }
  }
  
  if (activeStreams.length === 0) {
    return null
  }
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black lg:hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stream Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Current Stream Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              {currentStream?.channelName}
            </h2>
            <p className="text-white/60">
              {currentStream?.platform} Stream
            </p>
          </div>
        </div>
        
        {/* Volume Indicator */}
        {volumeSliderVisible && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/80 rounded-full p-4">
            <div className="flex flex-col items-center gap-2">
              <Volume2 className="text-white animate-pulse" size={24} />
              <div className="h-40 w-2 bg-white/20 rounded-full relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80 rounded-full transition-all duration-75 ease-out"
                  style={{ 
                    height: `${currentVolume}%`,
                    boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                  }}
                />
              </div>
              <span className="text-white text-sm font-medium">{Math.round(currentVolume)}%</span>
            </div>
          </div>
        )}
        
        {/* Swipe Indicators */}
        {showControls && (
          <>
            {currentStreamIndex > 0 && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <ChevronLeft size={48} />
              </div>
            )}
            {currentStreamIndex < activeStreams.length - 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                <ChevronRight size={48} />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Controls Overlay */}
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                {currentStream?.channelName}
              </span>
              <span className="text-white/60 text-xs">
                {currentStreamIndex + 1} / {activeStreams.length}
              </span>
            </div>
            
            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={() => toast.info('Chat overlay coming soon')}
                className="text-white/80 hover:text-white"
              >
                <MessageSquare size={20} />
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => {
                  if (onClose) {
                    onClose()
                    toast.info('Switched to grid view')
                  }
                }}
                className="text-white/80 hover:text-white"
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center gap-6 pointer-events-auto">
            <button
              onClick={() => navigateStream('prev')}
              disabled={currentStreamIndex === 0}
              className={cn(
                "p-3 rounded-full bg-white/10",
                currentStreamIndex === 0 && "opacity-30"
              )}
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            
            <button
              onClick={() => {
                if (currentStream) {
                  toggleStreamMute(currentStream.id)
                  toast.info(muteManager.getMuteState(currentStream.id) ? 'Unmuted' : 'Muted')
                }
              }}
              className="p-4 rounded-full bg-white/20"
            >
              {currentStream && muteManager.getMuteState(currentStream.id) ? (
                <VolumeX size={28} className="text-white" />
              ) : (
                <Volume2 size={28} className="text-white" />
              )}
            </button>
            
            <button
              onClick={() => navigateStream('next')}
              disabled={currentStreamIndex === activeStreams.length - 1}
              className={cn(
                "p-3 rounded-full bg-white/10",
                currentStreamIndex === activeStreams.length - 1 && "opacity-30"
              )}
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
          
          {/* Stream Dots Indicator */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {activeStreams.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStreamIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all pointer-events-auto",
                  index === currentStreamIndex 
                    ? "bg-white w-6" 
                    : "bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Gesture Hints with animation */}
      {showControls && activeStreams.length === 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white/60 pointer-events-none animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </div>
              <p className="text-sm">Swipe to change streams</p>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm">Swipe up/down to adjust volume</p>
            <p className="text-sm">Double tap to fullscreen</p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @media (max-width: 1024px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
