import { Typography } from '@/components/atoms';
import type { SimulationStatus } from '@/simulation/types';
import type { ThemeColor } from '@/theme';

import type { ThemeUICSSObject } from 'theme-ui';

interface SimulationRuntimeStateProps {
  status: SimulationStatus;
  runTime: number | string;
  clockTime: string;
  sx?: ThemeUICSSObject;
  timeScale: number;
  setTimeScale: (timeScale: number) => void;
  scaleMin: number;
  scaleMax: number;
}
export const SimulationRuntimeState = ({
  status,
  runTime,
  clockTime,
  timeScale,
  setTimeScale,
  scaleMin,
  scaleMax,
  sx,
}: SimulationRuntimeStateProps) => {
  const statusColorMap: Record<SimulationStatus, ThemeColor> = {
    Running: 'success',
    Paused: 'highlight',
    Stopped: 'error',
  };

  return (
    <div
      sx={{
        width: '100%',
        position: 'relative',
        borderTop: '1px solid',
        borderColor: 'secondary',
        px: 4,
        ...sx,
      }}
    >
      <div
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'background',
          opacity: 0.75,
          zIndex: 0,
        }}
      />
      <div
        sx={{
          width: '100%',
          display: 'flex',
          height: 'auto',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography>
          <span
            sx={{
              display: 'inline-block',
              bg: statusColorMap[status],
              borderRadius: 'pill',
              height: '12px',
              width: '12px',
              mr: 2,
            }}
          />
          <strong>Status: </strong>
          <strong sx={{ color: statusColorMap[status] }}>{status}</strong>
        </Typography>
        <Typography>
          <strong>Run Time MS: </strong>
          {runTime}
        </Typography>
        <Typography>
          <strong>Simulation Time : </strong>
          {clockTime}
        </Typography>

        <div style={{ marginBottom: '10px' }}>
          <label>Speed: {Math.floor(timeScale)}x</label>
          <input
            type="range"
            min={scaleMin}
            max={scaleMax}
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
