import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "./Button";
import { AnimatedTitle } from "./AnimatedTitle";
import { useInView } from "@/hooks/useInView";

export const StoryTeller = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [canvasRef, isInView] = useInView({ threshold: 0.01 });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    
    window.addEventListener("resize", handleResize);

    // Particles/Nodes for flow field
    const points: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const numPoints = 25;
    const colors = ["#C75B3A", "#FAF7F2", "#8B5E3C", "#E5DDD3"];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: colors[i % colors.length],
      });
    }

    let angle = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const trackMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
      mouseY = (e.clientY - rect.top) * window.devicePixelRatio;
    };
    canvas.addEventListener("mousemove", trackMouse);

    const render = () => {
      if (!isInViewRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      ctx.fillStyle = "#1A1A1A"; // Brand charcoal
      ctx.fillRect(0, 0, width, height);

      // Draw background abstract mesh
      ctx.strokeStyle = "rgba(240, 234, 224, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw concentric rings in center
      const centerX = width / 2;
      const centerY = height / 2;
      angle += 0.003;

      // Outer Ring
      ctx.strokeStyle = "rgba(199, 91, 58, 0.15)"; // Terracotta
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Outer dashed Ring
      ctx.strokeStyle = "rgba(240, 234, 224, 0.1)";
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.38, angle, angle + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Middle Ring with ticks
      const midRadius = Math.min(width, height) * 0.28;
      ctx.strokeStyle = "rgba(199, 91, 58, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw tick marks
      const numTicks = 60;
      for (let i = 0; i < numTicks; i++) {
        const tickAngle = (i * Math.PI * 2) / numTicks + angle * 0.5;
        const x1 = centerX + Math.cos(tickAngle) * midRadius;
        const y1 = centerY + Math.sin(tickAngle) * midRadius;
        const x2 = centerX + Math.cos(tickAngle) * (midRadius - 6);
        const y2 = centerY + Math.sin(tickAngle) * (midRadius - 6);
        
        ctx.strokeStyle = i % 5 === 0 ? "rgba(199, 91, 58, 0.5)" : "rgba(240, 234, 224, 0.15)";
        ctx.lineWidth = i % 5 === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Inner morphing shape (Tactile Geometry)
      ctx.strokeStyle = "rgba(199, 91, 58, 0.6)";
      ctx.fillStyle = "rgba(199, 91, 58, 0.05)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const numPointsMorph = 8;
      const morphRadius = Math.min(width, height) * 0.15;
      for (let i = 0; i <= numPointsMorph; i++) {
        const morphAngle = (i * Math.PI * 2) / numPointsMorph;
        // Introduce wave displacement using sine/cosine waves and mouse distance influence
        const distToMouse = Math.hypot(
          centerX + Math.cos(morphAngle) * morphRadius - mouseX,
          centerY + Math.sin(morphAngle) * morphRadius - mouseY
        );
        const mouseInfluence = Math.max(0, 1 - distToMouse / 250) * 15;
        
        const noise = Math.sin(angle * 4 + i * 2) * 8 + Math.cos(angle * 2 - i) * 4 + mouseInfluence;
        const r = morphRadius + noise;
        const x = centerX + Math.cos(morphAngle) * r;
        const y = centerY + Math.sin(morphAngle) * r;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Flowing waveforms passing through (sine waves) - optimized step size to 3 for massive speedup
      ctx.strokeStyle = "rgba(139, 94, 60, 0.2)"; // Brand warm brown
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 3) {
        const y = centerY + Math.sin(x * 0.005 + angle * 3) * 30 + Math.cos(x * 0.002 - angle) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(199, 91, 58, 0.12)"; // Terracotta
      ctx.beginPath();
      for (let x = 0; x < width; x += 3) {
        const y = centerY + Math.sin(x * 0.004 - angle * 2) * 45 + Math.cos(x * 0.003 + angle * 1.5) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Update and draw floating nodes
      points.forEach((p, index) => {
        // Slowly move points
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nodes when close
        for (let j = index + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(240, 234, 224, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse when close
        const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (mouseDist < 180) {
          ctx.strokeStyle = `rgba(199, 91, 58, ${0.25 * (1 - mouseDist / 180)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", trackMouse);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -12;
    const rotateY = ((xPos - centerX) / centerX) * 12;

    gsap.to(element, {
      duration: 0.35,
      rotateX,
      rotateY,
      transformPerspective: 800,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.4,
        rotateX: 0,
        rotateY: 0,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="story"
      className="min-h-[100dvh] w-full bg-transparent text-foreground relative py-20 overflow-hidden"
    >
      <div className="flex w-full flex-col items-center pb-24 relative z-10">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary">
          THE CORE BELIEF
        </p>

        <div className="relative w-full h-full">
          <AnimatedTitle
            title="if it doesn't run <br /> in production"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-20"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <div
                  ref={frameRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  onMouseEnter={handleMouseLeave}
                  className="w-full h-full max-h-[75vh] md:max-h-[85vh] aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-[#1A1A1A] relative shadow-2xl cursor-crosshair"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase select-none">
                    Production System // Log. 01
                  </div>
                </div>
              </div>
            </div>

            {/* SVG mask gooey filter */}
            <svg className="invisible absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="-mt-80 sm:-mt-60 md:-mt-48 flex w-full justify-center md:me-44 md:justify-end relative z-20">
          <div className="flex h-full w-fit flex-col items-center md:items-start px-6">
            <p className="mt-3 max-w-sm text-center font-sans text-muted-foreground text-sm sm:text-base md:text-start leading-relaxed">
              Most software stays a prototype. The systems here are different — they're live, in
              use, and solving real problems for real people, today.
            </p>

            <Button
              id="realm-btn"
              title="see what's running"
              containerClass="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryTeller;
