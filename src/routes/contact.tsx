import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Send, MessageSquare, PhoneCall, Rocket } from "lucide-react";
import { RevealText } from "@/components/RevealText";
import { MagneticButton } from "@/components/MagneticButton";
import { PulseBeams } from "@/components/PulseBeams";
import { BentoTilt } from "@/components/BentoTilt";
import { BookingCalendar, type BookedDate } from "@/components/ui/booking-calendar";
import {
  buildMailUrls,
  openCompose,
  pickCompose,
  type ComposeChoice,
  type MailUrls,
} from "@/lib/mail";
import { SEO } from "@/components/SEO";

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

const REASONS = ["Full-Time Role", "Contract Work", "Freelance Project", "Something Else"];
const CONTACT_EMAILS = [["orvionstudio.co", "gmail.com"].join("@")];

// Calendar is only required when scoping a project — not for role inquiries.
const CALENDAR_REQUIRED_TYPES = ["Contract Work", "Freelance Project"];

const NEXT_STEPS = [
  {
    n: "01",
    title: "We reply",
    copy: "Within 48 hours, personally — no auto-responder, no account manager in between.",
    icon: MessageSquare,
  },
  {
    n: "02",
    title: "Quick call",
    copy: "15–20 minutes to understand scope, timeline, and whether we're a fit.",
    icon: PhoneCall,
  },
  {
    n: "03",
    title: "We start",
    copy: "A real proposal with timeline and next steps — not a generic sales deck.",
    icon: Rocket,
  },
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bookedDate, setBookedDate] = useState<BookedDate | null>(null);
  const [dateError, setDateError] = useState(false);
  const [mailUrls, setMailUrls] = useState<MailUrls | null>(null);
  const [choice, setChoice] = useState<ComposeChoice | null>(null);
  const [plainText, setPlainText] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const needsDate = selected.some((s) => CALENDAR_REQUIRED_TYPES.includes(s));
    if (needsDate && !bookedDate) {
      setDateError(true);
      return;
    }
    setDateError(false);

    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string)?.trim() || "";
    const email = (form.get("email") as string)?.trim() || "";
    const company = (form.get("company") as string)?.trim() || "";
    const message = (form.get("message") as string)?.trim() || "";

    const subject = `New project inquiry from ${name || "website visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company && `Company: ${company}`,
      selected.length && `Reason: ${selected.join(", ")}`,
      bookedDate && `Preferred date: ${bookedDate.month} ${bookedDate.day}, ${bookedDate.year}`,
      "",
      "Message:",
      message || "(no message provided)",
    ]
      .filter(Boolean)
      .join("\n");

    const urls = buildMailUrls({ to: CONTACT_EMAILS, subject, body });
    // Detect the visitor's provider from the address they entered and route to
    // the matching webmail (Gmail/Outlook/Yahoo), or their desktop mail app via
    // mailto: for anything else.
    const picked = pickCompose(email, urls);

    setMailUrls(urls);
    setChoice(picked);
    setPlainText(`To: ${CONTACT_EMAILS.join(", ")}\nSubject: ${subject}\n\n${body}`);
    setCopied(false);

    // Open the chosen compose target right away. Fired synchronously inside the
    // submit gesture so the browser treats it as user-initiated (not a blocked
    // popup). The success panel offers every other provider + a copy fallback.
    openCompose(picked);

    setSent(true);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browser / insecure context) — fall
      // back to a temporary textarea + execCommand.
      const ta = document.createElement("textarea");
      ta.value = plainText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* nothing more we can do */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6">
      <SEO
        title="Contact — Orvion.co"
        description="Start a project with Orvion.co. Tell us what you're building — we'll reply within 48 hours."
        canonical="https://orvion.co/contact"
        ogImage="https://orvion.co/og-image.png"
      />
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4">
              — Get In Touch
            </span>
            <RevealText
              text="Let's talk about"
              as="h1"
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.9] block"
            />
            <RevealText
              text="what you're building."
              as="p"
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.9] block text-[var(--brand-pink)]"
              delay={300}
            />
            <p className="mt-6 text-muted-foreground max-w-md">
              Tell us about the project or role — we reply within 48 hours.
            </p>
          </div>

          {/* Pulse beams (decorative, RIGHT side) */}
          <div className="hidden lg:flex justify-center items-center min-h-[420px]">
            <PulseBeams
              beams={beams}
              width={600}
              height={420}
              className="w-full"
              gradientColors={{ start: "#D4845A", middle: "#C75B3A", end: "#8B5E3C" }}
              accentColor="oklch(0.70 0.14 35 / 0.6)"
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
              className="glass rounded-3xl p-8 sm:p-10 text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-6">
                <Send className="text-primary" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                Your message is ready
              </h2>
              <p className="text-muted-foreground">
                {choice?.webmail
                  ? `We opened a pre-filled email in ${choice.label} — just hit send there. Use a different app? Pick one below. We reply within 48 hours.`
                  : "We opened your email app with everything pre-filled — just hit send. Nothing opened? Pick an option below. We reply within 48 hours."}
              </p>

              <div className="mt-7 flex flex-col gap-3">
                {/* Primary: the provider we detected from the visitor's address */}
                <a
                  href={choice?.url}
                  target={choice?.webmail ? "_blank" : undefined}
                  rel={choice?.webmail ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-semibold shadow-glow-cyan transition-transform hover:scale-[1.02]"
                >
                  Open in {choice?.label ?? "email"} <ArrowRight size={18} />
                </a>

                {/* Every other provider, so anyone can pick their own */}
                {mailUrls && (
                  <>
                    <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                      Use a different app
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {choice?.provider !== "gmail" && (
                        <ProviderChip href={mailUrls.gmail} webmail>
                          Gmail
                        </ProviderChip>
                      )}
                      {choice?.provider !== "outlook" && (
                        <ProviderChip href={mailUrls.outlook} webmail>
                          Outlook
                        </ProviderChip>
                      )}
                      {choice?.provider !== "yahoo" && (
                        <ProviderChip href={mailUrls.yahoo} webmail>
                          Yahoo
                        </ProviderChip>
                      )}
                      {choice?.provider !== "other" && (
                        <ProviderChip href={mailUrls.mailto}>Email app</ProviderChip>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={copyMessage}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? "Copied to clipboard ✓" : "Copy the message instead"}
                </button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Or email us directly at{" "}
                <a href={mailUrls?.mailto} className="text-primary underline break-words">
                  {CONTACT_EMAILS.join(", ")}
                </a>
                .
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
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Field label="Company" name="company" placeholder="Acme Inc." />

              <div>
                <Label>What's this about?</Label>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((s) => (
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
                <Label htmlFor="message">Tell me more</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="What are you trying to build? When do you want to launch?"
                  className="w-full rounded-2xl glass border border-border bg-transparent px-5 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {dateError && (
                <p className="text-sm text-destructive">
                  Please pick a preferred start date in the calendar — helps us scope the timeline.
                </p>
              )}

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
            <Info Icon={Mail} label="Email" value={CONTACT_EMAILS} />
            <Info Icon={MapPin} label="Location" value="India" />
            <BookingCalendar
              onDateChange={(date) => {
                setBookedDate(date);
                if (date) setDateError(false);
              }}
            />
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold mb-2">Response time</h3>
              <p className="text-sm text-muted-foreground">
                We reply to every message within 48 hours, Monday to Friday — no auto-responder.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold mb-2">Open to</h3>
              <p className="text-sm text-muted-foreground">
                Full-time roles, contract work, and freelance projects:{" "}
                <a className="text-primary" href={`mailto:${CONTACT_EMAILS[0]}`}>
                  {CONTACT_EMAILS[0]}
                </a>
              </p>
            </div>
          </aside>
        </div>

        {/* What happens after you reach out */}
        <div className="mt-24 md:mt-32">
          <span className="text-xs text-[var(--brand-pink)] font-mono block mb-4 uppercase tracking-[0.2em]">
            — After you hit send
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-10">
            What happens next.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEXT_STEPS.map((s) => (
              <BentoTilt
                key={s.n}
                className="rounded-[28px] min-h-[220px] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="h-full w-full rounded-[28px] border border-border bg-card p-7 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <s.icon className="h-5 w-5 text-secondary" strokeWidth={1.75} />
                    <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.copy}</p>
                  </div>
                </div>
              </BentoTilt>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs uppercase tracking-widest text-muted-foreground mb-3"
  >
    {children}
  </label>
);

function ProviderChip({
  href,
  webmail,
  children,
}: {
  href: string;
  webmail?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={webmail ? "_blank" : undefined}
      rel={webmail ? "noopener noreferrer" : undefined}
      className="rounded-full border border-border glass px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
    >
      {children}
    </a>
  );
}

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
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl glass border border-border bg-transparent px-5 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function Info({
  Icon,
  label,
  value,
}: {
  Icon: typeof Mail;
  label: string;
  value: string | string[];
}) {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-full glass p-3">
        <Icon className="text-primary" size={18} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
        {values.map((v) => (
          <div key={v} className="font-display text-xl">
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
