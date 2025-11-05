import { useState } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useLoader, type ThreeEvent } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

import type { Energy, TemperatureCelsius } from '@/simulation/types';

interface SolarPanel3DProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  temperature: TemperatureCelsius;
  outletTemp: TemperatureCelsius;
  energyCaptured: Energy;
}
export const SolarPanel3D = ({
  position,
  rotation,
  scale = 0.5,
  temperature,
  outletTemp,
  energyCaptured,
}: SolarPanel3DProps) => {
  // Load Model
  const objPath = './models-3d/Solar_System/Solar_System.fbx';
  const obj = useLoader(FBXLoader, objPath);

  const [showLabels, setShowLabels] = useState(false);

  // Handle pointer over
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setShowLabels(true);
    document.body.style.cursor = 'pointer';
  };

  // Handle pointer out
  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setShowLabels(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={position} rotation={rotation}>
      <primitive
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        object={obj}
        scale={scale}
      />
      temperature outletTemp energyCaptured
      {showLabels && (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <group>
            <Text position={[0, 8.5, 0]} fontSize={1} color="red">
              {`Temp: ${temperature.toFixed(1)}°C`}
            </Text>

            <Text position={[0, 7.25, 0]} fontSize={1} color="cyan">
              {`Energy Captured: ${energyCaptured.toFixed(1)}°C`}
            </Text>

            <Text position={[0, 6, 0]} fontSize={1} color="cyan">
              {`Outlet Temp: ${outletTemp.toFixed(1)}°C`}
            </Text>
          </group>
        </Billboard>
      )}
    </group>
  );
};
