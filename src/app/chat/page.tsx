'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StreamChat from '@/components/StreamChat'

export default function ChatPage() {
  const router = useRouter()
  
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stream Chat</h1>
        <button 
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
      </div>
      <div className="flex-1">
        <StreamChat show={true} onClose={() => router.back()} />
      </div>
    </div>
  )
}