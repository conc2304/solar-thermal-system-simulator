import { v4 as uuidv4 } from 'uuid';

import { SystemEntity } from './systemEntity';

import type { Time, SimulationConfig } from '../types';

interface ThermalPipeConfig {
  length?: number;
  diameter?: number;
  heatLossRate?: number;
}

export class ThermalPipe extends SystemEntity {
  length: number; // meters (m)
  diameter: number; // meters (m)
  heatLossRate: number; // W/(m·K)

  constructor(config: ThermalPipeConfig = {}) {
    super({ id: `thermal_pipe-${uuidv4()}`, initialTemp: 20 });
    this.length = config.length ?? 5;
    this.diameter = config.diameter ?? 0.05;
    this.heatLossRate = config.heatLossRate ?? 0.1;
  }

  update(_deltaTime: Time, config: SimulationConfig): void {
    // Calculate heat loss
    const surfaceArea = Math.PI * this.diameter * this.length;
    const heatLoss =
      this.heatLossRate *
      surfaceArea *
      (this.temperature - config.ambientTemperature);

    // Reduce temperature based on heat loss
    this.temperature -= heatLoss / (this.length * 500);
  }
}
