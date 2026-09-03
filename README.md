# Portfolio — Ananay Gupta

Personal site. React 18 + TypeScript + SCSS, animated with Framer Motion.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in your EmailJS values
npm start                    # http://localhost:3000
npm run build                # production bundle in ./build
```

## Architecture

Content is data-driven. To change what the site says, edit files in `src/data` — you should rarely need to touch a component.

```
src/
  data/            Content. Edit these to update the site.
    profile.ts       Name, bio, socials, education, awards, headline stats
    experience.ts    Work history — drives the Experience timeline
    projects.ts      Case studies (problem / approach / outcome)
    skills.ts        Grouped tech with proficiency levels
    navigation.ts    Nav items and section ids
  styles/
    _tokens.scss     Design tokens. Dark mode lives here, keyed off [data-theme]
    _mixins.scss     Breakpoints, type presets, focus rings, glass/card surfaces
    global.scss      Reset, base elements, utilities
  store/
    AppContext.tsx   Theme, sound, palette/menu state. Persists to localStorage.
  hooks/             useSound, useActiveSection, useReducedMotion
  utils/             motion presets, scrollToSection, logo resolution
  components/
    ui/              Shared primitives (SectionHeader, TechIcon, Spotlight, …)
```

### Theming

Dark mode is a single `data-theme` attribute on `<html>`. Components never
branch on theme — they consume semantic CSS custom properties
(`var(--bg-elevated)`, `var(--text-primary)`) that resolve per theme.

An inline script in `public/index.html` applies the stored theme before first
paint, so there's no flash of the wrong theme. The site follows the OS
preference until you explicitly pick a theme.

### Motion

All animation flows through `src/utils/motion.ts`. Wrap variants in `pick(…, reduced)`
so `prefers-reduced-motion` collapses transforms to a no-op rather than merely
shortening them. `global.scss` has a CSS-level backstop as well.

## Adding content

**A job:** append to `experience` in `src/data/experience.ts`. Set `end: null`
for your current role — it gets the live badge and pulse. Lead each highlight
with the outcome and a number where you have one.

**A project:** append to `projects` in `src/data/projects.ts`. Fill
`problem` / `approach` / `outcome`; those become the case study dialog.
Set `featured: true` to surface it in the grid.

**A company logo:** drop an SVG into `src/assets/logos/` named after the
company slug (`philips.svg`, `avl-india-software.svg`). It's picked up
automatically. Until then a tinted monogram renders in its place.

## Keyboard

| Shortcut        | Action                     |
| --------------- | -------------------------- |
| `⌘K` / `Ctrl+K` | Command palette            |
| `↑` `↓`         | Move through results       |
| `↵`             | Run the selected command   |
| `Esc`           | Close palette / dialog     |
| `Tab`           | Skip link is the first stop |

## Notes

- `REACT_APP_*` vars are inlined into the client bundle at build time. The
  EmailJS public key is meant to be public, but restrict allowed origins and
  enable rate limiting in the EmailJS dashboard.
- `public/social-preview.png` (1200×630) is referenced by the OG and Twitter
  tags and still needs to be added.
