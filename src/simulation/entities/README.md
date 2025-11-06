# Entities Directory

Physical components of the solar thermal simulation system. Each entity represents a real-world component with thermodynamic properties and behaviors.

## Base Class

**[BaseSystemEntity](./baseSystemEntity.ts)** - Abstract base class for all system components
- Manages temperature state and fluid flow properties
- Defines inlet/outlet conditions interface
- Requires `update()` implementation for physics calculations

## System Entities

### [SolarPanel](./solarPanel.ts)
Solar thermal collector that captures energy from heat sources (sun).
- Captures solar radiation and converts to heat
- Transfers heat to circulating fluid
- Handles stagnation conditions and heat loss
- **Key Properties**: efficiency, surface area, thermal mass, U-value

### [StorageTank](./storageTank.ts)
Insulated water storage with thermal stratification.
- Stores thermal energy in heated water
- Models temperature stratification (hot top, cold bottom)
- Calculates heat loss through insulation
- **Key Properties**: volume, max temperature, stored energy, U-value

### [CirculationPump](./circulationPump.ts)
Drives fluid flow through the system.
- Controls flow rate based on temperature differential
- Consumes electrical energy
- Start/stop logic based on collector vs tank temps
- **Key Properties**: flow rate, power consumption, on/off state

### [ThermalPipe](./thermalPipe.ts)
Connects system components and transports heated fluid.
- Models heat loss during fluid transport
- Calculates outlet temperature based on flow and insulation
- **Key Properties**: length, diameter, insulation quality, flow resistance

### [HeatSource](./heatSource.ts)
Represents solar radiation or other heat input.
- Provides irradiance data over time
- Can simulate daily solar patterns
- **Key Properties**: irradiance (W/m²), ambient temperature

## Entity Lifecycle

All entities follow this update cycle:

1. **Set inlet conditions** - Receive temperature and flow rate from upstream component
2. **Update physics** - Calculate internal state changes (heat transfer, energy storage, etc.)
3. **Provide outlet conditions** - Output temperature and flow to downstream component

## Usage

```tsx
import { SolarPanel, StorageTank, CirculationPump } from '@/simulation/entities';

// Create system components
const panel = new SolarPanel({ heatSources: [sun], efficiency: 0.7 });
const tank = new StorageTank({ volume: 0.3, initialTemp: 20 });
const pump = new CirculationPump({ maxFlowRate: 0.0005 });

// Update each timestep
panel.update(deltaTime, config);
pump.update(deltaTime, config);
tank.update(deltaTime, config);
```

## Physics Models

- **Heat Transfer**: Q = m × c × ΔT (sensible heat)
- **Heat Loss**: Q = U × A × ΔT (conduction through insulation)
- **Fluid Flow**: Energy transport via mass flow rate
- **Stratification**: Simplified two-layer model (hot top, cold bottom)

## Adding New Entities

1. Extend `BaseSystemEntity`
2. Define entity-specific configuration interface
3. Implement `update()` method with physics calculations
4. Set `outletTemperature` based on thermodynamic behavior
5. Export from [index.ts](./index.ts)
