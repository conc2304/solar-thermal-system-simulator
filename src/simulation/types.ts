import type { FluidProperties } from './entities';

export type TemperatureCelsius = number;
export type Energy = number;
export type Time = number;

export interface SimulationConfig {
  ambientTemperature: TemperatureCelsius;
  daylight: boolean;
  timeOfDayMinutes: number; // 0-1439 Minutes
  workingFluid: FluidProperties;
}
