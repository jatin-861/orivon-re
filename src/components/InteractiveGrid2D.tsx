import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";

interface GridNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

export function InteractiveGrid2D() {
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
    let gridNodes: GridNode[][] = [];
    const spacing = 60; // Space between grid lines in pixels (increased from 45 to 60 to reduce node count)

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      init();
    };

    const init = () => {
      gridNodes = [];
      const w = canvas.width;
      const h = canvas.height;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        gridNodes[c] = [];
        for (let r = 0; r < rows; r++) {
          const bx = c * spacing;
          const by = r * spacing;
          gridNodes[c][r] = {
            x: bx,
            y: by,
            baseX: bx,
            baseY: by,
            vx: 0,
            vy: 0,
          };
        }
      }
    };

    const animate = () => {
      if (!isInViewRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = gridNodes.length;
      if (cols === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      const rows = gridNodes[0].length;
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      const limit = 160;

      // Update positions
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const n = gridNodes[c][r];

          // Spring physics back to base position
          const springX = (n.baseX - n.x) * 0.04;
          const springY = (n.baseY - n.y) * 0.04;

          n.vx += springX;
          n.vy += springY;

          // Mouse warp repulsion
          if (mouse.current.active) {
            const dx = n.x - mouseX;
            const dy = n.y - mouseY;
            const dist = Math.hypot(dx, dy);

            if (dist < limit) {
              const force = (limit - dist) / limit;
              const angle = Math.atan2(dy, dx);
              // Displace node outwards
              n.vx += Math.cos(angle) * force * 1.5;
              n.vy += Math.sin(angle) * force * 1.5;
            }
          }

          // Friction dampening
          n.vx *= 0.84;
          n.vy *= 0.84;

          n.x += n.vx;
          n.y += n.vy;
        }
      }

      // Draw Grid Lines (Columns) - Batched into a single stroke call
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const n = gridNodes[c][r];
          if (r === 0) {
            ctx.moveTo(n.x, n.y);
          } else {
            ctx.lineTo(n.x, n.y);
          }
        }
      }
      ctx.stroke();

      // Draw Grid Lines (Rows) - Batched into a single stroke call
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n = gridNodes[c][r];
          if (c === 0) {
            ctx.moveTo(n.x, n.y);
          } else {
            ctx.lineTo(n.x, n.y);
          }
        }
      }
      ctx.stroke();

      // Draw Grid Intersection Nodes - Batched into a single fill call
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const n = gridNodes[c][r];
          ctx.moveTo(n.x, n.y);
          ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2);
        }
      }
      ctx.fill();

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

export default InteractiveGrid2D;
