import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { SimulationRuntimeState } from './SimulationRuntimeState';

import type { Meta, StoryObj } from '@storybook/react';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Molecules/SimulationRuntimeState',
  component: SimulationRuntimeState,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SimulationRuntimeState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    status: 'Running',
    runTime: 1500, // 1.5 seconds
    clockTime: '12:30:45',
    timeScale: 1,
    setTimeScale: (scale) => console.log('Set time scale:', scale),
    scaleMin: 1,
    scaleMax: 10,
  },
};

export const Paused: Story = {
  args: {
    status: 'Paused',
    runTime: 125000, // 2.08 minutes
    clockTime: '14:15:30',
    timeScale: 5,
    setTimeScale: (scale) => console.log('Set time scale:', scale),
    scaleMin: 1,
    scaleMax: 10,
  },
};

export const Stopped: Story = {
  args: {
    status: 'Stopped',
    runTime: 0,
    clockTime: '00:00:00',
    timeScale: 1,
    setTimeScale: (scale) => console.log('Set time scale:', scale),
    scaleMin: 1,
    scaleMax: 10,
  },
};

export const LongRunning: Story = {
  args: {
    status: 'Running',
    runTime: 68855181.8, // 19.13 hours (the example from the user)
    clockTime: '18:45:22',
    timeScale: 1000,
    setTimeScale: (scale) => console.log('Set time scale:', scale),
    scaleMin: 1,
    scaleMax: 10000,
  },
};
