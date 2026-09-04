import { useEffect, useRef } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";
import "./Spotlight.scss";

/**
 * Cursor-following radial wash. Writes CSS custom properties via rAF so
 * pointer moves never trigger a React render.
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * 100;
      py = ((e.clientY - rect.top) / rect.height) * 100;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--spot-x", `${px}%`);
        el.style.setProperty("--spot-y", `${py}%`);
        el.style.setProperty("--spot-opacity", "1");
        frame = 0;
      });
    };

    const onLeave = () => el.style.setProperty("--spot-opacity", "0");

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return <div className="spotlight" ref={ref} aria-hidden="true" />;
}
