import { Button, Typography } from '@/components/atoms';
import { FLUIDS } from '@/simulation/constants';
import {
  SolarThermalSystem,
  type SystemState,
} from '@/simulation/solar-storage-system';

interface ControlPanelProps {
  system: SolarThermalSystem;
  systemState: SystemState;
}

export const ControlPanel = ({ system, systemState }: ControlPanelProps) => {
  return (
    <div
      style={{
        padding: 8,
      }}
    >
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Simulation Controls
      </Typography>

      {/* Ambient Temperature */}
      <div style={{ marginBottom: '10px' }}>
        <label>Ambient Temp: {systemState.ambientTemperature}°C</label>
        <input
          type="range"
          min="-10"
          max="40"
          value={systemState.ambientTemperature}
          onChange={(e) => system.setAmbientTemperature(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Working Fluid */}
      <div style={{ marginBottom: '10px' }}>
        <label>Working Fluid:</label>
        <select
          value={systemState.workingFluid.name}
          onChange={(e) => system.setWorkingFluid(FLUIDS[e.target.value])}
          style={{ width: '100%', padding: '5px' }}
        >
          {Object.keys(FLUIDS).map((fluidKey) => (
            <option key={fluidKey} value={fluidKey}>
              {FLUIDS[fluidKey].name.charAt(0).toUpperCase() +
                FLUIDS[fluidKey].name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Pump Mode */}
      <div style={{ marginBottom: '10px' }}>
        <label>Pump Mode:</label>
        <select
          value={systemState.pumpMode}
          onChange={(e) =>
            system.setPumpMode(e.target.value as 'auto' | 'manual' | 'off')
          }
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
          <option value="off">Off</option>
        </select>
      </div>

      {systemState.pumpMode === 'manual' && (
        <div
          style={{
            marginBottom: '10px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Button
            variant="outlined"
            color={systemState.pumpRunning ? 'error' : 'primary'}
            onClick={() => {
              if (systemState.pumpRunning) {
                system.stopPump();
              } else {
                system.startPump();
              }
            }}
          >
            {systemState.pumpRunning ? 'Stop' : 'Start'} Pump
          </Button>
        </div>
      )}

      {/* Reset Button */}
      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <Button
          onClick={() => system.reset()}
          variant="contained"
          color="error"
          sx={{ width: '100%' }}
        >
          Reset Simulation
        </Button>
      </div>
    </div>
  );
};
