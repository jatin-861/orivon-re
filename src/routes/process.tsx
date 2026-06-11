import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/RevealText";
import { FittsSimulator } from "@/components/skills/FittsSimulator";
import { GestaltVisualizer } from "@/components/skills/GestaltVisualizer";
import { HierarchySimulator } from "@/components/skills/HierarchySimulator";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/process")({
  component: Process,
});

const STEPS = [
  {
    n: "01",
    title: "Discover",
    copy: "We start every engagement with research — stakeholder interviews, market analysis and a deep look at what's working and what's not.",
    color: "var(--brand-pink)",
  },
  {
    n: "02",
    title: "Define",
    copy: "We turn insight into a sharp brief: positioning, principles, scope and success metrics. Everyone aligns before a pixel moves.",
    color: "var(--brand-teal)",
  },
  {
    n: "03",
    title: "Design",
    copy: "From mood to layout to design system — we explore widely, then commit. You see real work in week one, not lorem ipsum mocks.",
    color: "var(--brand-lavender)",
  },
  {
    n: "04",
    title: "Build",
    copy: "Engineering and design ship together. We use modern, clean tools — TanStack, GSAP, Tailwind CSS — writing maintainable code.",
    color: "var(--brand-peach)",
  },
  {
    n: "05",
    title: "Ship",
    copy: "QA across devices, performance budgets, accessibility audits — then we launch with confidence and clear rollback strategies.",
    color: "var(--brand-ochre)",
  },
  {
    n: "06",
    title: "Grow",
    copy: "Post-launch we keep iterating. Analytics, usability testing, and conversion audits to compound the digital gains.",
    color: "var(--brand-coral)",
  },
];

function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !progressLineRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Progress line drawing itself on scroll
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "bottom 80%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      // 2. Animate step contents and highlight active steps on scroll
      const steps = containerRef.current!.querySelectorAll("[data-step-node]");
      steps.forEach((step) => {
        const circle = step.querySelector("[data-step-circle]");
        const text = step.querySelector("[data-step-text]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        });

        tl.fromTo(
          circle,
          { scale: 0.8, opacity: 0.4 },
          { scale: 1.1, opacity: 1, duration: 0.5 },
        ).fromTo(text, { opacity: 0.3, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 bg-background text-foreground transition-colors duration-500">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">— Methodology</span>
        <RevealText
          text="How we work."
          as="h1"
          className="font-display text-6xl md:text-9xl font-bold leading-[0.9]"
        />
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          A clean, repeatable framework that makes ambitious, human-made digital projects feel calm.
        </p>

        {/* Steps container */}
        <div ref={containerRef} className="mt-32 relative">
          {/* Base timeline rail */}
          <div className="absolute left-6 md:left-12 top-6 bottom-6 w-[1px] bg-border" />

          {/* Animated active progress line */}
          <div
            ref={progressLineRef}
            className="absolute left-6 md:left-12 top-6 bottom-6 w-[1px] bg-[var(--brand-pink)]"
            style={{ transformOrigin: "top center", transform: "scaleY(0)" }}
          />

          {STEPS.map((s, idx) => (
            <div key={s.n} data-step-node className="relative pl-20 md:pl-32 pb-24 last:pb-0">
              {/* Step indicator circle */}
              <div
                data-step-circle
                className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 md:h-24 md:w-24 rounded-xl bg-[var(--card)] border border-border/80 transition-all duration-300 z-10"
                style={{ borderColor: s.color }}
              >
                <span
                  className="font-display text-lg md:text-3xl font-bold font-mono"
                  style={{ color: s.color }}
                >
                  {s.n}
                </span>
              </div>

              {/* Step description content */}
              <div data-step-text className="opacity-40 transition-all duration-500">
                <span className="text-xs text-[var(--brand-pink)] font-mono block mb-1">
                  Phase 0{idx + 1}
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
                  {s.title}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {s.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Sandbox Section */}
        <div className="mt-48 pt-20 border-t border-border/80">
          <div className="mb-16" data-cursor-text="PLAY">
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">
              — Verification Lab
            </span>
            <h2 className="font-serif text-4xl md:text-7xl font-normal leading-[1.05] tracking-tighter">
              Bespoke UX <span className="text-[var(--brand-pink)] italic">Validation.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
              We test our grids and hierarchy ratios against visual psychology guidelines before
              shipping production code. Play with our validation simulators:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
            <div className="flex flex-col gap-6">
              <FittsSimulator />
              <GestaltVisualizer />
            </div>
            <div>
              <HierarchySimulator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
