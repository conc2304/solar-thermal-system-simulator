import type { Time } from '@/simulation/types';

interface SunPositionParams {
  /** Time of day in minutes (0-1440) */
  timeOfDayMinutes: Time;
  /** Radius of the sun's orbit around earth */
  orbitRadius: number;
  /** Tilt angle in degrees (e.g., 23.5 for Earth's axial tilt) */
  tiltAngleDegrees: number;
}

/**
 * Calculates the sun's position [x, y, z] as it orbits around the earth at [0, 0, 0]
 *
 * @param params - Configuration for sun position calculation
 * @returns Position as [x, y, z] tuple
 */
export const calculateSunPosition = ({
  timeOfDayMinutes,
  orbitRadius,
  tiltAngleDegrees,
}: SunPositionParams): [number, number, number] => {
  // Convert time (0-1440 minutes) to angle (0-2π radians)
  // Apply -90 degree offset so that noon (720) is at the top (+y axis)
  // At time 0 (midnight), sun is at -y axis (bottom)
  // At time 360 (6am), sun rises (+x axis, right side)
  // At time 720 (noon), sun is at +y axis (top, directly overhead)
  // At time 1080 (6pm), sun sets (-x axis, left side)
  const offsetAngle = -Math.PI / 2;
  const timeAngle = (timeOfDayMinutes / 1440) * Math.PI * 2 + offsetAngle;

  // Convert tilt angle to radians
  const tiltAngleRadians = (tiltAngleDegrees * Math.PI) / 180;

  // Calculate position on a circular orbit
  const x = orbitRadius * Math.cos(timeAngle);
  const y = orbitRadius * Math.sin(timeAngle) * Math.cos(tiltAngleRadians);
  const z = orbitRadius * Math.sin(timeAngle) * Math.sin(tiltAngleRadians);

  return [x, y, z];
};
