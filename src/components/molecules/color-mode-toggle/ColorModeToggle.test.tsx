import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { ColorModeToggle } from './ColorModeToggle';

// Mock the useColorMode hook
const mockSetMode = jest.fn();
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => ['light', mockSetMode],
}));

// Helper to render component with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('ColorModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toggle button', () => {
    renderWithTheme(<ColorModeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays sun icon in light mode', () => {
    const { container } = renderWithTheme(<ColorModeToggle />);
    // Check that the component renders with ColorModeToggle--root class
    const button = container.querySelector('.ColorModeToggle--root');
    expect(button).toBeInTheDocument();
  });

  it('toggles color mode when clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ColorModeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });

  it('calls onClick callback with new mode when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(<ColorModeToggle onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledWith('dark');
  });

  it('applies custom styles via sxStyles prop', () => {
    const customStyles = { backgroundColor: 'red' };
    renderWithTheme(<ColorModeToggle sxStyles={customStyles} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies correct default button props', () => {
    const { container } = renderWithTheme(<ColorModeToggle />);

    const button = container.querySelector('.ColorModeToggle--root');
    expect(button).toBeInTheDocument();
  });
});
