import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Globe2, Smartphone, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/SpotlightCard";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const PRICING_LINES = [
  {
    index: "01",
    title: "Website Development",
    description:
      "From a single landing page to fully custom headless commerce — 18 categories, fixed fee.",
    priceRange: "₹20k – ₹10L",
    delivery: "1–17 wks",
    categories: "18 categories",
    pdf: "/Orvion-Pricing-Website-Development.pdf",
    Icon: Globe2,
  },
  {
    index: "02",
    title: "Mobile App Development",
    description:
      "Native Android/iOS, cross-platform builds, and full-stack mobile-plus-backend systems.",
    priceRange: "₹60k – ₹21L",
    delivery: "4–27 wks",
    categories: "8 categories",
    pdf: "/Orvion-Pricing-Mobile-App-Development.pdf",
    Icon: Smartphone,
    badge: "Most Requested",
  },
  {
    index: "03",
    title: "Automation & SaaS",
    description:
      "WhatsApp bots, AI agents, RPA — plus 83 SaaS categories across 12 business verticals.",
    priceRange: "₹35k – ₹55L",
    delivery: "1–35 wks",
    categories: "105 categories · 12 verticals",
    pdf: "/Orvion-Pricing-SaaS-Custom-Software.pdf",
    Icon: Layers,
  },
];

function PricingPage() {
  return (
    <div className="relative pt-40 pb-32 px-6 overflow-hidden text-foreground transition-colors duration-500">
      <SEO
        title="Pricing — Orvion.co"
        description="Transparent, fixed-fee pricing for website development, mobile apps, and SaaS — benchmarked against India market rates. Download the full pricing PDF."
        canonical="https://orvion.co/pricing"
        ogImage="https://orvion.co/og-image.png"
      />
      <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

      {/* India-market category pricing */}
      <div className="relative mx-auto max-w-7xl">
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

        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-6">
          {PRICING_LINES.map((line, i) => {
            const rotate = i === 0 ? -5 : i === PRICING_LINES.length - 1 ? 5 : 0;
            const featured = i === 1;
            return (
              <motion.div
                key={line.index}
                initial={{ opacity: 0, y: featured ? 60 : 40, rotate }}
                whileInView={{ opacity: 1, y: featured ? -20 : 0, rotate }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: featured ? 0.7 : 0.5, delay: i * 0.1 }}
                className={cn(
                  "group relative w-full max-w-xs transition-transform duration-300 hover:rotate-0 hover:scale-[1.04] hover:-translate-y-2",
                  featured && "z-20 md:scale-110 md:hover:scale-[1.12] md:hover:-translate-y-3",
                )}
              >
                {line.badge && (
                  <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--brand-pink)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white font-mono shadow-elegant">
                    {line.badge}
                  </span>
                )}
                <SpotlightCard
                  className={cn(
                    "p-8 rounded-2xl bg-[var(--card)] border flex flex-col justify-between h-full transition-shadow duration-300",
                    featured
                      ? "border-[var(--brand-pink)]/40 shadow-elegant group-hover:shadow-glow-cyan"
                      : "border-border hover:border-[var(--brand-pink)]/40",
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="font-serif text-5xl font-bold text-secondary/15 leading-none">
                        {line.index}
                      </span>
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                          featured
                            ? "bg-[var(--brand-pink)] text-white"
                            : "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] group-hover:bg-[var(--brand-pink)] group-hover:text-white",
                        )}
                      >
                        <line.Icon size={18} />
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mt-4">
                      {line.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {line.description}
                    </p>

                    <div className="mt-6 space-y-2 text-sm font-mono">
                      <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Orvion Price</span>
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
                    className={cn(
                      "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold tracking-wide uppercase transition-colors",
                      featured
                        ? "bg-[var(--brand-pink)] text-white hover:bg-[var(--brand-pink)]/90"
                        : "border border-border hover:border-[var(--brand-pink)]/40",
                    )}
                  >
                    Download Pricing PDF <Download size={14} />
                  </a>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Combined full report download */}
      <div className="relative mt-16 flex flex-col items-center gap-4">
        <a
          href="/Orvion-Pricing-Intelligence-Report.pdf"
          download
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-pink)]/40 bg-[var(--card)] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--brand-pink)] font-mono shadow-elegant transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
        >
          <Download size={14} />
          Download Full Pricing Report (All Sections)
        </a>
        <p className="text-xs text-muted-foreground font-mono">
          One PDF — Website · Mobile · Automation · SaaS · Add-ons
        </p>
      </div>

      <div className="relative mt-10 text-center text-sm text-muted-foreground font-mono">
        Custom scope?{" "}
        <a href="/contact" className="text-[var(--brand-pink)] hover:underline">
          Tell us about your project →
        </a>
      </div>
    </div>
  );
}
