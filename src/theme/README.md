# Theme Directory

Centralized theming system using Theme UI for consistent styling across the application.

## Structure

- [theme.ts](./theme.ts) - Main theme configuration with colors, typography, spacing, and breakpoints
- [rawColors.ts](./rawColors.ts) - Color palette definitions
- [types.ts](./types.ts) - TypeScript type definitions
- [component-variants/](./component-variants/) - Styled variants for components (buttons, text, etc.)

## Features

- **Light/Dark Mode** - Automatic theme switching with system preference detection
- **Responsive Breakpoints** - Mobile-first responsive design system
- **Type-Safe** - Full TypeScript support for theme values
- **Component Variants** - Pre-defined style variants for consistent component styling

## Usage

```tsx
import { DefaultTheme } from '@/theme';
import { ThemeProvider } from 'theme-ui';

<ThemeProvider theme={DefaultTheme}>
  <App />
</ThemeProvider>
```

Access theme values in components:

```tsx
import { useTheme } from 'theme-ui';

const { colors, space, breakpoints } = useTheme();
```

## Key Configuration

- **Colors**: Semantic color tokens (primary, secondary, success, error, etc.)
- **Breakpoints**: `['576px', '768px', '992px', '1200px', '1400px']`
- **Spacing Scale**: `[0, 4, 8, 12, 16, 24, 30, 60, 512]`
- **Font Sizes**: `[12, 14, 16, 20, 24, 32, 48, 64]`

## Adding Variants

Create new component variants in [component-variants/](./component-variants/):

1. Define variants in a new file (e.g., `card-variants.ts`)
2. Export from [component-variants/index.ts](./component-variants/index.ts)
3. Add to theme in [theme.ts](./theme.ts)
