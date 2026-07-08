import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6",
        "backdrop-blur-xl",
        scrolled
          ? "bg-background/70 border-b border-border/50"
          : "bg-background/30 md:bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-cursor-text="HOME"
          data-magnetic="true"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
            <span className="h-2 w-2 rounded-full bg-primary shadow-glow-cyan" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">ORVION.CO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                data-cursor-text={item.label.toUpperCase()}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-variable-hover",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-full bg-[var(--brand-pink)]/35 border border-[var(--brand-pink)]/15 -z-10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <MagneticButton
            as={Link}
            to="/contact"
            data-cursor-text="CHAT"
            className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Let's talk →
          </MagneticButton>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/contact"
            className="rounded-full bg-foreground text-background px-4 py-2 text-xs font-semibold tracking-wide"
          >
            Talk →
          </Link>
          <ThemeToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="w-11 h-11 flex items-center justify-center glass rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-6 mt-3 rounded-2xl p-4 flex flex-col gap-1 bg-background/95 backdrop-blur-2xl border border-border shadow-xl">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                pathname === item.to
                  ? "bg-primary/15 text-primary"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
