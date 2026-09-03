export interface SocialLink {
  id: string;
  label: string;
  href: string;
  handle: string;
}

export const profile = {
  name: "Ananay Gupta",
  /** Short role line used in the hero */
  role: "AI & Full-Stack Engineer",
  /** Long-form positioning, used in meta description and the manifest section */
  tagline:
    "SDE at Philips, architecting SENSEI — a multi-agent platform driving €15M+ in annual revenue. I build production AI, not demos.",
  bio: "SDE 1 on the Intelligent Systems & AI team at Philips, where I architect multi-agent LLM platforms and the MCP infrastructure behind them. Before this I co-founded a real-estate startup, wrote a CDN from scratch, and shipped IIOT dashboards. AWS Certified Solutions Architect and DevOps Engineer.",
  location: "Delhi NCR, India",
  email: "ananaygupta23@gmail.com",
  phone: "+91-8130781382",
  siteUrl: "https://ananaygupta.dev",
  availability: "Open to conversations",
  resumeFileName: "Ananay_Gupta_Resume.pdf",
  /** Square portrait, shown in the hero. Lives in src/assets/images. */
  avatar: "avatar",
} as const;

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/An-Yay",
    handle: "@An-Yay",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/ananay-g/",
    handle: "ananay-g",
  },
  {
    id: "twitter",
    label: "Twitter",
    href: "https://twitter.com/_An_yay",
    handle: "@_An_yay",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/918130781382",
    handle: "Message me",
  },
];

export interface EducationItem {
  id: string;
  institution: string;
  qualification: string;
  detail: string;
  score: string;
  start: string;
  end: string;
}

export const education: EducationItem[] = [
  {
    id: "vit",
    institution: "VIT Vellore",
    qualification: "B.Tech, Computer Science",
    detail: "Bachelor of Technology",
    score: "8.39 CGPA",
    start: "2021",
    end: "2025",
  },
  {
    id: "dps",
    institution: "DPS Vasant Kunj",
    qualification: "High School — PCM with Python",
    detail: "Physics, Chemistry, Maths, Computer Science",
    score: "87.4%",
    start: "2018",
    end: "2021",
  },
];

export interface Award {
  id: string;
  title: string;
  detail: string;
  year?: string;
}

export const awards: Award[] = [
  {
    id: "devjam",
    title: "3rd Place — DevJam22 VIT",
    detail:
      "MLH-sponsored 24-hour hackathon. Team placed 3rd and won a ₹50,000 cash prize.",
    year: "2022",
  },
  {
    id: "debate",
    title: "7 Medals — International Debate",
    detail:
      "Represented India at Yale University and the World Scholar's Cup in Malaysia.",
  },
  {
    id: "aws",
    title: "AWS Certified",
    detail: "Solutions Architect and DevOps Engineer.",
  },
];

/** Headline stats for the about section. */
export const stats = [
  { id: "revenue", value: "€15M+", label: "Revenue driven", accent: "green" },
  { id: "savings", value: "€400K", label: "Cost saved annually", accent: "blue" },
  { id: "experience", value: "3+", label: "Years shipping", accent: "purple" },
  { id: "leetcode", value: "100+", label: "LeetCode solved", accent: "orange" },
] as const;
