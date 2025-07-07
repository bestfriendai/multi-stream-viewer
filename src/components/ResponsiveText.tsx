'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveTextProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  variant?: 'default' | 'title' | 'description' | 'button' | 'nav' | 'card-title' | 'card-description'
  truncate?: boolean | number // true for single line, number for multi-line
  balance?: boolean // Use text-wrap: balance for better line breaks
  className?: string
  lang?: string
  as?: keyof JSX.IntrinsicElements
}

export default function ResponsiveText({
  children,
  size = 'base',
  variant = 'default',
  truncate = false,
  balance = false,
  className = '',
  lang,
  as: Component = 'span',
  ...props
}: ResponsiveTextProps) {
  const getTextClasses = () => {
    const baseClasses = []
    
    // Size classes
    switch (size) {
      case 'xs':
        baseClasses.push('text-responsive-xs')
        break
      case 'sm':
        baseClasses.push('text-responsive-sm')
        break
      case 'base':
        baseClasses.push('text-responsive-base')
        break
      case 'lg':
        baseClasses.push('text-responsive-lg')
        break
      case 'xl':
        baseClasses.push('text-responsive-xl')
        break
      case '2xl':
        baseClasses.push('text-responsive-2xl')
        break
      case '3xl':
        baseClasses.push('text-responsive-3xl')
        break
      case '4xl':
        baseClasses.push('text-responsive-4xl')
        break
    }
    
    // Variant classes
    switch (variant) {
      case 'title':
        baseClasses.push('font-semibold', 'tracking-tight')
        break
      case 'description':
        baseClasses.push('text-muted-foreground')
        break
      case 'button':
        baseClasses.push('btn-text-responsive', 'font-medium')
        break
      case 'nav':
        baseClasses.push('nav-text-responsive', 'font-medium')
        break
      case 'card-title':
        baseClasses.push('card-title-responsive')
        break
      case 'card-description':
        baseClasses.push('card-description-responsive')
        break
    }
    
    // Truncation classes
    if (truncate === true) {
      baseClasses.push('text-ellipsis-responsive')
    } else if (typeof truncate === 'number') {
      baseClasses.push(`text-clamp-${truncate}`)
    }
    
    // Text wrapping
    if (balance) {
      baseClasses.push('text-balance')
    } else {
      baseClasses.push('text-wrap-responsive')
    }
    
    // Mobile container class
    baseClasses.push('mobile-text-container')
    
    return baseClasses.join(' ')
  }
  
  const componentProps = {
    className: cn(getTextClasses(), className),
    lang,
    ...props
  }
  
  return React.createElement(Component, componentProps, children)
}

// Convenience components for common use cases
export const ResponsiveHeading = ({
  level = 1,
  children,
  className,
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
} & Omit<ResponsiveTextProps, 'as' | 'size'>) => {
  const sizeMap = {
    1: '4xl' as const,
    2: '3xl' as const,
    3: '2xl' as const,
    4: 'xl' as const,
    5: 'lg' as const,
    6: 'base' as const,
  }
  
  return (
    <ResponsiveText
      as={`h${level}` as keyof JSX.IntrinsicElements}
      size={sizeMap[level]}
      variant="title"
      balance
      className={className}
      {...props}
    >
      {children}
    </ResponsiveText>
  )
}

export const ResponsiveParagraph = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & Omit<ResponsiveTextProps, 'as'>) => {
  return (
    <ResponsiveText
      as="p"
      className={cn('text-spacing-responsive', className)}
      {...props}
    >
      {children}
    </ResponsiveText>
  )
}

export const ResponsiveButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & Omit<ResponsiveTextProps, 'as' | 'variant'>) => {
  return (
    <ResponsiveText
      as="span"
      variant="button"
      className={className}
      {...props}
    >
      {children}
    </ResponsiveText>
  )
}

export const ResponsiveCardTitle = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & Omit<ResponsiveTextProps, 'variant'>) => {
  return (
    <ResponsiveText
      variant="card-title"
      truncate={2}
      balance
      className={className}
      {...props}
    >
      {children}
    </ResponsiveText>
  )
}

export const ResponsiveCardDescription = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & Omit<ResponsiveTextProps, 'variant'>) => {
  return (
    <ResponsiveText
      variant="card-description"
      truncate={3}
      className={className}
      {...props}
    >
      {children}
    </ResponsiveText>
  )
}

// Hook for responsive text utilities
export const useResponsiveText = () => {
  const getResponsiveClass = (size: ResponsiveTextProps['size']) => {
    return `text-responsive-${size}`
  }
  
  const getTruncateClass = (lines: number | boolean) => {
    if (lines === true) return 'text-ellipsis-responsive'
    if (typeof lines === 'number') return `text-clamp-${lines}`
    return ''
  }
  
  return {
    getResponsiveClass,
    getTruncateClass,
  }
}