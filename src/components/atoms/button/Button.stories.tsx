import type { Meta, StoryObj } from '@storybook/react';
import { ThemeUIProvider } from 'theme-ui';
import { Button } from './Button';
import { DefaultTheme } from '@/theme';
import { Heart, Download, ArrowRight, Plus } from 'lucide-react';

// Wrapper to provide theme context
const ThemeDecorator = (Story: () => React.ReactNode) => (
  <ThemeUIProvider theme={DefaultTheme}>
    <Story />
  </ThemeUIProvider>
);

const meta = {
  title: 'Atoms/Button',
  component: Button,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, colors, and sizes. Supports icons and custom styling through Theme UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'The visual style variant of the button',
      table: {
        defaultValue: { summary: 'contained' },
      },
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'accent',
        'text',
        'background',
        'muted',
      ],
      description: 'The color theme of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// Variant stories
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// Color stories
export const Primary: Story = {
  args: {
    color: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    children: 'Secondary',
  },
};

export const Accent: Story = {
  args: {
    color: 'accent',
    children: 'Accent',
  },
};

// Size stories
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// Icon stories
export const WithLeftIcon: Story = {
  args: {
    children: 'Download',
    leftIcon: <Download size={16} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    rightIcon: <ArrowRight size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Favorite',
    leftIcon: <Heart size={16} />,
    rightIcon: <Plus size={16} />,
  },
};

export const IconOnly: Story = {
  args: {
    children: <Heart size={20} />,
    'aria-label': 'Like',
  },
};

// State stories
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const DisabledOutlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Disabled Outlined',
    disabled: true,
  },
};

export const DisabledText: Story = {
  args: {
    variant: 'text',
    children: 'Disabled Text',
    disabled: true,
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    children: 'Click Me',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

// Combined variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary">
          Contained Primary
        </Button>
        <Button variant="contained" color="secondary">
          Contained Secondary
        </Button>
        <Button variant="contained" color="accent">
          Contained Accent
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outlined" color="primary">
          Outlined Primary
        </Button>
        <Button variant="outlined" color="secondary">
          Outlined Secondary
        </Button>
        <Button variant="outlined" color="accent">
          Outlined Accent
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="text" color="primary">
          Text Primary
        </Button>
        <Button variant="text" color="secondary">
          Text Secondary
        </Button>
        <Button variant="text" color="accent">
          Text Accent
        </Button>
      </div>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Common use cases
export const CallToAction: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'lg',
    children: 'Get Started',
    rightIcon: <ArrowRight size={20} />,
  },
};

export const DownloadButton: Story = {
  args: {
    variant: 'contained',
    color: 'accent',
    children: 'Download Report',
    leftIcon: <Download size={16} />,
  },
};

export const SubmitForm: Story = {
  args: {
    type: 'submit',
    variant: 'contained',
    color: 'primary',
    children: 'Submit',
  },
};

export const CancelButton: Story = {
  args: {
    variant: 'outlined',
    color: 'secondary',
    children: 'Cancel',
  },
};

// Custom styling example
export const CustomStyled: Story = {
  args: {
    children: 'Custom Styled',
    sx: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: '8px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      padding: '12px 24px',
      '&:hover': {
        boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
      },
    },
  },
};

// Real-world example
export const ButtonGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="contained" color="primary">
        Save
      </Button>
      <Button variant="outlined" color="secondary">
        Cancel
      </Button>
      <Button variant="text" color="muted">
        Reset
      </Button>
    </div>
  ),
};

// Loading state example (custom implementation)
export const LoadingState: Story = {
  render: () => (
    <Button disabled>
      <span
        style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid #ffffff',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '8px',
        }}
      />
      Loading...
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Button>
  ),
};
