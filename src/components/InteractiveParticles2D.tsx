import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export function InteractiveParticles2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    const count = 120;
    const colors = ["rgba(199, 91, 58, ", "rgba(26, 26, 26, ", "rgba(75, 110, 106, "];

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < count; i++) {
        const rx = Math.random() * w;
        const ry = Math.random() * h;
        particles.push({
          x: rx,
          y: ry,
          baseX: rx,
          baseY: ry,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;

      // Update and Draw Particles
      particles.forEach((p) => {
        // Slow float
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse interaction (repulsion)
        if (mouse.current.active) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const limit = 120;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3;
            p.y += Math.sin(angle) * force * 3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      // Draw Constellation Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.hypot(dx, dy);
          const connectDist = 95;

          if (dist < connectDist) {
            const alphaVal = (1 - dist / connectDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(26, 26, 26, ${alphaVal})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // Respect prefers-reduced-motion: render one static frame and stop looping
      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block bg-transparent" />;
}

export default InteractiveParticles2D;
