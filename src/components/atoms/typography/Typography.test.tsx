import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeUIProvider } from 'theme-ui';
import { Typography } from './Typography';
import { DefaultTheme } from '@/theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('Typography', () => {
  it('renders text content', () => {
    renderWithTheme(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders with variant prop', () => {
    renderWithTheme(<Typography variant="h1">Heading</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('forwards ref to element', () => {
    const ref = React.createRef<HTMLElement>();
    renderWithTheme(<Typography ref={ref}>Text</Typography>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
