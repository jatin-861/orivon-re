import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";

interface BlobPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  baseRadius: number;
}

export function InteractiveBlob2D() {
  const [canvasRef, isInView] = useInView({ threshold: 0.01 });
  const mouse = useRef({ x: -1000, y: -1000, active: false });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let points: BlobPoint[] = [];
    const numPoints = 12;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 450;
      init();
    };

    const init = () => {
      points = [];
      const w = canvas.width;
      const h = canvas.height;
      const baseRadius = Math.min(w, h) * 0.28;

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const x = w / 2 + Math.cos(angle) * baseRadius;
        const y = h / 2 + Math.sin(angle) * baseRadius;
        points.push({
          x,
          y,
          vx: 0,
          vy: 0,
          angle,
          baseRadius,
        });
      }
    };

    const animate = () => {
      if (!isInViewRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      time += 0.025;

      // Update Point Positions
      points.forEach((p, i) => {
        // Natural trigonometric morphing
        const offset =
          Math.sin(time + i * 1.5) * (p.baseRadius * 0.12) +
          Math.cos(time * 0.5 + i * 2.2) * (p.baseRadius * 0.06);
        const currentRadius = p.baseRadius + offset;

        const targetX = centerX + Math.cos(p.angle) * currentRadius;
        const targetY = centerY + Math.sin(p.angle) * currentRadius;

        // Mouse repulsion
        if (mouse.current.active) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const limit = 150;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angleToMouse = Math.atan2(dy, dx);
            const push = force * 8;
            p.vx += Math.cos(angleToMouse) * push;
            p.vy += Math.sin(angleToMouse) * push;
          }
        }

        // Spring physics pulling back to target path
        p.vx += (targetX - p.x) * 0.04;
        p.vy += (targetY - p.y) * 0.04;

        // Friction/dampening
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;
      });

      // Draw morphing blob using quadratic curves
      if (points.length > 0) {
        ctx.beginPath();
        let xc = (points[0].x + points[points.length - 1].x) / 2;
        let yc = (points[0].y + points[points.length - 1].y) / 2;
        ctx.moveTo(xc, yc);

        for (let i = 0; i < points.length; i++) {
          const next = points[(i + 1) % points.length];
          xc = (points[i].x + next.x) / 2;
          yc = (points[i].y + next.y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.closePath();

        // Styled radial theme gradient fill
        const gradient = ctx.createRadialGradient(
          centerX - 10,
          centerY - 10,
          points[0].baseRadius * 0.2,
          centerX,
          centerY,
          points[0].baseRadius * 1.5,
        );
        gradient.addColorStop(0, "rgba(199, 91, 58, 0.85)"); // Terracotta
        gradient.addColorStop(0.4, "rgba(139, 94, 60, 0.7)"); // Amber
        gradient.addColorStop(1, "rgba(26, 26, 26, 0)"); // Charcoal transparent

        ctx.fillStyle = gradient;
        ctx.fill();

        // Glowing outer border
        ctx.strokeStyle = "rgba(199, 91, 58, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Dynamic center core
        ctx.beginPath();
        ctx.arc(
          centerX + Math.sin(time) * 5,
          centerY + Math.cos(time) * 5,
          points[0].baseRadius * 0.08,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(199, 91, 58, 0.2)";
        ctx.fill();
      }

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

export default InteractiveBlob2D;
