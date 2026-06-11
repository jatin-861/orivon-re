import { useEffect, useRef } from "react";

interface TechNode {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glowColor: string;
}

const TECH_LABELS = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "GSAP",
  "Tailwind",
  "Framer",
  "Vite",
  "Prisma",
  "GraphQL",
  "Docker",
  "Git",
];

export function InteractiveTechStack2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let nodes: TechNode[] = [];

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 300;
      init();
    };

    const init = () => {
      nodes = [];
      const w = canvas.width;
      const h = canvas.height;

      TECH_LABELS.forEach((label, i) => {
        // Calculate appropriate radius based on text length
        const radius = label.length * 4.2 + 20;

        // Spawn slightly offset from center to cluster together naturally
        const angle = (i / TECH_LABELS.length) * Math.PI * 2;
        const dist = Math.random() * 60 + 20;
        const x = w / 2 + Math.cos(angle) * dist;
        const y = h / 2 + Math.sin(angle) * dist;

        // Alternate neon colors from our theme
        const glowColor = i % 2 === 0 ? "rgba(111, 255, 233, " : "rgba(91, 192, 190, ";

        nodes.push({
          label,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius,
          glowColor,
        });
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;

      // 1. Gravity pull to center & mouse repulsion
      nodes.forEach((n) => {
        // Soft gravity pull to center
        n.vx -= (n.x - centerX) * 0.00065;
        n.vy -= (n.y - centerY) * 0.00065;

        // Mouse repulsion
        if (mouse.current.active) {
          const dx = n.x - mouseX;
          const dy = n.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const limit = 110;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            const push = force * 1.5;
            n.vx += Math.cos(angle) * push;
            n.vy += Math.sin(angle) * push;
          }
        }

        // Ambient random drift
        n.vx += (Math.random() - 0.5) * 0.02;
        n.vy += (Math.random() - 0.5) * 0.02;
      });

      // 2. Circle-to-circle elastic collision resolution
      const count = nodes.length;
      for (let i = 0; i < count; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < count; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = n1.radius + n2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / (dist || 0.01);
            const ny = dy / (dist || 0.01);

            // Displace nodes to resolve overlap
            n1.x -= nx * overlap * 0.5;
            n1.y -= ny * overlap * 0.5;
            n2.x += nx * overlap * 0.5;
            n2.y += ny * overlap * 0.5;

            // Reflect velocities
            const bounce = 0.35;
            n1.vx -= nx * overlap * bounce;
            n1.vy -= ny * overlap * bounce;
            n2.vx += nx * overlap * bounce;
            n2.vy += ny * overlap * bounce;
          }
        }
      }

      // 3. Update coordinates, apply boundary walls & render nodes
      nodes.forEach((n, idx) => {
        // Friction dampening
        n.vx *= 0.88;
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;

        // Keep inside canvas bounds
        if (n.x - n.radius < 0) {
          n.x = n.radius;
          n.vx *= -0.5;
        }
        if (n.x + n.radius > w) {
          n.x = w - n.radius;
          n.vx *= -0.5;
        }
        if (n.y - n.radius < 0) {
          n.y = n.radius;
          n.vy *= -0.5;
        }
        if (n.y + n.radius > h) {
          n.y = h - n.radius;
          n.vy *= -0.5;
        }

        // Draw Glassmorphic Badge container
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        // Background fill matching theme indigo cards
        ctx.fillStyle = "rgba(28, 37, 65, 0.75)";
        ctx.fill();

        // Outline glow
        ctx.strokeStyle = `${n.glowColor}0.45)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Label text render
        ctx.fillStyle = idx % 2 === 0 ? "#6fffe9" : "#5bc0be"; // Cyan/Teal
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y);
      });

      animationFrameId = requestAnimationFrame(animate);
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

export default InteractiveTechStack2D;
