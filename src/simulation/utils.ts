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

export const getColorForTemp = (temp: number): string => {
  const normalized = Math.min(Math.max((temp - 20) / 60, 0), 1);
  const hue = 0.6 - normalized * 0.6; // Blue to red
  const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
  return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
};
