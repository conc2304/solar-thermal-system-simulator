import { useFrame } from '@react-three/fiber';

import type {
  SolarThermalSystem,
  SystemState,
} from '@/simulation/solar-storage-system';

import { SolarPanel3D } from '../solar-panel-3D';
import { StorageTank3D } from '../storage-tank-3D';
import { Sun3D } from '../sun-3D';

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
        position={[0, 0, -8]}
        rotation={[0, 0, 0]}
        temperature={systemState.panelTemperature}
        outletTemp={systemState.panelOutletTemp}
        energyCaptured={systemState.energyCaptured}
      />

      <Sun3D
        solarIntensity={systemState.solarIntensity}
        solarRadiation={systemState.solarRadiation}
        timeOfDayMinutes={systemState.timeOfDayMinutes}
        orbitRadius={12}
      />

      <StorageTank3D
        height={6}
        radius={3}
        position={[0, 3, 8]}
        rotation={[0, 0, 0]}
        temperature={systemState.tankTemperature}
        topTemp={systemState.tankTopTemp}
        bottomTemp={systemState.tankBottomTemp}
        storedEnergy={systemState.storedEnergy}
      />
    </>
  );
};
