'use client'

import { event as trackEvent } from '@/components/GoogleAnalytics'

export const useAnalytics = () => {
  // Stream Management Events
  const trackStreamAdded = (channelName: string, platform: string) => {
    trackEvent({
      action: 'stream_added',
      category: 'Stream Management',
      label: `${platform}:${channelName}`,
    })
  }

  const trackStreamRemoved = (channelName: string, platform: string) => {
    trackEvent({
      action: 'stream_removed',
      category: 'Stream Management',
      label: `${platform}:${channelName}`,
    })
  }

  const trackStreamClicked = (channelName: string, platform: string) => {
    trackEvent({
      action: 'stream_clicked',
      category: 'Stream Interaction',
      label: `${platform}:${channelName}`,
    })
  }

  const trackStreamFullscreen = (channelName: string, platform: string) => {
    trackEvent({
      action: 'stream_fullscreen',
      category: 'Stream Interaction',
      label: `${platform}:${channelName}`,
    })
  }

  const trackStreamMute = (channelName: string, platform: string, isMuted: boolean) => {
    trackEvent({
      action: 'stream_mute',
      category: 'Stream Interaction',
      label: `${platform}:${channelName}:${isMuted ? 'muted' : 'unmuted'}`,
    })
  }

  const trackStreamQualityChange = (channelName: string, platform: string, quality: string) => {
    trackEvent({
      action: 'stream_quality_changed',
      category: 'Stream Interaction',
      label: `${platform}:${channelName}:${quality}`,
    })
  }

  // Layout and UI Events
  const trackLayoutChange = (layout: string, streamCount: number) => {
    trackEvent({
      action: 'layout_changed',
      category: 'User Interface',
      label: layout,
      value: streamCount,
    })
  }

  const trackGridResize = (newSize: string) => {
    trackEvent({
      action: 'grid_resized',
      category: 'User Interface',
      label: newSize,
    })
  }

  const trackThemeChange = (theme: string) => {
    trackEvent({
      action: 'theme_changed',
      category: 'User Interface',
      label: theme,
    })
  }

  // Navigation Events
  const trackPageView = (pageName: string) => {
    trackEvent({
      action: 'page_view',
      category: 'Navigation',
      label: pageName,
    })
  }

  const trackMenuItemClick = (menuItem: string) => {
    trackEvent({
      action: 'menu_click',
      category: 'Navigation',
      label: menuItem,
    })
  }

  const trackExternalLinkClick = (url: string, source: string) => {
    trackEvent({
      action: 'external_link_click',
      category: 'Navigation',
      label: `${source}:${url}`,
    })
  }

  // Chat Events
  const trackChatToggle = (isOpen: boolean) => {
    trackEvent({
      action: 'chat_toggle',
      category: 'Chat Interaction',
      label: isOpen ? 'opened' : 'closed',
    })
  }

  const trackChatStreamSelect = (channelName: string, platform: string) => {
    trackEvent({
      action: 'chat_stream_selected',
      category: 'Chat Interaction',
      label: `${platform}:${channelName}`,
    })
  }

  const trackChatMessageSent = (platform: string) => {
    trackEvent({
      action: 'chat_message_sent',
      category: 'Chat Interaction',
      label: platform,
    })
  }

  // Search and Discovery Events
  const trackStreamSearch = (searchTerm: string, platform: string) => {
    trackEvent({
      action: 'stream_searched',
      category: 'Search',
      label: `${platform}:${searchTerm}`,
    })
  }

  const trackPopularStreamClick = (channelName: string, platform: string) => {
    trackEvent({
      action: 'popular_stream_clicked',
      category: 'Discovery',
      label: `${platform}:${channelName}`,
    })
  }

  const trackCategoryBrowse = (category: string, platform: string) => {
    trackEvent({
      action: 'category_browsed',
      category: 'Discovery',
      label: `${platform}:${category}`,
    })
  }

  // Error and Performance Events
  const trackStreamError = (channelName: string, platform: string, errorType: string) => {
    trackEvent({
      action: 'stream_error',
      category: 'Errors',
      label: `${platform}:${channelName}:${errorType}`,
    })
  }

  const trackLoadTime = (pageName: string, loadTime: number) => {
    trackEvent({
      action: 'page_load_time',
      category: 'Performance',
      label: pageName,
      value: Math.round(loadTime),
    })
  }

  const trackStreamLoadTime = (channelName: string, platform: string, loadTime: number) => {
    trackEvent({
      action: 'stream_load_time',
      category: 'Performance',
      label: `${platform}:${channelName}`,
      value: Math.round(loadTime),
    })
  }

  // Special Page Events
  const trackAMPSummerView = () => {
    trackEvent({
      action: 'amp_summer_viewed',
      category: 'Special Pages',
      label: 'AMP Summer 2025',
    })
  }

  const trackAMPStreamerClick = (streamerName: string) => {
    trackEvent({
      action: 'amp_streamer_clicked',
      category: 'AMP Summer',
      label: streamerName,
    })
  }

  // User Engagement Events
  const trackSessionDuration = (duration: number) => {
    trackEvent({
      action: 'session_duration',
      category: 'Engagement',
      label: 'minutes',
      value: Math.round(duration / 60000), // Convert to minutes
    })
  }

  const trackMultiStreamUsage = (streamCount: number, duration: number) => {
    trackEvent({
      action: 'multi_stream_usage',
      category: 'Engagement',
      label: `${streamCount}_streams`,
      value: Math.round(duration / 60000), // Duration in minutes
    })
  }

  const trackFeatureUsage = (featureName: string) => {
    trackEvent({
      action: 'feature_used',
      category: 'Features',
      label: featureName,
    })
  }

  // Social and Sharing Events
  const trackSocialShare = (platform: string, content: string) => {
    trackEvent({
      action: 'social_share',
      category: 'Social',
      label: `${platform}:${content}`,
    })
  }

  const trackStreamShare = (channelName: string, platform: string, shareMethod: string) => {
    trackEvent({
      action: 'stream_shared',
      category: 'Social',
      label: `${platform}:${channelName}:${shareMethod}`,
    })
  }

  // Mobile Events
  const trackMobileGesture = (gesture: string, target: string) => {
    trackEvent({
      action: 'mobile_gesture',
      category: 'Mobile Interaction',
      label: `${gesture}:${target}`,
    })
  }

  const trackMobileOrientation = (orientation: string) => {
    trackEvent({
      action: 'mobile_orientation',
      category: 'Mobile Interaction',
      label: orientation,
    })
  }

  // Conversion Events
  const trackUserRetention = (visitNumber: number) => {
    trackEvent({
      action: 'user_retention',
      category: 'Conversion',
      label: `visit_${visitNumber}`,
      value: visitNumber,
    })
  }

  const trackBookmarkAdd = (pageName: string) => {
    trackEvent({
      action: 'bookmark_added',
      category: 'Conversion',
      label: pageName,
    })
  }

  const trackPWAInstall = () => {
    trackEvent({
      action: 'pwa_installed',
      category: 'Conversion',
      label: 'app_install',
    })
  }

  return {
    // Stream Management
    trackStreamAdded,
    trackStreamRemoved,
    trackStreamClicked,
    trackStreamFullscreen,
    trackStreamMute,
    trackStreamQualityChange,
    
    // Layout and UI
    trackLayoutChange,
    trackGridResize,
    trackThemeChange,
    
    // Navigation
    trackPageView,
    trackMenuItemClick,
    trackExternalLinkClick,
    
    // Chat
    trackChatToggle,
    trackChatStreamSelect,
    trackChatMessageSent,
    
    // Search and Discovery
    trackStreamSearch,
    trackPopularStreamClick,
    trackCategoryBrowse,
    
    // Errors and Performance
    trackStreamError,
    trackLoadTime,
    trackStreamLoadTime,
    
    // Special Pages
    trackAMPSummerView,
    trackAMPStreamerClick,
    
    // Engagement
    trackSessionDuration,
    trackMultiStreamUsage,
    trackFeatureUsage,
    
    // Social
    trackSocialShare,
    trackStreamShare,
    
    // Mobile
    trackMobileGesture,
    trackMobileOrientation,
    
    // Conversion
    trackUserRetention,
    trackBookmarkAdd,
    trackPWAInstall,
  }
}