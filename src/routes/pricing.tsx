import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/RevealText";
import { NeonButton } from "@/components/ui/neon-button";
import { SpotlightCard } from "@/components/SpotlightCard";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const PRICING_LINES = [
  {
    index: "01",
    title: "Website Development",
    description:
      "From a single landing page to fully custom headless commerce — 18 categories benchmarked.",
    priceRange: "₹0.15L – ₹12L",
    delivery: "1–16 wks",
    categories: "18 categories",
    pdf: "/Orvion-Pricing-Website-Development.pdf",
  },
  {
    index: "02",
    title: "Mobile App Development",
    description:
      "Native Android/iOS, cross-platform builds, and full-stack mobile-plus-backend systems.",
    priceRange: "₹0.75L – ₹25L",
    delivery: "4–24 wks",
    categories: "8 categories",
    pdf: "/Orvion-Pricing-Mobile-App-Development.pdf",
  },
  {
    index: "03",
    title: "SaaS & Custom Software",
    description:
      "Sales, finance, HR, healthcare, logistics, retail and 12 verticals of business software.",
    priceRange: "₹1.5L – ₹60L",
    delivery: "4–32 wks",
    categories: "83 categories · 12 verticals",
    pdf: "/Orvion-Pricing-SaaS-Custom-Software.pdf",
  },
];

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
    <div className="relative pt-40 pb-32 px-6 overflow-hidden text-foreground transition-colors duration-500">
      <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-6xl text-center">
        <span className="text-xs text-[var(--brand-pink)] font-mono mb-4 inline-flex items-center gap-2">
          <Sparkles size={14} /> — Engagement Models
        </span>
        <RevealText
          text="Plans built for"
          as="h1"
          className="font-display text-4xl sm:text-6xl md:text-8xl font-bold leading-[0.9] block"
        />
        <RevealText
          text="ambitious teams."
          as="h1"
          className="font-display text-4xl sm:text-6xl md:text-8xl font-bold leading-[0.9] block text-[var(--brand-pink)]"
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

      {/* Cards — fanned, with the middle plan elevated */}
      <div className="relative mx-auto mt-24 flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-6">
        {plans.map((p, i) => {
          const rotate = i === 0 ? -5 : i === plans.length - 1 ? 5 : 0;
          const descClass = p.popular ? "text-white/70" : "text-muted-foreground";
          const subLabelClass = p.popular ? "text-white/50" : "text-muted-foreground";

          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: p.popular ? 60 : 40, rotate }}
              whileInView={{ opacity: 1, y: p.popular ? -20 : 0, rotate }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: p.popular ? 0.7 : 0.5, delay: i * 0.1 }}
              className={cn(
                "relative w-full max-w-xs rounded-2xl border p-8 transition-transform hover:scale-[1.03]",
                p.popular
                  ? "z-20 md:scale-110 md:hover:scale-[1.12] bg-[var(--brand-teal)] border-transparent text-white shadow-elegant"
                  : "z-10 bg-[var(--card)] border-border hover:border-[var(--brand-pink)]/40 text-foreground",
              )}
            >
              {p.popular && (
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-pink)] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest font-mono shadow"
                >
                  Most loved
                </motion.span>
              )}

              <h3 className="font-display text-2xl font-bold">{p.name}</h3>

              <div className="mt-6 flex items-end gap-1">
                <span
                  className={cn(
                    "font-display font-bold",
                    p.popular ? "text-5xl text-white" : "text-4xl text-[var(--brand-pink)]",
                  )}
                >
                  ${yearly ? p.yearlyPrice : p.price}k
                </span>
                <span className={cn("text-xs font-mono pb-2", subLabelClass)}>
                  /{yearly ? "year" : "engagement"}
                </span>
              </div>

              <p className={cn("mt-4 text-sm leading-relaxed", descClass)}>{p.description}</p>

              <p
                className={cn(
                  "text-[10px] font-mono uppercase tracking-widest mt-6 mb-3",
                  subLabelClass,
                )}
              >
                {p.includes[0]}
              </p>
              <ul className="space-y-2.5">
                {p.includes.slice(1).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={15}
                      className={cn(
                        "mt-0.5 shrink-0",
                        p.popular ? "text-white" : "text-[var(--brand-pink)]",
                      )}
                    />
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>

              <NeonButton
                variant={p.popular ? "solid" : "default"}
                size="lg"
                className={cn("mt-8 w-full", p.popular && "bg-white text-black hover:bg-white/90")}
              >
                {p.cta}
              </NeonButton>
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

      {/* India-market category pricing */}
      <div className="relative mx-auto mt-32 max-w-7xl">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--brand-pink)]">
            — India Market Pricing
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] tracking-tight mt-4">
            Fixed fee, <span className="text-[var(--brand-pink)] italic">not hourly.</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every build benchmarked against current India-market rates. Pick a service line below
            and download the full pricing breakdown for that category.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_LINES.map((line) => (
            <SpotlightCard
              key={line.index}
              className="p-8 bg-[var(--card)] border border-border flex flex-col justify-between h-full"
            >
              <div>
                <span className="font-serif text-5xl font-bold text-secondary/15 leading-none">
                  {line.index}
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-4">
                  {line.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {line.description}
                </p>

                <div className="mt-6 space-y-2 text-sm font-mono">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Market Price</span>
                    <span className="text-foreground font-semibold">{line.priceRange}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground font-semibold">{line.delivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scope</span>
                    <span className="text-foreground font-semibold">{line.categories}</span>
                  </div>
                </div>
              </div>

              <a
                href={line.pdf}
                download
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border hover:border-foreground px-6 py-3 text-xs font-semibold tracking-wide uppercase transition-colors"
              >
                Download Pricing PDF <Download size={14} />
              </a>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
}
