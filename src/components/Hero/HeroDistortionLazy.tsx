import { Suspense, lazy, useEffect, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

// three.js + R3F are heavy, so this whole subtree is code-split and only
// fetched once we've decided the client should actually render it.
const HeroDistortion = lazy(() => import("./HeroDistortion"));

const DESKTOP_MIN = 900; // px — below this we skip the 3D layer entirely.

/**
 * Decides whether to load the WebGL distortion at all:
 *  - never with prefers-reduced-motion
 *  - never on small screens (cost/benefit isn't worth it on phones)
 *  - only after the browser is idle, so first paint stays fast
 *
 * When it opts out, nothing renders and the hero's CSS backdrop stands alone.
 */
export default function HeroDistortionLazy() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;

    const wideEnough = window.matchMedia(
      `(min-width: ${DESKTOP_MIN}px)`
    ).matches;
    if (!wideEnough) return;

    // Defer to idle time so the 3D bundle never competes with first paint.
    const idle = (
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as never), 200))
    )(() => setEnabled(true));

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <HeroDistortion />
    </Suspense>
  );
}
