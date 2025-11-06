import type { Time } from '@/simulation/types';

import { calculateSunPosition } from './calculateSunPosition';

interface Sun3DProps {
  solarIntensity: number;
  solarRadiation: number;
  timeOfDayMinutes: Time;
  orbitRadius?: number;
  tiltAngleDegrees?: number;
}
export const Sun3D = ({
  solarIntensity,
  // solarRadiation,
  timeOfDayMinutes,
  orbitRadius = 10,
  tiltAngleDegrees = 23.5,
}: Sun3DProps) => {
  const position = calculateSunPosition({
    timeOfDayMinutes,
    orbitRadius,
    tiltAngleDegrees,
  });

  return (
    <>
      <group>
        {/* Point light at sun's center - disperses light in all directions */}
        <pointLight
          position={position}
          intensity={solarIntensity * 100}
          distance={orbitRadius * 3}
          decay={2}
          castShadow
        />

        {/* Directional light for additional realistic sun lighting */}
        <directionalLight
          position={position}
          intensity={solarIntensity * 10}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          lookAt={[0, 0, 0]}
        />

        {/* Sun sphere with emissive glow */}
        <mesh position={position} rotation={[0, 0, 0]}>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial
            color={'#FDB813'}
            emissive={'#FDB813'}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
};
