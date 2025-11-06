import type { MetricConfig } from '@/components';
import type { SystemState } from '@/simulation/solar-storage-system';

export const DEFAULT_SYSTEM_STATE_METRICS: MetricConfig<SystemState>[] = [
  {
    label: 'Solar Intensity',
    getValue: (state) => `${state.solarIntensity.toFixed(0)} W/m²`,
  },
  {
    label: 'Panel Temp',
    getValue: (state) => `${state.panelTemperature.toFixed(1)}°C`,
  },
  {
    label: 'Tank Temp',
    getValue: (state) => `${state.tankTemperature.toFixed(1)}°C`,
  },
  {
    label: 'Flow Rate',
    getValue: (state) => `${(state.flowRate * 1000).toFixed(2)} L/s`,
  },
  {
    label: 'Pump Status',
    getValue: (state) => (state.pumpRunning ? 'RUNNING' : 'STOPPED'),
  },
  {
    label: 'System Efficiency',
    getValue: (state) => `${state.systemEfficiency.toFixed(1)}%`,
  },
  {
    label: 'Energy Captured',
    getValue: (state) => `${(state.energyCaptured / 1000).toFixed(2)} kJ`,
  },
  {
    label: 'Total Heat Loss',
    getValue: (state) => `${state.totalHeatLoss.toFixed(1)} W`,
  },
];
