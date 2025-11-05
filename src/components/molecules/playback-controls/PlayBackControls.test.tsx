import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { PlaybackControls } from './PlayBackControls';

// Helper to render component with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('PlaybackControls', () => {
  const defaultProps = {
    isPlaying: false,
    onStop: jest.fn(),
    onTogglePlay: jest.fn(),
    onStepForward: jest.fn(),
    onStepBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all control buttons', () => {
    renderWithTheme(<PlaybackControls {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('calls onTogglePlay when play/pause button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PlaybackControls {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]); // Play/Pause button

    expect(defaultProps.onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PlaybackControls {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]); // Stop button

    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('disables step buttons when playing', () => {
    renderWithTheme(<PlaybackControls {...defaultProps} isPlaying={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled(); // Step back
    expect(buttons[3]).toBeDisabled(); // Step forward
  });
});
