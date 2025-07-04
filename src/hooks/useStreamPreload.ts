import { useEffect } from 'react'

// Preload critical resources for faster stream loading
export function useStreamPreload() {
  useEffect(() => {
    // Preconnect to streaming platforms
    const preconnectDomains = [
      'https://embed.twitch.tv',
      'https://player.twitch.tv', 
      'https://static-cdn.jtvnw.net',
      'https://gql.twitch.tv',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://rumble.com'
    ]

    const links: HTMLLinkElement[] = []

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      links.push(link)
    })

    // Preload Twitch embed script
    const script = document.createElement('link')
    script.rel = 'modulepreload'
    script.href = 'https://embed.twitch.tv/embed/v1.js'
    document.head.appendChild(script)
    links.push(script)

    // DNS prefetch for additional performance
    const dnsPrefetchDomains = [
      'https://irc-ws.chat.twitch.tv',
      'https://gql.twitch.tv',
      'https://api.twitch.tv'
    ]

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
      links.push(link)
    })

    return () => {
      // Cleanup links on unmount
      links.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
    }
  }, [])
}