'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Mic, MicOff, Share2, Copy, Crown, Heart, ThumbsUp, Laugh, Zap, Star } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useStreamStore } from '@/store/streamStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const REACTIONS = [
  { emoji: '❤️', icon: Heart },
  { emoji: '👍', icon: ThumbsUp },
  { emoji: '😂', icon: Laugh },
  { emoji: '⚡', icon: Zap },
  { emoji: '⭐', icon: Star }
]

export default function WatchParty() {
  const [partyName, setPartyName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { activeWatchParty, createWatchParty, joinWatchParty, leaveWatchParty, addReaction, user } = useAppStore()
  const { streams } = useStreamStore()
  
  const handleCreateParty = () => {
    if (!partyName.trim()) {
      toast.error('Please enter a party name')
      return
    }
    
    const partyId = createWatchParty({
      name: partyName,
      host: user.username || 'Anonymous',
      participants: [{
        id: user.id || 'anonymous',
        name: user.username || 'Anonymous',
        avatar: user.avatar,
        isMuted: false,
        reactions: []
      }],
      streams: streams.map(s => s.id),
      isPublic,
      voiceEnabled: true
    })
    
    toast.success(`Created watch party: ${partyName}`)
    setShowCreateDialog(false)
    setPartyName('')
  }
  
  const handleShareParty = async () => {
    if (!activeWatchParty) return
    
    const shareUrl = `${window.location.origin}/party/${activeWatchParty.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Party link copied!')
    } catch {
      toast.error('Failed to copy link')
    }
  }
  
  const handleReaction = (emoji: string) => {
    if (!activeWatchParty || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.random() * rect.width
    const y = Math.random() * rect.height
    
    addReaction(activeWatchParty.id, {
      emoji,
      timestamp: Date.now(),
      x: x / rect.width, // Normalize to 0-1
      y: y / rect.height
    })
    
    // Show floating reaction animation
    const reactionEl = document.createElement('div')
    reactionEl.className = 'floating-reaction'
    reactionEl.textContent = emoji
    reactionEl.style.left = `${x}px`
    reactionEl.style.top = `${y}px`
    containerRef.current.appendChild(reactionEl)
    
    setTimeout(() => reactionEl.remove(), 3000)
  }
  
  if (!activeWatchParty) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Watch Party</h3>
        <p className="text-muted-foreground text-center mb-4">
          Create or join a watch party to watch streams together with friends
        </p>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2" size={16} />
              Create Watch Party
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Watch Party</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Party Name</label>
                <Input
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Friday Night Streams"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Public Party</label>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {isPublic 
                  ? 'Anyone with the link can join'
                  : 'Only invited users can join'}
              </div>
              
              <Button onClick={handleCreateParty} className="w-full">
                Create Party
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
  
  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Party Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {activeWatchParty.name}
              {activeWatchParty.isPublic && (
                <Badge variant="secondary">Public</Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeWatchParty.participants.length} watching
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleShareParty}>
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => leaveWatchParty(activeWatchParty.id, user.id || 'anonymous')}
            >
              Leave
            </Button>
          </div>
        </div>
        
        {/* Participants */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {activeWatchParty.participants.map((participant) => (
            <div
              key={participant.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg bg-muted/50",
                participant.id === activeWatchParty.host && "ring-2 ring-primary"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate flex items-center gap-1">
                  {participant.name}
                  {participant.id === activeWatchParty.host && (
                    <Crown size={12} className="text-yellow-500" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {participant.isMuted ? <MicOff size={10} /> : <Mic size={10} />}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Reactions */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Send Reactions</h4>
        <div className="flex gap-2">
          {REACTIONS.map(({ emoji, icon: Icon }) => (
            <Button
              key={emoji}
              size="sm"
              variant="outline"
              onClick={() => handleReaction(emoji)}
              className="flex-1"
            >
              <Icon size={16} />
            </Button>
          ))}
        </div>
      </Card>
      
      {/* Voice Chat Controls */}
      {activeWatchParty.voiceEnabled && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Voice Chat</h4>
              <p className="text-xs text-muted-foreground">
                {activeWatchParty.participants.filter(p => !p.isMuted).length} speaking
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Mic size={14} className="mr-1" />
              Join Voice
            </Button>
          </div>
        </Card>
      )}
      
      <style jsx global>{`
        .floating-reaction {
          position: absolute;
          font-size: 2rem;
          animation: float-up 3s ease-out forwards;
          pointer-events: none;
          z-index: 100;
        }
        
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) scale(1.5);
          }
        }
      `}</style>
    </div>
  )
}