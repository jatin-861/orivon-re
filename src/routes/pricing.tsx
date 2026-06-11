import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/RevealText";
import { NeonButton } from "@/components/ui/neon-button";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const plans = [
  {
    name: "Sprint",
    description: "A focused 2–3 week burst for landing pages, brand refreshes or launch moments.",
    price: 12,
    yearlyPrice: 99,
    cta: "Start a sprint",
    popular: false,
    includes: [
      "Includes:",
      "Discovery & strategy session",
      "1 senior designer + 1 engineer",
      "Up to 3 page templates",
      "Motion micro-interactions",
      "Async daily updates",
      "30-day post-launch support",
    ],
  },
  {
    name: "Studio",
    description: "Our flagship engagement — full brand systems, websites and product UI.",
    price: 48,
    yearlyPrice: 399,
    cta: "Book the studio",
    popular: true,
    includes: [
      "Everything in Sprint, plus:",
      "Dedicated cross-functional team",
      "Brand strategy + identity system",
      "Up to 12 page templates / flows",
      "Custom motion transitions",
      "CMS integration",
      "Quarterly evolution roadmap",
    ],
  },
  {
    name: "Atelier",
    description: "An embedded partnership for in-house teams scaling design across the org.",
    price: 96,
    yearlyPrice: 899,
    cta: "Talk to founders",
    popular: false,
    includes: [
      "Everything in Studio, plus:",
      "Embedded design + eng pod",
      "Design system + governance",
      "Unlimited templates / surfaces",
      "Native motion direction",
      "Weekly senior reviews",
      "12-month strategic partnership",
    ],
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="relative pt-40 pb-32 px-6 overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-6xl text-center">
        <span className="text-xs text-[var(--brand-pink)] font-mono mb-4 inline-flex items-center gap-2">
          <Sparkles size={14} /> — Engagement Models
        </span>
        <RevealText
          text="Plans built for"
          as="h1"
          className="font-display text-5xl md:text-8xl font-bold leading-[0.9] block"
        />
        <RevealText
          text="ambitious teams."
          as="h1"
          className="font-display text-5xl md:text-8xl font-bold leading-[0.9] block text-[var(--brand-pink)]"
          delay={300}
        />
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Transparent fixed-fee partnerships. Pick the cadence that fits — every plan ships with
          award-grade human-made craft.
        </p>

        {/* Billing toggle */}
        <div className="mt-12 inline-flex items-center rounded-full bg-[var(--card)] border border-border p-1">
          {[
            { k: "monthly", label: "Monthly" },
            { k: "yearly", label: "Yearly · save 15%" },
          ].map((opt) => {
            const active = (opt.k === "yearly") === yearly;
            return (
              <button
                key={opt.k}
                onClick={() => setYearly(opt.k === "yearly")}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bill-toggle"
                    className="absolute inset-0 rounded-full bg-[var(--brand-pink)]/50 border border-[var(--brand-pink)]/20 z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="relative mx-auto mt-20 grid max-w-7xl gap-8 md:grid-cols-3">
        {plans.map((p, i) => {
          const cardClass = p.popular
            ? "bg-[var(--brand-teal)] text-white border-transparent shadow-elegant"
            : "bg-[var(--card)] border-border hover:border-[var(--brand-pink)]/40 text-foreground";

          const descClass = p.popular ? "text-white/70" : "text-muted-foreground";
          const subLabelClass = p.popular ? "text-white/50" : "text-muted-foreground";

          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative rounded-xl p-8 md:p-10 border transition-all flex flex-col justify-between",
                cardClass,
              )}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-pink)] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest font-mono">
                  Most loved
                </span>
              )}

              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">{p.name}</h3>

                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-6xl font-bold text-[var(--brand-pink)]">
                    ${yearly ? p.yearlyPrice : p.price}k
                  </span>
                  <span className={cn("text-xs font-mono pb-2", subLabelClass)}>
                    /{yearly ? "year" : "engagement"}
                  </span>
                </div>

                <p className={cn("mt-4 text-sm leading-relaxed", descClass)}>{p.description}</p>
              </div>

              <div>
                <NeonButton
                  variant={p.popular ? "solid" : "default"}
                  size="lg"
                  className={cn(
                    "mt-8 w-full",
                    p.popular && "bg-white text-black hover:bg-white/90",
                  )}
                >
                  {p.cta}
                </NeonButton>

                <div className="mt-8 space-y-3">
                  <p
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-widest mb-3",
                      subLabelClass,
                    )}
                  >
                    {p.includes[0]}
                  </p>
                  {p.includes.slice(1).map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        className={cn(
                          "mt-0.5 shrink-0",
                          p.popular ? "text-white" : "text-[var(--brand-pink)]",
                        )}
                      />
                      <span className="opacity-90">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative mt-20 text-center text-sm text-muted-foreground font-mono">
        Custom scope?{" "}
        <a href="/contact" className="text-[var(--brand-pink)] hover:underline">
          Tell us about your project →
        </a>
      </div>
    </div>
  );
}
