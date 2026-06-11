export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  description: string;
  services: string[];
  color: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "lumen-finance",
    title: "Lumen — Reimagining digital banking",
    client: "Lumen",
    category: "Fintech",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=70&auto=format&fit=crop",
    description:
      "A radical reinvention of mobile banking with immersive 3D dashboards and a frictionless onboarding flow.",
    services: ["Brand", "UX/UI", "Web", "Motion"],
    color: "#5EE7FF",
  },
  {
    slug: "noctis-music",
    title: "Noctis — A label site that sings",
    client: "Noctis Records",
    category: "Music",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=70&auto=format&fit=crop",
    description:
      "Audio-reactive WebGL artist hub for an underground techno label. Won SOTD on Awwwards.",
    services: ["Web", "WebGL", "Brand"],
    color: "#A78BFA",
  },
  {
    slug: "orbit-aerospace",
    title: "Orbit — Booking the next frontier",
    client: "Orbit Aerospace",
    category: "Aerospace",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=70&auto=format&fit=crop",
    description:
      "From spacecraft configurator to investor pitch — a complete digital identity for a new-era launch company.",
    services: ["Brand", "Web", "3D"],
    color: "#5EE7FF",
  },
  {
    slug: "verdant-eco",
    title: "Verdant — Sustainability storytelling",
    client: "Verdant",
    category: "Climate",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=70&auto=format&fit=crop",
    description: "An interactive impact report turned into a scrollable cinematic experience.",
    services: ["Web", "Motion", "Editorial"],
    color: "#34D399",
  },
  {
    slug: "atelier-fashion",
    title: "Atelier — Couture meets code",
    client: "Atelier Maison",
    category: "Fashion",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=70&auto=format&fit=crop",
    description:
      "A flagship e-commerce experience for a Parisian couture house. Headless, fast, and unmistakably haute.",
    services: ["E-commerce", "UX/UI", "Brand"],
    color: "#F472B6",
  },
  {
    slug: "halo-health",
    title: "Halo — Wellness, simplified",
    client: "Halo Health",
    category: "Health",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70&auto=format&fit=crop",
    description:
      "Native-feeling progressive web app for a meditation startup with delightful micro-interactions.",
    services: ["Product", "UX/UI", "Motion"],
    color: "#5EE7FF",
  },
];
