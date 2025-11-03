import { ThermalPipe, type ThermalPipeConfig } from './thermalPipe';

import type { SimulationConfig, TemperatureCelsius, Time } from '../types';
import type { SolarPanel } from './solarPanel';
import type { StorageTank } from './storageTank';

interface InletPipeConfig extends ThermalPipeConfig {
  sourceTank: StorageTank;
  destinationPanel: SolarPanel;
}

export class InletPipe extends ThermalPipe {
  // References to connected components
  private sourceTank: StorageTank;
  private destinationPanel: SolarPanel;

  constructor(config: InletPipeConfig) {
    const { sourceTank, destinationPanel, ...thermalPipeConfig } = config;
    super({ ...thermalPipeConfig });

    this.sourceTank = sourceTank;
    this.destinationPanel = destinationPanel;
  }

  public update(_deltaTime: Time, config: SimulationConfig): void {
    this.temperature = this.calculateReturnTemperature(
      this.sourceTank.temperature,
      config.ambientTemperature
    );
  }

  private calculateReturnTemperature(
    sourceTemp: TemperatureCelsius,
    ambientTemperature: TemperatureCelsius
  ): TemperatureCelsius {
    // Simulate heat loss during return
    const heatLossRate = 0.01;
    return sourceTemp - (sourceTemp - ambientTemperature) * heatLossRate;
  }
}
