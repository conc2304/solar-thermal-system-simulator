import type { TemperatureCelsius } from '../types';

export interface WorkingFluid {
  temperature: TemperatureCelsius;
  flowRate: number; // m³/s
  specificHeatCapacity: number; // J/(kg·K)
  density: number; // kg/m³
}

// Fluid properties (without runtime state like temperature and flowRate)
export interface FluidProperties {
  name: string;
  specificHeatCapacity: number; // J/(kg·K)
  density: number; // kg/m³
}

// Preset fluid configurations
export const FLUIDS: Record<string, FluidProperties> = {
  water: {
    name: 'water',
    density: 1000,
    specificHeatCapacity: 4186,
  },
  glycol: {
    name: 'glycol',
    density: 1040,
    specificHeatCapacity: 3300,
  },
} as const;
