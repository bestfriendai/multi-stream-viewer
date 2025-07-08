'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          fontSize: '14px',
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
        // Error
        error: {
          duration: 5000,
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive-foreground))',
          },
        },
        // Loading
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: 'hsl(var(--muted-foreground))',
            secondary: 'hsl(var(--muted))',
          },
        },
      }}
    />
  )
}