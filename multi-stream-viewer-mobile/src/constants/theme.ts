// Apple-inspired design system
export const colors = {
  // System colors
  primary: '#007AFF', // iOS Blue
  secondary: '#5856D6', // iOS Purple
  accent: '#FF9500', // iOS Orange
  
  // Semantic colors
  success: '#34C759', // iOS Green
  warning: '#FF9500', // iOS Orange
  error: '#FF3B30', // iOS Red
  info: '#007AFF', // iOS Blue
  
  // Background colors - matching iOS system backgrounds
  background: {
    primary: '#000000', // Pure black for OLED
    secondary: '#1C1C1E', // Secondary system background
    tertiary: '#2C2C2E', // Tertiary system background
    elevated: '#2C2C2E', // Elevated surfaces
    grouped: '#1C1C1E', // Grouped content background
  },
  
  // Text colors - iOS system label colors
  text: {
    primary: '#FFFFFF', // Label
    secondary: 'rgba(255, 255, 255, 0.6)', // Secondary label
    tertiary: 'rgba(255, 255, 255, 0.3)', // Tertiary label
    quaternary: 'rgba(255, 255, 255, 0.18)', // Quaternary label
  },
  
  // System fill colors
  fill: {
    primary: 'rgba(120, 120, 128, 0.2)', // System fill
    secondary: 'rgba(120, 120, 128, 0.16)', // Secondary system fill
    tertiary: 'rgba(120, 120, 128, 0.12)', // Tertiary system fill
    quaternary: 'rgba(120, 120, 128, 0.08)', // Quaternary system fill
  },
  
  // Separator colors
  separator: {
    opaque: '#38383A', // Opaque separator
    nonOpaque: 'rgba(60, 60, 67, 0.36)', // Non-opaque separator
  },
  
  // Platform specific
  twitch: '#9146FF',
  youtube: '#FF0000',
  kick: '#53FC18',
  
  // Tint colors for overlays
  tint: {
    blue: 'rgba(0, 122, 255, 0.15)',
    purple: 'rgba(88, 86, 214, 0.15)',
    green: 'rgba(52, 199, 89, 0.15)',
    red: 'rgba(255, 59, 48, 0.15)',
  },
  
  // Border color
  border: '#38383A', // Same as opaque separator
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  xxxl: 44,
};

// iOS standard corner radii
export const borderRadius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 9999, // Full rounded
  pill: 9999,
  card: 16, // Standard card radius
  button: 12, // Standard button radius
  modal: 20, // Modal corner radius
};

// SF Pro typography scale
export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 22,
    '3xl': 28,
    '4xl': 34,
    largeTitle: 34,
    title1: 28,
    title2: 22,
    title3: 20,
    headline: 17,
    body: 17,
    callout: 16,
    subheadline: 15,
    footnote: 13,
    caption1: 12,
    caption2: 11,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: -0.02,
    normal: 0,
    wide: 0.02,
  },
};

export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// iOS-style shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};

// Animation durations matching iOS
export const animations = {
  fast: 200,
  normal: 300,
  slow: 400,
  spring: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
  },
};

// Haptic feedback types
export const haptics = {
  light: 'light' as const,
  medium: 'medium' as const,
  heavy: 'heavy' as const,
  selection: 'selection' as const,
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
};