import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Send } from "lucide-react";
import { RevealText } from "@/components/RevealText";
import { MagneticButton } from "@/components/MagneticButton";
import { PulseBeams } from "@/components/PulseBeams";
import { BookingCalendar } from "@/components/ui/booking-calendar";
import { cn } from "@/lib/utils";

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.4,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 1.1,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 },
    ],
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.8,
      },
    },
    connectionPoints: [
      { cx: 142, cy: 427, r: 6.5 },
      { cx: 425.5, cy: 274, r: 6 },
    ],
  },
  {
    path: "M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427",
    gradientConfig: {
      initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" },
      animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 1.4,
      },
    },
    connectionPoints: [
      { cx: 770, cy: 427, r: 6.5 },
      { cx: 493, cy: 274, r: 6 },
    ],
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.2,
      },
    },
    connectionPoints: [
      { cx: 420.5, cy: 6.5, r: 6 },
      { cx: 380, cy: 168, r: 6 },
    ],
  },
];

export const Route = createFileRoute("/contact")({
  component: Contact,
});

const BUDGETS = ["< $25k", "$25–75k", "$75–150k", "$150k+"];
const SERVICES = ["Brand", "Web", "Product", "Motion / 3D", "E-commerce"];

function Contact() {
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");

  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">
              — Inquiries
            </span>
            <RevealText
              text="Let's make something"
              as="h1"
              className="font-display text-5xl md:text-7xl font-bold leading-[0.9] block"
            />
            <RevealText
              text="unforgettable."
              as="h1"
              className="font-display text-5xl md:text-7xl font-bold leading-[0.9] block text-[var(--brand-pink)]"
              delay={300}
            />
            <p className="mt-6 text-muted-foreground max-w-md">
              Tell us about your idea — we reply to every brief within 48 hours.
            </p>
          </div>

          {/* Pulse beams (decorative, RIGHT side) */}
          <div className="hidden lg:flex justify-center items-center min-h-[420px]">
            <PulseBeams
              beams={beams}
              width={600}
              height={420}
              className="w-full"
              background={
                <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
              }
            >
              <div className="relative h-32 w-32 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center backdrop-blur-md">
                <span className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
                <span className="relative h-3 w-3 rounded-full bg-primary shadow-glow-cyan animate-ping" />
                <span className="absolute h-3 w-3 rounded-full bg-primary shadow-glow-cyan" />
              </div>
            </PulseBeams>
          </div>
        </div>

        <div className="mt-20 grid lg:grid-cols-[1.4fr_1fr] gap-16">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-6">
                <Send className="text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3">Message received.</h2>
              <p className="text-muted-foreground">
                Thanks for reaching out. We'll be in touch within 48 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Your name" name="name" placeholder="Ada Lovelace" required />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="ada@studio.com"
                  required
                />
              </div>
              <Field label="Company" name="company" placeholder="Acme Inc." />

              <div>
                <Label>What can we help with?</Label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggle(s)}
                      className={`rounded-full px-4 py-2 text-sm border transition-all ${
                        selected.includes(s)
                          ? "bg-primary text-primary-foreground border-primary shadow-glow-cyan"
                          : "border-border glass hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Budget</Label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => {
                    const active = budget === b;
                    return (
                      <label
                        key={b}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm border transition-all cursor-pointer",
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-glow-cyan font-semibold"
                            : "border-border glass hover:border-primary/40 text-foreground",
                        )}
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={b}
                          checked={active}
                          onChange={() => setBudget(b)}
                          className="sr-only"
                        />
                        {b}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Tell us more</Label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="What are you trying to build? When do you want to launch?"
                  className="w-full rounded-2xl glass border border-border bg-transparent px-5 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <MagneticButton
                as="button"
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 font-semibold shadow-glow-cyan"
              >
                Send message <ArrowRight size={18} />
              </MagneticButton>
            </form>
          )}

          <aside className="space-y-8">
            <Info Icon={Mail} label="Email" value="hello@orivon.studio" />
            <Info Icon={MapPin} label="Studios" value="London · Lisbon" />
            <BookingCalendar />
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold mb-2">Response time</h3>
              <p className="text-sm text-muted-foreground">
                We reply to every brief within 48 hours, Monday to Friday.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold mb-2">Press & speaking</h3>
              <p className="text-sm text-muted-foreground">
                For interviews and event invitations:{" "}
                <a className="text-primary" href="mailto:press@orivon.studio">
                  press@orivon.studio
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{children}</div>
);

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl glass border border-border bg-transparent px-5 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function Info({ Icon, label, value }: { Icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-full glass p-3">
        <Icon className="text-primary" size={18} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
        <div className="font-display text-xl">{value}</div>
      </div>
    </div>
  );
}
