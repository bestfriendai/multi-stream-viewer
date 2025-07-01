'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string
  retry?: () => void
  showHome?: boolean
  className?: string
}

export function ErrorState({ 
  title = 'Something went wrong', 
  description,
  error,
  retry,
  showHome = true,
  className 
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
        {errorMessage && (
          <CardDescription className="text-xs font-mono bg-muted p-2 rounded mt-2">
            {errorMessage}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {retry && (
          <Button onClick={retry} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHome && (
          <Button asChild variant="ghost" className="w-full">
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface StreamErrorProps {
  streamName?: string
  platform?: string
  onRetry?: () => void
  onRemove?: () => void
}

export function StreamError({ streamName, platform, onRetry, onRemove }: StreamErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-lg">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
      <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Stream Failed to Load</h3>
      <p className="text-sm text-red-600 dark:text-red-500 text-center mb-4">
        {streamName && platform ? 
          `Could not load ${streamName} from ${platform}` : 
          'Failed to load this stream'
        }
      </p>
      <div className="flex gap-2">
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
        {onRemove && (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}

interface NetworkErrorProps {
  onRetry?: () => void
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <ErrorState
      title="Connection Failed"
      description="Unable to connect to the streaming service. Please check your internet connection and try again."
      {...(onRetry && { retry: onRetry })}
      showHome={false}
    />
  )
}