export interface StreamInfo {
  isLive: boolean;
  viewerCount: number;
  gameName: string;
  title: string;
  thumbnailUrl: string;
  startedAt: string | null;
}

interface CachedStreamData {
  data: StreamInfo;
  timestamp: number;
}

export type StreamStatusMap = Map<string, StreamInfo>;

class TwitchService {
  private cache = new Map<string, CachedStreamData>();
  private cacheTimeout = 60000; // 1 minute cache
  private batchDelay = 100; // 100ms delay for batching requests
  private pendingChannels: Set<string> = new Set();
  private batchTimeout: NodeJS.Timeout | null = null;
  private resolvers: Map<string, ((value: StreamInfo) => void)[]> = new Map();

  async getStreamStatus(channels: string[]): Promise<StreamStatusMap> {
    const now = Date.now();
    const results = new Map<string, StreamInfo>();
    const promises: Promise<void>[] = [];

    for (const channel of channels) {
      const channelLower = channel.toLowerCase();
      const cached = this.cache.get(channelLower);
      
      if (cached && now - cached.timestamp < this.cacheTimeout) {
        results.set(channel, cached.data);
      } else {
        // Add to batch and get promise
        const promise = this.addToBatch(channelLower).then(data => {
          results.set(channel, data);
        });
        promises.push(promise);
      }
    }

    // Wait for all batch requests to complete
    await Promise.all(promises);
    return results;
  }

  private addToBatch(channel: string): Promise<StreamInfo> {
    return new Promise((resolve) => {
      // Add channel to pending batch
      this.pendingChannels.add(channel);
      
      // Add resolver
      if (!this.resolvers.has(channel)) {
        this.resolvers.set(channel, []);
      }
      this.resolvers.get(channel)!.push(resolve);

      // Schedule batch processing
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => this.processBatch(), this.batchDelay);
      }
    });
  }

  private async processBatch() {
    if (this.pendingChannels.size === 0) {
      this.batchTimeout = null;
      return;
    }

    // Get channels to process
    const channels = Array.from(this.pendingChannels);
    this.pendingChannels.clear();
    this.batchTimeout = null;

    try {
      // Fetch data for all channels in batch
      const response = await fetch('/api/twitch/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stream data');
      }

      const data = await response.json();
      const now = Date.now();

      // Process results and update cache
      data.results.forEach((result: any) => {
        const streamInfo: StreamInfo = {
          isLive: result.isLive,
          viewerCount: result.data?.viewer_count || 0,
          gameName: result.data?.game_name || '',
          title: result.data?.title || '',
          thumbnailUrl: result.data?.thumbnail_url || '',
          startedAt: result.data?.started_at || null
        };

        // Update cache
        this.cache.set(result.channel, {
          data: streamInfo,
          timestamp: now
        });

        // Resolve promises
        const resolvers = this.resolvers.get(result.channel) || [];
        resolvers.forEach(resolve => resolve(streamInfo));
        this.resolvers.delete(result.channel);
      });
    } catch (error) {
      console.error('Twitch service error:', error);
      
      // Resolve with offline status on error
      channels.forEach(channel => {
        const offlineInfo: StreamInfo = {
          isLive: false,
          viewerCount: 0,
          gameName: '',
          title: '',
          thumbnailUrl: '',
          startedAt: null
        };

        const resolvers = this.resolvers.get(channel) || [];
        resolvers.forEach(resolve => resolve(offlineInfo));
        this.resolvers.delete(channel);
      });
    }
  }

  // Clear cache for specific channels
  clearCache(channels?: string[]) {
    if (channels) {
      channels.forEach(channel => {
        this.cache.delete(channel.toLowerCase());
      });
    } else {
      this.cache.clear();
    }
  }

  // Get cache size for monitoring
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const twitchService = new TwitchService();