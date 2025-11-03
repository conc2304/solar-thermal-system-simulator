import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';

import type { Time, SimulationConfig } from '../types';

export interface ThermalPipeConfig {
  length?: number; // m
  diameter?: number; // m
  uValue?: number; // W/(m·K) - insulation quality
  pipeType?: 'inlet' | 'outlet';
}

export class ThermalPipe extends BaseSystemEntity {
  public length: number; // m
  public diameter: number; // m
  public uValue: number; // W/(m·K)
  public pipeType: 'inlet' | 'outlet';
  public heatLoss: number; // W

  constructor(config: ThermalPipeConfig = {}) {
    super({ id: `thermal_pipe-${uuidv4()}`, initialTemp: 20 });

    this.length = config.length ?? 5;
    this.diameter = config.diameter ?? 0.025; // 25mm
    this.uValue = config.uValue ?? 0.5; // Moderate insulation
    this.pipeType = config.pipeType ?? 'inlet';
    this.heatLoss = 0;
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    const { density, specificHeatCapacity } = config.workingFluid;

    if (this.flowRate > 0) {
      // Calculate heat loss along pipe length
      const surfaceArea = Math.PI * this.diameter * this.length;

      // Average temperature in pipe
      const avgTemp = (this.inletTemperature + this.outletTemperature) / 2;

      // Heat loss to ambient
      this.heatLoss =
        this.uValue * surfaceArea * (avgTemp - config.ambientTemperature); // W

      // Temperature drop due to heat loss
      const massFlowRate = this.flowRate * density; // kg/s
      const tempDrop = this.heatLoss / (massFlowRate * specificHeatCapacity);

      // Outlet temperature after heat loss
      this.outletTemperature = Math.max(
        config.ambientTemperature,
        this.inletTemperature - tempDrop
      );

      // Pipe wall temperature is average
      this.temperature = (this.inletTemperature + this.outletTemperature) / 2;
    } else {
      // No flow - pipe gradually cools to ambient
      this.heatLoss = 0;
      const coolingRate = 0.02; // Faster cooling than tank due to less mass

      this.temperature +=
        (config.ambientTemperature - this.temperature) *
        coolingRate *
        deltaTime;
      this.outletTemperature = this.temperature;
    }
  }

  public getHeatLossRate(): number {
    return this.heatLoss;
  }

  // Stats: Getters and Setters //
}
