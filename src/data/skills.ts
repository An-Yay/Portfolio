export type SkillLevel = "core" | "strong" | "working";

export interface Skill {
  name: string;
  /** Slug for simple-icons, resolved at render time. */
  icon: string;
  level: SkillLevel;
  /** Optional brand colour override; falls back to the icon's own brand colour. */
  color?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  caption: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    label: "AI & Agents",
    caption: "What I build with day to day",
    skills: [
      { name: "Strands Agents", icon: "amazonaws", level: "core" },
      { name: "AWS AgentCore", icon: "amazonaws", level: "core" },
      { name: "MCP", icon: "anthropic", level: "core" },
      { name: "Claude", icon: "anthropic", level: "core" },
      { name: "RAG", icon: "openai", level: "strong" },
      { name: "LangChain", icon: "langchain", level: "working" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    caption: "Typed, scripted, and compiled",
    skills: [
      { name: "TypeScript", icon: "typescript", level: "core" },
      { name: "Python", icon: "python", level: "core" },
      { name: "JavaScript", icon: "javascript", level: "core" },
      { name: "C++", icon: "cplusplus", level: "strong" },
      { name: "Java", icon: "openjdk", level: "strong" },
      { name: "SQL", icon: "postgresql", level: "strong" },
      { name: "Bash", icon: "gnubash", level: "working" },
      { name: "Kotlin", icon: "kotlin", level: "working" },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    caption: "Front of the stack and back",
    skills: [
      { name: "React", icon: "react", level: "core" },
      { name: "Next.js", icon: "nextdotjs", level: "core" },
      { name: "Node.js", icon: "nodedotjs", level: "core" },
      { name: "React Native", icon: "react", level: "strong" },
      { name: "NestJS", icon: "nestjs", level: "strong" },
      { name: "Express", icon: "express", level: "strong" },
    ],
  },
  {
    id: "infra",
    label: "Cloud & Infra",
    caption: "AWS Certified — Solutions Architect, DevOps Engineer",
    skills: [
      { name: "AWS", icon: "amazonaws", level: "core" },
      { name: "Docker", icon: "docker", level: "core" },
      { name: "PostgreSQL", icon: "postgresql", level: "strong" },
      { name: "Supabase", icon: "supabase", level: "strong" },
      { name: "DigitalOcean", icon: "digitalocean", level: "working" },
      { name: "Terraform", icon: "terraform", level: "working" },
    ],
  },
  {
    id: "craft",
    label: "Craft & Tooling",
    caption: "How the work gets made and shipped",
    skills: [
      { name: "Git", icon: "git", level: "core" },
      { name: "GitHub", icon: "github", level: "core" },
      { name: "Framer Motion", icon: "framer", level: "strong" },
      { name: "Sass", icon: "sass", level: "strong" },
      { name: "Tailwind CSS", icon: "tailwindcss", level: "strong" },
      { name: "Figma", icon: "figma", level: "working" },
    ],
  },
];

export const levelLabel: Record<SkillLevel, string> = {
  core: "Core",
  strong: "Strong",
  working: "Working",
};
