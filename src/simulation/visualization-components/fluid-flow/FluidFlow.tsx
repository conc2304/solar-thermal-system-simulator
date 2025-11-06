import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import type { TemperatureCelsius } from '@/simulation/types';

interface FluidFlowProps {
  flowRate: number;
  temperature: TemperatureCelsius;
  path: THREE.Curve<THREE.Vector3>;
  speedScale?: number;
  isPaused: boolean;
}

export const FluidFlow = ({
  flowRate,
  temperature,
  path,
  speedScale = 25,
  isPaused,
}: FluidFlowProps) => {
  const particlesRef = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  const particleCount = 15;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    progress: i / particleCount,
  }));

  // Store progress values in a ref so they persist across renders
  const progressRef = useRef<number[]>(
    Array.from({ length: particleCount }, (_, i) => i / particleCount)
  );

  useFrame((_state, delta) => {
    if (flowRate === 0 || isPaused) return;

    // Update particle position along path
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;

      let progress = progressRef.current[i];
      progress += flowRate * delta * speedScale;
      progress %= 1;

      progressRef.current[i] = progress;

      // Place on curve
      const position = path.getPointAt(progress);
      particle.position.copy(position);
    });
  });

  const getFluidColor = (temp: TemperatureCelsius): THREE.Color => {
    const normalized = Math.min(Math.max((temp - 20) / 50, 0), 1);
    return new THREE.Color().setHSL(0.6 - normalized * 0.6, 0.8, 0.6);
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {particles.map((p, i) => (
        <mesh
          key={p.id}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={getFluidColor(temperature)}
            emissive={getFluidColor(temperature)}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};
