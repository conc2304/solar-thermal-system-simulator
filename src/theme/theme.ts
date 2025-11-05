import { type Theme } from 'theme-ui';

import { ButtonVariants } from './component-variants';
import { TextVariants } from './component-variants/text-variants';
import { rawColors } from './rawColors';

export const DefaultTheme: Theme = {
  colors: {
    // Light/Default Mode Colors
    text: rawColors.gray[900],
    background: rawColors.gray[50],
    primary: rawColors.blue[500],
    secondary: rawColors.gray[600],
    success: rawColors.green[500],
    error: rawColors.red[500],
    highlight: rawColors.yellow[200],
    muted: rawColors.gray[300],

    // Dark Mode Colors
    modes: {
      dark: {
        text: rawColors.gray[50],
        background: rawColors.gray[900],
        primary: rawColors.blue[400],
        secondary: rawColors.gray[500],
        success: rawColors.green[400],
        error: rawColors.red[200],
        highlight: rawColors.yellow[300],
        muted: rawColors.gray[700],
      },
    },
  },

  rawColors: {
    text: rawColors.gray[900],
    background: rawColors.gray[50],
    primary: rawColors.blue[500],
    secondary: rawColors.gray[600],
    success: rawColors.green[500],
    highlight: rawColors.yellow[200],
    muted: rawColors.gray[300],

    // Dark Mode Colors
    modes: {
      dark: {
        text: rawColors.gray[50],
        background: rawColors.gray[900],
        primary: rawColors.blue[400],
        secondary: rawColors.gray[500],
        success: rawColors.green[400],
        highlight: rawColors.yellow[300],
        muted: rawColors.gray[700],
      },
    },
  },

  breakpoints: ['576px', '768px', '992px', '1200px', '1400px'],

  fonts: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },

  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],

  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },

  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },

  space: [0, 4, 8, 12, 16, 24, 30, 60, 512],

  sizes: {
    container: {
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
      xxl: 1320,
    },
  },

  radii: {
    default: 4,
    sm: 2,
    lg: 8,
    xl: 16,
    xxl: 24,
    pill: 50,
  },

  shadows: {
    default: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)',
  },

  config: {
    initialColorModeName: 'light',
    useRootStyles: true,
    useColorSchemeMediaQuery: 'system',
    useLocalStorage: true,
    useBorderBox: true,
  },

  // Style Overrides
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      transition: 'background-color 0.2s ease-out, color 0.2s ease-out',
      background: 'background',
    },
  },

  // Component Variants
  buttons: ButtonVariants,
  text: TextVariants,
};
