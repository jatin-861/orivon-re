import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { BentoTilt } from "@/components/BentoTilt";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/work/")({
  component: WorkPage,
});

// Color mapping for project showcases
const brandColors: Record<string, { bg: string; text: string }> = {
  neurodashboard: { bg: "bg-[var(--brand-pink)]", text: "text-white" },
  "shade-ledger": { bg: "bg-[var(--brand-ochre)]", text: "text-white" },
  "smart-parking": { bg: "bg-[var(--brand-peach)]", text: "text-white" },
  "carbon-compass": { bg: "bg-[var(--brand-teal)]", text: "text-white" },
};

function WorkPage() {
  const cats = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="pb-32 text-foreground transition-colors duration-500">
      <SEO
        title="Work — Orvion.co"
        description="Selected projects by Orvion.co — NeuroDashboard, Shade Ledger, Smart Parking, and Carbon Compass. Full case studies with tech stack, scope, and architecture."
        canonical="https://orvion.co/work"
        ogImage="https://orvion.co/og-image.png"
      />
      <HeroGeometric
        badge="Selected Work"
        title1="Things we've"
        title2="built & shipped."
        description="Four real systems — from a multi-module AI platform to production billing automation. Each one is live, running, or open source."
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2 mt-4">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm transition-all border ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary shadow-glow-cyan"
                  : "border-border glass hover:border-primary/40 text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-x-8 gap-y-16">
          {items.map((p, i) => {
            const colors = brandColors[p.slug] || {
              bg: "bg-[var(--brand-pink)]",
              text: "text-white",
            };
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                className={i % 2 === 1 ? "md:translate-y-20" : ""}
              >
                <Link to="/work/$slug" params={{ slug: p.slug }} className="group block">
                  {/* Human-made editorial cover card with background image overlay */}
                  <BentoTilt className="w-full h-full">
                    <div
                      className={`relative overflow-hidden rounded-xl aspect-[4/3] p-8 border border-border/10 flex flex-col justify-between shadow-elegant transition-transform duration-700 group-hover:scale-[1.02] ${colors.bg} ${colors.text}`}
                    >
                      {/* Top row */}
                      <div className="relative z-10 flex items-center justify-end gap-2 opacity-90 font-mono text-xs">
                        <span className="border border-current/30 rounded-full px-2 py-0.5">
                          {p.category}
                        </span>
                        <span className="border border-current/30 rounded-full px-2 py-0.5">
                          {p.year}
                        </span>
                      </div>

                      {/* Middle Graphic Layout representation */}
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          className="theme-shot absolute inset-0 w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="relative z-10 my-auto py-6 flex items-center justify-center">
                          <div className="w-full max-w-xs h-24 rounded-lg border border-current/15 bg-white/5 backdrop-blur-sm p-4 flex flex-col justify-between">
                            <div className="h-1.5 w-16 bg-current/25 rounded-full" />
                            <div className="h-3 w-32 bg-current/40 rounded-full" />
                          </div>
                        </div>
                      )}

                      {/* Bottom row */}
                      <div className="relative z-10 flex justify-end items-end">
                        <div className="rounded-full bg-white/10 backdrop-blur-md p-3 border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  </BentoTilt>

                  <div className="mt-5">
                    <h2 className="font-display text-3xl font-bold group-hover:text-[var(--brand-pink)] transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-muted-foreground mt-2">{p.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24 pt-16 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl md:text-3xl font-normal">
              Want to know who built this?
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-sans">
              Two engineers. Every system, end to end.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)] px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Meet the engineers <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
