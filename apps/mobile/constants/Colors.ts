export const colors = {
  // Background
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSurfaceSecondary: '#F1F5F9',

  // Primary (Professional B2B blue)
  primary: '#1E3A5F',
  primaryLight: '#E8EFF7',
  primaryDark: '#142942',

  // Accent (Teal — trust, differentiation)
  accent: '#0D9488',
  accentLight: '#CCFBF1',
  accentDark: '#0F766E',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders
  borderLight: '#E2E8F0',
  borderMedium: '#CBD5E1',

  // Match / Swipe specific
  matchGold: '#F59E0B',
  swipeRight: '#22C55E',
  swipeLeft: '#EF4444',
  superLike: '#3B82F6',
} as const;

export type ColorKey = keyof typeof colors;
