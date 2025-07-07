'use client'

import { useState, useEffect, useMemo } from 'react'

interface MobileDetectionState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
}

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export const useMobileDetection = (): MobileDetectionState => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height })
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [])

  const detectionState = useMemo((): MobileDetectionState => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'portrait',
        screenWidth: 0,
        screenHeight: 0,
        isTouchDevice: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false
      }
    }

    const { width, height } = dimensions
    const userAgent = window.navigator.userAgent.toLowerCase()
    
    const isMobile = width < MOBILE_BREAKPOINT
    const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
    const isDesktop = width >= TABLET_BREAKPOINT
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)

    return {
      isMobile,
      isTablet,
      isDesktop,
      orientation,
      screenWidth: width,
      screenHeight: height,
      isTouchDevice,
      isIOS,
      isAndroid,
      isSafari
    }
  }, [dimensions, orientation])

  return detectionState
}