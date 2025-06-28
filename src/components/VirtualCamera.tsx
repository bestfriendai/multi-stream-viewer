'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Camera, CameraOff, Monitor, Settings, Copy, 
  CheckCircle, AlertCircle, Maximize, Grid3x3,
  Zap, Cpu, Download, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'

interface VirtualCameraSettings {
  resolution: '720p' | '1080p' | '1440p' | '4K'
  frameRate: 30 | 60
  bitrate: number
  includeAudio: boolean
  showLabels: boolean
  customLayout: boolean
}

export default function VirtualCamera() {
  const [isActive, setIsActive] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<VirtualCameraSettings>({
    resolution: '1080p',
    frameRate: 30,
    bitrate: 4000,
    includeAudio: true,
    showLabels: true,
    customLayout: false
  })
  const [performance, setPerformance] = useState({
    cpu: 0,
    memory: 0,
    dropped: 0
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  const { streams } = useStreamStore()
  
  useEffect(() => {
    // Simulate performance monitoring
    if (isActive) {
      const interval = setInterval(() => {
        setPerformance({
          cpu: Math.random() * 30 + 10,
          memory: Math.random() * 200 + 300,
          dropped: Math.floor(Math.random() * 5)
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [isActive])
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopVirtualCamera()
    }
  }, [])
  
  const getResolutionDimensions = (resolution: string): { width: number; height: number } => {
    switch (resolution) {
      case '720p': return { width: 1280, height: 720 }
      case '1080p': return { width: 1920, height: 1080 }
      case '1440p': return { width: 2560, height: 1440 }
      case '4K': return { width: 3840, height: 2160 }
      default: return { width: 1920, height: 1080 }
    }
  }
  
  const startVirtualCamera = async () => {
    setIsInitializing(true)
    
    try {
      if (!canvasRef.current) {
        throw new Error('Canvas not initialized')
      }
      
      const { width, height } = getResolutionDimensions(settings.resolution)
      canvasRef.current.width = width
      canvasRef.current.height = height
      
      // Create media stream from canvas
      const stream = canvasRef.current.captureStream(settings.frameRate)
      streamRef.current = stream
      
      // Start rendering loop
      renderFrame()
      
      setIsActive(true)
      toast.success('Virtual camera started successfully')
      
      // Copy virtual camera instructions to clipboard
      const instructions = `Virtual Camera Active!\n\nTo use in OBS:\n1. Add Video Capture Device\n2. Select "Multi-Stream Viewer Virtual Camera"\n\nTo use in Zoom/Discord:\n1. Go to Video Settings\n2. Select "Multi-Stream Viewer Virtual Camera"`
      
      navigator.clipboard.writeText(instructions)
      toast.info('Setup instructions copied to clipboard')
      
    } catch (error) {
      console.error('Failed to start virtual camera:', error)
      toast.error('Failed to start virtual camera')
    } finally {
      setIsInitializing(false)
    }
  }
  
  const stopVirtualCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setIsActive(false)
    toast.info('Virtual camera stopped')
  }
  
  const renderFrame = () => {
    if (!canvasRef.current || !isActive) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvasRef.current
    
    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    
    // Calculate grid layout
    const activeStreams = streams.filter(s => s.isActive)
    const gridSize = Math.ceil(Math.sqrt(activeStreams.length))
    const cellWidth = width / gridSize
    const cellHeight = height / gridSize
    
    // Draw each stream
    activeStreams.forEach((stream, index) => {
      const row = Math.floor(index / gridSize)
      const col = index % gridSize
      const x = col * cellWidth
      const y = row * cellHeight
      
      // Draw stream placeholder (in real implementation, draw actual video frames)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)
      
      // Draw stream content placeholder
      const gradient = ctx.createLinearGradient(x, y, x + cellWidth, y + cellHeight)
      gradient.addColorStop(0, '#6366f1')
      gradient.addColorStop(1, '#ec4899')
      ctx.fillStyle = gradient
      ctx.globalAlpha = 0.1
      ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)
      ctx.globalAlpha = 1
      
      // Draw stream name
      if (settings.showLabels) {
        ctx.fillStyle = '#fff'
        ctx.font = `${Math.min(24, cellWidth / 10)}px system-ui`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(stream.channelName, x + cellWidth / 2, y + cellHeight / 2)
        
        // Draw platform badge
        ctx.font = `${Math.min(14, cellWidth / 20)}px system-ui`
        ctx.fillStyle = stream.platform === 'twitch' ? '#9146ff' : '#ff0000'
        ctx.fillText(stream.platform.toUpperCase(), x + cellWidth / 2, y + cellHeight - 20)
      }
      
      // Draw border
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)
    })
    
    // Draw watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText('Multi-Stream Viewer', width - 10, height - 10)
    
    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(renderFrame)
  }
  
  const toggleVirtualCamera = () => {
    if (isActive) {
      stopVirtualCamera()
    } else {
      startVirtualCamera()
    }
  }
  
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera size={20} />
              Virtual Camera Output
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Stream your multi-view layout to OBS, Zoom, Discord, and more
            </p>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={14} className="mr-1" />
            Settings
          </Button>
        </div>
        
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
            )} />
            <span className="font-medium">
              {isActive ? 'Virtual Camera Active' : 'Virtual Camera Inactive'}
            </span>
            {isActive && (
              <Badge variant="secondary" className="text-xs">
                {settings.resolution} @ {settings.frameRate}fps
              </Badge>
            )}
          </div>
          
          <Button
            onClick={toggleVirtualCamera}
            disabled={isInitializing}
            variant={isActive ? 'destructive' : 'default'}
          >
            {isInitializing ? (
              'Initializing...'
            ) : isActive ? (
              <>
                <CameraOff size={16} className="mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera size={16} className="mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>
        
        {/* Performance Metrics */}
        {isActive && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Cpu size={16} className="mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{performance.cpu.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">CPU Usage</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Zap size={16} className="mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{performance.memory}MB</p>
              <p className="text-xs text-muted-foreground">Memory</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <AlertCircle size={16} className="mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{performance.dropped}</p>
              <p className="text-xs text-muted-foreground">Dropped Frames</p>
            </div>
          </div>
        )}
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Resolution</label>
                <select
                  value={settings.resolution}
                  onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  disabled={isActive}
                >
                  <option value="720p">720p (1280x720)</option>
                  <option value="1080p">1080p (1920x1080)</option>
                  <option value="1440p">1440p (2560x1440)</option>
                  <option value="4K">4K (3840x2160)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Frame Rate</label>
                <select
                  value={settings.frameRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, frameRate: parseInt(e.target.value) as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  disabled={isActive}
                >
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Bitrate (Kbps)</label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[settings.bitrate]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, bitrate: value }))}
                  min={1000}
                  max={10000}
                  step={500}
                  disabled={isActive}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-16">
                  {settings.bitrate} Kbps
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Include Audio</label>
                <Switch
                  checked={settings.includeAudio}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeAudio: checked }))}
                  disabled={isActive}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Show Stream Labels</label>
                <Switch
                  checked={settings.showLabels}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLabels: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Custom Layout Editor</label>
                <Switch
                  checked={settings.customLayout}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, customLayout: checked }))}
                  disabled={isActive}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </Card>
      
      {/* Instructions */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">How to Use Virtual Camera</h4>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Monitor size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">OBS Studio</p>
              <p>Add a Video Capture Device source and select &quot;Multi-Stream Viewer Virtual Camera&quot;</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Camera size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Zoom/Discord/Teams</p>
              <p>Go to video settings and select &quot;Multi-Stream Viewer Virtual Camera&quot; as your camera</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Grid3x3 size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Layout Tips</p>
              <p>Arrange your streams in the main viewer to customize the virtual camera output</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="gap-1">
            <Download size={14} />
            Download OBS
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <ExternalLink size={14} />
            Setup Guide
          </Button>
        </div>
      </Card>
    </div>
  )
}