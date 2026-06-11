import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

function ScrollParallaxImage({ src, alt, className }: ScrollParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const ctx = gsap.context(() => {
      // Offset vertical scroll layout speed
      gsap.fromTo(
        image,
        { y: "-10%" },
        {
          y: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [src]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn("absolute inset-0 w-full h-full object-cover scale-[1.2]", className)}
      />
    </div>
  );
}

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  notFoundComponent: () => (
    <div className="min-h-screen pt-40 px-6 text-center bg-background">
      <h1 className="font-display text-5xl font-bold">Project not found</h1>
      <Link to="/work" className="mt-6 inline-flex text-primary">
        ← Back to work
      </Link>
    </div>
  ),
  component: CaseStudy,
});

const brandColors: Record<string, { bg: string; text: string; details: string }> = {
  "lumen-finance": { bg: "bg-[var(--brand-pink)]", text: "text-white", details: "LUMEN FINANCE" },
  "noctis-music": {
    bg: "bg-[var(--brand-lavender)]",
    text: "text-black",
    details: "NOCTIS RECORDS",
  },
  "orbit-aerospace": { bg: "bg-[var(--brand-peach)]", text: "text-black", details: "ORBIT SPACE" },
  "verdant-eco": { bg: "bg-[var(--brand-ochre)]", text: "text-black", details: "VERDANT CLIMATE" },
  "atelier-fashion": {
    bg: "bg-[var(--brand-teal)]",
    text: "text-white",
    details: "ATELIER FASHION",
  },
  "halo-health": { bg: "bg-[var(--brand-coral)]", text: "text-white", details: "HALO HEALTH" },
};

const brandCovers: Record<string, string> = {
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=65",
  "noctis-music":
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=65",
  "orbit-aerospace":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=65",
  "verdant-eco":
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=65",
  "atelier-fashion":
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=65",
  "halo-health":
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=65",
};

function CaseStudy() {
  const p = Route.useLoaderData();
  const others = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 2);
  const colors = brandColors[p.slug] || {
    bg: "bg-[var(--brand-pink)]",
    text: "text-white",
    details: "CASE_STUDY",
  };
  const coverUrl = brandCovers[p.slug];

  return (
    <div className="pt-32 pb-24 bg-background text-foreground transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand-pink)] transition-colors mb-12 font-mono"
        >
          <ArrowLeft size={16} /> All work
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--brand-pink)] mb-4 block">
            — {p.category} · {p.year}
          </span>
          <h1 className="font-display text-5xl md:text-8xl font-bold leading-[0.9] tracking-tight">
            {p.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {p.description}
          </p>
        </motion.div>

        {/* Bespoke Typography & Shape cover with real desaturated photo background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-16 relative overflow-hidden rounded-xl border border-border aspect-[16/8] p-12 flex flex-col justify-between shadow-elegant ${colors.bg} ${colors.text}`}
        >
          {coverUrl && (
            <ScrollParallaxImage
              src={coverUrl}
              alt={p.title}
              className="saturate-50 contrast-[1.1] opacity-35 mix-blend-multiply"
            />
          )}
          <div className="relative z-10">
            <span className="text-xs font-mono opacity-80 uppercase tracking-widest block mb-4">
              CASE STUDY COVER // {colors.details}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-none tracking-tighter">
              {p.client} Case Show
            </h2>
          </div>
          <div className="relative z-10 flex justify-between items-center text-xs font-mono opacity-80">
            <span>DESIGNED BY ORIVON</span>
            <span>SHIPPED Q3 2026</span>
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Meta label="Client" value={p.client} />
          <Meta label="Year" value={p.year} />
          <Meta label="Services" value={p.services.join(" · ")} />
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-12 items-start">
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-[var(--brand-pink)]">The challenge</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {p.client} came to us looking to redefine their digital presence. The existing
            experience was dated and didn't reflect the ambition of the brand. Our task: create a
            world-class flagship site that would set the new bar in {p.category.toLowerCase()}{" "}
            without relying on stock frameworks.
          </p>
        </div>

        {/* Detailed custom mockups instead of Unsplash images */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-xl border border-border aspect-[4/3] p-8 bg-[var(--card)] flex flex-col justify-between shadow-elegant"
          >
            <div>
              <span className="text-[10px] font-mono text-[var(--brand-pink)] uppercase tracking-wider block mb-4">
                Mockup 01 // Typography System
              </span>
              <h4 className="font-display text-2xl font-bold mb-3">Modular Typography Scale</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A customized layout scale combining bold headings with clear, reading-optimized body
                copy to maximize conversion and engagement.
              </p>
            </div>
            <div className="h-20 border border-border/80 rounded-lg bg-background/50 flex flex-col justify-center px-4 space-y-2">
              <div className="h-2 w-24 bg-[var(--brand-pink)] rounded-full" />
              <div className="h-1.5 w-full bg-border rounded-full" />
              <div className="h-1.5 w-5/6 bg-border rounded-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-xl border border-border aspect-[4/3] p-8 bg-[var(--card)] flex flex-col justify-between shadow-elegant"
          >
            <div>
              <span className="text-[10px] font-mono text-[var(--brand-pink)] uppercase tracking-wider block mb-4">
                Mockup 02 // Interface Grid
              </span>
              <h4 className="font-display text-2xl font-bold mb-3">Fluid Interface Layout</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Responsive layouts optimized for touch and desktop. Generous spacing allows
                components to breathe, highlighting key callouts.
              </p>
            </div>
            <div className="h-20 border border-border/80 rounded-lg bg-background/50 flex items-center justify-around">
              <div className="h-12 w-12 rounded-md bg-[var(--brand-peach)]" />
              <div className="h-12 w-12 rounded-md bg-[var(--brand-lavender)]" />
              <div className="h-12 w-12 rounded-md bg-[var(--brand-teal)]" />
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-12 items-start">
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-[var(--brand-pink)]">The outcome</span>
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              We built a system that scales — from brand fundamentals to a custom design system, a
              fully responsive marketing site, and a re-architected onboarding flow.
            </p>
            <p>
              The new experience launched to wide industry recognition, with picks on Awwwards, FWA
              and a 38% lift in qualified leads in the first quarter.
            </p>
          </div>
        </div>

        {/* Styled list for Next Projects */}
        <div className="mt-32">
          <h3 className="font-display text-3xl font-bold mb-8">Next projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {others.map((o) => {
              const otherColors = brandColors[o.slug] || {
                bg: "bg-[var(--brand-pink)]",
                text: "text-white",
              };
              const nextCoverUrl = brandCovers[o.slug];
              return (
                <Link
                  key={o.slug}
                  to="/work/$slug"
                  params={{ slug: o.slug }}
                  className={`group block relative overflow-hidden rounded-xl border border-border/10 aspect-[16/10] p-8 flex flex-col justify-between shadow-elegant ${otherColors.bg} ${otherColors.text}`}
                >
                  {nextCoverUrl && (
                    <img
                      src={nextCoverUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover saturate-50 contrast-[1.1] opacity-35 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-50"
                    />
                  )}
                  <div className="relative z-10 flex justify-between items-center opacity-85 font-mono text-xs">
                    <span>NEXT CASE</span>
                    <span>{o.category}</span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-display text-3xl font-bold tracking-tight mb-2 group-hover:underline">
                      {o.title.split(" — ")[0]}
                    </h4>
                    <p className="text-xs opacity-80 font-mono">EXPLORE CASE STUDY →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
        {label}
      </div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
