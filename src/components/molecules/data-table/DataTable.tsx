import { Typography } from '@/components/atoms';

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

export interface MetricConfig<T = unknown> {
  label: string;
  getValue: (data: T) => string;
  getColor?: (data: T) => 'success' | 'error' | undefined;
}

export interface SystemMetricsProps<T = unknown> {
  title?: string;
  data: T;
  metrics: MetricConfig<T>[];
}

export const DataTable = <T,>({
  title = 'System Metrics',
  data,
  metrics,
}: SystemMetricsProps<T>) => {
  return (
    <div>
      <Typography variant="h3" sx={{ width: '100%', textAlign: 'center' }}>
        {title}
      </Typography>
      <table sx={{ width: '100%' }}>
        <tbody>
          {metrics.map((metric) => (
            <MetricRow
              key={metric.label}
              label={metric.label}
              value={metric.getValue(data)}
              valueColor={metric.getColor?.(data)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
