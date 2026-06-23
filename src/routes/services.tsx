import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Code2, Sparkles, ShoppingBag, Gauge } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { RevealText } from "@/components/RevealText";
import { ComponentLab } from "@/components/skills/ComponentLab";
import { BentoTilt, BentoCard, BentoStatCard } from "@/components/BentoTilt";
import { FittsSimulator } from "@/components/skills/FittsSimulator";
import { GestaltVisualizer } from "@/components/skills/GestaltVisualizer";
import { HierarchySimulator } from "@/components/skills/HierarchySimulator";
import { InteractiveBlob2D } from "@/components/canvas/InteractiveBlob2D";
import { InteractiveTechStack2D } from "@/components/canvas/InteractiveTechStack2D";

function GestaltStaticPreview() {
  return (
    <div className="relative w-full h-full border border-border/40 rounded-xl bg-muted/20 flex items-center justify-center p-6 shadow-elegant overflow-hidden select-none pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        {/* Simplified preview of the Gestalt dot grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-6 w-36 h-36">
          {Array.from({ length: 16 }).map((_, idx) => {
            const row = Math.floor(idx / 4);
            const col = idx % 4;
            const isDiagonal = row === col;
            return (
              <div key={idx} className="flex items-center justify-center">
                <div
                  className="w-[18px] h-[18px] rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: isDiagonal
                      ? "var(--brand-pink)"
                      : "var(--color-muted-foreground)",
                    opacity: isDiagonal ? 1 : 0.35,
                    transform: isDiagonal ? "scale(1.2)" : "scale(1)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FittsStaticPreview() {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant w-full h-full select-none pointer-events-none overflow-hidden justify-between">
      <div className="relative h-28 w-full rounded-xl bg-muted/20 border border-border/50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[var(--brand-pink)]/85 text-white flex items-center justify-center font-mono text-[8px] font-bold tracking-wider shadow-sm">
          TARGET
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3.5 text-[9px] font-mono text-muted-foreground">
        <div className="flex flex-col gap-0.5">
          <span>Distance</span>
          <strong className="text-foreground font-bold">185 px</strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span>Size</span>
          <strong className="text-foreground font-bold">48 px</strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span>Acquire</span>
          <strong className="text-[var(--brand-pink)] font-bold">312 ms</strong>
        </div>
      </div>
    </div>
  );
}

function CapabilitiesBentoGrid() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade-in & 3D tilt floating up for bento cards
      gsap.from(".bento-animate-item", {
        y: 70,
        opacity: 0,
        rotateX: 8,
        transformPerspective: 1000,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bento-grid-trigger",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-transparent py-32 px-0 relative z-10" data-cursor-text="LAB">
      <div className="bento-grid-trigger mx-auto max-w-7xl">
        <div className="mb-24 max-w-3xl">
          <span className="text-xs text-secondary font-mono tracking-widest uppercase mb-4 block">
            — Interactive Lab
          </span>
          <h2 className="text-foreground font-serif text-5xl md:text-7xl font-normal leading-[1.05] tracking-tighter">
            See our capabilities <br />
            <span className="text-muted-foreground font-sans font-bold text-3xl md:text-5xl block mt-3">
              in action through live components.
            </span>
          </h2>
        </div>

        {/* Main large Bento Card */}
        <BentoTilt className="bento-animate-item relative mb-5 h-[500px] w-full overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1">
          <BentoCard
            title={
              <>
                Brand Systems
                <span className="font-serif italic text-secondary font-normal lowercase">
                  {" "}
                  &
                </span>{" "}
                Motion
              </>
            }
            description="High-impact brand systems, motion-led interfaces, and polished design systems for standout digital identities."
            isComingSoon
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top,_rgba(199,91,58,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(26,26,26,0.05),transparent_45%)]">
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(26,26,26,0.02),transparent_40%,rgba(26,26,26,0.01))]" />
              <div className="relative z-10 max-w-xl px-6 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-secondary font-display mb-3">
                  design systems with quiet motion
                </p>
                <h3 className="text-4xl md:text-5xl font-serif font-semibold leading-tight text-foreground">
                  Refined portfolios, polished interactions, and award-ready visual direction.
                </h3>
              </div>
            </div>
          </BentoCard>
        </BentoTilt>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-5 h-auto md:h-[150vh] w-full">
          <BentoTilt className="bento-animate-item relative col-span-1 md:col-span-1 md:row-span-2 overflow-hidden rounded-[28px] transition-transform duration-300 ease-out hover:-translate-y-1 min-h-[400px] md:min-h-[450px]">
            <BentoCard
              title={
                <>
                  Tactil
                  <span className="font-serif italic text-secondary font-normal lowercase">
                    e
                  </span>{" "}
                  Web & Product
                </>
              }
              description="High-fidelity marketing sites, clean dashboard interfaces, and responsive WebGL environments crafted with absolute precision."
              isComingSoon
            >
              <InteractiveBlob2D />
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="bento-animate-item relative col-span-1 overflow-hidden rounded-[28px] transition-transform duration-300 ease-out hover:-translate-y-1 min-h-[280px] md:min-h-[300px]">
            <BentoCard
              title={
                <>
                  Moti
                  <span className="font-serif italic text-secondary font-normal lowercase">o</span>n
                  & Visual Grouping
                </>
              }
              description="Gestalt laws: Toggling states illustrates visual groupings, proximity, similarity, and continuity curves."
              isComingSoon
            >
              <div className="absolute right-4 bottom-4 w-72 h-72 scale-75 origin-bottom-right pointer-events-none">
                <GestaltStaticPreview />
              </div>
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="bento-animate-item relative col-span-1 overflow-hidden rounded-[28px] transition-transform duration-300 ease-out hover:-translate-y-1 min-h-[280px] md:min-h-[300px]">
            <BentoCard
              title={
                <>
                  UX Acquisiti
                  <span className="font-serif italic text-secondary font-normal lowercase">o</span>n
                  Trial
                </>
              }
              description="Fitts's Law trial: clicking start calculates targeting speeds relative to CTA distances (D) and size boundaries (W)."
              isComingSoon
            >
              <div className="absolute right-4 bottom-4 w-72 h-72 scale-75 origin-bottom-right pointer-events-none">
                <FittsStaticPreview />
              </div>
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="bento-animate-item relative col-span-1 overflow-hidden rounded-[28px] transition-transform duration-300 ease-out hover:-translate-y-1 min-h-[200px]">
            <BentoStatCard icon={Gauge} value="220" label="Rental units on automated billing, live" />
          </BentoTilt>

          <BentoTilt className="bento-animate-item relative col-span-1 overflow-hidden rounded-[28px] bg-card border border-border/10 min-h-[200px] transition-transform duration-300 ease-out hover:-translate-y-1">
            <BentoCard
              title={
                <>
                  Tech Stack{" "}
                  <span className="font-serif italic text-secondary font-normal lowercase">I</span>
                  nteractive
                </>
              }
              description="Standard development languages and libraries clumping in real-time."
              isComingSoon
            >
              <InteractiveTechStack2D />
            </BentoCard>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/services")({
  component: Services,
});

const SERVICES = [
  {
    Icon: Palette,
    title: "Frontend Design",
    copy: "Strategic Figma layouts, bespoke typography scales, and CSS micro-interactions that communicate your brand values.",
    items: [
      "Figma Design Systems",
      "Bespoke Typography",
      "Tailwind CSS Layouts",
      "Responsive Interfaces",
    ],
  },
  {
    Icon: Code2,
    title: "Full-Stack Dev",
    copy: "High-performance React & Next.js apps, robust Node.js/Express APIs, Python/Django services, and clean relational databases.",
    items: [
      "Next.js & React Apps",
      "REST & GraphQL APIs",
      "Relational Databases",
      "Performance Optimization",
    ],
  },
  {
    Icon: ShoppingBag,
    title: "E-commerce",
    copy: "Shopify integration and custom storefront development designed for seamless checkout, speed, and elevated conversion rates.",
    items: [
      "Shopify Development",
      "Subscription Engines",
      "Custom Storefronts",
      "Conversion Audits",
    ],
  },
  {
    Icon: Sparkles,
    title: "Mobile Apps",
    copy: "Cross-platform mobile application engineering leveraging Flutter and React Native for fluid native experiences.",
    items: ["Flutter Development", "React Native Apps", "App Store Publishing", "Micro-animations"],
  },
];

function Services() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero text clip-path reveal wipe (from left to right)
      gsap.fromTo(
        ".services-hero-text",
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.1,
          ease: "power3.inOut",
          delay: 0.25,
        },
      );

      // 2. 3D card flip entry on scroll
      gsap.from(".service-card-reveal", {
        rotationY: -80,
        transformPerspective: 1000,
        opacity: 0,
        y: 60,
        stagger: 0.08,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".services-grid-trigger",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">
          — Capabilities
        </span>
        <div
          className="services-hero-text overflow-hidden"
          style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        >
          <RevealText
            text="What we do best."
            as="h1"
            className="font-display text-4xl sm:text-6xl md:text-9xl font-bold leading-[0.9]"
          />
        </div>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          Four core practices, one studio. We handle both design and development, ensuring your
          product is seamless from code to pixels.
        </p>

        <div
          className="services-grid-trigger mt-20 grid md:grid-cols-2 gap-6"
          style={{ perspective: "1000px" }}
        >
          {SERVICES.map(({ Icon, title, copy, items }, i) => (
            <div
              key={title}
              className="service-card-reveal h-full"
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
            >
              <BentoTilt className="h-full w-full">
                <SpotlightCard className="p-8 h-full w-full">
                  <Icon size={28} className="text-[var(--brand-pink)] mb-6" />
                  <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
                  <p className="text-muted-foreground mb-6">{copy}</p>
                  <ul className="space-y-2 text-sm">
                    {items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-[var(--brand-pink)]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </BentoTilt>
            </div>
          ))}
        </div>
        <div className="animated-divider mt-24" />

        {/* Capabilities Bento Grid */}
        <CapabilitiesBentoGrid />
        <div className="animated-divider mt-24" />

        {/* Component Lab Micro-interactions Section */}
        <div className="mt-24 pt-20 border-t border-border/80">
          <div className="mb-16" data-cursor-text="LAB">
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">
              — Verification Lab
            </span>
            <h2 className="font-serif text-4xl md:text-7xl font-normal leading-[1.05] tracking-tighter">
              Micro-interactions <span className="text-[var(--brand-pink)] italic">Tray.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
              We design micro-interactions that feel responsive and tactile, respecting physical
              spring limits to elevate structural layouts. Test some widgets:
            </p>
          </div>
          <ComponentLab />
        </div>
        <div className="animated-divider mt-24" />

        {/* Bespoke UX Validation Sandbox Section */}
        <div className="mt-24 pt-20 border-t border-border/80">
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
        <div className="animated-divider mt-24" />

        <div className="mt-24 glass rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold">
              Got a brief?{" "}
              <span className="text-[var(--brand-pink)]">Let's scope it together.</span>
            </h3>
            <p className="text-muted-foreground mt-3 max-w-md">
              Tell us about the project — we'll come back within 48 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-semibold shadow-glow-cyan whitespace-nowrap"
          >
            Get in touch <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
