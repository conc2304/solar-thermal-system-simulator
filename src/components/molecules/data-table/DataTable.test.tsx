import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeUIProvider } from 'theme-ui';

import { DefaultTheme } from '@/theme';

import { DataTable } from './DataTable';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeUIProvider theme={DefaultTheme}>{ui}</ThemeUIProvider>);
};

describe('DataTable', () => {
  it('renders title', () => {
    renderWithTheme(
      <DataTable
        title="Test Metrics"
        data={{ value: 42 }}
        metrics={[
          {
            label: 'Value',
            getValue: (data) => String(data.value),
            getRawValue: (data) => data.value,
          },
        ]}
        maxStreamSize={50}
      />
    );
    expect(screen.getByText('Test Metrics')).toBeInTheDocument();
  });

  it('renders metric rows', () => {
    renderWithTheme(
      <DataTable
        data={{ temp: 25, pressure: 100 }}
        metrics={[
          {
            label: 'Temperature',
            getValue: (data) => `${data.temp}°C`,
            getRawValue: (data) => data.temp,
          },
          {
            label: 'Pressure',
            getValue: (data) => `${data.pressure} kPa`,
            getRawValue: (data) => data.pressure,
          },
        ]}
        maxStreamSize={50}
      />
    );
    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('Pressure:')).toBeInTheDocument();
    expect(screen.getByText('100 kPa')).toBeInTheDocument();
  });
});
