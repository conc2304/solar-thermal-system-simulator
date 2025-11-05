import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { PlaybackControls } from './PlayBackControls';

import type { Meta, StoryObj } from '@storybook/react';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Molecules/PlaybackControls',
  component: PlaybackControls,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlaybackControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = {
  args: {
    isPlaying: false,
    onStop: () => console.log('Stop'),
    onTogglePlay: () => console.log('Toggle Play'),
    onStepForward: () => console.log('Step Forward'),
    onStepBack: () => console.log('Step Back'),
  },
};

export const Playing: Story = {
  args: {
    isPlaying: true,
    onStop: () => console.log('Stop'),
    onTogglePlay: () => console.log('Toggle Play'),
    onStepForward: () => console.log('Step Forward'),
    onStepBack: () => console.log('Step Back'),
  },
};
