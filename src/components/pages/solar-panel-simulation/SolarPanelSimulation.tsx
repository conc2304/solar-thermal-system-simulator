import { Button } from '@/components/atoms';

export const SolarPanelSimulation = () => {
  return (
    <div
      sx={{
        bg: 'background',
      }}
    >
      <h1 sx={{ color: 'text' }}>Solar Panel Simulations</h1>

      <Button>Click</Button>
      <Button variant="outlined" color="primary">
        Click
      </Button>
      <Button variant="contained" color="secondary" size="lg">
        Click
      </Button>
    </div>
  );
};
