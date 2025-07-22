import React, { useEffect, useRef, useImperativeHandle, forwardRef, memo } from "react";
import type { AnimatedGridProps, AnimatedGridPlugin } from "./AnimatedGrid.types";

// Plugin registry
const pluginRegistry: AnimatedGridPlugin[] = [];
export function registerAnimatedGridPlugin(plugin: AnimatedGridPlugin) {
  pluginRegistry.push(plugin);
}

const DEFAULTS = {
  gridColor: "rgba(209,209,209,0.16)",
  glowColor: "rgba(0,200,150,0.6)",
  rippleColor: "rgba(0,200,150,0.15)",
  mobileBreakpoint: 640,
  staticBgImg: "/bg-grid-static.webp",
  maxParticles: 150,
  // Performance settings
  targetFPS: 60,
  adaptiveQuality: true,
  gpuAcceleration: true,
};

const AnimatedGrid = memo(
  forwardRef<HTMLCanvasElement, AnimatedGridProps>(function AnimatedGrid(
    {
      gridColor = DEFAULTS.gridColor,
      glowColor = DEFAULTS.glowColor,
      rippleColor = DEFAULTS.rippleColor,
      maxParticles = DEFAULTS.maxParticles,
      mobileBreakpoint = DEFAULTS.mobileBreakpoint,
      staticBgImg = DEFAULTS.staticBgImg,
      className = "absolute top-0 left-0 w-full h-full pointer-events-none z-0",
      disableAnimation,
      plugins = [],
      slotCustomDraw,
      "data-testid": dataTestId = "animated-grid-canvas",
      // Performance props
      targetFPS = DEFAULTS.targetFPS,
      adaptiveQuality = DEFAULTS.adaptiveQuality,
      gpuAcceleration = DEFAULTS.gpuAcceleration,
      // Enhanced props
      intensity = 1,
      mouseInfluence = 1,
      particleTrails = false,
      // Events
      onLoad,
      onPerformanceChange,
    },
    ref
  ) {
    const mouse = useRef({ x: -100, y: -100 });
    const particles = useRef<{ x: number; y: number; alpha: number; life: number }[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const performanceMonitor = useRef({
      frameCount: 0,
      lastTime: performance.now(),
      fps: 60,
      quality: 1.0,
      isLowPower: false
    });
    useImperativeHandle(ref, () => canvasRef.current!, []);

    const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
    useEffect(() => {
      if (typeof window === "undefined") return;
      const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
      check();
      window.addEventListener("resize", check, { passive: true });
      return () => window.removeEventListener("resize", check);
    }, [mobileBreakpoint]);

    const [prefersReducedMotion, setReduced] = React.useState(false);
    useEffect(() => {
      if (typeof window === "undefined") return;
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(m.matches);
      const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
      m.addEventListener("change", handler);
      return () => m.removeEventListener("change", handler);
    }, []);

    // Performance monitoring
    useEffect(() => {
      if (typeof window === "undefined") return;
      
      // Detect low-power mode
      const checkLowPower = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
          const renderer = gl.getParameter(gl.RENDERER);
          performanceMonitor.current.isLowPower = 
            /SwiftShader|llvmpipe|software/i.test(renderer);
        }
      };
      
      checkLowPower();
    }, []);

    const animationDisabled = disableAnimation ?? prefersReducedMotion;

    const updateMouse = React.useCallback((x: number, y: number) => {
      const _canvas = canvasRef.current;
      if (!_canvas) return;
      const rect = _canvas.getBoundingClientRect();
      const scaleX = _canvas.width / rect.width;
      const scaleY = _canvas.height / rect.height;
      mouse.current.x = (x - rect.left) * scaleX;
      mouse.current.y = (y - rect.top) * scaleY;
    }, []);

    useEffect(() => {
      if (isMobile !== false || animationDisabled) return;
      const canvas = canvasRef.current;
      if (!canvas || typeof window === "undefined") return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gridX = 101, gridY = 85;
      let lines = Math.ceil(window.innerWidth / gridX);
      let verticalGlow = Array.from({ length: lines }).map((_, i) => ({
        x: i * gridX,
        offset: Math.random() * canvas.height,
        speed: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 200,
      }));

      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const quality = performanceMonitor.current.quality;
        const effectiveDPR = adaptiveQuality ? dpr * quality : dpr;
        
        canvas.width = window.innerWidth * effectiveDPR;
        canvas.height = window.innerHeight * effectiveDPR;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(effectiveDPR, 0, 0, effectiveDPR, 0, 0);
        
        // GPU acceleration hints
        if (gpuAcceleration) {
          ctx.imageSmoothingEnabled = false;
          canvas.style.willChange = 'transform';
        }
        
        lines = Math.ceil(window.innerWidth / gridX);
        verticalGlow = Array.from({ length: lines }).map((_, i) => ({
          x: i * gridX,
          offset: Math.random() * canvas.height,
          speed: 1.5 + Math.random() * 1.5,
          delay: Math.random() * 200,
        }));
      };
      let resizeTimer: any = null;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
      };
      resize();

      const pulse = { current: 0 };
      let animationFrameId: number | null = null;

      const render = () => {
        const _canvas = canvasRef.current;
        if (!_canvas) return;
        const _ctx = _canvas.getContext("2d");
        if (!_ctx) return;

        // Performance monitoring
        const now = performance.now();
        const deltaTime = now - performanceMonitor.current.lastTime;
        performanceMonitor.current.frameCount++;
        
        if (deltaTime >= 1000) { // Update FPS every second
          const currentFPS = Math.round(
            (performanceMonitor.current.frameCount * 1000) / deltaTime
          );
          performanceMonitor.current.fps = currentFPS;
          performanceMonitor.current.frameCount = 0;
          performanceMonitor.current.lastTime = now;
          
          // Adaptive quality adjustment
          if (adaptiveQuality) {
            const targetFPSValue = targetFPS || 60;
            if (currentFPS < targetFPSValue * 0.8) {
              performanceMonitor.current.quality = Math.max(0.5, 
                performanceMonitor.current.quality - 0.1);
            } else if (currentFPS > targetFPSValue * 0.95) {
              performanceMonitor.current.quality = Math.min(1.0, 
                performanceMonitor.current.quality + 0.05);
            }
          }
          
          // Callback for performance monitoring
          onPerformanceChange?.(currentFPS);
        }

        // Skip frame if FPS is too low and adaptive quality is enabled
        if (adaptiveQuality && performanceMonitor.current.fps < (targetFPS || 60) * 0.5) {
          if (pulse.current % 2 === 0) {
            animationFrameId = requestAnimationFrame(render);
            return;
          }
        }

        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

        // BG Gradient
        const shaderGradient = _ctx.createLinearGradient(
          0, 0, _canvas.width, _canvas.height
        );
        shaderGradient.addColorStop(0, "rgba(0, 200, 150, 0.03)");
        shaderGradient.addColorStop(1, "rgba(0, 100, 75, 0.03)");
        _ctx.fillStyle = shaderGradient;
        _ctx.fillRect(0, 0, _canvas.width, _canvas.height);

        _ctx.lineWidth = 1;

        // Advanced grid with dynamic intensity
        const currentIntensity = intensity * performanceMonitor.current.quality;
        
        // Vertical lines with enhanced wave physics
        for (let x = 0; x <= _canvas.width; x += gridX) {
          _ctx.beginPath();
          
          // Check if this line has a glow effect
          const glowLine = verticalGlow.find(line => Math.abs(line.x - x) < gridX / 2);
          let hasGlow = false;
          let glowGradient = null;
          
          if (glowLine) {
            hasGlow = true;
            glowGradient = _ctx.createLinearGradient(
              x, _canvas.height - glowLine.offset, 
              x, _canvas.height - glowLine.offset - 200
            );
            glowGradient.addColorStop(0, "rgba(0,200,150,0.0)");
            glowGradient.addColorStop(0.5, glowColor);
            glowGradient.addColorStop(1, "rgba(0,200,150,0.0)");
          }
          
          for (let y = 0; y <= _canvas.height; y += 10) {
            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseEffect = mouseInfluence * Math.exp(-dist / 400);
            const wave = Math.sin(dist * 0.05 - pulse.current * 0.05) * 
                        3 * currentIntensity * (1 + mouseEffect);
            _ctx.lineTo(x + wave, y);
          }
          
          // Apply glow effect if this line has glow
          if (hasGlow && glowGradient) {
            _ctx.strokeStyle = glowGradient;
            _ctx.lineWidth = 2;
            _ctx.stroke();
            
            // Also draw the normal grid line but dimmer
            _ctx.beginPath();
            for (let y = 0; y <= _canvas.height; y += 10) {
              const dx = mouse.current.x - x;
              const dy = mouse.current.y - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const mouseEffect = mouseInfluence * Math.exp(-dist / 400);
              const wave = Math.sin(dist * 0.05 - pulse.current * 0.05) * 
                          3 * currentIntensity * (1 + mouseEffect);
              _ctx.lineTo(x + wave, y);
            }
            _ctx.strokeStyle = gridColor.replace(/[\d.]+\)$/g, '0.08)'); // Dimmer grid line
            _ctx.lineWidth = 1;
            _ctx.stroke();
          } else {
            // Normal grid line
            _ctx.strokeStyle = gridColor;
            _ctx.lineWidth = 1;
            _ctx.stroke();
          }
        }

        // Horizontal lines with enhanced wave physics (no glow)
        for (let y = 0; y <= _canvas.height; y += gridY) {
          _ctx.beginPath();
          for (let x = 0; x <= _canvas.width; x += 10) {
            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseEffect = mouseInfluence * Math.exp(-dist / 400);
            const wave = Math.sin(dist * 0.05 - pulse.current * 0.05) * 
                        3 * currentIntensity * (1 + mouseEffect);
            _ctx.lineTo(x, y + wave);
          }
          _ctx.strokeStyle = gridColor;
          _ctx.stroke();
        }

        // Update glow line positions
        for (const line of verticalGlow) {
          line.offset += line.speed;
          if (line.offset > _canvas.height + 200) line.offset = 0;
        }

        // Mouse ripple
        const rippleRadius = 40 + Math.abs(Math.sin(pulse.current * 0.07)) * 20;
        const rippleGradient = _ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, rippleRadius
        );
        rippleGradient.addColorStop(0, rippleColor);
        rippleGradient.addColorStop(0.5, rippleColor.replace("0.15", "0.07"));
        rippleGradient.addColorStop(1, "rgba(0,200,150,0)");
        _ctx.fillStyle = rippleGradient;
        _ctx.beginPath();
        _ctx.arc(mouse.current.x, mouse.current.y, rippleRadius, 0, 2 * Math.PI);
        _ctx.fill();

        // Plugin/slot: draw extension
        pluginRegistry.concat(plugins).forEach((plugin) =>
          plugin?.onDraw?.({ ctx: _ctx, canvas: _canvas, mouse: mouse.current, particles: particles.current, frame: pulse.current })
        );
        slotCustomDraw?.({ ctx: _ctx, canvas: _canvas, mouse: mouse.current, particles: particles.current, frame: pulse.current });

        // Enhanced particles with trails
        const ps = particles.current;
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          p.y -= 0.5 * currentIntensity;
          p.alpha -= 0.01;
          p.life -= 1;
          
          // Particle trail effect
          if (particleTrails && p.alpha > 0.3) {
            const trailLength = 5;
            for (let t = 0; t < trailLength; t++) {
              const trailAlpha = p.alpha * (1 - t / trailLength) * 0.3;
              const trailY = p.y + t * 2;
              _ctx.beginPath();
              _ctx.arc(p.x, trailY, 1 + t * 0.2, 0, Math.PI * 2);
              _ctx.fillStyle = `rgba(0, 200, 150, ${trailAlpha})`;
              _ctx.fill();
            }
          }
          
          // Main particle
          _ctx.beginPath();
          _ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          _ctx.fillStyle = `rgba(0, 200, 150, ${p.alpha})`;
          _ctx.fill();
          
          if (p.life <= 0 || p.alpha <= 0) {
            ps.splice(i, 1);
          }
        }
        
        // Adaptive particle generation
        const particleGenRate = performanceMonitor.current.quality * 0.5;
        if (ps.length < maxParticles && Math.random() < particleGenRate) {
          ps.push({
            x: mouse.current.x + (Math.random() - 0.5) * 50,
            y: mouse.current.y + (Math.random() - 0.5) * 50,
            alpha: 0.8,
            life: 100 + Math.random() * 50,
          });
        }

        pulse.current++;
        animationFrameId = requestAnimationFrame(render);
      };

      // Mouse/touch
      const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          updateMouse(touch.clientX, touch.clientY);
        }
      };

      window.addEventListener("resize", debouncedResize, { passive: true });
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      animationFrameId = requestAnimationFrame(render);
      
      // Notify component is loaded
      onLoad?.();

      return () => {
        window.removeEventListener("resize", debouncedResize);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        clearTimeout(resizeTimer);
      };
    }, [
      isMobile, animationDisabled,
      gridColor, glowColor, rippleColor,
      maxParticles, plugins, slotCustomDraw, updateMouse
    ]);

    if (isMobile === null) {
      return <div className="w-full h-full" aria-hidden="true" />;
    }
    if (isMobile || animationDisabled) {
      return (
        <img
          src={staticBgImg}
          alt=""
          aria-hidden="true"
          className={`${className} w-full h-full object-cover`}
          data-testid={dataTestId}
        />
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className={className}
        aria-hidden="true"
        tabIndex={-1}
        role="presentation"
        data-animated-grid
        data-testid={dataTestId}
      />
    );
  })
);

export default AnimatedGrid;
