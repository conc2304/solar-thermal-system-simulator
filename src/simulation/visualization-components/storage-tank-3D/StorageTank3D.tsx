import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

import type { Energy, TemperatureCelsius } from '@/simulation/types';
import { getColorForTemp } from '@/simulation/utils';

interface StorageTank3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  temperature: TemperatureCelsius;
  topTemp: TemperatureCelsius;
  bottomTemp: TemperatureCelsius;
  storedEnergy: Energy;
  height?: number;
  radius?: number;
}

export const StorageTank3D = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 4,
  radius = 4,
  // temperature,
  topTemp,
  bottomTemp,
}: // storedEnergy,
StorageTank3DProps) => {
  const [showLabels, setShowLabels] = useState(false);
  const topTankRef = useRef<THREE.Mesh>(null);
  const bottomTankRef = useRef<THREE.Mesh>(null);
  const topTempRange = useRef<[min: number, max: number]>([topTemp, topTemp]);
  const bottomTempRange = useRef<[min: number, max: number]>([
    bottomTemp,
    bottomTemp,
  ]);

  topTempRange.current = [
    Math.min(topTemp, topTempRange.current[0]),
    Math.max(topTemp, topTempRange.current[1]),
  ];
  bottomTempRange.current = [
    Math.min(bottomTemp, bottomTempRange.current[0]),
    Math.max(bottomTemp, bottomTempRange.current[1]),
  ];

  // Get solid colors for each tank
  const topColor = useMemo(
    () =>
      getColorForTemp(
        topTemp,
        bottomTempRange.current[0],
        topTempRange.current[1]
      ),
    [topTemp]
  );
  const bottomColor = useMemo(
    () =>
      getColorForTemp(
        bottomTemp,
        bottomTempRange.current[0],
        topTempRange.current[1]
      ),
    [bottomTemp]
  );

  // Each cylinder is half the total height
  const cylinderHeight = height / 2;

  const fontSize = 1;
  const topTextPos = new THREE.Vector3(0, height + 2 * fontSize, 0);
  const bottomTextPos = new THREE.Vector3(0, height + fontSize, 0);

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
      {/* Bottom Tank */}
      <mesh
        ref={bottomTankRef}
        position={[0, cylinderHeight / 2, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <meshStandardMaterial
          color={bottomColor}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Top Tank */}
      <mesh
        ref={topTankRef}
        position={[0, cylinderHeight + cylinderHeight / 2, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <meshStandardMaterial
          color={topColor}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Labels */}
      {showLabels && (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <group>
            <Text position={topTextPos} fontSize={fontSize} color="red">
              {`Top: ${topTemp.toFixed(1)}°C`}
            </Text>

            <Text position={bottomTextPos} fontSize={fontSize} color="cyan">
              {`Bot: ${bottomTemp.toFixed(1)}°C`}
            </Text>
          </group>
        </Billboard>
      )}
    </group>
  );
};
