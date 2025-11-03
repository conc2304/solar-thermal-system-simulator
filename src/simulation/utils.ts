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
