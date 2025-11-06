# Entities Directory

Physical components of the solar thermal simulation system with thermodynamic properties and behaviors.

## Base Class

**[BaseSystemEntity](./baseSystemEntity.ts)** - Abstract base for all system components

- Manages temperature state and fluid flow
- Defines inlet/outlet interface
- Requires `update()` implementation

## System Entities

### [SolarPanel](./solarPanel.ts)

Captures solar radiation and converts to heat

- **Key Properties**: efficiency, surface area, thermal mass, U-value

### [StorageTank](./storageTank.ts)

Insulated water storage with thermal stratification

- **Key Properties**: volume, max temperature, stored energy, U-value

### [CirculationPump](./circulationPump.ts)

Drives fluid flow through the system

- **Key Properties**: flow rate, power consumption, on/off state

### [ThermalPipe](./thermalPipe.ts)

Connects components and transports heated fluid

- **Key Properties**: length, diameter, insulation quality, flow resistance

### [HeatSource](./heatSource.ts)

Represents solar radiation or other heat input

- **Key Properties**: irradiance (W/m²), ambient temperature

## Entity Lifecycle

1. **Set inlet conditions** - Receive temperature and flow from upstream
2. **Update physics** - Calculate state changes (heat transfer, energy storage)
3. **Provide outlet conditions** - Output temperature and flow to downstream

## Usage

```tsx
import {
  SolarPanel,
  StorageTank,
  CirculationPump,
} from '@/simulation/entities';

const panel = new SolarPanel({ heatSources: [sun], efficiency: 0.7 });
const tank = new StorageTank({ volume: 0.3, initialTemp: 20 });
const pump = new CirculationPump({ maxFlowRate: 0.0005 });

// Update each timestep
panel.update(deltaTime, config);
pump.update(deltaTime, config);
tank.update(deltaTime, config);
```

## Adding New Entities

1. Extend `BaseSystemEntity`
2. Define configuration interface
3. Implement `update()` with physics calculations
4. Set `outletTemperature` based on behavior
5. Export from [index.ts](./index.ts)
