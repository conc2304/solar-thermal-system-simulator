import { useState, useEffect, useRef } from 'react';
import { ChartAreaIcon, EyeOffIcon } from 'lucide-react';

import { IconButton, Typography } from '@/components/atoms';
import { LineChartTrend, type DataPoint } from '@/components/molecules';

interface MetricRowProps {
  label: string;
  value: string;
  valueColor?: 'success' | 'error';
  showChart?: boolean;
  chartData?: DataPoint[];
  maxStreamSize?: number;
}

const MetricRow = ({
  label,
  value,
  valueColor,
  showChart = false,
  chartData = [],
  maxStreamSize = 50,
}: MetricRowProps) => {
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
            textAlign: 'right',
            pr: 6,
          }}
        >
          {value}
        </Typography>
      </td>
      <td
        sx={{
          width: '140px',
          height: '30px',
          padding: 0,
          margin: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {showChart && (
          <div
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {chartData.length > 0 && (
              <LineChartTrend
                data={chartData}
                timeWindow={maxStreamSize}
                width={150}
                height={30}
                margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
              />
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export interface MetricConfig<T = object> {
  label: string;
  getValue: (data: T) => string;
  getColor?: (data: T) => 'success' | 'error' | undefined;
  getRawValue: (data: T) => number;
}

export interface SystemMetricsProps<T = object> {
  title?: string;
  data: T;
  metrics: MetricConfig<T>[];
  maxStreamSize: number;
}

export const DataTable = <T,>({
  title = 'System Metrics',
  data,
  metrics,
  maxStreamSize = 50,
}: SystemMetricsProps<T>) => {
  const [chartData, setChartData] = useState<Map<string, DataPoint[]>>(
    new Map()
  );
  const timestampRef = useRef(0);

  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (!showCharts) return;

    const timestamp = timestampRef.current++;
    const newChartData = new Map(chartData);

    metrics.forEach((metric) => {
      const rawValue = metric.getRawValue(data);
      const existingData = newChartData.get(metric.label) || [];
      const newDataPoint: DataPoint = { timestamp, value: rawValue };

      // Keep only last 100 points for performance
      const updatedData = [...existingData, newDataPoint].slice(-100);
      newChartData.set(metric.label, updatedData);
    });

    setChartData(newChartData);
  }, [data, metrics, showCharts]);

  return (
    <div sx={{ position: 'relative' }}>
      <div sx={{ position: 'absolute', top: 0, right: 20 }}>
        <IconButton onClick={() => setShowCharts(!showCharts)} color="primary">
          {showCharts ? <EyeOffIcon /> : <ChartAreaIcon />}
        </IconButton>
      </div>

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
              showChart={showCharts}
              maxStreamSize={maxStreamSize}
              chartData={chartData.get(metric.label)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
