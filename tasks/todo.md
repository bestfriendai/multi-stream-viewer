# Scrolling and Twitch Stats Investigation - TODO

## Problem Analysis

### Issue 1: Scroll to Bottom Problem
The "start watching" functionality is causing unwanted scrolling behavior on both desktop and mobile. This affects user experience when adding streams.

### Issue 2: Missing Twitch Stats
Some Twitch API stats/data have disappeared. Need to identify what's missing and restore/enhance the Twitch stats display.

## Investigation Findings

### Scroll Issue Root Cause
Found the problematic code in `/src/app/page.tsx` lines 145-153:

```typescript
// Scroll to top when new streams are added (from landing page)
useEffect(() => {
  if (streams.length > prevStreamCount && prevStreamCount === 0) {
    // Only scroll if going from 0 streams to 1+ streams (landing page -> stream view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActiveTab('streams') // Ensure we're on the streams tab
  }
  setPrevStreamCount(streams.length)
}, [streams.length, prevStreamCount])
```

**Issue**: This scrolls to TOP, not bottom, but still causes unwanted scrolling behavior on desktop and mobile when streams are added.

### Current Twitch API Data Available
From `/src/lib/twitch/api.ts`, the StreamData interface includes:
- `id`, `user_id`, `user_login`, `user_name`
- `game_id`, `game_name`, `type`, `title`
- `viewer_count`, `started_at`, `language`
- `thumbnail_url`, `tag_ids`, `tags`, `is_mature`

Additional data available from other endpoints:
- User data: `view_count`, `created_at`, `description`, `profile_image_url`
- Game data: `box_art_url`, `igdb_id`
- Channel info: `broadcaster_language`, `delay`, `tags`
- Videos/VODs: `view_count`, `duration`, `created_at`
- Clips: `view_count`, `creator_name`, `duration`
- Follows: `followed_at` relationships

## Todo Items

### 1. Fix Scroll Behavior
- [ ] **Remove or modify scroll to top behavior** - The current useEffect causes unwanted scrolling
- [ ] **Test scroll behavior on mobile and desktop** - Ensure no unwanted scrolling occurs
- [ ] **Consider alternative UX for stream transitions** - Maybe use animations instead of scrolling

### 2. Investigate Missing Twitch Stats
- [ ] **Audit current stats display** - Check what Twitch stats are currently shown
- [ ] **Compare with what was previously available** - Identify what stats disappeared
- [ ] **Check if any API endpoints are unused** - Many endpoints available but may not be utilized
- [ ] **Review UI components for stats display** - Find where stats should be shown

### 3. Enhance Twitch Stats Display
- [ ] **Add follower count** - Use `/api/twitch/` to get user view_count
- [ ] **Add stream uptime** - Calculate from `started_at` field
- [ ] **Add game/category info** - Already available in `game_name`
- [ ] **Add stream tags** - Available in `tags` field
- [ ] **Add stream quality/language** - Available in `language` field
- [ ] **Add stream maturity rating** - Available in `is_mature` field

### 4. Create Enhanced Stats API
- [ ] **Create comprehensive stats endpoint** - Combine multiple Twitch API calls
- [ ] **Add caching for stats** - Prevent rate limiting
- [ ] **Add error handling** - Graceful degradation when stats unavailable

### 5. Update UI Components
- [ ] **Add stats to StreamCard components** - Show enhanced stream information
- [ ] **Add stats to stream overlays** - Display when hovering or in mobile view
- [ ] **Add stats dashboard** - Dedicated view for detailed stream stats
- [ ] **Update mobile layouts** - Ensure stats display well on mobile

### 6. Test and Validate
- [ ] **Test scroll behavior fixes** - Verify no unwanted scrolling occurs
- [ ] **Test stats display** - Ensure all stats show correctly
- [ ] **Test mobile responsiveness** - Stats should work on all devices
- [ ] **Test API rate limits** - Ensure enhanced stats don't hit rate limits

## Key Files to Modify

### For Scroll Fix:
- `/src/app/page.tsx` - Remove/modify scroll behavior in useEffect
- Test with landing page to stream view transitions

### For Stats Enhancement:
- `/src/lib/twitch/api.ts` - Add enhanced stats methods
- `/src/app/api/twitch/stats/route.ts` - Enhance stats endpoint
- `/src/components/StreamCard.tsx` - Add stats display
- `/src/components/StreamGrid.tsx` - Update grid to show stats
- Mobile components - Ensure stats work on mobile

## Next Steps
1. **Remove problematic scroll behavior** - Priority fix for UX
2. **Audit current vs missing stats** - Understand what was lost
3. **Plan enhanced stats implementation** - Design comprehensive stats display
4. **Implement and test** - Deploy fixes and enhancements