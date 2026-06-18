import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SVGPathRevealProps {
  path: string; // The d attribute of the path
  viewBox?: string;
  className?: string;
  svgClassName?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  triggerOnce?: boolean;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export function SVGPathReveal({
  path,
  viewBox = "0 0 100 10",
  className = "",
  svgClassName = "w-full h-auto",
  strokeColor = "var(--brand-pink)",
  strokeWidth = 2,
  duration = 1.5,
  delay = 0,
  triggerOnce = true,
  scrub = false,
  start = "top 90%",
  end = "bottom 60%",
}: SVGPathRevealProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    const svgEl = svgRef.current;
    if (!pathEl || !svgEl) return;

    // Calculate total path length
    const length = pathEl.getTotalLength();

    // Set initial dash attributes
    gsap.set(pathEl, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      const scrollTriggerConfig: ScrollTrigger.Vars = {
        trigger: svgEl,
        start,
        toggleActions: triggerOnce ? "play none none none" : "play reverse play reverse",
      };

      if (scrub) {
        scrollTriggerConfig.scrub = scrub;
        scrollTriggerConfig.end = end;
      }

      gsap.to(pathEl, {
        strokeDashoffset: 0,
        duration,
        delay,
        ease: "power2.inOut",
        scrollTrigger: scrollTriggerConfig,
      });
    }, svgEl);

    return () => ctx.revert();
  }, [path, duration, delay, triggerOnce, scrub, start, end]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className={svgClassName}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d={path}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default SVGPathReveal;
