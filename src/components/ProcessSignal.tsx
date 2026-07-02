import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { BentoTilt } from "@/components/BentoTilt";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "We start by understanding the problem — stakeholder goals, constraints, and what success looks like.",
  },
  {
    n: "02",
    title: "Build",
    desc: "Engineering and design ship together — real working software from week one, not lorem ipsum mocks.",
  },
  {
    n: "03",
    title: "Ship",
    desc: "QA across devices, performance checks, then launch with confidence. Your system runs, or we fix it.",
  },
];

export function ProcessSignal() {
  return (
    <section
      className="py-24 px-6 border-y border-border relative z-10 bg-background/50 backdrop-blur-sm"
      data-cursor-text="PROCESS"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--brand-pink)] mb-8">
          — How we work
        </div>

        <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-3">
          From first conversation to running in production.
        </h2>
        <p className="text-sm md:text-base text-muted-foreground font-sans mb-12">
          Three steps. Fixed scope. No surprises.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.n}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <BentoTilt className="h-full w-full">
                <SpotlightCard className="bg-[var(--card)] border border-border p-8 h-full">
                  <div className="font-serif text-[5rem] font-bold leading-none text-foreground/10 select-none">
                    {step.n}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </SpotlightCard>
              </BentoTilt>
            </motion.div>
          ))}
        </div>

        <Link
          to="/process"
          className="text-[var(--brand-pink)] font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          See how we work <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
