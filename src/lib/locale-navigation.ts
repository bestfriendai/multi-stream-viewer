/**
 * Hook to create navigation paths (no longer locale-aware)
 */
export function useLocaleNavigation() {
  const locale = 'en'; // Default to English since we removed i18n

  /**
   * Creates a path (no longer locale-aware)
   * @param path - The path (e.g., '/about', '/contact')
   * @returns The path as-is
   */
  const createLocalePath = (path: string): string => {
    return path;
  };

  return { createLocalePath, locale };
}

/**
 * Static function to create locale-aware paths (for use outside components)
 * @param locale - The locale string
 * @param path - The path without locale prefix
 * @returns The path with locale prefix
 */
export function createLocalePath(locale: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * List of pages that should be locale-aware
 */
export const LOCALE_AWARE_PAGES = [
  'about',
  'contact',
  'privacy',
  'terms',
  'cookies',
  'dmca',
  'compliance',
  'pricing',
  'blog',
  'support',
  'feedback',
  'accessibility'
] as const;

/**
 * Check if a path should be locale-aware
 * @param path - The path to check
 * @returns Whether the path should include locale prefix
 */
export function isLocaleAwarePage(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const basePath = cleanPath.split('/')[0];
  return LOCALE_AWARE_PAGES.includes(basePath as any);
}
