'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Volume2, VolumeX, Headphones, Mic, Settings, Music } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

interface AudioChannel {
  streamId: string
  name: string
  volume: number
  isMuted: boolean
  pan: number // -1 to 1 (left to right)
  eq: EQSettings
}

interface EQSettings {
  bass: number    // 60Hz
  lowMid: number  // 250Hz
  mid: number     // 1kHz
  highMid: number // 4kHz
  treble: number  // 12kHz
}

export default function AudioMixer() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [masterVolume, setMasterVolume] = useState(100)
  const [channels, setChannels] = useState<AudioChannel[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const channelNodesRef = useRef<Map<string, any>>(new Map())
  
  const { streams } = useStreamStore()
  const { updatePreferences, user } = useAppStore()
  
  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    // Initialize channels from streams
    const newChannels: AudioChannel[] = streams.map(stream => ({
      streamId: stream.id,
      name: stream.channelName,
      volume: stream.volume,
      isMuted: stream.muted,
      pan: 0,
      eq: {
        bass: 0,
        lowMid: 0,
        mid: 0,
        highMid: 0,
        treble: 0
      }
    }))
    
    setChannels(newChannels)
  }, [streams])
  
  const createEQNode = (audioContext: AudioContext) => {
    const filters = {
      bass: audioContext.createBiquadFilter(),
      lowMid: audioContext.createBiquadFilter(),
      mid: audioContext.createBiquadFilter(),
      highMid: audioContext.createBiquadFilter(),
      treble: audioContext.createBiquadFilter()
    }
    
    // Configure filter types and frequencies
    filters.bass.type = 'lowshelf'
    filters.bass.frequency.value = 60
    
    filters.lowMid.type = 'peaking'
    filters.lowMid.frequency.value = 250
    filters.lowMid.Q.value = 0.7
    
    filters.mid.type = 'peaking'
    filters.mid.frequency.value = 1000
    filters.mid.Q.value = 0.7
    
    filters.highMid.type = 'peaking'
    filters.highMid.frequency.value = 4000
    filters.highMid.Q.value = 0.7
    
    filters.treble.type = 'highshelf'
    filters.treble.frequency.value = 12000
    
    // Chain filters
    filters.bass.connect(filters.lowMid)
    filters.lowMid.connect(filters.mid)
    filters.mid.connect(filters.highMid)
    filters.highMid.connect(filters.treble)
    
    return filters
  }
  
  const updateChannelVolume = (streamId: string, volume: number) => {
    setChannels(prev => prev.map(ch => 
      ch.streamId === streamId ? { ...ch, volume } : ch
    ))
    
    // Update audio node if exists
    const node = channelNodesRef.current.get(streamId)
    if (node?.gainNode) {
      node.gainNode.gain.value = volume / 100
    }
  }
  
  const updateChannelPan = (streamId: string, pan: number) => {
    setChannels(prev => prev.map(ch => 
      ch.streamId === streamId ? { ...ch, pan } : ch
    ))
    
    // Update audio node if exists
    const node = channelNodesRef.current.get(streamId)
    if (node?.panNode) {
      node.panNode.pan.value = pan
    }
  }
  
  const updateEQ = (streamId: string, band: keyof EQSettings, value: number) => {
    setChannels(prev => prev.map(ch => 
      ch.streamId === streamId 
        ? { ...ch, eq: { ...ch.eq, [band]: value } }
        : ch
    ))
    
    // Update audio node if exists
    const node = channelNodesRef.current.get(streamId)
    if (node?.eq?.[band]) {
      node.eq[band].gain.value = value
    }
  }
  
  const toggleMute = (streamId: string) => {
    setChannels(prev => prev.map(ch => 
      ch.streamId === streamId ? { ...ch, isMuted: !ch.isMuted } : ch
    ))
  }
  
  const applyPreset = (preset: 'flat' | 'bass-boost' | 'voice' | 'music') => {
    const presets = {
      flat: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
      'bass-boost': { bass: 6, lowMid: 4, mid: 0, highMid: -2, treble: 0 },
      voice: { bass: -2, lowMid: 0, mid: 2, highMid: 3, treble: 1 },
      music: { bass: 3, lowMid: 1, mid: 0, highMid: 2, treble: 3 }
    }
    
    const selectedPreset = presets[preset]
    setChannels(prev => prev.map(ch => ({
      ...ch,
      eq: selectedPreset
    })))
  }
  
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Headphones size={20} />
          Audio Mixer
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings size={14} className="mr-1" />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </Button>
      </div>
      
      {/* Master Volume */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Master Volume</label>
          <span className="text-sm text-muted-foreground">{masterVolume}%</span>
        </div>
        <div className="flex items-center gap-2">
          <VolumeX size={16} className="text-muted-foreground" />
          <Slider
            value={[masterVolume]}
            onValueChange={([value]) => setMasterVolume(value)}
            max={100}
            step={1}
            className="flex-1"
          />
          <Volume2 size={16} className="text-muted-foreground" />
        </div>
      </div>
      
      {/* Channel Controls */}
      <div className="space-y-3">
        {channels.map(channel => (
          <div key={channel.streamId} className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{channel.name}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{channel.volume}%</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleMute(channel.streamId)}
                >
                  {channel.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </Button>
              </div>
            </div>
            
            <Slider
              value={[channel.volume]}
              onValueChange={([value]) => updateChannelVolume(channel.streamId, value)}
              max={100}
              step={1}
              disabled={channel.isMuted}
              className={cn(channel.isMuted && "opacity-50")}
            />
            
            {showAdvanced && (
              <>
                {/* Pan Control */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Pan (L/R)</label>
                  <div className="flex items-center gap-2 text-xs">
                    <span>L</span>
                    <Slider
                      value={[channel.pan]}
                      onValueChange={([value]) => updateChannelPan(channel.streamId, value)}
                      min={-1}
                      max={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span>R</span>
                  </div>
                </div>
                
                {/* EQ Controls */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Equalizer</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(channel.eq).map(([band, value]) => (
                      <div key={band} className="text-center">
                        <Slider
                          value={[value]}
                          onValueChange={([v]) => updateEQ(channel.streamId, band as keyof EQSettings, v)}
                          min={-12}
                          max={12}
                          step={1}
                          orientation="vertical"
                          className="h-20 mx-auto"
                        />
                        <label className="text-xs mt-1">
                          {band === 'bass' && '60Hz'}
                          {band === 'lowMid' && '250Hz'}
                          {band === 'mid' && '1kHz'}
                          {band === 'highMid' && '4kHz'}
                          {band === 'treble' && '12kHz'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {showAdvanced && (
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => applyPreset('flat')}>
            Flat
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('bass-boost')}>
            Bass Boost
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('voice')}>
            Voice
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('music')}>
            <Music size={14} className="mr-1" />
            Music
          </Button>
        </div>
      )}
      
      {/* Audio Effects */}
      {showAdvanced && (
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-medium">Effects</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Compressor</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Noise Suppression</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Surround Sound</label>
              <Switch />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}