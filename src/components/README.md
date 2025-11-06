# Components Directory

This directory contains the UI components for the Solar Panel Simulation application, organized using **Atomic Design principles**.

## Atomic Design Principles

Atomic Design is a methodology for creating design systems that breaks down user interfaces into fundamental building blocks. This approach creates a clear hierarchy and promotes reusability, consistency, and maintainability across the application.

### Design System Hierarchy

```
Atoms → Molecules → Organisms → Pages
```

Each level builds upon the previous one, creating increasingly complex and specialized components.

---

## Directory Structure

### [atoms/](./atoms/)

**Atoms** are the basic building blocks of the UI - the smallest, most fundamental components that cannot be broken down further without losing their meaning.

**Characteristics:**
- Single-purpose, highly reusable
- Accept minimal, focused props
- No business logic or state management
- Should work in isolation

**Examples in this project:**
- [Button](./atoms/button/) - Basic button component with variants
- [IconButton](./atoms/icon-button/) - Icon-based button for actions
- [Typography](./atoms/typography/) - Text rendering with consistent styling

**When to create an Atom:**
- Building a basic UI primitive (button, input, label, icon)
- Need consistent styling across the application
- Component has no dependencies on other components

---

### [molecules/](./molecules/)

**Molecules** are groups of atoms that work together as a functional unit. They are relatively simple combinations that serve a single purpose.

**Characteristics:**
- Composed of 2-3 atoms or other simple elements
- Have a specific function or purpose
- May contain simple local state
- Still highly reusable

**Examples in this project:**
- [PlaybackControls](./molecules/playback-controls/) - Combines icon buttons for play/pause/stop
- [SimulationRuntimeState](./molecules/simulation-runtime-state/) - Displays simulation timing information
- [ColorModeToggle](./molecules/color-mode-toggle/) - Theme switching control
- [DataTable](./molecules/data-table/) - Table component combining typography and structure

**When to create a Molecule:**
- Combining atoms into a reusable pattern
- Building a form field with label + input
- Creating a search bar with input + button
- Component serves a single, clear purpose

---

### [organisms/](./organisms/)

**Organisms** are complex UI components composed of molecules, atoms, and potentially other organisms. They form distinct sections of an interface.

**Characteristics:**
- Composed of multiple molecules and/or atoms
- Can contain business logic and application state
- May connect to external services or state management
- More context-specific than molecules

**Examples in this project:**
- [ControlPanel](./organisms/control-panel/) - Complete control interface combining playback controls, runtime state, and other molecules

**When to create an Organism:**
- Building a complete section of the UI (header, sidebar, form)
- Component needs to orchestrate multiple molecules
- Requires connection to application state or services
- Component represents a meaningful section of the page

---

### [pages/](./pages/)

**Pages** are the highest level of the atomic design hierarchy. They are specific instances of templates filled with real content and data.

**Characteristics:**
- Composed of organisms, molecules, and atoms
- Represent complete views or routes in the application
- Often connected to routing and data loading
- Least reusable, most specific to application context

**Examples in this project:**
- [SolarPanelSimulation](./pages/solar-panel-simulation/) - Complete simulation page layout

**When to create a Page:**
- Building a complete route/view in the application
- Assembling organisms into a full layout
- Implementing page-level data loading and routing

---

## Component Organization

Each component follows a consistent file structure:

```
component-name/
├── ComponentName.tsx          # Component implementation
├── ComponentName.test.tsx     # Unit tests
├── ComponentName.stories.tsx  # Storybook stories
└── index.ts                   # Barrel export
```

### Benefits of This Structure:

1. **Easy to locate** - Components are organized by their atomic level
2. **Self-contained** - Each component folder contains all related files
3. **Testable** - Tests live alongside implementation
4. **Documented** - Storybook stories provide visual documentation
5. **Simple imports** - Barrel exports allow clean imports

---

## Best Practices

### Composition Over Duplication

```tsx
// Good: Compose molecules from atoms
<PlaybackControls>
  <IconButton icon="play" />
  <IconButton icon="pause" />
  <IconButton icon="stop" />
</PlaybackControls>

// Avoid: Recreating button logic in the molecule
```

### Props Interface Design

- **Atoms**: Generic, flexible props (variant, size, color)
- **Molecules**: Domain-specific props (isPlaying, currentTime)
- **Organisms**: Application-specific props (simulationState, onUpdate)

### State Management Guidelines

- **Atoms**: No state (or only UI state like hover/focus)
- **Molecules**: Simple local state (form input values, toggle states)
- **Organisms**: Complex state, may connect to global state management
- **Pages**: Route-level state and data loading

### Moving Components Between Levels

As the application evolves, you may need to move components:

- **Promote** a molecule to an organism when it grows complex
- **Demote** an organism to a molecule if it becomes generic enough
- **Extract** atoms from molecules when patterns emerge

---

## Testing Strategy

Each atomic level has different testing priorities:

- **Atoms**: Visual regression, accessibility, interaction states
- **Molecules**: User interactions, data flow between atoms
- **Organisms**: Business logic, integration with services
- **Pages**: User workflows, routing, data loading

---

## Storybook Integration

All components include Storybook stories for:
- Visual development and testing
- Component documentation
- Design system showcase
- Accessibility testing

Run Storybook: `npm run storybook`

---

## Importing Components

Components are exported through barrel files at each level:

```tsx
// Import atoms
import { Button, Typography, IconButton } from '@/components/atoms';

// Import molecules
import { PlaybackControls, DataTable } from '@/components/molecules';

// Import organisms
import { ControlPanel } from '@/components/organisms';

// Or import everything
import { Button, PlaybackControls, ControlPanel } from '@/components';
```

---

## Adding New Components

1. **Determine the atomic level** based on complexity and purpose
2. **Create the component folder** in the appropriate directory
3. **Implement the component** with TypeScript and proper typing
4. **Write tests** to ensure functionality and prevent regressions
5. **Create Storybook stories** for documentation and visual testing
6. **Export from index.ts** in the component folder
7. **Add to the level's barrel export** (atoms/index.ts, molecules/index.ts, etc.)

---

## Resources

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Component-Driven Development](https://www.componentdriven.org/)

---

## Questions?

When deciding where a component belongs, ask:

1. Can this be broken down further? → It's not an atom
2. Does it combine multiple atoms? → It's at least a molecule
3. Does it represent a complete section? → It's likely an organism
4. Does it represent a full page/view? → It's a page

The boundaries aren't always clear-cut, and that's okay. The goal is consistency and maintainability, not perfect categorization.
