import { v4 as uuidv4 } from 'uuid';

import { SystemEntity } from './systemEntity';

import type { Energy, SimulationConfig, Time } from '../types';

interface CirculationPumpConfig {
  flowRate?: number; // m³/s
  energyConsumption?: Energy; // Watts
}

export class CirculationPump extends SystemEntity {
  public flowRate: number; // m³/second
  public energyConsumption: Energy; // Watts

  constructor(config: CirculationPumpConfig = {}) {
    super({ id: `circulation_pump-${uuidv4()}`, initialTemp: 20 });
    this.flowRate = config.flowRate ?? 0.001;
    this.energyConsumption = config.energyConsumption ?? 50;
  }

  public update(_deltaTime: Time, _config: SimulationConfig): void {}

  public calculatePowerUsage(): Energy {
    return this.energyConsumption * this.flowRate;
  }
}
