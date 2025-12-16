
export const PawFreshTheme = {
  colors: {
    light: {
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      mutedText: '#64748B',
      primary: '#2EC4B6',
      accent: '#FF6B6B',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: 'rgba(15,23,42,0.10)',
      subtle: '#F1F5F9',
    },
    dark: {
      bg: '#0B1220',
      surface: '#0F172A',
      text: '#E5E7EB',
      mutedText: '#94A3B8',
      primary: '#2EC4B6',
      accent: '#FF6B6B',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#F87171',
      outline: 'rgba(148,163,184,0.18)',
      subtle: '#1E293B',
    }
  },
  typography: {
    h1: { fontSize: 28, lineHeight: '34px', fontWeight: 700 },
    h2: { fontSize: 20, lineHeight: '26px', fontWeight: 600 },
    body: { fontSize: 16, lineHeight: '24px', fontWeight: 400 },
    caption: { fontSize: 13, lineHeight: '18px', fontWeight: 500 },
    button: { fontSize: 16, fontWeight: 700, letterSpacing: '0.5px' }
  },
  radii: {
    card: 20,
    button: 16,
    input: 14,
    chip: 999
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    float: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    button: '0 4px 12px rgba(46, 196, 182, 0.25)'
  }
};

export type ThemeColors = typeof PawFreshTheme.colors.light;
