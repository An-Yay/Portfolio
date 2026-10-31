export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; language?: string; code: string };

interface BlogPostBase {
  /** Stable URL-friendly identifier, e.g. "building-an-agent" */
  slug: string;
  title: string;
  excerpt: string;
  /** ISO YYYY-MM-DD date used for sorting and <time> metadata */
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  featured?: boolean;
}

export type BlogPost = BlogPostBase &
  (
    | {
        /** Used for posts that open inside this portfolio. */
        content: BlogBlock[];
        href?: never;
      }
    | {
        /** Use this to link to a post published somewhere else. */
        href: string;
        content?: never;
      }
  );

/**
 * Add published posts here. Newest posts are shown first automatically.
 *
 * Example:
 * {
 *   slug: "what-i-learned-building-agents",
 *   title: "What I learned building agents",
 *   excerpt: "The practical lessons that changed how I design AI systems.",
 *   publishedAt: "2026-10-22",
 *   readingMinutes: 6,
 *   tags: ["AI", "Engineering"],
 *   featured: true,
 *   content: [
 *     { type: "paragraph", text: "Your opening paragraph." },
 *     { type: "heading", text: "A useful section" },
 *     { type: "paragraph", text: "The rest of your article." },
 *   ],
 * },
 *
 * Everything committed here is public. Keep unfinished or private drafts
 * outside this repository until they are ready to publish.
 */
export const posts: BlogPost[] = [];

export const publishedPosts = [...posts].sort(
  (a, b) =>
    new Date(`${b.publishedAt}T00:00:00Z`).getTime() -
    new Date(`${a.publishedAt}T00:00:00Z`).getTime()
);
