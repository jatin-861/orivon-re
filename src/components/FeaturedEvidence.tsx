import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";

export function FeaturedEvidence() {
  return (
    <section
      className="py-24 px-6 bg-[var(--muted)] border-y border-border relative z-10"
      data-cursor-text="PROOF"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--brand-pink)] mb-8">
          — The Work
        </div>

        <div className="mb-12">
          <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-tight mb-2">
            Shade Ledger
          </h2>
          <p className="font-serif text-4xl md:text-6xl font-normal italic text-[var(--brand-pink)]">
            billing that runs itself.
          </p>
          <p className="text-base md:text-lg text-muted-foreground font-sans mt-6 max-w-2xl leading-relaxed">
            Replaced manual Excel billing and phone calls for a real property owner. Still running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SpotlightCard className="bg-[var(--card)] border border-border p-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Before
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Manual Excel billing and phone calls every month — 40+ hours of admin work.
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-[var(--card)] border border-border p-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--brand-pink)] mb-3">
              After
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Automatic invoices, WhatsApp reminders, and penalty tracking — every billing cycle,
              without intervention.
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-[var(--card)] border border-border p-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Live since 2025
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              220 rental units in Mumbai. Running without interruption for over a year.
            </p>
          </SpotlightCard>
        </div>

        <div className="mb-10 max-w-2xl">
          <div className="text-6xl font-serif text-[var(--brand-pink)] leading-none mb-3">"</div>
          <p className="font-serif text-xl md:text-2xl font-normal text-foreground leading-snug mb-5">
            Billing used to eat a whole afternoon every month. Now it just runs — invoices,
            reminders, the lot.
          </p>
          <div className="border-t border-border/60 pt-4">
            <p className="text-sm font-semibold text-foreground">Property Management Client</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Mumbai · 220 rental units · Shade Ledger, 2025
            </p>
          </div>
        </div>

        <Link
          to="/work/$slug"
          params={{ slug: "shade-ledger" }}
          className="text-[var(--brand-pink)] font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          See the full case study <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
