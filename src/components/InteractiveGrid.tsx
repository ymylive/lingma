import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Configuration
    const SPACING = 40; // Spacing for base grid
    const CONNECTION_DIST = 100; // Distance to connect lines
    const MOUSE_DIST = 180; // Mouse influence radius
    const PARTICLE_SIZE = 1.5;

    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number; // Velocity X
      vy: number; // Velocity Y
      energy: number; // 0 to 1 (0 = Blue, 1 = Yellow)
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.5; // Drift slightly
        this.vy = (Math.random() - 0.5) * 0.5;
        this.energy = 0;
      }

      update() {
        // 1. Mouse Interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_DIST) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = MOUSE_DIST;
          const force = (maxDistance - distance) / maxDistance;
          
          // Repulsion (Push away)
          const directionX = forceDirectionX * force * 3;
          const directionY = forceDirectionY * force * 3;

          this.vx -= directionX;
          this.vy -= directionY;
          
          // Gain energy from mouse proximity
          this.energy = Math.min(this.energy + 0.1, 1);
        }

        // 2. Return to Base (Elasticity)
        const dxBase = this.baseX - this.x;
        const dyBase = this.baseY - this.y;
        this.vx += dxBase * 0.02;
        this.vy += dyBase * 0.02;

        // 3. Friction & Movement
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.x += this.vx;
        this.y += this.vy;
        
        // 4. Energy Decay
        this.energy *= 0.95;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Color interpolation
        // Base: Klein Blue (0, 47, 167) -> RGB(0, 47, 167)
        // Active: Pine Yellow (255, 225, 53) -> RGB(255, 225, 53)
        
        let r, g, b, a;
        
        if (theme === 'dark') {
          // Dark Mode: Bright Blue to Bright Yellow
          r = 0 + (255 - 0) * this.energy;
          g = 100 + (225 - 100) * this.energy; // Lighter blue base
          b = 255 + (53 - 255) * this.energy;
          a = 0.3 + this.energy * 0.7;
        } else {
          // Light Mode: Deep Blue to Deep Yellow
          r = 0 + (255 - 0) * this.energy;
          g = 47 + (200 - 47) * this.energy;
          b = 167 + (0 - 167) * this.energy;
          a = 0.2 + this.energy * 0.8;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, PARTICLE_SIZE + this.energy, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      // Create a grid of particles
      for (let y = 0; y < height; y += SPACING) {
        for (let x = 0; x < width; x += SPACING) {
          // Add some randomness to initial position for organic feel
          const jitter = SPACING * 0.3;
          const px = x + (Math.random() - 0.5) * jitter;
          const py = y + (Math.random() - 0.5) * jitter;
          particles.push(new Particle(px, py));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update all particles first
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }

      // Draw Lines & Particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Draw the particle itself
        p1.draw(ctx);

        // Connect to neighbors
        if (p1.energy > 0.1 || theme === 'dark') { 
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                
                if (Math.abs(dx) > CONNECTION_DIST || Math.abs(dy) > CONNECTION_DIST) continue;

                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = 1 - (dist / CONNECTION_DIST);
                    const avgEnergy = (p1.energy + p2.energy) / 2;
                    
                    ctx.beginPath();
                    
                    if (theme === 'dark') {
                       const r = 50 + (255 - 50) * avgEnergy;
                       const g = 100 + (225 - 100) * avgEnergy;
                       const b = 255 + (50 - 255) * avgEnergy;
                       ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * (0.15 + avgEnergy * 0.5)})`;
                       ctx.lineWidth = 0.5 + avgEnergy;
                    } else {
                       const r = 0 + (200 - 0) * avgEnergy;
                       const g = 47 + (180 - 47) * avgEnergy;
                       const b = 167 + (0 - 167) * avgEnergy;
                       ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * (0.1 + avgEnergy * 0.6)})`;
                       ctx.lineWidth = 0.5 + avgEnergy;
                    }
                    
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
