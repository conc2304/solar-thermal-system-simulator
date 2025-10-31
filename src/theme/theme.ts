import { type Theme } from 'theme-ui';
import { rawColors } from './rawColors';
import { ButtonVariants } from './component-variants';


export const DefaultTheme: Theme = {
  colors: {
    // Light/Default Mode Colors
    text: rawColors.gray[ 900 ],
    background: rawColors.gray[ 50 ],
    primary: rawColors.blue[ 500 ],
    secondary: rawColors.gray[ 600 ],
    accent: rawColors.green[ 500 ],
    highlight: rawColors.yellow[ 200 ],
    muted: rawColors.gray[ 300 ],

    // Dark Mode Colors
    modes: {
      dark: {
        text: rawColors.gray[ 50 ],
        background: rawColors.gray[ 900 ],
        primary: rawColors.blue[ 400 ],
        secondary: rawColors.gray[ 500 ],
        accent: rawColors.green[ 400 ],
        highlight: rawColors.yellow[ 300 ],
        muted: rawColors.gray[ 700 ]
      }
    }
  },

  breakpoints: [ '576px', '768px', '992px', '1200px', '1400px' ],

  fonts: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },

  fontSizes: [ 12, 14, 16, 20, 24, 32, 48, 64 ],

  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },

  lineHeights: {
    body: 1.5,
    heading: 1.125
  },

  // WebGL-friendly space and sizing
  space: [ 0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8 ],

  sizes: {
    container: {
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
      xxl: 1320
    }
  },

  radii: {
    default: 4,
    sm: 2,
    lg: 8,
    xl: 16,
    xxl: 24,
    pill: 50
  },

  shadows: {
    default: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)'
  },

  config: {
    initialColorModeName: 'light',
    useRootStyles: true,
    useColorSchemeMediaQuery: 'system',
    useLocalStorage: true,
    useBorderBox: true,
  },

  // Component Variants
  buttons: ButtonVariants,


  // Style Overrides
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      transition: 'background-color 0.2s ease-out, color 0.2s ease-out'
    }
  }
};