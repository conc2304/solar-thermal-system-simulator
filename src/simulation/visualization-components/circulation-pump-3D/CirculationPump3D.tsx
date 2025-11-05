import type { Vector3 } from 'three';
import { useLoader, type ThreeEvent } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

import type { Vector3Array } from '@/simulation/types';

interface CirculationPump3dProps {
  position: Vector3Array | Vector3;
  rotation: Vector3Array;
  scale?: number;
}
export const CirculationPump3d = ({
  position,
  rotation,
  scale = 1,
}: CirculationPump3dProps) => {
  // const texturePath = './models-3d/circulation-pump/Bronze valve_textures.fbx';
  const objPath = './models-3d/circulation-pump/Bronze valve.fbx';
  const obj = useLoader(FBXLoader, objPath);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        object={obj}
        scale={scale}
      />
    </group>
  );
};
