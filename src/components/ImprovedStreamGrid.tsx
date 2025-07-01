'use client'

import { useEffect, useMemo, useState } from 'react'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Layout, Users, Zap } from 'lucide-react'
import { LoadingState, GridSkeleton } from '@/components/ui/loading-spinner'
import { ErrorState } from '@/components/ui/error-boundary'
import StreamEmbedOptimized from './StreamEmbedOptimized'
import EnhancedStreamCard from './EnhancedStreamCard'

interface ImprovedStreamGridProps {
  className?: string
  showEnhancedCards?: boolean
}

export default function ImprovedStreamGrid({ 
  className,
  showEnhancedCards = false 
}: ImprovedStreamGridProps) {
  const { 
    streams, 
    gridLayout, 
    primaryStreamId,
    toggleStreamMute,
    removeStream,
    setPrimaryStream,
    addStream
  } = useStreamStore()
  
  const { trackFeatureUsage } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)

  const activeStreams = streams.filter(stream => stream.isActive)
  const streamCount = activeStreams.length

  // Calculate grid configuration based on stream count and layout
  const gridConfig = useMemo(() => {
    if (gridLayout === 'pip' && primaryStreamId) {
      return {
        gridClass: 'grid-cols-4 grid-rows-3',
        primaryClass: 'col-span-3 row-span-3',
        secondaryClass: 'col-span-1 row-span-1'
      }
    }

    // Responsive grid configurations
    switch (streamCount) {
      case 0:
        return { gridClass: 'grid-cols-1', primaryClass: '', secondaryClass: '' }
      case 1:
        return { gridClass: 'grid-cols-1', primaryClass: '', secondaryClass: '' }
      case 2:
        return { gridClass: 'grid-cols-1 md:grid-cols-2', primaryClass: '', secondaryClass: '' }
      case 3:
        return { 
          gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2', 
          primaryClass: 'md:col-span-2 lg:col-span-2',
          secondaryClass: ''
        }
      case 4:
        return { gridClass: 'grid-cols-1 md:grid-cols-2', primaryClass: '', secondaryClass: '' }
      case 5:
      case 6:
        return { gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', primaryClass: '', secondaryClass: '' }
      case 7:
      case 8:
      case 9:
        return { gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', primaryClass: '', secondaryClass: '' }
      default:
        return { gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', primaryClass: '', secondaryClass: '' }
    }
  }, [streamCount, gridLayout, primaryStreamId])

  const handleAddStreamClick = () => {
    // This would trigger the add stream dialog in the parent component
    trackFeatureUsage('add_stream_empty_state')
  }

  const handleToggleMute = (streamId: string) => {
    toggleStreamMute(streamId)
    trackFeatureUsage('toggle_mute')
  }

  const handleRemoveStream = (streamId: string) => {
    removeStream(streamId)
    trackFeatureUsage('remove_stream')
  }

  const handleTogglePrimary = (streamId: string) => {
    const newPrimaryId = streamId === primaryStreamId ? '' : streamId
    setPrimaryStream(newPrimaryId)
    trackFeatureUsage('toggle_primary')
  }

  // Empty state
  if (streamCount === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center p-8', className)}>
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Layout className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Streams Added</h3>
            <p className="text-muted-foreground mb-6">
              Add streams to start watching multiple channels simultaneously. 
              Support for Twitch, YouTube, and more platforms.
            </p>
            <div className="space-y-3">
              <Button onClick={handleAddStreamClick} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Stream
              </Button>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Up to 16 streams
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Multiple platforms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('flex-1 p-4', className)}>
        <GridSkeleton count={streamCount} />
      </div>
    )
  }

  // Focus layout with primary stream
  if (gridLayout === 'pip' && primaryStreamId) {
    const primaryStream = activeStreams.find(s => s.id === primaryStreamId)
    const secondaryStreams = activeStreams.filter(s => s.id !== primaryStreamId)

    return (
      <div className={cn('flex-1 p-4 h-full', className)}>
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
          {/* Primary Stream */}
          {primaryStream && (
            <div className="col-span-3 row-span-3">
              {showEnhancedCards ? (
                <EnhancedStreamCard
                  stream={primaryStream}
                  isPrimary={true}
                  onToggleMute={() => handleToggleMute(primaryStream.id)}
                  onRemove={() => handleRemoveStream(primaryStream.id)}
                  onTogglePrimary={() => handleTogglePrimary(primaryStream.id)}
                  className="h-full"
                />
              ) : (
                <div className="h-full bg-black rounded-lg overflow-hidden">
                  <StreamEmbedOptimized stream={primaryStream} />
                </div>
              )}
            </div>
          )}

          {/* Secondary Streams */}
          {secondaryStreams.slice(0, 3).map((stream) => (
            <div key={stream.id} className="col-span-1 row-span-1">
              {showEnhancedCards ? (
                <EnhancedStreamCard
                  stream={stream}
                  isPrimary={false}
                  onToggleMute={() => handleToggleMute(stream.id)}
                  onRemove={() => handleRemoveStream(stream.id)}
                  onTogglePrimary={() => handleTogglePrimary(stream.id)}
                  className="h-full"
                />
              ) : (
                <div className="h-full bg-black rounded-lg overflow-hidden">
                  <StreamEmbedOptimized stream={stream} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Regular grid layout
  return (
    <div className={cn('flex-1 p-4', className)}>
      <div 
        className={cn(
          'grid gap-4 auto-rows-fr',
          gridConfig.gridClass
        )}
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        {activeStreams.map((stream, index) => {
          const isPrimary = stream.id === primaryStreamId
          const isFirstInThree = streamCount === 3 && index === 0
          
          return (
            <div 
              key={stream.id}
              className={cn(
                'min-h-[200px] md:min-h-[250px]',
                isFirstInThree && gridConfig.primaryClass,
                'relative'
              )}
            >
              {showEnhancedCards ? (
                <EnhancedStreamCard
                  stream={stream}
                  isPrimary={isPrimary}
                  onToggleMute={() => handleToggleMute(stream.id)}
                  onRemove={() => handleRemoveStream(stream.id)}
                  onTogglePrimary={() => handleTogglePrimary(stream.id)}
                  className="h-full"
                />
              ) : (
                <div className="h-full bg-black rounded-lg overflow-hidden relative">
                  <StreamEmbedOptimized stream={stream} />
                  
                  {/* Stream Info Overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0">
                      {stream.channelName}
                    </Badge>
                  </div>
                  
                  {isPrimary && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-primary text-primary-foreground">
                        PRIMARY
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stream Count Indicator */}
      <div className="mt-4 text-center">
        <Badge variant="outline" className="gap-2">
          <Users className="w-3 h-3" />
          {streamCount} of 16 streams
        </Badge>
      </div>
    </div>
  )
}