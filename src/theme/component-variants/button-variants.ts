import type { ThemeUIStyleObject } from 'theme-ui';

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

  // Predefined appearance styles 
  variant: {
    text: {
      background: 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.08)'
      }
    },
    contained: {
      boxShadow: 'small',
      '&:hover': {
        filter: 'brightness(0.9)'
      }
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '1px solid',
      borderColor: 'currentColor',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.04)'
      }
    }
  },

  // Size variants
  sizes: {
    sm: {
      fontSize: 0,
      padding: '0.25rem 0.5rem',
      // borderRadius: 'sm'
    },
    md: {
      fontSize: 1,
      padding: '0.5rem 1rem',
      // borderRadius: 'default'
    },
    lg: {
      fontSize: 2,
      padding: '0.75rem 1.5rem',
      // borderRadius: 'lg'
    }
  }
};