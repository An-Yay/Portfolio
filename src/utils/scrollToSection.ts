/**
 * Smooth-scrolls to a section, honouring reduced-motion, then moves focus
 * there so keyboard and screen-reader users follow the jump.
 */
export default function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });

  // Make the landing point focusable without adding it to the tab order.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
