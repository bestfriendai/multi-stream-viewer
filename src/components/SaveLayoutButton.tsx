'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSavedLayouts } from '@/hooks/useSupabaseData'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface SaveLayoutButtonProps {
  currentLayout: any
  className?: string
}

export function SaveLayoutButton({ currentLayout, className }: SaveLayoutButtonProps) {
  const { isSignedIn } = useAuth()
  const { saveLayout } = useSavedLayouts()
  const [isOpen, setIsOpen] = useState(false)
  const [layoutName, setLayoutName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!layoutName.trim()) {
      toast.error('Please enter a layout name')
      return
    }

    if (!currentLayout) {
      toast.error('No layout to save')
      return
    }

    setIsLoading(true)
    try {
      await saveLayout(layoutName.trim(), currentLayout)
      toast.success('Layout saved successfully!')
      setLayoutName('')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to save layout')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={className}
        disabled
      >
        <Save className="h-4 w-4 mr-2" />
        Sign in to save layouts
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Layout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Current Layout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="layout-name" className="text-sm font-medium">
              Layout Name
            </label>
            <Input
              id="layout-name"
              placeholder="My awesome layout"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || !layoutName.trim()}
            >
              {isLoading ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}