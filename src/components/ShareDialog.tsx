'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { generateShareableLink } from '@/lib/shareableLinks'
import { useTranslation } from '@/contexts/LanguageContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { toast } from 'sonner'

interface ShareDialogProps {
  mobile?: boolean
}

export default function ShareDialog({ mobile = false }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { streams, gridLayout } = useStreamStore()
  const { t, isLoaded: translationsLoaded } = useTranslation()
  const { isMobile } = useMobileDetection()
  
  const shareableLink = generateShareableLink([...streams], gridLayout)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopied(true)
      toast.success(t('notifications.copySuccess'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('errors.copyFailed'))
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share.title'),
          text: t('share.checkStreams'),
          url: shareableLink
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy()
    }
  }
  
  if (!translationsLoaded) {
    return mobile ? (
      <Button variant="outline" className="w-full justify-start h-12" disabled>
        <Share2 className="mr-3 h-5 w-5" />
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </Button>
    ) : (
      <Button variant="outline" size="sm" className="h-9" disabled>
        <Share2 size={16} className="mr-2" />
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </Button>
    )
  }

  const trigger = mobile ? (
    <Button 
      variant="outline" 
      className="w-full justify-start h-12" 
      disabled={streams.length === 0}
      onClick={() => setIsOpen(true)}
    >
      <Share2 className="mr-3 h-5 w-5" />
      {t('header.shareStreams')}
    </Button>
  ) : (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9" 
      disabled={streams.length === 0}
      onClick={() => setIsOpen(true)}
    >
      <Share2 size={16} className="mr-2" />
      {t('buttons.share')}
    </Button>
  )

  const dialogContent = (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('header.shareableLink')}</label>
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
          {t('share.linkIncludes')}:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside">
          <li>{t('share.streamsCount', { count: streams.length })}</li>
          <li>{t('share.layoutInfo', { layout: gridLayout })}</li>
        </ul>
      </div>
      
      {'share' in navigator && (
        <Button onClick={handleShare} className="w-full">
          <Share2 size={16} className="mr-2" />
          {t('share.shareViaSystem')}
        </Button>
      )}
    </>
  )

  // Render BottomSheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <>
        {trigger}
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t('header.shareCurrentView')}
          snapPoints={[40, 60]}
          initialSnap={1}
        >
          <div className="space-y-4 p-4">
            {dialogContent}
          </div>
        </BottomSheet>
      </>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('header.shareCurrentView')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {dialogContent}
        </div>
      </DialogContent>
    </Dialog>
  )
}