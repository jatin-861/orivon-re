import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LucideIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PanelItem {
  n: string;
  title: string;
  copy: string;
  Icon: LucideIcon;
  color: string;
  textDark: boolean;
}

interface ScrollRevealPanelProps {
  panels: PanelItem[];
}

export function ScrollRevealPanel({ panels }: ScrollRevealPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-reveal-card]");
    const total = cards.length;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        // Set alternating slight skews/rotations for raw organic layout
        const rotateVal = index % 2 === 0 ? 1.5 : -1.5;
        gsap.set(card, { rotation: rotateVal, transformOrigin: "center center" });

        if (index === total - 1) return; // Do not animate the last card

        const nextCard = cards[index + 1];

        // Animate card scale-down, opacity-fade, and straighten rotation to 0 as it stacks
        gsap.to(card, {
          scale: 0.93 - (total - index) * 0.012,
          opacity: 0.6,
          y: -20,
          rotation: 0, // Align straight when stacked
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 90%",
            end: "top 40%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [panels]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center w-full">
      {panels.map((p, index) => {
        // Guarantee textDark is true for brand-pink (pink background) to ensure contrast ratio >= 4.5:1
        const isPink = p.color === "var(--brand-pink)" || p.color === "#e0537d";
        const isDarkText = p.textDark || isPink;

        const textColor = isDarkText ? "text-neutral-950" : "text-white";
        const iconColor = isDarkText ? "text-neutral-900" : "text-white/90";
        const subTextColor = isDarkText ? "text-neutral-900" : "text-neutral-100";

        return (
          <div
            key={p.title}
            data-reveal-card
            className="sticky w-full max-w-5xl rounded-[2rem] p-8 md:p-12 shadow-elegant border border-border/10 overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: p.color,
              top: `${120 + index * 24}px`, // Slight offset overlap
              height: "420px",
              marginBottom: index === panels.length - 1 ? "0" : "120px", // space for scrolling the next card in
            }}
          >
            {/* Top row: Number and Icon */}
            <div className="flex items-center justify-between border-b border-current/15 pb-6">
              <span className={`font-mono text-xs uppercase tracking-[0.25em] ${subTextColor}`}>
                Capability {p.n}
              </span>
              <p.Icon className={`${iconColor}`} size={28} aria-hidden="true" />
            </div>

            {/* Core Body */}
            <div className="my-auto py-4">
              <h3
                className={`font-display text-3xl md:text-5xl font-bold leading-none tracking-tight mb-4 ${textColor}`}
              >
                {p.title}
              </h3>
              <p className={`text-base md:text-lg max-w-xl leading-relaxed ${subTextColor}`}>
                {p.copy}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between border-t border-current/15 pt-6">
              <span className={`font-mono text-[10px] tracking-widest ${subTextColor}`}>
                ORIVON // HUMAN-MADE SYSTEM
              </span>
              <span className={`text-xs font-bold font-mono tracking-wider ${textColor}`}>
                WEEKLY ITERATIONS
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
