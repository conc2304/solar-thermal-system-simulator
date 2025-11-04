import type { FluidProperties } from './types';

// Time
export const SecondsPerMinute = 60;
export const MinutesPerHour = 60;
export const MillisecondsPerMinute = 1000 * SecondsPerMinute;
export const HoursPerDay = 24;
export const MinutesPerDay = HoursPerDay * MinutesPerHour;

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
