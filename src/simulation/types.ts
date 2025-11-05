export type TemperatureCelsius = number;
export type Energy = number;
export type Time = number;

export type SimulationStatus = 'Running' | 'Paused' | 'Stopped';
export interface SimulationConfig {
  ambientTemperature: TemperatureCelsius;
  daylight: boolean;
  timeOfDayMinutes: number; // 0-1439 Minutes
  workingFluid: FluidProperties;
}

// Fluid types
export interface FluidProperties {
  name: string;
  specificHeatCapacity: number; // J/(kg·K)
  density: number; // kg/m³
}

export interface WorkingFluid {
  temperature: TemperatureCelsius;
  flowRate: number; // m³/s
  specificHeatCapacity: number; // J/(kg·K)
  density: number; // kg/m³
}
