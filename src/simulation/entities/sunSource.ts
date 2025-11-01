import perlin from 'perlin-noise';
import { v4 as uuidv4 } from 'uuid';

import { SystemEntity } from './systemEntity';

import type { Energy, SimulationConfig, Time } from '../types';

interface HeatSourceConfig {
  intensity?: number;
}

export class HeatSource extends SystemEntity {
  intensity: number; // Percent  0-1 representing solar radiation
  private dailyIntensityNoise: number[]; // Dimensionless array (0-1)
  private currentMinute: number; // Minutes (0-1439)

  constructor(config: HeatSourceConfig = {}) {
    super({ id: `heat-${uuidv4()}`, initialTemp: 5500 });
    this.intensity = config.intensity ?? 0.5;
    this.currentMinute = 0;

    // Generate solar intensity noise for 24 * 60 minutes (full day by minute)
    this.dailyIntensityNoise = perlin.generatePerlinNoise(24 * 60, 1, {
      octaveCount: 3, // Smooth daily variation
      amplitude: 0.6, // Moderate amplitude for realistic changes
      persistence: 0.1, // Gradual transitions
    });
  }

  update(deltaTime: Time, config: SimulationConfig): void {
    this.currentMinute = Math.floor(deltaTime % (24 * 60));

    if (config.daylight) {
      // Map noise to a more realistic solar intensity curve
      const noiseValue = this.dailyIntensityNoise[this.currentMinute];

      // Adjust the noise to create a more natural solar intensity curve
      const adjustedIntensity = this.applyDaytimeCurve(noiseValue);

      this.intensity = Math.max(0, Math.min(1, adjustedIntensity));
    } else {
      this.intensity = 0;
    }
  }

  // Create a more natural solar intensity curve
  private applyDaytimeCurve(noiseValue: number): number {
    const minuteNormalized = this.currentMinute / (24 * 60);
    const sineCurve = Math.sin(Math.PI * (minuteNormalized - 0.25)) * 0.5 + 0.5;

    // Blend Perlin Noise with daytime temperature curve
    return sineCurve * 0.7 + noiseValue * 0.3;
  }

  generateHeat(): Energy {
    return this.intensity * 1000; // Watts
  }
}
