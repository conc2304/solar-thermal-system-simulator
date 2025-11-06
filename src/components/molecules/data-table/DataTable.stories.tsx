import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { DataTable, type MetricConfig } from './DataTable';

import type { Meta, StoryObj } from '@storybook/react';
import type { Decorator } from '@storybook/react';

const ThemeDecorator: Decorator = (Story) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

interface SampleData {
  temperature: number;
  pressure: number;
  status: string;
}

const meta: Meta<typeof DataTable<SampleData>> = {
  title: 'Molecules/DataTable',
  component: DataTable<SampleData>,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
const metrics: MetricConfig<SampleData>[] = [
  {
    label: 'Temperature',
    getValue: (data: SampleData) => `${data.temperature}°C`,
    getRawValue: (data: SampleData) => data.temperature,
  },
  {
    label: 'Pressure',
    getValue: (data: SampleData) => `${data.pressure} kPa`,
    getRawValue: (data: SampleData) => data.pressure,
  },
  {
    label: 'Status',
    getValue: (data: SampleData) => data.status,
    getRawValue: (_data: SampleData) => 0, // Status is not numeric
  },
];

export const Default: Story = {
  args: {
    title: 'System Metrics',
    data: { temperature: 25, pressure: 101.3, status: 'normal' },
    metrics,
    maxStreamSize: 50,
  },
};
