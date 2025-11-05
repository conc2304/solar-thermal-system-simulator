import { Typography } from '@/components/atoms';
import type { SystemState } from '@/simulation/solar-storage-system';

interface SystemMetricsProps {
  systemState: SystemState;
}

interface MetricRowProps {
  label: string;
  value: string;
  valueColor?: 'success' | 'error';
}

const MetricRow = ({ label, value, valueColor }: MetricRowProps) => {
  return (
    <tr>
      <td>
        <Typography variant="body" sx={{ m: 1 }}>
          {label}:
        </Typography>
      </td>
      <td>
        <Typography
          sx={{
            color: valueColor || undefined,
            m: 1,
          }}
        >
          {value}
        </Typography>
      </td>
    </tr>
  );
};

interface MetricConfig {
  label: string;
  getValue: (state: SystemState) => string;
  getColor?: (state: SystemState) => 'success' | 'error' | undefined;
}

const METRICS_CONFIG: MetricConfig[] = [
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
    getColor: (state) => (state.pumpRunning ? 'success' : 'error'),
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

export const SystemMetrics = ({ systemState }: SystemMetricsProps) => {
  return (
    <div>
      <Typography variant="h3" sx={{ width: '100%', textAlign: 'center' }}>
        System Metrics
      </Typography>
      <table sx={{ width: '100%' }}>
        <tbody>
          {METRICS_CONFIG.map((metric) => (
            <MetricRow
              key={metric.label}
              label={metric.label}
              value={metric.getValue(systemState)}
              valueColor={metric.getColor?.(systemState)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
