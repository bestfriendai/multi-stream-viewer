'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getTwitchProfileImage } from '@/lib/twitchApi'

interface TwitchAvatarImageProps {
  username: string
  name: string
  size?: number
  className?: string
  platform?: 'twitch' | 'youtube' | 'rumble' | 'custom'
}

export default function TwitchAvatarImage({
  username,
  name,
  size = 40,
  className,
  platform = 'twitch'
}: TwitchAvatarImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProfileImage = async () => {
      if (platform === 'twitch') {
        try {
          setIsLoading(true)
          console.log(`Loading Twitch profile image for: ${username}`)
          const url = await getTwitchProfileImage(username)
          console.log(`Got Twitch profile image URL: ${url}`)
          if (isMounted) {
            setImageUrl(url)
            setIsLoading(false)
          }
        } catch (error) {
          console.warn(`Failed to load Twitch profile image for ${username}:`, error)
          if (isMounted) {
            setImageError(true)
            setIsLoading(false)
          }
        }
      } else {
        // For non-Twitch platforms, use fallback immediately
        setImageUrl(generateFallbackAvatar(name, platform))
        setIsLoading(false)
      }
    }

    loadProfileImage()

    return () => {
      isMounted = false
    }
  }, [username, name, platform])

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPlatformColor = (platform: string): string => {
    const platformColors = {
      twitch: '#9146ff',
      youtube: '#ff0000',
      rumble: '#85c742',
      custom: '#3b82f6',
    }
    return platformColors[platform as keyof typeof platformColors] || '#3b82f6'
  }

  const generateFallbackAvatar = (name: string, platform: string): string => {
    const bgColor = getPlatformColor(platform).replace('#', '')
    const initials = getInitials(name)
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=${size}&bold=true&format=png`
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse",
          className
        )}
        style={{ width: size, height: size }}
      >
        <div className="w-1/2 h-1/2 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
    )
  }

  // Show fallback if no image URL or error occurred
  if (!imageUrl || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full text-white font-bold",
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: getPlatformColor(platform),
          fontSize: size * 0.4,
        }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={`${name} avatar`}
      className={cn("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  )
}
