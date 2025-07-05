'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  TrendingUp, 
  Shuffle, 
  Eye, 
  X,
  Loader2,
  Plus,
  Grid3x3
} from 'lucide-react'
import { useTwitchAutosuggest } from '@/hooks/useTwitchAutosuggest'
import { useStreamStore } from '@/store/streamStore'
import { useSubscription } from '@/hooks/useSubscription'
import { cn } from '@/lib/utils'

interface EnhancedAddStreamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EnhancedAddStreamDialog({ open, onOpenChange }: EnhancedAddStreamDialogProps) {
  const [channelInput, setChannelInput] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isAddingBulk, setIsAddingBulk] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addStream, setGridLayout } = useStreamStore()
  const { subscription } = useSubscription()
  
  const { suggestions, loading } = useTwitchAutosuggest(channelInput, {
    enabled: open && channelInput.length > 0
  })

  const handleAddStream = async (input: string) => {
    const success = await addStream(input, subscription)
    if (success) {
      setChannelInput('')
      onOpenChange(false)
    }
    return success
  }

  const handleAddTopLives = async () => {
    setIsAddingBulk(true)
    try {
      // Fetch top streams
      const response = await fetch('/api/twitch/top-streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 4 })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.streams && Array.isArray(data.streams)) {
          // Add first 4 streams
          const topStreams = data.streams.slice(0, 4)
          for (const stream of topStreams) {
            if (stream.user_login) {
              await addStream(stream.user_login, subscription)
            }
          }
          // Set layout to 2x2
          setGridLayout('grid-2x2')
          onOpenChange(false)
        }
      }
    } catch (error) {
      console.error('Failed to add top streams:', error)
    } finally {
      setIsAddingBulk(false)
    }
  }

  const handleAddRandomStreamers = async () => {
    setIsAddingBulk(true)
    try {
      // Fetch more streams and pick random ones
      const response = await fetch('/api/twitch/top-streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.streams && Array.isArray(data.streams)) {
          // Shuffle and pick 4 random streams
          const shuffled = [...data.streams].sort(() => Math.random() - 0.5)
          const randomStreams = shuffled.slice(0, 4)
          
          for (const stream of randomStreams) {
            if (stream.user_login) {
              await addStream(stream.user_login, subscription)
            }
          }
          // Set layout to 2x2
          setGridLayout('grid-2x2')
          onOpenChange(false)
        }
      }
    } catch (error) {
      console.error('Failed to add random streams:', error)
    } finally {
      setIsAddingBulk(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleAddStream(suggestions[selectedIndex].login)
        } else if (channelInput.trim()) {
          handleAddStream(channelInput.trim())
        }
        break
      case 'Escape':
        e.preventDefault()
        setSelectedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (open) {
      setChannelInput('')
      setSelectedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Streams</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleAddTopLives}
              disabled={isAddingBulk}
              className="h-auto flex flex-col items-center gap-2 p-4"
            >
              {isAddingBulk ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">Top Lives</div>
                    <div className="text-xs text-muted-foreground">Add top 4 live streams</div>
                  </div>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAddRandomStreamers}
              disabled={isAddingBulk}
              className="h-auto flex flex-col items-center gap-2 p-4"
            >
              {isAddingBulk ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Shuffle className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">Random Streamers</div>
                    <div className="text-xs text-muted-foreground">Discover 4 random streams</div>
                  </div>
                </>
              )}
            </Button>
          </div>
          
          <div className="relative">
            <div className="text-sm text-center text-muted-foreground mb-2">
              or search for specific streams
            </div>
          </div>

          {/* Search Input */}
          <form onSubmit={(e) => {
            e.preventDefault()
            if (channelInput.trim()) {
              handleAddStream(channelInput.trim())
            }
          }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel name or URL"
                className="pl-10"
                disabled={isAddingBulk}
              />
            </div>
          </form>

          {/* Autosuggest Dropdown */}
          {channelInput && suggestions.length > 0 && (
            <Card className="p-2 max-h-[200px] overflow-y-auto">
              {suggestions.map((channel, index) => (
                <div
                  key={channel.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                    index === selectedIndex && "bg-accent"
                  )}
                  onClick={() => handleAddStream(channel.login)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {channel.profile_image_url && (
                    <img 
                      src={channel.profile_image_url} 
                      alt={channel.display_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{channel.display_name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {channel.game_name && <span className="truncate">{channel.game_name}</span>}
                      {channel.is_live && (
                        <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                          LIVE
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </Card>
          )}

          {/* Help Text */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Twitch: username or twitch.tv/username</li>
              <li>YouTube: youtube.com/watch?v=VIDEO_ID</li>
              <li>Rumble: rumble.com/v1234-title.html</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}