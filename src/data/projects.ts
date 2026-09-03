export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "live" | "case-study";
}

export interface Project {
  id: string;
  title: string;
  /** Short hook, shown on the card */
  blurb: string;
  /** The problem this solves */
  problem: string;
  /** How it was built / the interesting technical decision */
  approach: string;
  /** What came out of it */
  outcome: string;
  stack: string[];
  /** Filename (no extension) in src/assets/images, or null for a generated cover */
  cover: string | null;
  year: string;
  featured: boolean;
  award?: string;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: "pokeem",
    title: "Poke'Em",
    blurb:
      "Social accountability for screen time — let friends nudge you off the apps you over-use.",
    problem:
      "Screen-time dashboards tell you that you wasted three hours, but they tell you after the fact and nobody else ever sees it. There is no social cost to doomscrolling.",
    approach:
      "A React Native app where you mark the apps you want to cut down on. Friends can send a 'poke' when your usage crosses a threshold, turning a private stat into a lightweight social signal. Firebase handles auth, presence, and push delivery.",
    outcome:
      "Won a hackathon. The poke mechanic turned out to be the whole product — accountability landed harder than any chart.",
    stack: ["React Native", "React.js", "Expo", "Firebase"],
    cover: null,
    year: "2023",
    featured: true,
    award: "Hackathon winner",
    links: [{ label: "Source", href: "https://github.com/An-Yay", kind: "repo" }],
  },
  {
    id: "vit-id",
    title: "Vit-ID",
    blurb:
      "An NFC and ML-driven campus social network for VIT students.",
    problem:
      "Campus identity was a plastic card and campus social life was scattered across WhatsApp groups. Neither talked to the other.",
    approach:
      "An Android app in Kotlin that reads student NFC cards and scans ID images, backed by a Python ML service for recognition and a Node.js API for the social graph. Chat, groups, and sharing sit on top of verified campus identity.",
    outcome:
      "Verified identity as the primitive meant no fake accounts — the social features could assume everyone was a real student.",
    stack: ["Kotlin", "Python", "Node.js", "NFC", "ML"],
    cover: null,
    year: "2023",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/An-Yay", kind: "repo" }],
  },
  {
    id: "j-mart",
    title: "J-Mart",
    blurb:
      "A distributed marketplace where you rent out spare compute and get paid for it.",
    problem:
      "Most personal machines idle most of the day while people who need compute for short bursts pay cloud prices for it.",
    approach:
      "Volunteers run Worker.js in a browser tab to contribute cycles. Socket.js coordinates job distribution and result collection, and an incentive layer credits contributors per completed unit of work.",
    outcome:
      "Proved that a browser tab is a viable compute node for embarrassingly parallel work, with zero install friction.",
    stack: ["React.js", "Worker.js", "Socket.js"],
    cover: null,
    year: "2022",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/An-Yay", kind: "repo" }],
  },
  {
    id: "houzie",
    title: "Houzie",
    blurb:
      "Real-estate platform that replaced agents' paper ledgers with video-first property discovery.",
    problem:
      "Property agents tracked listings and clients in physical ledgers. Buyers got static photo galleries that told them almost nothing about a space.",
    approach:
      "A Next.js web app and React Native mobile client over a NestJS API, with Supabase for data and auth and Twilio for agent-to-client comms. Video walkthroughs replaced photo grids as the primary listing format.",
    outcome:
      "Digitised the end-to-end agent workflow, from listing intake to client follow-up, and shipped to real agents.",
    stack: [
      "Next.js",
      "NestJS",
      "React Native",
      "Supabase",
      "Twilio",
      "DigitalOcean",
    ],
    cover: null,
    year: "2021—24",
    featured: false,
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
