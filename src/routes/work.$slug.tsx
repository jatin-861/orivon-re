import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/data/projects";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  notFoundComponent: () => (
    <div className="min-h-screen pt-40 px-6 text-center">
      <h1 className="font-display text-5xl font-bold">Project not found</h1>
      <Link to="/work" className="mt-6 inline-flex text-primary">
        ← Back to work
      </Link>
    </div>
  ),
  component: CaseStudy,
});

const brandColors: Record<string, { bg: string; text: string }> = {
  neurodashboard: { bg: "bg-[var(--brand-pink)]", text: "text-white" },
  "shade-ledger": { bg: "bg-[var(--brand-ochre)]", text: "text-white" },
  "smart-parking": { bg: "bg-[var(--brand-peach)]", text: "text-white" },
  "carbon-compass": { bg: "bg-[var(--brand-teal)]", text: "text-white" },
};

// Business-translated descriptions for each NeuroDashboard module
const MODULE_DETAILS: Record<string, string> = {
  "Knowledge Hub":
    "Find answers instantly across all your documents and notes — semantic search powered by pgvector, not just keyword matching.",
  "Analytics Dashboard":
    "See how the platform is being used at a glance — activity, trends, and usage broken down by workspace.",
  "AI Insights Engine":
    "Keeps working even if one AI provider goes down — routes between OpenRouter, Gemini, and Qwen so the right model is always available.",
  "Workflow Automation":
    "Heavy tasks run in the background so the app never feels slow — async job processing with BullMQ and Redis.",
  "Notes System":
    "Multiple people can work on the same notes at once, and everyone sees updates immediately — real-time collaboration over Socket.IO.",
  "Document Processing Pipeline":
    "Documents are automatically ingested, chunked, and indexed so they're searchable the moment they're uploaded.",
};

function CaseStudy() {
  const p = Route.useLoaderData();
  const others = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 2);
  const colors = brandColors[p.slug] || {
    bg: "bg-[var(--brand-pink)]",
    text: "text-white",
  };

  return (
    <div className="pt-32 pb-24 text-foreground transition-colors duration-500">
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
          <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight">
            {p.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {p.description}
          </p>
        </motion.div>

        {/* Cover banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-16 relative overflow-hidden rounded-2xl border border-white/15 shadow-elegant ${colors.bg} ${colors.text}`}
        >
          {/* Depth — directional gradient + soft highlight bloom so the flat fill reads premium */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30"
            aria-hidden="true"
          />
          <div
            className="absolute -top-1/4 -left-[8%] h-[65%] w-[55%] rounded-full bg-white/20 blur-[110px]"
            aria-hidden="true"
          />

          <div
            className={`relative grid items-center gap-8 p-7 sm:p-10 md:gap-12 md:p-12 ${
              p.image ? "md:grid-cols-[0.82fr_1.18fr]" : ""
            }`}
          >
            {/* Text — frosted glass panel */}
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl md:p-7">
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
                Case Study — {p.category}
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-5xl">
                {p.client}
              </h2>
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[11px] uppercase tracking-wider opacity-80">
                <span>Built by Saral Banker</span>
                <span>{p.year}</span>
              </div>
            </div>

            {/* Product shot — large focal point, gently tilted with a soft cast shadow */}
            {p.image && (
              <div
                className="relative"
                style={{ transform: "perspective(1600px) rotateX(3deg) rotateY(-7deg)" }}
              >
                <div
                  className="absolute -inset-6 rounded-[2rem] bg-black/30 blur-3xl"
                  aria-hidden="true"
                />
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="theme-shot relative h-auto w-full rounded-xl border border-white/20 shadow-2xl"
                />
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Meta label="Client" value={p.client} />
          <Meta label="Year" value={p.year} />
          <Meta label="Stack" value={p.services.join(" · ")} />
        </div>

        {p.modules ? <NeuroDashboardCaseStudy /> : <SimpleCaseStudy slug={p.slug} link={p.link} />}

        {/* Next projects */}
        <div className="mt-32">
          <h3 className="font-display text-3xl font-bold mb-8">Next projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {others.map((o) => {
              const otherColors = brandColors[o.slug] || {
                bg: "bg-[var(--brand-pink)]",
                text: "text-white",
              };
              return (
                <Link
                  key={o.slug}
                  to="/work/$slug"
                  params={{ slug: o.slug }}
                  className={`group relative block overflow-hidden rounded-xl border border-white/15 aspect-[16/10] p-8 shadow-elegant ${otherColors.bg} ${otherColors.text}`}
                >
                  {/* Depth — matches the cover banner treatment */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/30"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -top-1/4 -left-[8%] h-[55%] w-[50%] rounded-full bg-white/15 blur-[90px]"
                    aria-hidden="true"
                  />

                  {/* Product shot peeking from the right */}
                  {o.image && (
                    <div
                      className="absolute right-[-8%] top-1/2 w-[58%] -translate-y-1/2"
                      aria-hidden="true"
                    >
                      <div style={{ transform: "perspective(1400px) rotateX(3deg) rotateY(-9deg)" }}>
                        <div className="absolute -inset-5 rounded-[1.5rem] bg-black/30 blur-2xl" />
                        <img
                          src={o.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="theme-shot relative h-auto w-full rounded-lg border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Scrim so the title stays readable over the image */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex justify-between items-center opacity-85 font-mono text-xs">
                      <span>NEXT CASE</span>
                      <span>{o.category}</span>
                    </div>
                    <div>
                      <h4 className="font-display text-3xl font-bold tracking-tight mb-2 group-hover:underline">
                        {o.title.split(" — ")[0]}
                      </h4>
                      <p className="text-xs opacity-80 font-mono">EXPLORE CASE STUDY →</p>
                    </div>
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

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="mt-24 grid md:grid-cols-2 gap-12 items-start">
      <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
        <span className="text-[var(--brand-pink)]">{heading}</span>
      </h2>
      <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

// Full platform case-study structure for NeuroDashboard
function NeuroDashboardCaseStudy() {
  const project = PROJECTS.find((p) => p.slug === "neurodashboard")!;

  return (
    <>
      <Section heading="Executive summary">
        <p>
          NeuroDashboard is a multi-module AI platform — over 70,000 lines of production code, built
          and shipped end to end. It's the proof behind a simple belief: if it doesn't run in
          production, it doesn't count.
        </p>
      </Section>

      <Section heading="The problem">
        <p>
          Information ends up scattered — notes, documents, tasks, and conversations live in
          different tools that don't talk to each other. Finding an answer means digging through
          five places at once, and busywork piles up around all of it.
        </p>
      </Section>

      <Section heading="Why it exists">
        <p>
          NeuroDashboard puts that information in one place, makes it instantly searchable, and
          automates the busywork around it — without depending on a single AI provider that might go
          down.
        </p>
      </Section>

      <Section heading="Platform architecture">
        <p>
          A React frontend talks to a Node.js/Express API backed by PostgreSQL with pgvector for
          semantic search. Redis and BullMQ handle background jobs so heavy work never blocks the
          UI. Socket.IO keeps collaborators in sync in real time. AI requests route across
          OpenRouter, Gemini, and Qwen so the platform keeps working even if one provider is down.
          CI/CD runs on GitHub Actions, with Sentry and Prometheus watching for problems before
          users notice.
        </p>
      </Section>

      {/* Module architecture — Knowledge Hub leads as the flagship module */}
      <div className="mt-24">
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-12">
          <span className="text-[var(--brand-pink)]">Module architecture</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {project.modules!.map((m, i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-[var(--card)] p-6"
            >
              <span className="text-[10px] font-mono text-[var(--brand-pink)] uppercase tracking-wider block mb-3">
                MODULE // {i === 0 ? "FLAGSHIP" : `0${i + 1}`}
              </span>
              <h4 className="font-display text-xl font-bold mb-2">{m}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {MODULE_DETAILS[m] ?? "Part of the integrated NeuroDashboard platform."}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Section heading="Engineering decisions">
        <ul className="space-y-3 list-disc pl-5">
          <li>Multi-provider LLM routing instead of a single API — no single point of failure.</li>
          <li>
            pgvector for semantic search instead of a separate vector database — one less moving
            part.
          </li>
          <li>Async job queue (BullMQ/Redis) for anything that doesn't need to block the UI.</li>
          <li>Multi-tenant access control so each workspace only sees its own data.</li>
        </ul>
      </Section>

      <Section heading="Technical challenges">
        <ul className="space-y-3 list-disc pl-5">
          <li>Keeping semantic search fast as the document index grows.</li>
          <li>Handling AI provider outages and rate limits gracefully, mid-request.</li>
          <li>Keeping real-time collaboration consistent across modules.</li>
          <li>Making document ingestion reliable for messy, real-world files.</li>
        </ul>
      </Section>

      <Section heading="Current state">
        <p>
          NeuroDashboard is live and in active use across its core modules — Knowledge Hub, Notes,
          Tasks, and the AI Insights Engine are running in production today.
        </p>
      </Section>

      <Section heading="Future roadmap">
        <ul className="space-y-3 list-disc pl-5">
          <li>Additional AI provider fallbacks and model routing improvements.</li>
          <li>Expanded analytics across workspaces.</li>
          <li>A mobile-friendly companion experience.</li>
        </ul>
      </Section>

      <Section heading="Lessons learned">
        <p>
          Shipping the whole stack — not just the demo — is what separates a prototype from a
          platform. Every module here had to handle real data, real failures, and real users before
          it counted as "done."
        </p>
      </Section>

      {project.link && (
        <div className="mt-16">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary/50 transition-colors"
          >
            View on GitHub <ExternalLink size={16} />
          </a>
        </div>
      )}
    </>
  );
}

// Simpler structure for the other 3 projects
const SIMPLE_CONTENT: Record<string, { whatItDoes: string; howItWorks: string[] }> = {
  "shade-ledger": {
    whatItDoes:
      "Replaces manual Excel billing and phone calls with automatic invoices, reminders, and penalty tracking for a real property owner's rental units.",
    howItWorks: [
      "Generates and sends PDF invoices automatically every billing cycle (react-pdf).",
      "Sends payment reminders and late-fee notices over WhatsApp (WhatsApp Business API).",
      "Tracks payment status per unit so nothing falls through the cracks.",
      "Running live for 220 rental units, saving 40+ hours of manual work every month.",
    ],
  },
  "smart-parking": {
    whatItDoes:
      "A full-stack system for managing parking availability — drivers see open spots in real time and book one instantly.",
    howItWorks: [
      "Real-time availability updates as spots are booked or freed.",
      "Booking flow reserves a spot end to end, from search to confirmation.",
      "Built with React, Node.js, Express, and MongoDB.",
    ],
  },
  "carbon-compass": {
    whatItDoes:
      "A personal carbon-tracking app that shows your environmental footprint and where to cut back.",
    howItWorks: [
      "Tracks everyday activities and converts them into estimated carbon impact.",
      "Surfaces the biggest contributors so users know where to focus.",
      "Built with React, Node.js, Express, and MongoDB.",
    ],
  },
};

function SimpleCaseStudy({ slug, link }: { slug: string; link?: string }) {
  const content = SIMPLE_CONTENT[slug];
  if (!content) return null;

  return (
    <>
      <Section heading="What it does">
        <p>{content.whatItDoes}</p>
      </Section>

      <Section heading="How it works">
        <ul className="space-y-3 list-disc pl-5">
          {content.howItWorks.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      {link && (
        <div className="mt-16">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary/50 transition-colors"
          >
            View on GitHub <ExternalLink size={16} />
          </a>
        </div>
      )}
    </>
  );
}
