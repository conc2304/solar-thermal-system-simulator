import React, { forwardRef } from 'react';
import { get } from '@theme-ui/css';
import { useThemeUI, type ThemeUICSSObject } from 'theme-ui';

import type { ThemeColors, ThemeSizes } from '@/theme';
import { getVariantKey, type ButtonVariants } from '@/theme/component-variants';

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
    const { theme } = useThemeUI();
    const variantKey = getVariantKey({ variant, color });

    return (
      <button
        ref={ref}
        sx={{
          ...(get(theme, 'text.button') || {}),
          ...(get(theme, 'buttons.base') || {}),
          ...(get(theme, `buttons.${variantKey}`) || {}),
          ...(get(theme, `buttons.sizes.${size}`) || {}),
          // Custom overrides
          ...sx,
        }}
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
