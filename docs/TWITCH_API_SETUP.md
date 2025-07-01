# Twitch API Setup Guide for Multi-Stream Viewer

## Overview

This document explains what you need to set up and configure to enable Twitch API features in the Multi-Stream Viewer application. The integration provides live status indicators, viewer counts, and game/category information for Twitch streams.

## What's Already Implemented

The following files have been created and are ready to use:

### 1. Backend Infrastructure
- **`/src/app/api/twitch/streams/route.ts`** - API endpoint that handles Twitch API requests
- **`/src/lib/twitch/tokenManager.ts`** - Manages OAuth tokens with auto-refresh
- **`/src/lib/twitch/api.ts`** - Twitch API client with typed methods

### 2. Frontend Services
- **`/src/services/twitchService.ts`** - Client-side service with caching and batch processing
- **`/src/hooks/useTwitchStatus.ts`** - React hook for component integration

### 3. UI Components
- **`/src/components/LiveIndicator.tsx`** - Shows live status with viewer count
- **`/src/components/StreamStatusBar.tsx`** - Overview bar showing all stream statuses
- **`/src/components/StreamEmbed.tsx`** - Updated to display live info

## What You Need to Set Up

### 1. Twitch Developer Application

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Log in with your Twitch account
3. Click "Register Your Application"
4. Fill in the following:
   - **Name**: Choose a unique name (e.g., "My Multi-Stream Viewer")
   - **OAuth Redirect URLs**: Add these URLs:
     - `http://localhost:3000/auth/twitch/callback` (for development)
     - `https://streamyyy.com/auth/twitch/callback` (for production)
   - **Category**: Select "Website Integration"
   - **Client Type**: Select "Confidential"
5. Click "Create"
6. You'll receive:
   - **Client ID**: A public identifier for your app
   - **Client Secret**: Click "New Secret" to generate (keep this private!)

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Twitch API Configuration
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_REDIRECT_URI=http://localhost:3000/auth/twitch/callback

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- Never commit `.env.local` to git
- Keep your Client Secret secure
- The `.env.example` file shows the structure without real values

### 3. How It Works

Once configured, the app will:

1. **Automatic Token Management**
   - Obtains app access tokens using Client Credentials flow
   - Refreshes tokens automatically before expiration
   - No user login required for public stream data

2. **Live Status Checking**
   - Checks stream status every 60 seconds
   - Shows live indicator with red dot
   - Displays current viewer count
   - Shows game/category being played

3. **Performance Features**
   - Batches up to 100 channels per API request
   - Caches results for 1 minute
   - Rate limiting prevents API abuse
   - Efficient re-renders with React hooks

## Features Enabled

With Twitch API configured, you get:

### In Stream Grid View
- Red "LIVE" badge on active streams
- Viewer count display
- Game category information
- Stream title on hover

### Status Bar
- Total streams count
- Number of live streams
- Combined viewer count
- Individual stream status pills

### Mobile View
- Live indicators in swipe view
- Viewer counts in stream info

## Testing Your Setup

1. Add your credentials to `.env.local`
2. Restart the development server: `npm run dev`
3. Add a Twitch stream to your viewer
4. Within 60 seconds, you should see:
   - Live indicator (if stream is live)
   - Viewer count
   - Game being played

## Troubleshooting

### No Live Status Showing
- Check browser console for errors
- Verify your Client ID and Secret are correct
- Ensure `.env.local` is in the root directory
- Restart the dev server after adding env variables

### Rate Limiting
- The app limits to 100 requests/minute per IP
- Twitch API allows 800 requests/minute total
- If you hit limits, wait 60 seconds

### Invalid Token Errors
- Token refresh happens automatically
- If persistent, check your Client Secret
- Ensure your app isn't suspended on Twitch

## Security Notes

1. **Client Secret Protection**
   - Never expose in client-side code
   - Only used in server-side API routes
   - Not included in browser bundles

2. **API Proxy Pattern**
   - All Twitch API calls go through `/api/twitch/*`
   - Credentials stay on the server
   - Client never sees tokens

3. **Rate Limiting**
   - Per-IP rate limiting prevents abuse
   - Protects your API quota
   - Graceful error handling

## Optional Enhancements

The infrastructure supports these future additions:

1. **User Authentication**
   - Let viewers log in with Twitch
   - Show their followed channels
   - Access private stream data

2. **Real-time Updates (EventSub)**
   - Instant notifications when streams go live
   - No polling required
   - More efficient than periodic checks

3. **Additional Data**
   - Stream thumbnails
   - Clip creation
   - Channel descriptions
   - Follower counts

## API Usage Monitoring

Track your usage at: https://dev.twitch.tv/console

- View request counts
- Check rate limit status
- Monitor error rates
- Manage application settings

## Need Help?

- Twitch API Docs: https://dev.twitch.tv/docs/api/
- Authentication Guide: https://dev.twitch.tv/docs/authentication/
- API Reference: https://dev.twitch.tv/docs/api/reference/
- Community Forums: https://discuss.dev.twitch.tv/