import type { TemperatureCelsius } from './types';

export function celsiusToFahrenheit(celsius: TemperatureCelsius): number {
  return (celsius * 9) / 5 + 32;
}
export function celsiusToKelvin(celsius: TemperatureCelsius): number {
  return celsius + 273.15;
}
