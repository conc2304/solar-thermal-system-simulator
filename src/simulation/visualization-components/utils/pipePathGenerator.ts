import type { Vector3Tuple } from 'three';

export interface PipePathConfig {
  solarPanelPosition: Vector3Tuple;
  tankPosition: Vector3Tuple;
  tankHeight: number;
  tankRadius: number;
  pipeRadius: number;
  horizontalOffset?: number; // How far pipes bend out from center line
}

export interface PipePaths {
  outletPath: [x: number, y: number, z: number][];
  inletPath: [x: number, y: number, z: number][];
}

/**
 * Generates programmatic pipe paths between a solar panel and storage tank
 * Automatically adjusts to changes in component positions and dimensions
 */
export const generatePipePaths = (config: PipePathConfig): PipePaths => {
  const {
    solarPanelPosition,
    tankPosition,
    tankHeight,
    tankRadius,
    pipeRadius,
    horizontalOffset = 4,
  } = config;

  const [panelX, panelY, panelZ] = solarPanelPosition;
  const [tankX, tankY, tankZ] = tankPosition;

  // Calculate connection points
  const panelConnectionY = panelY + pipeRadius;
  const tankBottomY = tankY - tankHeight / 2 + pipeRadius;
  const tankTopY = tankY + tankHeight / 2 - pipeRadius;

  // Midpoint Z for routing
  const midZ = (panelZ + tankZ) / 2;

  // Outlet path: Panel -> Tank (hot water from panel to top of tank)
  const outletPath: [x: number, y: number, z: number][] = [
    // Start at panel
    [panelX, panelConnectionY, panelZ],

    // Bend out to the right
    [panelX + horizontalOffset, panelConnectionY, panelZ],

    // Move toward tank
    [panelX + horizontalOffset, panelConnectionY, midZ],

    // Continue to tank and begin rising
    [panelX + horizontalOffset, panelConnectionY + pipeRadius * 2, tankZ],

    // Rise to tank top height
    [panelX + horizontalOffset, tankTopY - pipeRadius, tankZ],

    // Connect to tank top
    [tankX + tankRadius / 2, tankTopY - pipeRadius, tankZ],
  ];

  // Inlet path: Tank -> Panel (cold water from tank bottom to panel)
  const inletPath: [x: number, y: number, z: number][] = [
    // Start at tank bottom
    [tankX - tankRadius, tankBottomY, tankZ],

    // Bend out to the left
    [tankX - horizontalOffset, tankBottomY, tankZ],

    // Move toward panel
    [tankX - horizontalOffset, tankBottomY, midZ],

    // Continue to panel
    [tankX - horizontalOffset, panelConnectionY, panelZ],

    // Connect to panel
    [panelX, panelConnectionY, panelZ],
  ];

  return {
    outletPath,
    inletPath,
  };
};
