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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-30 pb-safe">
      <div className="grid grid-cols-4 gap-1 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddStream}
          disabled={streamCount >= 16}
          className={cn(
            "flex flex-col gap-1 h-auto py-3 min-h-[48px]",
            streamCount >= 16 && "opacity-50"
          )}
        >
          <Plus size={20} />
          <span className="text-xs font-medium">Add</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenDiscover}
          className="flex flex-col gap-1 h-auto py-3 min-h-[48px]"
        >
          <TrendingUp size={20} />
          <span className="text-xs font-medium">Discover</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenLayouts}
          className="flex flex-col gap-1 h-auto py-3 min-h-[48px]"
        >
          <Bookmark size={20} />
          <span className="text-xs font-medium">Layouts</span>
        </Button>

        <Button
          variant={showChat ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleChat}
          className="flex flex-col gap-1 h-auto py-3 min-h-[48px]"
        >
          <MessageSquare size={20} />
          <span className="text-xs font-medium">Chat</span>
        </Button>
      </div>
    </div>
  )
}