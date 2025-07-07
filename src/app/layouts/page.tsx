'use client'

// Force dynamic rendering for this protected route
export const dynamic = 'force-dynamic';

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid3x3, Grid2x2, Layers, PictureInPicture, Focus, Layout } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'

const layouts = [
  {
    id: 'grid-2x2',
    name: '2x2 Grid',
    description: 'Perfect for 4 streams',
    icon: Grid2x2,
    maxStreams: 4
  },
  {
    id: 'grid-3x3',
    name: '3x3 Grid',
    description: 'Ideal for 9 streams',
    icon: Grid3x3,
    maxStreams: 9
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    description: 'Dynamic adaptive layout',
    icon: Layout,
    maxStreams: 16
  },
  {
    id: 'focus',
    name: 'Focus Mode',
    description: 'One main stream with others minimized',
    icon: Focus,
    maxStreams: 8
  },
  {
    id: 'pip',
    name: 'Picture-in-Picture',
    description: 'Main stream with floating overlays',
    icon: PictureInPicture,
    maxStreams: 6
  },
  {
    id: 'custom',
    name: 'Custom Layout',
    description: 'Drag and arrange streams freely',
    icon: Layers,
    maxStreams: 12
  }
]

export default function LayoutsPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { setGridLayout, gridLayout, streams } = useStreamStore()
  const [selectedLayout, setSelectedLayout] = useState(gridLayout)

  const handleLayoutSelect = (layoutId: string) => {
    setSelectedLayout(layoutId as any)
    setGridLayout(layoutId as any)
  }

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Stream Layouts</h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect layout for your multi-stream viewing experience
          </p>
          {isSignedIn && (
            <p className="text-sm text-muted-foreground mt-2">
              Welcome back! Your layout preferences are automatically saved.
            </p>
          )}
        </div>

        <div className="mb-6">
          <Badge variant="outline" className="mb-4">
            {streams.length} stream{streams.length !== 1 ? 's' : ''} active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layouts.map((layout) => {
            const Icon = layout.icon
            const isSelected = selectedLayout === layout.id
            const isDisabled = streams.length > layout.maxStreams

            return (
              <Card 
                key={layout.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary border-primary' : ''
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && handleLayoutSelect(layout.id)}
              >
                <CardHeader className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-2" />
                  <CardTitle className="text-lg">{layout.name}</CardTitle>
                  <CardDescription>{layout.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge variant={isDisabled ? "destructive" : "secondary"}>
                      Max {layout.maxStreams} streams
                    </Badge>
                    {isSelected && (
                      <Badge variant="default" className="ml-2">
                        Active
                      </Badge>
                    )}
                    {isDisabled && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Too many streams for this layout
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            Back to Streams
          </Button>
        </div>
      </div>
    </div>
  )
}