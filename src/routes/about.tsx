import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/RevealText";
import { Marquee } from "@/components/Marquee";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AnimatedTestimonials } from "@/components/AnimatedTestimonials";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/about")({
  component: About,
});

const SKILLS = [
  "Brand Strategy",
  "UX/UI",
  "Tailwind CSS",
  "TanStack",
  "Typography",
  "GSAP",
  "Framer Motion",
  "Shopify",
  "Figma",
  "Editorial Layouts",
  "Vector Systems",
  "Performance Optimization",
];

const TEAM = [
  {
    name: "Maya Iro",
    designation: "Founder · Executive Creative Director",
    quote:
      "We started Orivon to prove that small, focused studios can outship and outdream the giants. Our obsession with typography and layouts only grows.",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=60",
  },
  {
    name: "Theo Vance",
    designation: "Design Director",
    quote:
      "Layout is a contract with the reader. Every spacing ratio, every font weight choice, every margin size — they all communicate how much you care.",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=60",
  },
  {
    name: "Sasha Lin",
    designation: "Tech Director",
    quote:
      "Performance is a design feature. A page that loads instantly and responds to scroll interactively feels premium and respects the user.",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=60",
  },
  {
    name: "Noor Abadi",
    designation: "Motion Lead",
    quote:
      "Motion is our invisible signature. We build scroll-driven animations that highlight content reveals rather than creating distracting noise.",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=500&q=60",
  },
];

const HISTORY = [
  {
    year: "2013",
    title: "Origins",
    desc: "Founded as a London-based typography collective focused on editorial book design and custom layouts.",
  },
  {
    year: "2017",
    title: "Going Digital",
    desc: "Expanded to Lisbon, translating our classic print grids and structural standards into interactive WebGL and React experiences.",
  },
  {
    year: "2021",
    title: "Accolades",
    desc: "Received multiple Awwwards Site of the Day and CSSDA honors, proving that performance-first websites win global recognition.",
  },
  {
    year: "2026",
    title: "The Human Era",
    desc: "Refocused our studio ethos on the 'human-made' movement — eliminating stock template elements and generic 3D frameworks.",
  },
];

function About() {
  const historyRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!historyRef.current) return;
    const ctx = gsap.context(() => {
      // Draw progress line on scroll
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: historyRef.current,
              start: "top 45%",
              end: "bottom 75%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      const items = historyRef.current!.querySelectorAll("[data-history-item]");
      items.forEach((item) => {
        // Toggle active visual states on intersection
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          end: "bottom 35%",
          onToggle: (self) => {
            if (self.isActive) {
              item.classList.add("is-active");
            } else {
              item.classList.remove("is-active");
            }
          },
        });

        gsap.fromTo(
          item,
          { opacity: 0.15, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      });
    }, historyRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-48 pb-48 px-6 bg-background text-foreground transition-colors duration-500 font-sans">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
          — Studio Profile
        </span>
        <RevealText
          text="A small studio,"
          as="h1"
          className="font-serif text-5xl md:text-9xl font-normal leading-[1.1] pb-1 block"
        />
        <RevealText
          text="big convictions."
          as="h1"
          className="font-serif text-5xl md:text-9xl font-normal leading-[1.1] pb-1 block text-[var(--brand-pink)] italic"
          delay={300}
        />

        <div className="mt-24 grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <p className="font-serif text-2xl md:text-3xl font-light italic leading-normal text-foreground/90">
              Orivon is an independent design studio of seven obsessives based between London and
              Lisbon. We partner with founders to build products that move people.
            </p>
            <div className="text-base text-muted-foreground space-y-6 leading-relaxed font-sans pt-4 border-t border-border/60">
              <p>
                We believe great work is the result of taste, craft, and conviction — held in
                tension with curiosity and discipline. We design layouts that act as storytelling
                narratives, rejecting standard stock layouts.
              </p>
              <p>
                Since 2013, we've shipped 180+ projects for clients across fintech, fashion,
                aerospace, climate, and beyond.
              </p>
            </div>
          </div>

          {/* Styled Editorial Card instead of Stock Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            data-cursor-text="CREDO"
            className="relative aspect-[4/3] rounded-xl bg-[var(--brand-teal)] text-white p-10 flex flex-col justify-between border border-border"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest block mb-4">
                OUR PRINCIPLE // 01
              </span>
              <h3 className="font-serif text-3xl font-normal leading-tight">
                "We say no to a lot, so we can say{" "}
                <em className="italic text-[var(--brand-peach)]">yes well</em>."
              </h3>
            </div>
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono opacity-60">
              <span>ORIVON STUDIO</span>
              <span>EST. 2013</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Stacking Team testimonials */}
        <div className="mt-48">
          <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
            — The Minds
          </span>
          <h2 className="font-serif text-4xl md:text-7xl font-normal mb-4">
            Meet the <span className="text-[var(--brand-pink)] font-serif italic">team.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Seven obsessives, one studio. Standard typographic layout cards represent our leads.
          </p>
          <div
            className="rounded-xl border border-border bg-[var(--card)] overflow-hidden"
            data-cursor-text="LEADS"
          >
            <AnimatedTestimonials testimonials={TEAM} autoplay />
          </div>
        </div>

        {/* Timeline Section */}
        <div
          className="mt-48 grid lg:grid-cols-[1fr_2fr] gap-16 items-start"
          ref={historyRef}
          data-cursor-text="TIMELINE"
        >
          <div>
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
              — Our Journey
            </span>
            <h2 className="font-serif text-4xl md:text-7xl font-normal leading-tight">
              Our{" "}
              <span className="text-[var(--brand-pink)] font-serif italic block">Milestones.</span>
            </h2>
            <p className="text-muted-foreground text-sm font-sans mt-6 leading-relaxed max-w-sm">
              From our origins as a print collective to an award-winning interactive studio, we stay
              true to structural layouts and human-made craft.
            </p>
          </div>
          <div className="relative space-y-16 lg:pl-16">
            {/* Draw trail progress bar lines */}
            <div className="absolute left-0 top-3 bottom-3 w-[1px] bg-border hidden lg:block" />
            <div
              ref={progressLineRef}
              className="absolute left-0 top-3 bottom-3 w-[1px] bg-[var(--brand-pink)] hidden lg:block"
              style={{ transformOrigin: "top center", transform: "scaleY(0)" }}
            />

            {HISTORY.map((h) => (
              <div
                key={h.year}
                data-history-item
                className="relative grid md:grid-cols-[120px_1fr] gap-6 items-start group transition-all duration-300"
              >
                {/* Node dot intersecting the left path line */}
                <div className="absolute left-[-16px] top-4.5 translate-x-[-50%] z-10 hidden lg:block">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-border bg-background group-[.is-active]:border-[var(--brand-pink)] group-[.is-active]:bg-[var(--brand-pink)] transition-colors duration-300 shadow-sm" />
                </div>

                <div className="font-serif text-4xl md:text-5xl font-light text-[var(--brand-ochre)] leading-none transition-colors duration-300 group-[.is-active]:text-[var(--brand-pink)]">
                  {h.year}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-normal mb-2 text-foreground tracking-tight transition-colors duration-300 group-[.is-active]:text-[var(--brand-pink)]">
                    {h.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans max-w-xl">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Marquee */}
        <div className="mt-48">
          <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
            — Capabilities
          </span>
          <h2 className="font-serif text-4xl md:text-7xl font-normal mb-12">
            What <span className="text-[var(--brand-pink)] font-serif italic">we use.</span>
          </h2>
          <Marquee className="-mx-6">
            {SKILLS.map((s) => (
              <span
                key={s}
                className="text-3xl md:text-5xl font-serif font-normal flex items-center gap-12 text-foreground/60 hover:text-primary transition-colors"
              >
                {s} <span className="text-[var(--brand-pink)] font-sans">✦</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* Core Values */}
        <div className="mt-48 grid md:grid-cols-3 gap-8">
          {[
            { t: "Craft", c: "We obsess over the last 10%. It's where the design lives." },
            { t: "Transparency", c: "Direct conversations, clear scopes, and zero jargon." },
            { t: "Conviction", c: "We believe in what we build and design for longevity." },
          ].map((v) => (
            <SpotlightCard key={v.t} className="p-8 bg-[var(--card)] border border-border">
              <h3 className="font-serif text-2xl font-normal mb-3 text-[var(--brand-pink)]">
                {v.t}
              </h3>
              <p className="text-muted-foreground text-sm font-sans leading-relaxed">{v.c}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
}
