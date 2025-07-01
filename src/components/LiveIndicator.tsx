'use client'

import { cn } from '@/lib/utils'

interface LiveIndicatorProps {
  isLive: boolean;
  viewerCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showViewers?: boolean;
  className?: string;
}

export default function LiveIndicator({ 
  isLive, 
  viewerCount = 0, 
  size = 'md',
  showViewers = true,
  className 
}: LiveIndicatorProps) {
  if (!isLive) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full bg-red-600 text-white font-medium",
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("rounded-full bg-white animate-pulse", dotSizes[size])} />
      <span className="uppercase tracking-wide">Live</span>
      {showViewers && viewerCount > 0 && (
        <>
          <span className="opacity-70">•</span>
          <span>{formatViewerCount(viewerCount)}</span>
        </>
      )}
    </div>
  );
}