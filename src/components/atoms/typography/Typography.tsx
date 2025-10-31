import React, { forwardRef } from 'react';
import { useThemeUI, type ThemeUICSSObject } from 'theme-ui';
import { get } from '@theme-ui/css';

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

type TextAlign = 'left' | 'right' | 'center' | 'justify';
type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  component?: React.ElementType;
  color?: string;
  align?: TextAlign;
  transform?: TextTransform;
  gutterBottom?: boolean;
  noWrap?: boolean;
  sx?: ThemeUICSSObject;
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      children,
      variant = 'body',
      component,
      color,
      align,
      transform,
      gutterBottom,
      noWrap,
      sx,
      ...rest
    },
    ref
  ) => {
    const theme = useThemeUI();

    const Component =
      component ||
      (variant.startsWith('h') ? (variant as React.ElementType) : 'p');

    // Base styles
    const baseStyles: ThemeUICSSObject = {
      margin: 0,
      // Default text styles
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    };

    // Get variant styles from theme
    const variantStyles = get(theme, `typography.${variant}`) || {};

    // Conditional styles
    const conditionalStyles: ThemeUICSSObject = {
      // Color handling
      ...(color && { color: get(theme, `colors.${color}`, color) }),

      // Text alignment
      ...(align && { textAlign: align }),

      // Text transform
      ...(transform && { textTransform: transform }),

      // Gutter bottom (margin)
      ...(gutterBottom && { marginBottom: 3 }),

      // No wrap
      ...(noWrap && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }),
    };

    // Combine all styles
    const combinedStyles: ThemeUICSSObject = {
      ...baseStyles,
      ...variantStyles,
      ...conditionalStyles,
      ...sx,
    };

    return (
      <Component ref={ref} sx={combinedStyles} {...rest}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';
