import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── DATA ─────────────────────────────────────────────────────────────────────
const WEBSITE = [
  ["Static Landing Page (1 page)", "All Businesses", "Basic", "₹0.15L–₹0.4L", 1, 2],
  ["Static Brochure Website (3–5 pages)", "All Businesses", "Basic", "₹0.3L–₹0.8L", 2, 3],
  ["Static Brochure Website (6–10 pages)", "All Businesses", "Basic", "₹0.5L–₹1.2L", 3, 4],
  ["Dynamic CMS Website (blog/news-driven)", "Media, Publishing", "Medium", "₹0.8L–₹2L", 4, 6],
  ["Portfolio / Personal Brand Website", "Consulting, Creators", "Basic", "₹0.3L–₹0.7L", 2, 3],
  ["Multi-language Website Build", "Export, Tourism, Real Estate", "Medium", "₹1.2L–₹3L", 5, 8],
  ["Web App / Client Dashboard — Basic", "All Businesses", "Medium", "₹1.5L–₹3.5L", 5, 7],
  ["Web App / Client Dashboard — Medium", "All Businesses", "Medium", "₹3L–₹6L", 7, 10],
  ["Web App / Client Dashboard — Complex", "All Businesses", "High", "₹6L–₹12L", 10, 16],
  ["E-commerce — Template-based", "Retail, D2C", "Basic", "₹0.5L–₹1.5L", 3, 5],
  ["E-commerce — Semi-custom Build", "Retail, D2C", "Medium", "₹1.5L–₹4L", 6, 9],
  ["E-commerce — Fully Custom / Headless", "Retail, D2C, Enterprise", "High", "₹4L–₹10L", 10, 16],
  ["Booking Website — Single Service", "Salon, Clinics, Consulting", "Basic", "₹0.5L–₹1.2L", 3, 4],
  [
    "Booking Website — Multi-service/Multi-staff",
    "Healthcare, Hospitality",
    "Medium",
    "₹1.2L–₹2.8L",
    5,
    7,
  ],
  ["Educational Course Catalog Website", "Education, EdTech", "Medium", "₹1L–₹2.5L", 5, 7],
  ["Progressive Web App (PWA)", "Retail, Services, Startups", "High", "₹3L–₹7L", 8, 12],
  ["Website Redesign / Platform Migration", "All Businesses", "Medium", "₹1L–₹3L", 4, 7],
  ["Landing Page A/B Variant Pack", "Marketing, D2C", "Basic", "₹0.25L–₹0.6L", 1, 2],
];

const MOBILE = [
  ["App MVP (single core feature)", "Startups, All Businesses", "Basic", "₹0.75L–₹2L", 4, 6],
  [
    "Cross-Platform Business App (Flutter/RN)",
    "Retail, Services, Startups",
    "Medium",
    "₹2.5L–₹6L",
    8,
    12,
  ],
  [
    "Cross-Platform Enterprise App",
    "Enterprise, Logistics, Healthcare",
    "High",
    "₹6L–₹14L",
    12,
    18,
  ],
  ["Native Android App", "Consumer, Fintech", "Medium", "₹3L–₹7L", 8, 12],
  ["Native iOS App", "Consumer, Fintech, Premium Brands", "Medium", "₹3.5L–₹8L", 8, 13],
  [
    "Native Android + iOS (Complex/Enterprise)",
    "Enterprise, Fintech, Healthcare",
    "Enterprise",
    "₹10L–₹25L",
    16,
    24,
  ],
  ["App + Custom Backend/API (full-stack mobile)", "All Businesses", "High", "₹5L–₹12L", 10, 16],
  [
    "Marketplace / On-demand App (multi-sided)",
    "Logistics, Services, Delivery",
    "Enterprise",
    "₹10L–₹22L",
    16,
    24,
  ],
];

const AUTOMATION = [
  ["WhatsApp Auto-Reply Bot (FAQ/greeting)", "Retail, Services", "Basic", "₹0.4L–₹1L", 1, 2],
  ["WhatsApp Catalog / Order-Flow Bot", "Retail, F&B, D2C", "Medium", "₹1L–₹2.5L", 3, 4],
  ["WhatsApp Business API + CRM-linked Bot", "Retail, D2C, Services", "High", "₹2L–₹6L", 4, 6],
  ["AI Website Chatbot (FAQ/support widget)", "All Businesses", "Basic", "₹0.6L–₹1.5L", 2, 3],
  [
    "AI Multi-channel Chatbot (Web+WhatsApp+IG)",
    "Retail, D2C, Support-heavy",
    "High",
    "₹5L–₹15L",
    8,
    12,
  ],
  ["Voice Bot / IVR Automation", "BFSI, Healthcare, Support Centers", "High", "₹3L–₹8L", 6, 10],
  ["Email Drip / Marketing Automation", "D2C, SaaS, Agencies", "Medium", "₹1.5L–₹4L", 4, 6],
  ["Behavioral & Transactional Email Automation", "D2C, SaaS", "Medium", "₹2L–₹5L", 5, 7],
  ["Internal Workflow Automation — Single-tool", "All Businesses", "Basic", "₹0.8L–₹2L", 2, 4],
  [
    "Internal Workflow Automation — Multi-tool Orchestration",
    "All Businesses",
    "Medium",
    "₹2L–₹5L",
    4,
    7,
  ],
  ["Custom Workflow / Process Engine", "Enterprise, Manufacturing", "High", "₹4L–₹12L", 7, 10],
  ["RPA — Attended (desktop-assist bot)", "BFSI, Back-office Ops", "Medium", "₹2L–₹5L", 5, 8],
  ["RPA — Unattended (independent backend bot)", "BFSI, Enterprise Ops", "High", "₹4L–₹10L", 8, 12],
  ["AI Agent — Single-task Agent", "All Businesses", "Medium", "₹2.5L–₹6L", 5, 8],
  [
    "AI Agent — Multi-step Agentic Workflow Platform",
    "Enterprise, SaaS",
    "Enterprise",
    "₹8L–₹25L",
    12,
    18,
  ],
  ["Document / Invoice OCR Automation", "Finance, Logistics, Legal", "Medium", "₹2L–₹5L", 5, 7],
  [
    "Compliance Document Auto-Generation",
    "Legal, Manufacturing, Healthcare",
    "Medium",
    "₹2.5L–₹6L",
    6,
    8,
  ],
  ["Social Media Scheduling Automation", "Marketing, D2C", "Basic", "₹0.8L–₹2L", 2, 4],
  ["Social Media Engagement Auto-Response", "Marketing, D2C", "Medium", "₹1.5L–₹4L", 4, 6],
  [
    "Lead Capture & Auto-Routing Automation",
    "Sales, Real Estate, D2C",
    "Medium",
    "₹1.5L–₹4L",
    4,
    6,
  ],
  [
    "Web Scraping / Data Pipeline Automation",
    "Research, E-commerce, Finance",
    "Medium",
    "₹2L–₹5L",
    4,
    7,
  ],
  ["ETL / Reporting Automation Pipeline", "Enterprise, Finance", "High", "₹3L–₹8L", 6, 10],
];

const SAAS = [
  [
    "Sales, CRM & Growth",
    [
      ["CRM – Customer Relationship Mgmt", "Retail, Real Estate, B2B", "Medium", "₹5L–₹18L", 8, 12],
      ["Lead Management System", "Real Estate, Sales, D2C", "Medium", "₹2L–₹8L", 5, 8],
      ["Marketing Automation Suite", "D2C, SaaS, Agencies", "High", "₹5L–₹15L", 8, 12],
      ["Customer Self-Service Portal", "SaaS, Utilities, Retail", "Medium", "₹2L–₹8L", 5, 8],
      ["Vendor Portal", "Manufacturing, Retail, Procurement", "Medium", "₹3L–₹10L", 6, 8],
      ["Loyalty & Rewards Program Platform", "Retail, F&B, D2C", "Medium", "₹3L–₹8L", 6, 9],
      ["Affiliate & Influencer Management Platform", "D2C, Marketing", "Medium", "₹3L–₹8L", 6, 9],
      ["Referral Program Engine", "D2C, SaaS, Retail", "Basic", "₹1.5L–₹4L", 4, 6],
    ],
  ],
  [
    "Finance, Billing & Compliance",
    [
      ["Billing Software", "All Businesses", "Basic", "₹1.5L–₹5L", 4, 6],
      ["Accounting Software", "All Businesses", "Medium", "₹3L–₹10L", 6, 10],
      ["Expense Management", "Enterprise, Agencies", "Basic", "₹2L–₹6L", 4, 6],
      [
        "Multi-currency / Global Invoicing Platform",
        "Export, Agencies, SaaS",
        "Medium",
        "₹3L–₹9L",
        6,
        10,
      ],
      ["Insurance Policy Management", "Insurance, Finance", "High", "₹5L–₹15L", 9, 13],
      ["Subscription Platform", "SaaS, Media, D2C", "Medium", "₹4L–₹12L", 7, 10],
      ["Membership Management", "Clubs, NGOs, Associations", "Basic", "₹2L–₹7L", 4, 7],
    ],
  ],
  [
    "HR & People Ops",
    [
      ["HRMS – Human Resource Mgmt", "Enterprise, All Businesses", "Medium", "₹5L–₹15L", 8, 12],
      ["Attendance Management", "All Businesses", "Basic", "₹1.5L–₹5L", 4, 6],
      ["Payroll System", "Enterprise, HR & Staffing", "Medium", "₹2L–₹8L", 5, 8],
      ["Recruitment Platform (ATS)", "HR & Staffing, Enterprise", "Medium", "₹4L–₹12L", 7, 10],
      ["Employee Onboarding Platform", "Enterprise, HR", "Basic", "₹2L–₹6L", 4, 6],
      ["Performance Review / OKR Tracker", "Enterprise, HR", "Medium", "₹3L–₹8L", 6, 9],
      [
        "Time Tracking & Billing (Agency/Freelance)",
        "Agencies, Consulting, Legal",
        "Medium",
        "₹2.5L–₹7L",
        5,
        8,
      ],
    ],
  ],
  [
    "Operations, Assets & Workflow",
    [
      ["Inventory Management", "Retail, Manufacturing, Distribution", "Medium", "₹3L–₹10L", 6, 8],
      ["Asset Management", "Manufacturing, Facilities", "Medium", "₹3L–₹10L", 6, 8],
      ["Maintenance Management (CMMS)", "Manufacturing, Facilities", "Medium", "₹4L–₹12L", 8, 10],
      ["Document Management System", "Legal, Enterprise, Healthcare", "Medium", "₹3L–₹10L", 6, 8],
      ["Knowledge Base Platform", "SaaS, Support Teams", "Basic", "₹2L–₹6L", 4, 6],
      ["Custom Analytics Dashboard", "Enterprise, All Businesses", "Medium", "₹3L–₹10L", 6, 9],
      [
        "Procurement / e-Tendering Platform",
        "Manufacturing, Govt-adjacent",
        "High",
        "₹6L–₹16L",
        10,
        14,
      ],
      ["Contractor Management", "Construction, Facilities", "Medium", "₹3L–₹10L", 6, 8],
      ["Compliance Management", "Manufacturing, Healthcare, Legal", "Medium", "₹4L–₹12L", 7, 10],
      ["Project Management Tool", "Agencies, Enterprise", "Medium", "₹3L–₹10L", 6, 10],
      [
        "Helpdesk & Ticketing System",
        "Support Teams, SaaS, Enterprise",
        "Medium",
        "₹3L–₹10L",
        5,
        8,
      ],
      ["Quality Management System", "Manufacturing", "Medium", "₹3L–₹9L", 6, 9],
    ],
  ],
  [
    "Education",
    [
      ["School Management System", "Education", "Medium", "₹4L–₹12L", 8, 12],
      ["College Management System", "Education", "High", "₹6.2L–₹19L", 10, 15],
      [
        "LMS – Learning Management System",
        "EdTech, Enterprise Training",
        "High",
        "₹5L–₹15L",
        9,
        13,
      ],
      ["Online Examination System", "Education, EdTech", "Medium", "₹3L–₹10L", 6, 8],
      ["Library Management System", "Education, Public Institutions", "Basic", "₹1.5L–₹5L", 4, 6],
      ["Daycare / Childcare Management", "Education, Childcare", "Basic", "₹2L–₹6L", 4, 7],
    ],
  ],
  [
    "Healthcare",
    [
      ["Hospital Management System", "Healthcare", "High", "₹8L–₹25L", 14, 20],
      ["Clinic Management System", "Healthcare", "Medium", "₹3L–₹8L", 6, 10],
      ["Pharmacy Management", "Healthcare, Retail", "Medium", "₹3L–₹10L", 6, 8],
      ["Telemedicine Platform", "Healthcare", "High", "₹6L–₹16L", 10, 14],
      [
        "Laboratory Information Mgmt System (LIMS)",
        "Healthcare, Diagnostics",
        "High",
        "₹6L–₹18L",
        10,
        15,
      ],
      ["Veterinary Clinic Management", "Healthcare, Pet Care", "Medium", "₹2.5L–₹7L", 5, 8],
    ],
  ],
  [
    "Logistics, Fleet & Field Ops",
    [
      ["Logistics Management", "Logistics, Supply Chain", "High", "₹6L–₹18L", 10, 14],
      ["Fleet Management", "Logistics, Transport", "Medium", "₹4L–₹14L", 8, 12],
      [
        "Warehouse Management System",
        "Retail, Manufacturing, Logistics",
        "Medium",
        "₹5L–₹15L",
        8,
        12,
      ],
      [
        "Field Service Management",
        "Utilities, Maintenance, Logistics",
        "Medium",
        "₹4L–₹12L",
        7,
        10,
      ],
      ["Transport Management System", "Logistics, Transport", "High", "₹5L–₹15L", 9, 13],
      ["Tour & Travel Portal", "Tourism, Hospitality", "Medium", "₹4L–₹12L", 7, 10],
      ["Route & Dispatch Planning", "Logistics, Field Service", "Medium", "₹4L–₹10L", 7, 10],
    ],
  ],
  [
    "Real Estate, Property & Hospitality",
    [
      ["Real Estate Management / CRM", "Real Estate", "Medium", "₹4L–₹12L", 7, 10],
      ["Property Management System", "Real Estate", "Medium", "₹4L–₹12L", 7, 10],
      ["Rental Management", "Real Estate", "Medium", "₹2L–₹8L", 5, 7],
      ["Hotel Management System (PMS)", "Hospitality", "High", "₹5L–₹15L", 9, 13],
      ["Co-working Space Management", "Real Estate, Hospitality", "Medium", "₹3L–₹8L", 6, 9],
      ["Parking Management System", "Real Estate, Smart City", "Medium", "₹3L–₹8L", 6, 9],
      ["Construction Project Management", "Construction, Real Estate", "High", "₹6L–₹16L", 10, 14],
    ],
  ],
  [
    "Retail, Commerce & Marketplaces",
    [
      ["Retail POS", "Retail", "Medium", "₹2L–₹8L", 5, 8],
      ["Restaurant POS", "F&B, Hospitality", "Medium", "₹3L–₹10L", 6, 8],
      ["Marketplace Platform", "Multi-vendor Commerce", "Enterprise", "₹10L–₹30L", 16, 24],
      ["Subscription Box Management", "D2C, Retail", "Medium", "₹3L–₹8L", 6, 9],
      ["Auction Platform", "Marketplaces, Real Estate", "High", "₹6L–₹16L", 10, 14],
      ["Classifieds Platform", "Marketplaces, Real Estate, Auto", "High", "₹5L–₹14L", 9, 13],
      [
        "Multi-location Franchise Management",
        "Retail, F&B, Education",
        "Enterprise",
        "₹8L–₹20L",
        14,
        18,
      ],
    ],
  ],
  [
    "Manufacturing & Production",
    [
      ["Manufacturing Dashboard", "Manufacturing", "Medium", "₹3L–₹10L", 6, 8],
      ["Production Tracking System", "Manufacturing", "Medium", "₹4L–₹12L", 7, 10],
      ["Manufacturing ERP", "Manufacturing", "Enterprise", "₹13L–₹45L", 18, 28],
    ],
  ],
  [
    "Niche & Community Platforms",
    [
      ["Gym & Fitness Management", "Fitness, Wellness", "Basic", "₹2L–₹7L", 4, 6],
      ["Salon & Spa Management", "Beauty, Wellness", "Basic", "₹2L–₹6L", 4, 6],
      ["Event Management Platform", "Events, Hospitality", "Medium", "₹3L–₹10L", 6, 8],
      ["NGO / Trust Management", "Nonprofit", "Medium", "₹2.5L–₹8L", 5, 8],
      ["Legal Case Management", "Legal", "Medium", "₹4L–₹12L", 7, 10],
      ["Feedback & Survey Platform", "All Businesses", "Basic", "₹2L–₹6L", 4, 6],
      [
        "Job Portal / Career Site",
        "HR & Staffing, Recruitment Marketplaces",
        "High",
        "₹5L–₹14L",
        9,
        13,
      ],
      ["Crowdfunding / Donation Platform", "NGOs, Startups", "High", "₹5L–₹14L", 9, 13],
      ["Visitor Management System", "Enterprise, Facilities", "Basic", "₹1.5L–₹4L", 3, 5],
    ],
  ],
  [
    "Enterprise & Bespoke Builds",
    [
      [
        "ERP – Enterprise Resource Planning",
        "Manufacturing, Enterprise",
        "Enterprise",
        "₹15L–₹60L",
        20,
        32,
      ],
      ["Custom Enterprise Platform", "Enterprise", "Enterprise", "₹15L–₹60L", 20, 32],
      ["Custom Business Software", "All Businesses", "High", "₹8L–₹25L", 12, 20],
      [
        "AI Automation Platform (Enterprise-grade)",
        "Enterprise, SaaS",
        "Enterprise",
        "₹8L–₹25L",
        12,
        18,
      ],
    ],
  ],
];

const ADDONS = [
  "Extra Page / Module",
  "WhatsApp Business API Integration",
  "Payment Gateway Integration (Razorpay/Stripe/PayU)",
  "SMS Gateway Integration",
  "ERP / Tally / Accounting Sync",
  "Multi-language Support Pack",
  "Advanced Analytics / BI Dashboard",
  "AI Chatbot Widget Add-on",
  "Native Mobile App Companion",
  "Extra User Roles & Permission Tier",
  "Public API Access for Developers",
  "White-label / Multi-tenant Setup",
  "Extended Post-launch Support (beyond standard 30 days)",
  "Professional Content Writing & SEO Copy",
  "Domain + Hosting + SSL Setup",
  "App Store Deployment & ASO Setup",
  "UI/UX Redesign Only (no new dev)",
  "Speed & Technical SEO Audit + Fix",
];

// ── COMPLEXITY COLOUR MAP ────────────────────────────────────────────────────
const COMPLEXITY_FILL = {
  Basic: { argb: "FFB0BEC5" }, // grey-blue
  Medium: { argb: "FFD4A564" }, // ochre
  High: { argb: "FFC75B3A" }, // terracotta
  Enterprise: { argb: "FF1A1A1A" }, // near-black
};
const COMPLEXITY_FONT_DARK = { color: { argb: "FF1A1A1A" }, bold: true, size: 10 };
const COMPLEXITY_FONT_LIGHT = { color: { argb: "FFFFFFFF" }, bold: true, size: 10 };

function complexityStyle(complexity) {
  const fill = COMPLEXITY_FILL[complexity] || { argb: "FFCCCCCC" };
  const font =
    complexity === "Enterprise" || complexity === "High"
      ? COMPLEXITY_FONT_LIGHT
      : COMPLEXITY_FONT_DARK;
  return { fill: { type: "pattern", pattern: "solid", fgColor: fill }, font };
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function parsePriceRange(str) {
  const m = str.match(/₹([\d.]+)L[–\-]₹([\d.]+)L/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : [0, 0];
}
function maintRange(priceStr) {
  const [mn, mx] = parsePriceRange(priceStr);
  const lo = Math.round(mn * 0.15 * 100) / 100;
  const hi = Math.round(mx * 0.25 * 100) / 100;
  return `₹${lo}L – ₹${hi}L / yr`;
}
const SLA_BY_TIER = {
  Basic: "3 business days",
  Medium: "2 business days",
  High: "1 business day",
  Enterprise: "Same-day (priority)",
};

// ── STYLES ───────────────────────────────────────────────────────────────────
const BRAND_PINK = "FFC75B3A";
const BRAND_BG = "FFFAF7F2";
const MUTED_BG = "FFF0EAE0";
const BORDER_COLOR = "FFE5DDD3";
const TEAL = "FF4B6E6A";

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
const HEADER_FONT = { color: { argb: "FFFFFFFF" }, bold: true, size: 9.5 };
const GROUP_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_PINK } };
const GROUP_FONT = { color: { argb: "FFFFFFFF" }, bold: true, size: 10 };
const SECTION_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
const SECTION_FONT = { color: { argb: "FFFFFFFF" }, bold: true, size: 13 };
const BLANK_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF9F0" } };

function applyBorder(row) {
  row.eachCell((cell) => {
    cell.border = {
      bottom: { style: "thin", color: { argb: BORDER_COLOR } },
      right: { style: "thin", color: { argb: BORDER_COLOR } },
    };
  });
}

function addSectionHeader(ws, title, colCount) {
  ws.addRow([]);
  const r = ws.addRow([title]);
  ws.mergeCells(r.number, 1, r.number, colCount);
  r.getCell(1).fill = SECTION_FILL;
  r.getCell(1).font = SECTION_FONT;
  r.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  r.height = 28;
}

function addColumnHeaders(ws, headers) {
  const r = ws.addRow(headers);
  r.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      bottom: { style: "medium", color: { argb: BRAND_PINK } },
      right: { style: "thin", color: { argb: BORDER_COLOR } },
    };
  });
  r.height = 22;
  return r;
}

function addGroupHeader(ws, title, colCount) {
  const r = ws.addRow([title]);
  ws.mergeCells(r.number, 1, r.number, colCount);
  r.getCell(1).fill = GROUP_FILL;
  r.getCell(1).font = GROUP_FONT;
  r.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  r.height = 20;
}

function addDataRows(ws, rows, isEven = false) {
  rows.forEach((r, i) => {
    const [name, industries, complexity, marketPrice, wkMin, wkMax] = r;
    const maint = maintRange(marketPrice);
    const rowData = [
      name,
      industries,
      complexity,
      marketPrice,
      `${wkMin}–${wkMax} wks`,
      maint,
      "",
      "",
      "", // Orvion Price, Orvion Delivery, Orvion Maint/yr
    ];
    const row = ws.addRow(rowData);
    const bg =
      i % 2 === 0
        ? { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
        : { type: "pattern", pattern: "solid", fgColor: { argb: MUTED_BG } };

    row.eachCell((cell, colIdx) => {
      cell.fill = bg;
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        bottom: { style: "thin", color: { argb: BORDER_COLOR } },
        right: { style: "thin", color: { argb: BORDER_COLOR } },
      };
      cell.font = { size: 10 };
    });
    // Complexity badge style
    const cCell = row.getCell(3);
    Object.assign(cCell, complexityStyle(complexity));
    cCell.alignment = { vertical: "middle", horizontal: "center" };
    // Market price bold mono
    row.getCell(4).font = { bold: true, size: 10 };
    // Orvion blank cells highlight
    [7, 8, 9].forEach((ci) => {
      row.getCell(ci).fill = BLANK_FILL;
      row.getCell(ci).font = { color: { argb: "FFCCBBAA" }, italic: true, size: 9 };
      row.getCell(ci).value = "— fill in —";
    });
    row.height = 18;
  });
}

// ── BUILD WORKBOOK ────────────────────────────────────────────────────────────
const wb = new ExcelJS.Workbook();
wb.creator = "Orvion Studio";
wb.created = new Date();

// Column definitions shared across sheets
const MAIN_COLS = [
  { header: "Category / Service", key: "cat", width: 40 },
  { header: "Industries", key: "ind", width: 28 },
  { header: "Complexity", key: "comp", width: 12 },
  { header: "Market Price", key: "mktprice", width: 18 },
  { header: "Market Delivery", key: "mktdel", width: 15 },
  { header: "Market Maint / yr", key: "mktmaint", width: 18 },
  { header: "ORVION Price", key: "orvprice", width: 18 },
  { header: "ORVION Delivery", key: "orvdel", width: 15 },
  { header: "ORVION Maint / yr", key: "orvmaint", width: 18 },
];

// ── SHEET 1: Website ─────────────────────────────────────────────────────────
{
  const ws = wb.addWorksheet("01 — Website");
  ws.columns = MAIN_COLS;
  addSectionHeader(ws, "01 — Website Development", 9);
  addColumnHeaders(
    ws,
    MAIN_COLS.map((c) => c.header),
  );
  addDataRows(ws, WEBSITE);
  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SHEET 2: Mobile ──────────────────────────────────────────────────────────
{
  const ws = wb.addWorksheet("02 — Mobile Apps");
  ws.columns = MAIN_COLS;
  addSectionHeader(ws, "02 — Mobile App Development", 9);
  addColumnHeaders(
    ws,
    MAIN_COLS.map((c) => c.header),
  );
  addDataRows(ws, MOBILE);
  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SHEET 3: Automation ──────────────────────────────────────────────────────
{
  const ws = wb.addWorksheet("03 — Automation");
  ws.columns = MAIN_COLS;
  addSectionHeader(ws, "03 — Automation", 9);
  addColumnHeaders(
    ws,
    MAIN_COLS.map((c) => c.header),
  );
  addDataRows(ws, AUTOMATION);
  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SHEET 4: SaaS / Custom Software ─────────────────────────────────────────
{
  const ws = wb.addWorksheet("04 — SaaS & Custom Software");
  ws.columns = MAIN_COLS;
  addSectionHeader(ws, "04 — SaaS & Custom Business Software", 9);
  SAAS.forEach(([groupName, items]) => {
    addGroupHeader(ws, groupName, 9);
    addColumnHeaders(
      ws,
      MAIN_COLS.map((c) => c.header),
    );
    addDataRows(ws, items);
    ws.addRow([]);
  });
  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SHEET 5: Maintenance ──────────────────────────────────────────────────────
{
  const ws = wb.addWorksheet("05 — Maintenance");
  ws.columns = [
    { header: "Category / Service", key: "cat", width: 40 },
    { header: "Complexity", key: "comp", width: 12 },
    { header: "Recommended Tier", key: "tier", width: 18 },
    { header: "Market Maint / yr", key: "mmaint", width: 20 },
    { header: "Market SLA", key: "msla", width: 20 },
    { header: "ORVION Maint / yr", key: "omaint", width: 20 },
    { header: "ORVION SLA", key: "osla", width: 20 },
  ];

  const CARE_BY_TIER = {
    Basic: "Basic Care",
    Medium: "Standard Care",
    High: "Premium Care",
    Enterprise: "Premium Care",
  };
  const SLA_MAP = {
    Basic: "3 business days",
    Medium: "2 business days",
    High: "1 business day",
    Enterprise: "Same-day (priority)",
  };

  function addMaintSection(title, rows) {
    ws.addRow([]);
    const hdr = ws.addRow([title]);
    ws.mergeCells(hdr.number, 1, hdr.number, 7);
    hdr.getCell(1).fill = SECTION_FILL;
    hdr.getCell(1).font = SECTION_FONT;
    hdr.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    hdr.height = 26;

    const colHdr = ws.addRow([
      "Category / Service",
      "Complexity",
      "Recommended Tier",
      "Market Maint / yr",
      "Market SLA",
      "ORVION Maint / yr",
      "ORVION SLA",
    ]);
    colHdr.eachCell((cell) => {
      cell.fill = HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: "middle", wrapText: true };
    });
    colHdr.height = 20;

    rows.forEach((r, i) => {
      const bg =
        i % 2 === 0
          ? { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
          : { type: "pattern", pattern: "solid", fgColor: { argb: MUTED_BG } };
      const row = ws.addRow([
        r[0],
        r[2],
        CARE_BY_TIER[r[2]],
        maintRange(r[3]),
        SLA_MAP[r[2]],
        "— fill in —",
        "— fill in —",
      ]);
      row.eachCell((cell) => {
        cell.fill = bg;
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.font = { size: 10 };
      });
      Object.assign(row.getCell(2), complexityStyle(r[2]));
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
      [6, 7].forEach((ci) => {
        row.getCell(ci).fill = BLANK_FILL;
        row.getCell(ci).font = { color: { argb: "FFCCBBAA" }, italic: true, size: 9 };
      });
      row.height = 18;
    });
  }

  addSectionHeader(ws, "05 — Maintenance Plans (Per Category)", 7);
  addMaintSection("Website Development", WEBSITE);
  addMaintSection("Mobile App Development", MOBILE);
  addMaintSection("Automation", AUTOMATION);
  SAAS.forEach(([groupName, items]) => addMaintSection(groupName, items));

  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SHEET 6: Add-ons ─────────────────────────────────────────────────────────
{
  const ws = wb.addWorksheet("06 — Add-ons");
  ws.columns = [
    { header: "Add-on Name", key: "name", width: 48 },
    { header: "ORVION Price", key: "price", width: 24 },
    { header: "Notes / Scope", key: "notes", width: 40 },
  ];
  addSectionHeader(ws, "06 — Add-ons Menu", 3);
  addColumnHeaders(ws, ["Add-on Name", "ORVION Price", "Notes / Scope"]);
  ADDONS.forEach((addon, i) => {
    const bg =
      i % 2 === 0
        ? { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
        : { type: "pattern", pattern: "solid", fgColor: { argb: MUTED_BG } };
    const row = ws.addRow([addon, "— fill in —", ""]);
    row.eachCell((cell) => {
      cell.fill = bg;
      cell.alignment = { vertical: "middle" };
      cell.font = { size: 10 };
    });
    row.getCell(2).fill = BLANK_FILL;
    row.getCell(2).font = { color: { argb: "FFCCBBAA" }, italic: true, size: 9 };
    row.height = 18;
  });
  ws.views = [{ state: "frozen", ySplit: 3 }];
}

// ── SAVE ─────────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, "Orvion-Pricing-Matrix.xlsx");
await wb.xlsx.writeFile(outPath);
console.log("✓ Saved:", outPath);
