import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const stateRef = useRef({
    isClicked: false,
    isHovering: false,
    isVisible: false,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.targetX = e.clientX;
      stateRef.current.targetY = e.clientY;
      if (!stateRef.current.isVisible) {
        stateRef.current.isVisible = true;
        setIsVisible(true);
      }
    };

    const onMouseLeave = () => {
      stateRef.current.isVisible = false;
      setIsVisible(false);
    };

    const onMouseDown = () => {
      stateRef.current.isClicked = true;
      setIsClicked(true);
    };

    const onMouseUp = () => {
      stateRef.current.isClicked = false;
      setIsClicked(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const hoverEl = target.closest('[data-cursor-text], a, button, [role="button"]');
      if (hoverEl) {
        stateRef.current.isHovering = true;
        setIsHovering(true);
        const text = hoverEl.getAttribute("data-cursor-text");
        setCursorText(text || "VIEW");
      } else {
        stateRef.current.isHovering = false;
        setIsHovering(false);
        setCursorText("");
      }
    };

    document.addEventListener("mouseover", onMouseOver, { passive: true });

    let rafId = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    const tick = () => {
      const targetX = stateRef.current.targetX;
      const targetY = stateRef.current.targetY;
      const clicked = stateRef.current.isClicked;

      dotX += (targetX - dotX) * 0.25;
      dotY += (targetY - dotY) * 0.25;

      ringX += (targetX - ringX) * 0.12;
      ringY += (targetY - ringY) * 0.12;

      if (dot) {
        const dotScale = clicked ? "scale(1.8)" : "scale(1)";
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) ${dotScale}`;
      }

      if (ring) {
        const ringScale = clicked ? "scale(0.75)" : "scale(1)";
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${ringScale}`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window === "undefined" || (typeof window !== "undefined" && window.innerWidth < 768))
    return null;

  return (
    <>
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot fixed pointer-events-none z-[10000] opacity-0 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundColor: isHovering ? "var(--brand-teal)" : "var(--brand-pink)",
        }}
      />
      {/* Outer lagging ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring fixed pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 ${isHovering ? "hover-active" : ""} ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="custom-cursor-text">{cursorText}</div>
      </div>
    </>
  );
}
