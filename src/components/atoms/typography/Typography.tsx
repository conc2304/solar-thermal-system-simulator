import React, { forwardRef } from 'react';
import { get } from '@theme-ui/css';
import { useThemeUI, type ThemeUICSSObject } from 'theme-ui';

import type { ThemeColor } from '@/theme';

import type { Property } from 'csstype';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'caption'
  | 'overline';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: ThemeColor | Property.Color;
  sx?: ThemeUICSSObject;
}

export const Typography = forwardRef<
  HTMLElement,
  TypographyProps
>(
  (
    { children, variant = 'body', color = 'text', sx, ...rest },
    ref
  ) => {
    const theme = useThemeUI();

    const component = variant.startsWith('h') ? variant : 'p';

    // Get variant styles from theme
    const variantStyles = get(theme, `text.base`) || {};
    const baseStyles = get(theme, `text.${variant}`) || {};

    // Combine all styles
    const combinedStyles: ThemeUICSSObject = {
      ...baseStyles,
      ...variantStyles,
      color,
      ...sx,
    };

    return React.createElement(
      component,
      { ref, sx: combinedStyles, ...rest },
      children
    );
  }
);

Typography.displayName = 'Typography';
