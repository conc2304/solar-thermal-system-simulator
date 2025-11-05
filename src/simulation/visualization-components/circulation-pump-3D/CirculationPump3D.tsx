import { useState } from 'react';
import type { Vector3, Vector3Tuple } from 'three';
import { Billboard, Text } from '@react-three/drei';
import { useLoader, type ThreeEvent } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

interface CirculationPump3dProps {
  position: Vector3Tuple | Vector3;
  rotation: Vector3Tuple;
  isRunning?: boolean;
  mode?: string;
  scale?: number;
}
export const CirculationPump3d = ({
  position,
  rotation,
  scale = 1,
  mode,
  isRunning,
}: CirculationPump3dProps) => {
  const objPath = './models-3d/circulation-pump/Bronze valve.fbx';
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
    <group
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        object={obj}
        scale={scale}
        metalness={0.8}
        roughness={0.2}
      />

      {/* Labels */}
      {showLabels && (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <group>
            {isRunning !== undefined && (
              <Text
                position={[0, 3, 0]}
                fontSize={0.8}
                color={isRunning ? 'green' : 'red'}
              >
                {`Status: ${isRunning ? 'ON' : 'OFF'}`}
              </Text>
            )}

            {mode && (
              <Text position={[0, 4, 0]} fontSize={0.8} color="cyan">
                {`Mode: ${mode?.toUpperCase()}`}
              </Text>
            )}
          </group>
        </Billboard>
      )}
    </group>
  );
};
