export const themes = {
  dark: {
    bg: '#0f172a',
    panel: '#1e293b',
    text: '#e2e8f0',
    muting: '#94a3b8',
    accent: '#38bdf8',
    error: '#f87171',
    border: '#334155'
  },
  light: {
    bg: '#f8fafc',
    panel: '#ffffff',
    text: '#0f172a',
    muting: '#64748b',
    accent: '#0284c7',
    error: '#dc2626',
    border: '#e2e8f0'
  }
} as const;

export type ThemeName = keyof typeof themes;
