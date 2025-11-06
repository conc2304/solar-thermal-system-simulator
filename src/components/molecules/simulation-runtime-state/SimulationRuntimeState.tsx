import { Typography } from '@/components/atoms';
import type { SimulationStatus } from '@/simulation/types';
import { formatMilliseconds } from '@/simulation/utils';
import type { ThemeColor } from '@/theme';

import type { ThemeUICSSObject } from 'theme-ui';

interface SimulationRuntimeStateProps {
  status: SimulationStatus;
  runTime: number;
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
          gap: 2,
        }}
      >
        <div
          sx={{
            minWidth: '150px',
            maxWidth: '150px',
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
        </div>

        <div
          sx={{
            minWidth: '140px',
            maxWidth: '140px',
          }}
        >
          <Typography sx={{ textAlign: 'center' }}>
            <strong>Run Time: </strong>
            <br></br>
            <span sx={{ fontFamily: 'monospace' }}>
              {formatMilliseconds(runTime)}
            </span>
          </Typography>
        </div>

        <div
          sx={{
            minWidth: '180px',
            maxWidth: '180px',
          }}
        >
          <Typography sx={{ textAlign: 'center' }}>
            <strong>Simulation Time: </strong>
            <br></br>
            <span sx={{ fontFamily: 'monospace' }}>{clockTime}</span>
          </Typography>
        </div>

        <div
          sx={{
            minWidth: '150px',
            maxWidth: '150px',
            marginBottom: '10px',
          }}
        >
          <label sx={{ textAlign: 'center' }}>
            <strong>Speed: </strong>
            <span sx={{ fontFamily: 'monospace' }}>
              {Math.floor(timeScale)}x
            </span>
          </label>
          <input
            type="range"
            role="slider"
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
