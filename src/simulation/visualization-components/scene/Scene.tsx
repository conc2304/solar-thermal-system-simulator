import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import type {
  SolarThermalSystem,
  SystemState,
} from '@/simulation/solar-storage-system';

import { CirculationPump3d } from '../circulation-pump-3D';
import { SolarPanel3D } from '../solar-panel-3D';
import { StorageTank3D } from '../storage-tank-3D';
import { Sun3D } from '../sun-3D';
import { ThermalPipe3D } from '../thermal-pipe-3D';
import { generatePipePaths } from '../utils/pipePathGenerator';

interface SceneProps {
  system: SolarThermalSystem;
  timeScale?: number;
  setSystemState: (systemState: SystemState) => void;
  systemState: SystemState;
}

export const Scene = ({
  system,
  systemState,
  setSystemState,
  timeScale = 1,
}: SceneProps) => {
  // Main animation/update loop
  useFrame((_state, delta) => {
    // Convert to MS
    const deltaMS = delta * 1000 * timeScale;

    system.update(deltaMS);
    setSystemState(system.getSystemState());
  });

  // Mesh Positions
  const solarPanelPosition: THREE.Vector3Tuple = [0, 0, -8];
  const tankPosition: THREE.Vector3Tuple = [0, 3, 8];
  const tankHeight = 6;
  const tankRadius = 3;
  const pipeRadius = 0.3;

  // Generate pipe paths based on component positions
  const { outletPath, inletPath } = useMemo(() => {
    return generatePipePaths({
      solarPanelPosition,
      tankPosition,
      tankHeight,
      tankRadius,
      pipeRadius,
      horizontalOffset: 4,
    });
  }, []);

  // Get middle of outlet pipe
  const circulationPumpPosition = new THREE.Vector3(
    ...outletPath[Math.ceil(outletPath.length / 2) - 1]
  );
  circulationPumpPosition.setComponent(1, -0.2); // Manually align pump to pip

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 25]} />
        <meshStandardMaterial color="#b4e2c2" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Solar Thermal System Components  */}

      <SolarPanel3D
        position={solarPanelPosition}
        rotation={[0, 0, 0]}
        temperature={systemState.panelTemperature}
        outletTemp={systemState.panelOutletTemp}
        energyCaptured={systemState.energyCaptured}
      />

      <Sun3D
        solarIntensity={systemState.solarIntensity}
        solarRadiation={systemState.solarRadiation}
        timeOfDayMinutes={systemState.timeOfDayMinutes}
        orbitRadius={13}
      />

      <StorageTank3D
        height={tankHeight}
        radius={tankRadius}
        position={tankPosition}
        rotation={[0, 0, 0]}
        temperature={systemState.tankTemperature}
        topTemp={systemState.tankTopTemp}
        bottomTemp={systemState.tankBottomTemp}
        storedEnergy={systemState.storedEnergy}
      />

      {/* Pipes to and from Storage Tank and Solar Panel*/}
      {/* Outlet - Hot water from panel to top of tank */}
      <ThermalPipe3D
        pipeTemp={systemState.outletPipeTemp}
        pipeRadius={0.3}
        pathPoints={outletPath}
        flowRate={systemState.flowRate}
      />
      {/* Inlet - Cold water from tank bottom to panel */}
      <ThermalPipe3D
        pipeTemp={systemState.inletPipeTemp}
        pipeRadius={pipeRadius}
        pathPoints={inletPath}
        flowRate={systemState.flowRate}
      />

      {/* Circulation Pump */}
      <CirculationPump3d
        position={circulationPumpPosition}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.5}
        isRunning={systemState.pumpRunning}
        mode={systemState.pumpMode}
      />
    </>
  );
};
