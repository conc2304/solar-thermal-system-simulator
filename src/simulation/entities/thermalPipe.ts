import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';

import type { Time, SimulationConfig } from '../types';

export interface ThermalPipeConfig {
  pipeType?: 'inlet' | 'outlet';
  heatLossRate?: number; // Simple percentage heat loss per second (0-1)
}

export class ThermalPipe extends BaseSystemEntity {
  public pipeType: 'inlet' | 'outlet';
  public heatLoss: number; // W
  private heatLossRate: number; // Simple percentage

  constructor(config: ThermalPipeConfig = {}) {
    super({ id: `thermal_pipe-${uuidv4()}`, initialTemp: 20 });
    this.pipeType = config.pipeType ?? 'inlet';
    this.heatLossRate = config.heatLossRate ?? 0.02; // 2% heat loss by default
    this.heatLoss = 0;
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    if (this.flowRate > 0) {
      // Simple temperature drop based on heat loss rate
      const tempDrop =
        (this.inletTemperature - config.ambientTemperature) *
        this.heatLossRate *
        deltaTime;

      this.outletTemperature = Math.max(
        config.ambientTemperature,
        this.inletTemperature - tempDrop
      );

      this.temperature = (this.inletTemperature + this.outletTemperature) / 2;
      this.heatLoss = tempDrop; // Simplified heat loss tracking
    } else {
      // No flow - pipe gradually cools to ambient
      this.heatLoss = 0;
      const coolingRate = 0.00005;

      this.temperature =
        this.temperature +
        (config.ambientTemperature - this.temperature) *
          coolingRate *
          deltaTime;

      const maxTemp = 120; // Max reasonable temperature
      const absoluteMin = config.ambientTemperature;
      this.temperature = Math.max(
        Math.min(this.temperature, maxTemp),
        absoluteMin
      );
      this.outletTemperature = this.temperature;
    }

    // Ensure temperatures stay within reasonable bounds
    const maxTemp = 200; // Max reasonable temperature for a pipe
    const absoluteMin = config.ambientTemperature;
    this.temperature = Math.max(
      Math.min(this.temperature, maxTemp),
      absoluteMin
    );
    this.outletTemperature = Math.max(
      Math.min(this.outletTemperature, maxTemp),
      absoluteMin
    );

    // Check for NaN in any temperature property
    if (isNaN(this.temperature)) {
      throw new Error(
        `[ThermalPipe-${this.pipeType}] NaN detected in temperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            heatLoss: this.heatLoss,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.outletTemperature)) {
      throw new Error(
        `[ThermalPipe-${this.pipeType}] NaN detected in outletTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            heatLoss: this.heatLoss,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
  }

  public getHeatLossRate(): number {
    return this.heatLoss;
  }

  // Stats: Getters and Setters //
}
