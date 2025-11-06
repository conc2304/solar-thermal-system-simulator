# Solar Thermal System Simulation

Interactive 3D simulation of a solar thermal heating system with real-time physics modeling and visualization.

## Overview

This application simulates a complete solar thermal system including solar collectors, storage tank, circulation pump, and piping. The simulation models thermodynamic behavior in real-time and renders it in an interactive 3D environment.

## Live Demo

[View the running application](https://conc2304.github.io/solar-thermal-system-simulator/)

## Tech Stack

### Core Framework

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool with fast HMR

### 3D Rendering

- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Helper library for R3F (OrbitControls, Text, etc.)
- **Three.js** - WebGL 3D graphics library

### Design System

- **Theme UI** - Constraint-based design tokens and theming
- **Emotion** - CSS-in-JS styling
- **Atomic Design** - Component organization methodology

### Testing & Documentation

- **Jest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **Storybook** - Component development and documentation

### Code Quality

- **ESLint** - Linting with TypeScript support
- **Prettier** - Code formatting

## Architecture

```
src/
├── components/          # UI components (Atomic Design)
│   ├── atoms/          # Basic UI elements
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex sections
│   └── pages/          # Full page layouts
├── simulation/         # Physics engine
│   ├── entities/       # Physical components
│   ├── solar-storage-system/  # System orchestrator
│   └── visualization-components/  # 3D visualization
└── theme/              # Design tokens and variants
```

### Key Architectural Decisions

**Design System**: Theme UI provides centralized theming with light/dark mode support and responsive design tokens. Components follow Atomic Design principles for reusability and maintainability.

**3D Visualization**: React Three Fiber enables declarative 3D scene construction. The simulation engine updates physics each frame via `useFrame` hook, with 3D components rendering synchronized state.

**Simulation Engine**: Object-oriented entity system where each component (solar panel, tank, pump, pipes) extends `BaseSystemEntity`. The `SolarThermalSystem` orchestrator connects entities and manages fluid flow between them.

**TypeScript Configuration**: Project uses composite TypeScript configuration with separate configs for app code ([tsconfig.app.json](./tsconfig.app.json)) and build tooling ([tsconfig.node.json](./tsconfig.node.json)).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

## Available Commands

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement at `http://localhost:5173`

### Build

```bash
npm run build
```

Compiles TypeScript and builds production bundle to `dist/`

### Preview

```bash
npm run preview
```

Previews production build locally

### Testing

```bash
npm test
```

Runs Jest unit tests

```bash
npm run coverage
```

Generates test coverage report

### Storybook

```bash
npm run storybook
```

Launches Storybook component explorer at `http://localhost:6006`

```bash
npm run build-storybook
```

Builds static Storybook for deployment

### Linting

```bash
npm run lint
```

Runs ESLint on all source files

## Project Configuration

### Vite Configuration ([vite.config.ts](./vite.config.ts))

- React plugin with Babel preset for Theme UI JSX pragma
- Path aliases via `vite-tsconfig-paths`
- Bundle analyzer for build optimization
- Vitest integration for Storybook testing
- Code splitting strategy for Three.js

### Jest Configuration ([jest.config.js](./jest.config.js))

- jsdom test environment
- Path alias resolution matching Vite
- Coverage collection from `src/`

### TypeScript Configuration

- Composite project structure
- Strict type checking enabled
- Path aliases: `@/` → `src/`
- JSX: React with Theme UI pragma

### Storybook Configuration ([.storybook/](./.storybook/))

- Vite builder for fast refresh
- Accessibility addon (a11y)
- Docs addon for component documentation
- Vitest addon for portable stories testing

## Documentation

- [Components README](./src/components/README.md) - Atomic Design principles
- [Theme README](./src/theme/README.md) - Design system tokens
- [Simulation README](./src/simulation/README.md) - Physics engine overview
- [Entities README](./src/simulation/entities/README.md) - System components
- [Visualization Components README](./src/simulation/visualization-components/README.md) - 3D rendering with R3F
