import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

export function FittsSimulator() {
  const [isStart, setIsStart] = useState(true);
  const [stats, setStats] = useState({
    distance: null as number | null,
    size: null as number | null,
    time: null as number | string | null,
  });

  const [targetStyle, setTargetStyle] = useState<React.CSSProperties>({
    width: "64px",
    height: "64px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  });

  const areaRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const area = areaRef.current;
    if (!area) return;

    const areaRect = area.getBoundingClientRect();
    const clickTime = performance.now();

    if (isStart) {
      // Begin trial
      setIsStart(false);
      startTimeRef.current = clickTime;

      // Capture starting position (current center of target relative to area container)
      const targetRect = e.currentTarget.getBoundingClientRect();
      startPosRef.current = {
        x: targetRect.left + targetRect.width / 2 - areaRect.left,
        y: targetRect.top + targetRect.height / 2 - areaRect.top,
      };

      // Random sizes (32px, 52px, 72px) and random jumps
      const sizes = [32, 52, 72];
      const targetSize = sizes[Math.floor(Math.random() * sizes.length)];
      const padding = targetSize + 15;

      const randomX = Math.random() * (areaRect.width - padding * 2) + padding;
      const randomY = Math.random() * (areaRect.height - padding * 2) + padding;

      setTargetStyle({
        width: `${targetSize}px`,
        height: `${targetSize}px`,
        left: `${randomX}px`,
        top: `${randomY}px`,
        transform: "translate(-50%, -50%)",
      });

      setStats({
        distance: null,
        size: null,
        time: "Timer Active...",
      });
    } else {
      // Completed click!
      const duration = Math.round(clickTime - startTimeRef.current);
      const targetRect = e.currentTarget.getBoundingClientRect();
      const endX = targetRect.left + targetRect.width / 2 - areaRect.left;
      const endY = targetRect.top + targetRect.height / 2 - areaRect.top;

      // Calculate absolute distance
      const dx = endX - startPosRef.current.x;
      const dy = endY - startPosRef.current.y;
      const distance = Math.round(Math.sqrt(dx * dx + dy * dy));

      setStats({
        distance,
        size: Math.round(targetRect.width),
        time: duration,
      });

      // Reset targets back to start state
      setIsStart(true);
      setTargetStyle({
        width: "64px",
        height: "64px",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
      <div>
        <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
          <Sparkles size={12} /> UX Theorem // Fitts's Law
        </span>
        <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
          Fitts's Law Simulator
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          The time to acquire a target is a function of target distance (D) and size (W).
        </p>
      </div>

      {/* Boundary Game Board */}
      <div
        ref={areaRef}
        className="relative h-60 w-full rounded-xl bg-muted/40 border border-border/70 overflow-hidden cursor-crosshair"
      >
        <div
          onClick={handleTargetClick}
          style={targetStyle}
          className={`absolute flex items-center justify-center rounded-full font-mono text-[9px] font-bold tracking-wider select-none transition-all duration-300 shadow-sm cursor-pointer z-10 ${
            isStart
              ? "bg-foreground text-background"
              : "bg-[var(--brand-pink)] text-white shadow-glow-cyan"
          }`}
        >
          {isStart ? "START" : "HIT ME"}
        </div>
      </div>

      {/* Live HUD stats */}
      <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-[10px] font-mono text-muted-foreground">
        <div className="flex flex-col gap-0.5">
          <span>Distance (D)</span>
          <strong className="text-sm text-foreground">{stats.distance ?? "-"} px</strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span>Target Size (W)</span>
          <strong className="text-sm text-foreground">{stats.size ?? "-"} px</strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span>Acquire Time</span>
          <strong className="text-sm text-[var(--brand-pink)]">
            {typeof stats.time === "number" ? `${stats.time} ms` : (stats.time ?? "-")}
          </strong>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
        Clicking start triggers a trial. Re-acquiring target calculations proves why CTAs should be
        larger and closer to natural interactive centers.
      </p>
    </div>
  );
}
