import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vector3 } from '@react-three/fiber';

import type { TemperatureCelsius } from '@/simulation/types';

interface ThermalPipe3DProps {
  pipeTemp: TemperatureCelsius;
  flowRate: number;
  pathPoints: [x: number, y: number, z: number][];
  pipeRadius?: number;
}

export const ThermalPipe3D = ({
  pipeTemp,
  flowRate,
  pathPoints,
  pipeRadius = 0.3,
}: ThermalPipe3DProps) => {
  const pipeSegments = 32;
  const radialSegments = 8;
  const closed = false;

  const pipePath = useMemo(() => {
    const closed = false;
    const vectorPath: THREE.Vector3[] = pathPoints.map(
      (point) => new THREE.Vector3(...point)
    );
    const curve = new THREE.CatmullRomCurve3(vectorPath, closed);

    return curve;
  }, [pathPoints]);

  return (
    <group>
      {/* Pipe Geometry */}
      <mesh castShadow receiveShadow>
        {/* TODO - update to use temp color */}
        <meshStandardMaterial color="#7F8C8D" metalness={0.8} roughness={0.2} />
        <tubeGeometry
          args={[pipePath, pipeSegments, pipeRadius, radialSegments, closed]}
        />
      </mesh>

      {/* Flow Visualization */}
      {/* {flowRate > 0 && (
        <>
          <FluidFlow
            path={pipePath}
            flowRate={flowRate}
            temperature={pipeTemp}
          />
        </>
      )} */}
    </group>
  );
};
