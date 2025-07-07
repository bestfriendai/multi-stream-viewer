// Modern TypeScript types with strict typing for 2025
import type { Subscription } from '@/lib/subscription'

export const PLATFORMS = ['twitch', 'youtube', 'rumble'] as const;
export type Platform = typeof PLATFORMS[number];

export const QUALITIES = ['auto', '160p', '360p', '480p', '720p', '1080p'] as const;
export type Quality = typeof QUALITIES[number];

export const GRID_LAYOUTS = [
  '1x1', '2x1', '1x2', '2x2', '3x3', '4x4',
  'custom', 'grid-2x2', 'grid-3x3', 'grid-4x4',
  'mosaic', 'pip', 'focus', 'stacked', 'app-mobile'
] as const;
export type GridLayout = typeof GRID_LAYOUTS[number];

// Stream interface with strict typing
export interface Stream {
  readonly id: string;
  readonly channelName: string;
  readonly platform: Platform;
  readonly channelId?: string; // For YouTube video IDs
  quality: Quality;
  volume: number; // 0-100
  position: number;
  isActive: boolean;
  readonly createdAt: Date;
  lastUpdated: Date;
  readonly isSponsored?: boolean; // For sponsored streams
}

// Stream creation input with validation
export interface StreamInput {
  channelName: string;
  platform: Platform;
  channelId?: string;
  quality?: Quality;
  volume?: number;
}

// Stream store state interface
export interface StreamState {
  readonly streams: readonly Stream[];
  readonly activeStreamId: string | null;
  readonly gridLayout: GridLayout;
  readonly primaryStreamId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

// Stream store actions interface  
export interface StreamActions {
  addStream: (input: StreamInput | string, subscription?: Subscription | null) => Promise<boolean>;
  removeStream: (streamId: string) => void;
  setStreamQuality: (streamId: string, quality: Quality) => void;
  setStreamVolume: (streamId: string, volume: number) => void;
  toggleStreamMute: (streamId: string) => void;
  setActiveStream: (streamId: string) => void;
  setPrimaryStream: (streamId: string) => void;
  setGridLayout: (layout: GridLayout) => void;
  reorderStreams: (streams: readonly Stream[]) => void;
  clearAllStreams: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined store interface
export interface StreamStore extends StreamState, StreamActions {}

// Event types for analytics
export interface StreamEvent {
  type: 'stream_added' | 'stream_removed' | 'quality_changed' | 'layout_changed';
  streamId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// Performance metrics
export interface StreamMetrics {
  loadTime: number;
  bufferHealth: number;
  frameDrops: number;
  bitrate: number;
}

// Accessibility features
export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}