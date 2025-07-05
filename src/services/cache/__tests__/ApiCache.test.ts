import { ApiCache, cachedFetch, requestDeduplicator, CacheKeys } from '../ApiCache'

describe('ApiCache', () => {
  let cache: ApiCache

  beforeEach(() => {
    cache = new ApiCache({
      maxSize: 10,
      defaultTTL: 1000,
      cleanupInterval: 100,
      enableCompression: false,
      enableMetrics: true
    })
  })

  afterEach(() => {
    cache.destroy()
  })

  describe('basic operations', () => {
    it('stores and retrieves data correctly', async () => {
      const testData = { name: 'test', value: 123 }
      
      await cache.set('test-key', testData)
      const retrieved = await cache.get('test-key')
      
      expect(retrieved).toEqual(testData)
    })

    it('returns null for non-existent keys', async () => {
      const result = await cache.get('non-existent')
      expect(result).toBeNull()
    })

    it('respects TTL and expires entries', async () => {
      const testData = { name: 'test' }
      
      await cache.set('test-key', testData, 50) // 50ms TTL
      
      // Should be available immediately
      let result = await cache.get('test-key')
      expect(result).toEqual(testData)
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100))
      
      result = await cache.get('test-key')
      expect(result).toBeNull()
    })

    it('updates access statistics correctly', async () => {
      await cache.set('test-key', 'test-data')
      
      // Initial stats
      let stats = cache.getStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      
      // Cache hit
      await cache.get('test-key')
      stats = cache.getStats()
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(0)
      
      // Cache miss
      await cache.get('non-existent')
      stats = cache.getStats()
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
      
      expect(stats.hitRate).toBe(0.5)
    })
  })

  describe('LRU eviction', () => {
    it('evicts least recently used entries when max size is reached', async () => {
      // Fill cache to max size
      for (let i = 0; i < 10; i++) {
        await cache.set(`key-${i}`, `data-${i}`)
      }
      
      // All entries should be present
      for (let i = 0; i < 10; i++) {
        const result = await cache.get(`key-${i}`)
        expect(result).toBe(`data-${i}`)
      }
      
      // Add one more entry to trigger eviction
      await cache.set('key-10', 'data-10')
      
      // First entry should be evicted (LRU)
      const evicted = await cache.get('key-0')
      expect(evicted).toBeNull()
      
      // Last entry should be present
      const newest = await cache.get('key-10')
      expect(newest).toBe('data-10')
    })

    it('updates LRU order on access', async () => {
      // Fill cache
      for (let i = 0; i < 10; i++) {
        await cache.set(`key-${i}`, `data-${i}`)
      }
      
      // Access first entry to make it recently used
      await cache.get('key-0')
      
      // Add new entry to trigger eviction
      await cache.set('key-10', 'data-10')
      
      // key-0 should still exist (was recently accessed)
      const recentlyUsed = await cache.get('key-0')
      expect(recentlyUsed).toBe('data-0')
      
      // key-1 should be evicted instead
      const evicted = await cache.get('key-1')
      expect(evicted).toBeNull()
    })
  })

  describe('compression', () => {
    it('compresses large data when enabled', async () => {
      const compressedCache = new ApiCache({
        maxSize: 10,
        enableCompression: true
      })
      
      const largeData = {
        data: 'x'.repeat(2000), // Large string to trigger compression
        array: new Array(100).fill({ nested: 'object' })
      }
      
      await compressedCache.set('large-key', largeData)
      const retrieved = await compressedCache.get('large-key')
      
      expect(retrieved).toEqual(largeData)
      
      compressedCache.destroy()
    })
  })

  describe('invalidation', () => {
    it('clears all entries when no pattern is provided', async () => {
      await cache.set('key1', 'data1')
      await cache.set('key2', 'data2')
      
      await cache.invalidate()
      
      expect(await cache.get('key1')).toBeNull()
      expect(await cache.get('key2')).toBeNull()
    })

    it('invalidates entries matching pattern', async () => {
      await cache.set('user:123', 'user-data')
      await cache.set('user:456', 'user-data-2')
      await cache.set('post:789', 'post-data')
      
      await cache.invalidate('user:*')
      
      expect(await cache.get('user:123')).toBeNull()
      expect(await cache.get('user:456')).toBeNull()
      expect(await cache.get('post:789')).toBe('post-data')
    })
  })

  describe('warmup', () => {
    it('fetches and caches data if not present', async () => {
      const fetcher = jest.fn().mockResolvedValue('fetched-data')
      
      const result = await cache.warmup('warm-key', fetcher)
      
      expect(fetcher).toHaveBeenCalledTimes(1)
      expect(result).toBe('fetched-data')
      expect(await cache.get('warm-key')).toBe('fetched-data')
    })

    it('returns cached data without calling fetcher', async () => {
      await cache.set('warm-key', 'cached-data')
      
      const fetcher = jest.fn().mockResolvedValue('fetched-data')
      const result = await cache.warmup('warm-key', fetcher)
      
      expect(fetcher).not.toHaveBeenCalled()
      expect(result).toBe('cached-data')
    })
  })
})

describe('RequestDeduplicator', () => {
  beforeEach(() => {
    requestDeduplicator.clear()
  })

  it('deduplicates concurrent requests', async () => {
    const fetcher = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('data'), 100))
    )
    
    // Start multiple concurrent requests
    const promises = [
      requestDeduplicator.dedupe('test-key', fetcher),
      requestDeduplicator.dedupe('test-key', fetcher),
      requestDeduplicator.dedupe('test-key', fetcher)
    ]
    
    const results = await Promise.all(promises)
    
    // Fetcher should only be called once
    expect(fetcher).toHaveBeenCalledTimes(1)
    
    // All requests should return the same result
    expect(results).toEqual(['data', 'data', 'data'])
  })

  it('allows new requests after completion', async () => {
    const fetcher = jest.fn()
      .mockResolvedValueOnce('data-1')
      .mockResolvedValueOnce('data-2')
    
    const result1 = await requestDeduplicator.dedupe('test-key', fetcher)
    const result2 = await requestDeduplicator.dedupe('test-key', fetcher)
    
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(result1).toBe('data-1')
    expect(result2).toBe('data-2')
  })
})

describe('cachedFetch', () => {
  beforeEach(() => {
    // Mock the global cache
    jest.clearAllMocks()
  })

  it('caches successful responses', async () => {
    const fetcher = jest.fn().mockResolvedValue('test-data')
    
    const result1 = await cachedFetch('test-key', fetcher)
    const result2 = await cachedFetch('test-key', fetcher)
    
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result1).toBe('test-data')
    expect(result2).toBe('test-data')
  })

  it('forces refresh when requested', async () => {
    const fetcher = jest.fn()
      .mockResolvedValueOnce('old-data')
      .mockResolvedValueOnce('new-data')
    
    await cachedFetch('test-key', fetcher)
    const result = await cachedFetch('test-key', fetcher, { force: true })
    
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(result).toBe('new-data')
  })

  it('does not cache errors', async () => {
    const fetcher = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce('success-data')
    
    await expect(cachedFetch('test-key', fetcher)).rejects.toThrow('Network error')
    
    const result = await cachedFetch('test-key', fetcher)
    expect(result).toBe('success-data')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('disables deduplication when requested', async () => {
    const fetcher = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('data'), 50))
    )
    
    const promises = [
      cachedFetch('test-key', fetcher, { dedupe: false }),
      cachedFetch('test-key', fetcher, { dedupe: false })
    ]
    
    await Promise.all(promises)
    
    // Without deduplication, fetcher should be called multiple times
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})

describe('CacheKeys', () => {
  it('generates correct cache keys', () => {
    expect(CacheKeys.streamMetadata('stream-123')).toBe('stream:metadata:stream-123')
    expect(CacheKeys.twitchUser('username')).toBe('twitch:user:username')
    expect(CacheKeys.searchResults('cats', 'twitch')).toBe('search:twitch:cats')
  })
})