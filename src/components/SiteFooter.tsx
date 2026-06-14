import { Link } from "@tanstack/react-router";
import { Github, Instagram, Twitter, Dribbble, Mail, MapPin, Phone } from "lucide-react";
import { AnimatedDock } from "./AnimatedDock";
import { GooeyText } from "./ui/gooey-text-morphing";

const aboutLinks = [
  { text: "About Studio", to: "/about" },
  { text: "Process", to: "/process" },
];

const serviceLinks = [
  { text: "Frontend Design", to: "/services" },
  { text: "Full-Stack Dev", to: "/services" },
];

const helpfulLinks = [
  { text: "Selected Work", to: "/work" },
  { text: "Pricing", to: "/pricing" },
  { text: "Contact", to: "/contact" },
];

const dockItems = [
  {
    link: "https://github.com/orivon",
    external: true,
    label: "GitHub",
    Icon: <Github size={20} />,
  },
  {
    link: "https://twitter.com/orivon",
    external: true,
    label: "Twitter",
    Icon: <Twitter size={20} />,
  },
  {
    link: "https://instagram.com/orivon",
    external: true,
    label: "Instagram",
    Icon: <Instagram size={20} />,
  },
  {
    link: "https://dribbble.com/orivon",
    external: true,
    label: "Dribbble",
    Icon: <Dribbble size={20} />,
  },
  { link: "mailto:hello@orivon.studio", external: true, label: "Email", Icon: <Mail size={20} /> },
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

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                <span className="h-2 w-2 rounded-full bg-primary shadow-glow-cyan" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                ORIVON<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              A bespoke design & engineering studio crafting tactile, fast, and beautiful digital products.
            </p>
          </div>

          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-foreground mb-5">
              Studio
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
              Services
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
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
                <Mail size={14} className="text-primary" /> hello@orivon.studio
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={14} className="text-primary" /> +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary mt-0.5" /> India
              </li>
            </ul>
          </div>
        </div>

        {/* Giant gooey wordmark */}
        <div className="relative mt-12 select-none overflow-hidden h-[clamp(4rem,15vw,10rem)]">
          <GooeyText
            texts={["ORIVON", "STUDIO", "CRAFT", "ORIVON"]}
            morphTime={1.4}
            cooldownTime={1.6}
            className="h-full w-full"
            textClassName="text-[var(--brand-pink)] tracking-tighter leading-[1.0] text-[clamp(3.5rem,15vw,10rem)] py-2"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Orivon Studio. All rights reserved.</p>
          <p>Crafted with obsessive detail.</p>
        </div>
      </div>
    </footer>
  );
}
