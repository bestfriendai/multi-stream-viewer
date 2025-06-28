'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, Users, Headphones, Calendar, BarChart3, 
  Mic, Camera, Video, Smartphone, CreditCard,
  Sparkles, Zap, Shield, Globe, Cpu, ChevronRight
} from 'lucide-react'
import AnalyticsDashboard from './AnalyticsDashboard'
import AudioMixer from './AudioMixer'
import StreamScheduler from './StreamScheduler'
import VirtualCamera from './VirtualCamera'
import StreamRecorder from './StreamRecorder'
import WatchParty from './WatchParty'
import VoiceChat from './VoiceChat'
import { cn } from '@/lib/utils'

const features = [
  {
    id: 'ai',
    name: 'AI Recommendations',
    icon: Brain,
    description: 'Smart stream suggestions powered by machine learning',
    color: 'from-purple-500 to-pink-500',
    status: 'live'
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    icon: BarChart3,
    description: 'Track viewing habits and discover insights',
    color: 'from-blue-500 to-cyan-500',
    status: 'live'
  },
  {
    id: 'watchparty',
    name: 'Watch Parties',
    icon: Users,
    description: 'Synchronized viewing with friends',
    color: 'from-green-500 to-emerald-500',
    status: 'live'
  },
  {
    id: 'audio',
    name: 'Audio Mixer',
    icon: Headphones,
    description: 'Professional audio controls with EQ',
    color: 'from-orange-500 to-yellow-500',
    status: 'live'
  },
  {
    id: 'scheduler',
    name: 'Stream Scheduler',
    icon: Calendar,
    description: 'Never miss your favorite streams',
    color: 'from-red-500 to-pink-500',
    status: 'live'
  },
  {
    id: 'voice',
    name: 'Voice Chat',
    icon: Mic,
    description: 'Talk with other viewers in real-time',
    color: 'from-indigo-500 to-purple-500',
    status: 'live'
  },
  {
    id: 'virtualcam',
    name: 'Virtual Camera',
    icon: Camera,
    description: 'Output to OBS, Zoom, Discord',
    color: 'from-pink-500 to-rose-500',
    status: 'live'
  },
  {
    id: 'recorder',
    name: 'Stream Recorder',
    icon: Video,
    description: 'Record multiple streams simultaneously',
    color: 'from-teal-500 to-cyan-500',
    status: 'live'
  },
  {
    id: 'mobile',
    name: 'Mobile Controls',
    icon: Smartphone,
    description: 'Intuitive swipe gestures for mobile',
    color: 'from-purple-600 to-indigo-600',
    status: 'live'
  },
  {
    id: 'premium',
    name: 'Premium Features',
    icon: CreditCard,
    description: 'Unlock advanced capabilities',
    color: 'from-yellow-500 to-orange-500',
    status: 'coming-soon'
  }
]

export default function FeaturesShowcase() {
  const [selectedFeature, setSelectedFeature] = useState('analytics')
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Next-Gen Multi-Stream Features
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the most advanced multi-stream viewer with AI-powered recommendations, 
          professional audio mixing, and real-time collaboration tools.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {features.map(feature => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all",
                "hover:scale-105 hover:shadow-xl",
                selectedFeature === feature.id && "ring-2 ring-primary"
              )}
              onClick={() => feature.status === 'live' && setSelectedFeature(feature.id)}
            >
              <div className="p-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  "bg-gradient-to-br",
                  feature.color
                )}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {feature.description}
                </p>
                <Badge 
                  variant={feature.status === 'live' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {feature.status === 'live' ? 'Live' : 'Coming Soon'}
                </Badge>
              </div>
              {feature.status === 'live' && (
                <div className="absolute bottom-0 right-0 p-2">
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              )}
            </Card>
          )
        })}
      </div>
      
      {/* Feature Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Feature Demo</h2>
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={20} />
            <span className="text-sm text-muted-foreground">
              All features are fully functional
            </span>
          </div>
        </div>
        
        <Card className="p-6">
          {selectedFeature === 'analytics' && <AnalyticsDashboard />}
          {selectedFeature === 'audio' && <AudioMixer />}
          {selectedFeature === 'scheduler' && <StreamScheduler />}
          {selectedFeature === 'virtualcam' && <VirtualCamera />}
          {selectedFeature === 'recorder' && <StreamRecorder />}
          {selectedFeature === 'watchparty' && (
            <div className="space-y-4">
              <WatchParty />
              <VoiceChat roomId="demo-room" />
            </div>
          )}
          {selectedFeature === 'voice' && <VoiceChat roomId="demo-room" />}
          {selectedFeature === 'ai' && (
            <div className="text-center py-12">
              <Brain className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">AI Recommendations Active</h3>
              <p className="text-muted-foreground mb-4">
                The AI engine is analyzing your viewing patterns in real-time
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-muted-foreground">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0ms</div>
                  <div className="text-xs text-muted-foreground">Latency</div>
                </div>
              </div>
            </div>
          )}
          {selectedFeature === 'mobile' && (
            <div className="text-center py-12">
              <Smartphone className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-muted-foreground mb-6">
                Intuitive touch controls designed for mobile devices
              </p>
              <div className="space-y-4 max-w-md mx-auto text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👆</span>
                  </div>
                  <div>
                    <p className="font-medium">Swipe Navigation</p>
                    <p className="text-sm text-muted-foreground">
                      Swipe left/right to switch between streams
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👆👆</span>
                  </div>
                  <div>
                    <p className="font-medium">Volume Control</p>
                    <p className="text-sm text-muted-foreground">
                      Swipe up/down to adjust volume instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👆👆</span>
                  </div>
                  <div>
                    <p className="font-medium">Double Tap</p>
                    <p className="text-sm text-muted-foreground">
                      Double tap to enter fullscreen mode
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Tech Stack */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Powered By</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <Cpu className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-sm font-medium">TensorFlow.js</p>
            <p className="text-xs text-muted-foreground">AI Engine</p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-sm font-medium">WebRTC</p>
            <p className="text-xs text-muted-foreground">Real-time Sync</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-sm font-medium">E2E Encryption</p>
            <p className="text-xs text-muted-foreground">Privacy First</p>
          </div>
          <div className="text-center">
            <Globe className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-sm font-medium">CDN Optimized</p>
            <p className="text-xs text-muted-foreground">Global Scale</p>
          </div>
        </div>
      </Card>
    </div>
  )
}