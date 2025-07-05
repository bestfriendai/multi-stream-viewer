'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MultiViewPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to main page as this is the same functionality
    router.replace('/')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to the multi-stream viewer</p>
      </div>
    </div>
  )
}