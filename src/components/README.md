# Components Directory

UI components organized using **Atomic Design principles**: building from simple to complex.

## Structure

```
atoms/        → Basic building blocks (buttons, typography, icons)
molecules/    → Simple combinations of atoms (playback controls, data tables)
organisms/    → Complex sections combining molecules (control panel, headers)
pages/        → Complete views and routes
```

## Component Organization

```
component-name/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

## When to Create Each Level

- **Atom**: Basic UI primitive, works in isolation, no dependencies
- **Molecule**: 2-3 atoms working together for a single purpose
- **Organism**: Complete UI section with business logic and state
- **Page**: Full views connected to routing and data

## Development

Run Storybook: `npm run storybook`
