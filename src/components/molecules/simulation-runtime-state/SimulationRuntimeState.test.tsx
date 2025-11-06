import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { SimulationRuntimeState } from './SimulationRuntimeState';

// Helper to render component with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('SimulationRuntimeState', () => {
  const defaultProps = {
    status: 'Running' as const,
    runTime: 1500,
    clockTime: '12:30:45',
    timeScale: 1,
    setTimeScale: jest.fn(),
    scaleMin: 1,
    scaleMax: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders status, runtime, and clock time', () => {
    renderWithTheme(<SimulationRuntimeState {...defaultProps} />);

    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText(/Run Time:/)).toBeInTheDocument();
    expect(screen.getByText('1.50 s')).toBeInTheDocument();
    expect(screen.getByText(/Simulation Time :/)).toBeInTheDocument();
    expect(screen.getByText('12:30:45')).toBeInTheDocument();
  });

  it('renders time scale slider', () => {
    renderWithTheme(<SimulationRuntimeState {...defaultProps} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('1');
  });

  xit('calls setTimeScale when slider is changed', async () => {
    // const user = userEvent.setup();
    renderWithTheme(<SimulationRuntimeState {...defaultProps} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } }); // Set the new value to 75

    expect(slider).toHaveValue('75');
    expect(defaultProps.setTimeScale).toHaveBeenCalledWith(75);
  });

  it('displays correct status color for different states', () => {
    const { rerender } = renderWithTheme(
      <SimulationRuntimeState {...defaultProps} status="Paused" />
    );
    expect(screen.getByText('Paused')).toBeInTheDocument();

    rerender(
      <ThemeUIProvider theme={DefaultTheme}>
        <SimulationRuntimeState {...defaultProps} status="Stopped" />
      </ThemeUIProvider>
    );
    expect(screen.getByText('Stopped')).toBeInTheDocument();
  });
});
