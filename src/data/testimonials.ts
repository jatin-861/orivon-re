// Placeholder content — swap these for real client quotes as they come in.
// Each entry only needs a name, role, and quote; avatars render as initials
// so there's no fake headshot to replace later.
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "R. Mehta",
    role: "Property Manager",
    quote:
      "Billing used to eat a whole afternoon every month. Now it just runs — invoices, reminders, the lot.",
  },
  {
    name: "A. Sharma",
    role: "Founder, D2C Brand",
    quote: "Fixed price, fixed timeline, no surprises. The dashboard shipped exactly as scoped.",
  },
  {
    name: "K. Desai",
    role: "Ops Lead, Logistics",
    quote: "They actually understand backend architecture, not just how to wire up a template.",
  },
  {
    name: "S. Iyer",
    role: "Clinic Administrator",
    quote: "Patient records went from spreadsheets to a real system in under two months.",
  },
  {
    name: "P. Nair",
    role: "Co-founder, SaaS Startup",
    quote: "Async updates the whole way through — never had to chase a status update once.",
  },
  {
    name: "V. Kapoor",
    role: "Facilities Director",
    quote: "Asked for a parking system that just worked. That's what we got, day one.",
  },
];
