import perlin from 'perlin-noise';
import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';
import { MinutesPerDay } from '../constants';

import type { Energy, SimulationConfig, Time } from '../types';

interface HeatSourceConfig {
  maxIntensity?: number;
}

export class HeatSource extends BaseSystemEntity {
  public intensity: number; // Percent  0-1 representing solar radiation
  private maxIntensity: number; // Maximum solar radiation W/m²
  private baseIntensity: number;
  private dailyIntensityNoise: number[]; // Dimensionless array (0-1)
  // private currentMinute: number; // Minutes (0-1439)

  constructor({ maxIntensity = 1000 }: HeatSourceConfig = {}) {
    super({ id: `heat_source-${uuidv4()}`, initialTemp: 5500 });

    this.intensity = 0;
    this.maxIntensity = maxIntensity;
    this.baseIntensity = 0;

    // Generate solar intensity noise for 24 * 60 minutes (full day by minute)
    this.dailyIntensityNoise = perlin.generatePerlinNoise(MinutesPerDay, 1, {
      octaveCount: 3, // Smooth daily variation
      amplitude: 0.6, // Moderate amplitude for realistic changes
      persistence: 0.1, // Gradual transitions
    });
  }

  update(_deltaTime: Time, config: SimulationConfig): void {
    const minuteOfDay = config.timeOfDayMinutes;

    if (config.daylight) {
      // Map noise to a more realistic solar intensity curve
      const noiseValue = this.dailyIntensityNoise[Math.floor(minuteOfDay)];

      // Adjust the noise to create a more natural solar intensity curve
      const noiseWeight = 0.0;
      const adjustedIntensity = this.applyDaytimeCurve(
        noiseValue,
        minuteOfDay,
        noiseWeight
      );

      // Cap intensity percent
      this.intensity = Math.max(0, Math.min(1, adjustedIntensity));
    } else {
      this.baseIntensity = 0;
      this.intensity = 0;
    }
  }

  // Create a more natural solar intensity curve
  private applyDaytimeCurve(
    noiseValue: number,
    minuteOfDay: number,
    noiseWeight: number = 0.3
  ): number {
    const minuteNormalized = minuteOfDay / MinutesPerDay;
    const amplitudeScale = 0.5;
    const verticalShift = 0.5;
    const timeShiftPercent = 0;

    const sineCurve =
      Math.sin(Math.PI * (minuteNormalized + timeShiftPercent)) *
        amplitudeScale +
      verticalShift; // 0-1
    this.baseIntensity = sineCurve;

    // Blend Perlin Noise with daytime temperature curve
    const naturalWeight = 1 - noiseWeight;
    return this.baseIntensity * naturalWeight + noiseValue * noiseWeight;
  }

  public getSolarRadiation(): Energy {
    return this.intensity * this.maxIntensity; // Watts
  }

  public getIntensity(): number {
    return this.intensity;
  }
}
