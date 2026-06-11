import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Marquee } from "@/components/Marquee";
import { ScrollStoryHorizontal } from "@/components/ScrollStoryHorizontal";
import { PROJECTS } from "@/data/projects";

import { CinematicHero } from "@/components/canvas/CinematicHero";
import { BentoTilt, BentoCard } from "@/components/BentoTilt";
import { StoryTeller } from "@/components/StoryTeller";

import { LusionSandbox } from "@/components/LusionSandbox";
import { GestaltVisualizer } from "@/components/skills/GestaltVisualizer";
import { FittsSimulator } from "@/components/skills/FittsSimulator";
import { SEO } from "@/components/SEO";

const MorphingBlob = lazy(() => import("@/components/canvas/MorphingBlob"));
const TechStackCanvas = lazy(() => import("@/components/canvas/TechStackCanvas"));

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Orivon",
    url: "https://orivon.com",
    description:
      "Orivon is an independent design studio crafting award-winning brands, websites and digital products.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://orivon.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="relative bg-background text-foreground transition-colors duration-500 font-sans overflow-hidden">
      <SEO
        title="Orivon — Award-winning digital design studio"
        description="Orivon is an independent design studio crafting award-winning brands, websites and digital products."
        canonical="https://orivon.com"
        keywords="design studio, digital agency, branding, website design, headless e-commerce, custom layout"
        ogType="website"
        schema={homeSchema}
      />
      <CinematicHero />
      <ScrollingTicker />

      {/* Horizontal Storytelling Scroll for Selected Work */}
      <section className="relative">
        <ScrollStoryHorizontal projects={PROJECTS} />
      </section>

      {/* Capabilities Bento Grid & Tilt cards */}
      <CapabilitiesBentoGrid />

      {/* Storytelling Narrative philosophical block */}
      <StoryTeller />

      <StudioManifesto />
      <Numbers />
      <BigCTA />
    </div>
  );
}

function CapabilitiesBentoGrid() {
  return (
    <section
      className="bg-transparent py-32 px-6 relative z-10 border-t border-border/50"
      data-cursor-text="SERVICES"
    >
      <div className="mx-auto max-w-7xl">
        <div className="px-5 mb-24 max-w-3xl">
          <span className="text-xs text-secondary font-mono tracking-widest uppercase mb-4 block">
            — Capabilities
          </span>
          <h2 className="text-white font-serif text-5xl md:text-7xl font-normal leading-[1.05] tracking-tighter">
            Bespoke capabilities <br />
            <span className="text-neutral-500 font-sans font-bold text-3xl md:text-5xl block mt-3">
              engineered for digital impact.
            </span>
          </h2>
        </div>

        {/* Main large Bento Card */}
        <BentoTilt className="relative mb-7 h-[500px] w-full overflow-hidden rounded-xl">
          <BentoCard
            title={
              <>
                Brand Strat
                <span className="font-serif italic text-secondary font-normal lowercase">e</span>gy
                & Systems
              </>
            }
            description="Interactive sandbox. We build visual design tokens, solid brand identities, and cohesive layout principles that command attention across every digital viewport."
            isComingSoon
          >
            <LusionSandbox />
          </BentoCard>
        </BentoTilt>

        {/* 2x3 Grid - Responsive layout structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-7 h-auto md:h-[150vh] w-full">
          <BentoTilt className="relative col-span-1 md:col-span-1 md:row-span-2 overflow-hidden rounded-xl transition-transform duration-300 ease-out min-h-[400px] md:min-h-[450px]">
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
              <Suspense
                fallback={<div className="absolute inset-0 bg-neutral-900/50 animate-pulse" />}
              >
                <MorphingBlob />
              </Suspense>
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="relative col-span-1 overflow-hidden rounded-xl transition-transform duration-300 ease-out min-h-[280px] md:min-h-[300px]">
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
              <div className="absolute right-4 bottom-4 w-72 h-72 scale-75 origin-bottom-right pointer-events-auto">
                <GestaltVisualizer />
              </div>
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="relative col-span-1 overflow-hidden rounded-xl transition-transform duration-300 ease-out min-h-[280px] md:min-h-[300px]">
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
              <div className="absolute right-4 bottom-4 w-72 h-72 scale-75 origin-bottom-right pointer-events-auto">
                <FittsSimulator />
              </div>
            </BentoCard>
          </BentoTilt>

          <BentoTilt className="relative col-span-1 overflow-hidden rounded-xl transition-transform duration-300 ease-out min-h-[200px]">
            <div className="flex flex-col justify-between bg-secondary p-6 text-white h-full">
              <h3 className="text-3xl font-serif leading-none tracking-tight max-w-xs uppercase">
                M<span className="font-serif italic text-white font-normal lowercase">o</span>re c
                <span className="font-serif italic text-white font-normal lowercase">r</span>aft in
                de<span className="font-serif italic text-white font-normal lowercase">v</span>
                elopment.
              </h3>
              <ArrowRight className="h-10 w-10 text-white self-end transition-transform duration-300 hover:translate-x-2" />
            </div>
          </BentoTilt>

          <BentoTilt className="relative col-span-1 overflow-hidden rounded-xl bg-card border border-border/10 min-h-[200px] transition-transform duration-300 ease-out">
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
              <Suspense fallback={<div className="absolute inset-0 bg-muted/20 animate-pulse" />}>
                <TechStackCanvas />
              </Suspense>
            </BentoCard>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}

function ScrollingTicker() {
  const items = [
    "Awwwards SOTD",
    "FWA Site of the Month",
    "CSS Design Awards",
    "Webby Honoree",
    "Lovie Gold Winner",
    "ADC Design Award",
  ];
  return (
    <section
      className="border-y border-border py-8 bg-background/50 backdrop-blur-sm relative z-10"
      data-cursor-text="HONORS"
    >
      <Marquee>
        {items.map((it) => (
          <span key={it} className="flex items-center gap-12 text-2xl font-serif font-normal">
            <span className="text-foreground/70">{it}</span>
            <span className="text-[var(--brand-pink)] font-sans">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

interface ScrollWordParagraphProps {
  text: string;
  className?: string;
}

function ScrollWordParagraph({ text, className = "" }: ScrollWordParagraphProps) {
  const words = text.split(" ");
  return (
    <p data-split-words className={`${className} leading-tight`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="manifesto-word inline-block mr-[0.25em] transition-colors duration-150"
        >
          {word}
        </span>
      ))}
    </p>
  );
}

function StudioManifesto() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      const paragraphs = textRef.current!.querySelectorAll("[data-split-words]");
      paragraphs.forEach((p) => {
        const words = p.querySelectorAll(".manifesto-word");

        // Highlight words staggered on scroll
        gsap.fromTo(
          words,
          {
            opacity: 0.15,
          },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              end: "bottom 55%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, textRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="py-40 px-6 bg-[var(--muted)] relative z-10 border-y border-border"
      data-cursor-text="CREED"
    >
      <div className="mx-auto max-w-4xl text-left" ref={textRef}>
        <span className="text-xs text-[var(--brand-pink)] font-mono mb-6 block">— Philosophy</span>
        <div className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-relaxed space-y-8 text-foreground">
          <ScrollWordParagraph text="We believe that templates dilute your brand value." />
          <ScrollWordParagraph text="An award-winning website is not built with 3D spinners or pre-made UI blocks." />
          <ScrollWordParagraph text="It is crafted with bespoke typography scales, custom layouts, and animations that adapt to the user’s scroll cadence." />
          <ScrollWordParagraph
            text="Every pixel should feel human-made."
            className="text-[var(--brand-pink)] font-serif italic font-medium"
          />
        </div>
      </div>
    </section>
  );
}

interface StatCounterProps {
  value: string;
}

function StatCounter({ value }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: numericPart,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          setDisplayValue(Math.floor(obj.val));
        },
      });
    }, el);

    return () => ctx.revert();
  }, [numericPart]);

  return (
    <span ref={containerRef}>
      {displayValue}
      {suffix}
    </span>
  );
}

function Numbers() {
  const stats = [
    { v: "12+", l: "Years of craft" },
    { v: "180", l: "Shipped projects" },
    { v: "27", l: "Industry awards" },
    { v: "98%", l: "Client retention" },
  ];
  return (
    <section
      className="py-24 px-6 border-b border-border bg-background relative z-10"
      data-cursor-text="STATS"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <SpotlightCard key={s.l} className="p-6 md:p-8 bg-[var(--card)] border border-border">
            <div className="font-serif text-5xl md:text-7xl font-normal text-[var(--brand-pink)]">
              <StatCounter value={s.v} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground font-mono font-medium">{s.l}</div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

interface KineticTextProps {
  text: string;
}

function KineticText({ text }: KineticTextProps) {
  const onLetterHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 25,
      rotation: (Math.random() - 0.5) * 40,
      color: "var(--brand-teal)",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const onLetterLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      x: 0,
      y: 0,
      rotation: 0,
      color: "inherit",
      duration: 0.8,
      ease: "elastic.out(1.1, 0.4)",
    });
  };

  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block cursor-default select-none transition-colors duration-150"
          style={{ display: char === " " ? "inline" : "inline-block" }}
          onMouseEnter={onLetterHover}
          onMouseLeave={onLetterLeave}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function BigCTA() {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;
    const ctx = gsap.context(() => {
      // Scale up text as user scrolls into the CTA section
      gsap.fromTo(
        textRef.current,
        { scale: 0.85 },
        {
          scale: 1.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-48 px-6 overflow-hidden bg-background border-b border-border"
    >
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
        <h2 className="font-serif font-normal leading-[0.95] text-[clamp(3rem,8vw,7rem)] tracking-tighter">
          <span
            ref={textRef}
            className="block text-[var(--brand-pink)] origin-center transition-transform"
          >
            <KineticText text="Let's build" /> <br />
            <em className="font-serif italic text-foreground">
              <KineticText text="something legendary." />
            </em>
          </span>
        </h2>
        <p className="mt-8 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
          We take on a small number of partners each quarter. If you have an idea worth doing right,
          we'd love to hear it.
        </p>
        <div className="mt-12">
          <MagneticButton
            as={Link}
            to="/contact"
            data-cursor-text="TALK"
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4.5 text-base font-semibold shadow-glow-cyan"
          >
            Start a project <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
