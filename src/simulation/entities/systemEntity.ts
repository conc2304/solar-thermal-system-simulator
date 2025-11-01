import type { SimulationConfig, TemperatureCelsius, Time } from '../types';

interface SystemEntityConfig {
  id: string;
  initialTemp: TemperatureCelsius;
}

export abstract class SystemEntity {
  id: string;
  temperature: TemperatureCelsius;

  constructor(config: SystemEntityConfig) {
    this.id = config.id;
    this.temperature = config.initialTemp;
  }

  abstract update(deltaTime: Time, config: SimulationConfig): void;
}
