'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { generateShareableLink } from '@/lib/shareableLinks'
import { toast } from 'sonner'

export default function ShareDialog() {
  const [copied, setCopied] = useState(false)
  const { streams, gridLayout } = useStreamStore()
  
  const shareableLink = generateShareableLink([...streams], gridLayout)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Multi-Stream Viewer',
          text: 'Check out these streams!',
          url: shareableLink
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy()
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={streams.length === 0}>
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Current View</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="icon"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This link includes:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>{streams.length} stream{streams.length !== 1 ? 's' : ''}</li>
              <li>{gridLayout} layout</li>
            </ul>
          </div>
          
          {'share' in navigator && (
            <Button onClick={handleShare} className="w-full">
              <Share2 size={16} className="mr-2" />
              Share via System
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}