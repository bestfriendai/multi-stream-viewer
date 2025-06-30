'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface AvatarImageProps {
  src?: string
  name: string
  size?: number
  className?: string
  platform?: 'twitch' | 'youtube' | 'rumble' | 'custom'
}

export default function AvatarImage({
  src,
  name,
  size = 40,
  className,
  platform = 'custom'
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false)

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



  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
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
      src={src}
      alt={`${name} avatar`}
      className={cn("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  )
}
