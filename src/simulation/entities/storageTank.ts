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
  private surfaceArea: number;
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
    this.surfaceArea = this.calculateSurfaceArea(this.volume);

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

    if (this.flowRate > 0) {
      // Transferring Energy
      const massFlowRate = this.flowRate * density; // kg/s

      // Fluid Mixing - how new water affects tank temps
      const mixingRate = (massFlowRate * deltaTime) / tankMass;
      const mixingFactor = Math.min(1, mixingRate);

      // Simulate hot fluid entering and mixing and simplified stratification
      const topMixingWeight = 0.5;
      const bottomMixingWeight = 1 - topMixingWeight;
      this.topTemperature =
        this.topTemperature * (1 - mixingFactor * topMixingWeight) +
        this.inletTemperature * mixingFactor * bottomMixingWeight;

      const stratificationFactor = 0.1 * deltaTime;
      const avgTemp = (this.temperature - this.bottomTemperature) / 2;
      this.bottomTemperature +=
        (avgTemp - this.bottomTemperature) * stratificationFactor;
    } else {
      // Stagnation Condition -> no flow

      this.outletTemperature = this.bottomTemperature;

      // Simplified stratification
      const mixingFactor = 0.01 * deltaTime;
      const middleTemp = (this.topTemperature + this.bottomTemperature) / 2;
      this.topTemperature += (middleTemp - this.topTemperature) * mixingFactor;
      this.bottomTemperature +=
        (middleTemp - this.bottomTemperature) * mixingFactor;

      // Clamp Internal Temps
      this.topTemperature = Math.min(this.topTemperature, this.maxTemperature);
      this.bottomTemperature = Math.max(
        this.bottomTemperature,
        config.ambientTemperature
      );

      // Simplified average tank temperature
      this.temperature = (this.topTemperature + this.bottomTemperature) / 2;

      // Temp of fluid exiting from storage take to inlet/return pipe to panel
      this.outletTemperature = this.bottomTemperature;
    }

    // Apply ambient heat loss;
    const heatLoss = this.calculateHeatLoss(deltaTime, {
      temperature: this.temperature,
      surfaceArea: this.surfaceArea,
      uValue: this.uValue,
      ambientTemp: config.ambientTemperature,
    });
    const tempDecrease = heatLoss / (tankMass * specificHeatCapacity);

    // Simplified Tank Heat Loss (cap at ambient temp)
    this.topTemperature = Math.max(
      this.topTemperature - tempDecrease,
      config.ambientTemperature
    );
    this.bottomTemperature = Math.max(
      this.bottomTemperature - tempDecrease,
      config.ambientTemperature
    );
    this.temperature = Math.max(
      this.temperature - tempDecrease,
      config.ambientTemperature
    );

    // Set energy stored relative to ambient temp
    this.storedEnergy =
      tankMass *
      specificHeatCapacity *
      (this.temperature - config.ambientTemperature);
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

  private calculateHeatLoss(
    deltaTime: Time,
    config: {
      temperature: TemperatureCelsius;
      surfaceArea: number;
      uValue: number;
      ambientTemp: TemperatureCelsius;
    }
  ): Energy {
    this.heatLossRate = this.calculateHeatLossRate(config);
    const heatLoss = this.heatLossRate * deltaTime; // J
    return heatLoss;
  }

  private calculateHeatLossRate({
    temperature,
    surfaceArea,
    uValue,
    ambientTemp,
  }: {
    temperature: TemperatureCelsius;
    surfaceArea: number;
    uValue: number;
    ambientTemp: TemperatureCelsius;
  }): number {
    const heatLossRate = uValue * surfaceArea * (temperature - ambientTemp);
    return heatLossRate;
  }

  private calculateSurfaceArea(volume: number): number {
    // Assuming a circular tank
    const radius = Math.pow(volume / (Math.PI * 2), 1 / 3);
    const height = 2 * radius;
    const surfaceArea = 2 * Math.PI * radius * (radius + height);
    return surfaceArea;
  }
}
