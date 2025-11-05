import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { DataTable } from './DataTable';

import type { Meta, StoryObj } from '@storybook/react';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SampleData {
  temperature: number;
  pressure: number;
  status: string;
}

export const Default: Story = {
  args: {
    title: 'System Metrics',
    data: { temperature: 25, pressure: 101.3, status: 'normal' },
    metrics: [
      { label: 'Temperature', getValue: (data: SampleData) => `${data.temperature}°C` },
      { label: 'Pressure', getValue: (data: SampleData) => `${data.pressure} kPa` },
      { label: 'Status', getValue: (data: SampleData) => data.status },
    ],
  },
};
