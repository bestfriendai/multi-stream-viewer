'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import { useStreamStore } from '@/store/streamStore'
import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import {
  Square,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  PictureInPicture2,
  Columns,
  Rows,
  Focus,
  Layers3,
  Move,
  Sparkles,
  AlignJustify
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GridLayout } from '@/types/stream'

interface LayoutOption {
  id: GridLayout
  name: string
  icon: LucideIcon
  description: string
  gridClass: string
  isNew?: boolean
  isPro?: boolean
}

const layoutOptions: LayoutOption[] = [
  {
    id: '1x1',
    name: 'Single',
    icon: Square,
    description: '1 stream',
    gridClass: 'grid-cols-1'
  },
  {
    id: '2x1',
    name: 'Side by Side',
    icon: Columns,
    description: '2 streams horizontal',
    gridClass: 'grid-cols-2'
  },
  {
    id: '1x2',
    name: 'Stacked',
    icon: Rows,
    description: '2 streams vertical',
    gridClass: 'grid-cols-1'
  },
  {
    id: '2x2',
    name: '2×2 Grid',
    icon: Grid2x2,
    description: '4 streams',
    gridClass: 'grid-cols-2 grid-rows-2'
  },
  {
    id: '3x3',
    name: '3×3 Grid',
    icon: Grid3x3,
    description: '9 streams',
    gridClass: 'grid-cols-3 grid-rows-3'
  },
  {
    id: '4x4',
    name: '4×4 Grid',
    icon: LayoutGrid,
    description: '16 streams',
    gridClass: 'grid-cols-4 grid-rows-4'
  },
  {
    id: 'stacked',
    name: 'Stacked',
    icon: AlignJustify,
    description: 'Full width squares',
    gridClass: 'stacked-layout',
    isNew: true
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    icon: Layers3,
    description: 'Adaptive grid',
    gridClass: 'mosaic-layout',
    isNew: true
  },
  {
    id: 'focus',
    name: 'Focus Mode',
    icon: Focus,
    description: '1 main + thumbnails',
    gridClass: 'focus-layout'
  },
  {
    id: 'pip',
    name: 'Picture-in-Picture',
    icon: PictureInPicture2,
    description: '1 main + floating',
    gridClass: 'pip-layout',
    isNew: true
  },
  {
    id: 'custom',
    name: 'Custom Layout',
    icon: Move,
    description: 'Resizable streams',
    gridClass: 'custom-layout',
    isPro: true
  }
]

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.2
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.1
    }
  }
}

interface EnhancedLayoutSelectorProps {
  mobile?: boolean
}

export default function EnhancedLayoutSelector({ mobile = false }: EnhancedLayoutSelectorProps) {
  const { gridLayout, setGridLayout, streams } = useStreamStore()
  const { hasFeature } = useSubscription()
  const [isOpen, setIsOpen] = useState(false)
  


  const currentLayout = layoutOptions.find(layout => layout.id === gridLayout) || layoutOptions[0]!
  
  // Get layout name
  const getLayoutName = (layoutId: string) => {
    switch (layoutId) {
      case '1x1': return 'Single'
      case '1x2': return 'Stacked'
      case '2x2': return '2x2 Grid'
      case '3x3': return '3x3 Grid'
      case '4x4': return '4x4 Grid'
      case 'stacked': return 'Stacked Layout'
      case 'mosaic': return 'Mosaic Layout'
      case 'focus': return 'Focus Mode'
      case 'pip': return 'Picture-in-Picture'
      case 'custom': return 'Custom Layout'
      default: return layoutId
    }
  }

  const handleLayoutChange = (layoutId: GridLayout) => {
    const layout = layoutOptions.find(l => l.id === layoutId)
    
    // Check if layout requires Pro and user doesn't have it
    if (layout?.isPro && !hasFeature('custom_layouts')) {
      // Could redirect to pricing page or show upgrade modal
      console.log('Pro feature required for custom layouts')
      return
    }
    
    console.log('🎛️ Layout selector: Changing from', gridLayout, 'to', layoutId, '| Mobile:', mobile, '| Streams:', streams.length)
    setGridLayout(layoutId)
    setIsOpen(false)
    
    // Add haptic feedback on mobile
    if (mobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    // Track analytics for layout changes
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as { gtag: (command: string, eventName: string, parameters: Record<string, unknown>) => void }).gtag('event', 'layout_changed', {
        layout_id: layoutId,
        stream_count: streams.length,
        is_mobile: mobile
      })
    }
  }

  if (mobile) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 px-3 touch-manipulation border-border/40 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm min-w-[44px] transition-all duration-300"
          >
            <currentLayout.icon className="h-4 w-4" />
            <span className="ml-1.5 hidden xs:inline text-sm">
{getLayoutName(currentLayout.id)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-72 p-3"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Layout Selector
          </DropdownMenuLabel>
          
          <div className="grid grid-cols-2 gap-2">
            {layoutOptions.slice(0, 8).map((layout) => {
              const Icon = layout.icon
              const isActive = gridLayout === layout.id
              const isDisabled = layout.isPro && !hasFeature('custom_layouts')
              
              return (
                <DropdownMenuItem
                  key={layout.id}
                  onClick={() => handleLayoutChange(layout.id)}
                  disabled={isDisabled || false}
                  className={`
                    gap-2 p-4 cursor-pointer rounded-lg min-h-[72px] touch-manipulation
                    ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-1 w-full">
                    <Icon size={20} />
                    <div className="font-medium text-xs">{getLayoutName(layout.id)}</div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2"
          >
            <currentLayout.icon size={16} />
            <span className="hidden sm:inline">{currentLayout.name}</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-2"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Layout Options
        </DropdownMenuLabel>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {layoutOptions.map((layout) => {
            const Icon = layout.icon
            const isActive = gridLayout === layout.id
            const isDisabled = layout.isPro && !hasFeature('custom_layouts')
            
            return (
              <motion.div
                key={layout.id}
                variants={itemVariants}
                whileHover="hover"
              >
                <DropdownMenuItem
                  onClick={() => !isDisabled && handleLayoutChange(layout.id)}
                  disabled={!!isDisabled}
                  className={`
                    relative p-3 cursor-pointer rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-accent/50'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`
                      p-2 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent text-accent-foreground'
                      }
                    `}>
                      <Icon size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{layout.name}</span>
                        {layout.isNew && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-700 dark:text-green-300 rounded-full">
                              NEW
                            </span>
                          </motion.div>
                        )}
                        {layout.isPro && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center gap-1">
                              <Sparkles size={10} />
                              PRO
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {layout.description}
                      </p>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="w-2 h-2 bg-primary rounded-full"
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </div>
                </DropdownMenuItem>
              </motion.div>
            )
          })}
        </motion.div>
        
        <DropdownMenuSeparator className="my-2" />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-2 py-1"
        >
          <p className="text-xs text-muted-foreground">
            {streams.length} stream{streams.length !== 1 ? 's' : ''} active
          </p>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
