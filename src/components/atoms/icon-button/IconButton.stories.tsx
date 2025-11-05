import { Download, Play, Pause, Settings, Trash2, Heart } from 'lucide-react';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { IconButton } from './IconButton';

import type { Meta, StoryObj } from '@storybook/react';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Download size={20} />,
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <IconButton color="primary">
        <Play size={20} />
      </IconButton>
      <IconButton color="secondary">
        <Pause size={20} />
      </IconButton>
      <IconButton color="success">
        <Download size={20} />
      </IconButton>
      <IconButton color="error">
        <Trash2 size={20} />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <IconButton size="sm">
        <Settings size={16} />
      </IconButton>
      <IconButton size="md">
        <Settings size={20} />
      </IconButton>
      <IconButton size="lg">
        <Settings size={24} />
      </IconButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: <Heart size={20} />,
    disabled: true,
  },
};

export const WithCustomStyles: Story = {
  args: {
    children: <Download size={20} />,
    sx: {
      backgroundColor: 'primary',
      color: 'white',
      '&:hover': {
        backgroundColor: 'secondary',
      },
    },
  },
};
