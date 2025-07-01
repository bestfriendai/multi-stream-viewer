'use client'

import { useStreamStore } from '@/store/streamStore'
import { cn } from '@/lib/utils'
import { 
  Square, 
  Grid2x2, 
  Grid3x3, 
  LayoutGrid,
  PictureInPicture2,
  Columns,
  Rows
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const layoutOptions = [
  { 
    value: '1x1', 
    label: 'Single', 
    icon: Square,
    description: '1 stream',
    grid: [[1]]
  },
  { 
    value: '2x1', 
    label: 'Side by Side', 
    icon: Columns,
    description: '2 streams horizontal',
    grid: [[1, 2]]
  },
  { 
    value: '1x2', 
    label: 'Stacked', 
    icon: Rows,
    description: '2 streams vertical',
    grid: [[1], [2]]
  },
  { 
    value: '2x2', 
    label: '2×2 Grid', 
    icon: Grid2x2,
    description: '4 streams',
    grid: [[1, 2], [3, 4]]
  },
  { 
    value: '3x3', 
    label: '3×3 Grid', 
    icon: Grid3x3,
    description: '9 streams',
    grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
  },
  { 
    value: '4x4', 
    label: '4×4 Grid', 
    icon: LayoutGrid,
    description: '16 streams',
    grid: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]
  },
  { 
    value: 'custom', 
    label: 'Focus View', 
    icon: PictureInPicture2,
    description: '1 main + 3 side',
    grid: [[1, 1, 2], [1, 1, 3], [1, 1, 4]]
  }
] as const

export default function LayoutSelector() {
  const { gridLayout, setGridLayout, streams } = useStreamStore()
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
        {layoutOptions.map((option) => {
          const Icon = option.icon
          const isActive = gridLayout === option.value
          const isDisabled = option.value === '3x3' && streams.length < 5 ||
                           option.value === '4x4' && streams.length < 10
          
          return (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !isDisabled && setGridLayout(option.value)}
                  disabled={isDisabled}
                  className={cn(
                    'relative group px-3 py-2 rounded-lg transition-all duration-200',
                    'hover:bg-muted/70',
                    isActive && 'bg-primary text-primary-foreground shadow-sm',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Icon 
                    size={18} 
                    className={cn(
                      'transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full" />
                  )}
                </button>
              </TooltipTrigger>
              
              <TooltipContent side="bottom" className="p-3">
                <div className="space-y-2">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                  
                  {/* Visual preview */}
                  <div className="pt-1">
                    <div className="grid gap-0.5 p-2 bg-muted rounded" 
                         style={{
                           gridTemplateColumns: `repeat(${option.grid[0].length}, 1fr)`,
                           gridTemplateRows: `repeat(${option.grid.length}, 1fr)`,
                           width: '48px',
                           height: '36px'
                         }}>
                      {option.grid.flat().map((cell, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "bg-primary/50 rounded-sm",
                            option.value === 'custom' && i === 0 && "col-span-2 row-span-3"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}