'use client'

import { event as trackEvent } from '@/components/GoogleAnalytics'

export const useAnalytics = () => {
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

  const trackLayoutChange = (layout: string) => {
    trackEvent({
      action: 'layout_changed',
      category: 'User Interface',
      label: layout,
    })
  }

  const trackPageView = (pageName: string) => {
    trackEvent({
      action: 'page_view',
      category: 'Navigation',
      label: pageName,
    })
  }

  const trackChatToggle = (isOpen: boolean) => {
    trackEvent({
      action: 'chat_toggle',
      category: 'User Interface',
      label: isOpen ? 'opened' : 'closed',
    })
  }

  const trackAMPSummerView = () => {
    trackEvent({
      action: 'amp_summer_viewed',
      category: 'Special Pages',
      label: 'AMP Summer 2025',
    })
  }

  return {
    trackStreamAdded,
    trackStreamRemoved,
    trackLayoutChange,
    trackPageView,
    trackChatToggle,
    trackAMPSummerView,
  }
}