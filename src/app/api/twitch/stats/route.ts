import { NextResponse } from 'next/server';
import { twitchCache } from '@/lib/twitch/cache';

export async function GET() {
  const cacheStats = twitchCache.getStats();
  
  return NextResponse.json({
    cache: {
      ...cacheStats,
      ageInSeconds: cacheStats.size > 0 ? 
        Math.floor((Date.now() - cacheStats.oldestEntry) / 1000) : 0
    },
    timestamp: new Date().toISOString()
  });
}