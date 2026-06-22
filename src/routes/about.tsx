import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/RevealText";
import { Marquee } from "@/components/Marquee";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AnimatedTestimonials } from "@/components/AnimatedTestimonials";
import { BentoTilt } from "@/components/BentoTilt";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/about")({
  component: About,
});

function CodeTypingSimulator() {
  const [code, setCode] = useState("");
  const codeSnippet = `const system = buildSystem({
  stack: "full",
  scope: "db-to-deploy",
  reliability: "production",
});

await system.deploy({
  ci: "GitHub Actions",
  monitoring: true,
  launch: true,
});`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCode(codeSnippet.slice(0, index));
      index++;
      if (index > codeSnippet.length) {
        setTimeout(() => {
          index = 0;
        }, 2500); // Pause before looping
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre className="font-mono text-[10px] md:text-xs text-[#FAF7F2] bg-[#1A1A1A] p-4 rounded-xl border border-white/5 h-36 overflow-y-auto leading-relaxed shadow-inner">
      <code className="text-[var(--brand-pink)]">{code}</code>
      <span className="animate-pulse bg-[var(--brand-pink)] h-3.5 w-1.5 inline-block align-middle ml-0.5" />
    </pre>
  );
}

function TerminalLogSimulator() {
  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);
  const nextId = useRef(0);
  const logPool = [
    "$ npm run build",
    "vite v7.3.1 building for production...",
    "transforming...",
    "✓ 285 modules transformed.",
    "rendering chunks...",
    "✓ built in 1.45s",
    "$ node server.js",
    "server running on port 8080",
    "database: connected successfully [MySQL]",
    "redis cache: initialized",
    "GET /api/v1/projects 200 OK - 12ms",
    "POST /api/v1/inquiries 201 Created - 48ms",
    "backup system: cron scheduled",
    "status: operational (100%)",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, { id: nextId.current++, text: logPool[index] }];
        if (next.length > 5) next.shift(); // Keep last 5 lines
        return next;
      });
      index = (index + 1) % logPool.length;
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre className="font-mono text-[10px] md:text-xs text-[#FAF7F2] bg-[#1A1A1A] p-4 rounded-xl border border-white/5 h-36 overflow-y-auto leading-relaxed shadow-inner">
      {logs.map((log) => (
        <div
          key={log.id}
          className={
            log.text.startsWith("$")
              ? "text-[var(--brand-peach)]"
              : log.text.includes("✓") || log.text.includes("200")
                ? "text-[var(--brand-pink)]"
                : "text-[#FAF7F2]/70"
          }
        >
          {log.text}
        </div>
      ))}
      <div className="flex items-center gap-1.5 text-[#FAF7F2]/50">
        <span>sys-log: active</span>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] animate-ping" />
      </div>
    </pre>
  );
}

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "WebGL / Three.js",
  "Node.js / Express",
  "Python / Django",
  "Shopify",
  "WordPress",
  "Figma",
  "Flutter",
];

const TEAM = [
  {
    name: "Saral Banker",
    designation: "Product Engineer · Full-Stack & AI Applications",
    quote:
      "If it doesn't run in production, it doesn't count. I design, build, and ship complete systems — database to deployment — not just the demo.",
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='100%' height='100%' fill='%231A1A1A'/><text x='50%' y='48%' font-family='Georgia, serif' font-size='120' font-weight='bold' fill='%23FAF7F2' text-anchor='middle' dominant-baseline='middle'>S</text><text x='50%' y='62%' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23C75B3A' text-anchor='middle' letter-spacing='4'>ENGINE</text></svg>",
  },
  {
    name: "Jatin Basantani",
    designation: "Co-Founder · Designer & Frontend Developer",
    quote:
      "We believe that a website should be more than just a template. It should feel like a physical, tactile editorial book — custom crafted, fast, and responsive to the user's focus.",
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='100%' height='100%' fill='%23F0EAE0'/><text x='50%' y='48%' font-family='Georgia, serif' font-size='120' font-weight='bold' fill='%231A1A1A' text-anchor='middle' dominant-baseline='middle'>J</text><text x='50%' y='62%' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23C75B3A' text-anchor='middle' letter-spacing='4'>DESIGN</text></svg>",
  },
];

const HISTORY = [
  {
    year: "2023",
    title: "Started Shipping",
    desc: "Built and deployed Smart Parking Management System and Carbon Compass — first full-stack systems taken from idea to a working, hosted product.",
  },
  {
    year: "2024",
    title: "NeuroDashboard",
    desc: "Started building NeuroDashboard, a multi-module AI platform — Knowledge Hub, analytics, automation, and more — now 70k+ lines of production code.",
  },
  {
    year: "2025",
    title: "First Paid Contract",
    desc: "Shipped Shade Ledger, an automated billing system for a real client — now running for 220 rental units, saving 40+ hours of manual work every month.",
  },
  {
    year: "2026",
    title: "Today",
    desc: "Saral Banker & Jatin Basantani — two engineers who design, build, and ship complete systems, end to end.",
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
    <div className="pt-48 pb-48 px-6 text-foreground transition-colors duration-500 font-sans">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
          — About
        </span>
        <RevealText
          text="Two engineers,"
          as="h1"
          className="font-serif text-4xl sm:text-6xl md:text-9xl font-normal leading-[1.1] pb-1 block"
        />
        <RevealText
          text="real systems."
          as="h1"
          className="font-serif text-4xl sm:text-6xl md:text-9xl font-normal leading-[1.1] pb-1 block text-[var(--brand-pink)] italic"
          delay={300}
        />

        <div className="mt-24 grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <p className="font-serif text-2xl md:text-3xl font-normal leading-snug text-foreground">
              Saral Banker & Jatin Basantani — two engineers based in India who design, build, and
              ship complete systems, from database to deployment.
            </p>
            <div className="text-base text-muted-foreground space-y-6 leading-relaxed font-sans pt-4 border-t border-border/60">
              <p>
                We believe a project isn't done when the demo works — it's done when it's running in
                production, for real users, every day. That's the bar we hold our own work to.
              </p>
              <p>
                Between us we cover the full stack — backend architecture, APIs, AI integrations,
                and the frontends that sit on top of them.
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
                CORE BELIEF // 01
              </span>
              <h3 className="font-serif text-3xl font-normal leading-tight">
                "If it doesn't run in{" "}
                <em className="italic text-[var(--brand-peach)]">production</em>, it doesn't count."
              </h3>
            </div>
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono opacity-60">
              <span>SARAL BANKER & JATIN BASANTANI</span>
              <span>EST. 2023</span>
            </div>
          </motion.div>
        </div>
        <div className="animated-divider mt-24" />

        {/* Dynamic Stacking Team testimonials */}
        <div className="mt-24">
          <span className="text-sm text-[var(--brand-pink)] font-serif italic block mb-4">
            The people behind the work
          </span>
          <h2 className="font-serif text-4xl md:text-7xl font-normal mb-4">
            Meet the <span className="text-[var(--brand-pink)] font-serif italic">team.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Two engineers, one shared standard: if it doesn't run in production, it doesn't count.
          </p>
          <div
            className="rounded-xl border border-border bg-[var(--card)] overflow-hidden"
            data-cursor-text="LEADS"
          >
            <AnimatedTestimonials testimonials={TEAM} autoplay />
          </div>
        </div>
        <div className="animated-divider mt-24" />

        {/* Timeline Section */}
        <div
          className="mt-24 grid lg:grid-cols-[1fr_2fr] gap-16 items-start"
          ref={historyRef}
          data-cursor-text="TIMELINE"
        >
          <div>
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
              — Background
            </span>
            <h2 className="font-serif text-4xl md:text-7xl font-normal leading-tight">
              Our{" "}
              <span className="text-[var(--brand-pink)] font-serif italic block">Milestones.</span>
            </h2>
            <p className="text-muted-foreground text-sm font-sans mt-6 leading-relaxed max-w-sm">
              From first deployed projects to a multi-module AI platform and a paying client — a
              short history of things we've shipped and kept running.
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

                <div className="font-serif text-4xl md:text-5xl font-light text-muted-foreground leading-none transition-colors duration-300 group-[.is-active]:text-[var(--brand-pink)]">
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
        <div className="animated-divider mt-24" />

        {/* Founders Profiles Detailed Section */}
        <div className="mt-24">
          <span className="text-sm text-[var(--brand-pink)] font-serif italic block mb-4">
            Two focuses, one standard
          </span>
          <h2 className="font-serif text-4xl md:text-7xl font-normal mb-12">
            Founder <span className="text-[var(--brand-pink)] font-serif italic">spotlights.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Saral Card */}
            <BentoTilt className="h-full w-full">
              <SpotlightCard className="p-8 bg-[var(--card)] border border-border flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-display text-3xl font-bold text-foreground">
                        Saral Banker
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-[var(--brand-pink)] font-mono font-bold mt-1">
                        Full Stack Engineer · AI Application Developer
                      </p>
                    </div>
                    <a
                      href="/Saral_Banker_Resume.pdf"
                      download
                      className="rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-3 text-muted-foreground transition-all flex items-center justify-center cursor-pointer"
                      title="Download Resume"
                      aria-label="Download Saral Banker's resume"
                    >
                      <Download size={16} />
                    </a>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    I design, build, and ship complete systems — database to deployment. Built
                    NeuroDashboard, a multi-module AI platform (Knowledge Hub finds answers
                    instantly across your information, plus analytics, automation, and more), and
                    Shade Ledger, an automated billing system running for 220 rental units today.{" "}
                    <br />
                    <br />
                    <strong className="text-foreground/80 font-mono text-xs tracking-widest uppercase">
                      Academic Excellence:
                    </strong>{" "}
                    8.36 / 10 GPA
                  </p>

                  <div className="mb-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                      Core Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React 18",
                        "Next.js",
                        "Node.js / Express",
                        "FastAPI",
                        "PostgreSQL",
                        "Supabase",
                        "Redis",
                        "Docker",
                        "GitHub Actions",
                        "RAG / pgvector",
                        "Socket.IO",
                      ].map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono border border-border bg-muted/40 rounded-full px-2.5 py-1 text-foreground/80"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                    System Deployment Log
                  </span>
                  <TerminalLogSimulator />
                </div>
              </SpotlightCard>
            </BentoTilt>

            {/* Jatin Card */}
            <BentoTilt className="h-full w-full">
              <SpotlightCard className="p-8 bg-[var(--card)] border border-border flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-display text-3xl font-bold text-foreground">
                        Jatin Basantani
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-[var(--brand-pink)] font-mono font-bold mt-1">
                        Full-Stack Engineer & AI Systems Builder
                      </p>
                    </div>
                    <a
                      href="/Jatin_Basantani_Resume.pdf"
                      download
                      className="rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-3 text-muted-foreground transition-all flex items-center justify-center cursor-pointer"
                      title="Download Resume"
                      aria-label="Download Jatin Basantani's resume"
                    >
                      <Download size={16} />
                    </a>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Specializing in AI-centric application development, agent architectures, and
                    automated research systems. Creator of Knowledge Hub. I leverage frontier AI
                    models (Gemini, Claude, GPT) and modern stacks to build scalable, highly
                    performant products. <br />
                    <br />
                    <strong className="text-foreground/80 font-mono text-xs tracking-widest uppercase">
                      Academic Excellence:
                    </strong>{" "}
                    8.61 / 10 GPA
                  </p>

                  <div className="mb-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                      Core Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React",
                        "Next.js",
                        "Tailwind CSS",
                        "shadcn/ui",
                        "Supabase",
                        "PostgreSQL",
                        "TypeScript",
                        "LLM Agents",
                      ].map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono border border-border bg-muted/40 rounded-full px-2.5 py-1 text-foreground/80"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                    Live Code Preview
                  </span>
                  <CodeTypingSimulator />
                </div>
              </SpotlightCard>
            </BentoTilt>
          </div>
        </div>
        <div className="animated-divider mt-24" />

        {/* Skills Marquee */}
        <div className="mt-24">
          <span className="text-sm text-[var(--brand-pink)] font-serif italic block mb-4">
            Tools of the trade
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
        <div className="animated-divider mt-24" />

        {/* Core Values */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              t: "Ownership",
              c: "We see things through — idea to production, not just the fun parts.",
            },
            { t: "Transparency", c: "Direct communication, clear scope, no fluff." },
            { t: "Reliability", c: "If it ships, it has to keep working — not just on day one." },
          ].map((v) => (
            <BentoTilt key={v.t} className="h-full w-full">
              <SpotlightCard
                glowHue={15}
                className="p-8 bg-[var(--card)] border border-border h-full w-full"
              >
                <h3 className="font-serif text-2xl font-normal mb-3 text-[var(--brand-pink)]">
                  {v.t}
                </h3>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed">{v.c}</p>
              </SpotlightCard>
            </BentoTilt>
          ))}
        </div>

        <div className="animated-divider mt-24" />

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 glass rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <h3 className="font-serif text-3xl md:text-5xl font-normal leading-tight">
              Like how we <span className="text-[var(--brand-pink)] italic">think?</span>
            </h3>
            <p className="text-muted-foreground mt-3 max-w-md">
              Tell us what you're building — we'll come back within 48 hours with next steps.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-semibold shadow-glow-cyan whitespace-nowrap shrink-0"
          >
            Get in touch <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
