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

    if (this.flowRate > 0) {
      // Transferring Energy

      const massFlowRate = this.flowRate * density; // kg/s

      const maxTempRise =
        this.energyCaptured / (massFlowRate * specificHeatCapacity);

      this.outletTemperature = this.inletTemperature + maxTempRise;

      this.energyTransferred =
        massFlowRate *
        specificHeatCapacity *
        (this.outletTemperature - this.inletTemperature);

      // Simple Avg for internal temp
      this.temperature = (this.inletTemperature * this.outletTemperature) / 2;
    } else {
      // Stagnation Condition -> no flow
      this.energyTransferred = 0;
      this.outletTemperature = this.temperature;

      // Heat panel from solar
      const energyGain = this.energyCaptured * deltaTime; // J
      const tempIncrease =
        energyGain / (this.thermalMass * specificHeatCapacity);

      // Ambient Heat Loss
      const heatLoss =
        this.uValue *
        this.surfaceArea *
        (this.temperature - config.ambientTemperature) *
        deltaTime;
      const tempDecrease = heatLoss / (this.thermalMass * specificHeatCapacity);

      // Apply heat and cap at max
      this.temperature += tempIncrease - tempDecrease;
      this.temperature = Math.min(this.temperature, this.maxStagnationTemp);
    }

    // this.temperature += this.energyCaptured / (this.surfaceArea * 500);
  }
}
