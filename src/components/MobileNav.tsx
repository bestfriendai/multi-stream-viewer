'use client'

import { Plus, Grid, MessageSquare, Bookmark, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  onAddStream: () => void
  onToggleChat: () => void
  onOpenLayouts: () => void
  onOpenDiscover: () => void
  showChat: boolean
  streamCount: number
}

export default function MobileNav({ 
  onAddStream, 
  onToggleChat, 
  onOpenLayouts, 
  onOpenDiscover,
  showChat,
  streamCount
}: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-30">
      <div className="grid grid-cols-4 gap-1 p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddStream}
          disabled={streamCount >= 16}
          className="flex flex-col gap-1 h-auto py-2"
        >
          <Plus size={20} />
          <span className="text-xs">Add</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenDiscover}
          className="flex flex-col gap-1 h-auto py-2"
        >
          <TrendingUp size={20} />
          <span className="text-xs">Discover</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenLayouts}
          className="flex flex-col gap-1 h-auto py-2"
        >
          <Bookmark size={20} />
          <span className="text-xs">Layouts</span>
        </Button>
        
        <Button
          variant={showChat ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleChat}
          className="flex flex-col gap-1 h-auto py-2"
        >
          <MessageSquare size={20} />
          <span className="text-xs">Chat</span>
        </Button>
      </div>
    </div>
  )
}