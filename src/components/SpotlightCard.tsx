import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  glowHue?: number; // 200 = cyan
}

export const SpotlightCard = ({ children, className = "", glowHue = 200 }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch viewports (pointer: coarse)
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    const sync = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", (e.clientX - rect.left).toFixed(2));
      el.style.setProperty("--y", (e.clientY - rect.top).toFixed(2));
    };

    el.addEventListener("pointermove", sync);
    return () => el.removeEventListener("pointermove", sync);
  }, []);

  const style: CSSProperties & Record<string, string | number> = {
    "--hue": glowHue,
    backgroundImage: `radial-gradient(400px circle at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue) 95% 70% / 0.18), transparent 60%)`,
  };

  return (
    <div
      ref={cardRef}
      style={style}
      className={cn(
        "relative rounded-2xl border border-border bg-card backdrop-blur-md transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-[radial-gradient(300px_circle_at_calc(var(--x,0)*1px)_calc(var(--y,0)*1px),hsl(var(--hue)_95%_70%/0.4),transparent_60%)] before:-z-0 before:[mask:linear-gradient(black,black)_content-box,linear-gradient(black,black)] before:[mask-composite:exclude]",
        "hover:border-primary/40",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
