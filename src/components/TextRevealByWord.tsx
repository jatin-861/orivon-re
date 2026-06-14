import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealByWordProps {
  text: string;
  className?: string;
  start?: string;
  end?: string;
}

export function TextRevealByWord({
  text,
  className = "",
  start = "top 85%",
  end = "top 45%",
}: TextRevealByWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into words manually
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="reveal-word inline-block mr-[0.25em]" style="will-change: transform, opacity; transform-style: preserve-3d;">${word}</span>`
      )
      .join(" ");

    const wordSpans = el.querySelectorAll(".reveal-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordSpans,
        {
          opacity: 0.1,
          y: 35,
          rotateX: -45,
          transformPerspective: 600,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.8,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, start, end]);

  return (
    <div
      ref={containerRef}
      className={`${className} leading-tight`}
      style={{ perspective: "1000px" }}
    />
  );
}

export default TextRevealByWord;
