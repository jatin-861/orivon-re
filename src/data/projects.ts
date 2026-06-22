export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  services: string[];
  color: string;
  link?: string;
  modules?: string[];
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "neurodashboard",
    title: "NeuroDashboard — find answers instantly across your work",
    client: "Independent",
    category: "AI Platform",
    year: "2024–2025",
    description:
      "A multi-module AI platform that finds answers instantly across your documents and notes — plus analytics, automation, and real-time collaboration. 70k+ lines, built and shipped end to end.",
    services: ["React", "Node.js / Express", "PostgreSQL", "Redis", "RAG / pgvector", "Socket.IO"],
    color: "#C75B3A",
    link: "https://github.com/saralbanker/neuro-zenith",
    modules: [
      "Knowledge Hub",
      "Analytics Dashboard",
      "AI Insights Engine",
      "Workflow Automation",
      "Notes System",
      "Document Processing Pipeline",
    ],
    image: "/images/neurodashboard.webp",
  },
  {
    slug: "shade-ledger",
    title: "Shade Ledger — automated billing for 220 rental units",
    client: "Confidential Client",
    category: "Automation",
    year: "2025–2026",
    description:
      "Replaced manual Excel billing and phone calls with automatic invoices, reminders, and penalty tracking — running live for 220 rental units, saving 40+ hours of manual work every month.",
    services: ["React", "Node.js", "react-pdf", "WhatsApp Business API"],
    color: "#8B5E3C",
    image: "/images/shade-ledger.webp",
  },
  {
    slug: "smart-parking",
    title: "Smart Parking Management System",
    client: "Independent",
    category: "Systems",
    year: "2023",
    description:
      "Drivers see open spots in real time and book one instantly — a full-stack system for managing live parking availability and bookings.",
    services: ["React", "Node.js", "Express", "MongoDB"],
    color: "#D4845A",
    link: "https://github.com/saralbanker/smart-parking",
    image: "/images/smart-parking.webp",
  },
  {
    slug: "carbon-compass",
    title: "Carbon Compass",
    client: "Independent",
    category: "Product",
    year: "2023",
    description:
      "Tracks your environmental footprint and shows where to cut back — a personal carbon-tracking app with actionable insights.",
    services: ["React", "Node.js", "Express", "MongoDB"],
    color: "#6B8F5E",
    link: "https://github.com/saralbanker/carbon-compass",
    image: "/images/carbon-compass.webp",
  },
];
