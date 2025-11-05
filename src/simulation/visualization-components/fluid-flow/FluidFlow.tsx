import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import type { TemperatureCelsius } from '@/simulation/types';

interface FluidFlowProps {
  flowRate: number;
  temperature: TemperatureCelsius;
  path: THREE.Curve<THREE.Vector3>;
  speedScale?: number;
  pipeRadius?: number;
  offsetRadius?: number;
}

export const FluidFlow = ({
  flowRate,
  temperature,
  path,
  speedScale = 50,
  pipeRadius = 0.3,
  offsetRadius = 1.5,
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

  // Helper to calculate offset normal vector perpendicular to the pipe
  const getOffsetPosition = (progress: number): THREE.Vector3 => {
    const centerPosition = path.getPointAt(progress);
    const tangent = path.getTangentAt(progress).normalize();

    // Create a normal vector perpendicular to the tangent
    // Use a reference vector that's not parallel to the tangent
    const up =
      Math.abs(tangent.y) < 0.99
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);

    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Offset the position by the offset radius
    const offsetPosition = centerPosition
      .clone()
      .add(normal.multiplyScalar(pipeRadius * offsetRadius));

    return offsetPosition;
  };

  useFrame((_state, delta) => {
    if (flowRate === 0) return;

    // Update particle position along path
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;

      let progress = progressRef.current[i];
      progress += flowRate * delta * speedScale;
      progress %= 1;

      progressRef.current[i] = progress;

      // Place on curve with offset
      const position = getOffsetPosition(progress);
      particle.position.copy(position);
    });
  });

  const getFluidColor = (temp: TemperatureCelsius): THREE.Color => {
    const normalized = Math.min(Math.max((temp - 20) / 50, 0), 1);
    return new THREE.Color().setHSL(0.6 - normalized * 0.6, 0.8, 0.6);
  };

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={p.id} ref={(el) => (particlesRef.current[i] = el)}>
          <sphereGeometry args={[0.05, 8, 8]} />
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
