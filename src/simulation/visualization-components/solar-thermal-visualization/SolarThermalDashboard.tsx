import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { MenuIcon } from 'lucide-react';

import {
  ControlPanel,
  PlaybackControls,
  SimulationRuntimeState,
  DataTable,
  Button,
} from '@/components';
import {
  SolarThermalSystem,
  type SystemState,
} from '@/simulation/solar-storage-system';
import { minutesToHHMMSS } from '@/simulation/utils';

import { DEFAULT_SYSTEM_STATE_METRICS } from '../defaultSystemStateMetrics';
import { Scene } from '../scene';

export const SolarThermalDashboard = () => {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Hamburger Menu Button - Mobile Only */}
      <Button
        variant="text"
        color="secondary"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 100,
          '@media (min-width: 768px)': {
            display: 'none',
          },
        }}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </Button>

      <div
        sx={{
          display: 'flex',
          gap: 3,
          height: '100%',
          flexDirection: ['column', 'column', 'row'], // Stack on mobile, row on desktop
        }}
      >
        {/* Canvas Wrapper */}
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: ['100%', '100%', '60%'], // Full width on mobile, 60% on desktop
            height: ['60vh', '60vh', '100%'], // Fixed height on mobile
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
            width: ['100%', '100%', '40%'], // Full width on mobile, 40% on desktop
            height: ['auto', 'auto', '100%'],
            maxHeight: ['100vh', '100vh', '100%'], // Limit height on mobile
            overflowY: 'auto',
            // Mobile: slide-in panel
            position: ['fixed', 'fixed', 'relative'],
            top: [0, 0, 'auto'],
            right: [0, 0, 'auto'],
            bottom: [0, 0, 'auto'],
            zIndex: [999, 999, 'auto'],
            transform: [
              isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
              isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
              'translateX(0)',
            ],
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: 'background',
          }}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'transparent',
              color: 'text',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              display: ['block', 'block', 'none'],
              padding: 1,
              lineHeight: 1,
            }}
            aria-label="Close menu"
          >
            ×
          </button>

          <ControlPanel system={systemRef.current} systemState={systemState} />

          <DataTable
            data={systemState}
            metrics={DEFAULT_SYSTEM_STATE_METRICS}
          />
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: ['block', 'block', 'none'],
          }}
        />
      )}
    </div>
  );
};
