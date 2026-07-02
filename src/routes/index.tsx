import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Marquee } from "@/components/Marquee";
import { ScrollStoryHorizontal } from "@/components/ScrollStoryHorizontal";
import { PROJECTS } from "@/data/projects";

import { CinematicHero } from "@/components/canvas/CinematicHero";
import { FeaturedEvidence } from "@/components/FeaturedEvidence";
import { ProcessSignal } from "@/components/ProcessSignal";
import { SEO } from "@/components/SEO";
import { TextRevealByWord } from "@/components/TextRevealByWord";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // WebSite schema enables sitelinks search and confirms the canonical URL.
  // The Organization entity lives in index.html (static HTML, visible to all crawlers).
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Orvion.co",
    url: "https://orvion.co",
    description:
      "Product engineering studio that builds complete, production systems — from database to deployment.",
    publisher: {
      "@type": "Organization",
      name: "Orvion.co",
      url: "https://orvion.co",
    },
  };

  return (
    <div className="relative text-foreground transition-colors duration-500 font-sans overflow-x-clip">
      <SEO
        title="Orvion.co — Product Engineers"
        description="Orvion.co is a product engineering studio that builds complete, production systems — from database to deployment. Built NeuroDashboard, a multi-module AI platform, and Shade Ledger, a billing system running for 220 rental units."
        canonical="https://orvion.co/"
        ogImage="https://orvion.co/og-image.png"
        keywords="product engineer, full-stack developer, AI applications, React, Node.js, software engineer portfolio"
        ogType="website"
        schema={homeSchema}
      />
      <CinematicHero />
      <div className="animated-divider" />
      <StudioManifesto />
      <div className="animated-divider" />
      <FeaturedEvidence />
      <div className="animated-divider" />

      {/* Project capability — one section showing range beyond the featured case */}
      <section className="relative">
        <ScrollStoryHorizontal projects={PROJECTS} />
      </section>
      <div className="animated-divider" />
      <ProcessSignal />
      <div className="animated-divider" />

      <SkillsMarquee />
      <div className="animated-divider" />
      <Numbers />
      <div className="animated-divider" />
      <BigCTA />
    </div>
  );
}

function StudioManifesto() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      // 1. Parallax translateY drift for paragraphs
      const paras = textRef.current!.querySelectorAll("[data-para-block]");
      paras.forEach((para) => {
        const speed = parseFloat(para.getAttribute("data-para-speed") || "0");
        if (speed) {
          gsap.fromTo(
            para,
            { y: speed * 25 },
            {
              y: -speed * 25,
              ease: "none",
              scrollTrigger: {
                trigger: para,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      // 2. Horizontal line draw animation on scroll
      const lines = textRef.current!.querySelectorAll("[data-hr-line]");
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 95%",
              end: "top 75%",
              scrub: true,
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
      data-cursor-text="BELIEF"
    >
      <div
        className="mx-auto max-w-6xl grid md:grid-cols-12 gap-8 md:gap-16 items-start"
        ref={textRef}
      >
        {/* Sticky editorial left header */}
        <div className="md:col-span-3 md:sticky md:top-40 select-none">
          <div className="font-serif text-[7rem] md:text-[10rem] font-bold leading-none text-secondary/15">
            01
          </div>
          <span className="text-xs text-secondary font-mono tracking-widest uppercase block mt-2">
            — Core Belief
          </span>
        </div>

        {/* Right content area */}
        <div className="md:col-span-9 font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-relaxed space-y-12 text-foreground">
          <div data-para-block data-para-speed="-0.3">
            <TextRevealByWord text="Most software stays a demo — a prototype that never reaches a real user." />
          </div>
          <div className="h-px bg-border/40 w-full origin-left scale-x-0" data-hr-line />

          <div data-para-block data-para-speed="0.2">
            <TextRevealByWord text="Shipping the whole stack, database to deployment, is what turns a prototype into a product." />
          </div>
          <div className="h-px bg-border/40 w-full origin-left scale-x-0" data-hr-line />

          <div data-para-block data-para-speed="-0.4">
            <TextRevealByWord text="Real systems run for real people, every day — Shade Ledger has billed 220 rental units, automatically, every month, for over a year." />
          </div>

          <p className="mt-8 text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl">
            Here's what that looks like in practice.
          </p>
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js / Express",
  "PostgreSQL",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "Redis",
  "Socket.IO",
  "RAG / pgvector",
  "Docker",
];

function SkillsMarquee() {
  return (
    <section
      className="relative z-10 py-12 sm:py-16 border-y border-border bg-background/50 backdrop-blur-sm"
      data-cursor-text="STACK"
    >
      <div className="mx-auto max-w-7xl px-6 mb-6">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
          — Tools we build with
        </span>
      </div>
      <Marquee className="-mx-6">
        {SKILLS.map((s) => (
          <span
            key={s}
            className="text-2xl sm:text-4xl font-serif font-normal flex items-center gap-8 sm:gap-12 text-foreground/60 hover:text-primary transition-colors"
          >
            {s} <span className="text-[var(--brand-pink)] font-sans">✦</span>
          </span>
        ))}
      </Marquee>
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: numericPart,
            duration: 2.2,
            ease: "elastic.out(1, 0.65)",
            onUpdate: () => {
              setDisplayValue(Math.round(obj.val));
            },
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
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
    { v: "2", l: "Production systems, built end to end" },
    { v: "220", l: "Rental units on automated billing" },
    { v: "40+", l: "Hours of manual work saved monthly" },
    { v: "70k+", l: "Lines of production code shipped" },
  ];
  return (
    <section className="py-24 px-6 border-b border-border relative z-10" data-cursor-text="STATS">
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
      color: "var(--secondary)",
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
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="inline-block cursor-default select-none transition-colors duration-150"
              onMouseEnter={onLetterHover}
              onMouseLeave={onLetterLeave}
            >
              {char}
            </span>
          ))}
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
      className="relative py-48 px-6 overflow-hidden border-b border-border"
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
              <KineticText text="something that ships." />
            </em>
          </span>
        </h2>
        <p className="mt-8 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
          If you've got something worth building, we'd love to hear about it — and help take it from
          idea to something running in production.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground font-sans max-w-2xl mx-auto">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] shrink-0" />
            We reply within 48 hours, personally
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] shrink-0" />
            A quick call to understand scope
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] shrink-0" />
            A real proposal, not a sales deck
          </span>
        </div>

        <div className="mt-10">
          <MagneticButton
            as={Link}
            to="/contact"
            data-cursor-text="TALK"
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4.5 text-base font-semibold shadow-glow-cyan"
          >
            Get in touch <ArrowRight size={18} />
          </MagneticButton>
        </div>

        <p className="mt-6 text-sm text-muted-foreground font-sans">
          Fixed-fee pricing available.{" "}
          <Link to="/pricing" className="text-[var(--brand-pink)] hover:underline font-medium">
            See pricing →
          </Link>
        </p>
      </div>
    </section>
  );
}
