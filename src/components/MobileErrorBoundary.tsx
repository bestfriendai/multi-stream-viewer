'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface MobileErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class MobileErrorBoundary extends Component<MobileErrorBoundaryProps, MobileErrorBoundaryState> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<MobileErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error for analytics
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Mobile Error Boundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-background">
          <div className="text-center space-y-6 max-w-md mx-auto">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="text-muted-foreground text-sm">
                The mobile app encountered an unexpected error. Don't worry, your streams are safe.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <details className="text-xs">
                  <summary className="font-medium cursor-pointer text-muted-foreground mb-2">
                    Error Details (Dev Mode)
                  </summary>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-32 text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full h-12 gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="h-12 gap-2"
                  size="lg"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="h-12 gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-xs text-muted-foreground">
              If this keeps happening, try clearing your browser cache or contact support.
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default MobileErrorBoundary