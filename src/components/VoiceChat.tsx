'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Mic, MicOff, Headphones, HeadphoneOff, Volume2, 
  Settings, Users, UserPlus, Shield, AlertCircle,
  Phone, PhoneOff, Signal, WifiOff, Wifi
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VoiceParticipant {
  id: string
  name: string
  isSpeaking: boolean
  isMuted: boolean
  isDeafened: boolean
  volume: number
  connectionQuality: 'excellent' | 'good' | 'poor'
}

export default function VoiceChat({ roomId }: { roomId: string }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [participants, setParticipants] = useState<VoiceParticipant[]>([])
  const [inputDevice, setInputDevice] = useState<string>('')
  const [outputDevice, setOutputDevice] = useState<string>('')
  const [inputVolume, setInputVolume] = useState(100)
  const [outputVolume, setOutputVolume] = useState(100)
  const [noiseSuppression, setNoiseSuppression] = useState(true)
  const [echoCancellation, setEchoCancellation] = useState(true)
  const [autoGainControl, setAutoGainControl] = useState(true)
  
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      disconnect()
    }
  }, [])
  
  const connect = async () => {
    setIsConnecting(true)
    
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation,
          noiseSuppression,
          autoGainControl,
          deviceId: inputDevice ? { exact: inputDevice } : undefined
        }
      })
      
      localStreamRef.current = stream
      
      // Initialize Web Audio API for volume control and analysis
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)
      
      // Mock connection - in real implementation, connect to WebRTC signaling server
      setTimeout(() => {
        setIsConnected(true)
        setIsConnecting(false)
        toast.success('Connected to voice chat')
        
        // Mock participants
        setParticipants([
          {
            id: 'user-1',
            name: 'You',
            isSpeaking: false,
            isMuted: false,
            isDeafened: false,
            volume: 100,
            connectionQuality: 'excellent'
          },
          {
            id: 'user-2',
            name: 'JohnDoe',
            isSpeaking: true,
            isMuted: false,
            isDeafened: false,
            volume: 100,
            connectionQuality: 'good'
          },
          {
            id: 'user-3',
            name: 'StreamFan',
            isSpeaking: false,
            isMuted: true,
            isDeafened: false,
            volume: 100,
            connectionQuality: 'excellent'
          }
        ])
        
        // Start voice activity detection
        detectVoiceActivity()
      }, 1500)
      
    } catch (error) {
      console.error('Failed to connect to voice chat:', error)
      toast.error('Failed to connect to voice chat')
      setIsConnecting(false)
    }
  }
  
  const disconnect = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    
    // Close peer connections
    peerConnectionsRef.current.forEach(pc => pc.close())
    peerConnectionsRef.current.clear()
    
    setIsConnected(false)
    setParticipants([])
    toast.info('Disconnected from voice chat')
  }
  
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
        setIsMuted(!isMuted)
        
        // Update self in participants list
        setParticipants(prev => prev.map(p => 
          p.id === 'user-1' ? { ...p, isMuted: !isMuted } : p
        ))
      }
    }
  }
  
  const toggleDeafen = () => {
    setIsDeafened(!isDeafened)
    
    // If deafening, also mute
    if (!isDeafened && !isMuted) {
      toggleMute()
    }
    
    // Update self in participants list
    setParticipants(prev => prev.map(p => 
      p.id === 'user-1' ? { ...p, isDeafened: !isDeafened } : p
    ))
  }
  
  const detectVoiceActivity = () => {
    if (!analyserRef.current || !isConnected) return
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const checkAudio = () => {
      if (!analyserRef.current || !isConnected) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      const isSpeaking = average > 20 && !isMuted
      
      // Update speaking state
      setParticipants(prev => prev.map(p => 
        p.id === 'user-1' ? { ...p, isSpeaking } : p
      ))
      
      // Simulate other participants speaking randomly
      if (Math.random() > 0.95) {
        const randomParticipant = Math.floor(Math.random() * 2) + 2
        setParticipants(prev => prev.map((p, idx) => 
          idx === randomParticipant - 1 ? { ...p, isSpeaking: !p.isMuted && Math.random() > 0.5 } : p
        ))
      }
      
      requestAnimationFrame(checkAudio)
    }
    
    checkAudio()
  }
  
  const adjustParticipantVolume = (participantId: string, volume: number) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, volume } : p
    ))
  }
  
  const getConnectionIcon = (quality: VoiceParticipant['connectionQuality']) => {
    switch (quality) {
      case 'excellent': return <Signal size={12} className="text-green-500" />
      case 'good': return <Wifi size={12} className="text-yellow-500" />
      case 'poor': return <WifiOff size={12} className="text-red-500" />
    }
  }
  
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Voice Chat
          {isConnected && (
            <Badge variant="secondary" className="text-xs">
              {participants.length} connected
            </Badge>
          )}
        </h3>
        
        {isConnected && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </Button>
        )}
      </div>
      
      {!isConnected ? (
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
            <Phone size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Join voice chat to talk with other viewers
          </p>
          <Button 
            onClick={connect} 
            disabled={isConnecting}
            className="gap-2"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                <Phone size={16} />
                Join Voice Chat
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              size="lg"
              variant={isMuted ? 'destructive' : 'default'}
              onClick={toggleMute}
              className="rounded-full"
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            <Button
              size="lg"
              variant={isDeafened ? 'destructive' : 'secondary'}
              onClick={toggleDeafen}
              className="rounded-full"
            >
              {isDeafened ? <HeadphoneOff size={20} /> : <Headphones size={20} />}
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              onClick={disconnect}
              className="rounded-full"
            >
              <PhoneOff size={20} />
            </Button>
          </div>
          
          {/* Participants List */}
          <div className="space-y-2">
            {participants.map(participant => (
              <div
                key={participant.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  participant.isSpeaking && "bg-green-500/10 ring-1 ring-green-500/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium",
                    participant.isSpeaking && "ring-2 ring-green-500 ring-offset-2 ring-offset-background"
                  )}>
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {participant.name}
                        {participant.id === 'user-1' && ' (You)'}
                      </span>
                      {participant.isMuted && <MicOff size={12} className="text-muted-foreground" />}
                      {participant.isDeafened && <HeadphoneOff size={12} className="text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-1">
                      {getConnectionIcon(participant.connectionQuality)}
                      <span className="text-xs text-muted-foreground">{participant.connectionQuality}</span>
                    </div>
                  </div>
                </div>
                
                {participant.id !== 'user-1' && (
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-muted-foreground" />
                    <Slider
                      value={[participant.volume]}
                      onValueChange={([value]) => adjustParticipantVolume(participant.id, value)}
                      max={200}
                      step={10}
                      className="w-20"
                    />
                    <span className="text-xs text-muted-foreground w-10">
                      {participant.volume}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium">Audio Settings</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm">Input Volume</label>
                  <div className="flex items-center gap-2">
                    <Mic size={14} className="text-muted-foreground" />
                    <Slider
                      value={[inputVolume]}
                      onValueChange={([value]) => setInputVolume(value)}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10">{inputVolume}%</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm">Output Volume</label>
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-muted-foreground" />
                    <Slider
                      value={[outputVolume]}
                      onValueChange={([value]) => setOutputVolume(value)}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10">{outputVolume}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Noise Suppression</label>
                    <Switch
                      checked={noiseSuppression}
                      onCheckedChange={setNoiseSuppression}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Echo Cancellation</label>
                    <Switch
                      checked={echoCancellation}
                      onCheckedChange={setEchoCancellation}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Auto Gain Control</label>
                    <Switch
                      checked={autoGainControl}
                      onCheckedChange={setAutoGainControl}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Privacy Notice */}
      <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
        <Shield size={14} className="text-muted-foreground mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Voice chat is peer-to-peer encrypted. No audio is recorded or stored.
        </p>
      </div>
    </Card>
  )
}