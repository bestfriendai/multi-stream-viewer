'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bookmark, Save, Trash2, Play, Clock } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { getSavedLayouts, saveLayout, deleteLayout, DEFAULT_PRESETS } from '@/lib/savedLayouts'
import type { SavedLayout } from '@/lib/savedLayouts'
import { toast } from 'sonner'

interface SavedLayoutsDialogProps {
  mobile?: boolean
}

export default function SavedLayoutsDialog({ mobile = false }: SavedLayoutsDialogProps) {
  const [layouts, setLayouts] = useState<SavedLayout[]>([])
  const [newLayoutName, setNewLayoutName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const { streams, gridLayout, clearAllStreams, addStream, setGridLayout } = useStreamStore()
  
  useEffect(() => {
    setLayouts(getSavedLayouts())
  }, [])
  
  const handleSaveLayout = () => {
    if (!newLayoutName.trim()) {
      toast.error('Please enter a layout name')
      return
    }
    
    if (streams.length === 0) {
      toast.error('No streams to save')
      return
    }
    
    const newLayout = saveLayout(newLayoutName, [...streams], gridLayout)
    setLayouts([...layouts, newLayout])
    setNewLayoutName('')
    setShowSaveForm(false)
    toast.success('Layout saved!')
  }
  
  const handleLoadLayout = (layout: SavedLayout) => {
    clearAllStreams()
    
    // Add all streams from the layout
    layout.streams.forEach(stream => {
      const input = stream.platform === 'twitch' 
        ? stream.channelName 
        : `${stream.platform}:${stream.channelId || stream.channelName}`
      addStream(input)
    })
    
    setGridLayout(layout.gridLayout as any)
    toast.success(`Loaded "${layout.name}"`)
  }
  
  const handleDeleteLayout = (layoutId: string) => {
    deleteLayout(layoutId)
    setLayouts(layouts.filter(l => l.id !== layoutId))
    toast.success('Layout deleted')
  }
  
  const allLayouts = [...DEFAULT_PRESETS, ...layouts]
  
  const trigger = mobile ? (
    <Button variant="outline" className="w-full justify-start h-12">
      <Bookmark className="mr-3 h-5 w-5" />
      Saved Layouts
    </Button>
  ) : (
    <Button variant="outline" size="sm" className="h-9">
      <Bookmark size={16} className="mr-2" />
      Layouts
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Layouts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Save current layout */}
          <div className="border rounded-lg p-4">
            {showSaveForm ? (
              <div className="space-y-2">
                <Input
                  placeholder="Layout name"
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveLayout()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveLayout} size="sm">
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowSaveForm(false)
                      setNewLayoutName('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowSaveForm(true)}
                disabled={streams.length === 0}
                className="w-full"
              >
                <Save size={16} className="mr-2" />
                Save Current Layout
              </Button>
            )}
          </div>
          
          {/* Layout list */}
          <div className="grid gap-2">
            {allLayouts.map(layout => (
              <Card key={layout.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {layout.name}
                      {layout.id.startsWith('preset-') && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          Preset
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {layout.streams.length} streams • {layout.gridLayout} layout
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {layout.streams.map((stream, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {stream.channelName}
                        </span>
                      ))}
                    </div>
                    {layout.createdAt > 0 && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(layout.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleLoadLayout(layout)}
                    >
                      <Play size={14} className="mr-1" />
                      Load
                    </Button>
                    {!layout.id.startsWith('preset-') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteLayout(layout.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}