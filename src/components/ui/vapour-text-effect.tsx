"use client";

import { useRef, useEffect, useState, createElement, useMemo, useCallback, memo } from "react";

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

type VaporizeTextCycleProps = {
  texts: string[];
  font?: { fontFamily?: string; fontSize?: string; fontWeight?: number };
  color?: string;
  spread?: number;
  density?: number;
  animation?: { vaporizeDuration?: number; fadeInDuration?: number; waitDuration?: number };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
};

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  shouldFadeQuickly?: boolean;
};

declare global {
  interface HTMLCanvasElement {
    textBoundaries?: { left: number; right: number; width: number };
  }
}

function transformValue(input: number, inputRange: number[], outputRange: number[], clamp = false) {
  const [a, b] = inputRange;
  const [c, d] = outputRange;
  const p = (input - a) / (b - a);
  let r = c + p * (d - c);
  if (clamp) {
    if (d > c) r = Math.min(Math.max(r, c), d);
    else r = Math.min(Math.max(r, d), c);
  }
  return r;
}

function calculateVaporizeSpread(fontSize: number) {
  const points = [
    { size: 20, spread: 0.2 },
    { size: 50, spread: 0.5 },
    { size: 100, spread: 1.5 },
  ];
  if (fontSize <= points[0].size) return points[0].spread;
  if (fontSize >= points[points.length - 1].size) return points[points.length - 1].spread;
  let i = 0;
  while (i < points.length - 1 && points[i + 1].size < fontSize) i++;
  const p1 = points[i];
  const p2 = points[i + 1];
  return p1.spread + ((fontSize - p1.size) * (p2.spread - p1.spread)) / (p2.size - p1.size);
}

function parseColor(color: string) {
  const rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (rgba) return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${rgba[4]})`;
  const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, 1)`;
  return color;
}

function useIsInView(ref: React.RefObject<HTMLElement>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => setV(e.isIntersecting), {
      threshold: 0,
      rootMargin: "50px",
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return v;
}

const SeoElement = memo(({ tag = Tag.P, texts }: { tag: Tag; texts: string[] }) => {
  const style = useMemo(
    () => ({
      position: "absolute" as const,
      width: "0",
      height: "0",
      overflow: "hidden",
      userSelect: "none" as const,
      pointerEvents: "none" as const,
    }),
    [],
  );
  const safeTag = Object.values(Tag).includes(tag) ? tag : "p";
  return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});
SeoElement.displayName = "SeoElement";

function createParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  textX: number,
  textY: number,
  font: string,
  color: string,
  alignment: "left" | "center" | "right",
) {
  const particles: Particle[] = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  let textLeft = textX;
  if (alignment === "center") textLeft = textX - textWidth / 2;
  else if (alignment === "right") textLeft = textX - textWidth;
  const textBoundaries = { left: textLeft, right: textLeft + textWidth, width: textWidth };
  ctx.fillText(text, textX, textY);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const currentDPR = canvas.width / parseInt(canvas.style.width);
  const sampleRate = Math.max(1, Math.round(currentDPR / 3));
  for (let y = 0; y < canvas.height; y += sampleRate) {
    for (let x = 0; x < canvas.width; x += sampleRate) {
      const i = (y * canvas.width + x) * 4;
      const a = data[i + 3];
      if (a > 0) {
        const oa = (a / 255) * (sampleRate / currentDPR);
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          color: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${oa})`,
          opacity: oa,
          originalAlpha: oa,
          velocityX: 0,
          velocityY: 0,
          angle: 0,
          speed: 0,
        });
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return { particles, textBoundaries };
}

function updateParticles(
  particles: Particle[],
  vaporizeX: number,
  deltaTime: number,
  spread: number,
  duration: number,
  direction: string,
  density: number,
) {
  let allDone = true;
  particles.forEach((p) => {
    const should =
      direction === "left-to-right" ? p.originalX <= vaporizeX : p.originalX >= vaporizeX;
    if (should) {
      if (p.speed === 0) {
        p.angle = Math.random() * Math.PI * 2;
        p.speed = (Math.random() * 1 + 0.5) * spread;
        p.velocityX = Math.cos(p.angle) * p.speed;
        p.velocityY = Math.sin(p.angle) * p.speed;
        p.shouldFadeQuickly = Math.random() > density;
      }
      if (p.shouldFadeQuickly) {
        p.opacity = Math.max(0, p.opacity - deltaTime);
      } else {
        const dx = p.originalX - p.x;
        const dy = p.originalY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const damp = Math.max(0.95, 1 - dist / (100 * spread));
        const rs = spread * 3;
        const sx = (Math.random() - 0.5) * rs;
        const sy = (Math.random() - 0.5) * rs;
        p.velocityX = (p.velocityX + sx + dx * 0.002) * damp;
        p.velocityY = (p.velocityY + sy + dy * 0.002) * damp;
        const max = spread * 2;
        const cur = Math.sqrt(p.velocityX ** 2 + p.velocityY ** 2);
        if (cur > max) {
          const s = max / cur;
          p.velocityX *= s;
          p.velocityY *= s;
        }
        p.x += p.velocityX * deltaTime * 20;
        p.y += p.velocityY * deltaTime * 10;
        const fade = 0.25 * (2000 / duration);
        p.opacity = Math.max(0, p.opacity - deltaTime * fade);
      }
      if (p.opacity > 0.01) allDone = false;
    } else {
      allDone = false;
    }
  });
  return allDone;
}

function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], dpr: number) {
  ctx.save();
  ctx.scale(dpr, dpr);
  particles.forEach((p) => {
    if (p.opacity > 0) {
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
      ctx.fillRect(p.x / dpr, p.y / dpr, 1, 1);
    }
  });
  ctx.restore();
}

function resetParticles(particles: Particle[]) {
  particles.forEach((p) => {
    p.x = p.originalX;
    p.y = p.originalY;
    p.opacity = p.originalAlpha;
    p.speed = 0;
    p.velocityX = 0;
    p.velocityY = 0;
  });
}

function renderCanvas(opts: {
  framerProps: VaporizeTextCycleProps;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  wrapperSize: { width: number; height: number };
  particlesRef: React.MutableRefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
}) {
  const { framerProps, canvasRef, wrapperSize, particlesRef, globalDpr, currentTextIndex } = opts;
  const canvas = canvasRef.current;
  if (!canvas || !wrapperSize.width || !wrapperSize.height) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = wrapperSize;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * globalDpr);
  canvas.height = Math.floor(height * globalDpr);
  const fontSize = parseInt(framerProps.font?.fontSize?.replace("px", "") || "50");
  const font = `${framerProps.font?.fontWeight ?? 400} ${fontSize * globalDpr}px ${framerProps.font?.fontFamily ?? "sans-serif"}`;
  const color = parseColor(framerProps.color ?? "rgb(34, 211, 238)");
  const textY = canvas.height / 2;
  const text = framerProps.texts[currentTextIndex] || "";
  const align = framerProps.alignment || "center";
  const textX = align === "center" ? canvas.width / 2 : align === "left" ? 0 : canvas.width;
  const { particles, textBoundaries } = createParticles(
    ctx,
    canvas,
    text,
    textX,
    textY,
    font,
    color,
    align,
  );
  particlesRef.current = particles;
  canvas.textBoundaries = textBoundaries;
}

export default function VaporizeTextCycle({
  texts = ["Hello", "World"],
  font = { fontFamily: "Space Grotesk, sans-serif", fontSize: "80px", fontWeight: 700 },
  color = "rgb(255,255,255)",
  spread = 5,
  density = 5,
  animation = { vaporizeDuration: 2, fadeInDuration: 1, waitDuration: 0.5 },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useIsInView(wrapperRef as React.RefObject<HTMLElement>);
  const particlesRef = useRef<Particle[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState<
    "static" | "vaporizing" | "fadingIn" | "waiting"
  >("static");
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);

  const globalDpr = useMemo(
    () => (typeof window !== "undefined" ? window.devicePixelRatio * 1.5 || 1 : 1),
    [],
  );

  const fontConfig = useMemo(() => {
    const fontSize = parseInt(font.fontSize?.replace("px", "") || "50");
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize) * spread;
    return { fontSize, VAPORIZE_SPREAD };
  }, [font.fontSize, spread]);

  const animationDurations = useMemo(
    () => ({
      VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
      FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
      WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
    }),
    [animation.vaporizeDuration, animation.fadeInDuration, animation.waitDuration],
  );

  const memoizedUpdate = useCallback(
    (particles: Particle[], vaporizeX: number, dt: number) =>
      updateParticles(
        particles,
        vaporizeX,
        dt,
        fontConfig.VAPORIZE_SPREAD,
        animationDurations.VAPORIZE_DURATION,
        direction,
        transformedDensity,
      ),
    [
      fontConfig.VAPORIZE_SPREAD,
      animationDurations.VAPORIZE_DURATION,
      direction,
      transformedDensity,
    ],
  );

  const memoizedRender = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) =>
      renderParticles(ctx, particles, globalDpr),
    [globalDpr],
  );

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setAnimationState("vaporizing"), 0);
      return () => clearTimeout(t);
    }
    setAnimationState("static");
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    let last = performance.now();
    let id: number;
    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !particlesRef.current.length) {
        id = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      switch (animationState) {
        case "static":
          memoizedRender(ctx, particlesRef.current);
          break;
        case "vaporizing": {
          vaporizeProgressRef.current += (dt * 100) / (animationDurations.VAPORIZE_DURATION / 1000);
          const tb = canvas.textBoundaries;
          if (!tb) break;
          const progress = Math.min(100, vaporizeProgressRef.current);
          const vx =
            direction === "left-to-right"
              ? tb.left + (tb.width * progress) / 100
              : tb.right - (tb.width * progress) / 100;
          const done = memoizedUpdate(particlesRef.current, vx, dt);
          memoizedRender(ctx, particlesRef.current);
          if (vaporizeProgressRef.current >= 100 && done) {
            setCurrentTextIndex((p) => (p + 1) % texts.length);
            setAnimationState("fadingIn");
            fadeOpacityRef.current = 0;
          }
          break;
        }
        case "fadingIn": {
          fadeOpacityRef.current += (dt * 1000) / animationDurations.FADE_IN_DURATION;
          ctx.save();
          ctx.scale(globalDpr, globalDpr);
          particlesRef.current.forEach((p) => {
            p.x = p.originalX;
            p.y = p.originalY;
            const op = Math.min(fadeOpacityRef.current, 1) * p.originalAlpha;
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${op})`);
            ctx.fillRect(p.x / globalDpr, p.y / globalDpr, 1, 1);
          });
          ctx.restore();
          if (fadeOpacityRef.current >= 1) {
            setAnimationState("waiting");
            setTimeout(() => {
              setAnimationState("vaporizing");
              vaporizeProgressRef.current = 0;
              resetParticles(particlesRef.current);
            }, animationDurations.WAIT_DURATION);
          }
          break;
        }
        case "waiting":
          memoizedRender(ctx, particlesRef.current);
          break;
      }
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [
    animationState,
    isInView,
    texts.length,
    direction,
    globalDpr,
    memoizedUpdate,
    memoizedRender,
    animationDurations,
  ]);

  useEffect(() => {
    renderCanvas({
      framerProps: { texts, font, color, alignment },
      canvasRef,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
    });
  }, [texts, font, color, alignment, wrapperSize, currentTextIndex, globalDpr]);

  useEffect(() => {
    const c = wrapperRef.current;
    if (!c) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        setWrapperSize({ width, height });
      }
    });
    ro.observe(c);
    const r = c.getBoundingClientRect();
    setWrapperSize({ width: r.width, height: r.height });
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
      <SeoElement tag={tag} texts={texts} />
      <canvas
        ref={canvasRef}
        style={{ minWidth: "30px", minHeight: "20px", pointerEvents: "none" }}
      />
    </div>
  );
}

export { VaporizeTextCycle };
