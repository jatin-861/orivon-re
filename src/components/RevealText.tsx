import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export const RevealText = ({ text, className, delay = 0, as: Tag = "h2" }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll(".reveal-char");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          y: "115%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.018,
          scrollTrigger: {
            trigger: el,
            start: "top 88%", // Triggers scroll reveal when element reaches 88% from the viewport top
            toggleActions: "play none none none",
          },
          delay: delay / 1000, // Convert millisecond delay to seconds
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <Tag ref={ref as any} className={cn("inline-block", className)}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden mr-[0.2em] align-bottom pb-[0.05em]">
          {word.split("").map((c, ci) => (
            <span
              key={ci}
              className="reveal-char inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {c}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};
