'use client'

import { useStreamStore } from '@/store/streamStore'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
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
  Smartphone
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const getLayoutOptions = (t: (key: string) => string) => [
  {
    value: '1x1',
    label: t('layouts.single'),
    icon: Square,
    description: t('layouts.singleDescription'),
    grid: [[1]]
  },
  {
    value: '2x1',
    label: t('layouts.sideBySide'),
    icon: Columns,
    description: t('layouts.sideBySideDescription'),
    grid: [[1, 2]]
  },
  {
    value: '1x2',
    label: t('layouts.stacked'),
    icon: Rows,
    description: t('layouts.stackedDescription'),
    grid: [[1], [2]]
  },
  {
    value: '2x2',
    label: t('layouts.grid2x2'),
    icon: Grid2x2,
    description: t('layouts.grid2x2Description'),
    grid: [[1, 2], [3, 4]]
  },
  {
    value: '3x3',
    label: t('layouts.grid3x3'),
    icon: Grid3x3,
    description: t('layouts.grid3x3Description'),
    grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
  },
  {
    value: '4x4',
    label: t('layouts.grid4x4'),
    icon: LayoutGrid,
    description: t('layouts.grid4x4Description'),
    grid: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]
  },
  {
    value: 'mosaic',
    label: t('layouts.mosaicLayout'),
    icon: Layers3,
    description: t('layouts.mosaicDescription'),
    grid: [[1, 2], [3, 4]]
  },
  {
    value: 'focus',
    label: t('layouts.focusMode'),
    icon: Focus,
    description: t('layouts.focusDescription'),
    grid: [[1, 1, 2], [1, 1, 3], [1, 1, 4]]
  },
  {
    value: 'pip',
    label: t('layouts.pip'),
    icon: PictureInPicture2,
    description: t('layouts.pipDescription'),
    grid: [[1, 1, 1], [1, 1, 1], [1, 1, 2]]
  },
  {
    value: 'app-mobile',
    label: t('layouts.appMobile'),
    icon: Smartphone,
    description: t('layouts.appMobileDescription'),
    grid: [[1], [2], [3]]
  }
] as const

export default function LayoutSelector() {
  const { gridLayout, setGridLayout, streams } = useStreamStore()
  const { t } = useTranslation()
  const layoutOptions = getLayoutOptions(t)

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
                            (option.value === 'focus' || option.value === 'pip') && i === 0 && "col-span-2 row-span-3"
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
