import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Shield, Zap } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  active: boolean;
};

const SHAPES = ["orivon", "craft", "grid", "free"] as const;
type ShapeType = (typeof SHAPES)[number];

interface LusionSandboxProps {
  isHeroBg?: boolean;
}

const getTargetPositions = (
  shapeName: ShapeType,
  w: number,
  h: number,
  particleCount: number,
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];

  if (typeof window === "undefined" || typeof document === "undefined") {
    for (let i = 0; i < particleCount; i++) {
      points.push({ x: 0, y: 0 });
    }
    return points;
  }

  if (shapeName === "free") {
    for (let i = 0; i < particleCount; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
      });
    }
    return points;
  }

  if (shapeName === "grid") {
    const cols = Math.round(Math.sqrt(particleCount * (w / h)));
    const rows = Math.ceil(particleCount / cols);
    const startX = (w - (cols - 1) * (w / (cols + 1))) / 2;
    const startY = (h - (rows - 1) * (h / (rows + 1))) / 2;
    const gapX = w / (cols + 1);
    const gapY = h / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        points.push({
          x: startX + c * gapX,
          y: startY + r * gapY,
        });
      }
    }
    return points;
  }

  // Text shapes: ORIVON or CRAFT
  const text = shapeName.toUpperCase();
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return points;

  // Scan at low resolution for high performance
  const scanW = 600;
  const scanH = Math.round(600 * (h / w));
  tempCanvas.width = scanW;
  tempCanvas.height = scanH;

  tempCtx.fillStyle = "#ffffff";
  const fontSize = Math.min(scanW / (text.length * 0.7), 80);
  tempCtx.font = `900 ${fontSize}px Cabinet Grotesk, sans-serif`;
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, scanW / 2, scanH / 2);

  const imgData = tempCtx.getImageData(0, 0, scanW, scanH);
  const data = imgData.data;
  const rawPoints: { x: number; y: number }[] = [];

  const step = 2;
  for (let py = 0; py < scanH; py += step) {
    for (let px = 0; px < scanW; px += step) {
      const idx = (py * scanW + px) * 4;
      const alpha = data[idx + 3];
      if (alpha > 120) {
        rawPoints.push({
          x: (px / scanW) * w,
          y: (py / scanH) * h,
        });
      }
    }
  }

  if (rawPoints.length === 0) {
    for (let i = 0; i < particleCount; i++) {
      points.push({ x: Math.random() * w, y: Math.random() * h });
    }
    return points;
  }

  for (let i = 0; i < particleCount; i++) {
    const pt = rawPoints[i % rawPoints.length];
    points.push({
      x: pt.x + (Math.random() - 0.5) * 4,
      y: pt.y + (Math.random() - 0.5) * 4,
    });
  }

  return points;
};

export function LusionSandbox({ isHeroBg = false }: LusionSandboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useRef(true);
  const [mode, setMode] = useState<"repel" | "attract" | "gravity">("repel");
  const [shape, setShape] = useState<ShapeType>(isHeroBg ? "grid" : "orivon");
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Optimized particle parameters based on screen size to preserve frame rate
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? (isHeroBg ? 250 : 180) : isHeroBg ? 600 : 400;
  const gravityForce = 0.04;
  const interactionRadius = isHeroBg ? 180 : 120;

  const particles = useRef<Particle[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const mouse = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize particles
  const initParticles = useCallback(
    (width: number, height: number) => {
      const arr: Particle[] = [];
      const colors = ["#C75B3A", "#1A1A1A", "#4B6E6A", "#8B5E3C", "#E5DDD3"];

      for (let i = 0; i < particleCount; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        arr.push({
          x: rx,
          y: ry,
          baseX: rx,
          baseY: ry,
          vx: 0,
          vy: 0,
          size: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: isHeroBg ? Math.random() * 0.25 + 0.15 : Math.random() * 0.5 + 0.4, // lower opacity behind text
        });
      }

      const targets = getTargetPositions(shape, width, height, particleCount);
      for (let i = 0; i < arr.length; i++) {
        const target = targets[i % targets.length];
        arr[i].baseX = target.x;
        arr[i].baseY = target.y;
      }

      particles.current = arr;
    },
    [particleCount, isHeroBg, shape],
  );

  // Smoothly morph particles when shape changes without snapping
  useEffect(() => {
    if (!isHome || particles.current.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;

    const targets = getTargetPositions(shape, cw, ch, particleCount);
    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      const target = targets[i % targets.length];
      p.baseX = target.x;
      p.baseY = target.y;
    }
  }, [shape, particleCount, isHome]);

  useEffect(() => {
    if (!isHome) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!containerRef.current) return;
      w = containerRef.current.clientWidth;
      h = containerRef.current.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles(w, h);
    };

    let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(() => {
        resize();
      }, 150);
    };

    resize();
    window.addEventListener("resize", handleResize);

    // Track mouse globally on window to capture motion behind text layers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
      mouse.current.active = false;
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Prevent spawning ripples from clicks on HUD buttons
      const target = e.target as HTMLElement;
      if (target && target.closest(".hud-control")) return;

      ripples.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: isHeroBg ? 350 : 250,
        active: true,
      });

      if (ripples.current.length > 5) {
        ripples.current.shift();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseClick);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;

    const tick = () => {
      if (!isVisible.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Warm cream trail background (light-only brand)
      ctx.fillStyle = isHeroBg ? "rgba(250, 247, 242, 0.22)" : "rgba(255, 255, 255, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // 1. Process Ripples
      ripples.current.forEach((r) => {
        if (!r.active) return;
        r.radius += isHeroBg ? 8 : 6;
        if (r.radius > r.maxRadius) {
          r.active = false;
        }

        // Draw subtle ring (burnt terracotta accent)
        ctx.strokeStyle = `rgba(199, 91, 58, ${0.45 * (1 - r.radius / r.maxRadius)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Animate particles
      const list = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const activeRipples = ripples.current.filter((r) => r.active);
      const interactionRadiusSq = interactionRadius * interactionRadius;

      for (let i = 0; i < list.length; i++) {
        const p = list[i];

        const dx = mx - p.x;
        const dy = my - p.y;
        const distSq = dx * dx + dy * dy;

        let forceX = 0;
        let forceY = 0;

        // Interactive mouse forces
        if (distSq < interactionRadiusSq && mouse.current.active) {
          const dist = Math.sqrt(distSq);
          if (dist > 0) {
            const force = (interactionRadius - dist) / interactionRadius; // 0 to 1

            if (mode === "repel") {
              forceX = -(dx / dist) * force * 5.0;
              forceY = -(dy / dist) * force * 5.0;
            } else if (mode === "attract") {
              forceX = (dx / dist) * force * 4.0;
              forceY = (dy / dist) * force * 4.0;
            }
          }
        }

        // Mode specific physics behaviors
        if (mode === "gravity") {
          p.vy += gravityForce;

          if (p.y >= h - p.size) {
            p.y = h - p.size;
            p.vy *= -0.35; // bounce dampening
            p.vx *= 0.8;
          }
          if (p.x <= p.size || p.x >= w - p.size) {
            p.vx *= -0.5;
          }
        } else {
          // Spring force pulling back to grid bases
          const homeDx = p.baseX - p.x;
          const homeDy = p.baseY - p.y;

          p.vx += homeDx * 0.035;
          p.vy += homeDy * 0.035;

          p.vx *= 0.88;
          p.vy *= 0.88;
        }

        // Ripple wave displacement
        activeRipples.forEach((r) => {
          const rdx = p.x - r.x;
          const rdy = p.y - r.y;
          const rdistSq = rdx * rdx + rdy * rdy;
          const minR = Math.max(0, r.radius - 25);
          const maxR = r.radius + 25;

          if (rdistSq > minR * minR && rdistSq < maxR * maxR) {
            const rdist = Math.sqrt(rdistSq);
            if (rdist > 0) {
              const rippleForce = (1 - r.radius / r.maxRadius) * 10;
              p.vx += (rdx / rdist) * rippleForce;
              p.vy += (rdy / rdist) * rippleForce;
            }
          }
        });

        p.vx += forceX;
        p.vy += forceY;
        p.x += p.vx;
        p.y += p.vy;

        if (mode === "gravity") {
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Respect prefers-reduced-motion: render one static frame and stop looping
      if (!reduceMotion) {
        rafId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseClick);
    };
  }, [mode, particleCount, gravityForce, interactionRadius, isHeroBg, isHome, initParticles]);

  const handleReset = () => {
    if (canvasRef.current) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvasRef.current.width / dpr;
      const h = canvasRef.current.height / dpr;
      initParticles(w, h);
    }
  };

  if (isHeroBg) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-background"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[350px] bg-[var(--card)] border border-border rounded-xl overflow-hidden shadow-elegant flex flex-col justify-between p-6 text-foreground"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair z-0" />

      {/* Top Overlay HUD */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
          ORIVON_LABS // LUSION_ENGINE
        </span>
        <span>PARTICLES: {particleCount}</span>
      </div>

      {/* Center Prompt */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-40">
        <div className="text-center space-y-2">
          <p className="font-serif text-lg text-foreground">Interactive sandbox</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
            click to emit ripples / drag to displace
          </p>
        </div>
      </div>

      {/* Bottom controls panel */}
      <div className="relative z-10 flex flex-col gap-3 border-t border-border pt-4 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mr-1">
              PHYS:
            </span>
            <div className="flex gap-1">
              {(["repel", "attract", "gravity"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1.5 rounded text-[9px] font-mono tracking-wider font-semibold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    mode === m
                      ? "bg-primary text-primary-foreground font-bold shadow-glow-cyan"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {m === "repel" && <Shield size={8} />}
                  {m === "attract" && <Zap size={8} />}
                  {m === "gravity" && <Play size={8} />}
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            aria-label="Reset particles"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mr-1">
            SHAPE:
          </span>
          <div className="flex flex-wrap gap-1">
            {(["orivon", "craft", "grid", "free"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`px-2.5 py-1 rounded text-[9px] font-mono tracking-wider font-semibold uppercase transition-all cursor-pointer ${
                  shape === s
                    ? "bg-[var(--primary)] text-primary-foreground font-bold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
