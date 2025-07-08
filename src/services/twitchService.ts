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
  private cacheTimeout = 180000; // 3 minute cache to reduce API calls
  private batchDelay = 1000; // 1 second delay for better batching
  private pendingChannels: Set<string> = new Set();
  private batchTimeout: NodeJS.Timeout | null = null;
  private resolvers: Map<string, ((value: StreamInfo) => void)[]> = new Map();
  private retryAfter: number = 0;
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private requestResetTime: number = Date.now() + 60000;
  private isProcessing: boolean = false; // Prevent concurrent batch processing

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
    // Prevent concurrent processing
    if (this.isProcessing || this.pendingChannels.size === 0) {
      this.batchTimeout = null;
      return;
    }

    // Check if we're in a rate limit cooldown
    if (this.retryAfter > Date.now()) {
      // Reschedule for after the cooldown
      this.batchTimeout = setTimeout(() => this.processBatch(), this.retryAfter - Date.now() + 100);
      return;
    }

    // Simple client-side rate limiting
    const now = Date.now();
    if (now > this.requestResetTime) {
      this.requestCount = 0;
      this.requestResetTime = now + 60000;
    }
    
    if (this.requestCount >= 5) { // Reduced to 5 requests per minute
      // Reschedule for next minute
      this.batchTimeout = setTimeout(() => this.processBatch(), this.requestResetTime - now + 100);
      return;
    }

    // Mark as processing
    this.isProcessing = true;
    
    // Get channels to process
    const channels = Array.from(this.pendingChannels).slice(0, 50); // Limit batch size
    channels.forEach(ch => this.pendingChannels.delete(ch));
    this.batchTimeout = null;
    this.requestCount++;
    this.lastRequestTime = now;

    try {
      // Fetch data for all channels in batch
      const response = await fetch('/api/twitch/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels })
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Handle rate limit
          const retryAfterHeader = response.headers.get('Retry-After');
          const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 60;
          this.retryAfter = Date.now() + (retryAfterSeconds * 1000);
          
          console.warn(`Rate limited. Retrying after ${retryAfterSeconds} seconds`);
          
          // Reschedule pending requests
          channels.forEach(channel => {
            this.pendingChannels.add(channel);
          });
          
          if (!this.batchTimeout) {
            this.batchTimeout = setTimeout(() => this.processBatch(), retryAfterSeconds * 1000 + 100);
          }
          
          // Return offline status for now
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
          
          return;
        }
        
        // For other non-200 responses, log but don't throw
        console.warn(`Twitch API returned ${response.status} for channels:`, channels, 'treating streams as offline');
        
        // Return offline status instead of throwing
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
        
        return; // Exit early instead of throwing
      }

      const data = await response.json();
      const now = Date.now();

      // Check if we got valid results
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Invalid response from Twitch API:', data);
        throw new Error('Invalid API response');
      }

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
      console.warn('Twitch service error (degrading gracefully):', error);
      
      // Resolve with offline status on error (graceful degradation)
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
    } finally {
      // Always mark as not processing
      this.isProcessing = false;
      
      // If there are more pending channels, schedule next batch
      if (this.pendingChannels.size > 0 && !this.batchTimeout) {
        this.batchTimeout = setTimeout(() => this.processBatch(), this.batchDelay);
      }
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