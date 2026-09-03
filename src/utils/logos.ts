/**
 * Auto-discovers company logos from `src/assets/logos`.
 *
 * Any `.svg`, `.png`, or `.webp` file dropped in that folder becomes
 * available under its filename slug — no code change needed. Missing
 * logos fall back to a tinted monogram at the component level.
 */

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const monogram = (value: string) =>
  value
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const BRAND: Record<string, string> = {
  philips: "#0B5ED7",
  "avl-india-software": "#E2001A",
  "bar-code-india": "#F26522",
  houzie: "#7C3AED",
};

export const brandColor = (slug: string) => BRAND[slug] ?? "var(--accent)";

function loadLogos(): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const context = (require as any).context(
      "../assets/logos",
      false,
      /\.(svg|png|webp)$/
    );
    context.keys().forEach((key: string) => {
      const slug = key
        .replace(/^\.\//, "")
        .replace(/\.(svg|png|webp)$/, "")
        .toLowerCase();
      const mod = context(key);
      map[slug] = mod?.default ?? mod;
    });
  } catch {
    // Folder absent or bundler without require.context: monograms render instead.
  }
  return map;
}

export const companyLogos: Record<string, string> = loadLogos();
