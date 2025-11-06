import {
  FLUIDS,
  MillisecondsPerMinute,
  MinutesPerDay,
  MinutesPerHour,
} from '../constants';
import {
  BaseSystemEntity,
  CirculationPump,
  HeatSource,
  SolarPanel,
  StorageTank,
  ThermalPipe,
} from '../entities';

import type {
  Energy,
  FluidProperties,
  SimulationConfig,
  SimulationStatus,
  TemperatureCelsius,
  Time,
} from '../types';

interface TimeState {
  timeOfDayMinutes: number;
  simulationTime: number;
  isPaused: boolean;
}

interface EnvironmentState {
  solarIntensity: number;
  ambientTemperature: TemperatureCelsius;
  solarRadiation: number;
  workingFluid: FluidProperties;
}

interface SolarPanelState {
  panelTemperature: TemperatureCelsius;
  panelOutletTemp: TemperatureCelsius;
  energyTransferred: Energy;
  energyCaptured: Energy;
}

interface StorageTankState {
  tankTemperature: TemperatureCelsius;
  tankTopTemp: TemperatureCelsius;
  tankBottomTemp: TemperatureCelsius;
  storedEnergy: number; // J
  tankHeatLoss: number; // W
}

interface CirculationState {
  pumpRunning: boolean;
  pumpMode: 'auto' | 'manual' | 'off';
  flowRate: number; // m³/s
  temperatureDifference: TemperatureCelsius;
}

interface PipeState {
  inletPipeTemp: TemperatureCelsius;
  outletPipeTemp: TemperatureCelsius;
  inletPipeHeatLoss: number; // W
  outletPipeHeatLoss: number; // W
}

interface SystemEfficiencyState {
  systemEfficiency: number; // %
  totalHeatLoss: number; // W
}

export type SystemState = TimeState &
  EnvironmentState &
  SolarPanelState &
  StorageTankState &
  CirculationState &
  PipeState &
  SystemEfficiencyState;

export interface SystemConfig {
  // Component Properties
  panelArea?: number; // m²
  tankVolume?: number; // m³
  panelEfficiency?: number; // % 0-1

  // Pump Settings
  maxFlowRate?: number; // m³/s
  pumpStartThresholdTemp: TemperatureCelsius;
  pumpStopThresholdTemp: TemperatureCelsius;

  // Initial Conditions
  initialTankTemp?: TemperatureCelsius;
  ambientTemperature?: TemperatureCelsius;

  // Working Fluid Type
  workingFluid?: FluidProperties;
}

export class SolarThermalSystem {
  // System Components
  private heatSource: HeatSource;
  private solarPanel: SolarPanel;
  private storageTank: StorageTank;
  private circulationPump: CirculationPump;
  private inletPipe: ThermalPipe;
  private outletPipe: ThermalPipe;

  // Simulation controls
  private simulationTime: number = 0;
  private isPaused: boolean = false;
  private isRunning: boolean = true;

  private config: SimulationConfig;
  private readonly initialConfig: SystemConfig; // Store initial settings for reset

  private flowSequence: BaseSystemEntity[]; // Order to process components

  private readonly initialTime = 12; // Hour
  constructor(systemConfig: SystemConfig) {
    // Store initial configuration for reset functionality
    this.initialConfig = { ...systemConfig };
    this.config = {
      ambientTemperature: systemConfig.ambientTemperature ?? 20,
      daylight: true,
      workingFluid: systemConfig.workingFluid ?? FLUIDS.water,
      timeOfDayMinutes: this.initialTime * 60,
    };

    // Instantiate System Components //

    this.heatSource = new HeatSource({
      maxIntensity: 1000, // W/m²
    });

    this.solarPanel = new SolarPanel({
      heatSources: [this.heatSource],
      efficiency: systemConfig.panelEfficiency ?? 0.7,
      surfaceArea: systemConfig.panelArea ?? 2,
      thermalMass: 10,
      uValue: 0.5,
    });

    this.storageTank = new StorageTank({
      volume: systemConfig.tankVolume ?? 0.2, // 200L
      uValue: 0.3, // Default insulation value
      maxTemperature: 90,
      initialTemp: systemConfig.initialTankTemp ?? 20,
    });

    this.circulationPump = new CirculationPump({
      maxFlowRate: systemConfig.maxFlowRate ?? 0.0005, // 0.5 L/s
      startThreshold: systemConfig.pumpStartThresholdTemp ?? 8,
      stopThreshold: systemConfig.pumpStopThresholdTemp ?? 3,
      mode: 'auto',
    });

    this.inletPipe = new ThermalPipe({
      pipeType: 'inlet',
      heatLossRate: 0.02, // 2% heat loss
    });

    this.outletPipe = new ThermalPipe({
      pipeType: 'outlet',
      heatLossRate: 0.02, // 2% heat loss
    });

    this.flowSequence = [
      this.inletPipe,
      this.solarPanel,
      this.outletPipe,
      this.storageTank,
      this.circulationPump,
    ];
  }

  // Delta Time in milliseconds
  public update(deltaTime: Time): void {
    if (this.isPaused || !this.isRunning) return;
    this.simulationTime += deltaTime;

    // Update environment variables
    this.config.timeOfDayMinutes =
      (this.config.timeOfDayMinutes + deltaTime / MillisecondsPerMinute) %
      MinutesPerDay;

    this.config.daylight = this.isDaylight();

    // Main Simulation Steps //

    // 1.) Update heat source
    this.heatSource.update(deltaTime, this.config);

    // 2.) Update pump controls
    this.circulationPump.updateControl(
      this.solarPanel.temperature,
      this.storageTank.getBottomTemperature()
    );

    const flowRate = this.circulationPump.getFlowRate();

    // 3.) Circulate Fluid through Sequence
    // Tank → Inlet Pipe → Solar Panel → Outlet Pipe → Tank
    for (let i = 0; i < this.flowSequence.length; i++) {
      const component = this.flowSequence[i];
      const previousComponent =
        this.flowSequence[i === 0 ? this.flowSequence.length - 1 : i - 1];

      component.setInletConditions(
        previousComponent.getOutletTemperature(),
        flowRate
      );
      component.update(deltaTime, this.config);
    }
  }

  private isDaylight(): boolean {
    // Sunlight from 6AM to 6PM
    return (
      this.config.timeOfDayMinutes > 6 * MinutesPerHour &&
      this.config.timeOfDayMinutes < 18 * MinutesPerHour
    );
  }

  // System Controls Methods
  public start(): void {
    this.isRunning = true;
    this.isPaused = false;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.simulationTime = 0;
    this.setTimeOfDay(12);

    // TODO Should stop reset the simulation variables
  }

  public reset(): void {
    // Reset simulation state
    this.simulationTime = 0;
    this.isPaused = false;
    this.isRunning = true;

    // Reset config to initial values
    this.config = {
      ambientTemperature: this.initialConfig.ambientTemperature ?? 20,
      daylight: true,
      workingFluid: this.initialConfig.workingFluid ?? FLUIDS.water,
      timeOfDayMinutes: this.initialTime * 60,
    };

    // Reset storage tank temperatures
    const initialTankTemp = this.initialConfig.initialTankTemp ?? 20;
    this.storageTank.temperature = initialTankTemp;
    this.storageTank['topTemperature'] = initialTankTemp;
    this.storageTank['bottomTemperature'] = initialTankTemp;
    this.storageTank.storedEnergy = 0;
    this.storageTank.heatLossRate = 0;

    // Reset solar panel
    this.solarPanel.temperature = 25;
    this.solarPanel.energyCaptured = 0;
    this.solarPanel.energyTransferred = 0;

    // Reset pump to auto mode
    this.circulationPump.setMode('auto');
    this.circulationPump.stop();

    // Reset pipes
    const ambientTemp = this.config.ambientTemperature;
    this.inletPipe.temperature = ambientTemp;
    this.outletPipe.temperature = ambientTemp;

    // Reset all flow conditions
    this.flowSequence.forEach((component) => {
      component.setInletConditions(ambientTemp, 0);
    });
  }

  public step(deltaTime: Time): void {
    const wasPaused = this.isPaused;
    const wasRunning = this.isRunning;
    this.isPaused = false;
    this.isRunning = true;
    this.update(deltaTime);
    this.isPaused = wasPaused;
    this.isRunning = wasRunning;
  }

  // System Config Methods
  public setAmbientTemperature(temp: number): void {
    this.config.ambientTemperature = temp;
  }

  public setTimeOfDay(hour: number): void {
    this.config.timeOfDayMinutes = hour % 24;
    this.config.daylight = this.isDaylight();
  }

  public setWorkingFluid(fluid: FluidProperties): void {
    this.config.workingFluid = fluid;
  }

  public setPumpMode(mode: 'auto' | 'manual' | 'off'): void {
    this.circulationPump.setMode(mode);
  }

  public startPump(): void {
    this.circulationPump.start();
  }

  public stopPump(): void {
    this.circulationPump.stop();
  }

  public getRunState(): SimulationStatus {
    if (!this.isPaused && this.isRunning) return 'Running';
    else if (this.isPaused && this.isRunning) return 'Paused';
    else return 'Stopped';
  }

  // System State Getter
  // Get complete system state for UI
  public getSystemState(): SystemState {
    const totalHeatLoss =
      this.storageTank.heatLossRate +
      this.inletPipe.getHeatLossRate() +
      this.outletPipe.getHeatLossRate();

    const systemEfficiency =
      this.solarPanel.energyCaptured > 0
        ? (this.solarPanel.energyTransferred / this.solarPanel.energyCaptured) *
          100
        : 0;

    const state = {
      // Time
      simulationTime: this.simulationTime,
      timeOfDayMinutes: this.config.timeOfDayMinutes,
      isPaused: this.isPaused,

      // Environment
      solarIntensity: this.heatSource.getIntensity(),
      solarRadiation: this.heatSource.getSolarRadiation(),
      ambientTemperature: this.config.ambientTemperature,
      workingFluid: this.config.workingFluid,

      // Solar Panel
      panelTemperature: this.solarPanel.temperature,
      panelOutletTemp: this.solarPanel.getOutletTemperature(),
      energyCaptured: this.solarPanel.energyCaptured,
      energyTransferred: this.solarPanel.energyTransferred,

      // Storage Tank
      tankTemperature: this.storageTank.temperature,
      tankTopTemp: this.storageTank.getTopTemperature(),
      tankBottomTemp: this.storageTank.getBottomTemperature(),
      storedEnergy: this.storageTank.storedEnergy,
      tankHeatLoss: this.storageTank.heatLossRate,

      // Circulation
      pumpRunning: this.circulationPump.isRunning,
      pumpMode: this.circulationPump.mode,
      flowRate: this.circulationPump.getFlowRate(),
      temperatureDifference: this.circulationPump.getTemperatureDifference(),

      // Pipes
      inletPipeTemp: this.inletPipe.temperature,
      outletPipeTemp: this.outletPipe.temperature,
      inletPipeHeatLoss: this.inletPipe.getHeatLossRate(),
      outletPipeHeatLoss: this.outletPipe.getHeatLossRate(),

      // System efficiency
      systemEfficiency,
      totalHeatLoss,
    };

    // Validate no NaN values in state
    this.validateSystemState(state);

    return state;
  }

  private validateSystemState(state: SystemState): void {
    const nanFields: string[] = [];

    // Check all numeric fields for NaN
    Object.entries(state).forEach(([key, value]) => {
      if (typeof value === 'number' && isNaN(value)) {
        nanFields.push(key);
      }
    });

    if (nanFields.length > 0) {
      // Gather detailed component state for debugging
      const debugInfo = {
        nanFields,
        componentStates: {
          solarPanel: {
            temperature: this.solarPanel.temperature,
            inletTemp: this.solarPanel['inletTemperature'],
            outletTemp: this.solarPanel.getOutletTemperature(),
          },
          storageTank: {
            temperature: this.storageTank.temperature,
            topTemp: this.storageTank.getTopTemperature(),
            bottomTemp: this.storageTank.getBottomTemperature(),
          },
          circulationPump: {
            temperature: this.circulationPump.temperature,
            inletTemp: this.circulationPump['inletTemperature'],
            outletTemp: this.circulationPump.getOutletTemperature(),
            isRunning: this.circulationPump.isRunning,
            flowRate: this.circulationPump.getFlowRate(),
          },
          inletPipe: {
            temperature: this.inletPipe.temperature,
            inletTemp: this.inletPipe['inletTemperature'],
            outletTemp: this.inletPipe.getOutletTemperature(),
          },
          outletPipe: {
            temperature: this.outletPipe.temperature,
            inletTemp: this.outletPipe['inletTemperature'],
            outletTemp: this.outletPipe.getOutletTemperature(),
          },
        },
      };

      this.stop();
      throw new Error(
        `NaN detected in system state!\n` +
          `Fields with NaN: ${nanFields.join(', ')}\n` +
          `Component Debug Info:\n${JSON.stringify(debugInfo, null, 2)}`
      );
    }
  }
}
