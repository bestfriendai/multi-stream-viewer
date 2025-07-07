'use client'

import { useUser } from '@clerk/nextjs'
import { type ReactNode } from 'react'

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  showLoadingState?: boolean
}

/**
 * AuthWrapper component that provides consistent authentication state handling
 * across all pages. It ensures proper loading states and conditional rendering
 * based on authentication status.
 */
export default function AuthWrapper({ 
  children, 
  fallback, 
  requireAuth = false,
  showLoadingState = true 
}: AuthWrapperProps) {
  const { isLoaded, isSignedIn, user } = useUser()

  // Show loading state while authentication is being determined
  if (!isLoaded && showLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not signed in
  if (requireAuth && !isSignedIn) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  // Render children with authentication context
  return <>{children}</>
}

/**
 * Hook to get authentication state with loading handling
 */
export function useAuthState() {
  const { isLoaded, isSignedIn, user } = useUser()
  
  return {
    isLoaded,
    isSignedIn,
    user,
    isLoading: !isLoaded
  }
}

/**
 * Component for conditional rendering based on authentication status
 */
interface AuthConditionalProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  showWhenLoading?: ReactNode
}

export function AuthConditional({ 
  children, 
  fallback, 
  requireAuth = false,
  showWhenLoading 
}: AuthConditionalProps) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <>{showWhenLoading || null}</>
  }

  if (requireAuth && !isSignedIn) {
    return <>{fallback || null}</>
  }

  if (!requireAuth && isSignedIn) {
    return <>{children}</>
  }

  if (!requireAuth && !isSignedIn) {
    return <>{fallback || children}</>
  }

  return <>{children}</>
}
