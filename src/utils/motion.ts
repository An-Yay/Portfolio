import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary. Distances are deliberately small — the old
 * 300–400px springs read as jarring and fight `prefers-reduced-motion`.
 */

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 24,
};

/** Fade + lift. The workhorse for section content. */
export const rise = (delay = 0, distance = 24): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay },
  },
});

export const fade = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOut, delay } },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, delay },
  },
});

/** Parent that staggers its children. Pair with `riseChild`. */
export const stagger = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const riseChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

/** Static variants for reduced-motion: same states, no transform. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
};

/** Picks the real variants or the flat ones based on the user's preference. */
export const pick = (variants: Variants, reduced: boolean): Variants =>
  reduced ? staticVariants : variants;

/** Standard in-view config so sections animate once, at a sane threshold. */
export const inView = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.2 },
};
