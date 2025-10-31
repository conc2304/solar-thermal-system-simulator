import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeUIProvider } from 'theme-ui';
import { Button } from './Button';
import { DefaultTheme } from '@/theme';

// Helper to render component with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('Button', () => {
  it('renders button with text', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('handles onClick event', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderWithTheme(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid="icon">★</span>;
    renderWithTheme(<Button leftIcon={<Icon />}>With Icon</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const Icon = () => <span data-testid="icon">→</span>;
    renderWithTheme(<Button rightIcon={<Icon />}>Next</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
