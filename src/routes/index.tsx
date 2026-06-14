import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { animate } from "animejs";
import { MagneticButton } from "@/components/MagneticButton";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Marquee } from "@/components/Marquee";
import { ScrollStoryHorizontal } from "@/components/ScrollStoryHorizontal";
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
    <div className="relative text-foreground transition-colors duration-500 font-sans overflow-x-clip">
      <SEO
        title="Orivon — Award-winning digital design studio"
        description="Orivon is an independent design studio crafting award-winning brands, websites and digital products."
        canonical="https://orivon.com"
        keywords="design studio, digital agency, branding, website design, headless e-commerce, custom layout"
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
      <Numbers />
      <div className="animated-divider" />
      <BigCTA />
    </div>
  );
}

function StudioShowreel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    if (!containerRef.current || !scrollRef.current) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const ctx = gsap.context(() => {
      gsap.to(scrollEl, {
        x: () => -(scrollEl.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollEl.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Subtle parallax shift for video panels
      const panels = gsap.utils.toArray(".showreel-panel-card");
      panels.forEach((panel: any) => {
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
                containerAnimation: gsap.getById("scroll-showreel"), // references scroll animation if mapped
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  const items = [
    {
      video: "/videos/hero-2.mp4",
      tag: "01 / Motion Design",
      title: "Elevating digital rhythm.",
      desc: "Bespoke animations and kinetic transitions crafted to capture focus.",
    },
    {
      video: "/videos/feature-2.mp4",
      tag: "02 / Systems",
      title: "Structured design scales.",
      desc: "A library of custom layouts engineered for optimal brand consistency.",
    },
    {
      video: "/videos/feature-3.mp4",
      tag: "03 / E-commerce",
      title: "Flow tailored to convert.",
      desc: "Speed-focused headless storefronts designed for zero checkout friction.",
    },
  ];

  if (isMobile) {
    return (
      <div className="relative bg-[var(--brand-pink)] text-white overflow-hidden z-10 border-y border-white/10 py-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(199,91,58,0.05),transparent_40%)] pointer-events-none" />
        
        <div className="space-y-12">
          {/* Intro Panel */}
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[var(--brand-peach)] tracking-widest uppercase mb-4 block">
              — Studio Showreel
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.1] tracking-tighter">
              Cinematic <br />
              <span className="text-secondary italic">narratives</span> in motion.
            </h2>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              We blend raw engineering with editorial design.
            </p>
          </div>

          {/* Video Panels stacked vertically */}
          <div className="space-y-8">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="relative h-96 w-full overflow-hidden rounded-2xl bg-black/10 border border-white/20 shadow-2xl flex flex-col justify-between p-6 group"
              >
                {/* Background Video */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <video
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-pink)] via-transparent to-black/10" />
                </div>

                {/* Video Label */}
                <div className="relative z-10 flex justify-between items-center text-xs font-mono tracking-widest uppercase text-white/50">
                  <span>{item.tag}</span>
                  <span className="text-[var(--brand-pink)]">✦</span>
                </div>

                {/* Details */}
                <div className="relative z-10 mt-auto">
                  <h3 className="font-serif text-2xl font-normal tracking-tight leading-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Outro Panel */}
          <div className="rounded-2xl p-8 bg-[var(--muted)] text-foreground relative border border-border">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(199,91,58,0.04),transparent_35%)] pointer-events-none" />
            <div>
              <span className="text-xs font-mono text-[var(--brand-pink)] tracking-widest uppercase mb-4 block">
                — Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight tracking-tighter mb-4">
                Our complete <br />
                <span className="text-[var(--brand-pink)] font-sans font-bold italic">Verification Lab.</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                We validate all components against Fitts's law target acquisition speeds and Gestalt visual grouping metrics.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-glow-cyan"
              >
                Explore Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative bg-[var(--brand-pink)] text-white overflow-hidden z-10 border-y border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(199,91,58,0.05),transparent_40%)] pointer-events-none" />
      
      {/* Horizontal scroll track */}
      <div 
        ref={scrollRef} 
        className="flex h-screen items-center"
        style={{ width: "fit-content" }}
      >
        {/* Intro Panel */}
        <div className="showreel-panel flex h-screen w-screen flex-shrink-0 flex-col justify-center px-12 md:px-24 max-w-4xl">
          <span className="text-xs font-mono text-[var(--brand-pink)] tracking-widest uppercase mb-4">
            — Studio Showreel
          </span>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tighter">
            Cinematic <br />
            <span className="text-secondary italic">narratives</span> in motion.
          </h2>
          <p className="mt-6 text-sm md:text-base text-white/60 max-w-md leading-relaxed">
            Scroll horizontally to see snippets of our interactive products. We blend raw engineering with editorial design.
          </p>
        </div>

        {/* Video Panels */}
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="showreel-panel-card relative h-[70vh] w-[85vw] md:w-[60vw] flex-shrink-0 overflow-hidden rounded-2xl mx-12 md:mx-20 bg-black/10 border border-white/20 shadow-2xl flex flex-col justify-between p-8 md:p-12 group"
            data-cursor-text="PLAY"
          >
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                src={item.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-[115%] h-full object-cover opacity-30 transition-opacity duration-700 group-hover:opacity-55 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-pink)] via-transparent to-black/10" />
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
        <div className="showreel-panel flex h-screen w-screen flex-shrink-0 flex-col justify-center px-12 md:px-24 bg-[var(--muted)] text-foreground relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(199,91,58,0.04),transparent_35%)] pointer-events-none" />
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[var(--brand-pink)] tracking-widest uppercase mb-4 block">
              — Capabilities
            </span>
            <h2 className="font-serif text-5xl md:text-7xl font-normal leading-none tracking-tighter mb-6">
              Our complete <br />
              <span className="text-[var(--brand-pink)] font-sans font-bold italic">Verification Lab.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
              We validate all components against Fitts's law target acquisition speeds and Gestalt visual grouping metrics.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-glow-cyan"
            >
              Explore Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollingTicker() {
  const items = [
    "Frontend Design",
    "Bespoke Web Development",
    "Tactile Interactions",
    "Editorial Aesthetics",
    "Clean Performance",
    "Creative Engineering",
    "TypeScript & React",
    "GSAP Motion Graphics",
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
  const underlineRef = useRef<HTMLSpanElement>(null);

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
            }
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
          }
        );
      });

      // 3. Draw underline under last paragraph
      const underline = underlineRef.current;
      if (underline) {
        gsap.fromTo(
          underline,
          { width: "0%" },
          {
            width: "100%",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: underline,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, textRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="py-40 px-6 bg-[var(--muted)] relative z-10 border-y border-border"
      data-cursor-text="CREED"
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-12 gap-8 md:gap-16 items-start" ref={textRef}>
        {/* Sticky editorial left header */}
        <div className="md:col-span-3 md:sticky md:top-40 select-none">
          <div className="font-serif text-[7rem] md:text-[10rem] font-bold leading-none text-secondary/15">01</div>
          <span className="text-xs text-secondary font-mono tracking-widest uppercase block mt-2">— Philosophy</span>
        </div>

        {/* Right content area */}
        <div className="md:col-span-9 font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-relaxed space-y-12 text-foreground">
          <div data-para-block data-para-speed="-0.3">
            <TextRevealByWord text="We believe that templates dilute your brand value." />
          </div>
          <div className="h-px bg-border/40 w-full origin-left scale-x-0" data-hr-line />

          <div data-para-block data-para-speed="0.2">
            <TextRevealByWord text="An award-winning website is not built with 3D spinners or pre-made UI blocks." />
          </div>
          <div className="h-px bg-border/40 w-full origin-left scale-x-0" data-hr-line />

          <div data-para-block data-para-speed="-0.4">
            <TextRevealByWord text="It is crafted with bespoke typography scales, custom layouts, and animations that adapt to the user’s scroll cadence." />
          </div>
          <div className="h-px bg-border/40 w-full origin-left scale-x-0" data-hr-line />

          <div data-para-block data-para-speed="0.3" className="pt-4">
            <p className="text-[var(--brand-pink)] font-serif italic font-medium leading-tight">
              <span className="relative inline-block pb-3">
                <span className="reveal-word inline-block mr-[0.25em]">Every</span>{" "}
                <span className="reveal-word inline-block mr-[0.25em]">pixel</span>{" "}
                <span className="reveal-word inline-block mr-[0.25em]">should</span>{" "}
                <span className="reveal-word inline-block mr-[0.25em]">feel</span>{" "}
                <span className="reveal-word inline-block mr-[0.25em]">human-made.</span>
                <span ref={underlineRef} className="absolute left-0 bottom-0 h-1.5 bg-secondary origin-left" style={{ width: "0%" }} />
              </span>
            </p>
          </div>
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const obj = { val: 0 };
          animate(obj, {
            val: numericPart,
            round: 1,
            duration: 2200,
            ease: "easeOutElastic(1, 0.65)",
            update: () => {
              setDisplayValue(Math.floor(obj.val));
            },
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
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
    { v: "3+", l: "Years of studio craft" },
    { v: "20+", l: "Bespoke projects" },
    { v: "100%", l: "Dedicated engineering" },
    { v: "10+", l: "Happy clients" },
  ];
  return (
    <section
      className="py-24 px-6 border-b border-border relative z-10"
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
