import type { Meta, StoryObj } from '@storybook/react';
import Users from './users';

const meta = {
  title: 'Components/Users',
  component: Users,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Users>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
