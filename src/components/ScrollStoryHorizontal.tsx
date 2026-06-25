import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";
import { SpotlightCard } from "./SpotlightCard";
import { InteractiveGrid2D } from "./InteractiveGrid2D";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollStoryHorizontalProps {
  projects: Project[];
}

// Bleed hues per slide: None (intro), Pink, Lavender, Peach, Mint, Magenta, Cyan
const BLEED_COLORS = [
  "rgba(251, 251, 250, 0)", // Intro (None)
  "rgba(224, 83, 125, 0.08)", // Lumen
  "rgba(156, 139, 200, 0.08)", // Noctis
  "rgba(229, 159, 123, 0.08)", // Orbit
  "rgba(145, 196, 181, 0.08)", // Verdant
  "rgba(244, 114, 182, 0.08)", // Atelier
  "rgba(94, 231, 255, 0.08)", // Halo
];

export function ScrollStoryHorizontal({ projects }: ScrollStoryHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState("");
  const [onIntro, setOnIntro] = useState(true);

  // Desktop = mouse-driven. Only there do we use the GSAP pinned scroll that
  // converts vertical scroll into horizontal motion. On touch that mechanism
  // fights Lenis (which preventDefaults touch to smooth-scroll) and never snaps
  // to a card — so phones get a real native scroll-snap carousel instead.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Helper shared by both modes: reflect the active slide index in the counter,
  // the intro-label visibility, and the color-bleed overlay.
  const setActiveSlide = (i: number) => {
    if (bleedRef.current) {
      bleedRef.current.style.backgroundColor = BLEED_COLORS[i] ?? BLEED_COLORS[0];
    }
    if (i > 0) {
      setCounter(`0${i} / 0${projects.length}`);
      setOnIntro(false);
    } else {
      setCounter("");
      setOnIntro(true);
    }
  };

  // ── MOBILE: native horizontal scroll-snap ──────────────────────────────────
  useEffect(() => {
    if (isDesktop) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const panels = Array.from(scroller.querySelectorAll<HTMLElement>("[data-panel]"));

    // Whichever panel is at least ~55% in view is the active one. With one
    // panel per viewport and mandatory snapping, exactly one qualifies at rest.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActiveSlide(panels.indexOf(entry.target as HTMLElement));
          }
        });
      },
      { root: scroller, threshold: [0.55] },
    );
    panels.forEach((p) => io.observe(p));

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, projects]);

  // Mirrors the desktop "no-blur-scrub" mitigation: real native momentum scroll
  // on a phone drives this just as fast as GSAP's scrub does on desktop, and
  // backdrop-filter is the same expensive-to-recomposite cost on mobile GPUs —
  // it's the leading cause of scroll stutter/jiggle during a fast swipe.
  useEffect(() => {
    if (isDesktop) return;
    const scroller = scrollRef.current;
    const container = containerRef.current;
    if (!scroller || !container) return;

    const FAST_SCROLL_PX_PER_SEC = 900;
    let lastX = scroller.scrollLeft;
    let lastT = performance.now();
    let blurResumeTimeout: number;

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const velocity = Math.abs(scroller.scrollLeft - lastX) / (dt / 1000);
        if (velocity > FAST_SCROLL_PX_PER_SEC) {
          container.classList.add("no-blur-scrub");
        }
      }
      lastX = scroller.scrollLeft;
      lastT = now;
      clearTimeout(blurResumeTimeout);
      blurResumeTimeout = window.setTimeout(() => {
        container.classList.remove("no-blur-scrub");
      }, 150);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(blurResumeTimeout);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [isDesktop]);

  // ── DESKTOP: GSAP pinned vertical-drives-horizontal scroll ──────────────────
  useEffect(() => {
    if (!isDesktop) return;
    const container = containerRef.current;
    const scrollSection = scrollRef.current;
    if (!container || !scrollSection) return;

    const scrollAmount = scrollSection.scrollWidth - window.innerWidth;

    // backdrop-filter is the single most expensive thing to recomposite every
    // frame — drop it while scrolling fast and restore it once motion settles.
    let blurResumeTimeout: number;
    const FAST_SCROLL_PX_PER_SEC = 900;
    const onScrollVelocity = (self: { getVelocity: () => number }) => {
      if (Math.abs(self.getVelocity()) > FAST_SCROLL_PX_PER_SEC) {
        container.classList.add("no-blur-scrub");
      }
      clearTimeout(blurResumeTimeout);
      blurResumeTimeout = window.setTimeout(() => {
        container.classList.remove("no-blur-scrub");
      }, 150);
    };

    const ctx = gsap.context(() => {
      // 1. Horizontal Scroll Animation
      const horizontalTween = gsap.to(scrollSection, {
        x: () => -(scrollSection.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          pinType: "transform",
          // Lenis already lags/eases the raw wheel input by ~1.2s before ScrollTrigger
          // sees it. Adding a second independent scrub lag on top made two easing
          // systems chase each other, which is what produced the rubber-band
          // jiggle/stuck feeling on this section. scrub: true tracks the
          // (already-smoothed) Lenis position 1:1 instead of re-lagging it.
          scrub: true,
          start: "top top",
          end: () => `+=${(scrollSection.scrollWidth - window.innerWidth) * 1.5}`,
          invalidateOnRefresh: true,
          onUpdate: onScrollVelocity,
        },
      });

      // 2. Card Skew based on Scroll Velocity
      const skewProxy = { skew: 0 };
      const skewSetter = gsap.quickSetter("[data-skew-card]", "skewX", "deg");
      const clamp = gsap.utils.clamp(-6, 6);

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${scrollAmount * 1.5}`,
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / 350);
          if (Math.abs(skew) > Math.abs(skewProxy.skew)) {
            skewProxy.skew = skew;
            gsap.to(skewProxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
              onUpdate: () => skewSetter(skewProxy.skew),
            });
          }
        },
      });

      // 3. Bleed Background & Counter per slide
      const panels = gsap.utils.toArray<Element>("[data-panel]");
      panels.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          containerAnimation: horizontalTween,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive) setActiveSlide(i);
          },
        });

        // 4. Mockup Content Inner Parallax
        const parallaxInner = el.querySelector("[data-parallax-inner]");
        if (parallaxInner) {
          gsap.fromTo(
            parallaxInner,
            { x: -35 },
            {
              x: 35,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: horizontalTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });
    }, container);

    return () => {
      clearTimeout(blurResumeTimeout);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, projects]);

  // Premium glassmorphic brand backgrounds with high-contrast text color combinations.
  // The dark text shades only read against a light cream background — on the dark theme's
  // near-black background that same 10-12% tint barely shows, so the text needs a light
  // dark:text-* variant (badges/divider/link all inherit it for free via currentColor).
  const bgClasses = [
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#C75B3A]/10 text-[#6E2A18] dark:text-[#F2C4B0] border-[#C75B3A]/20 shadow-[0_30px_60px_-15px_rgba(199,91,58,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#4B6E6A]/10 text-[#213533] dark:text-[#BFE0DA] border-[#4B6E6A]/20 shadow-[0_30px_60px_-15px_rgba(75,110,106,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#6A5B7B]/10 text-[#362B41] dark:text-[#D9CFEA] border-[#6A5B7B]/20 shadow-[0_30px_60px_-15px_rgba(106,91,123,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#C37B68]/12 text-[#683427] dark:text-[#F0CDB9] border-[#C37B68]/20 shadow-[0_30px_60px_-15px_rgba(195,123,104,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#B87830]/10 text-[#54330B] dark:text-[#F2D9A8] border-[#B87830]/20 shadow-[0_30px_60px_-15px_rgba(184,120,48,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#D25E42]/10 text-[#712818] dark:text-[#F7C9BC] border-[#D25E42]/20 shadow-[0_30px_60px_-15px_rgba(210,94,66,0.08)]",
  ];

  const glowHues = [
    340, // Lumen (Pinkish)
    260, // Noctis (Lavender)
    20, // Orbit (Peach)
    150, // Verdant (Mint)
    320, // Atelier (Pinkish)
    190, // Halo (Cyan)
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-auto md:h-[100svh] overflow-hidden bg-background transition-colors duration-700 py-12 md:py-0"
    >
      {/* 2D interactive background grid */}
      <div className="absolute inset-0 opacity-25 pointer-events-none z-0">
        <InteractiveGrid2D />
      </div>

      {/* Dynamic Color Bleed Overlay */}
      <div
        ref={bleedRef}
        className="absolute inset-0 pointer-events-none transition-all duration-700 mix-blend-multiply z-[1]"
      />

      {/* Slide Navigation & Info indicator — hidden on the intro slide since it
          already shows its own "Selected Work" label in-flow; leaving this on
          top of it there caused the heading text to render through/behind it. */}
      {!onIntro && (
        <div className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Selected Work
          </span>
        </div>
      )}

      {/* Floating Awwwards-style large active counter */}
      {counter && (
        <div className="absolute bottom-12 left-6 md:left-12 z-20 font-mono text-xs md:text-sm tracking-[0.3em] text-muted-foreground uppercase opacity-85 select-none animate-in fade-in slide-in-from-bottom-2 duration-500">
          PROJECT: <span className="text-foreground font-bold">{counter}</span>
        </div>
      )}

      {/* Track. Desktop: a w-max flex row that GSAP translates horizontally.
          Mobile: a real native scroll-snap carousel — data-lenis-prevent stops
          the global Lenis smooth-scroll from swallowing the horizontal swipe,
          which is what previously made it impossible to settle on one card. */}
      <div
        ref={scrollRef}
        {...(!isDesktop && { "data-lenis-prevent": true })}
        className={
          isDesktop
            ? "flex h-full w-max items-center relative z-10"
            : "flex items-stretch relative z-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar overscroll-x-contain px-4 gap-4"
        }
      >
        {/* Intro Slide */}
        <div
          data-panel
          className="w-[88vw] md:w-screen h-auto md:h-[100svh] flex-shrink-0 snap-start md:snap-center snap-always flex flex-col justify-center px-2 md:px-24 max-w-4xl"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-secondary mb-4 block font-mono">
            Selected Work
          </span>
          <h2 className="font-display font-bold leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)] tracking-tight">
            Real systems, built{" "}
            <span className="text-secondary font-serif italic font-normal">and shipped.</span>
          </h2>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A multi-module AI platform, production billing automation, and more — each one solving a
            real problem for real users.
          </p>
          <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-foreground/50">
            <span className="md:inline hidden">Scroll down or scroll wheel</span>
            <span className="md:hidden inline">Swipe to explore</span>
            <span className="text-secondary text-lg animate-bounce-horizontal">→</span>
          </div>
        </div>

        {/* Project Slides */}
        {projects.map((p, index) => {
          const cardBg = bgClasses[index % bgClasses.length];
          const glowHue = glowHues[index % glowHues.length];
          return (
            <div
              key={p.slug}
              data-panel
              className="w-[88vw] md:w-screen h-auto md:h-[100svh] flex-shrink-0 snap-start md:snap-center snap-always flex items-center justify-center px-2 md:px-16"
            >
              <div
                data-skew-card
                className={`w-full max-w-6xl md:aspect-[16/9] rounded-xl p-6 md:p-14 grid md:grid-cols-12 gap-6 md:gap-12 items-center overflow-hidden border border-border/10 shadow-elegant ${cardBg} transition-transform duration-200`}
              >
                {/* Left side: Case Study Metadata */}
                <div className="md:col-span-5 flex flex-col md:h-full md:justify-between py-2">
                  <div>
                    <div className="flex gap-2 mb-6 font-mono text-xs opacity-75">
                      <span className="border border-current/30 rounded-full px-3 py-1">
                        {p.category}
                      </span>
                      <span className="border border-current/30 rounded-full px-3 py-1">
                        {p.year}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-4">
                      {p.title.split(" — ")[0]}
                    </h3>
                    <p className="text-sm md:text-base opacity-80 leading-relaxed mb-6">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {p.services.map((s) => (
                        <span
                          key={s}
                          className="bg-current/10 rounded px-2.5 py-1 text-xs font-mono font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    data-cursor-text="EXPLORE"
                    className="inline-flex items-center gap-2 group self-start border-b-2 border-current pb-1 text-sm font-bold tracking-wider uppercase transition-all hover:gap-3"
                  >
                    Explore case{" "}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                {/* Right side: High-fidelity Vector Mockup Card with Spotlight and Parallax */}
                <div className="md:col-span-7 h-full flex items-center justify-center relative overflow-hidden rounded-2xl">
                  <SpotlightCard
                    glowHue={glowHue}
                    className="w-full h-full bg-black/10 border-white/10 p-0 flex flex-col justify-between overflow-hidden shadow-2xl relative"
                  >
                    <div className="p-6 h-full flex flex-col justify-between" data-parallax-inner>
                      {/* Window Controls */}
                      <div className="flex items-center gap-1.5 pb-4 border-b border-white/10">
                        <span className="w-3 h-3 rounded-full bg-white/20" />
                        <span className="w-3 h-3 rounded-full bg-white/20" />
                        <span className="w-3 h-3 rounded-full bg-white/20" />
                      </div>

                      {/* Product shot */}
                      <div className="flex-1 flex items-center justify-center py-6 relative">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            className="theme-shot w-full aspect-[2.15/1] object-contain rounded-xl"
                          />
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
