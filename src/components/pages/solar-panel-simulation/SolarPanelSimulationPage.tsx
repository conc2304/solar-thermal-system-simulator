import { Typography } from '@/components/atoms';
import { SolarThermalDashboard } from '@/simulation/visualization-components';

export const SolarPanelSimulationPage = () => {
  return (
    <div
      className="SolarPanelSimulationPage--root"
      sx={{
        bg: 'background',
        padding: [3, 4, 5],
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h1" sx={{ color: 'text', textAlign: 'center' }}>
        Solar Thermal System Simulator
      </Typography>

      <div
        className="SimulationContainer--root"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <SolarThermalDashboard />
      </div>
    </div>
  );
};
