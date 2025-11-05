import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { ColorModeToggle } from './ColorModeToggle';

import type { Meta, StoryObj } from '@storybook/react';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Molecules/ColorModeToggle',
  component: ColorModeToggle,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCallback: Story = {
  args: {
    onClick: (mode) => {
      console.log('Color mode changed to:', mode);
    },
  },
};

export const WithCustomStyles: Story = {
  args: {
    sxStyles: {
      backgroundColor: 'primary',
      color: 'white',
      '&:hover': {
        backgroundColor: 'secondary',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <p style={{ margin: 0 }}>Click to toggle theme:</p>
      <ColorModeToggle />
    </div>
  ),
};
