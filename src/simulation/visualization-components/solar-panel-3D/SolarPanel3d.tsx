import { useLoader } from '@react-three/fiber';
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
}: SolarPanel3DProps) => {
  const objPath = './models-3d/Solar_System/Solar_System.fbx';
  const obj = useLoader(FBXLoader, objPath);

  return (
    <>
      <primitive
        position={position}
        rotation={rotation}
        object={obj}
        scale={scale}
      />
    </>
  );
};
