# Visualization Components

3D visualization of the solar thermal system using **React Three Fiber** (R3F).

## Main Components

### [SolarThermalDashboard](./solar-thermal-visualization/SolarThermalDashboard.tsx)

Top-level component combining 3D visualization with UI controls.

### [Scene](./scene/Scene.tsx)

Main 3D scene containing all system components. Uses `useFrame` hook for animation loop.

## 3D Entity Components

- **[SolarPanel3D](./solar-panel-3D/)** - FBX model with temperature-based coloring
- **[StorageTank3D](./storage-tank-3D/)** - Cylindrical tank with temperature gradient
- **[CirculationPump3D](./circulation-pump-3D/)** - Animated pump showing flow rate
- **[ThermalPipe3D](./thermal-pipe-3D/)** - Tube geometry with temperature gradient
- **[Sun3D](./sun-3D/)** - Directional light source with animated position
- **[FluidFlow](./fluid-flow/)** - Particle system showing fluid movement

## Key Patterns

### Canvas Setup

```tsx
<Canvas camera={{ position: [0, 20, 30] }}>
  <Scene />
</Canvas>
```

### Animation Loop

```tsx
useFrame((state, delta) => {
  system.update(delta * timeScale);
});
```

### State Synchronization

```tsx
<SolarPanel3D
  temperature={systemState.solarPanel.temperature}
  energyCaptured={systemState.solarPanel.energyCaptured}
/>
```

## Libraries

- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components (`OrbitControls`, `Billboard`, `Text`)
