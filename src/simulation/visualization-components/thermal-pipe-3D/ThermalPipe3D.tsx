import type { Vector3 } from '@react-three/fiber';

import type { TemperatureCelsius } from '@/simulation/types';

interface ThermalPipe3DProps {
  pipeTemp: TemperatureCelsius;
  flowRate: number;
  path: Vector3[];
}

export const ThermalPipe3D = ({}: ThermalPipe3DProps) => {};
