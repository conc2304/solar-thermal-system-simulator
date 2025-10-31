import type { ThemeColors, ThemeSizes } from '@/theme';
import React, { forwardRef } from 'react';
import { useThemeUI, type ThemeUICSSObject } from 'theme-ui';

type ButtonVariants = 'contained' | 'outlined' | 'text';

// Button component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: ButtonVariants;
  /** Button color variant */
  color?: ThemeColors;
  /** Button size variant */
  size?: ThemeSizes;
  /** Additional sx prop for custom styling */
  sx?: ThemeUICSSObject;
  /** Icon to display before button text */
  leftIcon?: React.ReactNode;
  /** Icon to display after button text */
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'contained',
      color = 'primary',
      size = 'md',
      sx,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const themeContext = useThemeUI();
    const {
      theme: { buttons: buttonTheme = {} },
    } = themeContext;

    // Type assertion for button theme structure
    const typedButtonTheme = buttonTheme as {
      base?: ThemeUICSSObject;
      variant?: Record<ButtonVariants, ThemeUICSSObject>;
      sizes?: Record<ThemeSizes, ThemeUICSSObject>;
    };

    console.log(typedButtonTheme);
    // Color styles based on variant
    const colorStyles: ThemeUICSSObject = (() => {
      switch (variant) {
        case 'contained':
          return {
            backgroundColor: color,
            color: 'white',
            borderColor: color,
            '&:hover': {
              backgroundColor: color,
              filter: 'brightness(0.9)',
            },
            '&:active': {
              filter: 'brightness(0.85)',
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
            },
          };
        case 'outlined':
          return {
            backgroundColor: 'transparent',
            color: color,
            borderColor: color,
            border: '1px solid',
            '&:hover': {
              backgroundColor: color,
              color: 'white',
            },
            '&:active': {
              backgroundColor: color,
              color: 'white',
              filter: 'brightness(0.9)',
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
            },
          };
        case 'text':
          return {
            backgroundColor: 'transparent',
            color: color,
            borderColor: 'transparent',
            '&:hover': {
              backgroundColor: color,
              color: 'white',
              opacity: 0.9,
            },
            '&:active': {
              opacity: 0.8,
            },
            '&:disabled': {
              opacity: 0.4,
              cursor: 'not-allowed',
            },
          };
        default:
          return {};
      }
    })();

    return (
      <button
        ref={ref}
        sx={{
          // Base button styles from theme
          ...(typedButtonTheme.base || {}),
          // Apply variant styles
          // ...(typedButtonTheme?.variant?.[variant] || {}),
          // // Apply size styles
          // ...(typedButtonTheme?.sizes?.[size] || {}),
          // // Apply color styles based on variant
          ...colorStyles,
          // // Flexbox and additional base styles
          // gap: 2,
          // cursor: 'pointer',
          // transition: 'all 0.2s ease',
          // // Allow additional custom styling
          // ...sx,
        }}
        // Accessibility attributes
        aria-label={
          rest['aria-label'] ||
          (typeof children === 'string' ? children : undefined)
        }
        {...rest}
      >
        {leftIcon && (
          <span sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
