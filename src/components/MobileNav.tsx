'use client'

import { Plus, Grid, MessageSquare, Bookmark, TrendingUp, LayoutGrid, Layers } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useStreamStore } from '@/store/streamStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileNavProps {
  onAddStream: () => void
  onToggleChat: () => void
  onOpenLayouts: () => void
  onOpenDiscover: () => void
  showChat: boolean
  streamCount: number
  onToggleSwipeView?: () => void
}

export default function MobileNav({ 
  onAddStream, 
  onToggleChat, 
  onOpenLayouts, 
  onOpenDiscover,
  showChat,
  streamCount,
  onToggleSwipeView
}: MobileNavProps) {
  const { gridLayout, setGridLayout, streams } = useStreamStore()
  
  const layoutOptions = [
    { value: '1x1', label: '1x1', icon: '◻' },
    { value: '2x1', label: '2x1', icon: '◻◻' },
    { value: '2x2', label: '2x2', icon: '⊞' },
    { value: '3x3', label: '3x3', icon: '⊟' },
    { value: '4x4', label: '4x4', icon: '⊞' },
    { value: 'custom', label: 'Focus', icon: '◧' }
  ] as const
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-30 pb-safe">
      <div className="grid grid-cols-5 gap-1 p-2">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col gap-1 h-auto py-3 min-h-[48px]"
            >
              <LayoutGrid size={20} />
              <span className="text-xs font-medium">Layout</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="mb-2">
            {layoutOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setGridLayout(option.value)}
                className={cn(
                  gridLayout === option.value && "bg-accent"
                )}
              >
                <span className="font-mono mr-2">{option.icon}</span>
                {option.label}
              </DropdownMenuItem>
            ))}
            {streams.length > 0 && onToggleSwipeView && (
              <>
                <DropdownMenuItem
                  onClick={onToggleSwipeView}
                  className="border-t"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Swipe View
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenLayouts}
          className="flex flex-col gap-1 h-auto py-3 min-h-[48px]"
        >
          <Bookmark size={20} />
          <span className="text-xs font-medium">Saved</span>
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