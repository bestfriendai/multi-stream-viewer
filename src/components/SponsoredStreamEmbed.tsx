'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { Volume2, VolumeX, Twitch, Star, ExternalLink } from 'lucide-react'
import { useSingleChannelStatus } from '@/hooks/useTwitchStatus'
import { useStreamStore } from '@/store/streamStore'
import LiveIndicator from './LiveIndicator'
import { haptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'
import { useMuteState, muteManager } from '@/lib/muteManager'

interface SponsoredStreamEmbedProps {
  stream: {
    id: string
    channelName: string
    platform: 'twitch' | 'youtube' | 'rumble'
    channelId?: string
    muted?: boolean
  }
  className?: string
}

declare global {
  interface Window {
    Twitch: any
  }
}

const SponsoredStreamEmbed = memo(function SponsoredStreamEmbed({ stream, className }: SponsoredStreamEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  
  // Use new mute system
  const [streamMuted, toggleMute] = useMuteState(stream.id)
  
  // Stable mobile detection function - no state needed
  const isMobileDevice = () => window.innerWidth < 768
  
  // Get live status for Twitch streams
  const { status: twitchStatus } = useSingleChannelStatus(
    stream.platform === 'twitch' ? stream.channelName : '',
    { enabled: stream.platform === 'twitch' }
  )
  
  useEffect(() => {
    if (!embedRef.current) return
    
    // Clear previous content
    embedRef.current.innerHTML = ''
    
    if (stream.platform === 'twitch') {
      // Load Twitch embed script
      const script = document.createElement('script')
      script.src = 'https://embed.twitch.tv/embed/v1.js'
      script.async = true
      
      script.onload = () => {
        if (window.Twitch && embedRef.current) {
          const isMobile = isMobileDevice()
          const embed = new window.Twitch.Embed(embedRef.current, {
            width: '100%',
            height: '100%',
            channel: stream.channelName,
            parent: [window.location.hostname, 'localhost', 'streamyyy.com', 'ampsummer.com'],
            autoplay: true, // Autoplay sponsored content
            muted: true, // Always start muted, mute manager will control state
            layout: 'video',
            theme: 'dark',
            allowfullscreen: true,
            controls: false, // Disable native controls, use custom UI
            // Mobile-specific optimizations
            ...(isMobile && {
              quality: 'auto'
            })
          })
          
          // Additional mobile iframe styling after embed creation
          setTimeout(() => {
            if (embedRef.current && isMobile) {
              const iframe = embedRef.current.querySelector('iframe')
              if (iframe) {
                iframe.style.objectFit = 'cover'
                iframe.style.objectPosition = 'center'
              }
            }
          }, 100)
          
          embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
            playerRef.current = embed.getPlayer()
            // Register player with muteManager
            muteManager.registerPlayer(stream.id, playerRef.current, 'twitch')
          })
        }
      }
      
      document.body.appendChild(script)
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    } else if (stream.platform === 'youtube') {
      // YouTube embed
      const iframe = document.createElement('iframe')
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.style.position = 'absolute'
      iframe.style.top = '0'
      iframe.style.left = '0'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.src = `https://www.youtube.com/embed/${stream.channelId}?autoplay=1&mute=1&enablejsapi=1&modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}`
      iframe.setAttribute('frameborder', '0')
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.setAttribute('allowfullscreen', 'true')
      
      iframe.onload = () => {
        // Register YouTube iframe with muteManager
        setTimeout(() => {
          if (iframe.contentWindow) {
            muteManager.registerPlayer(stream.id, iframe, 'youtube')
          }
        }, 1000)
      }
      
      embedRef.current.appendChild(iframe)
    }
    
    return () => {
      if (embedRef.current) {
        embedRef.current.innerHTML = ''
      }
      // Cleanup muteManager on unmount
      muteManager.unregisterPlayer(stream.id)
    }
  }, [stream.channelName, stream.channelId, stream.platform])
  
  // mute state changes are now handled by muteManager internally
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMute()
  }
  
  const handleVisitChannel = () => {
    let url = ''
    if (stream.platform === 'twitch') {
      url = `https://www.twitch.tv/${stream.channelName}`
    } else if (stream.platform === 'youtube') {
      url = `https://www.youtube.com/channel/${stream.channelId}`
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }
  
  const getPlatformIcon = () => {
    switch (stream.platform) {
      case 'twitch':
        return <Twitch size={12} />
      case 'youtube':
        return <span className="text-xs font-bold">YT</span>
      case 'rumble':
        return <span className="text-xs font-bold">R</span>
      default:
        return null
    }
  }
  
  return (
    <div className={cn(
      "relative w-full h-full group rounded-2xl overflow-hidden bg-black transform-gpu",
      "border-2 border-yellow-400/60 shadow-lg shadow-yellow-400/20",
      className
    )}>
      {/* Sponsored Stream Badge */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
        <Star size={12} className="fill-current" />
        <span>SPONSORED</span>
      </div>
      
      {/* Properly sized embed container */}
      <div className={cn(
        "w-full h-full rounded-2xl overflow-hidden relative stream-embed-container",
        isMobileDevice() ? "aspect-video" : ""
      )}>
        <div 
          ref={embedRef} 
          className={cn(
            "w-full h-full",
            isMobileDevice() && "absolute inset-0"
          )} 
        />
      </div>
      
      {/* Stream Controls with sponsored styling */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-8">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/20">
              <div className="text-white/90">{getPlatformIcon()}</div>
              <span className="text-white text-xs sm:text-sm font-medium tracking-tight truncate max-w-[100px] sm:max-w-none">{stream.channelName}</span>
            </div>
            {stream.platform === 'twitch' && twitchStatus?.isLive && (
              <LiveIndicator 
                isLive={true} 
                viewerCount={twitchStatus.viewerCount}
                size="sm"
              />
            )}
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={(e) => {
                handleMuteToggle(e)
                haptic.light()
              }}
              className={cn(
                "p-2.5 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg border transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]",
                streamMuted
                  ? "from-red-500/30 to-red-600/30 border-red-400/40 hover:from-red-500/40 hover:to-red-600/40 text-red-100"
                  : "from-blue-500/30 to-blue-600/30 border-blue-400/40 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-100"
              )}
              title={streamMuted ? 'Unmute sponsored stream' : 'Mute sponsored stream'}
            >
              {streamMuted ? <VolumeX size={16} className="sm:w-5 sm:h-5" /> : <Volume2 size={16} className="sm:w-5 sm:h-5" />}
            </button>
            
            <button
              onClick={handleVisitChannel}
              className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-400/40 hover:from-yellow-500/40 hover:to-orange-500/40 text-yellow-100 shadow-lg transition-all duration-200 transform active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]"
              title="Visit channel"
            >
              <ExternalLink size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stream Info Overlay */}
      {stream.platform === 'twitch' && twitchStatus?.isLive && twitchStatus.gameName && (
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-yellow-300 text-xs font-medium">
              <Star size={12} className="fill-current" />
              <span>Sponsored Stream</span>
            </div>
            <p className="text-white text-xs sm:text-sm font-medium truncate">
              {twitchStatus.title}
            </p>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="truncate">Playing {twitchStatus.gameName}</span>
              {twitchStatus.viewerCount > 0 && (
                <>
                  <span>•</span>
                  <span>{twitchStatus.viewerCount.toLocaleString()} viewers</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders (exclude muted from stream)
  return (
    prevProps.stream.id === nextProps.stream.id &&
    prevProps.stream.channelName === nextProps.stream.channelName &&
    prevProps.stream.platform === nextProps.stream.platform &&
    prevProps.stream.channelId === nextProps.stream.channelId &&
    prevProps.className === nextProps.className
  )
})

SponsoredStreamEmbed.displayName = 'SponsoredStreamEmbed'

export default SponsoredStreamEmbed