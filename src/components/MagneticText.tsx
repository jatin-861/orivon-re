import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MagneticTextProps {
  text: string;
  className?: string;
  strength?: number;
  radius?: number;
}

export function MagneticText({
  text,
  className = "",
  strength = 18,
  radius = 90,
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into words, then characters to prevent vertical word wrapping on mobile
    const words = text.split(" ");
    el.innerHTML = words
      .map((word) => {
        const wordChars = word
          .split("")
          .map((char) => {
            return `<span class="mag-char inline-block" style="will-change: transform; transition: color 0.3s ease;">${char}</span>`;
          })
          .join("");
        return `<span class="inline-block whitespace-nowrap">${wordChars}</span>`;
      })
      .join(" ");

    const charSpans = el.querySelectorAll(".mag-char");

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      charSpans.forEach((span: any) => {
        const spanRect = span.getBoundingClientRect();
        const spanX = spanRect.left + spanRect.width / 2;
        const spanY = spanRect.top + spanRect.height / 2;

        const dx = mouseX - spanX;
        const dy = mouseY - spanY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          // Push chars away from mouse (repulsion)
          const force = (radius - dist) / radius;
          const angle = Math.atan2(dy, dx);
          
          const x = -Math.cos(angle) * force * strength;
          const y = -Math.sin(angle) * force * strength;

          gsap.to(span, {
            x,
            y,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(span, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    };

    const onMouseLeave = () => {
      charSpans.forEach((span) => {
        gsap.to(span, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1.1, 0.4)",
        });
      });
    };

    el.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [text, strength, radius]);

  return (
    <div
      ref={containerRef}
      className={`inline-block select-none ${className}`}
    />
  );
}

export default MagneticText;
