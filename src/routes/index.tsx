import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Marquee } from "@/components/Marquee";
import { ScrollStoryHorizontal } from "@/components/ScrollStoryHorizontal";
import { LazyVideo } from "@/components/LazyVideo";
import { PROJECTS } from "@/data/projects";

import { CinematicHero } from "@/components/canvas/CinematicHero";
import { StoryTeller } from "@/components/StoryTeller";
import { SEO } from "@/components/SEO";
import { TextRevealByWord } from "@/components/TextRevealByWord";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Orvion.co — Product Engineers",
    description:
      "Orvion.co is a product engineering studio that builds complete, production systems — from database to deployment.",
    mainEntity: {
      "@type": "Organization",
      name: "Orvion.co",
      member: [
        {
          "@type": "Person",
          name: "Saral Banker",
          jobTitle: "Product Engineer",
          sameAs: ["https://github.com/saralbanker"],
        },
        {
          "@type": "Person",
          name: "Jatin Basantani",
          jobTitle: "Frontend & AI Systems Developer",
          sameAs: ["https://github.com/jatin-861"],
        },
      ],
    },
  };

  return (
    <div className="relative text-foreground transition-colors duration-500 font-sans overflow-x-clip">
      <SEO
        title="Orvion.co — Product Engineers"
        description="Orvion.co is a product engineering studio that builds complete, production systems — from database to deployment. Built NeuroDashboard, a multi-module AI platform, and Shade Ledger, a billing system running for 220 rental units."
        canonical="/"
        keywords="product engineer, full-stack developer, AI applications, React, Node.js, software engineer portfolio"
        ogType="website"
        schema={homeSchema}
      />
      <CinematicHero />
      <div className="animated-divider" />
      <ScrollingTicker />
      <div className="animated-divider" />

      {/* Horizontal Storytelling Scroll for Selected Work */}
      <section className="relative">
        <ScrollStoryHorizontal projects={PROJECTS} />
      </section>
      <div className="animated-divider" />

      {/* Cinematic Horizontal Video Showreel */}
      <StudioShowreel />
      <div className="animated-divider" />

      {/* Storytelling Narrative philosophical block */}
      <StoryTeller />
      <div className="animated-divider" />

      <StudioManifesto />
      <div className="animated-divider" />
      <SkillsMarquee />
      <div className="animated-divider" />
      <Numbers />
      <div className="animated-divider" />
      <BigCTA />
    </div>
  );
}

function StudioShowreel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const ctx = gsap.context(() => {
      gsap.to(scrollEl, {
        id: "scroll-showreel",
        x: () => -(scrollEl.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          pinType: "transform",
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollEl.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Subtle parallax shift for video panels
      const panels = gsap.utils.toArray<HTMLElement>(".showreel-panel-card");
      panels.forEach((panel) => {
        const video = panel.querySelector("video");
        if (video) {
          gsap.fromTo(
            video,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: gsap.getById("scroll-showreel") as gsap.core.Tween | undefined, // ties parallax to the horizontal scroll track
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const items = [
    {
      video: "/videos/hero-2.mp4",
      tag: "Knowledge Hub",
      title: "Find answers instantly.",
      desc: "Semantic search across all your documents and notes — the flagship module inside NeuroDashboard.",
    },
    {
      video: "/videos/feature-2.mp4",
      tag: "Shade Ledger",
      title: "Billing that runs itself.",
      desc: "Automatic invoices, reminders, and penalty tracking — running live for 220 rental units.",
    },
    {
      video: "/videos/feature-3.mp4",
      tag: "Smart Parking",
      title: "Real-time, on demand.",
      desc: "Drivers see open spots in real time and book one instantly.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--brand-pink)] text-white overflow-hidden z-10 border-y border-white/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(199,91,58,0.05),transparent_40%)] pointer-events-none" />

      {/* Horizontal scroll track */}
      <div ref={scrollRef} className="flex h-screen items-center" style={{ width: "fit-content" }}>
        {/* Intro Panel */}
        <div className="showreel-panel flex h-screen w-screen flex-shrink-0 flex-col justify-center px-6 md:px-24 max-w-4xl">
          <span className="text-xs font-mono text-[var(--brand-pink)] tracking-widest uppercase mb-4">
            — Systems In Motion
          </span>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tighter">
            Real projects, <br />
            <span className="text-secondary italic">running</span> in production.
          </h2>
          <p className="mt-6 text-sm md:text-base text-white/60 max-w-md leading-relaxed">
            Scroll horizontally for a closer look at what's actually live.
          </p>
        </div>

        {/* Video Panels */}
        {items.map((item, idx) => (
          <div
            key={idx}
            className="showreel-panel-card relative h-[70vh] w-[85vw] md:w-[60vw] flex-shrink-0 overflow-hidden rounded-2xl mx-4 md:mx-20 bg-black/10 border border-white/20 shadow-2xl flex flex-col justify-between p-6 md:p-12 group"
            data-cursor-text="PLAY"
          >
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <LazyVideo
                src={item.video}
                className="w-[115%] h-full object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>

            {/* Video Label */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono tracking-widest uppercase text-white/50">
              <span>{item.tag}</span>
              <span className="text-[var(--brand-pink)]">✦</span>
            </div>

            {/* Details */}
            <div className="relative z-10 max-w-md mt-auto">
              <h3 className="font-serif text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-3">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Outro CTA Panel */}
        <div className="showreel-panel flex h-screen w-screen flex-shrink-0 flex-col justify-center px-6 md:px-24 bg-[var(--muted)] text-foreground relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(199,91,58,0.04),transparent_35%)] pointer-events-none" />
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[var(--brand-pink)] tracking-widest uppercase mb-4 block">
              — Want To See More?
            </span>
            <h2 className="font-serif text-5xl md:text-7xl font-normal leading-none tracking-tighter mb-6">
              See what's <br />
              <span className="text-[var(--brand-pink)] font-sans font-bold italic">running.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
              Full case studies for NeuroDashboard, Shade Ledger, and more — including architecture,
              decisions, and what's still on the roadmap.
            </p>
            <Link
              to="/work"
              className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-glow-cyan"
            >
              See Selected Work <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollingTicker() {
  const items = [
    "Find Answers Instantly",
    "Automate Manual Work",
    "Real-Time Collaboration",
    "Production-Ready Systems",
    "Full-Stack Engineering",
    "AI & Automation",
    "Reliable by Design",
    "Shipped & Running",
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
    { v: "1", l: "Paid contract, delivered duo" },
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
          If you've got something worth building, I'd like to hear about it — and help take it from
          idea to something running in production.
        </p>
        <div className="mt-12">
          <MagneticButton
            as={Link}
            to="/contact"
            data-cursor-text="TALK"
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4.5 text-base font-semibold shadow-glow-cyan"
          >
            Get in touch <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
