// src/AnimatedGrid.types.ts
export type AnimatedGridPlugin = {
  onDraw?: (args: {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    mouse: { x: number; y: number };
    particles: any[];
    frame: number;
  }) => void;
};

export type AnimatedGridProps = {
  gridColor?: string;
  glowColor?: string;
  rippleColor?: string;
  maxParticles?: number;
  mobileBreakpoint?: number;
  staticBgImg?: string;
  className?: string;
  disableAnimation?: boolean;
  plugins?: AnimatedGridPlugin[];
  slotCustomDraw?: AnimatedGridPlugin["onDraw"];
  "data-testid"?: string;
  // Performance props
  targetFPS?: number;
  adaptiveQuality?: boolean;
  gpuAcceleration?: boolean;
  // Visual enhancements
  intensity?: number;
  mouseInfluence?: number;
  particleTrails?: boolean;
  // Events
  onLoad?: () => void;
  onPerformanceChange?: (fps: number) => void;
};
