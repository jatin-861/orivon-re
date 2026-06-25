import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useInView } from "@/hooks/useInView";

gsap.registerPlugin(ScrollTrigger);

export function ScrambleText({ text, delay = 0.5 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let frameId: number;

    const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const targetText = text;
    const length = targetText.length;
    let iteration = 0;

    const scramble = () => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < Math.floor(iteration)) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );

      if (iteration < length) {
        iteration += 0.35; // smooth settle speed
        frameId = requestAnimationFrame(scramble);
      } else {
        setDisplayText(targetText);
      }
    };

    const timeoutId = window.setTimeout(() => {
      frameId = requestAnimationFrame(scramble);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay]);

  return <span>{displayText || text}</span>;
}

class Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number = 0;
  vy: number = 0;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.color = color;
    this.size = size;
  }

  update(mx: number, my: number, radius: number, time: number) {
    const dx = mx - this.x;
    const dy = my - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      const force = (radius - dist) / radius;
      const angle = Math.atan2(this.y - my, this.x - mx);
      // Increased repel force to 14 for a more playful, responsive effect
      const repelX = Math.cos(angle) * force * 14;
      const repelY = Math.sin(angle) * force * 14;

      this.vx += repelX;
      this.vy += repelY;
    }

    // Home position targets with breathing sinusoidal offsets when mouse is idle
    let targetX = this.ox;
    let targetY = this.oy;

    if (mx === -9999 && my === -9999) {
      // ripple wave phase shift based on coordinates
      const phase = this.ox * 0.008 + this.oy * 0.012;
      targetX += Math.sin(time + phase) * 3.5;
      targetY += Math.cos(time * 0.8 + phase) * 3.5;
    }

    const springX = (targetX - this.x) * 0.055;
    const springY = (targetY - this.y) * 0.055;

    this.vx += springX;
    this.vy += springY;

    this.vx *= 0.83; // lighter friction for smoother bounce
    this.vy *= 0.83;

    this.x += this.vx;
    this.y += this.vy;
  }
}

const METRICS = [
  { v: "2", l: "Production systems shipped" },
  { v: "220+", l: "Rental units automated" },
  { v: "40+", l: "Hours saved every month" },
  { v: "100%", l: "Built for production" },
];

export const CinematicHero = () => {
  const [canvasRef, isInView] = useInView({ threshold: 0.01 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  // Preloader always plays in full now, so the hero entrance always waits for it.
  const delayBase = 2.5;

  useEffect(() => {
    // Entry elements reveal animations
    const ctx = gsap.context(() => {
      gsap.from(".hero-element", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: delayBase,
      });
    }, containerRef);

    // Canvas particle engine
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const initParticles = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCanvas.width = cssWidth;
      tempCanvas.height = cssHeight;

      // Draw the belief statement, dynamically scaled to fit width, across two lines
      const isMobile = cssWidth < 768;
      const lines = ["USEFUL OVER", "IMPRESSIVE"];
      let fontSize = Math.min(cssWidth * (isMobile ? 0.21 : 0.125), 190);
      tempCtx.font = `900 ${fontSize}px "Cabinet Grotesk", system-ui, sans-serif`;
      const maxWidth = cssWidth * 0.94;
      const widest = Math.max(...lines.map((line) => tempCtx.measureText(line).width));
      if (widest > maxWidth) {
        fontSize = fontSize * (maxWidth / widest);
      }

      // Also clamp by the canvas's actual height. Font size above was sized purely from
      // width, so on viewports where width >> height the two stacked lines were taller than
      // the canvas itself — that's what was clipping the top/bottom of the letters.
      const lineHeightRatio = 1.08;
      const maxFontSizeByHeight = (cssHeight / (lines.length * lineHeightRatio)) * 0.88;
      fontSize = Math.min(fontSize, maxFontSizeByHeight);
      tempCtx.font = `900 ${fontSize}px "Cabinet Grotesk", system-ui, sans-serif`;

      tempCtx.fillStyle = "#000000";
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";

      const lineHeight = fontSize * 1.08;
      const totalHeight = lineHeight * lines.length;
      const startY = tempCanvas.height / 2 - totalHeight / 2 + lineHeight / 2;

      lines.forEach((line, i) => {
        tempCtx.fillText(line, tempCanvas.width / 2, startY + i * lineHeight);
      });

      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imgData.data;
      const newParticles: Particle[] = [];

      // Theme-aware particle palette
      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? "#F5F1EA" : "#1A1A1A";
      const accentColor = "#C75B3A"; // Burnt Terracotta — consistent across themes
      const tertiaryColor = isDark ? "#C37B68" : "#8B5E3C";

      // Densities: mobile letters render smaller in absolute px, so they need a
      // finer (smaller) sampling step than desktop to stay legible, not a coarser one
      const step = isMobile ? 3 : 5;

      for (let y = 0; y < tempCanvas.height; y += step) {
        for (let x = 0; x < tempCanvas.width; x += step) {
          const index = (y * tempCanvas.width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            const rand = Math.random();
            let color = baseColor;
            if (rand > 0.88) {
              color = accentColor;
            } else if (rand > 0.8) {
              color = tertiaryColor;
            }

            const size = (isMobile ? 0.8 : 1.2) + Math.random() * 1.5;
            newParticles.push(new Particle(x, y, color, size));
          }
        }
      }
      particles.current = newParticles;
    };

    initParticles();

    // Re-build particles once the display font has actually loaded — measuring/drawing
    // text with a fallback font produces a mis-shaped, hard-to-read result on first paint
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    }

    // Loop
    let animId: number;
    let time = 0;
    const renderLoop = () => {
      // Pause computation if canvas is out of view
      if (!isInViewRef.current) {
        animId = requestAnimationFrame(renderLoop);
        return;
      }

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      const parts = particles.current;
      const len = parts.length;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const radius = canvas.clientWidth < 768 ? 95 : 155;

      for (let i = 0; i < len; i++) {
        const p = parts[i];
        p.update(mx, my, radius, time);

        canvasCtx.fillStyle = p.color;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        canvasCtx.fill();
      }

      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);

    // Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = e.touches[0].clientX - rect.left;
        mouse.current.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchend", handleMouseLeave, { passive: true });

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        initParticles();
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("themechange", initParticles);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("themechange", initParticles);
    };
  }, [delayBase]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-transparent">
      {/* Real DOM heading — canvas text is invisible to crawlers */}
      <h1 className="sr-only">
        Orvion.co — Product Engineers. Useful over impressive: we build software that solves real
        problems — from business automation to AI-powered platforms. Built NeuroDashboard, a
        multi-module AI platform, and Shade Ledger, a billing system running for 220 rental units.
      </h1>

      {/* Top identity bar */}
      <div className="relative z-10 px-6 sm:px-12 pt-28 pb-2 flex justify-between items-center text-xs tracking-[0.25em] font-mono text-muted-foreground uppercase hero-element">
        <div>Orvion.co — Product Engineers, India</div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] animate-pulse" />
          Open to new projects
        </div>
      </div>

      {/* Belief statement canvas */}
      <div className="relative h-[42vh] sm:h-[46vh] lg:h-[50vh] w-full">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 w-full h-full block pointer-events-none"
        />
      </div>

      {/* Identity / Value / CTA / Proof / Product Preview */}
      <div className="relative z-10 px-6 sm:px-12 pb-16 sm:pb-24 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 hero-element flex flex-col gap-6">
          <h2
            className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.15] tracking-normal text-foreground"
            style={{ textRendering: "optimizeLegibility" }}
          >
            Hi, we're <ScrambleText text="Saral x Jatin." delay={delayBase + 0.1} />
          </h2>

          <p className="font-sans text-lg sm:text-xl text-foreground/90 font-semibold max-w-xl">
            I build software that solves real problems.
          </p>

          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-xl">
            From business automation to AI-powered platforms — I design, build, and ship production
            systems that people actually use. Database to deployment, no shortcuts.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              to="/work"
              className="rounded-full bg-foreground text-background hover:bg-[var(--secondary)] hover:text-white px-7 py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors"
            >
              View Projects
            </Link>
            <a
              href="/Orivon_Team_Resume.pdf"
              download
              className="rounded-full border border-border hover:border-foreground px-7 py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors inline-flex items-center gap-2"
            >
              Resume <Download size={14} />
            </a>
          </div>

          {/* Proof metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl">
            {METRICS.map((m) => (
              <div key={m.l} className="border-l border-border pl-4">
                <div className="font-serif text-3xl sm:text-4xl text-[var(--brand-pink)] leading-none">
                  {m.v}
                </div>
                <div className="mt-2 text-xs text-muted-foreground font-mono leading-snug">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 hero-element">
          <ProductPreview />
        </div>
      </div>
    </div>
  );
};

function ProductPreview() {
  const activity = [
    { label: "Knowledge Hub indexed 312 documents", time: "2m ago" },
    { label: "Shade Ledger sent 18 invoices", time: "1h ago" },
    { label: "Workflow automation run completed", time: "3h ago" },
  ];

  return (
    <div className="hero-panel rounded-2xl border border-border overflow-hidden shadow-elegant">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-pink)]" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            NeuroDashboard
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1">
          Currently Building
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm text-muted-foreground mb-5">
          Welcome back, Saral. Here's what's running right now.
        </p>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-border p-3">
            <div className="font-serif text-xl sm:text-2xl text-foreground leading-none">
              12,543
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Docs indexed
            </div>
          </div>
          <div className="rounded-xl border border-border p-3">
            <div className="font-serif text-xl sm:text-2xl text-foreground leading-none">1,247</div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Queries / day
            </div>
          </div>
          <div className="rounded-xl border border-border p-3">
            <div className="font-serif text-xl sm:text-2xl text-[var(--brand-pink)] leading-none">
              99.6%
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Uptime
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border p-3 mb-6">
          <svg
            viewBox="0 0 300 80"
            className="w-full h-20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points="0,60 30,55 60,58 90,40 120,45 150,30 180,35 210,18 240,24 270,12 300,16"
              fill="none"
              stroke="var(--brand-pink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="0,60 30,55 60,58 90,40 120,45 150,30 180,35 210,18 240,24 270,12 300,16 300,80 0,80"
              fill="var(--brand-pink)"
              opacity="0.08"
              stroke="none"
            />
          </svg>
        </div>

        {/* Activity */}
        <div className="flex flex-col gap-2.5">
          {activity.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-xs gap-4 border-b border-border/60 pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-foreground/80">{item.label}</span>
              <span className="text-muted-foreground font-mono shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
