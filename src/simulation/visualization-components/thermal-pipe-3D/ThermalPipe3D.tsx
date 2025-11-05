import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

import type { TemperatureCelsius } from '@/simulation/types';
import { getColorForTemp } from '@/simulation/utils';

import { FluidFlow } from '../fluid-flow/FluidFlow';

interface ThermalPipe3DProps {
  pipeTemp: TemperatureCelsius;
  flowRate: number;
  pathPoints: THREE.Vector3Tuple[];
  pipeRadius?: number;
}

export const ThermalPipe3D = ({
  pipeTemp,
  flowRate,
  pathPoints,
  pipeRadius = 0.3,
}: ThermalPipe3DProps) => {
  const [showLabels, setShowLabels] = useState(false);

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

  const pipeColor = useMemo(() => getColorForTemp(pipeTemp), [pipeTemp]);

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
    <group>
      {/* Pipe Geometry */}
      <mesh
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={pipeColor}
          metalness={0.8}
          roughness={0.2}
        />
        <tubeGeometry
          args={[pipePath, pipeSegments, pipeRadius, radialSegments, closed]}
        />
      </mesh>

      {/* Labels */}
      {showLabels && (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <group>
            <Text position={[0, 3, 0]} fontSize={0.8} color="red">
              {`Temp: ${pipeTemp.toFixed(1)}°C`}
            </Text>

            <Text position={[0, 4, 0]} fontSize={0.8} color="cyan">
              {`Flow Rate: ${flowRate} L/s`}
            </Text>
          </group>
        </Billboard>
      )}

      {/* Flow Visualization */}
      {flowRate > 0 && (
        <>
          <FluidFlow
            path={pipePath}
            flowRate={flowRate}
            temperature={pipeTemp}
          />
        </>
      )}
    </group>
  );
};
