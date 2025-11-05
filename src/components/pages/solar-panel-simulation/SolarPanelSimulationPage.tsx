import { Typography } from '@/components/atoms';
import { SolarThermalVisualization } from '@/simulation/visualization-components';

export const SolarPanelSimulationPage = () => {
  return (
    <div
      sx={{
        bg: 'background',
        padding: [3, 4, 5],
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Typography variant="h1" sx={{ color: 'text', textAlign: 'center' }}>
        Solar Thermal System Simulator
      </Typography>

      <div
        className="SimulationContainer--root"
        sx={{
          flexShrink: 0,
          flexGrow: 1,
        }}
      >
        <SolarThermalVisualization />
      </div>
    </div>
  );
};
