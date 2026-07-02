import { Link } from "@tanstack/react-router";
import { Github, Mail, MapPin } from "lucide-react";
import { AnimatedDock } from "./AnimatedDock";
import { GooeyText } from "./ui/gooey-text-morphing";

const aboutLinks = [
  { text: "About", to: "/about" },
  { text: "Process", to: "/process" },
];

const helpfulLinks = [
  { text: "Selected Work", to: "/work" },
  { text: "Contact", to: "/contact" },
];

const dockItems = [
  {
    link: "https://github.com/saralbanker",
    external: true,
    label: "GitHub",
    Icon: <Github size={20} />,
  },
  {
    link: "mailto:orvionstudio.co@gmail.com",
    external: true,
    label: "Email",
    Icon: <Mail size={20} />,
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-0 border-t border-border bg-background">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">
        {/* Top: Dock */}
        <div className="flex justify-center mb-16">
          <AnimatedDock items={dockItems} />
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                <span className="h-2 w-2 rounded-full bg-primary shadow-glow-cyan" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">ORVION.CO</span>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              Product engineer. I design, build, and ship complete systems — database to deployment.
            </p>
          </div>

          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-foreground mb-5">
              Work
            </p>
            <ul className="space-y-3">
              {aboutLinks.map((l) => (
                <li key={l.text}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-variable-hover"
                  >
                    {l.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-foreground mb-5">
              Connect
            </p>
            <ul className="space-y-3">
              {helpfulLinks.map((l) => (
                <li key={l.text}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-variable-hover"
                  >
                    {l.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={14} className="text-primary" />
                <a
                  href="mailto:orvionstudio.co@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  orvionstudio.co@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary mt-0.5" /> India
              </li>
            </ul>
          </div>
        </div>

        {/* Giant gooey wordmark */}
        <div className="relative mt-12 select-none overflow-hidden h-[clamp(3.5rem,12vw,9rem)]">
          <GooeyText
            texts={["SARAL", "JATIN", "SARAL X JATIN", "ORVION.CO"]}
            morphTime={1.4}
            cooldownTime={1.6}
            className="h-full w-full"
            textClassName="text-[var(--brand-pink)] tracking-tighter leading-none whitespace-nowrap text-[clamp(1.75rem,9vw,7.5rem)]"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Orvion.co.</p>
          <p>If it doesn't run in production, it doesn't count.</p>
        </div>
      </div>
    </footer>
  );
}
