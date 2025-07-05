interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  lastAccessed: number
}

interface CacheStats {
  size: number
  hits: number
  misses: number
  evictions: number
  hitRate: number
}

interface CacheConfig {
  maxSize: number
  defaultTTL: number
  cleanupInterval: number
  enableCompression: boolean
  enableMetrics: boolean
}

export class ApiCache {
  private cache = new Map<string, CacheEntry>()
  private stats: CacheStats = {
    size: 0,
    hits: 0,
    misses: 0,
    evictions: 0,
    hitRate: 0
  }
  private cleanupTimer: NodeJS.Timeout | null = null
  private config: CacheConfig

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      enableCompression: false,
      enableMetrics: true,
      ...config
    }

    this.startCleanup()
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    const now = Date.now()
    
    // Check if expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.stats.misses++
      this.stats.size--
      this.updateHitRate()
      return null
    }

    // Update access stats
    entry.hits++
    entry.lastAccessed = now
    this.stats.hits++
    this.updateHitRate()

    // Decompress if needed
    let data = entry.data
    if (this.config.enableCompression && typeof data === 'string' && data.startsWith('COMPRESSED:')) {
      try {
        data = JSON.parse(atob(data.substring(11)))
      } catch (error) {
        console.warn('Failed to decompress cache entry:', error)
        return null
      }
    }

    return data
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const now = Date.now()
    const entryTTL = ttl || this.config.defaultTTL

    // Compress if enabled and data is large
    let processedData = data
    if (this.config.enableCompression && this.shouldCompress(data)) {
      try {
        processedData = `COMPRESSED:${btoa(JSON.stringify(data))}` as T
      } catch (error) {
        console.warn('Failed to compress cache entry:', error)
      }
    }

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU()
    }

    const entry: CacheEntry<T> = {
      data: processedData,
      timestamp: now,
      ttl: entryTTL,
      hits: 0,
      lastAccessed: now
    }

    this.cache.set(key, entry)
    this.stats.size = this.cache.size
  }

  async invalidate(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear()
      this.stats.size = 0
      return
    }

    // Support simple wildcard patterns
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
    
    this.stats.size = this.cache.size
  }

  async warmup<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Check if already cached
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch and cache
    const data = await fetcher()
    await this.set(key, data, ttl)
    return data
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return

    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.stats.evictions++
      this.stats.size = this.cache.size
    }
  }

  private shouldCompress(data: any): boolean {
    if (typeof data !== 'object') return false
    
    try {
      const serialized = JSON.stringify(data)
      return serialized.length > 1024 // Compress if larger than 1KB
    } catch {
      return false
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key)
      }
    }

    toDelete.forEach(key => this.cache.delete(key))
    this.stats.size = this.cache.size
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.cache.clear()
  }
}

// Singleton instance
export const apiCache = new ApiCache({
  maxSize: 500,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 2 * 60 * 1000, // 2 minutes
  enableCompression: true,
  enableMetrics: true
})

// Request deduplication
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Check if request is already in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    // Create new request
    const promise = fetcher()
      .finally(() => {
        // Clean up when done
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, promise)
    return promise
  }

  clear(): void {
    this.pendingRequests.clear()
  }
}

export const requestDeduplicator = new RequestDeduplicator()

// High-level cache wrapper with deduplication
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    force?: boolean
    dedupe?: boolean
  } = {}
): Promise<T> {
  const { ttl, force = false, dedupe = true } = options

  // Check cache first (unless force refresh)
  if (!force) {
    const cached = await apiCache.get<T>(key)
    if (cached !== null) {
      return cached
    }
  }

  // Use deduplication if enabled
  const fetcherFn = dedupe 
    ? () => requestDeduplicator.dedupe(key, fetcher)
    : fetcher

  // Fetch and cache
  try {
    const data = await fetcherFn()
    await apiCache.set(key, data, ttl)
    return data
  } catch (error) {
    // Don't cache errors, but clean up any pending requests
    if (dedupe) {
      requestDeduplicator.clear()
    }
    throw error
  }
}

// Cache key builders
export const CacheKeys = {
  streamMetadata: (streamId: string) => `stream:metadata:${streamId}`,
  twitchUser: (username: string) => `twitch:user:${username}`,
  twitchStream: (username: string) => `twitch:stream:${username}`,
  youtubeVideo: (videoId: string) => `youtube:video:${videoId}`,
  youtubeChannel: (channelId: string) => `youtube:channel:${channelId}`,
  rumbleChannel: (channelId: string) => `rumble:channel:${channelId}`,
  twitchProfileImage: (username: string) => `twitch:profile:${username}`,
  streamThumbnail: (streamId: string) => `stream:thumbnail:${streamId}`,
  searchResults: (query: string, platform: string) => `search:${platform}:${query}`,
  trending: (platform: string) => `trending:${platform}`,
  recommendations: (userId: string) => `recommendations:${userId}`
}

// Cache warming functions
export const warmCache = {
  async streamMetadata(streamIds: string[]): Promise<void> {
    const promises = streamIds.map(async (id) => {
      const key = CacheKeys.streamMetadata(id)
      try {
        // This would call your actual stream metadata API
        await cachedFetch(key, async () => {
          // Placeholder for actual API call
          return { id, status: 'unknown' }
        }, { ttl: 10 * 60 * 1000 }) // 10 minutes
      } catch (error) {
        console.warn(`Failed to warm cache for stream ${id}:`, error)
      }
    })
    
    await Promise.allSettled(promises)
  },

  async twitchProfiles(usernames: string[]): Promise<void> {
    const promises = usernames.map(async (username) => {
      const key = CacheKeys.twitchProfileImage(username)
      try {
        await cachedFetch(key, async () => {
          // This would call your Twitch profile image fetcher
          return `https://static-cdn.jtvnw.net/jtv_user_pictures/${username}-profile_image-300x300.png`
        }, { ttl: 24 * 60 * 60 * 1000 }) // 24 hours
      } catch (error) {
        console.warn(`Failed to warm cache for Twitch profile ${username}:`, error)
      }
    })
    
    await Promise.allSettled(promises)
  }
}