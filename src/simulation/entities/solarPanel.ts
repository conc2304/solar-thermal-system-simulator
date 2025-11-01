import { v4 as uuidv4 } from 'uuid';

import { SystemEntity } from './systemEntity';

import type { Energy, SimulationConfig, Time } from '../types';
import type { HeatSource } from './sunSource';

interface SolarPanelConfig {
  heatSources: HeatSource[];
  efficiency?: number;
  surfaceArea?: number;
}

export class SolarPanel extends SystemEntity {
  private sunSources: HeatSource[]; // Allow for multiple heat sources
  public efficiency: number; // Percentage as decimal (0-1)
  public surfaceArea: number; // m²,
  public heatCaptured: Energy; // Watts (W)

  constructor(config: SolarPanelConfig) {
    super({ id: `solar_panel-${uuidv4()}`, initialTemp: 25 });
    this.sunSources = config.heatSources;
    this.efficiency = config.efficiency ?? 0.2;
    this.surfaceArea = config.surfaceArea ?? 2;
    this.heatCaptured = 0;
  }

  public update(_deltaTime: Time, _config: SimulationConfig): void {
    const heatCumulative = this.sunSources.reduce((prevVal, currSource) => {
      return prevVal + currSource.generateHeat();
    }, 0);

    // Heat Captured Calculation
    this.heatCaptured = heatCumulative * this.efficiency * this.surfaceArea;
    this.temperature += this.heatCaptured / (this.surfaceArea * 500);
  }
}
