# Multi-Stream Viewer - Todo List

## ✅ Previously Completed Tasks
- Fixed Background Video Refreshing Issue
- Fixed Layout Switching System  
- Fixed Layout Rendering Issues (mosaic, focus, custom)
- Fixed Footer Positioning
- Fixed AMP Summer Page Layout (2 live streams)
- Fixed Mute/Unmute Stream Reloads
- Fixed Mosaic Layout Implementation
- Fixed Focus Mode Routing
- Fixed Live Indicator Blocking Mute Controls
- Fixed Chat Auto-Selection

## 🚀 Mobile UI Improvements - App-Like Experience

### Phase 1: Fix Stream Resizing Issues (HIGH PRIORITY)

#### Immediate Fixes Needed:
- [ ] Replace fixed heights with aspect-ratio containers in StreamEmbed
- [ ] Create responsive MobileStreamEmbed component with proper 16:9 ratio
- [ ] Fix grid layouts to use viewport units (vw/vh) instead of fixed pixels
- [ ] Implement CSS container queries for dynamic resizing
- [ ] Remove min-height constraints causing black bars
- [ ] Add ResizeObserver for dynamic viewport adjustments

#### Code Changes Required:
```css
/* New responsive stream container */
.stream-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  container-type: inline-size;
  overflow: hidden;
}
```

### Phase 2: Native App-Like UI (HIGH PRIORITY)

#### Navigation & Gestures:
- [ ] Implement bottom sheet pattern for modals/menus
- [ ] Add swipe-from-edge navigation gestures  
- [ ] Create smooth spring animations (Framer Motion)
- [ ] Enhanced haptic feedback for all interactions
- [ ] Pull-to-refresh with elastic bounce effect
- [ ] Edge swipe for back navigation

#### Visual Polish:
- [ ] Reduce padding/margins (8px mobile vs 16px desktop)
- [ ] Implement fluid typography using clamp()
- [ ] Add backdrop blur effects (backdrop-filter)
- [ ] Create skeleton loaders for streams
- [ ] 60fps animations with will-change CSS

#### Touch Optimization:
- [ ] Increase ALL touch targets to 48x48px minimum
- [ ] Add invisible tap areas around small buttons
- [ ] Implement proper touch-action CSS
- [ ] Visual feedback on tap (scale/opacity)
- [ ] Bottom-third UI for one-handed use

### Phase 3: Performance & PWA (MEDIUM PRIORITY)

#### Rendering Performance:
- [ ] Intersection Observer for off-screen streams
- [ ] Virtual scrolling for 10+ streams
- [ ] Hardware acceleration (transform3d)
- [ ] React.memo for stream components
- [ ] Debounced resize handlers

#### Progressive Web App:
- [ ] App manifest with icons
- [ ] Service worker for offline
- [ ] "Add to Home Screen" prompt
- [ ] Status bar theming
- [ ] Splash screens

### Phase 4: Enhanced Mobile Layouts (MEDIUM PRIORITY)

#### Smart Layout System:
- [ ] Auto-layout based on stream count
- [ ] Orientation-aware layouts
- [ ] Layout presets with previews
- [ ] Remembered layout preferences
- [ ] Quick gesture switching

#### Immersive Modes:
- [ ] True fullscreen with gestures
- [ ] Theater mode (minimal UI)
- [ ] PiP for background viewing
- [ ] Split view (stream + chat)
- [ ] Focus mode with thumbnails

## 📱 Mobile-Specific Bug Fixes

### Current Issues to Fix:
1. **Stream Aspect Ratios** - Black bars on various devices
2. **Touch Targets** - Buttons too small on mobile
3. **Layout Switching** - Not smooth on mobile
4. **Scroll Performance** - Janky with multiple streams
5. **Control Overlaps** - UI elements overlapping

### Device Testing Checklist:
- [ ] iPhone SE (375x667)
- [ ] iPhone 14 (390x844)  
- [ ] iPhone 14 Pro Max (430x932)
- [ ] Pixel 7 (412x915)
- [ ] iPad Mini (768x1024)
- [ ] Galaxy S23 (360x780)

## 🎯 Success Metrics

- Streams maintain perfect 16:9 ratio
- All animations run at 60fps
- Touch targets minimum 48px
- First paint under 1 second
- Smooth momentum scrolling
- "Feels like native app" feedback

## 📝 Implementation Notes

### Today's Focus:
1. Fix aspect ratio with CSS aspect-ratio property
2. Replace min-height with dynamic sizing
3. Test on real devices with BrowserStack

### Tomorrow:
1. Implement bottom sheet component
2. Add spring animations to all transitions
3. Enhance touch feedback

### This Week:
1. Complete all Phase 1 & 2 items
2. Start PWA implementation
3. User testing sessions

## Review Section

### Changes Made:
- Created comprehensive mobile improvement plan
- Documented all current mobile issues
- Prioritized fixes based on user impact
- Added specific implementation details
- Set clear success metrics

### Next Steps:
1. Start with aspect ratio fixes (immediate impact)
2. Move to touch target improvements
3. Then implement app-like animations
4. Finally, add PWA features