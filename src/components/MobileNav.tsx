'use client'

import { Plus, Grid, MessageSquare, Bookmark, TrendingUp, LayoutGrid, Layers, Play, Pause } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMobileSentryDebugger } from '@/hooks/useMobileSentryDebugger'
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
  const { trackMobileGesture, trackFeatureUsage } = useAnalytics()
  const { trackUIInteraction, trackTouchEvent } = useMobileSentryDebugger('MobileNav')
  
  const activeStreams = streams.filter(stream => stream.isActive).length
  
  // Note: Mobile devices now use EnhancedMobileLayout with its own view mode system
  // This dropdown is for compatibility and will trigger the mobile layout's built-in selector
  const layoutOptions = [
    { value: 'mobile-stack', label: 'Stack View', icon: '☰', description: 'Vertical stacked layout' },
    { value: 'mobile-grid', label: 'Grid View', icon: '⊞', description: 'Square grid layout' },
    { value: 'mobile-swipe', label: 'Swipe View', icon: '⇄', description: 'Full screen swipe navigation' }
  ] as const
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t md:hidden z-30 pb-safe shadow-lg" role="navigation" aria-label="Mobile navigation">
      {/* Stream Status Indicator */}
      {activeStreams > 0 && (
        <div className="px-4 py-2 border-b border-border/50" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-responsive-sm text-muted-foreground">
                {activeStreams} stream{activeStreams !== 1 ? 's' : ''} live
              </span>
            </div>
            <Badge variant="outline" className="text-responsive-xs">
              {gridLayout.toUpperCase()}
            </Badge>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-1 p-3" role="group" aria-label="Main navigation buttons">
        {/* Add Stream Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            onAddStream()
            trackMobileGesture('tap', 'add_stream_button')
            trackUIInteraction('tap', 'add_stream_button', { 
              current_stream_count: streamCount,
              at_limit: streamCount >= 16 
            })
          }}
          disabled={streamCount >= 16}
          className={cn(
            "flex flex-col gap-1.5 h-auto py-4 rounded-xl transition-all active:scale-95",
            streamCount >= 16 && "opacity-50",
            "hover:bg-primary/10 hover:text-primary"
          )}
          style={{ minWidth: '56px', minHeight: '56px' }}
          aria-label={streamCount >= 16 ? 'Maximum streams reached' : 'Add new stream'}
        >
          <div className="relative">
            <Plus size={22} />
            {streamCount >= 16 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </div>
          <span className="text-responsive-xs font-medium">Add</span>
        </Button>

        {/* Discover Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            onOpenDiscover()
            trackMobileGesture('tap', 'discover_button')
          }}
          className="flex flex-col gap-1.5 h-auto py-4 rounded-xl transition-all active:scale-95 hover:bg-primary/10 hover:text-primary"
          style={{ minWidth: '56px', minHeight: '56px' }}
          aria-label="Discover popular streams"
        >
          <TrendingUp size={22} />
          <span className="text-responsive-xs font-medium">Discover</span>
        </Button>

        {/* Layout Dropdown - More prominent */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="flex flex-col gap-1.5 h-auto py-4 rounded-xl transition-all active:scale-95 hover:bg-primary/10 hover:text-primary relative"
              style={{ minWidth: '56px', minHeight: '64px' }}
              aria-label={`Layout options - ${activeStreams} active streams`}
            >
              <div className="relative">
                <LayoutGrid size={22} />
                {activeStreams > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-responsive-xs"
                  >
                    {activeStreams}
                  </Badge>
                )}
              </div>
              <span className="text-responsive-xs font-medium">Layout</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="mb-2 w-56">
            <div className="p-2 text-responsive-xs text-muted-foreground border-b">
              Mobile Layout Options ({activeStreams} streams)
            </div>
            <div className="p-2 text-responsive-xs text-muted-foreground">
              📱 Use the floating controls in the stream view to switch between Stack, Grid, and Swipe modes
            </div>
            {layoutOptions.map((option) => (
              <div
                key={option.value}
                className="text-base py-4 min-h-[48px] px-3 flex items-center cursor-default"
                role="presentation"
                aria-label={`${option.label}: ${option.description}`}
              >
                <span className="font-mono mr-3 text-lg" aria-hidden="true">{option.icon}</span>
                <div className="flex flex-col">
                  <span className="text-responsive-sm text-muted-foreground">{option.label}</span>
                  <span className="text-responsive-xs text-muted-foreground">{option.description}</span>
                </div>
              </div>
            ))}
            <div className="border-t my-1" />
            <DropdownMenuItem
              onClick={() => {
                // Close the dropdown and let user know about the new system
                trackFeatureUsage('mobile_layout_help')
              }}
              className="text-base py-3"
            >
              <Layers className="mr-3 h-5 w-5" />
              <div className="flex flex-col">
                <span className="text-responsive-sm">Enhanced Mobile Layouts</span>
                <span className="text-responsive-xs text-muted-foreground">Look for floating controls in stream view</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Saved Layouts Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            onOpenLayouts()
            trackMobileGesture('tap', 'saved_layouts_button')
          }}
          className="flex flex-col gap-1.5 h-auto py-4 rounded-xl transition-all active:scale-95 hover:bg-primary/10 hover:text-primary"
          style={{ minWidth: '56px', minHeight: '56px' }}
          aria-label="Manage saved layouts"
        >
          <Bookmark size={22} />
          <span className="text-responsive-xs font-medium">Saved</span>
        </Button>

        {/* Chat Button */}
        <Button
          variant={showChat ? 'default' : 'ghost'}
          size="lg"
          onClick={() => {
            onToggleChat()
            trackMobileGesture('tap', showChat ? 'chat_close' : 'chat_open')
          }}
          className={cn(
            "flex flex-col gap-1.5 h-auto py-4 rounded-xl transition-all active:scale-95",
            showChat 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "hover:bg-primary/10 hover:text-primary"
          )}
          style={{ minWidth: '56px', minHeight: '56px' }}
          aria-label={showChat ? 'Close chat' : 'Open chat'}
        >
          <div className="relative">
            <MessageSquare size={22} />
            {showChat && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-responsive-xs font-medium">{showChat ? 'Close' : 'Chat'}</span>
        </Button>
      </div>
    </nav>
  )
}