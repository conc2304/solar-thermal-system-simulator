import type { Meta, StoryObj } from '@storybook/react';
import { ThemeUIProvider } from 'theme-ui';
import { Typography } from './Typography';
import { DefaultTheme } from '@/theme';

const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Atoms/Typography',
  component: Typography,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default typography',
  },
};

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'Body text content',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Caption text',
  },
};
