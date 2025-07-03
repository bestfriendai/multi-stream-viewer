# Multi-Stream Viewer Layout Fixes - Todo

## ✅ Completed Tasks

### 1. Fixed Background Video Refreshing Issue
- **Problem**: Videos in landing page background kept refreshing due to `&time=${Date.now()}` parameter
- **Solution**: Removed timestamp parameter from iframe sources in `OptimizedBackgroundStreams.tsx`
- **Status**: ✅ COMPLETED
- **Files Modified**: `src/components/OptimizedBackgroundStreams.tsx`

### 2. Fixed Layout Switching System
- **Problem**: Layout switching wasn't working properly due to value mismatches and incomplete logic
- **Solution**: Updated `calculateGridConfig` function in `StreamGrid.tsx` with proper layout handling
- **Status**: ✅ COMPLETED 
- **Files Modified**: `src/components/StreamGrid.tsx`

#### Layout Fixes Implemented:
- ✅ **1x1 Layout**: Now correctly shows streams stacked vertically at full width
- ✅ **2x1 Layout**: Side by side layout (2 columns, multiple rows as needed)
- ✅ **1x2 Layout**: Stacked layout (1 column, max 2 rows)
- ✅ **2x2 Layout**: Standard 2x2 grid
- ✅ **3x3 Layout**: Standard 3x3 grid  
- ✅ **4x4 Layout**: Standard 4x4 grid
- ✅ **Mosaic Layout**: Adaptive layout that adjusts based on stream count
  - 1 stream: 1x1
  - 2 streams: 2x1
  - 3-4 streams: 2x2
  - 5-6 streams: 3x2
  - 7-9 streams: 3x3
  - 10-12 streams: 4x3
  - 13-16 streams: 4x4
- ✅ **Custom/Focus/PIP**: Special layouts preserved

## 🔄 Tasks in Progress

### 3. Testing Layout Switching
- **Status**: 🔄 IN PROGRESS
- **Next Steps**: 
  - Start development server
  - Add multiple test streams
  - Test each layout option systematically
  - Verify 1x1 shows full-width stacked streams
  - Verify mosaic adapts correctly to stream count
  - Ensure layout changes are immediate without stream reloads

## 📋 Testing Checklist

### Layout Testing (when streams are added):
- [ ] **1x1 (Single)**: Each stream full width, stacked vertically
- [ ] **2x1 (Side by Side)**: 2 streams horizontal
- [ ] **1x2 (Stacked)**: 2 streams vertical
- [ ] **2x2 Grid**: 4 streams in 2x2 layout
- [ ] **3x3 Grid**: 9 streams in 3x3 layout
- [ ] **4x4 Grid**: 16 streams in 4x4 layout
- [ ] **Mosaic**: Adaptive layout based on stream count
- [ ] **Focus View**: Custom layout with main + side streams

### Additional Tests:
- [ ] Layout switching is immediate (no stream reloads)
- [ ] Background videos no longer refresh unnecessarily
- [ ] Mobile layouts work correctly
- [ ] All layout transitions are smooth

## 🐛 Known Issues
- None currently identified

## 📝 Notes
- Fixed TypeScript errors in StreamGrid.tsx
- Maintained backward compatibility with existing layout values
- Enhanced mosaic layout logic for better stream count adaptation
- Preserved mobile-specific layout handling

## 🎯 Success Criteria
1. Background videos stop refreshing when not needed
2. 1x1 layout shows streams stacked vertically at full width
3. All layout options work correctly with immediate switching
4. Mosaic layout adapts intelligently based on stream count
5. No stream reloads when switching layouts
