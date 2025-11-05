import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

import type { Energy, TemperatureCelsius } from '@/simulation/types';

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
  temperature,
  topTemp,
  bottomTemp,
  storedEnergy,
}: StorageTank3DProps) => {
  const [showLabels, setShowLabels] = useState(false);
  const tankRef = useRef<THREE.Mesh>(null);

  // Simulate temperature stratification
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx?.createLinearGradient(0, 0, 0, 256);

    const topColor = getColorForTemp(topTemp);
    const bottomColor = getColorForTemp(bottomTemp);

    gradient?.addColorStop(0, topColor);
    gradient?.addColorStop(1, bottomColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }, [topTemp, bottomTemp]);

  const fontSize = 1;
  const topTextPos = new THREE.Vector3(0, height + fontSize * 1.2, 0);
  const bottomTextPos = new THREE.Vector3(0, height, 0);

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
      {/* Tank Body */}
      <mesh
        ref={tankRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial
          map={gradientTexture}
          metalness={0.6}
          roughness={0.3}
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

function getColorForTemp(temp: number) {
  const normalized = Math.min(Math.max((temp - 20) / 60, 0), 1);
  const hue = 0.6 - normalized * 0.6; // Blue to red
  const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
  return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
}
