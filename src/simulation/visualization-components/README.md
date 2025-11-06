# Visualization Components

3D visualization of the solar thermal system using **React Three Fiber** (R3F), a React renderer for Three.js.

## Overview

React Three Fiber provides a declarative way to build 3D scenes with Three.js using React components. All visualization components are R3F components that render within a `<Canvas>` element.

## Main Components

### [SolarThermalDashboard](./solar-thermal-visualization/SolarThermalDashboard.tsx)

Top-level component combining 3D visualization with UI controls.

- Wraps the 3D scene in R3F `<Canvas>`
- Integrates control panel and data display
- Manages simulation state and time scale

### [Scene](./scene/Scene.tsx)

Main 3D scene containing all system components.

- Uses `useFrame` hook for animation loop
- Updates simulation physics each frame
- Positions and connects all 3D entities

## 3D Entity Components

Each simulation entity has a corresponding 3D visualization component:

### [SolarPanel3D](./solar-panel-3D/)

- Renders FBX model of solar collector
- Shows temperature and energy capture on hover
- Color-coded by temperature

### [StorageTank3D](./storage-tank-3D/)

- Cylindrical tank with temperature gradient visualization
- Displays water level and stratification
- Shows stored energy metrics

### [CirculationPump3D](./circulation-pump-3D/)

- Animated pump model when active
- Displays flow rate and power consumption
- Visual on/off state indication

### [ThermalPipe3D](./thermal-pipe-3D/)

- Tube geometry connecting components
- Transparent material showing internal flow
- Temperature-based color gradient

### [Sun3D](./sun-3D/)

- Directional light source simulating solar radiation
- Animated sun position tracking time of day
- Provides irradiance data to solar panel

### [FluidFlow](./fluid-flow/)

- Animated particle system showing fluid movement
- Particles flow along pipe paths
- Speed based on flow rate, color based on temperature

## React Three Fiber Concepts

### Canvas

The root container for all 3D content:

```tsx
<Canvas camera={{ position: [0, 20, 30] }}>
  <Scene />
</Canvas>
```

### useFrame Hook

Animation loop that runs every frame:

```tsx
useFrame((state, delta) => {
  // Update physics
  system.update(delta * timeScale);
});
```

### Three.js Integration

- Access Three.js primitives via JSX: `<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>`
- Use Three.js types: `THREE.Vector3`, `THREE.Color`, `THREE.Curve`
- Load 3D models with loaders: `useLoader(FBXLoader, path)`

### React Three Drei

Helper library providing useful abstractions:

- `<OrbitControls>` - Camera controls for scene navigation
- `<Billboard>` - UI elements that face the camera
- `<Text>` - 3D text rendering

## Key Patterns

### State Synchronization

3D components receive simulation state as props:

```tsx
<SolarPanel3D
  temperature={systemState.solarPanel.temperature}
  energyCaptured={systemState.solarPanel.energyCaptured}
/>
```
