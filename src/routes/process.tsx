import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock, Users, Calendar, Code2 } from "lucide-react";
import { RevealText } from "@/components/RevealText";
import { SpotlightCard } from "@/components/SpotlightCard";
import { BentoTilt, BentoStatCard } from "@/components/BentoTilt";

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

const FACTS = [
  { v: "2 weeks", l: "Typical time to a first working build", icon: Clock },
  { v: "Direct", l: "Access to the engineers building it — no account managers", icon: Users },
  { v: "Weekly", l: "Live demos of real progress, not status decks", icon: Calendar },
];

const FAQS = [
  {
    q: "How long does a project usually take?",
    a: "Most engagements run 6–10 weeks from Discover to Ship, depending on scope. We'll give you a real estimate after the Define phase, once the brief is locked — not a guess on day one.",
  },
  {
    q: "Who will I actually be talking to?",
    a: "Saral and Jatin, directly — the same two people writing the code and designing the screens. No intermediaries, no account managers relaying messages back and forth.",
  },
  {
    q: "What happens after launch?",
    a: "Ship isn't the finish line. The Grow phase covers monitoring, bug fixes, and iteration based on real usage data — we stay close to anything we've shipped.",
  },
  {
    q: "Can you join mid-project, or just from scratch?",
    a: "Both. We've taken over half-built systems and shipped them to production, and started others from a blank repo. Discover adapts either way — we audit what exists before defining next steps.",
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
        ).fromTo(text, { opacity: 0.5, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 text-foreground transition-colors duration-500">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
          — Methodology
        </span>
        <RevealText
          text="How we"
          as="h1"
          className="font-serif text-4xl sm:text-6xl md:text-9xl font-normal leading-[1.1] pb-1 block"
        />
        <RevealText
          text="work."
          as="h1"
          className="font-serif text-4xl sm:text-6xl md:text-9xl font-normal leading-[1.1] pb-1 block text-[var(--brand-pink)] italic"
          delay={150}
        />
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          A clean, repeatable framework that makes ambitious, human-made digital projects feel calm
          — six phases, no surprises.
        </p>

        {/* Quick facts strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
          {FACTS.map((f) => (
            <BentoTilt
              key={f.l}
              className="h-[170px] rounded-[28px] transition-transform duration-300 hover:-translate-y-1"
            >
              <BentoStatCard icon={f.icon} value={f.v} label={f.l} />
            </BentoTilt>
          ))}
        </div>

        <div className="animated-divider mt-24" />

        {/* Steps container */}
        <div ref={containerRef} className="mt-24 relative">
          {/* Base timeline rail */}
          <div className="absolute left-6 md:left-12 top-6 bottom-6 w-[2px] bg-border" />

          {/* Animated active progress line */}
          <div
            ref={progressLineRef}
            className="absolute left-6 md:left-12 top-6 bottom-6 w-[2px] bg-[var(--brand-pink)] shadow-[0_0_8px_rgba(199,91,58,0.5)]"
            style={{ transformOrigin: "top center", transform: "scaleY(0)" }}
          />

          {STEPS.map((s, idx) => (
            <div key={s.n} data-step-node className="relative pl-20 md:pl-36 pb-24 last:pb-0">
              {/* Step indicator circle */}
              <div
                data-step-circle
                className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 md:h-24 md:w-24 rounded-xl bg-[var(--card)] border border-border/80 transition-all duration-300 z-10"
                style={{ borderColor: s.color }}
              >
                <span
                  className="text-lg md:text-3xl font-bold font-mono"
                  style={{ color: s.color }}
                >
                  {s.n}
                </span>
              </div>

              {/* Step description content */}
              <div data-step-text className="opacity-50 transition-all duration-500">
                <BentoTilt className="h-full w-full">
                  <SpotlightCard className="p-8 bg-[var(--card)] border border-border shadow-elegant">
                    <span className="text-xs text-[var(--brand-pink)] font-mono block mb-2 uppercase tracking-[0.2em]">
                      Phase 0{idx + 1}
                    </span>
                    <h2 className="font-serif text-2xl md:text-4xl font-normal leading-tight mb-4 text-foreground">
                      {s.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
                      {s.copy}
                    </p>
                  </SpotlightCard>
                </BentoTilt>
              </div>
            </div>
          ))}
        </div>

        <div className="animated-divider mt-24" />

        {/* What you get */}
        <div className="mt-24">
          <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
            — What you get
          </span>
          <h2 className="font-serif text-4xl md:text-7xl font-normal leading-tight mb-12">
            No middlemen, <span className="text-[var(--brand-pink)] italic">no fluff.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BentoTilt className="md:col-span-2 rounded-[28px] min-h-[280px] transition-transform duration-300 hover:-translate-y-1">
              <SpotlightCard className="h-full w-full p-8 md:p-10 bg-[var(--card)] border border-border flex flex-col justify-between">
                <Users className="h-7 w-7 text-secondary" strokeWidth={1.75} />
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug text-foreground mb-3">
                    You talk to the people writing the code.
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                    Saral and Jatin, directly — every call, every update, every decision. No account
                    managers relaying messages back and forth.
                  </p>
                </div>
              </SpotlightCard>
            </BentoTilt>

            <BentoTilt className="rounded-[28px] min-h-[280px] transition-transform duration-300 hover:-translate-y-1">
              <SpotlightCard className="h-full w-full p-8 bg-[var(--card)] border border-border flex flex-col justify-between">
                <Calendar className="h-6 w-6 text-secondary" strokeWidth={1.75} />
                <div>
                  <h3 className="font-serif text-xl font-normal text-foreground mb-2">
                    Fixed scope, fixed price.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A real estimate once the brief locks in Define — not a guess on day one.
                  </p>
                </div>
              </SpotlightCard>
            </BentoTilt>

            <BentoTilt className="md:col-span-3 rounded-[28px] min-h-[160px] transition-transform duration-300 hover:-translate-y-1">
              <SpotlightCard className="h-full w-full p-8 bg-[var(--card)] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Code2 className="h-6 w-6 text-secondary shrink-0" strokeWidth={1.75} />
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    Built with modern, boring-on-purpose tools.
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  TanStack, GSAP, Tailwind CSS — maintainable code, not framework-of-the-week
                  experiments.
                </p>
              </SpotlightCard>
            </BentoTilt>
          </div>
        </div>

        <div className="animated-divider mt-24" />

        {/* FAQ */}
        <div className="mt-24 grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          <div>
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
              — Questions
            </span>
            <h2 className="font-serif text-4xl md:text-7xl font-normal leading-tight">
              Before you{" "}
              <span className="text-[var(--brand-pink)] font-serif italic block">reach out.</span>
            </h2>
          </div>
          <div className="divide-y divide-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6 first:pt-0">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                  <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground">
                    {f.q}
                  </h3>
                  <span className="shrink-0 font-mono text-[var(--brand-pink)] text-xl transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="animated-divider mt-24" />

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 glass rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <h3 className="font-serif text-3xl md:text-5xl font-normal leading-tight">
              Ready for <span className="text-[var(--brand-pink)] italic">phase one?</span>
            </h3>
            <p className="text-muted-foreground mt-3 max-w-md">
              Tell us about the project — we'll come back within 48 hours with next steps.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-semibold shadow-glow-cyan whitespace-nowrap shrink-0"
          >
            Get in touch <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
