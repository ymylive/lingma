import { useEffect, useRef } from 'react';
// @ts-expect-error — legacy JS fork of Pavel Dobryakov's WebGL-Fluid-Simulation, no types
import initFluidSim from './fluid-sim/webgl-fluid.js';

interface FluidSmokeLayerProps {
  lowMotion?: boolean;
}

/**
 * Fluid smoke interaction layer — sits on top of <AuroraBackground/> as a
 * transparent overlay. Mouse movement splats Klein Blue / Pine Yellow dye
 * into the simulation, producing real Navier-Stokes diffusion + velocity
 * curl behind the cursor. Canvas is `pointer-events: none` so the rest of
 * the page remains interactive; the fluid sim listens on `window`.
 */
export default function FluidSmokeLayer({ lowMotion = false }: FluidSmokeLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (lowMotion || !canvasRef.current) return;
    const cleanup = initFluidSim(canvasRef.current, {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      // Faster dissipation = splats fade before becoming overwhelming;
      // we want a subtle reactive layer, not a primary visual.
      DENSITY_DISSIPATION: 2.2,
      VELOCITY_DISSIPATION: 1.8,
      PRESSURE: 0.7,
      PRESSURE_ITERATIONS: 20,
      CURL: 22,
      SPLAT_RADIUS: 0.15,
      SPLAT_FORCE: 5000,
      SHADING: true,
      TRANSPARENT: true,     // show Klein Aurora underneath
      BLOOM: false,
      SUNRAYS: false,
      RANDOM_COLORS: false,  // use our Klein/Pine palette
    });
    return cleanup;
  }, [lowMotion]);

  if (lowMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none h-screen w-screen"
    />
  );
}
