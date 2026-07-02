export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

// Add real attributed quotes here as they come in.
// Format: { name: "Full Name", role: "Title, Company", quote: "..." }
export const TESTIMONIALS: Testimonial[] = [];
