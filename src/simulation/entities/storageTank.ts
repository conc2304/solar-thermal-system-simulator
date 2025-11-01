import { v4 as uuidv4 } from 'uuid';

import { SystemEntity } from './systemEntity';

import type { Energy, SimulationConfig, Time } from '../types';

interface StorageTankConfig {
  volume?: number;
  heatLossCoefficient?: number;
  referenceTemp?: number;
  specificHeatCapacity?: number;
  maxTemperature?: number;
}

export class StorageTank extends SystemEntity {
  volume: number; // m³
  maxTemperature: number; // °C
  storedEnergy: Energy; // J
  heatLossCoefficient: number; // W/(m²·K)
  referenceTemperature: number; // °C
  specificHeatCapacity: number; // J/(kg·°C)

  constructor({
    volume = 0.2,
    heatLossCoefficient = 0.05,
    referenceTemp = 20,
    specificHeatCapacity = 4186,
    maxTemperature = 80,
  }: StorageTankConfig = {}) {
    super({ id: `storage_tank-${uuidv4()}`, initialTemp: 20 });

    this.volume = volume;
    this.heatLossCoefficient = heatLossCoefficient;
    this.referenceTemperature = referenceTemp;
    this.specificHeatCapacity = specificHeatCapacity;
    this.maxTemperature = maxTemperature;
    this.storedEnergy = 0;
  }

  update(_deltaTime: Time, config: SimulationConfig): void {
    // Calculate heat loss
    const heatLossCoefficient = 0.05; // How quickly the tank loses heat to surroundings
    const ambientCooldown =
      heatLossCoefficient * (this.temperature - config.ambientTemperature);
    this.temperature -= ambientCooldown;
    this.storedEnergy = this.calculateStoredEnergy();
  }

  calculateStoredEnergy(): Energy {
    const mass = this.volume * 1000; // m³ to kg conversion

    return (
      mass *
      this.specificHeatCapacity *
      (this.temperature - this.referenceTemperature)
    );
  }
}
