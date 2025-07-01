'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends React.ComponentProps<typeof Button> {
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  loading?: boolean
  loadingText?: string
  minimumTouchTarget?: boolean
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ 
  className,
  loading = false,
  loadingText = 'Loading...',
  minimumTouchTarget = true,
  children,
  disabled,
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        // Ensure minimum touch target size (44px)
        minimumTouchTarget && 'min-w-[44px] min-h-[44px]',
        // Enhanced focus ring
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        // Better disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-label={loading ? loadingText : props['aria-label']}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          <span className="sr-only">{loadingText}</span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'