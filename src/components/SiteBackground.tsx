import { useEffect, useRef } from "react";
import { DottedSurface } from "./ui/dotted-surface";

/**
 * Lightweight, GPU-composited animated mesh gradient background.
 * Replaces the 30fps canvas rendering loop with hardware-accelerated
 * CSS transforms and filter blur layers.
 */
export function SiteBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only track cursor on desktop/hoverable devices to minimize overhead
    if (window.innerWidth < 768) return;

    const container = containerRef.current;
    if (!container) return;

    const onPointerMove = (e: PointerEvent) => {
      // Direct CSS custom property updates for GPU-composited cursor translation
      container.style.setProperty("--mouse-x", `${e.clientX}px`);
      container.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50 dark:opacity-40"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "50vh",
        } as React.CSSProperties
      }
    >
      {/* 3D Global Dotted Surface Wave Background */}
      <DottedSurface className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Interactive cursor blob */}
      <div
        className="absolute w-[45vw] h-[45vw] rounded-full bg-[var(--brand-pink)] filter blur-[150px] opacity-15 z-0"
        style={{
          left: "var(--mouse-x)",
          top: "var(--mouse-y)",
          transform: "translate3d(-50%, -50%, 0)",
          transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: "transform",
        }}
      />

      {/* Floating ambient blobs */}
      <div
        className="absolute w-[40vw] h-[40vw] rounded-full bg-[var(--brand-teal)] filter blur-[130px] opacity-15 animate-[aurora-drift-1_25s_ease-in-out_infinite]"
        style={{
          right: "15%",
          top: "10%",
          willChange: "transform",
        }}
      />

      <div
        className="absolute w-[35vw] h-[35vw] rounded-full bg-[var(--brand-lavender)] filter blur-[140px] opacity-15 animate-[aurora-drift-2_30s_ease-in-out_infinite]"
        style={{
          left: "10%",
          bottom: "10%",
          willChange: "transform",
        }}
      />
    </div>
  );
}
