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

export function ScrollStoryHorizontal({ projects }: ScrollStoryHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    const scrollSection = scrollRef.current;
    if (!container || !scrollSection) return;

    const scrollAmount = scrollSection.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // 1. Horizontal Scroll Animation
      const horizontalTween = gsap.to(scrollSection, {
        x: () => -(scrollSection.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          pinType: "transform",
          scrub: 1.2,
          start: "top top",
          end: () => `+=${(scrollSection.scrollWidth - window.innerWidth) * 1.5}`,
          invalidateOnRefresh: true,
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

      // 3. Bleed Background & Counter Setup
      // Bleed hues: Pink, Lavender, Peach, Mint, Magenta, Cyan
      const bleedColors = [
        "rgba(251, 251, 250, 0)", // Intro (None)
        "rgba(224, 83, 125, 0.08)", // Lumen
        "rgba(156, 139, 200, 0.08)", // Noctis
        "rgba(229, 159, 123, 0.08)", // Orbit
        "rgba(145, 196, 181, 0.08)", // Verdant
        "rgba(244, 114, 182, 0.08)", // Atelier
        "rgba(94, 231, 255, 0.08)", // Halo
      ];

      const panels = gsap.utils.toArray("[data-panel]");
      panels.forEach((panel: unknown, i: number) => {
        const el = panel as Element;
        ScrollTrigger.create({
          trigger: el,
          containerAnimation: horizontalTween,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive) {
              // Fade the bleed overlay to the active slide's signature glow color
              gsap.to(bleedRef.current, {
                backgroundColor: bleedColors[i],
                duration: 0.8,
                ease: "power2.out",
              });

              // Slide Counter logic
              if (i > 0) {
                setCounter(`0${i} / 0${projects.length}`);
              } else {
                setCounter("");
              }
            }
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

    return () => ctx.revert();
  }, [projects]);

  // Premium glassmorphic brand backgrounds with high-contrast text color combinations
  // backdrop-blur-xl is recomposited every frame while these cards are inside a pinned,
  // scroll-scrubbed track — on phone GPUs that's expensive enough to drop frames and is felt
  // as scroll jitter. Keep blur cheap on mobile, restore the full blur on larger screens.
  const bgClasses = [
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#C75B3A]/10 text-[#6E2A18] border-[#C75B3A]/20 shadow-[0_30px_60px_-15px_rgba(199,91,58,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#4B6E6A]/10 text-[#213533] border-[#4B6E6A]/20 shadow-[0_30px_60px_-15px_rgba(75,110,106,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#6A5B7B]/10 text-[#362B41] border-[#6A5B7B]/20 shadow-[0_30px_60px_-15px_rgba(106,91,123,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#C37B68]/12 text-[#683427] border-[#C37B68]/20 shadow-[0_30px_60px_-15px_rgba(195,123,104,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#B87830]/10 text-[#54330B] border-[#B87830]/20 shadow-[0_30px_60px_-15px_rgba(184,120,48,0.08)]",
    "backdrop-blur-sm md:backdrop-blur-xl bg-[#D25E42]/10 text-[#712818] border-[#D25E42]/20 shadow-[0_30px_60px_-15px_rgba(210,94,66,0.08)]",
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
      className="relative h-[100dvh] overflow-hidden bg-background transition-colors duration-700"
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

      {/* Slide Navigation & Info indicator */}
      <div className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono">
          Selected Work
        </span>
      </div>

      {/* Floating Awwwards-style large active counter */}
      {counter && (
        <div className="absolute bottom-12 left-6 md:left-12 z-20 font-mono text-xs md:text-sm tracking-[0.3em] text-muted-foreground uppercase opacity-85 select-none animate-in fade-in slide-in-from-bottom-2 duration-500">
          PROJECT: <span className="text-foreground font-bold">{counter}</span>
        </div>
      )}

      <div ref={scrollRef} className="flex h-full w-max items-center relative z-10">
        {/* Intro Slide */}
        <div
          data-panel
          className="w-screen h-[100dvh] flex-shrink-0 flex flex-col justify-center px-6 md:px-24 max-w-4xl"
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
            <span>Scroll down or scroll wheel</span>
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
              className="w-screen h-[100dvh] flex-shrink-0 flex items-center justify-center px-4 md:px-16"
            >
              <div
                data-skew-card
                className={`w-full max-w-6xl min-h-[75vh] md:min-h-0 md:aspect-[16/9] rounded-xl p-6 md:p-14 grid md:grid-cols-12 gap-6 md:gap-12 items-center overflow-y-auto md:overflow-hidden border border-border/10 shadow-elegant ${cardBg} transition-transform duration-200`}
              >
                {/* Left side: Case Study Metadata */}
                <div className="md:col-span-5 flex flex-col h-full justify-between py-2">
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
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="w-3 h-3 rounded-full bg-white/20" />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest opacity-40">
                          SARAL BANKER // {p.slug.toUpperCase()}
                        </span>
                      </div>

                      {/* CSS Vector Content tailored to each case */}
                      <div className="flex-1 flex items-center justify-center py-6 relative">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full aspect-[2.15/1] object-contain rounded-xl"
                          />
                        )}
                        {p.slug === "lumen-finance" && (
                          <div className="w-full max-w-sm space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                              <span className="text-xs opacity-60 font-mono">FINANCE_CAPITAL</span>
                              <span className="text-base font-bold font-mono">$842,912.00</span>
                            </div>
                            {/* Mini styled chart */}
                            <div className="h-28 flex items-end justify-between gap-1.5 pt-4">
                              {[40, 25, 55, 30, 85, 45, 95, 60, 110, 75, 120].map((val, i) => (
                                <div
                                  key={i}
                                  className="w-full bg-gradient-to-t from-[var(--brand-pink)] to-white/40 rounded-t-sm transition-all duration-500 hover:opacity-100"
                                  style={{
                                    height: `${(val / 120) * 100}%`,
                                    opacity: 0.3 + i * 0.05,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {p.slug === "noctis-music" && (
                          <div className="w-full flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <span className="w-4 h-4 rounded-full bg-white/50" />
                              </div>
                            </div>
                            {/* Equalizer lines */}
                            <div className="flex items-center gap-1.5 h-6">
                              {[10, 18, 14, 24, 8, 16, 22, 12].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-white/70 rounded-full animate-pulse"
                                  style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {p.slug === "orbit-aerospace" && (
                          <div className="w-full max-w-xs space-y-6 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono opacity-50">ORBIT_TRACKER</span>
                              <span className="text-xs font-mono text-[var(--brand-peach)]">
                                L-04:12:05
                              </span>
                            </div>
                            {/* Orbital path */}
                            <div className="relative h-24 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                              <div className="absolute w-40 h-40 rounded-full border border-white/20 -bottom-28 animate-[spin_60s_linear_infinite]" />
                              <div className="absolute w-3 h-3 rounded-full bg-[var(--brand-peach)] shadow-[0_0_15px_#ffb084]" />
                              <span className="text-[10px] font-mono opacity-30 absolute bottom-2 right-2">
                                ALT. 408KM
                              </span>
                            </div>
                          </div>
                        )}

                        {p.slug === "verdant-eco" && (
                          <div className="w-full max-w-xs space-y-4">
                            <div className="text-center font-display text-2xl font-bold opacity-80">
                              98.4%
                            </div>
                            <p className="text-[10px] font-mono text-center opacity-50 uppercase tracking-widest">
                              ECO_REDUCTION_TARGET
                            </p>
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/15">
                              <div
                                className="bg-white/80 h-full rounded-full"
                                style={{ width: "98.4%" }}
                              />
                            </div>
                          </div>
                        )}

                        {p.slug === "atelier-fashion" && (
                          <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                            <div className="border border-white/10 rounded-lg p-3 flex flex-col justify-between aspect-square bg-white/5">
                              <span className="text-[10px] font-mono opacity-40">CAPE</span>
                              <span className="font-display text-lg font-medium opacity-80">
                                ATELIER CAFE
                              </span>
                            </div>
                            <div className="border border-white/10 rounded-lg p-3 flex flex-col justify-between aspect-square bg-white/5">
                              <span className="text-[10px] font-mono opacity-40">SILK</span>
                              <span className="font-display text-lg font-medium opacity-80">
                                COUTURE NOIR
                              </span>
                            </div>
                          </div>
                        )}

                        {p.slug === "halo-health" && (
                          <div className="w-full flex flex-col items-center space-y-3">
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-ping">
                              <div className="w-16 h-16 rounded-full bg-white/10" />
                            </div>
                            <span className="text-xs font-mono opacity-50">INHALE ... EXHALE</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div className="flex justify-between items-center text-[9px] font-mono opacity-40">
                        <span>BUILT BY SARAL BANKER</span>
                        <span>©2026 // ALL RIGHTS RESERVED</span>
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
