import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';

import type {
  Energy,
  SimulationConfig,
  TemperatureCelsius,
  Time,
} from '../types';

interface StorageTankConfig {
  volume?: number; // m³
  uValue?: number; // W/(m²·K) - insulation quality
  maxTemperature?: TemperatureCelsius; // °C
  initialTemp?: number; // °C
}

export class StorageTank extends BaseSystemEntity {
  public volume: number; // m³
  // private surfaceArea: number;
  public maxTemperature: TemperatureCelsius; // °C
  public uValue: number; // W/(m²·K)
  public storedEnergy: Energy; // J
  public heatLossRate: Energy; // W

  // Simplified stratification - track top and bottom temps
  private topTemperature: TemperatureCelsius;
  private bottomTemperature: TemperatureCelsius;

  constructor(config: StorageTankConfig = {}) {
    const initialTemp = config.initialTemp ?? 20;
    super({ id: `storage_tank-${uuidv4()}`, initialTemp });

    this.volume = config.volume ?? 0.2; // 200 liters
    // this.surfaceArea = this.calculateSurfaceArea(this.volume);

    this.uValue = config.uValue ?? 0.3; // Well insulated
    this.maxTemperature = config.maxTemperature ?? 90;

    this.topTemperature = initialTemp;
    this.bottomTemperature = initialTemp;
    this.storedEnergy = 0;
    this.heatLossRate = 0;
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    const { density, specificHeatCapacity } = config.workingFluid;
    const tankMass = this.volume * density;

    // Ensure main temperature is never null or NaN first
    if (
      this.temperature === null ||
      isNaN(this.temperature) ||
      this.temperature === undefined
    ) {
      this.temperature = config.ambientTemperature;
    }

    // Ensure stratification temperatures are never null or NaN
    if (
      this.topTemperature === null ||
      isNaN(this.topTemperature) ||
      this.topTemperature === undefined
    ) {
      this.topTemperature = this.temperature;
    }
    if (
      this.bottomTemperature === null ||
      isNaN(this.bottomTemperature) ||
      this.bottomTemperature === undefined
    ) {
      this.bottomTemperature = this.temperature;
    }

    // Clamp temperatures to reasonable bounds BEFORE calculations
    const absoluteMin = -50;
    this.temperature = Math.max(
      Math.min(this.temperature, this.maxTemperature),
      absoluteMin
    );
    this.topTemperature = Math.max(
      Math.min(this.topTemperature, this.maxTemperature),
      absoluteMin
    );
    this.bottomTemperature = Math.max(
      Math.min(this.bottomTemperature, this.maxTemperature),
      absoluteMin
    );

    if (this.flowRate > 0) {
      // Hot fluid entering tank
      const massFlowRate = this.flowRate * density; // kg/s

      // Simple mixing: blend incoming fluid temperature with tank temperature
      const mixingRate = (massFlowRate * deltaTime) / tankMass;
      const mixingFactor = Math.min(0.1, mixingRate); // Cap at 10% per update

      // Update tank temperature with incoming hot fluid
      this.temperature =
        this.temperature * (1 - mixingFactor) +
        this.inletTemperature * mixingFactor;

      // Simple stratification: top is warmer, bottom is cooler
      // Gradually adjust stratification to avoid jitter
      const stratificationDelta = 10; // 10°C difference between top and bottom
      const targetTopTemp = Math.min(
        this.temperature + stratificationDelta,
        this.maxTemperature
      );
      const targetBottomTemp = Math.max(
        this.temperature - stratificationDelta,
        config.ambientTemperature
      );

      // Smooth transition to target temperatures
      const stratificationRate = Math.min(1, 0.05 * deltaTime); // Cap at 100%
      this.topTemperature =
        this.topTemperature +
        (targetTopTemp - this.topTemperature) * stratificationRate;
      this.bottomTemperature =
        this.bottomTemperature +
        (targetBottomTemp - this.bottomTemperature) * stratificationRate;

      this.outletTemperature = this.bottomTemperature;
    } else {
      // No flow: temperatures gradually equalize
      const mixingFactor = Math.min(0.05, 0.005 * deltaTime); // Slower mixing when no flow
      this.topTemperature =
        this.topTemperature +
        (this.temperature - this.topTemperature) * mixingFactor;
      this.bottomTemperature =
        this.bottomTemperature +
        (this.temperature - this.bottomTemperature) * mixingFactor;

      this.outletTemperature = this.bottomTemperature;
    }

    // Simple ambient heat loss - reduced for better insulation
    const coolingRate = 0.0000001; // Much slower cooling for well-insulated tank
    const coolingFactor = Math.min(1, coolingRate * deltaTime); // Cap at 100% to prevent overshoot

    this.temperature =
      this.temperature +
      (config.ambientTemperature - this.temperature) * coolingFactor;

    this.topTemperature =
      this.topTemperature +
      (config.ambientTemperature - this.topTemperature) * coolingFactor;

    this.bottomTemperature =
      this.bottomTemperature +
      (config.ambientTemperature - this.bottomTemperature) * coolingFactor;

    // Cap all temperatures at reasonable maximums to prevent overflow
    this.temperature = Math.min(this.temperature, this.maxTemperature);
    this.topTemperature = Math.min(this.topTemperature, this.maxTemperature);
    this.bottomTemperature = Math.min(
      this.bottomTemperature,
      this.maxTemperature
    );

    // Ensure temperatures never go below absolute minimum (reuse absoluteMin from line 77)
    this.temperature = Math.max(this.temperature, absoluteMin);
    this.topTemperature = Math.max(this.topTemperature, absoluteMin);
    this.bottomTemperature = Math.max(this.bottomTemperature, absoluteMin);
    this.outletTemperature = Math.max(this.outletTemperature, absoluteMin);

    // Calculate heat loss rate for display
    this.heatLossRate =
      tankMass *
      specificHeatCapacity *
      (this.temperature - config.ambientTemperature) *
      coolingRate;

    // Calculate stored energy
    this.storedEnergy =
      tankMass *
      specificHeatCapacity *
      (this.temperature - config.ambientTemperature);

    // Check for NaN in any temperature property
    if (isNaN(this.temperature)) {
      throw new Error(
        `[StorageTank] NaN detected in temperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            topTemperature: this.topTemperature,
            bottomTemperature: this.bottomTemperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.topTemperature)) {
      throw new Error(
        `[StorageTank] NaN detected in topTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            topTemperature: this.topTemperature,
            bottomTemperature: this.bottomTemperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.bottomTemperature)) {
      throw new Error(
        `[StorageTank] NaN detected in bottomTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            topTemperature: this.topTemperature,
            bottomTemperature: this.bottomTemperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.outletTemperature)) {
      throw new Error(
        `[StorageTank] NaN detected in outletTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            topTemperature: this.topTemperature,
            bottomTemperature: this.bottomTemperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
  }

  // Stats Getters //
  // Get temperature from bottom of tank (cold outlet)
  public getBottomTemperature(): TemperatureCelsius {
    return this.bottomTemperature;
  }

  // Get temperature from top of tank (hottest part)
  public getTopTemperature(): TemperatureCelsius {
    return this.topTemperature;
  }

  // Override parent's getOutletTemperature to return bottom temp
  public getOutletTemperature(): TemperatureCelsius {
    return this.bottomTemperature;
  }

  // Get stored energy in kWh for display
  public getStoredEnergyKWh(): number {
    return this.storedEnergy / (3600 * 1000); // J to kWh
  }

  // private calculateSurfaceArea(volume: number): number {
  //   // Simple approximation for cylindrical tank
  //   const radius = Math.pow(volume / (Math.PI * 2), 1 / 3);
  //   const height = 2 * radius;
  //   const surfaceArea = 2 * Math.PI * radius * (radius + height);
  //   return surfaceArea;
  // }
}
