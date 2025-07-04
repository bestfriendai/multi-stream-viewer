import { Monitor, Users, MessageSquare, Grid3x3, Smartphone, Zap } from 'lucide-react'

export const features = [
  {
    title: "Multi-Stream Viewing",
    description: "Watch up to 16 streams simultaneously in customizable grid layouts. Perfect for esports tournaments, content creation, and keeping up with multiple streamers.",
    icon: Grid3x3,
    image: "/api/placeholder/600/400"
  },
  {
    title: "All Platform Support",
    description: "Seamlessly integrate streams from Twitch, YouTube Live, and Kick. No need to switch between platforms - everything in one place.",
    icon: Monitor,
    image: "/api/placeholder/600/400"
  },
  {
    title: "Unified Chat Experience",
    description: "View and interact with chat from all your streams in one unified interface. Never miss important messages from your community.",
    icon: MessageSquare,
    image: "/api/placeholder/600/400"
  },
  {
    title: "Smart Layouts",
    description: "AI-powered layout suggestions based on content type. Automatically optimize your viewing experience for different stream categories.",
    icon: Zap,
    image: "/api/placeholder/600/400"
  },
  {
    title: "Mobile Responsive",
    description: "Full mobile support with touch gestures, swipe controls, and optimized layouts for phones and tablets.",
    icon: Smartphone,
    image: "/api/placeholder/600/400"
  },
  {
    title: "Zero Setup Required",
    description: "Start watching immediately - no downloads, no registration required for basic features. Just paste stream URLs and go.",
    icon: Users,
    image: "/api/placeholder/600/400"
  }
]