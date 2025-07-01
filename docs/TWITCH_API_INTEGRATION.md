# Twitch API Integration Guide

## Overview

This document provides a comprehensive guide for integrating the Twitch API into the Multi-Stream Viewer application to display live status, viewer counts, and stream categories.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Authentication Setup](#authentication-setup)
3. [API Endpoints](#api-endpoints)
4. [Implementation Architecture](#implementation-architecture)
5. [Rate Limiting & Best Practices](#rate-limiting--best-practices)
6. [Security Considerations](#security-considerations)
7. [Testing Strategy](#testing-strategy)

## Prerequisites

### Required Accounts & Access
- Twitch Developer Account
- Registered Twitch Application
- Client ID and Client Secret

### Technical Requirements
- Node.js environment for backend API proxy
- Environment variables management
- HTTPS connection (required for production)

## Authentication Setup

### 1. Register Your Application

1. Visit [Twitch Developer Console](https://dev.twitch.tv/console)
2. Click "Register Your Application"
3. Fill in:
   - **Name**: Multi-Stream Viewer
   - **OAuth Redirect URLs**: 
     - Development: `http://localhost:3000/auth/twitch/callback`
     - Production: `https://yourdomain.com/auth/twitch/callback`
   - **Category**: Website Integration
4. Save your **Client ID** and generate a **Client Secret**

### 2. Authentication Flows

#### Client Credentials Flow (Server-Side)
Used for app-to-app authentication, ideal for public data like stream status.

```typescript
// Server-side token generation
async function getAppAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials'
  });

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: params
  });

  const data = await response.json();
  return data.access_token;
}
```

#### Authorization Code Flow (User-Specific)
Required for user-specific data or actions.

```typescript
// Generate authorization URL
function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    redirect_uri: process.env.TWITCH_REDIRECT_URI,
    response_type: 'code',
    scope: 'user:read:email user:read:follows'
  });

  return `https://id.twitch.tv/oauth2/authorize?${params}`;
}
```

### 3. Token Management

```typescript
interface TwitchToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  obtained_at: number;
}

class TokenManager {
  private token: TwitchToken | null = null;

  async getValidToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      this.token = await this.refreshToken();
    }
    return this.token.access_token;
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    const expiryTime = this.token.obtained_at + (this.token.expires_in * 1000);
    return Date.now() >= expiryTime - 300000; // Refresh 5 minutes early
  }

  private async refreshToken(): Promise<TwitchToken> {
    const newToken = await getAppAccessToken();
    return {
      ...newToken,
      obtained_at: Date.now()
    };
  }
}
```

## API Endpoints

### 1. Get Streams (Check Live Status)

```typescript
interface StreamData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

async function getStreams(userLogins: string[]): Promise<StreamData[]> {
  const token = await tokenManager.getValidToken();
  const params = new URLSearchParams();
  
  // Add up to 100 user logins
  userLogins.slice(0, 100).forEach(login => {
    params.append('user_login', login);
  });

  const response = await fetch(`https://api.twitch.tv/helix/streams?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID
    }
  });

  const data = await response.json();
  return data.data;
}
```

### 2. Get Users (Additional User Info)

```typescript
interface UserData {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

async function getUsers(userLogins: string[]): Promise<UserData[]> {
  const token = await tokenManager.getValidToken();
  const params = new URLSearchParams();
  
  userLogins.slice(0, 100).forEach(login => {
    params.append('login', login);
  });

  const response = await fetch(`https://api.twitch.tv/helix/users?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID
    }
  });

  const data = await response.json();
  return data.data;
}
```

### 3. Get Games/Categories

```typescript
interface GameData {
  id: string;
  name: string;
  box_art_url: string;
  igdb_id: string;
}

async function getGames(gameIds: string[]): Promise<GameData[]> {
  const token = await tokenManager.getValidToken();
  const params = new URLSearchParams();
  
  gameIds.slice(0, 100).forEach(id => {
    params.append('id', id);
  });

  const response = await fetch(`https://api.twitch.tv/helix/games?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID
    }
  });

  const data = await response.json();
  return data.data;
}
```

## Implementation Architecture

### 1. Backend API Route Structure

```typescript
// app/api/twitch/streams/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { channels } = await request.json();
    
    // Validate input
    if (!Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json({ error: 'Invalid channels' }, { status: 400 });
    }

    // Get stream data
    const streams = await getStreams(channels);
    
    // Create a map for easy lookup
    const streamMap = new Map(
      streams.map(stream => [stream.user_login.toLowerCase(), stream])
    );

    // Build response with live status for all requested channels
    const results = channels.map(channel => ({
      channel: channel.toLowerCase(),
      isLive: streamMap.has(channel.toLowerCase()),
      data: streamMap.get(channel.toLowerCase()) || null
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream data' },
      { status: 500 }
    );
  }
}
```

### 2. Frontend Service Implementation

```typescript
// services/twitchService.ts
class TwitchService {
  private cache = new Map<string, CachedStreamData>();
  private cacheTimeout = 60000; // 1 minute cache

  async getStreamStatus(channels: string[]): Promise<StreamStatusMap> {
    const now = Date.now();
    const uncachedChannels: string[] = [];
    const results = new Map<string, StreamInfo>();

    // Check cache first
    channels.forEach(channel => {
      const cached = this.cache.get(channel.toLowerCase());
      if (cached && now - cached.timestamp < this.cacheTimeout) {
        results.set(channel, cached.data);
      } else {
        uncachedChannels.push(channel);
      }
    });

    // Fetch uncached data
    if (uncachedChannels.length > 0) {
      const freshData = await this.fetchStreamData(uncachedChannels);
      
      // Update cache and results
      freshData.forEach((data, channel) => {
        this.cache.set(channel, {
          data,
          timestamp: now
        });
        results.set(channel, data);
      });
    }

    return results;
  }

  private async fetchStreamData(channels: string[]): Promise<Map<string, StreamInfo>> {
    const response = await fetch('/api/twitch/streams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels })
    });

    const data = await response.json();
    const resultMap = new Map<string, StreamInfo>();

    data.results.forEach((result: any) => {
      resultMap.set(result.channel, {
        isLive: result.isLive,
        viewerCount: result.data?.viewer_count || 0,
        gameName: result.data?.game_name || '',
        title: result.data?.title || '',
        thumbnailUrl: result.data?.thumbnail_url || '',
        startedAt: result.data?.started_at || null
      });
    });

    return resultMap;
  }
}

export const twitchService = new TwitchService();
```

### 3. React Hook Implementation

```typescript
// hooks/useTwitchStatus.ts
import { useEffect, useState } from 'react';
import { twitchService } from '@/services/twitchService';

export function useTwitchStatus(channels: string[]) {
  const [status, setStatus] = useState<Map<string, StreamInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (channels.length === 0) {
      setStatus(new Map());
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await twitchService.getStreamStatus(channels);
        
        if (!cancelled) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStatus();

    // Refresh every minute
    const interval = setInterval(fetchStatus, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [channels.join(',')]); // Dependency on channel list

  return { status, loading, error };
}
```

## Rate Limiting & Best Practices

### Rate Limits
- **Standard Rate Limit**: 800 requests per minute
- **Burst Limit**: 3000 requests per minute (short bursts)

### Best Practices

1. **Batch Requests**: Get multiple streams in one API call (up to 100)
2. **Implement Caching**: Cache responses for at least 1 minute
3. **Use Webhooks/EventSub**: For real-time updates instead of polling
4. **Handle Errors Gracefully**: Implement exponential backoff
5. **Monitor Usage**: Track API calls to avoid limits

### Rate Limit Handler

```typescript
class RateLimitHandler {
  private requestCount = 0;
  private resetTime = Date.now() + 60000;

  async executeRequest<T>(
    request: () => Promise<T>
  ): Promise<T> {
    // Check rate limit
    if (Date.now() > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = Date.now() + 60000;
    }

    if (this.requestCount >= 800) {
      const waitTime = this.resetTime - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.executeRequest(request);
    }

    this.requestCount++;
    
    try {
      return await request();
    } catch (error: any) {
      if (error.status === 429) {
        // Rate limited, wait and retry
        const retryAfter = parseInt(error.headers.get('Retry-After') || '60');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return this.executeRequest(request);
      }
      throw error;
    }
  }
}
```

## Security Considerations

### 1. Environment Variables

```env
# .env.local
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_REDIRECT_URI=http://localhost:3000/auth/twitch/callback
```

### 2. Security Best Practices

1. **Never expose Client Secret**: Keep it server-side only
2. **Use HTTPS**: Required for production Twitch API calls
3. **Validate Input**: Sanitize channel names before API calls
4. **Implement CORS**: Restrict API access to your domain
5. **Token Storage**: Store tokens securely, never in localStorage for sensitive data

### 3. API Route Protection

```typescript
// Middleware for API routes
export async function validateRequest(request: NextRequest) {
  // Check origin
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000'
  ];

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Rate limiting per IP
  const ip = request.ip || 'unknown';
  const rateLimitKey = `twitch_api_${ip}`;
  
  // Implement rate limiting logic here
  
  return null; // Continue to handler
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// __tests__/twitchService.test.ts
describe('TwitchService', () => {
  it('should fetch stream status for multiple channels', async () => {
    const channels = ['shroud', 'ninja', 'pokimane'];
    const status = await twitchService.getStreamStatus(channels);
    
    expect(status).toBeInstanceOf(Map);
    expect(status.size).toBe(channels.length);
  });

  it('should cache results for subsequent calls', async () => {
    const channels = ['shroud'];
    
    // First call
    const status1 = await twitchService.getStreamStatus(channels);
    
    // Second call (should be cached)
    const status2 = await twitchService.getStreamStatus(channels);
    
    expect(status1).toEqual(status2);
  });
});
```

### 2. Integration Tests

```typescript
// __tests__/api/twitch.test.ts
describe('/api/twitch/streams', () => {
  it('should return stream data for valid channels', async () => {
    const response = await fetch('/api/twitch/streams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels: ['shroud'] })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(1);
  });
});
```

### 3. Mock Data for Development

```typescript
// mocks/twitchMockData.ts
export const mockStreamData = {
  shroud: {
    isLive: true,
    viewerCount: 25000,
    gameName: 'VALORANT',
    title: 'Ranked grind with the boys',
    thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/...',
    startedAt: '2024-01-15T14:00:00Z'
  },
  ninja: {
    isLive: false,
    viewerCount: 0,
    gameName: '',
    title: '',
    thumbnailUrl: '',
    startedAt: null
  }
};
```

## Implementation Checklist

- [ ] Register Twitch application
- [ ] Set up environment variables
- [ ] Implement token management
- [ ] Create API routes for stream data
- [ ] Build frontend service layer
- [ ] Add caching mechanism
- [ ] Implement rate limiting
- [ ] Create React hooks for components
- [ ] Add error handling
- [ ] Write tests
- [ ] Add monitoring/logging
- [ ] Deploy and test in production

## Conclusion

This integration provides a robust foundation for displaying real-time Twitch stream information while following best practices for security, performance, and reliability. The modular architecture allows for easy expansion to include additional Twitch API features in the future.