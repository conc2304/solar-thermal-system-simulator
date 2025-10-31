import { type Theme } from 'theme-ui';

// Raw Colors Object for WebGL and Consistent References
export const rawColors = {
  // Base Colors
  blue: {
    50: '#e6f2ff',
    100: '#b3d9ff',
    200: '#80c1ff',
    300: '#4da8ff',
    400: '#1a90ff',
    500: '#0d6efd',
    600: '#0a58ca',
    700: '#084298',
    800: '#052c65',
    900: '#031d41'
  },
  gray: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529'
  },
  // Semantic Colors
  green: {
    50: '#e6f4f1',
    100: '#b3e4d4',
    200: '#80d3b7',
    300: '#4dc29a',
    400: '#1ab17d',
    500: '#198754',
    600: '#146c42',
    700: '#0f5630',
    800: '#0a3622',
    900: '#052014'
  },
  red: {
    50: '#fee2e2',
    100: '#fecaca',
    200: '#fca5a5',
    300: '#f87171',
    400: '#f54e4e',
    500: '#dc3545',
    600: '#b02a37',
    700: '#842029',
    800: '#57161c',
    900: '#2b0c0f'
  },
  yellow: {
    50: '#fff9e6',
    100: '#fff3cd',
    200: '#ffc107',
    300: '#ffa500',
    400: '#ff8c00',
    500: '#ff7f50',
    600: '#cc6600',
    700: '#994d00',
    800: '#663300',
    900: '#331a00'
  }
};

export const theme: Theme = {
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
    default: 0.375,
    sm: 0.25,
    lg: 0.5,
    xl: 1,
    xxl: 2,
    pill: 50
  },

  shadows: {
    default: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)'
  },

  // Component Variants
  buttons: {
    primary: {
      backgroundColor: 'primary',
      color: 'background',
      '&:hover': {
        backgroundColor: 'secondary'
      }
    }
  },

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

// Utility function for color mode toggle
export const toggleColorMode = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    mode: theme?.colors?.mode === 'dark' ? 'light' : 'dark'
  }
});

export default theme;