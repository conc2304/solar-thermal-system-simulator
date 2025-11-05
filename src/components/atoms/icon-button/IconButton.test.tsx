import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { IconButton } from './IconButton';

// Helper to render component with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('IconButton', () => {
  it('renders button with icon', () => {
    const Icon = () => <span data-testid="test-icon">★</span>;
    renderWithTheme(
      <IconButton>
        <Icon />
      </IconButton>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles onClick event', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    const Icon = () => <span>★</span>;

    renderWithTheme(
      <IconButton onClick={handleClick} aria-label="icon button">
        <Icon />
      </IconButton>
    );
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    const Icon = () => <span>★</span>;
    renderWithTheme(
      <IconButton disabled aria-label="disabled button">
        <Icon />
      </IconButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const Icon = () => <span>★</span>;
    renderWithTheme(
      <IconButton ref={ref}>
        <Icon />
      </IconButton>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies correct default props', () => {
    const Icon = () => <span data-testid="icon">★</span>;
    const { container } = renderWithTheme(
      <IconButton>
        <Icon />
      </IconButton>
    );

    // Check that the IconButton--root class is applied
    const button = container.querySelector('.IconButton--root');
    expect(button).toBeInTheDocument();
  });

  it('accepts custom color prop', () => {
    const Icon = () => <span>★</span>;
    renderWithTheme(
      <IconButton color="secondary" aria-label="colored button">
        <Icon />
      </IconButton>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('accepts custom size prop', () => {
    const Icon = () => <span>★</span>;
    renderWithTheme(
      <IconButton size="lg" aria-label="large button">
        <Icon />
      </IconButton>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('accepts custom sx prop for styling', () => {
    const Icon = () => <span>★</span>;
    const customSx = { backgroundColor: 'red' };
    renderWithTheme(
      <IconButton sx={customSx} aria-label="styled button">
        <Icon />
      </IconButton>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
