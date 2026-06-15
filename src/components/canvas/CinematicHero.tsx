import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useInView } from "@/hooks/useInView";

gsap.registerPlugin(ScrollTrigger);

export function ScrambleText({ text, delay = 0.5 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let frameId: number;
    let timeoutId: number;
    
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
          .join("")
      );
      
      if (iteration < length) {
        iteration += 0.35; // smooth settle speed
        frameId = requestAnimationFrame(scramble);
      } else {
        setDisplayText(targetText);
      }
    };
    
    timeoutId = window.setTimeout(() => {
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

export const CinematicHero = () => {
  const [canvasRef, isInView] = useInView({ threshold: 0.01 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  const hasSeenPreloader =
    typeof window !== "undefined" && sessionStorage.getItem("orivon-preloader-seen");
  const delayBase = hasSeenPreloader ? 0.2 : 2.5;

  useEffect(() => {
    // GSAP ScrollTrigger for clipping frame
    const ctx = gsap.context(() => {
      gsap.set("#hero-frame", {
        clipPath: "polygon(10% 0%, 90% 0%, 95% 85%, 5% 90%)",
        borderRadius: "0% 0% 20px 20px",
      });
      gsap.from("#hero-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#hero-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Entry elements reveal animations
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
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Draw large word "ORIVON" dynamically scaled
      const isMobile = canvas.width < 768;
      const fontSize = Math.min(canvas.width * 0.17, 240);
      tempCtx.font = `900 ${fontSize}px "Cabinet Grotesk", system-ui, sans-serif`;
      tempCtx.fillStyle = "#000000";
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";

      // Draw text centered (slightly higher on screen to leave space for bottom title)
      const textY = isMobile ? tempCanvas.height * 0.4 : tempCanvas.height * 0.45;
      tempCtx.fillText("ORIVON", tempCanvas.width / 2, textY);

      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imgData.data;
      const newParticles: Particle[] = [];

      // Densities: tighter on larger screens (optimized density from 4/5 to 5/7)
      const step = isMobile ? 7 : 5;

      for (let y = 0; y < tempCanvas.height; y += step) {
        for (let x = 0; x < tempCanvas.width; x += step) {
          const index = (y * tempCanvas.width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            const rand = Math.random();
            let color = "#1A1A1A"; // Charcoal base
            if (rand > 0.88) {
              color = "#C75B3A"; // Burnt Terracotta accent
            } else if (rand > 0.80) {
              color = "#8B5E3C"; // Warm Amber
            }

            const size = (isMobile ? 0.8 : 1.2) + Math.random() * 1.5;
            newParticles.push(new Particle(x, y, color, size));
          }
        }
      }
      particles.current = newParticles;
    };

    initParticles();

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
      const radius = canvas.width < 768 ? 95 : 155;

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

    return () => {
      ctx.revert();
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [delayBase]);

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-transparent">
      <div
        id="hero-frame"
        className="relative z-10 h-[100dvh] w-full overflow-hidden bg-transparent"
      >
        {/* Full Viewport Canvas for Particle Text */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 w-full h-full block pointer-events-none"
        />

        {/* Minimal grid lines in the background for structural feeling */}
        <div className="absolute inset-0 z-[1] grid grid-cols-12 gap-6 px-6 sm:px-12 pointer-events-none opacity-20">
          <div className="col-span-3 border-r border-border" />
          <div className="col-span-3 border-r border-border" />
          <div className="col-span-3 border-r border-border" />
          <div className="col-span-3" />
        </div>

        {/* Crisp Editorial Layout Text Overlays */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-12 pt-28">
          {/* Top Metadata */}
          <div className="flex justify-between items-center text-xs tracking-[0.25em] font-mono text-muted-foreground uppercase hero-element">
            <div>ORIVON Studio // India</div>
            <div className="hidden sm:block">Digital Design & Engineering</div>
          </div>

          {/* Bottom Layout Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7 hero-element">
              <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-tight text-foreground">
                <ScrambleText text="Tactile interactions," delay={delayBase + 0.1} /><br />
                <span className="text-[var(--secondary)]">
                  <ScrambleText text="editorial engineering." delay={delayBase + 0.35} />
                </span>
              </h2>
            </div>
            <div className="md:col-span-5 flex flex-col items-start gap-6 hero-element">
              <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-md">
                We are Jatin and Saral — a two-person studio design-engineering fast, bespoke digital products with absolute care and attention to detail.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/work"
                  className="rounded-full bg-foreground text-background hover:bg-[var(--secondary)] hover:text-white px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors"
                >
                  View Selected Work
                </Link>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground animate-[float_4s_ease-in-out_infinite]">
                  <span>Scroll</span>
                  <ArrowDown size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
