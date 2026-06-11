import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isClickedRef = useRef(false);
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);
  const cursorTextRef = useRef("");
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  // Handle high-DPI canvas resizing
  useEffect(() => {
    if (window.innerWidth < 768 || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.resetTransform();
          ctx.scale(dpr, dpr);
        }
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (window.innerWidth < 768 || prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setCursorOpacity = (opacity: number) => {
      if (dotRef.current) dotRef.current.style.opacity = String(opacity);
      if (ringRef.current) ringRef.current.style.opacity = String(opacity);
    };

    const getBrandColor = (isHovering: boolean) => {
      if (typeof window === "undefined") return "#e0537d";
      const rootStyle = getComputedStyle(document.documentElement);
      const varName = isHovering ? "--brand-teal" : "--brand-pink";
      return rootStyle.getPropertyValue(varName).trim() || (isHovering ? "#1e3535" : "#e0537d");
    };

    const createBurst = (x: number, y: number) => {
      const color = getBrandColor(isHoveringRef.current);
      const count = 24;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5.5;
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // slight upward bias
          size: 2 + Math.random() * 3,
          color,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.025,
          gravity: 0.12,
        });
      }
      particlesRef.current = [...particlesRef.current, ...newParticles];
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setCursorOpacity(1);
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      isClickedRef.current = false;
      setCursorOpacity(0);
    };

    const onMouseDown = (e: MouseEvent) => {
      isClickedRef.current = true;
      createBurst(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isClickedRef.current = false;
    };

    const onWindowBlur = () => {
      isClickedRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onWindowBlur);

    // Dynamic hover event delegation for links, buttons and custom hover text
    const onMouseOver = (e: MouseEvent) => {
      // Force refreshing the cached magnetic list on hover shifts
      lastQueryTime = 0;

      const target = e.target as HTMLElement;
      if (!target) return;
      const hoverEl = target.closest('[data-cursor-text], a, button, [role="button"]');

      if (hoverEl) {
        isHoveringRef.current = true;
        const isSnappable = isMagneticTarget(hoverEl as HTMLElement);

        // Only show text if NOT snapping
        if (!isSnappable) {
          const text = hoverEl.getAttribute("data-cursor-text") || "VIEW";
          cursorTextRef.current = text;
          if (textRef.current) {
            textRef.current.textContent = text;
          }
          if (ringRef.current) {
            ringRef.current.classList.add("hover-active");
          }
        } else {
          cursorTextRef.current = "";
          if (textRef.current) {
            textRef.current.textContent = "";
          }
          if (ringRef.current) {
            ringRef.current.classList.remove("hover-active");
          }
        }
      } else {
        isHoveringRef.current = false;
        cursorTextRef.current = "";
        if (textRef.current) {
          textRef.current.textContent = "";
        }
        if (ringRef.current) {
          ringRef.current.classList.remove("hover-active");
        }
      }
    };

    const isMagneticTarget = (el: HTMLElement) => {
      if (el.getAttribute("data-cursor-text") === "HOME") return true;
      if (el.closest("nav")) return true;
      if (
        el.classList.contains("shadow-glow-cyan") ||
        el.getAttribute("data-cursor-text") === "WORK" ||
        el.getAttribute("data-cursor-text") === "TALK" ||
        el.getAttribute("data-cursor-text") === "CHAT"
      ) {
        return true;
      }
      if (
        el.classList.contains("will-change-transform") &&
        (el.tagName === "BUTTON" || el.tagName === "A")
      ) {
        return true;
      }
      if (el.getAttribute("data-magnetic") === "true") return true;
      return false;
    };

    document.addEventListener("mouseover", onMouseOver);

    // Caching selector targets for high performance
    let lastQueryTime = 0;
    let cachedMagneticElements: Element[] = [];

    const getMagneticElements = () => {
      const now = Date.now();
      if (now - lastQueryTime > 1000) {
        lastQueryTime = now;
        cachedMagneticElements = Array.from(
          document.querySelectorAll(
            'nav a, a[data-cursor-text="HOME"], .magnetic-target, [data-magnetic="true"], [data-cursor-snap], button.magnetic, a.magnetic',
          ),
        );
      }
      return cachedMagneticElements;
    };

    let rafId = 0;

    // Spring dynamics for Dot (fast snappy follow)
    let dotX = 0;
    let dotY = 0;
    let dotVx = 0;
    let dotVy = 0;
    const dotStiffness = 0.55;
    const dotDamping = 0.45;

    // Spring dynamics for Ring (kinetic snapping / follow lag)
    let ringX = 0;
    let ringY = 0;
    let ringVx = 0;
    let ringVy = 0;
    const ringStiffness = 0.35;
    const ringDamping = 0.55;

    // Spring sizing for Ring width & height
    let currentWidth = 36;
    let currentHeight = 36;
    let widthVx = 0;
    let heightVx = 0;
    const sizeStiffness = 0.35;
    const sizeDamping = 0.55;

    // Spring radius for corner rounding transitions
    let currentRadiusPx = 18;
    let radiusVx = 0;

    let activeTarget: HTMLElement | null = null;
    let targetRect: DOMRect | null = null;
    let targetBorderRadius = "50%";

    const tick = () => {
      const targetX = mouse.current.targetX;
      const targetY = mouse.current.targetY;

      // Locate closest magnetic element
      const magneticElements = getMagneticElements();
      let closest: HTMLElement | null = null;
      let minDst = Infinity;

      magneticElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dst = Math.hypot(targetX - cx, targetY - cy);
        if (dst < 75 && dst < minDst) {
          minDst = dst;
          closest = htmlEl;
        }
      });

      if (closest !== activeTarget) {
        activeTarget = closest;
        if (activeTarget) {
          targetRect = activeTarget.getBoundingClientRect();
          const computed = window.getComputedStyle(activeTarget);
          targetBorderRadius = computed.borderRadius || "50%";
        } else {
          targetRect = null;
          targetBorderRadius = "50%";
        }
      } else if (activeTarget) {
        targetRect = activeTarget.getBoundingClientRect();
      }

      // Default outer ring target parameters
      let ringTargetX = targetX;
      let ringTargetY = targetY;
      let ringWidth = 36;
      let ringHeight = 36;
      let ringBorderRadius = "50%";
      let ringBgColor = "transparent";
      let ringBorderColor = "var(--color-foreground)";
      let ringMixBlend = "difference";

      if (activeTarget && targetRect) {
        const cx = targetRect.left + targetRect.width / 2;
        const cy = targetRect.top + targetRect.height / 2;
        const dst = Math.hypot(targetX - cx, targetY - cy);

        const isHoveringTarget =
          targetX >= targetRect.left &&
          targetX <= targetRect.right &&
          targetY >= targetRect.top &&
          targetY <= targetRect.bottom;

        const maxRadius = 75;
        if (dst < maxRadius) {
          const k = isHoveringTarget ? 1 : 1 - dst / maxRadius;

          ringTargetX = targetX + (cx - targetX) * k;
          ringTargetY = targetY + (cy - targetY) * k;

          if (isHoveringTarget) {
            // Snaps ring perfectly around the button bounds
            ringWidth = targetRect.width + 12;
            ringHeight = targetRect.height + 8;
            ringBorderRadius = targetBorderRadius;
            ringBorderColor = "var(--brand-pink)";
            ringMixBlend = "normal";
          } else {
            // Magnetic pull visual feedback
            ringWidth = 36 + (48 - 36) * k;
            ringHeight = 36 + (48 - 36) * k;
          }
        }
      } else if (isHoveringRef.current) {
        // Expand outer ring slightly (no snapping for generic links/text)
        ringWidth = 80;
        ringHeight = 80;
        ringBorderColor = "transparent";
        ringBgColor = "oklch(1 0 0 / 0.95)";
        ringMixBlend = "normal";
      }

      // Spring physics solver: Dot
      const dotAx = (targetX - dotX) * dotStiffness;
      dotVx = (dotVx + dotAx) * dotDamping;
      dotX += dotVx;

      const dotAy = (targetY - dotY) * dotStiffness;
      dotVy = (dotVy + dotAy) * dotDamping;
      dotY += dotVy;

      // Spring physics solver: Ring
      const ringAx = (ringTargetX - ringX) * ringStiffness;
      ringVx = (ringVx + ringAx) * ringDamping;
      ringX += ringVx;

      const ringAy = (ringTargetY - ringY) * ringStiffness;
      ringVy = (ringVy + ringAy) * ringDamping;
      ringY += ringVy;

      // Spring physics solver: Ring Dimensions
      const widthAx = (ringWidth - currentWidth) * sizeStiffness;
      widthVx = (widthVx + widthAx) * sizeDamping;
      currentWidth += widthVx;

      const heightAx = (ringHeight - currentHeight) * sizeStiffness;
      heightVx = (heightVx + heightAx) * sizeDamping;
      currentHeight += heightVx;

      // Spring physics solver: Ring corner radius
      let targetRadiusPx = currentWidth / 2;
      if (activeTarget && targetRect && ringBorderRadius !== "50%") {
        targetRadiusPx = parseFloat(targetBorderRadius) || 8;
      }
      const radiusAx = (targetRadiusPx - currentRadiusPx) * sizeStiffness;
      radiusVx = (radiusVx + radiusAx) * sizeDamping;
      currentRadiusPx += radiusVx;

      // Direct DOM mutation for high-perf rendering
      if (dotRef.current) {
        const dotScale = isClickedRef.current ? "scale(1.8)" : "scale(1)";
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) ${dotScale}`;
        dotRef.current.style.backgroundColor = isHoveringRef.current
          ? "var(--brand-teal)"
          : "var(--brand-pink)";
      }

      if (ringRef.current) {
        const ringScale = isClickedRef.current ? "scale(0.75)" : "scale(1)";
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${ringScale}`;
        ringRef.current.style.width = `${currentWidth}px`;
        ringRef.current.style.height = `${currentHeight}px`;
        ringRef.current.style.borderRadius = `${currentRadiusPx}px`;
        ringRef.current.style.borderColor = ringBorderColor;
        ringRef.current.style.backgroundColor = ringBgColor;
        ringRef.current.style.mixBlendMode = ringMixBlend;
      }

      // Canvas particle physics simulation
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particlesRef.current = particlesRef.current.filter((p) => {
            p.vy += p.gravity;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) return false;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return true;
          });
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  if (
    typeof window === "undefined" ||
    (typeof window !== "undefined" && window.innerWidth < 768) ||
    prefersReducedMotion
  )
    return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[10001]"
        style={{ width: "100vw", height: "100vh" }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot fixed pointer-events-none z-[10000] opacity-0 transition-opacity duration-300"
      />
      {/* Outer lagging ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor-ring fixed pointer-events-none z-[9999] opacity-0 transition-opacity duration-300"
      >
        <div ref={textRef} className="custom-cursor-text" />
      </div>
    </>
  );
}
