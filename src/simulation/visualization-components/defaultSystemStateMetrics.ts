import type { MetricConfig } from '@/components';
import type { SystemState } from '@/simulation/solar-storage-system';

export const DEFAULT_SYSTEM_STATE_METRICS: MetricConfig<SystemState>[] = [
  // Tier 1: Core Performance
  {
    label: 'Tank Temperature',
    getValue: (state) => `${state.tankTemperature.toFixed(1)}°C`,
    getRawValue: (state) => state.tankTemperature,
  },
  {
    label: 'Power Transfer',
    getValue: (state) =>
      `${(state.instantaneousPowerTransfer / 1000).toFixed(2)} kW`,
    getRawValue: (state) => state.instantaneousPowerTransfer / 1000,
  },
  {
    label: 'System Efficiency',
    getValue: (state) => `${state.systemEfficiency.toFixed(1)}%`,
    getRawValue: (state) => state.systemEfficiency,
  },

  // Tier 2: Operational Status
  {
    label: 'Pump Status',
    getValue: (state) => (state.pumpRunning ? 'RUNNING' : 'STOPPED'),
    getRawValue: (state) => (state.pumpRunning ? 1 : 0),
  },
  {
    label: 'Solar Intensity',
    getValue: (state) => `${(state.solarIntensity * 1000).toFixed(0)} W/m²`,
    getRawValue: (state) => state.solarIntensity * 1000,
  },
  {
    label: 'Panel Temperature',
    getValue: (state) => `${state.panelTemperature.toFixed(1)}°C`,
    getRawValue: (state) => state.panelTemperature,
  },

  // Tier 3: Energy Accounting
  {
    label: 'Stored Energy',
    getValue: (state) => `${(state.storedEnergy / 1_000_000).toFixed(2)} MJ`,
    getRawValue: (state) => state.storedEnergy / 1_000_000,
  },
  {
    label: 'Energy Transferred',
    getValue: (state) =>
      `${(state.energyTransferred / 1_000_000).toFixed(2)} MJ`,
    getRawValue: (state) => state.energyTransferred / 1_000_000,
  },

  // Tier 4: System Health
  {
    label: 'Total Heat Loss',
    getValue: (state) => `${state.totalHeatLoss.toFixed(1)} W`,
    getRawValue: (state) => state.totalHeatLoss,
  },
  {
    label: 'Temperature Δ',
    getValue: (state) => `${state.temperatureDifference.toFixed(1)}°C`,
    getRawValue: (state) => state.temperatureDifference,
  },
];
