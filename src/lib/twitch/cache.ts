interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class TwitchCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 120000; // 2 minutes default

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });

    // Cleanup expired entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const data = this.get(key);
    return data !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    let oldest = Date.now();
    let newest = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldest) oldest = entry.timestamp;
      if (entry.timestamp > newest) newest = entry.timestamp;
    }

    return {
      size: this.cache.size,
      oldestEntry: oldest,
      newestEntry: newest
    };
  }
}

// Singleton instance
export const twitchCache = new TwitchCache();