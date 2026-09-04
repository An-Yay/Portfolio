import { useEffect, useRef, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";
import "./Cursor.scss";

/**
 * Context-aware custom cursor.
 *
 * Only mounts on devices with a real pointer, and never hides the native
 * cursor globally — if this fails, the OS cursor is still there. Elements
 * opt into a label by setting `data-cursor="View"`.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [variant, setVariant] = useState<"default" | "hover" | "down">(
    "default"
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    // The ring trails the dot with easing for a bit of weight.
    const tick = () => {
      const ease = reduced ? 1 : 0.18;
      ringX += (targetX - ringX) * ease;
      ringY += (targetY - ringY) * ease;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const interactive =
      'a, button, [role="button"], input, textarea, select, summary, [data-cursor]';

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(interactive) as
        | HTMLElement
        | null;
      if (el) {
        setVariant("hover");
        setLabel(el.dataset.cursor ?? null);
      } else {
        setVariant("default");
        setLabel(null);
      }
    };

    const onDown = () => setVariant("down");
    const onUp = () => setVariant("default");
    const onLeave = () => document.body.classList.add("cursor-hidden");
    const onEnter = () => document.body.classList.remove("cursor-hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    document.body.classList.add("has-custom-cursor");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.body.classList.remove("has-custom-cursor", "cursor-hidden");
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  return (
    <div className="cursor-root" aria-hidden="true">
      <div className="cursor-dot" ref={dotRef} />
      <div
        className={`cursor-ring cursor-ring--${variant}${
          label ? " cursor-ring--labelled" : ""
        }`}
        ref={ringRef}
      >
        {label && <span className="cursor-ring__label">{label}</span>}
      </div>
    </div>
  );
}
