import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { Typography } from '@/components';
import {
  PlaybackControls,
  SimulationRuntimeState,
  DataTable,
} from '@/components/molecules';
import {
  SolarThermalSystem,
  type SystemState,
} from '@/simulation/solar-storage-system';
import { minutesToHHMMSS } from '@/simulation/utils';

import { DEFAULT_SYSTEM_STATE_METRICS } from '../defaultSystemStateMetrics';
import { Scene } from '../scene';

export const SolarThermalVisualization = () => {
  const systemRef = useRef(
    new SolarThermalSystem({
      panelArea: 2,
      tankVolume: 0.2,
      pipeLength: 3,
      pumpStartThresholdTemp: 8,
      pumpStopThresholdTemp: 3,
      initialTankTemp: 20,
    })
  );

  const [systemState, setSystemState] = useState<SystemState>(
    systemRef.current.getSystemState()
  );

  const [timeScale, setTimeScale] = useState<number>(1000);
  const timeScaleMin = 1;
  const timeScaleMax = 10000;

  return (
    <div
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div sx={{ display: 'flex', gap: 3, height: '100%' }}>
        {/* Canvas Wrapper */}
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <div
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              border: '2px solid',
              borderRadius: 8,
              borderColor: 'secondary',
              overflow: 'hidden',
            }}
          >
            <Canvas
              camera={{
                position: [5, 15, 25],
                fov: 60,
                isPerspectiveCamera: true,
              }}
              sx={{
                height: '100%',
              }}
            >
              <Scene
                system={systemRef.current}
                systemState={systemState}
                setSystemState={setSystemState}
                timeScale={timeScale}
              />
              <OrbitControls target={[0, 0, 0]} />
            </Canvas>
            <div
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
              }}
            >
              <SimulationRuntimeState
                status={systemRef.current.getRunState()}
                runTime={systemState.simulationTime.toFixed(3)}
                clockTime={minutesToHHMMSS(systemState.timeOfDayMinutes)}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                }}
                timeScale={timeScale}
                setTimeScale={setTimeScale}
                scaleMin={timeScaleMin}
                scaleMax={timeScaleMax}
              />
            </div>
          </div>
          <PlaybackControls
            isPlaying={!systemState.isPaused}
            onTogglePlay={() => {
              if (systemState.isPaused) {
                systemRef.current.start();
              } else {
                systemRef.current.pause();
              }
            }}
            onStop={() => systemRef.current.stop()}
            onStepBack={() => systemRef.current.step(-1)}
            onStepForward={() => systemRef.current.step(1)}
          />
        </div>

        {/* Control Panel Section */}
        <div
          sx={{
            border: '2px solid',
            borderColor: 'primary',
            borderRadius: 8,
            width: '40%',
            height: '100%',
          }}
        >
          <Typography variant="h3" color="text" sx={{ textAlign: 'center' }}>
            Simulation Controls
          </Typography>

          <DataTable
            data={systemState}
            metrics={DEFAULT_SYSTEM_STATE_METRICS}
          />
        </div>
      </div>
    </div>
  );
};
