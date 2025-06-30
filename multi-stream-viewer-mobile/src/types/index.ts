export interface Stream {
  id: string;
  platform: 'twitch' | 'youtube' | 'kick' | 'custom';
  channelName: string;
  displayName: string;
  title: string;
  category: string;
  viewerCount: number;
  thumbnailUrl: string;
  avatarUrl: string;
  streamUrl: string;
  isLive: boolean;
  startedAt: string;
  language: string;
  tags: string[];
}

export interface StreamState {
  id: string;
  volume: number;
  isMuted: boolean;
  quality: 'auto' | '1080p' | '720p' | '480p' | '360p';
  isFullscreen: boolean;
  position: number;
  isPinned: boolean;
}

export interface DiscoveryCategory {
  id: string;
  name: string;
  viewerCount: number;
  thumbnailUrl: string;
}

export interface WatchPartySession {
  id: string;
  hostId: string;
  participants: string[];
  streams: string[];
  reactions: Reaction[];
  isActive: boolean;
  createdAt: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultQuality: 'auto' | '1080p' | '720p' | '480p' | '360p';
  autoplay: boolean;
  lowLatencyMode: boolean;
  chatEnabled: boolean;
  notificationsEnabled: boolean;
  gridLayout: 'auto' | '1x1' | '2x2' | '3x3' | 'custom';
}

export interface AnalyticsData {
  totalWatchTime: number;
  favoriteStreams: string[];
  watchHistory: WatchHistoryItem[];
  peakViewers: number;
  averageSessionDuration: number;
}

export interface WatchHistoryItem {
  streamId: string;
  watchedAt: string;
  duration: number;
}