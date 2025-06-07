/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const palette = {
  primary: {
    light: '#66BB6A',
    main: '#4CAF50',
    dark: '#388E3C',
    contrast: '#FFFFFF',
  },
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  error: {
    light: '#EF5350',
    main: '#DC3545',
    dark: '#C62828',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  success: {
    light: '#66BB6A',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  info: {
    light: '#4FC3F7',
    main: '#29B6F6',
    dark: '#0288D1',
  },
};

export const Colors = {
  light: {
    // Base colors
    text: palette.grey[900],
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: palette.grey[50],
    border: palette.grey[200],

    // Theme colors
    tint: palette.primary.main,
    primary: palette.primary.main,
    primaryLight: palette.primary.light,
    primaryDark: palette.primary.dark,

    // UI elements
    icon: palette.grey[600],
    tabIconDefault: palette.grey[400],
    tabIconSelected: palette.primary.main,

    // States
    error: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
    info: palette.info.main,

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Base colors
    text: '#FFFFFF',
    background: palette.grey[900],
    surface: palette.grey[800],
    surfaceVariant: palette.grey[700],
    border: palette.grey[600],

    // Theme colors
    tint: palette.primary.light,
    primary: palette.primary.light,
    primaryLight: palette.primary.main,
    primaryDark: palette.primary.light,

    // UI elements
    icon: palette.grey[400],
    tabIconDefault: palette.grey[600],
    tabIconSelected: palette.primary.light,

    // States
    error: palette.error.light,
    warning: palette.warning.light,
    success: palette.success.light,
    info: palette.info.light,

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.75)',
    backdrop: 'rgba(255, 255, 255, 0.1)',
  },
} as const;
