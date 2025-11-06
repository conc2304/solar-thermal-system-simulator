import type { ThemeColor } from '../types';
import type { ThemeUIStyleObject } from 'theme-ui';

export type ButtonVariants = 'contained' | 'outlined' | 'text';

export const getVariantKey = ({
  variant,
  color,
}: {
  variant: ButtonVariants;
  color: ThemeColor;
}) => {
  return `${variant}_${color}`;
};

// Helper function to create color-specific variant styles since color and variant styles are intertwined
const createColorVariants = (
  colorKey: ThemeColor
): Record<string, ThemeUIStyleObject> => ({
  [getVariantKey({ variant: 'contained', color: colorKey })]: {
    backgroundColor: colorKey,
    borderColor: colorKey,
    color: 'white',
    '&:hover:not(:disabled)': {
      backgroundColor: colorKey,
      filter: 'brightness(0.9)',
    },
    '&:active:not(:disabled)': {
      filter: 'brightness(0.85)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  [getVariantKey({ variant: 'outlined', color: colorKey })]: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: colorKey,
    color: colorKey,
    '&:hover:not(:disabled)': {
      backgroundColor: colorKey,
      color: 'white',
    },
    '&:active:not(:disabled)': {
      backgroundColor: colorKey,
      color: 'white',
      filter: 'brightness(0.9)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  [getVariantKey({ variant: 'text', color: colorKey })]: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colorKey,
    '&:hover:not(:disabled)': {
      backgroundColor: colorKey,
      color: 'white',
      opacity: 0.9,
    },
    '&:active:not(:disabled)': {
      opacity: 0.8,
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
});

export const ButtonVariants: Record<string, ThemeUIStyleObject> = {
  // Base styles applied to all buttons
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s ease',
    borderRadius: 'default',
    gap: 2,
  },

  // Size variants
  sizes: {
    sm: {
      fontSize: 0, // 12px // maps to fontsize array index
      py: 1, // 4px
      px: 2, // 8px
    },
    md: {
      fontSize: 1, // 14px
      py: 2, // 8px
      px: 2, // 8px
    },
    lg: {
      fontSize: 3, // 20px
      py: 2, // 8px
      px: 3, // 12px
    },
  },

  // Color-specific variants for all appearance types
  ...createColorVariants('primary'),
  ...createColorVariants('secondary'),
  ...createColorVariants('success'),
  ...createColorVariants('text'),
  ...createColorVariants('background'),
  ...createColorVariants('muted'),
  ...createColorVariants('error'),
};
