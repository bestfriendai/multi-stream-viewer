'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { 
  Video, Square, Download, HardDrive, Clock, 
  AlertCircle, CheckCircle, Settings, FolderOpen,
  Scissors, Play, Pause, SkipForward, Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { useStreamStore } from '@/store/streamStore'
import { formatDuration } from '@/lib/utils'

interface Recording {
  id: string
  name: string
  streams: string[]
  startTime: number
  endTime?: number
  duration: number
  size: number
  status: 'recording' | 'processing' | 'completed' | 'failed'
  thumbnail?: string
}

interface RecordingSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra'
  format: 'mp4' | 'webm' | 'mkv'
  includeChat: boolean
  separateAudioTracks: boolean
  maxDuration: number // in minutes, 0 = unlimited
  autoSplit: boolean // split recordings every X minutes
  splitDuration: number // in minutes
}

export default function StreamRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<RecordingSettings>({
    quality: 'high',
    format: 'mp4',
    includeChat: true,
    separateAudioTracks: true,
    maxDuration: 0,
    autoSplit: false,
    splitDuration: 30
  })
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    available: 0
  })
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<number | null>(null)
  
  const { streams } = useStreamStore()
  
  useEffect(() => {
    // Load saved recordings
    loadRecordings()
    
    // Check storage
    checkStorage()
    
    return () => {
      if (isRecording) {
        stopRecording()
      }
    }
  }, [])
  
  const loadRecordings = () => {
    // Load from localStorage (in real app, would be from IndexedDB or server)
    const saved = localStorage.getItem('recordings')
    if (saved) {
      setRecordings(JSON.parse(saved))
    }
  }
  
  const saveRecordings = (updatedRecordings: Recording[]) => {
    setRecordings(updatedRecordings)
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings))
  }
  
  const checkStorage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      setStorageInfo({
        used: estimate.usage || 0,
        available: estimate.quota || 0
      })
    }
  }
  
  const getQualitySettings = (quality: RecordingSettings['quality']) => {
    switch (quality) {
      case 'low': return { bitrate: 1000000, resolution: '720p' }
      case 'medium': return { bitrate: 2500000, resolution: '1080p' }
      case 'high': return { bitrate: 5000000, resolution: '1080p' }
      case 'ultra': return { bitrate: 10000000, resolution: '4K' }
    }
  }
  
  const startRecording = async () => {
    try {
      const activeStreams = streams.filter(s => s.isActive)
      if (activeStreams.length === 0) {
        toast.error('No active streams to record')
        return
      }
      
      // Create recording entry
      const recording: Recording = {
        id: Date.now().toString(),
        name: `Recording ${new Date().toLocaleString()}`,
        streams: activeStreams.map(s => s.channelName),
        startTime: Date.now(),
        duration: 0,
        size: 0,
        status: 'recording'
      }
      
      setCurrentRecording(recording)
      setIsRecording(true)
      
      // Initialize MediaRecorder (simplified for demo)
      const qualitySettings = getQualitySettings(settings.quality)
      const constraints = {
        video: {
          width: { ideal: qualitySettings.resolution === '4K' ? 3840 : 1920 },
          height: { ideal: qualitySettings.resolution === '4K' ? 2160 : 1080 }
        },
        audio: true
      }
      
      // In real implementation, capture the canvas or use screen capture API
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints)
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: `video/${settings.format === 'mp4' ? 'webm' : settings.format}`,
        videoBitsPerSecond: qualitySettings.bitrate
      })
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        handleRecordingComplete()
      }
      
      mediaRecorderRef.current.start(1000) // Collect data every second
      
      // Update duration and size periodically
      recordingIntervalRef.current = window.setInterval(() => {
        setCurrentRecording(prev => {
          if (!prev) return null
          const duration = Date.now() - prev.startTime
          const size = recordedChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0)
          
          // Check max duration
          if (settings.maxDuration > 0 && duration >= settings.maxDuration * 60 * 1000) {
            stopRecording()
          }
          
          // Check auto-split
          if (settings.autoSplit && duration >= settings.splitDuration * 60 * 1000) {
            splitRecording()
          }
          
          return { ...prev, duration, size }
        })
      }, 1000)
      
      toast.success('Recording started')
      
    } catch (error) {
      console.error('Failed to start recording:', error)
      toast.error('Failed to start recording')
      setIsRecording(false)
      setCurrentRecording(null)
    }
  }
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      toast.info('Recording paused')
    }
  }
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      toast.info('Recording resumed')
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
    
    setIsRecording(false)
    setIsPaused(false)
  }
  
  const handleRecordingComplete = () => {
    if (!currentRecording) return
    
    // Create blob from chunks
    const blob = new Blob(recordedChunksRef.current, {
      type: `video/${settings.format === 'mp4' ? 'webm' : settings.format}`
    })
    
    // Update recording with final data
    const finalRecording: Recording = {
      ...currentRecording,
      endTime: Date.now(),
      status: 'processing',
      size: blob.size
    }
    
    // Simulate processing
    setTimeout(() => {
      finalRecording.status = 'completed'
      
      // Add to recordings list
      const updatedRecordings = [finalRecording, ...recordings]
      saveRecordings(updatedRecordings)
      
      toast.success('Recording saved successfully')
    }, 2000)
    
    // Reset
    recordedChunksRef.current = []
    setCurrentRecording(null)
  }
  
  const splitRecording = () => {
    // Save current recording and start a new one
    handleRecordingComplete()
    
    // Start new recording segment
    setTimeout(() => {
      startRecording()
    }, 100)
  }
  
  const downloadRecording = (recording: Recording) => {
    // In real implementation, reconstruct blob from stored data
    toast.info(`Downloading ${recording.name}`)
  }
  
  const deleteRecording = (recordingId: string) => {
    const updatedRecordings = recordings.filter(r => r.id !== recordingId)
    saveRecordings(updatedRecordings)
    toast.success('Recording deleted')
  }
  
  const formatSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }
  
  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Video size={20} />
              Stream Recorder
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Record multiple streams simultaneously
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
        
        {/* Current Recording Status */}
        {currentRecording && (
          <div className="p-4 bg-muted/30 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">Recording in Progress</span>
                <Badge variant="secondary" className="text-xs">
                  {currentRecording.streams.length} streams
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} />
                {formatDuration(currentRecording.duration)}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(currentRecording.duration / (settings.maxDuration * 60 * 1000)) * 100} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatSize(currentRecording.size)}</span>
                <span>{settings.quality.toUpperCase()} • {settings.format.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={startRecording}
              className="gap-2"
            >
              <Video size={20} />
              Start Recording
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={pauseRecording}
                >
                  <Pause size={20} />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={resumeRecording}
                >
                  <Play size={20} />
                </Button>
              )}
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
              >
                <Square size={20} />
              </Button>
            </>
          )}
        </div>
        
        {/* Settings */}
        {showSettings && (
          <div className="space-y-4 pt-4 mt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quality</label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  disabled={isRecording}
                >
                  <option value="low">Low (720p, 1 Mbps)</option>
                  <option value="medium">Medium (1080p, 2.5 Mbps)</option>
                  <option value="high">High (1080p, 5 Mbps)</option>
                  <option value="ultra">Ultra (4K, 10 Mbps)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Format</label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  disabled={isRecording}
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="mkv">MKV</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Include Chat</label>
                <Switch
                  checked={settings.includeChat}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeChat: checked }))}
                  disabled={isRecording}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Separate Audio Tracks</label>
                <Switch
                  checked={settings.separateAudioTracks}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, separateAudioTracks: checked }))}
                  disabled={isRecording}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Auto-split Recordings</label>
                <Switch
                  checked={settings.autoSplit}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSplit: checked }))}
                  disabled={isRecording}
                />
              </div>
            </div>
            
            {settings.autoSplit && (
              <div>
                <label className="text-sm font-medium">Split Duration (minutes)</label>
                <input
                  type="number"
                  value={settings.splitDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, splitDuration: parseInt(e.target.value) || 30 }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  min={5}
                  max={60}
                  disabled={isRecording}
                />
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Storage Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Storage</span>
          </div>
          <Button size="sm" variant="outline">
            <FolderOpen size={14} className="mr-1" />
            Manage
          </Button>
        </div>
        <div className="mt-3">
          <Progress 
            value={(storageInfo.used / storageInfo.available) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatSize(storageInfo.used)} used</span>
            <span>{formatSize(storageInfo.available - storageInfo.used)} available</span>
          </div>
        </div>
      </Card>
      
      {/* Recordings List */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Recent Recordings</h4>
        {recordings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No recordings yet
          </p>
        ) : (
          <div className="space-y-2">
            {recordings.map(recording => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-9 bg-muted rounded flex items-center justify-center">
                    <Video size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{recording.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {recording.streams.join(', ')} • {formatDuration(recording.duration)} • {formatSize(recording.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {recording.status === 'processing' && (
                    <Badge variant="secondary" className="text-xs">
                      Processing...
                    </Badge>
                  )}
                  {recording.status === 'completed' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadRecording(recording)}
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRecording(recording.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}