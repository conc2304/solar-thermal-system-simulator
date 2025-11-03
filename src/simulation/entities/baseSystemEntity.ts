import type { SimulationConfig, TemperatureCelsius, Time } from '../types';

interface SystemEntityConfig {
  id: string;
  initialTemp: TemperatureCelsius;
}

export abstract class BaseSystemEntity {
  public id: string;
  public temperature: TemperatureCelsius;

  // Flow properties
  protected inletTemperature: TemperatureCelsius;
  protected outletTemperature: TemperatureCelsius;
  protected flowRate: number; // m³/s

  constructor({ id, initialTemp }: SystemEntityConfig) {
    this.id = id;
    this.temperature = initialTemp;
    this.inletTemperature = initialTemp;
    this.outletTemperature = initialTemp;
    this.flowRate = 0;
  }

  public setInletConditions(
    temperature: TemperatureCelsius,
    flowRate: number
  ): void {
    this.inletTemperature = temperature;
    this.flowRate = flowRate;
  }

  public getOutletTemperature(): TemperatureCelsius {
    return this.outletTemperature;
  }

  abstract update(deltaTime: Time, config: SimulationConfig): void;
}
