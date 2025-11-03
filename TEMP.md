# Solar Thermal System Simulation Guide

## System Overview

Your solar thermal system consists of a closed-loop circuit where:

1. **Solar Panel** collects heat from the sun
2. **Circulation Pump** moves the working fluid through the system
3. **Hot fluid** flows from panel to storage tank (outlet pipe)
4. **Cool fluid** returns from storage tank to panel (inlet pipe)
5. **Storage Tank** accumulates and stores thermal energy

## Key Missing Concepts

### 1. Working Fluid

You need a concept of working fluid (typically water or glycol mixture) that transfers heat through the system. This fluid has:

- Mass flow rate (kg/s)
- Specific heat capacity
- Temperature at different points in the circuit

### 2. Energy Transfer Equations

The fundamental equation for heat transfer in flowing fluid:

```
Q = ṁ × Cp × ΔT
```

Where:

- Q = Heat transfer rate (W)
- ṁ = Mass flow rate (kg/s)
- Cp = Specific heat capacity (J/kg·K)
- ΔT = Temperature difference (K)

### 3. System Connections

Your entities need to be connected in a circuit, not just reference each other. Here's the proper flow:

```
Solar Panel → Outlet Pipe → Storage Tank → Inlet Pipe → Solar Panel
      ↑                                                      ↓
      └──────────── Circulation Pump drives flow ───────────┘
```

## Updated Entity Implementations

### SystemEntity Base Class

```typescript
export abstract class SystemEntity {
  id: string;
  temperature: TemperatureCelsius;

  constructor({ id, initialTemp }: { id: string; initialTemp: number }) {
    this.id = id;
    this.temperature = initialTemp;
  }

  abstract update(deltaTime: Time, config: SimulationConfig): void;
}
```

### Working Fluid Interface

```typescript
interface WorkingFluid {
  temperature: TemperatureCelsius;
  flowRate: number; // m³/s
  specificHeatCapacity: number; // J/(kg·K)
  density: number; // kg/m³
}
```

### Updated Solar Panel

```typescript
export class SolarPanel extends SystemEntity {
  private sunSources: HeatSource[];
  public efficiency: number;
  public surfaceArea: number;
  public heatCaptured: Energy;

  // New properties for thermal dynamics
  private workingFluid: WorkingFluid;
  private outletTemperature: TemperatureCelsius;

  constructor(config: SolarPanelConfig) {
    super({ id: `solar_panel-${uuidv4()}`, initialTemp: 25 });
    this.sunSources = config.heatSources;
    this.efficiency = config.efficiency ?? 0.2;
    this.surfaceArea = config.surfaceArea ?? 2;
    this.heatCaptured = 0;

    // Initialize working fluid
    this.workingFluid = {
      temperature: 25,
      flowRate: 0,
      specificHeatCapacity: 4186, // Water
      density: 1000, // Water
    };
    this.outletTemperature = 25;
  }

  public update(deltaTime: Time, config: SimulationConfig): void {
    // Calculate solar heat input
    const solarIrradiance = this.sunSources.reduce((sum, source) => {
      return sum + source.generateHeat();
    }, 0);

    this.heatCaptured = solarIrradiance * this.efficiency * this.surfaceArea;

    // Calculate outlet temperature based on heat transfer to fluid
    if (this.workingFluid.flowRate > 0) {
      const massFlowRate =
        this.workingFluid.flowRate * this.workingFluid.density;
      const temperatureRise =
        this.heatCaptured /
        (massFlowRate * this.workingFluid.specificHeatCapacity);

      this.outletTemperature = this.workingFluid.temperature + temperatureRise;

      // Panel temperature is average of inlet and outlet
      this.temperature =
        (this.workingFluid.temperature + this.outletTemperature) / 2;
    } else {
      // Stagnation condition - panel heats up
      const panelMass = this.surfaceArea * 10; // kg (approximate)
      const tempIncrease =
        (this.heatCaptured * deltaTime) /
        (panelMass * this.workingFluid.specificHeatCapacity);
      this.temperature += tempIncrease;

      // Limit maximum temperature
      this.temperature = Math.min(this.temperature, 95);
    }
  }

  public setInletConditions(
    temperature: TemperatureCelsius,
    flowRate: number
  ): void {
    this.workingFluid.temperature = temperature;
    this.workingFluid.flowRate = flowRate;
  }

  public getOutletTemperature(): TemperatureCelsius {
    return this.outletTemperature;
  }
}
```

### Updated Storage Tank

```typescript
export class StorageTank extends SystemEntity {
  volume: number; // m³
  maxTemperature: number; // °C
  storedEnergy: Energy; // J
  heatLossCoefficient: number; // W/(m²·K)

  // New properties for stratification and flow
  private layers: TemperatureCelsius[]; // Temperature stratification
  private inflowTemperature: TemperatureCelsius;
  private flowRate: number; // m³/s

  constructor(config: StorageTankConfig = {}) {
    super({ id: `storage_tank-${uuidv4()}`, initialTemp: 20 });

    this.volume = config.volume ?? 0.2;
    this.maxTemperature = config.maxTemperature ?? 80;
    this.heatLossCoefficient = config.heatLossCoefficient ?? 0.5;

    // Initialize stratified layers (e.g., 5 layers)
    this.layers = Array(5).fill(this.temperature);
    this.inflowTemperature = this.temperature;
    this.flowRate = 0;
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    const waterDensity = 1000; // kg/m³
    const specificHeat = 4186; // J/(kg·K)

    if (this.flowRate > 0) {
      // Stratified charging - hot water enters at top
      const massFlowRate = this.flowRate * waterDensity;
      const layerVolume = this.volume / this.layers.length;
      const layerMass = layerVolume * waterDensity;

      // Simple stratification model
      const mixingFactor = (massFlowRate * deltaTime) / layerMass;

      // Hot water enters at top
      this.layers[0] =
        this.layers[0] * (1 - mixingFactor) +
        this.inflowTemperature * mixingFactor;

      // Cascade through layers
      for (let i = 1; i < this.layers.length; i++) {
        this.layers[i] =
          this.layers[i] * (1 - mixingFactor * 0.5) +
          this.layers[i - 1] * mixingFactor * 0.5;
      }
    }

    // Heat loss to environment
    const surfaceArea = 2 * Math.PI * Math.pow(this.volume / Math.PI, 2 / 3);
    const heatLoss =
      this.heatLossCoefficient *
      surfaceArea *
      (this.temperature - config.ambientTemperature) *
      deltaTime;

    // Apply heat loss to all layers
    const heatLossPerLayer = heatLoss / this.layers.length;
    for (let i = 0; i < this.layers.length; i++) {
      const layerMass = (this.volume / this.layers.length) * waterDensity;
      const tempDecrease = heatLossPerLayer / (layerMass * specificHeat);
      this.layers[i] = Math.max(
        config.ambientTemperature,
        this.layers[i] - tempDecrease
      );
    }

    // Update average temperature
    this.temperature =
      this.layers.reduce((sum, t) => sum + t, 0) / this.layers.length;

    // Calculate stored energy
    const totalMass = this.volume * waterDensity;
    this.storedEnergy =
      totalMass * specificHeat * (this.temperature - config.ambientTemperature);
  }

  public setInflowConditions(
    temperature: TemperatureCelsius,
    flowRate: number
  ): void {
    this.inflowTemperature = temperature;
    this.flowRate = flowRate;
  }

  public getOutflowTemperature(): TemperatureCelsius {
    // Return temperature from bottom layer (cold water outlet)
    return this.layers[this.layers.length - 1];
  }

  public getTopTemperature(): TemperatureCelsius {
    return this.layers[0];
  }

  public getBottomTemperature(): TemperatureCelsius {
    return this.layers[this.layers.length - 1];
  }
}
```

### Updated Circulation Pump

```typescript
export class CirculationPump extends SystemEntity {
  public flowRate: number; // m³/s
  public energyConsumption: Energy; // W
  public isRunning: boolean;

  // Control parameters
  private minTemperatureDifference: number; // °C
  private maxFlowRate: number; // m³/s

  constructor(config: CirculationPumpConfig = {}) {
    super({ id: `circulation_pump-${uuidv4()}`, initialTemp: 20 });
    this.flowRate = 0;
    this.maxFlowRate = config.maxFlowRate ?? 0.001;
    this.energyConsumption = config.energyConsumption ?? 50;
    this.isRunning = false;
    this.minTemperatureDifference = 5; // Start pumping when ΔT > 5°C
  }

  public update(
    deltaTime: Time,
    config: SimulationConfig,
    panelTemp: TemperatureCelsius,
    tankBottomTemp: TemperatureCelsius
  ): void {
    // Simple differential controller
    const temperatureDifference = panelTemp - tankBottomTemp;

    if (temperatureDifference > this.minTemperatureDifference) {
      this.isRunning = true;
      // Variable flow rate based on temperature difference
      const flowFactor = Math.min(1, temperatureDifference / 20);
      this.flowRate = this.maxFlowRate * flowFactor;
    } else if (temperatureDifference < 2) {
      // Hysteresis to prevent rapid on/off cycling
      this.isRunning = false;
      this.flowRate = 0;
    }

    // Pump temperature follows fluid temperature
    if (this.isRunning) {
      this.temperature = tankBottomTemp;
    }
  }

  public calculatePowerUsage(): Energy {
    return this.isRunning ? this.energyConsumption : 0;
  }

  public getFlowRate(): number {
    return this.flowRate;
  }
}
```

### Simplified Pipe Model

```typescript
export class ThermalPipe extends SystemEntity {
  length: number; // m
  diameter: number; // m
  heatLossCoefficient: number; // W/(m·K)

  private inletTemperature: TemperatureCelsius;
  private outletTemperature: TemperatureCelsius;
  private flowRate: number;

  constructor(config: ThermalPipeConfig = {}) {
    super({ id: `thermal_pipe-${uuidv4()}`, initialTemp: 20 });
    this.length = config.length ?? 5;
    this.diameter = config.diameter ?? 0.025;
    this.heatLossCoefficient = config.heatLossCoefficient ?? 0.5;

    this.inletTemperature = 20;
    this.outletTemperature = 20;
    this.flowRate = 0;
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    if (this.flowRate > 0) {
      // Calculate heat loss along pipe
      const surfaceArea = Math.PI * this.diameter * this.length;
      const avgTemp = (this.inletTemperature + this.outletTemperature) / 2;
      const heatLoss =
        this.heatLossCoefficient *
        surfaceArea *
        (avgTemp - config.ambientTemperature);

      // Calculate temperature drop
      const waterDensity = 1000; // kg/m³
      const specificHeat = 4186; // J/(kg·K)
      const massFlowRate = this.flowRate * waterDensity;

      const tempDrop = heatLoss / (massFlowRate * specificHeat);
      this.outletTemperature = this.inletTemperature - tempDrop;

      // Pipe temperature is average
      this.temperature = avgTemp;
    } else {
      // No flow - pipe temperature approaches ambient
      const coolingRate = 0.01;
      this.temperature +=
        (config.ambientTemperature - this.temperature) *
        coolingRate *
        deltaTime;
      this.outletTemperature = this.temperature;
    }
  }

  public setFlowConditions(
    inletTemp: TemperatureCelsius,
    flowRate: number
  ): void {
    this.inletTemperature = inletTemp;
    this.flowRate = flowRate;
  }

  public getOutletTemperature(): TemperatureCelsius {
    return this.outletTemperature;
  }
}
```

## System Manager Class

You need a central manager to coordinate the entities:

```typescript
export class SolarThermalSystem {
  private heatSource: HeatSource;
  private solarPanel: SolarPanel;
  private pump: CirculationPump;
  private storageTank: StorageTank;
  private outletPipe: ThermalPipe;
  private inletPipe: ThermalPipe;

  private simulationTime: number = 0;
  private isPaused: boolean = false;

  constructor() {
    // Initialize components
    this.heatSource = new HeatSource();
    this.solarPanel = new SolarPanel({
      heatSources: [this.heatSource],
      efficiency: 0.7,
      surfaceArea: 2,
    });
    this.pump = new CirculationPump({
      maxFlowRate: 0.0005, // 0.5 L/s
      energyConsumption: 50,
    });
    this.storageTank = new StorageTank({
      volume: 0.2, // 200 L
      maxTemperature: 80,
    });
    this.outletPipe = new ThermalPipe({
      length: 3,
      diameter: 0.025,
    });
    this.inletPipe = new ThermalPipe({
      length: 3,
      diameter: 0.025,
    });
  }

  public update(deltaTime: Time, config: SimulationConfig): void {
    if (this.isPaused) return;

    this.simulationTime += deltaTime;

    // Update heat source
    this.heatSource.update(this.simulationTime, config);

    // Update pump controller based on temperatures
    this.pump.update(
      deltaTime,
      config,
      this.solarPanel.temperature,
      this.storageTank.getBottomTemperature()
    );

    const flowRate = this.pump.getFlowRate();

    // Update inlet pipe (tank → panel)
    this.inletPipe.setFlowConditions(
      this.storageTank.getOutflowTemperature(),
      flowRate
    );
    this.inletPipe.update(deltaTime, config);

    // Update solar panel
    this.solarPanel.setInletConditions(
      this.inletPipe.getOutletTemperature(),
      flowRate
    );
    this.solarPanel.update(deltaTime, config);

    // Update outlet pipe (panel → tank)
    this.outletPipe.setFlowConditions(
      this.solarPanel.getOutletTemperature(),
      flowRate
    );
    this.outletPipe.update(deltaTime, config);

    // Update storage tank
    this.storageTank.setInflowConditions(
      this.outletPipe.getOutletTemperature(),
      flowRate
    );
    this.storageTank.update(deltaTime, config);
  }

  public start(): void {
    this.isPaused = false;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public stop(): void {
    this.isPaused = true;
    this.simulationTime = 0;
    // Reset all components to initial state
  }

  public step(deltaTime: Time, config: SimulationConfig): void {
    const wasPaused = this.isPaused;
    this.isPaused = false;
    this.update(deltaTime, config);
    this.isPaused = wasPaused;
  }

  public getSystemState() {
    return {
      time: this.simulationTime,
      solarIntensity: this.heatSource.intensity,
      panelTemperature: this.solarPanel.temperature,
      panelHeatCaptured: this.solarPanel.heatCaptured,
      pumpFlowRate: this.pump.flowRate,
      pumpPower: this.pump.calculatePowerUsage(),
      tankTemperature: this.storageTank.temperature,
      tankTopTemp: this.storageTank.getTopTemperature(),
      tankBottomTemp: this.storageTank.getBottomTemperature(),
      storedEnergy: this.storageTank.storedEnergy,
      outletPipeTemp: this.outletPipe.temperature,
      inletPipeTemp: this.inletPipe.temperature,
    };
  }
}
```

## Key Improvements Made

1. **Proper Energy Flow**: Energy now flows through the system via the working fluid, not just as isolated heat calculations.

2. **Temperature Coupling**: Each component's outlet temperature becomes the next component's inlet temperature.

3. **Flow Rate Dependency**: Heat transfer depends on the circulation pump's flow rate.

4. **Differential Control**: The pump runs based on temperature difference between panel and tank.

5. **Tank Stratification**: The storage tank models temperature layers, with hot water at top and cold at bottom.

6. **Stagnation Handling**: When pump is off, components handle stagnation conditions.

7. **System Coordination**: The SolarThermalSystem class manages the update order and data flow.

## Simulation Tips

1. **Time Step**: Use small time steps (1-60 seconds) for accurate thermal dynamics.

2. **Initial Conditions**: Start with all components at ambient temperature.

3. **Validation**: Monitor energy balance - energy in (solar) should equal energy stored + losses.

4. **UI Visualization**: Show:

   - Flow animation when pump is running
   - Temperature gradients with colors
   - Real-time graphs of temperatures and energy
   - System efficiency metrics

5. **Control Strategies**: Implement different pump control strategies:
   - Simple differential control (current)
   - PID control for optimal efficiency
   - Weather-predictive control

This architecture provides a realistic solar thermal simulation suitable for educational and visualization purposes while keeping the physics tractable for web applications.
