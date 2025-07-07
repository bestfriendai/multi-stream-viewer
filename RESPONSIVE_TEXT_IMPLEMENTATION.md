# Responsive Text Implementation Guide

## Overview

This document outlines the comprehensive responsive text system implemented to ensure text content adapts properly across different languages, screen sizes, and devices. The system addresses the unique challenges of multi-language support where text lengths can vary significantly between languages.

## Key Features

### 1. Fluid Typography Scale
- **CSS Custom Properties**: Uses CSS `clamp()` function for fluid scaling
- **Viewport-based Sizing**: Text scales smoothly between minimum and maximum sizes
- **Language-aware**: Adjusts line height and letter spacing for different languages

### 2. Multi-Language Support
- **Chinese (zh)**: Increased line height (1.75) and letter spacing (0.025em)
- **Japanese (ja)**: Relaxed line height (1.75) with normal letter spacing
- **Korean (ko)**: Relaxed line height (1.75) with normal letter spacing
- **Russian (ru)**: Normal line height (1.5) and letter spacing
- **Arabic (ar)**: RTL support with relaxed line height

### 3. Text Truncation and Wrapping
- **Single-line truncation**: `text-ellipsis-responsive` class
- **Multi-line truncation**: `text-clamp-2`, `text-clamp-3`, `text-clamp-4` classes
- **Smart wrapping**: `text-wrap-responsive` with word-break and hyphens
- **Text balance**: `text-balance` for better line distribution

### 4. Container Queries Support
- **Component-level responsiveness**: Text adapts to container size, not just viewport
- **Granular control**: Different text sizes based on container width
- **Future-proof**: Uses modern CSS container queries

## Implementation Files

### Core Files
1. **`src/styles/responsive-text.css`** - Main responsive text utilities
2. **`src/components/ResponsiveText.tsx`** - React component wrapper
3. **`src/components/ResponsiveTextDemo.tsx`** - Demo and testing component
4. **`tailwind.config.js`** - Extended with responsive text utilities

### CSS Classes Available

#### Font Size Classes
```css
.text-responsive-xs    /* clamp(0.75rem, 1.5vw, 0.875rem) */
.text-responsive-sm    /* clamp(0.875rem, 2vw, 1rem) */
.text-responsive-base  /* clamp(1rem, 2.5vw, 1.125rem) */
.text-responsive-lg    /* clamp(1.125rem, 3vw, 1.25rem) */
.text-responsive-xl    /* clamp(1.25rem, 3.5vw, 1.5rem) */
.text-responsive-2xl   /* clamp(1.5rem, 4vw, 1.875rem) */
.text-responsive-3xl   /* clamp(1.875rem, 5vw, 2.25rem) */
.text-responsive-4xl   /* clamp(2.25rem, 6vw, 3rem) */
```

#### Truncation Classes
```css
.text-ellipsis-responsive  /* Single line truncation */
.text-clamp-2             /* Two line truncation */
.text-clamp-3             /* Three line truncation */
.text-clamp-4             /* Four line truncation */
```

#### Wrapping Classes
```css
.text-wrap-responsive     /* Smart word wrapping */
.text-balance            /* Balanced line breaks */
.text-pretty             /* Pretty text wrapping */
```

#### Component-specific Classes
```css
.btn-text-responsive         /* Button text sizing */
.nav-text-responsive         /* Navigation text sizing */
.card-title-responsive       /* Card title styling */
.card-description-responsive /* Card description styling */
```

## React Components

### ResponsiveText Component

```tsx
import ResponsiveText from '@/components/ResponsiveText'

// Basic usage
<ResponsiveText size="lg" truncate={2}>
  {t('some.translation.key')}
</ResponsiveText>

// With language-specific styling
<ResponsiveText lang="zh" size="base">
  中文文本示例
</ResponsiveText>
```

### Convenience Components

```tsx
import { 
  ResponsiveHeading, 
  ResponsiveParagraph, 
  ResponsiveCardTitle,
  ResponsiveCardDescription 
} from '@/components/ResponsiveText'

// Semantic heading
<ResponsiveHeading level={2}>
  {t('page.title')}
</ResponsiveHeading>

// Paragraph with proper spacing
<ResponsiveParagraph>
  {t('page.description')}
</ResponsiveParagraph>

// Card components
<ResponsiveCardTitle truncate={2}>
  {stream.title}
</ResponsiveCardTitle>

<ResponsiveCardDescription truncate={3}>
  {stream.description}
</ResponsiveCardDescription>
```

## Mobile Optimizations

### Touch Target Compliance
- Minimum 44px height for interactive text elements
- Proper padding and spacing for touch interfaces
- Prevents accidental zooming on iOS with 16px minimum font size

### Viewport Considerations
- Prevents horizontal scrolling with `max-width: 100vw`
- Uses `overflow-wrap: break-word` for long text
- Implements `hyphens: auto` for better line breaks

### Performance Optimizations
- Uses CSS custom properties for efficient updates
- Minimal JavaScript overhead
- Hardware-accelerated text rendering

## Accessibility Features

### High Contrast Mode
- Increased font weight (500) in high contrast mode
- Enhanced letter spacing (0.025em) for better readability
- Maintains color contrast ratios

### Large Text Mode
- 20% size increase for all text elements
- Maintains proportional scaling
- Preserves layout integrity

### Screen Reader Support
- Proper semantic markup
- Language attributes for correct pronunciation
- Focus indicators for keyboard navigation

### Reduced Motion
- Disables text animations when `prefers-reduced-motion: reduce`
- Maintains functionality without motion effects

## Testing and Validation

### ResponsiveTextDemo Component
The demo component (`ResponsiveTextDemo.tsx`) provides:
- Live preview of different text sizes
- Language-specific styling examples
- Truncation behavior demonstration
- Container query testing
- Mobile/tablet/desktop simulation

### Testing Checklist
- [ ] Text scales properly on different screen sizes
- [ ] Language-specific styling applies correctly
- [ ] Truncation works for single and multi-line text
- [ ] Container queries respond to parent size changes
- [ ] Mobile touch targets meet accessibility guidelines
- [ ] High contrast mode enhances readability
- [ ] Large text mode scales appropriately
- [ ] RTL languages display correctly

## Browser Support

### Modern Features Used
- CSS `clamp()` function (supported in all modern browsers)
- CSS Container Queries (progressive enhancement)
- CSS `text-wrap` property (progressive enhancement)
- CSS Custom Properties (widely supported)

### Fallbacks
- Graceful degradation for older browsers
- Static font sizes as fallbacks
- Standard text wrapping for unsupported browsers

## Performance Considerations

### CSS Optimization
- Minimal CSS bundle size increase (~3KB gzipped)
- Efficient CSS custom property updates
- No JavaScript required for basic functionality

### Runtime Performance
- No layout thrashing from font size changes
- Smooth scaling with viewport changes
- Optimized for 60fps animations

## Integration with Existing Components

### Updated Components
1. **Button Component** - Now uses `text-responsive-sm` by default
2. **LanguageSelector** - Implements responsive text with truncation
3. **Card Components** - Uses responsive card title and description classes

### Migration Guide
To update existing components:

1. Replace static text size classes:
   ```tsx
   // Before
   <span className="text-sm">Text</span>
   
   // After
   <span className="text-responsive-sm">Text</span>
   ```

2. Add truncation for long text:
   ```tsx
   // Before
   <h3 className="text-lg">{title}</h3>
   
   // After
   <h3 className="text-responsive-lg text-clamp-2">{title}</h3>
   ```

3. Use ResponsiveText component for complex cases:
   ```tsx
   // Before
   <p className="text-base text-muted-foreground">{description}</p>
   
   // After
   <ResponsiveText 
     size="base" 
     variant="description" 
     truncate={3}
     lang={currentLanguage}
   >
     {description}
   </ResponsiveText>
   ```

## Future Enhancements

### Planned Features
1. **Dynamic font loading** based on language
2. **Advanced typography** for specific language scripts
3. **AI-powered text optimization** for different contexts
4. **Real-time text metrics** and analytics

### Experimental Features
1. **Variable fonts** for smoother scaling
2. **CSS Subgrid** for complex layouts
3. **CSS Anchor Positioning** for tooltips and overlays

## Conclusion

This responsive text system ensures that Streamyyy provides an optimal reading experience across all languages, devices, and accessibility needs. The implementation is performant, accessible, and future-proof, providing a solid foundation for international expansion and improved user experience.

## Quick Reference

### Most Common Use Cases

```tsx
// Page title
<ResponsiveHeading level={1}>{t('page.title')}</ResponsiveHeading>

// Card title with truncation
<ResponsiveCardTitle truncate={2}>{stream.title}</ResponsiveCardTitle>

// Description with language support
<ResponsiveText size="base" lang={currentLanguage} truncate={3}>
  {description}
</ResponsiveText>

// Button text
<Button>
  <ResponsiveButton>{t('button.label')}</ResponsiveButton>
</Button>

// Navigation item
<ResponsiveText variant="nav" truncate>
  {t('nav.item')}
</ResponsiveText>
```

This implementation ensures that text is always responsive and fits properly in the window, regardless of the language or device being used.