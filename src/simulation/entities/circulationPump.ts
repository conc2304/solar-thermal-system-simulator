import { v4 as uuidv4 } from 'uuid';

import { BaseSystemEntity } from './baseSystemEntity';

import type { SimulationConfig, TemperatureCelsius, Time } from '../types';

export type PumpMode = 'auto' | 'manual' | 'off';
interface CirculationPumpConfig {
  maxFlowRate?: number; // m³/s
  startThreshold?: number; // °C difference to start
  stopThreshold?: number; // °C difference to stop
  mode?: PumpMode;
}

export class CirculationPump extends BaseSystemEntity {
  public maxFlowRate: number; // m³/second
  public mode: PumpMode;
  public isRunning: boolean;

  public flowRate: number; // m³/second

  // Control Thresholds
  private startThreshold: number; // °C
  private stopThreshold: number; // °C

  // Temperature inputs for control logic
  private panelTemperature: TemperatureCelsius;
  private tankTemperature: TemperatureCelsius;

  constructor(config: CirculationPumpConfig = {}) {
    super({ id: `circulation_pump-${uuidv4()}`, initialTemp: 20 });
    this.maxFlowRate = config.maxFlowRate ?? 0.0005; // 0.5 L/s
    this.startThreshold = config.startThreshold ?? 8; // Start when panel is 8°C warmer
    this.stopThreshold = config.stopThreshold ?? 3; // Stop when difference < 3°C
    this.mode = config.mode ?? 'auto';

    this.isRunning = false;
    this.flowRate = 0;
    this.panelTemperature = 20;
    this.tankTemperature = 20;
  }

  public update(deltaTime: Time, config: SimulationConfig): void {
    if (this.isRunning && this.flowRate > 0) {
      // Pump running: fluid flows through, minimal temperature change
      this.temperature = this.inletTemperature;
      this.outletTemperature = this.inletTemperature;
    } else {
      // Pump off: no flow, gradually cool to ambient
      const coolingRate = 0.05;
      this.temperature =
        this.temperature +
        (config.ambientTemperature - this.temperature) * coolingRate * deltaTime;
      this.outletTemperature = this.temperature;
    }

    // Ensure temperatures stay within reasonable bounds
    const maxTemp = 120; // Max reasonable temperature for a pump
    const absoluteMin = -273;
    this.temperature = Math.max(Math.min(this.temperature, maxTemp), absoluteMin);
    this.outletTemperature = Math.max(Math.min(this.outletTemperature, maxTemp), absoluteMin);

    // Check for NaN in any temperature property
    if (isNaN(this.temperature)) {
      throw new Error(
        `[CirculationPump] NaN detected in temperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            isRunning: this.isRunning,
            mode: this.mode,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
    if (isNaN(this.outletTemperature)) {
      throw new Error(
        `[CirculationPump] NaN detected in outletTemperature!\n` +
          `Stack: ${new Error().stack}\n` +
          `State: ${JSON.stringify({
            temperature: this.temperature,
            inletTemperature: this.inletTemperature,
            outletTemperature: this.outletTemperature,
            flowRate: this.flowRate,
            isRunning: this.isRunning,
            mode: this.mode,
            ambientTemp: config.ambientTemperature,
          })}`
      );
    }
  }

  public updateControl(
    panelTemp: TemperatureCelsius,
    tankTemp: TemperatureCelsius
  ): void {
    this.panelTemperature = panelTemp;
    this.tankTemperature = tankTemp;

    const tempDifference = panelTemp - tankTemp;

    // Handle pump shutoff mode logic
    switch (this.mode) {
      case 'auto':
        // Turn pump on/off based on temp thresholds
        if (!this.isRunning && tempDifference > this.startThreshold) {
          this.isRunning = true;
        } else if (this.isRunning && tempDifference < this.stopThreshold) {
          this.isRunning = false;
        }
        break;

      case 'manual':
        // Do nothing
        break;

      case 'off':
        this.isRunning = false;
        break;

      default:
        break;
    }

    // Update flow rate based on pump state
    if (this.isRunning) {
      this.flowRate = this.maxFlowRate;
    } else {
      this.flowRate = 0;
    }
  }

  // State Getters & Setters //

  // Get current flow rate
  public getFlowRate(): number {
    return this.flowRate;
  }

  // Manual control methods
  public start(): void {
    if (this.mode === 'manual') {
      this.isRunning = true;
    }
  }

  public stop(): void {
    if (this.mode === 'manual') {
      this.isRunning = false;
    }
  }

  public setMode(mode: 'auto' | 'manual' | 'off'): void {
    this.mode = mode;
    if (mode === 'off') {
      this.isRunning = false;
    }
  }

  // Get temperature difference for display
  public getTemperatureDifference(): number {
    return this.panelTemperature - this.tankTemperature;
  }

  // Check if pump should be running (for UI indicators)
  public shouldBeRunning(): boolean {
    const tempDiff = this.panelTemperature - this.tankTemperature;
    return this.mode === 'auto' && tempDiff > this.startThreshold;
  }
}
