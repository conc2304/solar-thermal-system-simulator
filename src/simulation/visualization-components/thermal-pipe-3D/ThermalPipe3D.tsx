import { useMemo, useRef, useState } from 'react';
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
  isPaused: boolean;
}

export const ThermalPipe3D = ({
  pipeTemp,
  flowRate,
  pathPoints,
  pipeRadius = 0.3,
  isPaused,
}: ThermalPipe3DProps) => {
  const [showLabels, setShowLabels] = useState(false);
  const pipeTempRange = useRef<[min: number, max: number]>([
    pipeTemp,
    pipeTemp,
  ]);
  pipeTempRange.current = [
    Math.min(pipeTemp, pipeTempRange.current[0]),
    Math.max(pipeTemp, pipeTempRange.current[1]),
  ];

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

  // If the current temp is the same as min and max then use fallback range for coloring
  const tempArgs =
    pipeTemp === pipeTempRange.current[0] &&
    pipeTemp === pipeTempRange.current[1]
      ? pipeTempRange.current
      : undefined;

  const pipeColor = useMemo(
    () => getColorForTemp(pipeTemp, ...(tempArgs ?? [])),
    [pipeTemp]
  );

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
          transparent={true}
          opacity={0.35}
          metalness={0.8}
          roughness={1}
          side={THREE.DoubleSide} // Renders both inside and outside otherwise inside is not transparent
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
            isPaused={isPaused}
          />
        </>
      )}
    </group>
  );
};
