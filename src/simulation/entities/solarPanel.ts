import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';

import type {
  Energy,
  SimulationConfig,
  TemperatureCelsius,
  Time,
} from '../types';
import type { HeatSource } from './heatSource';

interface SolarPanelConfig {
  heatSources: HeatSource[];
  efficiency?: number;
  surfaceArea?: number;
  thermalMass?: number; // kg
  uValue?: number; // W/(m²·K) - heat loss coefficient
  maxStagnationTemp?: TemperatureCelsius;
}

export class SolarPanel extends BaseSystemEntity {
  private heatSources: HeatSource[]; // Allow for multiple heat sources
  public efficiency: number; // Percentage as decimal (0-1)
  public surfaceArea: number; // m²,
  public energyCaptured: Energy; // Watts (W)
  public energyTransferred: Energy; // Watts (W)
  public uValue: number; // W/(m²·K)
  public thermalMass: number; // kg
  private maxStagnationTemp: TemperatureCelsius;

  constructor(config: SolarPanelConfig) {
    super({ id: `solar_panel-${uuidv4()}`, initialTemp: 25 });
    this.heatSources = config.heatSources;
    this.efficiency = config.efficiency ?? 0.2;
    this.surfaceArea = config.surfaceArea ?? 2;
    this.uValue = config.uValue ?? 0.5;
    this.thermalMass = config.thermalMass ?? 10;
    this.energyTransferred = 0;
    this.energyCaptured = 0;
    this.maxStagnationTemp = 120;
  }

  public update(deltaTime: Time, config: SimulationConfig): void {
    const heatCumulative = this.heatSources.reduce((prevVal, currSource) => {
      return prevVal + currSource.getSolarRadiation();
    }, 0);

    this.energyCaptured = heatCumulative * this.efficiency * this.surfaceArea;

    const { density, specificHeatCapacity } = config.workingFluid;

    // Ensure temperature is valid before calculations
    const absoluteMin = -10;
    if (
      this.temperature === null ||
      isNaN(this.temperature) ||
      this.temperature === undefined
    ) {
      this.temperature = config.ambientTemperature;
    }
    this.temperature = Math.max(
      Math.min(this.temperature, this.maxStagnationTemp),
      absoluteMin
    );

    if (this.flowRate > 0) {
      // Fluid flowing: heat transfer to fluid
      const massFlowRate = this.flowRate * density; // kg/s

      // Simple calculation: energy heats the fluid
      const maxTempRise =
        this.energyCaptured / (massFlowRate * specificHeatCapacity);

      this.outletTemperature = this.inletTemperature + maxTempRise;

      this.energyTransferred =
        massFlowRate *
        specificHeatCapacity *
        (this.outletTemperature - this.inletTemperature);

      // Panel temperature is average of inlet and outlet
      this.temperature = (this.inletTemperature + this.outletTemperature) / 2;
    } else {
      // No flow: panel heats up from solar radiation or cools to ambient
      this.energyTransferred = 0;
      this.outletTemperature = this.temperature;

      // Heating from solar radiation
      const heatingRate =
        this.energyCaptured / (this.thermalMass * specificHeatCapacity);

      // Ambient cooling - much slower to match other components
      const coolingRate = 0.00005; // Slower cooling for thermal mass
      const coolingFactor = Math.min(1, coolingRate * deltaTime); // Cap to prevent overshoot

      this.temperature =
        this.temperature +
        heatingRate * deltaTime +
        (config.ambientTemperature - this.temperature) * coolingFactor;

      // Cap at max stagnation temperature
      this.temperature = Math.min(this.temperature, this.maxStagnationTemp);
    }

    // Ensure temperatures stay within reasonable bounds
    this.temperature = Math.max(this.temperature, absoluteMin);
    this.outletTemperature = Math.max(this.outletTemperature, absoluteMin);
    this.outletTemperature = Math.min(
      this.outletTemperature,
      this.maxStagnationTemp
    );

    // Check for NaN in any temperature property
    if (isNaN(this.temperature)) {
      throw new Error(
        `[SolarPanel] NaN detected in temperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            energyCaptured: this.energyCaptured,
            energyTransferred: this.energyTransferred,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.outletTemperature)) {
      throw new Error(
        `[SolarPanel] NaN detected in outletTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            energyCaptured: this.energyCaptured,
            energyTransferred: this.energyTransferred,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
  }
}
