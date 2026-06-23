"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

// Plain Canvas2D wave-of-dots ambient background — visually equivalent to the
// previous three.js/WebGL version but without pulling in the three.js bundle
// for what's just a subtle decorative effect rendered on every desktop page.
export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SEPARATION = 34;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const FRAME_INTERVAL = 1000 / 30; // cap to 30fps — ambient effect doesn't need 60

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / SEPARATION) + 1;
      rows = Math.ceil(height / SEPARATION) + 1;
    };
    resize();

    let animId = 0;
    let isPageFocused = true;
    let isScrolledDeep = false;
    let isScrolling = false;
    let scrollIdleTimeout = 0;
    let time = 0;
    let lastDraw = 0;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);

      // Freeze the wave while the user is actively scrolling so the per-frame
      // canvas work doesn't compete with Lenis for the main thread (the #1 cause
      // of scroll stutter here). Also skip when off-screen / backgrounded.
      if (!isPageFocused || isScrolledDeep || isScrolling) return;
      if (now - lastDraw < FRAME_INTERVAL) return;
      lastDraw = now;

      time += 0.012 * (1000 / 30 / FRAME_INTERVAL); // keep motion speed frame-rate independent
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#C75B3A";

      for (let ix = 0; ix < cols; ix++) {
        for (let iy = 0; iy < rows; iy++) {
          const x = ix * SEPARATION;
          const baseY = iy * SEPARATION;
          const wave =
            Math.sin(x * 0.012 + time * 0.8) * 6 + Math.cos(baseY * 0.018 + time * 0.6) * 5;
          const y = baseY + wave;

          ctx.globalAlpha = 0.16 + 0.06 * Math.sin(x * 0.01 + baseY * 0.01 + time);
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const handleScroll = () => {
      isScrolledDeep = window.scrollY > window.innerHeight * 1.2;
      isScrolling = true;
      clearTimeout(scrollIdleTimeout);
      scrollIdleTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 140);
    };
    const handleFocus = () => {
      isPageFocused = true;
    };
    const handleBlur = () => {
      isPageFocused = false;
    };
    const handleVisibility = () => {
      isPageFocused = document.visibilityState === "visible";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimeout);
      clearTimeout(scrollIdleTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 -z-10 bg-transparent overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

export default DottedSurface;
