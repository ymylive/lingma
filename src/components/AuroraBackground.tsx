import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface AuroraBackgroundProps {
  lowMotion?: boolean;
}

const VERTEX_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uTrailPos[8];
uniform float uTrailTime[8];
uniform float uDark;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.08;

  // ─── CURSOR DISTURBANCE — curl-noise turbulence along trail ───
  // Accumulate gaussian trail influence; curl of single-octave noise gives a
  // divergence-free rotational field that swirls the sampling coords → smoke
  // visibly rotates/eddies along the cursor path, no linear stretch/distortion.
  const float TRAIL_R   = 0.24;
  const float TRAIL_TAU = 1.2;
  float trailInfluence = 0.0;
  for (int i = 0; i < 8; i++) {
    float age = uTime - uTrailTime[i];
    if (age < 0.0 || age > 3.0) continue;
    vec2 rUv = uTrailPos[i] / uResolution;
    vec2 rp  = vec2(rUv.x * aspect, rUv.y);
    vec2 to  = p - rp;
    float d2 = dot(to, to);
    trailInfluence += exp(-d2 / (TRAIL_R * TRAIL_R)) * exp(-age / TRAIL_TAU);
  }
  trailInfluence = clamp(trailInfluence, 0.0, 1.8);
  vec2 nc = p * 2.8 + vec2(uTime * 0.30, -uTime * 0.22);
  float eps = 0.035;
  float nxa = noise(nc + vec2(eps, 0.0));
  float nxb = noise(nc - vec2(eps, 0.0));
  float nya = noise(nc + vec2(0.0, eps));
  float nyb = noise(nc - vec2(0.0, eps));
  // curl = (∂n/∂y, -∂n/∂x)
  vec2 curl = vec2(nya - nyb, nxb - nxa);
  vec2 pd = p + curl * (trailInfluence * 0.14);

  // Domain warping -> "smoke" flow, sampled at disturbed coords
  vec2 q = vec2(fbm(pd + vec2(0.0, t)), fbm(pd + vec2(5.2, 1.3) - vec2(t, 0.0)));
  vec2 r = vec2(
    fbm(pd + 3.0 * q + vec2(1.7, 9.2) + vec2(t * 1.5, 0.0)),
    fbm(pd + 3.0 * q + vec2(8.3, 2.8) - vec2(0.0, t * 1.1))
  );
  float f = fbm(pd + 3.0 * r);

  // High-frequency wisp layer (also disturbed, so wisps swirl inside the vortex)
  float wisps = fbm(pd * 3.2 + vec2(t * 0.5, -t * 0.35));
  f += wisps * 0.38;

  // Ambient wave field — dark mode: slower/bigger dramatic waves; light mode: faster/airier ripples
  float waveSpeedMul = mix(1.25, 0.85, uDark);
  float waveFreqMul  = mix(1.15, 0.90, uDark);
  float waveA = sin((p.x * 2.6 * waveFreqMul + fbm(p * 0.8 + vec2(uTime * 0.12, 0.0)) * 2.4) + uTime * 0.55 * waveSpeedMul);
  float waveB = sin((p.y * 2.2 * waveFreqMul - fbm(p * 0.7 - vec2(0.0, uTime * 0.10)) * 2.0) - uTime * 0.42 * waveSpeedMul);
  float waveC = sin(((p.x + p.y) * 1.8 * waveFreqMul + fbm(p * 1.1 + vec2(uTime * 0.08, uTime * 0.06)) * 3.0) + uTime * 0.30 * waveSpeedMul);
  float waveField = (waveA * 0.45 + waveB * 0.40 + waveC * 0.35) * mix(0.12, 0.09, uDark);
  f += waveField;

  // Contrast boost: bias + gain. Dark mode gets a larger bias so more of the screen lands
  // in the Klein-smoke range instead of the void baseline — makes dark-mode smoke more visible.
  f = (f + mix(0.10, 0.20, uDark)) * 1.25;

  // --- DARK PALETTE: cinematic IKB aurora over void ---
  vec3 voidDark    = vec3(0.020, 0.028, 0.055);        // lifted near-black w/ blue undertone
  vec3 kleinDeep   = vec3(0.000, 0.110, 0.420);        // deeper IKB, brighter
  vec3 kleinMid    = vec3(0.020, 0.240, 0.720);        // #002FA7 lifted
  vec3 kleinElec   = vec3(0.360, 0.600, 1.000);        // electric glow
  vec3 darkWarm    = vec3(1.000, 0.900, 0.560);        // warm crest highlight
  vec3 pine        = vec3(1.000, 0.882, 0.208);        // #FFE135

  // --- LIGHT PALETTE: soft watercolor pigment dispersion, distinctly warmer ---
  vec3 paperBase   = vec3(0.975, 0.972, 0.965);        // warm off-white paper
  vec3 skyWash     = vec3(0.770, 0.855, 0.970);        // pale sky wash
  vec3 kleinInk    = vec3(0.340, 0.510, 0.880);        // bleeding Klein pigment
  vec3 sunBloom    = vec3(1.000, 0.920, 0.680);        // warm sunlight bloom
  vec3 blush       = vec3(1.000, 0.810, 0.780);        // rose blush (sunset)

  // Continuous color ramp: each smoothstep's start tightly overlaps previous end.
  // No constant multipliers on smoothstep results (those create visible color shelves / seams).
  vec3 cDark = voidDark;
  cDark = mix(cDark, kleinDeep,  smoothstep(0.00, 0.42, f));
  cDark = mix(cDark, kleinMid,   smoothstep(0.36, 0.68, f));
  cDark = mix(cDark, kleinElec,  smoothstep(0.62, 0.86, f));
  cDark = mix(cDark, darkWarm,   smoothstep(0.86, 0.99, f));

  vec3 cLight = paperBase;
  cLight = mix(cLight, skyWash,  smoothstep(0.00, 0.42, f));
  cLight = mix(cLight, kleinInk, smoothstep(0.36, 0.68, f));
  cLight = mix(cLight, sunBloom, smoothstep(0.60, 0.84, f));
  cLight = mix(cLight, blush,    smoothstep(0.82, 0.96, f));

  vec3 color = mix(cLight, cDark, uDark);

  // Pine Yellow sparkles at flow crests — ambient (not cursor-driven)
  // The cursor ripple already pushes local f higher at crests, so sparkles naturally appear
  // along the ripple bands — giving visual feedback without adding a bloom layer.
  float sparkle = smoothstep(0.86, 0.93, f) * (1.0 - smoothstep(0.93, 0.98, f));
  color += pine * sparkle * mix(0.20, 0.72, uDark);

  // Vignette: darker mode deeper vignette for cinematic focus
  float vig = 1.0 - length(uv - 0.5) * mix(0.70, 0.95, uDark);
  color *= mix(1.0, vig, mix(0.22, 0.38, uDark));

  // 8-bit quantization banding mitigation: ±1/510 hash-based dither
  // Breaks up visible bands in deep gradients (especially dark void->IKB transition)
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  color += vec3(dither) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[AuroraBackground] shader compile failed:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function AuroraBackground({ lowMotion = false }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[AuroraBackground] program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uTrailPos = gl.getUniformLocation(program, 'uTrailPos');
    const uTrailTime = gl.getUniformLocation(program, 'uTrailTime');
    const uDark = gl.getUniformLocation(program, 'uDark');

    // Aurora is a decorative background — 1.0 DPR is plenty and ~2.25× cheaper on retina.
    const dpr = () => 1.0;

    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr());
      const h = Math.floor(window.innerHeight * dpr());
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const TRAIL_MAX = 8;
    const trailPosArr = new Float32Array(TRAIL_MAX * 2);
    const trailTimeArr = new Float32Array(TRAIL_MAX);
    for (let i = 0; i < TRAIL_MAX; i++) trailTimeArr[i] = -1000.0;
    let trailHead = 0;
    let lastEmitMs = 0;
    let lastEmitX = -1e9;
    let lastEmitY = -1e9;
    const start = performance.now();

    const handleMove = (e: PointerEvent) => {
      const k = dpr();
      const x = e.clientX * k;
      const y = (window.innerHeight - e.clientY) * k;
      const now = performance.now();
      if (now - lastEmitMs < 22) return;
      const minDim = Math.min(canvas.width, canvas.height);
      const minDist = minDim * 0.015;
      const dx = x - lastEmitX;
      const dy = y - lastEmitY;
      if (dx * dx + dy * dy < minDist * minDist) return;
      trailPosArr[trailHead * 2] = x;
      trailPosArr[trailHead * 2 + 1] = y;
      trailTimeArr[trailHead] = (now - start) / 1000;
      trailHead = (trailHead + 1) % TRAIL_MAX;
      lastEmitMs = now;
      lastEmitX = x;
      lastEmitY = y;
    };
    window.addEventListener('pointermove', handleMove, { passive: true });

    let running = !document.hidden;
    const handleVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const emptyPos = new Float32Array(TRAIL_MAX * 2);
    const emptyTime = new Float32Array(TRAIL_MAX);
    for (let i = 0; i < TRAIL_MAX; i++) emptyTime[i] = -1000.0;

    const drawOnce = () => {
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2fv(uTrailPos, emptyPos);
      gl.uniform1fv(uTrailTime, emptyTime);
      gl.uniform1f(uDark, themeRef.current === 'dark' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let rafId = 0;

    if (lowMotion) {
      drawOnce();
      // redraw on resize or theme change (theme change re-runs the effect via dep)
      const staticResize = () => {
        resize();
        drawOnce();
      };
      window.addEventListener('resize', staticResize);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('resize', staticResize);
        window.removeEventListener('pointermove', handleMove);
        document.removeEventListener('visibilitychange', handleVisibility);
        gl.deleteBuffer(buf);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!running) return;

      const now = performance.now();
      const t = (now - start) / 1000;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2fv(uTrailPos, trailPosArr);
      gl.uniform1fv(uTrailTime, trailTimeArr);
      gl.uniform1f(uDark, themeRef.current === 'dark' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [lowMotion, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none h-screen w-screen"
    />
  );
}
