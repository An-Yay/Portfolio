export type EmploymentType =
  | "full-time"
  | "internship"
  | "founder"
  | "freelance";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  team?: string;
  location: string;
  type: EmploymentType;
  /** ISO-ish YYYY-MM, used for sorting and <time> attributes */
  start: string;
  /** null === present */
  end: string | null;
  /** One-line positioning statement. Keep under ~150 chars. */
  summary: string;
  /** Impact-first bullets. Lead with the outcome, then the how. */
  highlights: string[];
  /** Headline metrics rendered as stat chips */
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** Company site or relevant link */
  href?: string;
}

export const experience: ExperienceItem[] = [
  {
    id: "philips-sde1",
    company: "Philips",
    role: "SDE 1",
    team: "Intelligent Systems & Artificial Intelligence",
    location: "Chennai / Bengaluru, IN",
    type: "full-time",
    start: "2026-02",
    end: null,
    summary:
      "Architecting SENSEI, Philips' first profitable Agentic AI platform in North America.",
    highlights: [
      "Architecting and leading development of SENSEI, Philips' first profitable Agentic AI platform in North America, generating €15M+ in annual revenue through multi-agent LLM systems, custom MCP infrastructure, and enterprise workflow automation for imaging device sales.",
      "Cut imaging device deal turnaround from 3 weeks to 2 days by building the platform on React, Node.js, AWS, Strands Agents, MCP, and RAG.",
      "Built AI observability and agent analytics for multi-layer agent systems with end-to-end tracing, log analysis, and performance evaluation.",
      "Mentoring 3 interns while co-driving enterprise AI process transformation with the Chief Innovation Officer.",
    ],
    metrics: [
      { value: "€15M+", label: "Annual revenue" },
      { value: "3wk → 2d", label: "Deal turnaround" },
      { value: "3", label: "Interns mentored" },
    ],
    stack: [
      "React",
      "Node.js",
      "AWS",
      "Strands Agents",
      "MCP",
      "RAG",
      "TypeScript",
      "Python",
    ],
    href: "https://www.philips.com",
  },
  {
    id: "philips-innovation-engineer",
    company: "Philips",
    role: "Innovation Engineer 1",
    team: "Innovation & Automation",
    location: "Chennai, IN",
    type: "full-time",
    start: "2025-07",
    end: "2026-02",
    summary:
      "Shipped agentic order automation for the North America MR machine market.",
    highlights: [
      "Shipped an end-to-end Agentic MR machine order automation platform for the North America market, eliminating manual workflows and delivering €400K in annual cost savings.",
      "Built with AWS AgentCore, Claude, and Python, replacing a multi-step human handoff process with an autonomous agent pipeline.",
    ],
    metrics: [{ value: "€400K", label: "Annual savings" }],
    stack: ["AWS AgentCore", "Claude", "Python", "Agentic AI"],
    href: "https://www.philips.com",
  },
  {
    id: "philips-sde-intern",
    company: "Philips",
    role: "SDE Intern",
    team: "Innovation & Automation",
    location: "Chennai, IN",
    type: "internship",
    start: "2025-01",
    end: "2025-07",
    summary:
      "Built a real-time OCR translation tool adopted across multilingual workflows.",
    highlights: [
      "Built a real-time translation tool with OCR support for text and documents, embedded directly into Outlook and the browser.",
      "Adopted across multilingual workflows at Philips, removing copy-paste round trips for non-English documentation.",
    ],
    stack: ["Python", "OCR", "Outlook Add-in", "JavaScript"],
    href: "https://www.philips.com",
  },
  {
    id: "avl-india",
    company: "AVL India Software",
    role: "SDE Intern",
    location: "Gurugram, IN",
    type: "internship",
    start: "2023-08",
    end: "2023-11",
    summary:
      "Modernised the Daksh IIOT dashboards off legacy AngularJS and owned AWS releases.",
    highlights: [
      "Developed production-grade React.js dashboards for Daksh IIOT, replacing legacy AngularJS modules.",
      "Managed AWS-based deployment and releases, and resolved critical bugs across frontend and PostgreSQL-backed services.",
    ],
    stack: ["React.js", "AWS", "PostgreSQL", "JavaScript"],
    href: "https://www.avl.com",
  },
  {
    id: "barcode-india",
    company: "Bar Code India",
    role: "Backend Intern",
    location: "Pune, IN",
    type: "internship",
    start: "2023-05",
    end: "2023-08",
    summary:
      "Wrote a CDN from scratch in Python and wired IoT devices into backend ML systems.",
    highlights: [
      "Built a CDN in Python from scratch, handling high-volume traffic and improving content delivery performance by 10%.",
      "Built a scalable React + Node.js fullstack solution integrating IoT devices with backend ML systems for real-time analytics.",
    ],
    metrics: [{ value: "+10%", label: "Delivery performance" }],
    stack: ["Python", "React", "Node.js", "IoT", "ML"],
  },
  {
    id: "houzie",
    company: "Houzie",
    role: "Co-founder",
    location: "Delhi NCR, IN",
    type: "founder",
    start: "2021-08",
    end: "2024-01",
    summary:
      "Co-founded a web and mobile real-estate platform digitising agent workflows.",
    highlights: [
      "Co-founded Houzie, a web and mobile real-estate platform that replaced manual ledgers for property agents and enabled property discovery via video.",
      "Built and shipped the full stack: Next.js and React Native clients, a NestJS API, Supabase for data, Twilio for comms, deployed on DigitalOcean.",
    ],
    stack: [
      "Next.js",
      "NestJS",
      "React Native",
      "Supabase",
      "Twilio",
      "DigitalOcean",
    ],
  },
];

/** Formats a YYYY-MM token into "Mon YYYY". `null` renders as "Present". */
export const formatPeriod = (value: string | null): string => {
  if (!value) return "Present";
  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

/** Human-readable duration, e.g. "1 yr 3 mos". */
export const formatDuration = (
  start: string,
  end: string | null,
  now: Date = new Date()
): string => {
  const [sy, sm] = start.split("-").map(Number);
  const endDate = end
    ? (() => {
        const [ey, em] = end.split("-").map(Number);
        return new Date(ey, (em ?? 1) - 1, 1);
      })()
    : now;

  const months =
    (endDate.getFullYear() - sy) * 12 + (endDate.getMonth() - ((sm ?? 1) - 1));
  const total = Math.max(1, months);
  const years = Math.floor(total / 12);
  const rem = total % 12;

  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ");
};

export const typeLabel: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  internship: "Internship",
  founder: "Founder",
  freelance: "Freelance",
};
