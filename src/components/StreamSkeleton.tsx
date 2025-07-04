'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StreamSkeletonProps {
  className?: string
  count?: number
}

export default function StreamSkeleton({ className, count = 1 }: StreamSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "relative bg-gray-900 rounded-xl overflow-hidden animate-pulse",
            className
          )}
        >
          {/* Stream content placeholder */}
          <div className="aspect-video bg-gray-800" />
          
          {/* Stream header skeleton */}
          <div className="absolute top-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <div className="w-24 h-6 bg-gray-700 rounded-full" />
              <div className="w-16 h-5 bg-red-900 rounded-full" />
            </div>
          </div>
          
          {/* Control buttons skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:opacity-0">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function StreamGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      <StreamSkeleton count={count} />
    </div>
  )
}

export function MobileStreamSkeleton() {
  return (
    <div className="h-full w-full bg-gray-900 animate-pulse">
      {/* Header skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-800 rounded-lg" />
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-800 rounded-full" />
            <div className="w-10 h-10 bg-gray-800 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Stream skeleton */}
      <div className="px-4">
        <div className="aspect-video bg-gray-800 rounded-xl" />
      </div>
      
      {/* Controls skeleton */}
      <div className="absolute bottom-20 left-0 right-0 p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-full" />
          <div className="w-14 h-14 bg-gray-800 rounded-full" />
          <div className="w-14 h-14 bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  )
}