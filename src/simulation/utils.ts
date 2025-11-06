import * as THREE from 'three';

import type { TemperatureCelsius } from './types';
interface EnergyTransferProps {
  massFlowRate: number;
  specificHeatCapacity: number;
  temperatureDifference: number;
}

export const getEnergyTransferRate = ({
  massFlowRate,
  specificHeatCapacity,
  temperatureDifference,
}: EnergyTransferProps): number => {
  return massFlowRate * specificHeatCapacity * temperatureDifference;
};

export const celsiusToFahrenheit = (celsius: TemperatureCelsius): number => {
  return (celsius * 9) / 5 + 32;
};
export const celsiusToKelvin = (celsius: TemperatureCelsius): number => {
  return celsius + 273.15;
};

export const minutesToHHMMSS = (minutes: number): string => {
  const totalSeconds = Math.floor(minutes * 60);

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [hours, mins, secs]
    .map((unit) => unit.toString().padStart(2, '0'))
    .join(':');
};

/**
 * Formats milliseconds to an appropriate unit (ms, s, min, or hr)
 * @param milliseconds - The time value in milliseconds
 * @returns Formatted string with appropriate unit
 */
export const formatMilliseconds = (milliseconds: number): string => {
  const absMs = Math.abs(milliseconds);

  // Less than 1 second - show milliseconds
  if (absMs < 1000) {
    return `${milliseconds.toFixed(2)} ms`;
  }

  // Less than 1 minute - show seconds
  if (absMs < 60000) {
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)} s`;
  }

  // Less than 1 hour - show minutes
  if (absMs < 3600000) {
    const minutes = milliseconds / 60000;
    return `${minutes.toFixed(2)} min`;
  }

  // 1 hour or more - show hours
  const hours = milliseconds / 3600000;
  return `${hours.toFixed(2)} hr`;
};

export const getColorForTemp = (temp: number): string => {
  const normalized = Math.min(Math.max((temp - 20) / 60, 0), 1);
  const hue = 0.6 - normalized * 0.6; // Blue to red
  const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
  return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
};
